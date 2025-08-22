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

// 🎯 설명서 AI 프롬프트 생성 (언어 설정 수정)
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

  // ✅ 언어 설정 수정
  let targetLanguage = '中文';
  let languageInstruction = '请用中文生成';
  
  if (request.language === 'zh-ko') {
    targetLanguage = '한국어';
    languageInstruction = '한국어로 생성해주세요';
  }
  
  return `
"${request.topic}"에 대한 전문적인 설명서 데이터를 ${targetLanguage}로 다음 JSON 형식으로 생성해주세요.

${languageInstruction}. 모든 텍스트 내용을 반드시 ${targetLanguage}로 작성하세요.

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
- 생성 언어: ${targetLanguage} (모든 텍스트를 반드시 ${targetLanguage}로 작성)
- 스타일: ${request.style || '전문적이고 실용적인'}
- 난이도: ${request.difficulty}
- 대상: 실제 사용자가 따라할 수 있는 실용적인 내용
- 구조: 체계적이고 논리적인 순서
- 상세도: 초보자도 이해할 수 있는 수준

${targetLanguage === '中文' ? 
  '请使用简体中文生成所有内容，包括标题、说明、步骤等所有文字。' : 
  '모든 내용을 한국어로 작성해주세요.'}

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
    const manualSlides = await generateManualSlides(aiData, templateType, request);
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
        slides: manualSlides
      },
      sections: manualSlides.map(slide => slide.title),
      html: fullManualHTML
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
    
    const parsed = parseManualJSON(responseText);
    console.log('✅ 파싱된 설명서 데이터:', parsed);
    return parsed;
    
  } catch (error) {
    console.error('🚨 Gemini API 오류:', error);
    throw error;
  }
}

// 🔧 개선된 JSON 파싱 함수
function parseManualJSON(responseText: string): HybridManualData {
  try {
    // 1. 마크다운 코드 블록 제거
    let cleanText = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // 2. JSON 추출
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON을 찾을 수 없음');
    }
    
    // 3. JSON 정리
    let jsonText = jsonMatch[0]
      // 유니코드 인용부호 정규화
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/[\u2026]/g, '...')
      // 후행 쉼표 제거
      .replace(/,(\s*[}\]])/g, '$1')
      // 이스케이프된 개행 문자 처리
      .replace(/\\n/g, '\\n');
    
    // 4. 잘린 JSON 복구 시도
    if (!jsonText.trim().endsWith('}')) {
      console.log('🔧 잘린 JSON 감지, 복구 시도...');
      
      // 마지막 완전한 속성까지만 사용
      const lastCommaIndex = jsonText.lastIndexOf(',');
      const lastValidEndIndex = jsonText.lastIndexOf('}', lastCommaIndex);
      
      if (lastValidEndIndex > 0) {
        jsonText = jsonText.substring(0, lastValidEndIndex + 1);
      } else {
        // 기본 구조로 마무리
        if (!jsonText.includes('"appendix"')) {
          jsonText = jsonText.replace(/,?\s*$/, '') + ',"appendix":{"version":"1.0","lastUpdated":"' + new Date().toISOString().split('T')[0] + '"}}';
        } else if (!jsonText.trim().endsWith('}')) {
          jsonText = jsonText.replace(/,?\s*$/, '') + '}';
        }
      }
    }
    
    console.log('🔧 정리된 JSON (앞부분):', jsonText.substring(0, 500) + '...');
    
    const parsed = JSON.parse(jsonText);
    return createValidatedManualData(parsed);
    
  } catch (error) {
    console.error('❌ 설명서 JSON 파싱 실패:', error);
    console.error('원본 응답 텍스트:', responseText.substring(0, 1000) + '...');
    
    // 백업 파싱 시도
    try {
      console.log('🔧 백업 파싱 시도...');
      
      // 간단한 정규식으로 주요 필드만 추출
      const titleMatch = responseText.match(/"title"\s*:\s*"([^"]+)"/);
      const subtitleMatch = responseText.match(/"subtitle"\s*:\s*"([^"]+)"/);
      
      if (titleMatch || subtitleMatch) {
        console.log('✅ 부분 파싱 성공');
        return createFallbackManualData(titleMatch?.[1] || '사용자 가이드');
      }
      
    } catch (backupError) {
      console.error('🚨 백업 파싱도 실패:', backupError);
    }
    
    console.log('🔄 완전 폴백 모드...');
    return createFallbackManualData();
  }
}

// 🔧 검증된 매뉴얼 데이터 생성
function createValidatedManualData(parsed: any): HybridManualData {
  return {
    title: parsed.title || '使用指南',
    subtitle: parsed.subtitle || '详细使用方法说明',
    category: parsed.category || 'user-guide',
    overview: {
      purpose: parsed.overview?.purpose || '本指南旨在帮助用户了解和使用产品。',
      audience: parsed.overview?.audience || '所有用户',
      requirements: Array.isArray(parsed.overview?.requirements) ? 
        parsed.overview.requirements : ['基本了解', '必要工具', '充足时间']
    },
    sections: Array.isArray(parsed.sections) && parsed.sections.length > 0 ? 
      parsed.sections : [
        {
          id: 'intro',
          title: '开始使用',
          content: '基本介绍和说明。',
          type: 'text'
        },
        {
          id: 'steps',
          title: '步骤说明',
          content: '1. 第一步\n2. 第二步\n3. 第三步',
          type: 'steps'
        }
      ],
    troubleshooting: Array.isArray(parsed.troubleshooting) && parsed.troubleshooting.length > 0 ? 
      parsed.troubleshooting : [
        { problem: '常见问题', solution: '解决方法', severity: 'medium' }
      ],
    faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 ? 
      parsed.faq : [
        { question: '常见问题', answer: '详细解答' }
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
}

// 🔧 폴백 매뉴얼 데이터 생성
function createFallbackManualData(topic?: string): HybridManualData {
  const topicName = topic || 'Galaxy Watch';
  return {
    title: `${topicName} 사용자 가이드`,
    subtitle: `${topicName}를 효과적으로 사용하는 방법`,
    category: 'user-guide',
    overview: {
      purpose: `${topicName}의 기본 기능부터 고급 활용법까지 전반적인 사용법을 안내합니다.`,
      audience: `${topicName} 사용자`,
      requirements: ['기본 준비사항', '필요한 설정', '인터넷 연결']
    },
    sections: [
      {
        id: 'basic',
        title: '기본 설정 및 준비',
        content: `${topicName}의 기본 설정 방법과 올바른 준비 과정을 알아봅니다.`,
        type: 'text'
      },
      {
        id: 'functions',
        title: '주요 기능 활용',
        content: '1. 알림 확인하기\n2. 건강 데이터 모니터링\n3. 앱 사용하기\n4. 설정 조정하기',
        type: 'steps'
      },
      {
        id: 'health',
        title: '건강 기능 활용',
        content: '심박수 측정, 운동 추적, 수면 모니터링 등 건강 관련 기능을 활용하는 방법을 설명합니다.',
        type: 'text'
      }
    ],
    troubleshooting: [
      { problem: '워치가 연결되지 않아요', solution: '블루투스 연결을 확인하고 Galaxy Wearable 앱을 재시작해보세요.', severity: 'medium' },
      { problem: '배터리가 빨리 닳아요', solution: '화면 밝기를 낮추고 불필요한 알림을 끄세요.', severity: 'low' }
    ],
    faq: [
      { question: '워치 페이스를 어떻게 바꾸나요?', answer: '워치 화면을 길게 누르거나 Galaxy Wearable 앱에서 변경할 수 있습니다.' },
      { question: '방수 기능이 있나요?', answer: '갤럭시 워치는 5ATM 방수를 지원하여 수영 시에도 사용 가능합니다.' }
    ],
    appendix: {
      glossary: [
        { term: 'Galaxy Wearable', definition: '갤럭시 워치를 관리하는 스마트폰 앱' },
        { term: '5ATM', definition: '50미터 수심까지 방수가 되는 등급' }
      ],
      references: ['갤럭시 워치 공식 매뉴얼', 'Samsung Health 가이드'],
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0]
    }
  };
}

// 🎨 템플릿 기반 설명서 HTML 생성
async function generateManualWithTemplate(data: HybridManualData, templateType: string): Promise<string> {
  const { getManualTemplate } = await import('./templates/manualTemplateEngine');
  return getManualTemplate(data, templateType);
}

// 🔥 슬라이드 형태 매뉴얼 생성 함수
async function generateManualSlides(data: HybridManualData, templateType: string, request?: ContentRequest): Promise<Array<{
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}>> {
  const { getManualSlideTemplate } = await import('./templates/manualTemplateEngine');
  
  // 언어별 제목 설정
  const isChinese = request?.language === 'zh-ko';
  const slideTitles = {
    basic: {
      title: isChinese ? '📱 基本了解' : '📱 기본 이해',
      subtitle: isChinese ? '基本概念及使用方法介绍' : '기본 개념 및 사용법 소개'
    },
    advanced: {
      title: isChinese ? '⚙️ 高级设置及实用功能' : '⚙️ 고급 설정 및 유용한 기능',
      subtitle: isChinese ? '高级功能及使用方法' : '고급 기능과 활용법'
    },
    troubleshooting: {
      title: isChinese ? '🔧 问题解决' : '🔧 문제 해결',
      subtitle: isChinese ? '常见问题及解决方法' : '일반적인 문제와 해결 방법'
    },
    faq: {
      title: isChinese ? '❓ 常见问题' : '❓ 자주 묻는 질문',
      subtitle: isChinese ? 'FAQ及其他信息' : 'FAQ 및 추가 정보'
    }
  };
  
  const slideConfig = [
    {
      id: 1,
      title: slideTitles.basic.title,
      subtitle: slideTitles.basic.subtitle,
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
      title: slideTitles.advanced.title,
      subtitle: slideTitles.advanced.subtitle,
      type: 'advanced',
      content: {
        sections: data.sections.filter(s => 
          s.title.includes('고급') || s.title.includes('설정') || s.title.includes('기능') || s.title.includes('활용')
        ).slice(0, 3)
      }
    },
    {
      id: 3,
      title: slideTitles.troubleshooting.title,
      subtitle: slideTitles.troubleshooting.subtitle,
      type: 'troubleshooting',
      content: {
        troubleshooting: data.troubleshooting?.slice(0, 4) || []
      }
    },
    {
      id: 4,
      title: slideTitles.faq.title,
      subtitle: slideTitles.faq.subtitle,
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
  const fallbackData: HybridManualData = createFallbackManualData(request.topic);
  
  const fallbackSlides = [
    {
      id: 1,
      title: '📱 基本了解',
      subtitle: '基本概念及使用方法介绍',
      html: createFallbackSlideHTML('基本了解', '', 'basic', request.topic)
    },
    {
      id: 2,
      title: '⚙️ 高级设置及实用功能',
      subtitle: '个性化设置和智能使用方法',
      html: createFallbackSlideHTML('高级设置', '', 'advanced', request.topic)
    },
    {
      id: 3,
      title: '🔧 问题解决',
      subtitle: '常见问题及解决方法',
      html: createFallbackSlideHTML('问题解决', '', 'troubleshooting', request.topic)
    },
    {
      id: 4,
      title: '❓ 常见问题',
      subtitle: 'FAQ及其他信息',
      html: createFallbackSlideHTML('FAQ', '', 'faq', request.topic)
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
      slides: fallbackSlides
    },
    sections: fallbackSlides.map(s => s.title),
    html: fallbackHTML
  };
}

// 🔥 폴백 슬라이드 HTML 생성
function createFallbackSlideHTML(title: string, content: string, type: string, topic?: string): string {
  const themeColors = {
    basic: '#3498db',
    advanced: '#9b59b6',
    troubleshooting: '#e74c3c',
    faq: '#27ae60'
  };
  
  const color = themeColors[type as keyof typeof themeColors] || '#3498db';
  const dynamicContent = generateDynamicContent(type, topic || '해당 주제');
  
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
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
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
      ">${dynamicContent}</p>
      
      <div style="
        margin-top: 40px;
        background: rgba(255,255,255,0.2);
        padding: 15px 30px;
        border-radius: 25px;
        backdrop-filter: blur(10px);
        font-size: 1rem;
      ">
        请输入主题生成详细的AI手册 🚀
      </div>
    </div>
  `;
}

// 🎯 주제에 맞는 동적 콘텐츠 생성 (중국어 버전)
function generateDynamicContent(type: string, topic: string): string {
  const topicKeyword = topic.replace(/使用法|指南|手册|说明书/g, '').trim();
  
  switch (type) {
    case 'basic':
      return `了解${topicKeyword}的基本组成部分和基本操作方法。`;
    
    case 'advanced':
      return `了解${topicKeyword}的个性化设置和高效使用的高级功能。`;
    
    case 'troubleshooting':
      return `了解${topicKeyword}使用中常见问题及其解决方法。`;
    
    case 'faq':
      return `查看关于${topicKeyword}的常见问题和答案，以及其他有用信息。`;
    
    default:
      return `了解关于${topicKeyword}的有用信息和使用方法。`;
  }
}

// 🔧 API 키 확인
export const checkManualAPIKey = (): boolean => {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here');
};

// 📊 토큰 사용량 추정
export const estimateManualTokenUsage = (request: ContentRequest): number => {
  const basePrompt = 1200;
  const topicLength = (request.topic?.length || 0) * 3;
  const industryBonus = request.industry ? 150 : 0;
  
  return basePrompt + topicLength + industryBonus;
};
