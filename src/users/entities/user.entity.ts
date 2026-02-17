import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DailyFortune } from '../../fortune/entities/daily-fortune.entity';

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

  @ApiProperty({ description: '생년월일', example: '1990-01-01', nullable: true })
  @Column({ type: 'date', nullable: true, comment: '생년월일' })
  birthDate: string | null;

  @ApiProperty({ description: '출생시간 (HH:mm)', example: '14:30', nullable: true })
  @Column({ type: 'time', nullable: true, comment: '출생시간 (HH:mm)' })
  birthTime: string | null;

  @ApiProperty({ description: '출생시간 모름 여부', default: false })
  @Column({ type: 'boolean', default: false, comment: '출생시간 모름 여부' })
  birthTimeUnknown: boolean;

  @ApiProperty({
    description: '성별',
    enum: ['male', 'female'],
    nullable: true,
    example: 'male'
  })
  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    nullable: true,
    comment: '성별'
  })
  gender: 'male' | 'female' | null;

  @ApiProperty({
    description: '양력/음력',
    enum: ['solar', 'lunar'],
    default: 'solar'
  })
  @Column({
    type: 'enum',
    enum: ['solar', 'lunar'],
    default: 'solar',
    comment: '양력/음력'
  })
  calendarType: 'solar' | 'lunar';

  @ApiProperty({ description: '출생지 (선택)', example: '서울', nullable: true })
  @ApiProperty({ description: '출생지 (선택)', example: '서울', nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, comment: '출생지 (선택)' })
  birthPlace: string | null;

  @OneToMany(() => DailyFortune, (dailyFortune) => dailyFortune.user)
  dailyFortunes: DailyFortune[];

}
