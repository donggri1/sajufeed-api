import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AiProvider } from '../interfaces/ai-provider.interface';
import { FileStorageUtil } from '../../utils/file-storage.util';

@Injectable()
export class GeminiProvider implements AiProvider {
    private readonly logger = new Logger(GeminiProvider.name);
    private genAI: GoogleGenerativeAI;
    private textModel: GenerativeModel;
    private imageModel: GenerativeModel;

    constructor(
        private configService: ConfigService,
        private fileStorageUtil: FileStorageUtil,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            this.logger.error('GEMINI_API_KEY is not defined in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.textModel = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
        this.imageModel = this.genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' });
    }

    async analyzeSaju(prompt: string): Promise<string> {
        return this.retryOperation(() => this.analyzeSajuMain(prompt));
    }

    private async analyzeSajuMain(prompt: string): Promise<string> {
        try {
            const result = await this.textModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            throw error;
        }
    }

    private async retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3, delay: number = 2000): Promise<T> {
        let lastError: any;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                // 429 Too Many Requests 상태 코드 확인 (GoogleGenerativeAI 에러 메시지를 통해)
                const isRateLimit = error.message.includes('429') || error.message.includes('Too Many Requests');

                if (isRateLimit && i < maxRetries - 1) {
                    const waitTime = delay * Math.pow(2, i); // 2초, 4초, 8초... 지수 백오프
                    this.logger.warn(`Gemini API Rate Limit (429) 감지. ${waitTime}ms 후 재시도합니다... (${i + 1}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }

                // Rate Limit이 아니거나 재시도 횟수 초과 시 에러 던짐
                throw error;
            }
        }
        throw lastError;
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            // gemini-3-pro-image-preview 모델은 요청을 보내면 이미지를 생성하여 Base64로 반환합니다.
            const result = await this.imageModel.generateContent(prompt);
            const candidates = result.response.candidates;

            if (!candidates || candidates.length === 0) {
                throw new Error('No candidates returned from Gemini');
            }

            const parts = candidates[0].content.parts;
            if (!parts || parts.length === 0) {
                throw new Error('No parts returned in Gemini response');
            }

            // Gemini 이미지 모델은 보통 parts[0].inlineData.data 에 Base64 문자열을 내려줍니다.
            const inlineData = parts[0].inlineData;
            if (!inlineData || !inlineData.data) {
                this.logger.error('Unexpected Gemini response structure: ' + JSON.stringify(parts));
                throw new Error('No image data (Base64) found in Gemini response');
            }

            const base64Image = inlineData.data;

            // 로컬에 파일로 저장하고 생성된 경로를 받습니다.
            const localPath = await this.fileStorageUtil.saveFromBase64(base64Image);
            return localPath;
        } catch (error) {
            this.logger.error(`Error generating image with Gemini: ${error.message}`);
            throw error;
        }
    }
}
