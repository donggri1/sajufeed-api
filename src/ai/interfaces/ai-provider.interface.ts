export interface AiProvider {
    /**
     * 사주 분석 텍스트 생성
     * @param prompt 분석을 위한 프롬프트
     */
    analyzeSaju(prompt: string): Promise<string>;

    /**
     * 이미지 생성 (향후 웹툰용)
     * @param prompt 이미지 생성을 위한 프롬프트
     */
    generateImage(prompt: string): Promise<string>;
}
