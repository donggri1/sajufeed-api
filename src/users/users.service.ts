import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`${id}번 유저를 찾을 수 없습니다.`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
