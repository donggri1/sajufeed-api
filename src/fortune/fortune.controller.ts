import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fortune')
export class FortuneController {
    constructor(private readonly fortuneService: FortuneService) { }

    @Get('daily')
    @UseGuards(JwtAuthGuard)
    async getDailyFortune(@Request() req) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.getDailyFortune(userId);
    }

    @Post('daily')
    @UseGuards(JwtAuthGuard)
    async createDailyFortune(@Request() req) {
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.createDailyFortune(userId);
    }
}
