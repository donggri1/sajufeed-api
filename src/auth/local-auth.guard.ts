import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // JWT 방식에서는 기본 AuthGuard 동작만 사용
  // Session 관련 로직 제거
}