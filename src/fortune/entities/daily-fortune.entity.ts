import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('daily_fortune')
@Index(['user', 'date'], { unique: true }) // 한 유저는 하루에 하나의 운세만 가질 수 있음
export class DailyFortune {
    @ApiProperty({ description: '운세 고유 ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.dailyFortunes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ description: '운세 날짜', example: '2024-02-14' })
    @Column({ type: 'date' })
    date: string;

    @ApiProperty({ description: '총운 점수', example: 85 })
    @Column({ type: 'int' })
    totalScore: number;

    @ApiProperty({ description: '재물운 점수', example: 85 })
    @Column({ type: 'int' })
    wealthScore: number;

    @ApiProperty({ description: '애정운 점수', example: 85 })
    @Column({ type: 'int' })
    loveScore: number;

    @ApiProperty({ description: '건강운 점수', example: 85 })
    @Column({ type: 'int' })
    healthScore: number;

    @ApiProperty({ description: '소원 성취 점수', example: 85 })
    @Column({ type: 'int' })
    wishScore: number;

    @ApiProperty({ description: '운세 요약', example: '오늘은 좋은 일이 생길 것입니다.' })
    @Column({ type: 'text' })
    summary: string;

    @ApiProperty({ description: '운세 상세 내용', example: '오늘은...' })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ description: '행운의 색상', example: 'Red' })
    @Column({ type: 'varchar', length: 50 })
    luckyColor: string;

    @ApiProperty({ description: '행운의 아이템', example: 'Watch' })
    @Column({ type: 'varchar', length: 50 })
    luckyItem: string;

    @ApiProperty({ description: '행운의 방향', example: 'East' })
    @Column({ type: 'varchar', length: 50 })
    luckyDirection: string;

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn()
    createdAt: Date;
}
