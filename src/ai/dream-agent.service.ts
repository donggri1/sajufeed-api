import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { DREAM_INTERPRETATION_PROMPT, DREAM_IMAGE_PROMPT, DreamUserInfo } from './prompts/dream.prompt';

export interface DreamInterpretationResult {
    summary: string;
    interpretation: string;
    luckyScore: number;
    actionableAdvice: string;
    luckyColor: string;
    luckyItem: string;
    imageUrl?: string;
}

@Injectable()
export class DreamAgentService {
    private readonly logger = new Logger(DreamAgentService.name);

    constructor(private readonly aiService: AiService) { }

    async interpretDream(content: string, userInfo?: DreamUserInfo, language: string = 'ko'): Promise<DreamInterpretationResult> {
        this.logger.log('꿈해몽 분석 시작...');
        const prompt = DREAM_INTERPRETATION_PROMPT(content, userInfo, language);

        let aiTargetString = '';
        try {
            aiTargetString = await this.aiService.analyzeSaju(prompt);

            // Clean up possible Markdown formatting (e.g. ```json ... ```)
            const jsonMatch = aiTargetString.match(/[\{].*[\}]/s);
            const cleanJson = jsonMatch ? jsonMatch[0] : aiTargetString;

            const result = JSON.parse(cleanJson);

            // Generate Dream Image
            let imageUrl: string | undefined;
            if (result.imagePromptScenery) {
                this.logger.log('꿈 아트워크(이미지) 생성 시작...');
                const imagePrompt = DREAM_IMAGE_PROMPT(result.imagePromptScenery);
                imageUrl = await this.aiService.generateImage(imagePrompt);
                this.logger.log('꿈 아트워크 생성 완료');
            }

            return {
                summary: result.summary,
                interpretation: result.interpretation,
                luckyScore: result.luckyScore,
                actionableAdvice: result.actionableAdvice,
                luckyColor: result.luckyColor,
                luckyItem: result.luckyItem,
                imageUrl,
            };

        } catch (error) {
            this.logger.error('꿈해몽 중 오류 발생', error);
            this.logger.error('AI Raw 응답:', aiTargetString);
            throw new Error('꿈을 해몽하는 중 오류가 발생했습니다.');
        }
    }
}
