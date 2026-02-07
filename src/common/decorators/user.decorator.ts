import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator( // 데코레이터 생성 매인이 실행 될때 생성 되는 함수
  (data:unknown,ctx:ExecutionContext) => { // data는 데코레이터에 전달된 인자, ctx는 실행 컨텍스트
    const request = ctx.switchToHttp().getRequest(); // HTTP 요청 객체 가져오기
    return request.user;
  },
)