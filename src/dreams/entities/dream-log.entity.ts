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

@Entity('dream_logs')
@Index(['user', 'createdAt'])
export class DreamLog {
    @ApiProperty({ description: '꿈 기록 고유 ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.dreamLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ description: '사용자가 입력한 꿈 내용', example: '하늘을 나는 꿈을 꾸었습니다...' })
    @Column({ type: 'text' })
    content: string;

    @ApiProperty({ description: 'AI가 분석한 해몽 한 줄 요약', example: '자유와 해방을 갈망하는 길몽' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    summary: string | null;

    @ApiProperty({ description: 'AI가 분석한 해몽 상세 내용', example: '이 꿈은...' })
    @Column({ type: 'text', nullable: true })
    interpretation: string | null;

    @ApiProperty({ description: '길몽/흉몽 점수 (0~100, 높을수록 길몽)', example: 85 })
    @Column({ type: 'int', nullable: true })
    luckyScore: number | null;

    @ApiProperty({ description: '오늘의 처방전 (행동 지침)', example: '오늘은 동쪽으로 산책을 가보세요.' })
    @Column({ type: 'text', nullable: true })
    actionableAdvice: string | null;

    @ApiProperty({ description: '생성된 몽환적 3D 이미지 URL', example: 'https://s3.amazonaws.com/...' })
    @Column({ type: 'varchar', length: 2048, nullable: true })
    imageUrl: string | null;

    @ApiProperty({ description: '행운의 컬러', example: '보라색' })
    @Column({ type: 'varchar', length: 50, nullable: true })
    luckyColor: string | null;

    @ApiProperty({ description: '행운의 아이템', example: '거울' })
    @Column({ type: 'varchar', length: 50, nullable: true })
    luckyItem: string | null;

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn()
    createdAt: Date;
}
