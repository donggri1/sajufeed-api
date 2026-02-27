/**
 * 신년운세 분석을 위한 AI 프롬프트 템플릿
 */
export const NEW_YEAR_FORTUNE_PROMPT = (sajuInfo: string, year: string, language?: string | null) => `
당신은 전문 사주 분석가입니다. 다음 사용자의 사주 정보를 바탕으로 ${year}년의 신년운세를 분석해주세요.
사용자 정보: [${sajuInfo}]
${language ? `\n중요: 모든 텍스트 값(summary, description, luckyColor, luckyItem, luckyDirection, details)을 반드시 ${language}(으)로 작성해주세요.\n` : ''}
반드시 아래의 JSON 형식으로만 응답하세요. 다른 설명은 생략하세요:
{
  "totalScore": 0~100 숫자,
  "wealthScore": 0~100 숫자,
  "loveScore": 0~100 숫자,
  "healthScore": 0~100 숫자,
  "careerScore": 0~100 숫자,
  "summary": "${year}년 신년운세 한 줄 요약",
  "description": "${year}년 운세에 대한 전반적인 상세 흐름과 주된 조언 (3~4문장)",
  "luckyColor": "올해의 행운의 색상",
  "luckyItem": "올해의 행운의 아이템",
  "luckyDirection": "올해의 행운의 방향",
  "details": "${year}년 한 해의 운세에 대한 풍부하고 상세한 분석. 아래 항목을 모두 포함하여 마크다운 포맷팅과 함께 풍부하게 작성해주세요 (최소 1500자 이상):\\n\\n### 📄 한 해의 총운:\\n(${year}년에 대한 종합적인 흐름 5~8문장)\\n\\n### 🗓️ 월별 흐름 매트릭스:\\n(1월부터 12월까지의 월별 주요 운세 흐름 요약)\\n\\n### 💰 재물운:\\n(올해의 재물운 및 금전 관리에 대한 상세 분석 5~8문장)\\n\\n### ❤️ 애정운/인간관계:\\n(올해의 애정운 및 대인관계에 대한 상세 분석 5~8문장)\\n\\n### 🏥 건강운:\\n(올해의 건강관리에 대한 상세 분석 5~8문장)\\n\\n### 💼 직장/학업운:\\n(올해의 승진, 이직, 학업, 시험 등에 대한 상세 분석 5~8문장)\\n\\n### 🌟 신년 조언:\\n(올해 반드시 피해야 할 것과 취해야 할 행동 조언 5~8문장)"
}
`;
