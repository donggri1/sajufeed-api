/**
 * 웹툰 스토리보드 생성 프롬프트
 * 상세 운세 분석(details)을 기반으로 4장짜리 만화 콘티를 생성
 */
export interface CharacterInfo {
    name: string | null;
    gender: string | null;
    age: number | null;
    location: string | null;
}

export const WEBTOON_STORYBOARD_PROMPT = (details: string, characterInfo?: CharacterInfo, language?: string | null) => {
    const charParts = [
        characterInfo?.name ? `이름: ${characterInfo.name}` : null,
        characterInfo?.gender ? `성별: ${characterInfo.gender === 'male' ? '남성' : '여성'}` : null,
        characterInfo?.age ? `나이: ${characterInfo.age}세` : null,
        characterInfo?.location ? `거주지: ${characterInfo.location}` : null,
    ].filter(Boolean);

    const charSection = charParts.length > 0
        ? `\n주인공 정보:\n${charParts.join(', ')}\n위 정보를 반영하여 캐릭터의 외형과 배경을 설정해주세요.\n`
        : '';

    const langInstruction = language
        ? `\n중요: title, theme, description 등 모든 텍스트를 반드시 ${language}(으)로 작성해주세요. (characterDesign만 영어로 작성)\n`
        : '';

    return `
당신은 전문 만화 스토리보드 작가입니다.
아래 운세 분석 내용을 바탕으로 4페이지짜리 4컷 만화의 스토리보드를 작성해주세요.

운세 분석:
${details}
${charSection}
각 페이지는 4컷으로 구성되며, 하루의 흐름(아침→점심→저녁→밤)을 따라갑니다.
귀여운 캐릭터가 운세 내용을 체험하는 스토리로 만들어주세요.
${langInstruction}
반드시 아래의 JSON 형식으로만 응답하세요:
{
  "title": "웹툰 제목 (재미있고 짧게)",
  "characterDesign": "주인공 캐릭터의 상세한 외형 묘사 (영어로 작성, AI 이미지 프롬프트용, 위 주인공 정보의 성별/나이/지역 특성을 반영)",
  "pages": [
    {
      "pageNumber": 1,
      "theme": "아침 - 하루의 시작",
      "description": "4컷 만화의 전체 장면 설명 (각 컷의 내용을 자세히 묘사, 대사 포함, 200자 이상)"
    },
    {
      "pageNumber": 2,
      "theme": "점심 - 운세의 전개",
      "description": "..."
    },
    {
      "pageNumber": 3,
      "theme": "저녁 - 클라이맥스",
      "description": "..."
    },
    {
      "pageNumber": 4,
      "theme": "밤 - 마무리와 교훈",
      "description": "..."
    }
  ]
}
`;
};

/**
 * 웹툰 이미지 생성 프롬프트
 * 스토리보드의 한 페이지를 4컷 만화 이미지로 변환
 */
export const WEBTOON_IMAGE_PROMPT = (pageDescription: string, pageNumber: number, characterDesign: string) => `
### [CHARACTER REFERENCE SHEET - MANDATORY] ###
- Main Character: ${characterDesign}
- Consistency: You must keep the same hairstyle, hair color, eye shape, and clothing colors in every single panel of this page. 
- Identity: This character must be recognizable as the same person throughout the 4 panels.

### [TASK: 4-PANEL VERTICAL COMIC STRIP] ###
Create a cute Korean-style 4-panel vertical comic strip (4컷 만화).
This is Page ${pageNumber} of 4.

### [SCENE DESCRIPTION] ###
${pageDescription}

### [STYLE & FORMATTING] ###
- Style: Cute chibi/kawaii art style with big expressive eyes
- Palette: Soft pastel color palette, clean line art
- Layout: 4 panels arranged vertically, clearly separated with white borders
- Elements: Korean text in speech bubbles, dynamic poses, expressive emotions
- Background: Simple but charming background

### [IMPORTANT CONSTRAINT] ###
Generate ONLY the 4-panel image. NO text outside the panels. Ensure character consistency across all panels.
`;