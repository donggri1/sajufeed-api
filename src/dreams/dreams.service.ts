import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DreamLog } from './entities/dream-log.entity';
import { DreamAgentService } from '../ai/dream-agent.service';
import { CreateDreamDto } from './dto/create-dream.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DreamsService {
    private readonly logger = new Logger(DreamsService.name);

    constructor(
        @InjectRepository(DreamLog)
        private readonly dreamLogRepository: Repository<DreamLog>,
        private readonly dreamAgentService: DreamAgentService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async createAndInterpret(user: User, createDreamDto: CreateDreamDto): Promise<DreamLog> {
        this.logger.log(`꿈 해몽 요청 수신 (User: ${user.id})`);

        // 유저 사주 정보 조합
        const userInfo = {
            name: user.name,
            gender: user.gender,
            birthDate: user.birthDate,
            birthTime: user.birthTime,
        };

        // 1. AI 해몽 + 이미지 생성 호출
        const interpretationResult = await this.dreamAgentService.interpretDream(
            createDreamDto.content,
            userInfo,
            'ko'
        );

        // 2. DB 저장
        const dreamLog = this.dreamLogRepository.create({
            user: user,
            content: createDreamDto.content,
            summary: interpretationResult.summary,
            interpretation: interpretationResult.interpretation,
            luckyScore: interpretationResult.luckyScore,
            actionableAdvice: interpretationResult.actionableAdvice,
            luckyColor: interpretationResult.luckyColor,
            luckyItem: interpretationResult.luckyItem,
            imageUrl: interpretationResult.imageUrl,
        });

        const savedDream = await this.dreamLogRepository.save(dreamLog);
        this.logger.log(`꿈 해몽 완료 및 저장 성공 (DreamLog ID: ${savedDream.id})`);

        return savedDream;
    }

    async getUserDreams(userId: number): Promise<DreamLog[]> {
        return this.dreamLogRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getDreamById(id: number, userId: number): Promise<DreamLog> {
        const dream = await this.dreamLogRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!dream) {
            throw new NotFoundException('꿈 기록을 찾을 수 없습니다.');
        }
        return dream;
    }
}
