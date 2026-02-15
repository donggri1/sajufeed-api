import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
    private readonly logger = new Logger(OpenAiProvider.name);
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
            this.logger.error('OPENAI_API_KEY is not defined in environment variables');
        }
        this.openai = new OpenAI({ apiKey: apiKey || '' });
    }

    async analyzeSaju(prompt: string): Promise<string> {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'gpt-4o',
            });
            return completion.choices[0].message.content || '';
        } catch (error) {
            this.logger.error(`Error analyzing saju with OpenAI: ${error.message}`);
            throw error;
        }
    }

    async generateImage(prompt: string): Promise<string> {
        try {
            const response = await this.openai.images.generate({
                model: 'dall-e-3',
                prompt: prompt,
                n: 1,
                size: '1024x1024',
            });
            return response.data?.[0]?.url || '';
        } catch (error) {
            this.logger.error(`Error generating image with OpenAI: ${error.message}`);
            throw error;
        }
    }
}
