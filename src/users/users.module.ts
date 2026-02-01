import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 엔티티 등록
  controllers: [UsersController],
  providers: [UsersService],
  exports : [UsersService]
})
export class UsersModule {}
