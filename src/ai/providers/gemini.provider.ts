import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider implements AiProvider {
    private readonly logger = new Logger(GeminiProvider.name);
    private genAI: GoogleGenerativeAI;
    private textModel: GenerativeModel;
    private imageModel: GenerativeModel;

    constructor(private configService: ConfigService) {
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
            // 이미지 생성을 지원하는 모델의 경우 generateContent 내에서 멀티모달 출력을 생성하거나 
            // 별도의 API를 호출할 수 있음. 현재 SDK 버전에서는 텍스트 프롬프트를 통한 이미지 생성이 
            // 모델별로 상이할 수 있으므로 기본 연동 구조만 마련.
            const result = await this.imageModel.generateContent(prompt);
            const response = await result.response;
            // 이미지 데이터(base64 등)가 포함된 응답을 반환한다고 가정
            return response.text();
        } catch (error) {
            this.logger.error(`Error generating image with Gemini: ${error.message}`);
            throw error;
        }
    }
}
