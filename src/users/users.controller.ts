import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JoinRequestDto } from './dto/join.request.dto';
import { UpdateUserDto } from './dto/updateUser.request.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request as ExpressRequest, Response as ExpressResponse, } from 'express';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';
import { LoginRequestDto } from '../auth/dto/login.request.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ summary: '회원가입' })
  @Post('join')
  async join(@Body() data: JoinRequestDto) {
    return this.usersService.join(data);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, description: '로그인 성공, JWT 토큰 반환' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserEntity) {
    // JWT 토큰 생성 및 반환
    return this.authService.login(user);
  }

  @ApiOperation({ summary: '내 프로필 조회' })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@User() user: UserEntity) {
    return this.usersService.findOne(user.id);
  }

  @ApiOperation({ summary: '프로필 업데이트' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: '프로필 업데이트 성공' })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @User() user: UserEntity,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.id, data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

}