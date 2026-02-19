import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DailyFortune } from './daily-fortune.entity';
import { FortuneWebtoonPanel } from './fortune-webtoon-panel.entity';

export enum WebtoonStatus {
    PENDING = 'pending',
    GENERATING = 'generating',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

@Entity('fortune_webtoon')
export class FortuneWebtoon {
    @ApiProperty({ description: '웹툰 고유 ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => DailyFortune, (fortune) => fortune.webtoon, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'daily_fortune_id' })
    dailyFortune: DailyFortune;

    @Column({ name: 'daily_fortune_id' })
    dailyFortuneId: number;

    @ApiProperty({ description: '웹툰 제목', example: '오늘의 운세 웹툰' })
    @Column({ type: 'varchar', length: 200 })
    title: string;

    @ApiProperty({ description: '생성 상태', enum: WebtoonStatus })
    @Column({
        type: 'enum',
        enum: WebtoonStatus,
        default: WebtoonStatus.PENDING,
    })
    status: WebtoonStatus;

    @OneToMany(() => FortuneWebtoonPanel, (panel) => panel.webtoon, {
        cascade: true,
        eager: true,
    })
    panels: FortuneWebtoonPanel[];

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: '수정 일시' })
    @UpdateDateColumn()
    updatedAt: Date;
}
