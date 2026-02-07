import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { // 'local' 전략 사용

  // 오버라이드하여 커스텀 로직 추가 가능
  // 세션 방식을 사용한다면 logIn 메서드 호출해야함
  async canActivate(context : ExecutionContext):Promise<boolean>{
    const can = await super.canActivate(context); // 기본 인증 로직 실행

    if(can){
      const request = context.switchToHttp().getRequest(); // 요청 객체 가져오기
      await super.logIn(request);// 세션 저장 로직 실행 어떤 요청이냐하면 POST /auth/login
    }
    return can as boolean;

  }

}