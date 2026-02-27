import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('new_year_fortune')
@Index(['user', 'year'], { unique: true }) // 한 유저는 한 해에 하나의 신년운세만 가질 수 있음
export class NewYearFortune {
    @ApiProperty({ description: '신년운세 고유 ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.newYearFortunes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ description: '운세 연도', example: '2026' })
    @Column({ type: 'varchar', length: 4 })
    year: string;

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

    @ApiProperty({ description: '직업/학업운 점수', example: 85 })
    @Column({ type: 'int' })
    careerScore: number;

    @ApiProperty({ description: '운세 요약', example: '올해는 비상하는 흑룡의 해입니다.' })
    @Column({ type: 'text' })
    summary: string;

    @ApiProperty({ description: '운세에 대한 상세한 분석과 조언', example: '올해는...' })
    @Column({ type: 'text' })
    description: string;

    @ApiProperty({ description: '올해의 행운의 색상', example: 'Blue' })
    @Column({ type: 'varchar', length: 50 })
    luckyColor: string;

    @ApiProperty({ description: '올해의 행운의 아이템', example: 'Pen' })
    @Column({ type: 'varchar', length: 50 })
    luckyItem: string;

    @ApiProperty({ description: '올해의 행운의 방향', example: 'South' })
    @Column({ type: 'varchar', length: 50 })
    luckyDirection: string;

    @ApiProperty({ description: '상세 운세 분석 페이로드', example: '올해의 월별 흐름은...' })
    @Column({ type: 'text', nullable: true })
    details: string | null;

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '수정 일시' })
    @UpdateDateColumn()
    updatedAt: Date;
}
