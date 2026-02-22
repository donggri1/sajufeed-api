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
import { Country, State } from 'country-state-city';

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
        // 국가/지역 코드를 이름으로 변환
        const countryName = user.countryCode
            ? Country.getCountryByCode(user.countryCode)?.name ?? user.countryCode
            : null;
        const stateName = user.countryCode && user.stateCode
            ? State.getStateByCodeAndCountry(user.stateCode, user.countryCode)?.name ?? user.stateCode
            : null;
        const locationParts = [countryName, stateName, user.cityName].filter(Boolean);

        const sajuInfo = [
            user.name ? `이름: ${user.name}` : null,
            `성별: ${user.gender === 'male' ? '남성' : '여성'}`,
            `생년월일: ${user.birthDate}`,
            `출생시간: ${user.birthTimeUnknown ? '모름' : user.birthTime}`,
            `달력방식: ${user.calendarType}`,
            locationParts.length > 0 ? `출생지: ${locationParts.join(' ')}` : null,
        ].filter(Boolean).join(', ');

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
     * 웹툰 생성 (비동기 - 즉시 응답)
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

        
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // 2. 이미 생성된 웹툰이 있는지 확인
        const existingWebtoon = await this.webtoonRepository.findOne({
            where: { dailyFortuneId: fortuneId },
            relations: ['panels'],
        });

        // 이미 완료됨
        if (existingWebtoon && existingWebtoon.status === WebtoonStatus.COMPLETED) {
            return existingWebtoon;
        }

        // 이미 생성 중 → 중복 요청 방지
        if (existingWebtoon && existingWebtoon.status === WebtoonStatus.GENERATING) {
            return existingWebtoon;
        }

        // 실패한 경우 → 기존 레코드 삭제 후 재생성
        if (existingWebtoon && existingWebtoon.status === WebtoonStatus.FAILED) {
            await this.webtoonRepository.remove(existingWebtoon);
        }

        // 3. 웹툰 레코드 생성 (generating)
        const webtoon = this.webtoonRepository.create({
            dailyFortuneId: fortuneId,
            title: '생성 중...',
            status: WebtoonStatus.GENERATING,
        });
        await this.webtoonRepository.save(webtoon);

        // 유저 정보로 캐릭터 정보 구성
        const birthYear = user.birthDate ? new Date(user.birthDate).getFullYear() : null;
        const age = birthYear ? new Date().getFullYear() - birthYear : null;
        const countryName = user.countryCode
            ? Country.getCountryByCode(user.countryCode)?.name ?? user.countryCode
            : null;
        const stateName = user.countryCode && user.stateCode
            ? State.getStateByCodeAndCountry(user.stateCode, user.countryCode)?.name ?? user.stateCode
            : null;
        const locationParts = [countryName, stateName, user.cityName].filter(Boolean);

        const characterInfo = {
            name: user.name,
            gender: user.gender,
            age,
            location: locationParts.length > 0 ? locationParts.join(', ') : null,
        };

        // 4. 백그라운드에서 AI 생성 (fire-and-forget → 즉시 응답)
        this.generateWebtoonInBackground(webtoon.id, fortune.details, characterInfo);

        return webtoon;
    }

    /**
     * 백그라운드 웹툰 생성 (await 하지 않음)
     */
    private async generateWebtoonInBackground(webtoonId: number, details: string, characterInfo: { name: string | null; gender: string | null; age: number | null; location: string | null }) {
        try {
            this.logger.log(`[백그라운드] 웹툰 생성 시작... WebtoonID: ${webtoonId}`);
            const result = await this.webtoonAgentService.generateWebtoon(details, characterInfo);
                
            // 패널(이미지) 저장
            const panels: FortuneWebtoonPanel[] = [];
            for (const panelData of result.panels) {
                const panel = this.panelRepository.create({
                    webtoonId: webtoonId,
                    pageNumber: panelData.pageNumber,
                    imagePath: panelData.imageData,
                    description: panelData.description,
                });
                panels.push(panel);
            }
            await this.panelRepository.save(panels);

            // 상태 완료 (.update로 cascade 우회)
            await this.webtoonRepository.update(webtoonId, {
                title: result.title,
                status: WebtoonStatus.COMPLETED,
            });

            this.logger.log(`[백그라운드] 웹툰 생성 완료! WebtoonID: ${webtoonId}`);
        } catch (error) {
            // 실패 시 상태 업데이트 (.update로 cascade 우회)
            await this.webtoonRepository.update(webtoonId, {
                status: WebtoonStatus.FAILED,
            });
            this.logger.error(`[백그라운드] 웹툰 생성 실패: ${error.message}`);
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
