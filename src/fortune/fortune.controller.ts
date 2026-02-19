import { Controller, Get, Post, UseGuards, Request, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FortuneService } from './fortune.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('fortune')
@Controller('fortune')
export class FortuneController {
    constructor(private readonly fortuneService: FortuneService) { }

    @Get('daily')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '오늘의 운세 조회' })
    async getDailyFortune(@Request() req) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.getDailyFortune(userId);
    }

    @Post('daily')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '오늘의 운세 생성' })
    async createDailyFortune(@Request() req) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.createDailyFortune(userId);
    }

    @Post(':id/webtoon')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '웹툰 생성' })
    async createWebtoon(
        @Param('id', ParseIntPipe) fortuneId: number,
        @Request() req,
    ) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.createWebtoon(fortuneId, userId);
    }

    @Get(':id/webtoon')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '웹툰 조회' })
    async getWebtoon(
        @Param('id', ParseIntPipe) fortuneId: number,
        @Request() req,
    ) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.getWebtoon(fortuneId, userId);
    }

    @Get('history')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '운세 히스토리 조회' })
    async getFortuneHistory(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.getFortuneHistory(userId, Number(page), Number(limit));
    }
}
