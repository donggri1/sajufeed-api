import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }
  async validateUser(email: string,pass:string):Promise<any>{
    const user = await this.usersService.findByEmail(email);

    if(user && user.password){
      const isMatch = await bcrypt.compare(pass,user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
  }
}
