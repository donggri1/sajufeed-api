import { Module } from '@nestjs/common';
import { FortuneController } from './fortune.controller';
import { FortuneService } from './fortune.service';
import { UsersModule } from '../users/users.module';
import { WebtoonAgentService } from '../ai/webtoon-agent.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFortune } from './entities/daily-fortune.entity';
import { FortuneWebtoon } from './entities/fortune-webtoon.entity';
import { FortuneWebtoonPanel } from './entities/fortune-webtoon-panel.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DailyFortune, FortuneWebtoon, FortuneWebtoonPanel]),
        UsersModule
    ],
    controllers: [FortuneController],
    providers: [FortuneService, WebtoonAgentService],
})
export class FortuneModule { }
