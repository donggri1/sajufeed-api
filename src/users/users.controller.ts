import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request, // NestJS의 데코레이터
  Response, // NestJS의 데코레이터
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JoinRequestDto } from './dto/join.request.dto';
import { UpdateUserDto } from './dto/updateUser.request.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import type {  Request as ExpressRequest,  Response as ExpressResponse,} from 'express';
import { User } from '../common/decorators/user.decorator';
import {User as UserEntity} from '../users/entities/user.entity';
import { LoginRequestDto } from '../auth/dto/login.request.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('join')
  async join(@Body() data: JoinRequestDto) {
    return this.usersService.join(data);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(LocalAuthGuard) // 🛡️ 우리가 만든 문지기 가드
  @Post('login')
  async login(@User() user : UserEntity) {
    // 가드를 통과하면 req.user에 유저 정보가 들어있습니다.
    return user;
  }

  @ApiOperation({ summary: '프로필 업데이트' }) 
  @ApiBody({ type: UpdateUserDto })
  @Post('profile')
  async updateProfile(@Body() data: UpdateUserDto) {
    return this.usersService.updateProfile(data);
  }
  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

}