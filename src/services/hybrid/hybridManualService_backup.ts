// 📚 하이브리드 AI 설명서 서비스 - hybridManualService.ts
// services/hybrid/hybridManualService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../../types';

// 하이브리드 설명서 데이터 타입
interface HybridManualData {
  title: string;
  subtitle: string;
  category: 'technical' | 'user-guide' | 'tutorial' | 'reference' | 'troubleshooting';
  overview: {
    purpose: string;
    audience: string;
    requirements: string[];
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'steps' | 'warning' | 'note' | 'example';
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  }>;
  troubleshooting?: Array<{
    problem: string;
    solution: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  appendix?: {
    glossary?: Array<{ term: string; definition: string; }>;
    references?: string[];
    version: string;
    lastUpdated: string;
  };
}

// 🎯 설명서 AI 프롬프트 생성
const createManualPrompt = (request: ContentRequest): string => {
  const categoryHints = {
    'IT/기술': 'technical',
    '화장품/뷰티': 'user-guide',
    '식품/음료': 'user-guide',
    '패션/의류': 'user-guide',
    '자동차': 'technical',
    '건강/의료': 'reference',
    '금융': 'reference'
  };

  const suggestedCategory = categoryHints[request.industry as keyof typeof categoryHints] || 'user-guide';

  const targetLanguage = request.language === 'ko-zh' ? '한국어' : '중국어';
  const sourceLanguage = request.language === 'ko-zh' ? '중국어' : '한국어';
  
  return `
"${request.topic}"에 대한 전문적인 설명서 데이터를 ${targetLanguage}로 다음 JSON 형식으로 생성해주세요:

{
  "title": "명확하고 구체적인 설명서 제목 (40자 이내)",
  "subtitle": "설명서의 목적과 범위를 설명하는 부제목 (60자 이내)",
  "category": "${suggestedCategory}",
  "overview": {
    "purpose": "이 설명서의 목적과 달성 목표",
    "audience": "대상 사용자 (예: 초보자, 중급자, 전문가)",
    "requirements": ["필요한 준비사항1", "필요한 준비사항2", "필요한 준비사항3"]
  },
  "sections": [
    {
      "id": "section1",
      "title": "섹션 제목",
      "content": "상세 내용 설명",
      "type": "text",
      "subsections": [
        {"title": "하위 섹션", "content": "하위 내용"}
      ]
    },
    {
      "id": "section2", 
      "title": "단계별 진행",
      "content": "1. 첫 번째 단계\\n2. 두 번째 단계\\n3. 세 번째 단계",
      "type": "steps"
    },
    {
      "id": "section3",
      "title": "주의사항",
      "content": "중요한 주의사항 내용",
      "type": "warning"
    },
    {
      "id": "section4",
      "title": "팁과 권장사항",
      "content": "유용한 팁과 권장사항",
      "type": "note"
    },
    {
      "id": "section5",
      "title": "실제 예시",
      "content": "구체적인 예시와 활용 방법",
      "type": "example"
    }
  ],
  "troubleshooting": [
    {"problem": "문제 상황", "solution": "해결 방법", "severity": "medium"},
    {"problem": "문제 상황", "solution": "해결 방법", "severity": "low"}
  ],
  "faq": [
    {"question": "자주 묻는 질문1", "answer": "상세한 답변1"},
    {"question": "자주 묻는 질문2", "answer": "상세한 답변2"},
    {"question": "자주 묻는 질문3", "answer": "상세한 답변3"}
  ],
  "appendix": {
    "glossary": [
      {"term": "전문용어1", "definition": "용어 설명1"},
      {"term": "전문용어2", "definition": "용어 설명2"}
    ],
    "references": ["참고자료1", "참고자료2"],
    "version": "1.0",
    "lastUpdated": "2024-12-19"
  }
}

**중요한 요구사항:**
- 주제: ${request.topic}
- 생성 언어: ${targetLanguage} (모든 텍스트를 ${targetLanguage}로 작성)
- 스타일: ${request.style || '전문적이고 실용적인'}
- 난이도: ${request.difficulty}
- 대상: 실제 사용자가 따라할 수 있는 실용적인 내용
- 구조: 체계적이고 논리적인 순서
- 모든 제목, 내용, 설명을 ${targetLanguage}로 작성
- 상세도: 초보자도 이해할 수 있는 수준

반드시 위 JSON 형식으로만 응답하세요.
`;
};

// 🎨 설명서 카테고리별 템플릿 선택
const selectManualTemplate = (category: string): string => {
  const templates = {
    technical: 'tech-manual',
    'user-guide': 'user-manual',
    tutorial: 'tutorial-manual',
    reference: 'reference-manual',
    troubleshooting: 'troubleshoot-manual'
  };
  
  return templates[category as keyof typeof templates] || 'user-manual';
};

// 🚀 하이브리드 설명서 생성 (메인 함수)
export const generateHybridManual = async (
  request: ContentRequest,
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  try {
    console.log('📚 하이브리드 설명서 생성 시작:', request);
    
    onProgress?.(10, '🧠 AI 콘텐츠 분석 중...');
    const prompt = createManualPrompt(request);
    
    onProgress?.(25, '🤖 설명서 구조 생성 중...');
    const aiData = await callGeminiForManual(prompt);
    
    onProgress?.(50, '📋 전문 템플릿 적용 중...');
    const templateType = selectManualTemplate(aiData.category);
    
    onProgress?.(70, '📖 슬라이드 형태 설명서 생성 중...');
    // 🔥 슬라이드 형태로 분할 생성
    const manualSlides = await generateManualSlides(aiData, templateType);
    const fullManualHTML = await generateManualWithTemplate(aiData, templateType);
    
    onProgress?.(90, '✨ 최종 검토 및 최적화...');
    
    const result: GeneratedContent = {
      id: `hybrid_manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'manual' as ContentType,
      topic: request.topic,
      createdAt: new Date(),
      data: {
        title: aiData.title,
        subtitle: aiData.subtitle,
        content: fullManualHTML,
        category: aiData.category,
        templateType: templateType,
        sections: aiData.sections.map(section => section.title),
        totalSections: manualSlides.length,
        // 🔥 슬라이드 배열 추가 (PPT와 동일한 구조)
        slides: manualSlides
      },
      sections: manualSlides.map(slide => slide.title),
      html: fullManualHTML  // 🔥 PracticePage 호환을 위한 html 필드 추가
    };
    
    onProgress?.(100, '📚 하이브리드 설명서 생성 완료!');
    console.log('✅ 설명서 생성 결과:', result);
    return result;
    
  } catch (error) {
    console.error('🚨 설명서 생성 실패:', error);
    onProgress?.(100, '⚠️ 폴백 모드 실행 중...');
    return createManualFallback(request);
  }
};

// 🤖 Gemini API 호출 (설명서 데이터)
async function callGeminiForManual(prompt: string): Promise<HybridManualData> {
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
    
    console.log('📚 설명서 AI 응답:', responseText);
    
    // JSON 파싱
    const parsed = parseManualJSON(responseText);
    console.log('✅ 파싱된 설명서 데이터:', parsed);
    return parsed;
    
  } catch (error) {
    console.error('🚨 Gemini API 오류:', error);
    throw error;
  }
}

// 🔧 설명서 JSON 파싱
function parseManualJSON(responseText: string): HybridManualData {
  try {
    // JSON 추출 및 정리
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON을 찾을 수 없음');
    }
    
    let jsonText = jsonMatch[0]
      .replace(/[\u201C\u201D]/g, '"')  // 스마트 따옴표
      .replace(/[\u2018\u2019]/g, "'")  // 스마트 아포스트로피
      .replace(/[\u2013\u2014]/g, '-')  // 대시 문자
      .replace(/[\u2026]/g, '...')     // 말줄임표
      .replace(/,(\s*[}\]])/g, '$1')   // 마지막 콤마 제거
      .replace(/\\n/g, '\\n')         // 개행 문자 정리
      .replace(/\"([^\"]*)\"/g, (match, content) => {
        // 따옴표 안의 특수 문자 정리
        return '"' + content.replace(/"/g, "'") + '"';
      });
    
    // 추가 정리 단계
    jsonText = jsonText
      .replace(/:\s*"([^"]*?)"([^,}\]]*)/g, (match, content, after) => {
        // 닫히지 않은 따옴표 처리
        if (after.trim() && !after.trim().startsWith(',') && !after.trim().startsWith('}') && !after.trim().startsWith(']')) {
          return `: "${content}${after.trim()}"`;
        }
        return match;
      });
    
    console.log('🔧 정리된 JSON:', jsonText.substring(0, 500) + '...');
    
    const parsed = JSON.parse(jsonText);
    
    // 데이터 검증 및 기본값 설정
    return {
      title: parsed.title || '사용자 가이드',
      subtitle: parsed.subtitle || '상세 사용 방법',
      category: parsed.category || 'user-guide',
      overview: {
        purpose: parsed.overview?.purpose || '이 가이드의 목적을 설명합니다.',
        audience: parsed.overview?.audience || '모든 사용자',
        requirements: Array.isArray(parsed.overview?.requirements) ? 
          parsed.overview.requirements : ['기본적인 이해', '필요한 도구', '충분한 시간']
      },
      sections: Array.isArray(parsed.sections) ? parsed.sections : [
        {
          id: 'intro',
          title: '시작하기',
          content: '기본적인 소개와 설명입니다.',
          type: 'text'
        },
        {
          id: 'steps',
          title: '단계별 진행',
          content: '1. 첫 번째 단계\n2. 두 번째 단계\n3. 세 번째 단계',
          type: 'steps'
        }
      ],
      troubleshooting: Array.isArray(parsed.troubleshooting) ? 
        parsed.troubleshooting : [
          { problem: '일반적인 문제', solution: '해결 방법', severity: 'medium' }
        ],
      faq: Array.isArray(parsed.faq) ? parsed.faq : [
        { question: '자주 묻는 질문', answer: '상세한 답변' }
      ],
      appendix: {
        glossary: Array.isArray(parsed.appendix?.glossary) ? 
          parsed.appendix.glossary : [],
        references: Array.isArray(parsed.appendix?.references) ? 
          parsed.appendix.references : [],
        version: parsed.appendix?.version || '1.0',
        lastUpdated: parsed.appendix?.lastUpdated || new Date().toISOString().split('T')[0]
      }
    };
    
  } catch (error) {
    console.error('❌ 설명서 JSON 파싱 실패:', error);
    throw new Error('AI 응답을 파싱할 수 없습니다.');
  }
}

// 🎨 템플릿 기반 설명서 HTML 생성
async function generateManualWithTemplate(data: HybridManualData, templateType: string): Promise<string> {
  const { getManualTemplate } = await import('./templates/manualTemplateEngine');
  return getManualTemplate(data, templateType);
}

// 🔥 실라이드 형태 매뉴얼 생성 함수
async function generateManualSlides(data: HybridManualData, templateType: string): Promise<Array<{
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}>> {
  const { getManualSlideTemplate } = await import('./templates/manualTemplateEngine');
  
  // 📦 4개 주요 슬라이드로 축약
  const slideConfig = [
    {
      id: 1,
      title: '📱 기본 이해',
      subtitle: '기본 개념 및 사용법 소개',
      type: 'basic',
      content: {
        overview: data.overview,
        sections: data.sections.filter(s => 
          s.title.includes('기본') || s.title.includes('이해') || s.title.includes('소개')
        ).slice(0, 3)
      }
    },
    {
      id: 2,
      title: '⚙️ 고급 설정 및 유용한 기능',
      subtitle: '고급 기능과 활용법',
      type: 'advanced',
      content: {
        sections: data.sections.filter(s => 
          s.title.includes('고급') || s.title.includes('설정') || s.title.includes('기능') || s.title.includes('활용')
        ).slice(0, 3)
      }
    },
    {
      id: 3,
      title: '🔧 문제 해결',
      subtitle: '일반적인 문제와 해결 방법',
      type: 'troubleshooting',
      content: {
        troubleshooting: data.troubleshooting?.slice(0, 4) || []
      }
    },
    {
      id: 4,
      title: '❓ 자주 묻는 질문',
      subtitle: 'FAQ 및 추가 정보',
      type: 'faq',
      content: {
        faq: data.faq?.slice(0, 4) || [],
        appendix: data.appendix
      }
    }
  ];
  
  const slides = [];
  
  for (const config of slideConfig) {
    const slideHTML = await getManualSlideTemplate({
      ...data,
      slideConfig: config
    }, templateType);
    
    slides.push({
      id: config.id,
      title: config.title,
      subtitle: config.subtitle,
      html: slideHTML
    });
  }
  
  return slides;
}

// ⚠️ 설명서 폴백 생성
function createManualFallback(request: ContentRequest): GeneratedContent {
  const fallbackData: HybridManualData = {
    title: request.topic || '사용자 가이드',
    subtitle: '완전한 사용 방법 안내',
    category: 'user-guide',
    overview: {
      purpose: '이 가이드는 효과적인 사용법을 제공합니다.',
      audience: '모든 사용자',
      requirements: ['기본 지식', '필요한 도구', '인터넷 연결']
    },
    sections: [
      {
        id: 'intro',
        title: '소개',
        content: '이 가이드에서는 기본적인 사용법을 알아봅니다.',
        type: 'text'
      },
      {
        id: 'getting-started',
        title: '시작하기',
        content: '1. 준비사항 확인\n2. 초기 설정\n3. 기본 사용법 익히기',
        type: 'steps'
      }
    ],
    faq: [
      {
        question: '어떻게 시작하나요?',
        answer: '가이드의 첫 번째 단계부터 차근차근 따라해보세요.'
      }
    ]
  };
  
  // 🔥 폴백도 슬라이드 형태로 생성
  const fallbackSlides = [
    {
      id: 1,
      title: '📱 기본 이해',
      subtitle: '기본 개념 및 사용법 소개',
      html: createFallbackSlideHTML('기본 이해', '스마트폰의 기본적인 구성 요소와 기본 조작 방법을 알아봅니다.', 'basic')
    },
    {
      id: 2,
      title: '⚙️ 고급 설정 및 유용한 기능',
      subtitle: '개인화 설정과 스마트한 활용법',
      html: createFallbackSlideHTML('고급 설정', '개인화 설정과 효율적인 사용을 위한 고급 기능들을 알아봅니다.', 'advanced')
    },
    {
      id: 3,
      title: '🔧 문제 해결',
      subtitle: '일반적인 문제와 해결 방법',
      html: createFallbackSlideHTML('문제 해결', '자주 발생하는 문제들과 그 해결 방법을 알아봅니다.', 'troubleshooting')
    },
    {
      id: 4,
      title: '❓ 자주 묻는 질문',
      subtitle: 'FAQ 및 추가 정보',
      html: createFallbackSlideHTML('FAQ', '자주 묻는 질문과 답변, 그리고 추가적인 도움이 되는 정보들을 확인해보세요.', 'faq')
    }
  ];
  
  const fallbackHTML = `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', sans-serif;">
      <h1 style="color: #2c3e50; margin-bottom: 20px;">${fallbackData.title}</h1>
      <p style="color: #7f8c8d; margin-bottom: 30px;">${fallbackData.subtitle}</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h3 style="color: #34495e; margin-bottom: 15px;">📋 개요</h3>
        <p><strong>목적:</strong> ${fallbackData.overview.purpose}</p>
        <p><strong>대상:</strong> ${fallbackData.overview.audience}</p>
        <div><strong>준비사항:</strong>
          <ul>${fallbackData.overview.requirements.map(req => `<li>${req}</li>`).join('')}</ul>
        </div>
      </div>
      ${fallbackData.sections.map(section => `
        <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #3498db; background: white;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">${section.title}</h3>
          <p>${section.content}</p>
        </div>
      `).join('')}
    </div>
  `;
  
  return {
    id: `manual_fallback_${Date.now()}`,
    type: 'manual' as ContentType,
    topic: request.topic,
    createdAt: new Date(),
    data: {
      title: fallbackData.title,
      subtitle: fallbackData.subtitle,
      content: fallbackHTML,
      category: fallbackData.category,
      sections: fallbackSlides.map(s => s.title),
      totalSections: fallbackSlides.length,
      // 🔥 폴백도 슬라이드 배열
      slides: fallbackSlides
    },
    sections: fallbackSlides.map(s => s.title),
    html: fallbackHTML
  };
}

// 🔥 폴백 슬라이드 HTML 생성
function createFallbackSlideHTML(title: string, content: string, type: string): string {
  const themeColors = {
    basic: '#3498db',
    advanced: '#9b59b6',
    troubleshooting: '#e74c3c',
    faq: '#27ae60'
  };
  
  const color = themeColors[type as keyof typeof themeColors] || '#3498db';
  
  return `
    <div style="
      background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
      color: white;
      min-height: 600px;
      padding: 60px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    ">
      <h1 style="
        font-size: 3rem;
        margin-bottom: 30px;
        text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
      ">${title}</h1>
      
      <p style="
        font-size: 1.4rem;
        line-height: 1.8;
        max-width: 600px;
        opacity: 0.95;
        text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
      ">${content}</p>
      
      <div style="
        margin-top: 40px;
        background: rgba(255,255,255,0.2);
        padding: 15px 30px;
        border-radius: 25px;
        backdrop-filter: blur(10px);
        font-size: 1rem;
      ">
        자세한 내용은 주제를 입력하여 AI 매뉴얼을 생성해보세요 🚀
      </div>
    </div>
  `;
}

// 🔧 API 키 확인
export const checkManualAPIKey = (): boolean => {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here');
};

// 📊 토큰 사용량 추정
export const estimateManualTokenUsage = (request: ContentRequest): number => {
  const basePrompt = 1200;  // 설명서 프롬프트 (더 상세함)
  const topicLength = (request.topic?.length || 0) * 3;  // 주제 길이
  const industryBonus = request.industry ? 150 : 0;  // 업계 정보
  
  return basePrompt + topicLength + industryBonus;  // 약 1400-1600 토큰
};
