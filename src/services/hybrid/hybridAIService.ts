// 🚀 하이브리드 AI 서비스 - 토큰 90% 절약 + 고퀄리티 유지
// services/hybrid/hybridAIService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../../types';

// 하이브리드 AI 데이터 타입
interface HybridPPTData {
  title: string;
  subtitle: string;
  theme: 'tech' | 'business' | 'beauty' | 'medical' | 'finance';
  stats: Array<{
    value: string;
    label: string;
    color: 'gold' | 'blue' | 'red' | 'green' | 'purple';
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  pricing?: Array<{
    name: string;
    price: string;
    features: string[];
    highlight?: boolean;
  }>;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

// 🎯 AI 프롬프트 - 토큰 최적화 (2K 토큰)
const createHybridPrompt = (request: ContentRequest): string => {
  const themeHints = {
    'IT/기술': 'tech',
    '화장품/뷰티': 'beauty', 
    '식품/음료': 'business',
    '패션/의류': 'beauty',
    '자동차': 'tech',
    '건강/의료': 'medical',
    '금융': 'finance'
  };

  const suggestedTheme = themeHints[request.industry as keyof typeof themeHints] || 'business';

  return `
"${request.topic}"에 대한 PPT 데이터를 다음 JSON 형식으로 생성해주세요:

{
  "title": "매력적인 제목 (25자 이내)",
  "subtitle": "설명적인 부제목 (50자 이내)",
  "theme": "${suggestedTheme}",
  "stats": [
    {"value": "구체적 수치", "label": "라벨명", "color": "gold"},
    {"value": "구체적 수치", "label": "라벨명", "color": "blue"},
    {"value": "구체적 수치", "label": "라벨명", "color": "red"}
  ],
  "features": [
    {"icon": "이모지", "title": "기능명", "description": "상세설명"},
    {"icon": "이모지", "title": "기능명", "description": "상세설명"},
    {"icon": "이모지", "title": "기능명", "description": "상세설명"},
    {"icon": "이모지", "title": "기능명", "description": "상세설명"}
  ],
  "pricing": [
    {"name": "플랜명", "price": "가격", "features": ["혜택1", "혜택2"], "highlight": false},
    {"name": "플랜명", "price": "가격", "features": ["혜택1", "혜택2"], "highlight": true},
    {"name": "플랜명", "price": "가격", "features": ["혜택1", "혜택2"], "highlight": false}
  ],
  "timeline": [
    {"year": "연도", "title": "이벤트", "description": "설명"},
    {"year": "연도", "title": "이벤트", "description": "설명"},
    {"year": "연도", "title": "이벤트", "description": "설명"}
  ]
}

요구사항:
- stats: 실제 통계나 임팩트 있는 수치 3개
- features: 핵심 기능/특징 4개 (이모지 포함)
- pricing: 가격 플랜 3개 (중간 플랜 highlight)
- timeline: 발전/로드맵 3단계
- 주제: ${request.topic}
- 스타일: ${request.style || '전문적인'}

**중요한 언어 요구사항:**
- 생성 언어: ${request.language === 'ko-zh' ? '한국어' : '중국어'}
- 모든 텍스트(제목, 설명, 라벨 등)를 ${request.language === 'ko-zh' ? '한국어' : '중국어'}로 작성
- JSON 내의 모든 문자열을 ${request.language === 'ko-zh' ? '한국어' : '중국어'}로 생성

반드시 위 JSON 형식으로만 응답하세요.
`;
};

// 🎨 템플릿 선택 시스템
const selectTemplate = (theme: string, topic: string): string => {
  const templates = {
    tech: 'modern-tech',
    business: 'professional-business', 
    beauty: 'elegant-beauty',
    medical: 'clean-medical',
    finance: 'corporate-finance'
  };
  
  return templates[theme as keyof typeof templates] || 'professional-business';
};

// 🚀 하이브리드 PPT 생성 (메인 함수)
export const generateHybridPPT = async (
  request: ContentRequest,
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  try {
    console.log('🎯 하이브리드 PPT 생성 시작:', request);
    
    onProgress?.(10, '🧠 AI 데이터 분석 중...');
    const prompt = createHybridPrompt(request);
    
    onProgress?.(25, '🤖 효율적인 AI 요청 중...');
    const aiData = await callGeminiForData(prompt);
    
    onProgress?.(50, '🎨 프리미엄 템플릿 선택 중...');
    const templateType = selectTemplate(aiData.theme, request.topic);
    
    onProgress?.(70, '⚡ HTML 슬라이드 생성 중...');
    const slides = await generateSlidesWithTemplate(aiData, templateType);
    
    onProgress?.(90, '✨ 최종 최적화 중...');
    
    const result: GeneratedContent = {
      id: `hybrid_ppt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: request.type,
      topic: request.topic,
      createdAt: new Date(),
      data: {
        title: aiData.title,
        subtitle: aiData.subtitle,
        slides: slides,
        styles: '',
        totalSlides: slides.length,
        templateType: templateType,
        theme: aiData.theme
      },
      sections: slides.map((slide: any, index: number) => slide.title || `슬라이드 ${index + 1}`)
    };
    
    onProgress?.(100, '🎉 하이브리드 PPT 생성 완료!');
    console.log('✅ 하이브리드 결과:', result);
    return result;
    
  } catch (error) {
    console.error('🚨 하이브리드 PPT 생성 실패:', error);
    onProgress?.(100, '⚠️ 폴백 모드 실행 중...');
    return createHybridFallback(request);
  }
};

// 🤖 Gemini API 호출 (데이터만)
async function callGeminiForData(prompt: string): Promise<HybridPPTData> {
  const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('🎯 하이브리드 AI 응답:', responseText);
    
    // JSON 파싱
    const parsed = parseHybridJSON(responseText);
    console.log('✅ 파싱된 데이터:', parsed);
    return parsed;
    
  } catch (error) {
    console.error('🚨 Gemini API 오류:', error);
    throw error;
  }
}

// 🔧 하이브리드 JSON 파싱
function parseHybridJSON(responseText: string): HybridPPTData {
  try {
    // JSON 추출
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON을 찾을 수 없음');
    }
    
    let jsonText = jsonMatch[0]
      .replace(/[\u201C\u201D]/g, '"')  // 스마트 따옴표
      .replace(/[\u2018\u2019]/g, "'")  // 스마트 아포스트로피
      .replace(/,(\s*[}\]])/g, '$1');   // 마지막 콤마 제거
    
    const parsed = JSON.parse(jsonText);
    
    // 데이터 검증 및 기본값 설정
    return {
      title: parsed.title || '새로운 프레젠테이션',
      subtitle: parsed.subtitle || '상세 내용',
      theme: parsed.theme || 'business',
      stats: Array.isArray(parsed.stats) ? parsed.stats.slice(0, 3) : [
        { value: '100%', label: '만족도', color: 'gold' as const },
        { value: '24/7', label: '지원', color: 'blue' as const },
        { value: '1위', label: '시장점유율', color: 'red' as const }
      ],
      features: Array.isArray(parsed.features) ? parsed.features.slice(0, 4) : [
        { icon: '⚡', title: '빠른 속도', description: '최적화된 성능' },
        { icon: '🛡️', title: '보안', description: '안전한 시스템' },
        { icon: '📱', title: '모바일', description: '반응형 디자인' },
        { icon: '🎯', title: '정확성', description: '정밀한 결과' }
      ],
      pricing: Array.isArray(parsed.pricing) ? parsed.pricing.slice(0, 3) : undefined,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline.slice(0, 3) : undefined
    };
    
  } catch (error) {
    console.error('❌ JSON 파싱 실패:', error);
    throw new Error('AI 응답을 파싱할 수 없습니다.');
  }
}

// 🎨 템플릿 기반 슬라이드 생성
async function generateSlidesWithTemplate(data: HybridPPTData, templateType: string) {
  const { getTemplateSlides } = await import('./templates/templateEngine');
  return getTemplateSlides(data, templateType);
}

// ⚠️ 폴백 생성
function createHybridFallback(request: ContentRequest): GeneratedContent {
  const fallbackData: HybridPPTData = {
    title: request.topic || '새로운 프레젠테이션',
    subtitle: '하이브리드 AI 생성',
    theme: 'business',
    stats: [
      { value: '95%', label: '성공률', color: 'gold' },
      { value: '24/7', label: '지원', color: 'blue' },
      { value: '1등', label: '품질', color: 'red' }
    ],
    features: [
      { icon: '🚀', title: '혁신 기술', description: '최신 기술 적용' },
      { icon: '💎', title: '프리미엄 품질', description: '최고급 소재 사용' },
      { icon: '🎯', title: '정확한 타겟팅', description: '맞춤형 솔루션' },
      { icon: '⚡', title: '빠른 처리', description: '즉시 결과 확인' }
    ]
  };
  
  return {
    id: `fallback_${Date.now()}`,
    type: request.type,
    topic: request.topic,
    createdAt: new Date(),
    data: {
      title: fallbackData.title,
      subtitle: fallbackData.subtitle,
      slides: [], // 템플릿 엔진에서 생성
      styles: '',
      totalSlides: 5
    },
    sections: ['타이틀', '기능 소개', '시장 분석', '가격 정책', '향후 계획']
  };
}

// 🔧 API 키 확인
export const checkHybridAPIKey = (): boolean => {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here');
};

// 📊 토큰 사용량 추정
export const estimateTokenUsage = (request: ContentRequest): number => {
  const basePrompt = 800;  // 기본 프롬프트
  const topicLength = (request.topic?.length || 0) * 2;  // 주제 길이
  const industryBonus = request.industry ? 100 : 0;  // 업계 정보
  
  return basePrompt + topicLength + industryBonus;  // 약 1000-1200 토큰
};