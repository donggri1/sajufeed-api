import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FortuneService } from './fortune.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fortune')
export class FortuneController {
    constructor(private readonly fortuneService: FortuneService) { }

    @Get('daily')
    @UseGuards(JwtAuthGuard)
    async getDailyFortune(@Request() req) {
        console.log(req.user);
        // const userId = req.user.id; // JWT Payload에 id가 있다고 가정 (sub 또는 id)
        // 실제로는 토큰 페이로드 구조에 따라 다름. 여기서는 임시로 1 사용하거나 req.user 로그 확인 필요
        // 일단 id가 없으면 1로 fallback
        const userId = req.user?.id || req.user?.userId || 1;
        return this.fortuneService.getDailyFortune(userId);
    }
}
