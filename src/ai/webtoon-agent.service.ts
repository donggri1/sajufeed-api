import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import {
    WEBTOON_STORYBOARD_PROMPT,
    WEBTOON_IMAGE_PROMPT,
} from './prompts/webtoon.prompt';

export interface StoryboardPage {
    pageNumber: number;
    theme: string;
    description: string;
}

export interface Storyboard {
    title: string;
    pages: StoryboardPage[];
}

export interface GeneratedPanel {
    pageNumber: number;
    imageData: string; // base64 or URL
    description: string;
}

@Injectable()
export class WebtoonAgentService {
    private readonly logger = new Logger(WebtoonAgentService.name);

    constructor(private readonly aiService: AiService) { }

    /**
     * Step 1: 상세 운세를 바탕으로 스토리보드 생성
     */
    async generateStoryboard(details: string): Promise<Storyboard> {
        this.logger.log('스토리보드 생성 시작...');
        const prompt = WEBTOON_STORYBOARD_PROMPT(details);
        const response = await this.aiService.analyzeSaju(prompt);

        // JSON 파싱
        const jsonMatch = response.match(/[\{].*[\}]/s);
        const cleanJson = jsonMatch ? jsonMatch[0] : response;
        const storyboard: Storyboard = JSON.parse(cleanJson);

        this.logger.log(`스토리보드 생성 완료: "${storyboard.title}" (${storyboard.pages.length}페이지)`);
        return storyboard;
    }

    /**
     * Step 2: 스토리보드의 각 페이지를 이미지로 생성
     */
    async generatePanelImage(page: StoryboardPage): Promise<GeneratedPanel> {
        this.logger.log(`페이지 ${page.pageNumber} 이미지 생성 중... (${page.theme})`);
        const prompt = WEBTOON_IMAGE_PROMPT(page.description, page.pageNumber);
        const imageData = await this.aiService.generateImage(prompt);

        this.logger.log(`페이지 ${page.pageNumber} 이미지 생성 완료`);
        return {
            pageNumber: page.pageNumber,
            imageData,
            description: page.description,
        };
    }

    /**
     * 전체 웹툰 생성 (스토리보드 → 이미지 4장)
     */
    async generateWebtoon(details: string): Promise<{ title: string; panels: GeneratedPanel[] }> {
        // Step 1: 스토리보드
        const storyboard = await this.generateStoryboard(details);

        // Step 2: 각 페이지 이미지 생성 (순차적으로 - API rate limit 고려)
        const panels: GeneratedPanel[] = [];
        for (const page of storyboard.pages) {
            const panel = await this.generatePanelImage(page);
            panels.push(panel);
        }

        this.logger.log(`웹툰 생성 완료! "${storyboard.title}" - ${panels.length}장`);
        return {
            title: storyboard.title,
            panels,
        };
    }
}
