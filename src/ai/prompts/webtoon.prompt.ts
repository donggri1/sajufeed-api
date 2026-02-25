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

  const targetLanguage = language || (characterInfo?.location ? `${characterInfo.location}의 현지 공용어` : '한국어');
  const langInstruction = `\n중요: 이건 글로벌 서비스입니다. 모든 텍스트(title, theme, description, 특히 만화 속 대사)는 반드시 ${targetLanguage}로 작성해주세요. 해당 국가 사용자들에게 자연스러운 언어와 문화적 맥락을 고려해주세요. (단, characterDesign은 이미지 생성을 위해 반드시 영어로 작성)\n`;

  return `
당신은 전문 만화 스토리보드 작가입니다.
아래 운세 분석 내용을 바탕으로 4페이지짜리 4컷 만화의 스토리보드를 작성해주세요.

운세 분석:
${details}
${charSection}
각 페이지는 4컷으로 구성되며, 각각 아래와 같은 주제를 다룹니다.
주인공이 운세 내용을 실생활에서 체험하는 스토리로 만들어주세요. 무조건 귀여운 스타일이기보단 내용에 맞게 때로는 유머러스하고 몰입감 있게 연출해주세요.
${langInstruction}
반드시 아래의 JSON 형식으로만 응답하세요:
{
  "title": "웹툰 제목 (재미있고 짧게, ${targetLanguage}로 작성)",
  "characterDesign": "주인공 캐릭터의 상세한 외형 묘사 (영어로 작성, AI 이미지 프롬프트용, 위 주인공 정보의 성별/나이/지역 특성을 반영)",
  "pages": [
    {
      "pageNumber": 1,
      "theme": "재물 & 직장 (사회생활 포인트)",
      "description": "재물과 직장 관련 운세를 바탕으로 직장/사회생활에서 일어나는 기승전결 4컷 만화의 전체 장면 설명 (각 컷의 내용을 자세히 묘사, 대사 포함, 200자 이상, ${targetLanguage}로 작성)"
    },
    {
      "pageNumber": 2,
      "theme": "애정 & 대인관계 (관계 포인트)",
      "description": "애정과 대인관계 관련 운세를 바탕으로 주변 사람들과 일어나는 기승전결 4컷 만화의 전체 장면 설명 (각 컷의 내용을 자세히 묘사, 대사 포함, 200자 이상, ${targetLanguage}로 작성)"
    },
    {
      "pageNumber": 3,
      "theme": "건강 & 주의사항 (체력 포인트)",
      "description": "건강과 주의사항 운세를 바탕으로 일상에서 겪는 유머러스한 기승전결 4컷 만화의 전체 장면 설명 (각 컷의 내용을 자세히 묘사, 대사 포함, 200자 이상, ${targetLanguage}로 작성)"
    },
    {
      "pageNumber": 4,
      "theme": "오늘의 한 줄 평 (Today's Mantra)",
      "description": "오늘 하루 명심해야 할 조언이나 좌우명을 바탕으로 교훈이나 임팩트가 있는 4컷 만화의 전체 장면 설명 (각 컷의 내용을 자세히 묘사, 대사 포함, 200자 이상, ${targetLanguage}로 작성)"
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
Create a cute 4-panel vertical comic strip.
This is Page ${pageNumber} of 4.

### [SCENE DESCRIPTION] ###
${pageDescription}

### [STYLE & FORMATTING] ###
- Style: Cute chibi/kawaii art style or an engageing webtoon style suitable for a global audience with big expressive eyes
- Palette: Soft pastel color palette, clean line art
- Layout: 4 panels arranged vertically, clearly separated with white borders
- Elements: Text in speech bubbles in the language described in the scene description, dynamic poses, expressive emotions
- Background: Simple but charming background reflecting the environment

### [IMPORTANT CONSTRAINT] ###
Generate ONLY the 4-panel image. NO text outside the panels. Ensure character consistency across all panels.
`;