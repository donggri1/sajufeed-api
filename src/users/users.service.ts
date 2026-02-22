import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UpdateUserDto } from './dto/updateUser.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`${id}번 유저를 찾을 수 없습니다.`);
    }
    return user;
  }

  async updateProfile(userId: number, data: UpdateUserDto) {
    const { birthDate, birthTime, birthTimeUnknown, gender, calendarType, name, countryCode, stateCode, cityName } = data;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.usersRepository.update(userId, {
      birthDate,
      birthTime,
      birthTimeUnknown,
      gender,
      calendarType,
      name,
      countryCode,
      stateCode,
      cityName,
    });

    // 업데이트된 사용자 정보 반환
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async join(data: JoinRequestDto) {
    const { email, nickname, password } = data;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.usersRepository.create({
      email,
      nickname,
      password: hashedPassword,
    });
    await this.usersRepository.save(newUser);

    return true;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });

    if (!user) {
      throw new ConflictException('존재하지 않는 이메일입니다.');
    }
    return user;
  }
}
