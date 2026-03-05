import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/create-dream.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('꿈해몽 (Dreams)')
@Controller('dreams')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class DreamsController {
    constructor(private readonly dreamsService: DreamsService) { }

    @Post()
    @ApiOperation({ summary: '새로운 꿈 해몽 요청', description: '꿈 내용을 바탕으로 해몽과 이미지를 생성하고 저장합니다.' })
    @ApiResponse({ status: 201, description: '성공적으로 생성됨.' })
    async createDream(@Req() req, @Body() createDreamDto: CreateDreamDto) {
        return this.dreamsService.createAndInterpret(req.user, createDreamDto);
    }

    @Get()
    @ApiOperation({ summary: '내 꿈 보관함(목록) 조회', description: '사용자의 역대 꿈해몽 기록을 최신순으로 조회합니다.' })
    @ApiResponse({ status: 200, description: '조회 성공.' })
    async getMyDreams(@Req() req) {
        return this.dreamsService.getUserDreams(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: '특정 꿈 해몽 상세 조회', description: 'ID에 해당하는 꿈 기록을 조회합니다.' })
    @ApiResponse({ status: 200, description: '조회 성공.' })
    async getDreamById(@Req() req, @Param('id') id: string) {
        return this.dreamsService.getDreamById(+id, req.user.id);
    }
}
