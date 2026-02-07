import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer { // 세션에 유저 정보를 어떻게 저장하고 복원할지 결정 모든 요청이 들어올 때마다 실행
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: any, user: number) => void): any { // 뭐하는 거냐면 세션에 저장할 유저 정보를 결정
    done(null, user.id);
  }

  async deserializeUser( // 세션에서 유저 정보를 어떻게 복원할지 결정
    payload: number,
    done: (err: any, payload: User | null) => void,
  ): Promise<any> {
    try {
      const user = await this.usersService.findOne(payload);
      if (!user) {
        return done(new Error('세션에 기록된 유저가 DB에 없습니다.'), null);
      }
      const { password, ...result } = user;
      done(null, result as User); // 타입 단언으로 맞춰주기
    } catch (error) {
      done(error, null);
    }
  }
}