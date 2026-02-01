import { ConflictException, Injectable } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  create(createUserDto: JoinRequestDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async join(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.usersRepository.create({
      email,
      nickname,
      password: hashedPassword
    });
    await this.usersRepository.save(newUser);

    return true;
  }
}
