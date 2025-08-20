import { ContentRequest, GeneratedContent, ContentType, TranslationAnalysis } from '../types';

// 환경변수에서 API 키 가져오기
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
const API_TIMEOUT = parseInt((import.meta as any).env?.VITE_API_TIMEOUT || '30000');

// Gemini API 엔드포인트
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// 콘텐츠 타입별 구조 가이드
const getStructureGuide = (type: ContentType): string => {
  switch (type) {
    case 'ppt':
      return `
- 제목 슬라이드: 제품명, 부제목, 출시일
- 기능 소개: 3-4개 핵심 기능 (아이콘 + 설명)
- 시장 분석: 시장 점유율, 경쟁사 비교
- 제품 라인업: 모델별 특징과 가격
- 가격 정책: 기본 가격, 할인 혜택, 할부 조건`;
    
    case 'brochure':
      return `
- 브랜드 헤더: 브랜드명, 슬로건, 컬러 테마
- 제품 카탈로그: 3개 제품 (이름, 설명, 가격, 특징)
- 특별 혜택: 할인 정보, 프로모션 조건
- 연락처: 웹사이트, 전화번호, 주소`;
    
    case 'manual':
      return `
- 개요: 제품 소개, 주요 특징
- 설치/설정: 단계별 설정 방법
- 사용법: 기본 조작법, 고급 기능
- 문제 해결: 자주 발생하는 문제와 해결책
- 유지보수: 청소, 보관, 관리 방법`;
    
    default:
      return '';
  }
};

// 콘텐츠 생성 프롬프트 생성
const createContentPrompt = (request: ContentRequest): string => {
  return `
당신은 전문 콘텐츠 제작자입니다. 다음 요구사항에 맞는 ${request.type} 콘텐츠를 제작해주세요.

【요구사항】
- 콘텐츠 타입: ${request.type}
- 주제: ${request.topic}
- 난이도: ${request.difficulty}
- 작성 스타일: ${request.style}
- 업계: ${request.industry || '일반'}
- 대상 언어: 한국어 → 영어 번역 연습용

【${request.type} 구조】
${getStructureGuide(request.type)}

【중요】반드시 다음 JSON 형식으로만 응답해주세요. 다른 설명이나 텍스트는 포함하지 마세요:

{
  "title": "메인 제목",
  "sections": [
    {
      "title": "섹션 제목",
      "content": "번역할 한국어 텍스트",
      "context": "번역 시 참고할 맥락 정보"
    }
  ]
}

실제 비즈니스에서 사용할 수 있는 수준의 전문적이고 실용적인 내용으로 작성해주세요.
번역 연습에 적합하도록 명확하고 구체적인 문장을 사용해주세요.
`;
};

// 번역 분석 프롬프트 생성
const createAnalysisPrompt = (original: string, translation: string, contentType: string): string => {
  return `
전문 번역 평가자로서 다음 번역을 분석해주세요.

【원문】${original}
【번역문】${translation}
【콘텐츠 타입】${contentType}

【평가 기준】
1. 정확성 (0-100): 원문 의미 전달 정도
2. 자연스러움 (0-100): 영어로서의 자연스러움
3. 적합성 (0-100): 해당 콘텐츠 타입에 맞는 문체

【중요】반드시 다음 JSON 형식으로만 응답해주세요. 다른 설명이나 텍스트는 포함하지 마세요:

{
  "scores": { "accuracy": 85, "fluency": 78, "appropriateness": 92 },
  "feedback": {
    "strengths": ["구체적인 장점1", "구체적인 장점2"],
    "improvements": ["구체적인 개선점1", "구체적인 개선점2"],
    "suggestions": ["더 나은 표현1", "더 나은 표현2"]
  },
  "referenceTranslation": "전문가 수준의 참고 번역"
}
`;
};

// Gemini API 호출 함수
const callGeminiAPI = async (prompt: string): Promise<any> => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API 키가 설정되지 않았습니다. .env 파일에서 VITE_GEMINI_API_KEY를 설정해주세요.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
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
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      
      console.log('AI 응답 원문:', text);
      
      // JSON 파싱 시도
      try {
        // JSON 코드 블록에서 JSON 추출
        let jsonText = text.trim();
        
        // ```json ... ``` 형태인 경우 추출
        if (jsonText.includes('```json')) {
          const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonText = jsonMatch[1].trim();
          }
        }
        
        // ``` ... ``` 형태인 경우 추출
        if (jsonText.includes('```') && !jsonText.includes('```json')) {
          const codeMatch = jsonText.match(/```\s*([\s\S]*?)\s*```/);
          if (codeMatch) {
            jsonText = codeMatch[1].trim();
          }
        }
        
        const parsed = JSON.parse(jsonText);
        console.log('JSON 파싱 성공:', parsed);
        return parsed;
      } catch (parseError) {
        console.error('JSON 파싱 실패:', parseError);
        console.log('파싱 실패한 텍스트:', text);
        // JSON 파싱 실패 시 텍스트 그대로 반환
        return { rawText: text };
      }
    } else {
      throw new Error('API 응답 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('API 호출 시간이 초과되었습니다.');
      }
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

// AI 콘텐츠 생성
export const generateContentWithAI = async (request: ContentRequest): Promise<GeneratedContent> => {
  try {
    console.log('AI 콘텐츠 생성 시작:', request);
    
    const prompt = createContentPrompt(request);
    const response = await callGeminiAPI(prompt);
    
    // 응답 처리
    if (response.rawText) {
      // JSON 파싱 실패한 경우 기본 구조로 변환
      const sections = response.rawText
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string, index: number) => ({
          title: `섹션 ${index + 1}`,
          content: line,
          context: `${request.type} 콘텐츠의 ${index + 1}번째 섹션`
        }));
      
      return {
        id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: request.type,
        topic: request.topic,
        createdAt: new Date(),
        data: { title: request.topic, sections },
        sections: sections.map((section: any, index: number) => ({
          id: `section_${index}`,
          originalText: section.content
        }))
      };
    }
    
    // 정상적인 JSON 응답 처리
    const sections = response.sections || [];
    
    return {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: request.type,
      topic: request.topic,
      createdAt: new Date(),
      data: response,
      sections: sections.map((section: any, index: number) => ({
        id: `section_${index}`,
        originalText: section.content
      }))
    };
    
  } catch (error) {
    console.error('AI 콘텐츠 생성 실패:', error);
    throw error;
  }
};

// AI 번역 분석
export const analyzeTranslation = async (
  original: string, 
  translation: string, 
  contentType: ContentType
): Promise<TranslationAnalysis> => {
  try {
    console.log('AI 번역 분석 시작');
    
    const prompt = createAnalysisPrompt(original, translation, contentType);
    const response = await callGeminiAPI(prompt);
    
    // 응답 처리
    if (response.rawText) {
      // JSON 파싱 실패한 경우 기본 분석 결과 반환
      return {
        scores: { accuracy: 75, fluency: 70, appropriateness: 80 },
        feedback: {
          strengths: ['번역이 전반적으로 이해 가능합니다'],
          improvements: ['더 자연스러운 영어 표현이 필요합니다'],
          suggestions: ['더 구체적이고 명확한 표현을 사용해보세요']
        },
        referenceTranslation: '전문가 수준의 참고 번역을 제공할 수 없습니다.'
      };
    }
    
    // 정상적인 JSON 응답 처리
    return {
      scores: response.scores || { accuracy: 75, fluency: 70, appropriateness: 80 },
      feedback: response.feedback || {
        strengths: [],
        improvements: [],
        suggestions: []
      },
      referenceTranslation: response.referenceTranslation || '참고 번역을 제공할 수 없습니다.'
    };
    
  } catch (error) {
    console.error('AI 번역 분석 실패:', error);
    throw error;
  }
};

// API 키 확인
export const checkAPIKey = (): boolean => {
  return !!(API_KEY && API_KEY !== 'your_api_key_here');
};
