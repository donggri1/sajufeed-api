import { Injectable, Inject } from '@nestjs/common';
import type { AiProvider } from './interfaces/ai-provider.interface';

@Injectable()
export class AiService {
    constructor(
        @Inject('AI_PROVIDER') private readonly provider: AiProvider,
    ) { }

    /**
     * 운세 분석 실행
     */
    async analyzeSaju(prompt: string): Promise<string> {
        return this.provider.analyzeSaju(prompt);
    }

    /**
     * 웹툰용 이미지 생성
     */
    async generateImage(prompt: string): Promise<string> {
        return this.provider.generateImage(prompt);
    }
}
