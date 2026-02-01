import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ description: '유저 고유 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '이메일 주소', example: 'test@example.com' })
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiProperty({
    description: '비밀번호 (카카오 로그인 시 null 가능)',
    example: 'password123!',
    required: false,
    nullable: true,
  })
  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @ApiProperty({ description: '서비스 닉네임', example: '사주마스터' })
  @Column({ type: 'varchar' })
  nickname: string;

  @ApiProperty({
    description: '로그인 제공자',
    example: 'local',
    enum: ['local', 'kakao'],
    default: 'local',
  })
  @Column({ type: 'varchar', default: 'local' })
  provider: string;

  @ApiProperty({ description: '생성 일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  @UpdateDateColumn()
  updatedAt: Date;
}
