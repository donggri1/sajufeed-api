import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })], // imports란 다른 모듈들을 의미
  controllers: [AuthController], // controllers란 라우팅을 처리하는 컨트롤러들을 의미 사용하는법은 ? 데코레이터로 사용
  providers: [AuthService, LocalStrategy, SessionSerializer], // providers란 주입할 수 있는 서비스들을 의미 사용하는 법은 ? 생성자에 private로 선언 후 사용
})
export class AuthModule {}
