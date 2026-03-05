import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';
import { DreamLog } from './entities/dream-log.entity';
import { DreamAgentService } from '../ai/dream-agent.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DreamLog, User]), UsersModule],
    controllers: [DreamsController],
    providers: [DreamsService, DreamAgentService],
})
export class DreamsModule { }
