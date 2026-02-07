import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField:'email'});// 기본값은 username이므로 email로 변경
  }
  async validate(email : string,password: string){

    const user = await this.authService.validateUser(email,password); // AuthService의 validateUser 메서드를 호출하여 사용자 인증
    if(!user){
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    return user;

  }

}