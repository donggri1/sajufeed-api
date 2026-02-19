import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FortuneWebtoon } from './fortune-webtoon.entity';

@Entity('fortune_webtoon_panel')
@Unique(['webtoon', 'pageNumber'])
export class FortuneWebtoonPanel {
    @ApiProperty({ description: '패널 고유 ID', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => FortuneWebtoon, (webtoon) => webtoon.panels, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'webtoon_id' })
    webtoon: FortuneWebtoon;

    @Column({ name: 'webtoon_id' })
    webtoonId: number;

    @ApiProperty({ description: '페이지 번호 (1~4)', example: 1 })
    @Column({ type: 'tinyint' })
    pageNumber: number;

    @ApiProperty({ description: '이미지 경로', example: '/uploads/webtoon/1/page1.png' })
    @Column({ type: 'varchar', length: 500 })
    imagePath: string;

    @ApiProperty({ description: '장면 설명', example: '재물운이 좋은 하루의 시작' })
    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ApiProperty({ description: '생성 일시' })
    @CreateDateColumn()
    createdAt: Date;
}
