import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { UsersService } from '../users/users.service';
import { DAILY_FORTUNE_PROMPT } from '../ai/prompts/daily-fortune.prompt';

@Injectable()
export class FortuneService {
    private readonly logger = new Logger(FortuneService.name);

    constructor(
        private readonly aiService: AiService,
        private readonly usersService: UsersService,
    ) { }

    async getDailyFortune(userId: number) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // 유저 사주 정보 구성
        const sajuInfo = `성별: ${user.gender === 'male' ? '남성' : '여성'}, 생년월일: ${user.birthDate}, 출생시간: ${user.birthTimeUnknown ? '모름' : user.birthTime}, 달력방식: ${user.calendarType}`;

        // 분리된 프롬프트 템플릿 사용
        const prompt = DAILY_FORTUNE_PROMPT(sajuInfo);

        try {
            this.logger.log(`AI 분석 요청 시작... UserID: ${userId}`);
            const startTime = Date.now();

            const aiResponse = await this.aiService.analyzeSaju(prompt);

            const endTime = Date.now();
            this.logger.log(`AI 분석 완료! 소요시간: ${endTime - startTime}ms`);

            // JSON 부분만 추출 (가끔 AI가 마크다운 블록을 포함할 수 있음)
            const jsonMatch = aiResponse.match(/[\{].*[\}]/s);
            const cleanJson = jsonMatch ? jsonMatch[0] : aiResponse;
            const result = JSON.parse(cleanJson);

            return {
                ...result,
                date: new Date().toISOString().split('T')[0]
            };
        } catch (error) {
            this.logger.error(`Gemini AI 분석 실패: ${error.message}`);

            // AI 호출 실패 시 폴백 데이터 (최소한의 서비스 유지)
            return {
                totalScore: 70,
                wealthScore: 70,
                loveScore: 70,
                healthScore: 70,
                wishScore: 70,
                summary: "오늘도 활기찬 하루 되세요!",
                description: "현재 AI 분석 서비스 이용이 일시적으로 원활하지 않습니다. 잠시 후 다시 시도해주세요. 기본적인 기운은 평온한 상태입니다.",
                luckyColor: "White",
                luckyItem: "미소",
                luckyDirection: "남쪽",
                date: new Date().toISOString().split('T')[0],
            };
        }
    }
}
