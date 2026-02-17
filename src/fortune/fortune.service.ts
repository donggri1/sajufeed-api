import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from '../ai/ai.service';
import { UsersService } from '../users/users.service';
import { DAILY_FORTUNE_PROMPT } from '../ai/prompts/daily-fortune.prompt';
import { DailyFortune } from './entities/daily-fortune.entity';

@Injectable()
export class FortuneService {
    private readonly logger = new Logger(FortuneService.name);

    constructor(
        private readonly aiService: AiService,
        private readonly usersService: UsersService,
        @InjectRepository(DailyFortune)
        private readonly dailyFortuneRepository: Repository<DailyFortune>,
    ) { }

    async getDailyFortune(userId: number) {
        const today = new Date().toISOString().split('T')[0];

        return await this.dailyFortuneRepository.findOne({
            where: {
                user: { id: userId },
                date: today,
            },
        });
    }

    async createDailyFortune(userId: number) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const today = new Date().toISOString().split('T')[0];

        // 1. 이미 존재하는지 확인
        const existingFortune = await this.dailyFortuneRepository.findOne({
            where: {
                user: { id: userId },
                date: today,
            },
        });

        if (existingFortune) {
            return existingFortune;
        }

        // 2. 없으면 AI로 생성
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

            // 3. DB에 저장
            const newFortune = this.dailyFortuneRepository.create({
                user: user,
                date: today,
                ...result,
            });

            await this.dailyFortuneRepository.save(newFortune);

            return newFortune;
        } catch (error) {
            this.logger.error(`Gemini AI 분석 실패: ${error.message}`);
            throw error;
        }
    }
}
