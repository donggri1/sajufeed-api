import { Module } from '@nestjs/common';
import { FortuneController } from './fortune.controller';
import { FortuneService } from './fortune.service';
import { UsersModule } from '../users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyFortune } from './entities/daily-fortune.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DailyFortune]),
        UsersModule
    ],
    controllers: [FortuneController],
    providers: [FortuneService],
})
export class FortuneModule { }
