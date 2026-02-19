import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from '../ai/ai.service';
import { UsersService } from '../users/users.service';
import { WebtoonAgentService } from '../ai/webtoon-agent.service';
import { DAILY_FORTUNE_PROMPT } from '../ai/prompts/daily-fortune.prompt';
import { DailyFortune } from './entities/daily-fortune.entity';
import { FortuneWebtoon, WebtoonStatus } from './entities/fortune-webtoon.entity';
import { FortuneWebtoonPanel } from './entities/fortune-webtoon-panel.entity';

@Injectable()
export class FortuneService {
    private readonly logger = new Logger(FortuneService.name);

    constructor(
        private readonly aiService: AiService,
        private readonly usersService: UsersService,
        private readonly webtoonAgentService: WebtoonAgentService,
        @InjectRepository(DailyFortune)
        private readonly dailyFortuneRepository: Repository<DailyFortune>,
        @InjectRepository(FortuneWebtoon)
        private readonly webtoonRepository: Repository<FortuneWebtoon>,
        @InjectRepository(FortuneWebtoonPanel)
        private readonly panelRepository: Repository<FortuneWebtoonPanel>,
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

    /**
     * 웹툰 생성
     */
    async createWebtoon(fortuneId: number, userId: number) {
        // 1. 운세 조회
        const fortune = await this.dailyFortuneRepository.findOne({
            where: { id: fortuneId, user: { id: userId } },
        });

        if (!fortune) {
            throw new NotFoundException('운세를 찾을 수 없습니다.');
        }

        if (!fortune.details) {
            throw new NotFoundException('상세 분석이 없는 운세입니다.');
        }

        // 2. 이미 생성된 웹툰이 있는지 확인
        const existingWebtoon = await this.webtoonRepository.findOne({
            where: { dailyFortuneId: fortuneId },
            relations: ['panels'],
        });

        if (existingWebtoon && existingWebtoon.status === WebtoonStatus.COMPLETED) {
            return existingWebtoon;
        }

        // 3. 웹툰 레코드 생성 (pending)
        const webtoon = this.webtoonRepository.create({
            dailyFortuneId: fortuneId,
            title: '생성 중...',
            status: WebtoonStatus.GENERATING,
        });
        await this.webtoonRepository.save(webtoon);

        try {
            // 4. AI로 웹툰 생성
            this.logger.log(`웹툰 생성 시작... FortuneID: ${fortuneId}`);
            const result = await this.webtoonAgentService.generateWebtoon(fortune.details);

            // 5. 제목 업데이트
            webtoon.title = result.title;

            // 6. 패널(이미지) 저장
            const panels: FortuneWebtoonPanel[] = [];
            for (const panelData of result.panels) {
                const panel = this.panelRepository.create({
                    webtoonId: webtoon.id,
                    pageNumber: panelData.pageNumber,
                    imagePath: panelData.imageData, // base64 또는 URL
                    description: panelData.description,
                });
                panels.push(panel);
            }
            await this.panelRepository.save(panels);

            // 7. 상태 업데이트
            webtoon.status = WebtoonStatus.COMPLETED;
            webtoon.panels = panels;
            await this.webtoonRepository.save(webtoon);

            this.logger.log(`웹툰 생성 완료! WebtoonID: ${webtoon.id}`);
            return webtoon;
        } catch (error) {
            // 실패 시 상태 업데이트
            webtoon.status = WebtoonStatus.FAILED;
            await this.webtoonRepository.save(webtoon);
            this.logger.error(`웹툰 생성 실패: ${error.message}`);
            throw error;
        }
    }

    /**
     * 웹툰 조회
     */
    async getWebtoon(fortuneId: number, userId: number) {
        const fortune = await this.dailyFortuneRepository.findOne({
            where: { id: fortuneId, user: { id: userId } },
        });

        if (!fortune) {
            throw new NotFoundException('운세를 찾을 수 없습니다.');
        }

        const webtoon = await this.webtoonRepository.findOne({
            where: { dailyFortuneId: fortuneId },
            relations: ['panels'],
        });

        return webtoon;
    }

    /**
     * 운세 히스토리 (페이지네이션)
     */
    async getFortuneHistory(userId: number, page: number = 1, limit: number = 10) {
        const [items, total] = await this.dailyFortuneRepository.findAndCount({
            where: { user: { id: userId } },
            order: { date: 'DESC' },
            relations: ['webtoon'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
