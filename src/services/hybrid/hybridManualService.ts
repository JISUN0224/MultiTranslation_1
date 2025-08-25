// 📚 하이브리드 AI 설명서 서비스 - hybridManualService.ts
// services/hybrid/hybridManualService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../../types';

// 하이브리드 설명서 데이터 타입
interface HybridManualData {
  title: string;
  subtitle: string;
  version: string;
  date: string;
  basicUsage: {
    initialSetup: {
      title: string;
      description: string;
      steps: string[];
    };
    basicGestures: {
      title: string;
      description: string;
      gestures: Array<{ name: string; description: string; }>;
    };
    watchfaceCustomization: {
      title: string;
      description: string;
      steps: string[];
    };
  };
  precautions: {
    batteryManagement: {
      title: string;
      description: string;
      tips: string[];
    };
    waterproofPrecautions: {
      title: string;
      description: string;
      tips: string[];
    };
    smartphoneConnection: {
      title: string;
      description: string;
      tips: string[];
    };
  };
  troubleshooting: Array<{
    problem: string;
    solution: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

// 🎯 설명서 AI 프롬프트 생성 (언어 설정 수정)
const createManualPrompt = (request: ContentRequest): string => {
  // ✅ 언어 설정 수정 - PPT 서비스와 동일한 로직 적용
  const isKorean = request.language === 'ko-zh';
  const targetLanguage = isKorean ? '한국어' : '중국어';
  const languageInstruction = isKorean ? '한국어로 생성해주세요' : '중국어로 생성해주세요';
  const dateFormat = isKorean ? 'ko-KR' : 'zh-CN';
  
  const exampleContent = {
    title: isKorean ? "제품 사용 가이드" : "产品使用指南",
    subtitle: isKorean ? "상세한 제품 사용법과 주의사항" : "详细的产品使用方法和注意事项",
    initialSetup: {
      title: isKorean ? "초기 설정" : "初始设置",
      description: isKorean ? "제품을 처음 사용할 때 따라야 할 단계를 설명합니다" : "产品首次使用时的设置步骤说明",
      steps: isKorean ? ["단계1", "단계2", "단계3", "단계4"] : ["步骤1", "步骤2", "步骤3", "步骤4"]
    },
    basicGestures: {
      title: isKorean ? "기본 조작" : "基本操作",
      description: isKorean ? "제품의 기본적인 조작 방법을 설명합니다" : "产品的基本操作方法说明",
      gestures: isKorean ? [
        {"name": "기본 조작1", "description": "기본 조작 방법의 상세 설명"},
        {"name": "기본 조작2", "description": "기본 조작 방법의 상세 설명"},
        {"name": "기본 조작3", "description": "기본 조작 방법의 상세 설명"},
        {"name": "기본 조작4", "description": "기본 조작 방법의 상세 설명"}
      ] : [
        {"name": "基本操作1", "description": "基本操作方法的详细说明"},
        {"name": "基本操作2", "description": "基本操作方法的详细说明"},
        {"name": "基本操作3", "description": "基本操作方法的详细说明"},
        {"name": "基本操作4", "description": "基本操作方法的详细说明"}
      ]
    },
    watchfaceCustomization: {
      title: isKorean ? "개인화 설정" : "个性化设置",
      description: isKorean ? "개인 취향에 맞게 설정을 변경하는 방법을 설명합니다" : "根据个人喜好更改设置的方法说明",
      steps: isKorean ? ["단계1", "단계2", "단계3", "단계4"] : ["步骤1", "步骤2", "步骤3", "步骤4"]
    },
    batteryManagement: {
      title: isKorean ? "유지보수" : "维护保养",
      description: isKorean ? "제품 유지보수와 관리를 위한 주의사항을 설명합니다" : "产品维护和保养的注意事项说明",
      tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
    },
    waterproofPrecautions: {
      title: isKorean ? "사용 주의사항" : "使用注意事项",
      description: isKorean ? "사용 시 주의사항과 예방 조치를 설명합니다" : "使用时的注意事项和预防措施说明",
      tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
    },
    smartphoneConnection: {
      title: isKorean ? "연결 및 동기화" : "连接与同步",
      description: isKorean ? "다른 기기와의 연결 및 동기화를 위한 팁을 제공합니다" : "与其他设备连接和同步的提示",
      tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
    },
    troubleshooting: isKorean ? [
      {
        "problem": "문제 상황 1",
        "solution": ["해결 방법 1", "해결 방법 2", "해결 방법 3", "해결 방법 4"]
      },
      {
        "problem": "문제 상황 2", 
        "solution": ["해결 방법 1", "해결 방법 2", "해결 방법 3", "해결 방법 4"]
      },
      {
        "problem": "문제 상황 3",
        "solution": ["해결 방법 1", "해결 방법 2", "해결 방법 3", "해결 방법 4"]
      }
    ] : [
      {
        "problem": "问题情况1",
        "solution": ["解决方法1", "解决方法2", "解决方法3", "解决方法4"]
      },
      {
        "problem": "问题情况2", 
        "solution": ["解决方法1", "解决方法2", "解决方法3", "解决方法4"]
      },
      {
        "problem": "问题情况3",
        "solution": ["解决方法1", "解决方法2", "解决方法3", "解决方法4"]
      }
    ],
    faq: isKorean ? [
      {
        "question": "자주 묻는 질문 1",
        "answer": "질문에 대한 답변을 상세히 설명합니다"
      },
      {
        "question": "자주 묻는 질문 2",
        "answer": "질문에 대한 답변을 상세히 설명합니다"
      },
      {
        "question": "자주 묻는 질문 3",
        "answer": "질문에 대한 답변을 상세히 설명합니다"
      }
    ] : [
      {
        "question": "常见问题1",
        "answer": "详细的问题解答说明"
      },
      {
        "question": "常见问题2",
        "answer": "详细的问题解答说明"
      },
      {
        "question": "常见问题3",
        "answer": "详细的问题解答说明"
      }
    ]
  };
  
  return `
"${request.topic}"에 대한 전문적인 매뉴얼 데이터를 ${targetLanguage}로 다음 JSON 형식으로 생성해주세요.

${languageInstruction}. 모든 텍스트 내용을 반드시 ${targetLanguage}로 작성하세요.

{
  "title": "${exampleContent.title}",
  "subtitle": "${exampleContent.subtitle}",
  "version": "1.0",
  "date": "${new Date().toLocaleDateString(dateFormat)}",
  "language": "${isKorean ? 'ko-zh' : 'zh-ko'}",
  "basicUsage": {
    "initialSetup": {
      "title": "${exampleContent.initialSetup.title}",
      "description": "${exampleContent.initialSetup.description}",
      "steps": ${JSON.stringify(exampleContent.initialSetup.steps)}
    },
    "basicGestures": {
      "title": "${exampleContent.basicGestures.title}",
      "description": "${exampleContent.basicGestures.description}",
      "gestures": ${JSON.stringify(exampleContent.basicGestures.gestures)}
    },
    "watchfaceCustomization": {
      "title": "${exampleContent.watchfaceCustomization.title}",
      "description": "${exampleContent.watchfaceCustomization.description}",
      "steps": ${JSON.stringify(exampleContent.watchfaceCustomization.steps)}
    }
  },
  "precautions": {
    "batteryManagement": {
      "title": "${exampleContent.batteryManagement.title}",
      "description": "${exampleContent.batteryManagement.description}",
      "tips": ${JSON.stringify(exampleContent.batteryManagement.tips)}
    },
    "waterproofPrecautions": {
      "title": "${exampleContent.waterproofPrecautions.title}",
      "description": "${exampleContent.waterproofPrecautions.description}",
      "tips": ${JSON.stringify(exampleContent.waterproofPrecautions.tips)}
    },
    "smartphoneConnection": {
      "title": "${exampleContent.smartphoneConnection.title}",
      "description": "${exampleContent.smartphoneConnection.description}",
      "tips": ${JSON.stringify(exampleContent.smartphoneConnection.tips)}
    }
  },
     "troubleshooting": ${JSON.stringify(exampleContent.troubleshooting)},
   "faq": ${JSON.stringify(exampleContent.faq)}
 }

**중요한 요구사항:**
- 주제: ${request.topic}
- 생성 언어: ${targetLanguage} (모든 텍스트를 반드시 ${targetLanguage}로 작성)
- 스타일: ${request.style || '전문적이고 실용적인'}
- 난이도: ${request.difficulty}
- 대상: 실제 사용자가 따라할 수 있는 실용적인 내용
- 구조: 체계적이고 논리적인 순서
- 상세도: 초보자도 이해할 수 있는 수준
- 언어 필드: 반드시 "language": "${isKorean ? 'ko-zh' : 'zh-ko'}" 포함

${targetLanguage === '중국어' ? 
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
    console.log('📚 하이브리드 매뉴얼 생성 시작:', request);
    
    onProgress?.(10, '🧠 AI 콘텐츠 분석 중...');
    const prompt = createManualPrompt(request);
    
    onProgress?.(25, '🤖 매뉴얼 구조 생성 중...');
    const aiData = await callGeminiForManual(prompt, request);
    
    onProgress?.(50, '📋 전문 템플릿 적용 중...');
    const templateType = 'user-guide';
    
    onProgress?.(70, '📖 슬라이드 형태 매뉴얼 생성 중...');
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
        category: 'user-guide',
        templateType: templateType,
        sections: ['기본 사용법', '주의사항', '문제해결', 'FAQ'],
        totalSections: manualSlides.length,
        slides: manualSlides
      },
      sections: manualSlides.map((slide, index) => ({ 
        id: `section_${index}`, 
        title: slide.title,
        originalText: slide.title 
      })),
      html: fullManualHTML
    };
    
    onProgress?.(100, '📚 하이브리드 매뉴얼 생성 완료!');
    console.log('✅ 매뉴얼 생성 결과:', result);
    return result;
    
  } catch (error) {
    console.error('🚨 매뉴얼 생성 실패:', error);
    onProgress?.(100, '⚠️ 폴백 모드 실행 중...');
    return createManualFallback(request);
  }
};

// 🤖 Gemini API 호출 (설명서 데이터)
async function callGeminiForManual(prompt: string, request: ContentRequest): Promise<HybridManualData> {
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
    
    const parsed = parseManualJSON(responseText, request.language);
    console.log('✅ 파싱된 설명서 데이터:', parsed);
    return parsed;
    
  } catch (error) {
    console.error('🚨 Gemini API 오류:', error);
    throw error;
  }
}

// 🔧 개선된 JSON 파싱 함수
function parseManualJSON(responseText: string, language?: string): HybridManualData {
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
      .replace(/\\n/g, '\\n')
      // 중복된 따옴표 제거 (AI가 생성한 잘못된 JSON 수정)
      .replace(/""/g, '"')
      // 잘못된 쉼표 제거
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');
    
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
    
    // 추가 JSON 복구 시도
    try {
      const parsed = JSON.parse(jsonText);
      return createValidatedManualData(parsed);
    } catch (parseError) {
      console.log('🔧 JSON 파싱 실패, 추가 복구 시도...');
      
             // 더 강력한 복구 로직
       jsonText = jsonText
         // 잘못된 배열 요소 수정
         .replace(/([^"])\s*,\s*([^"]\s*[}\]])/g, '$1$2')
         // 잘못된 객체 속성 수정
         .replace(/([^"])\s*,\s*([^"]\s*})/g, '$1$2')
         // 중복된 속성 제거
         .replace(/"([^"]+)"\s*:\s*[^,}]+,\s*"([^"]+)"\s*:\s*[^,}]+/g, (match, key1, key2) => {
           if (key1 === key2) {
             return match.replace(/,\s*"[^"]+"\s*:\s*[^,}]+/, '');
           }
           return match;
         })
         // 배열 요소 사이 누락된 쉼표 추가 (객체 배열)
         .replace(/}\s*{/g, '},{')
         // 배열 요소 사이 누락된 쉼표 추가 (문자열 배열)
         .replace(/"\s*"/g, '","')
         // 배열 끝에 잘못된 쉼표 제거
         .replace(/,\s*([}\]])/g, '$1')
         // 객체 속성 사이 누락된 쉼표 추가
         .replace(/"\s*:\s*[^,}]+"\s*"/g, (match) => {
           return match.replace(/"\s*"/g, '","');
         });
      
      console.log('🔧 복구된 JSON (앞부분):', jsonText.substring(0, 500) + '...');
      
      try {
        const parsed = JSON.parse(jsonText);
        return createValidatedManualData(parsed);
      } catch (finalError) {
        console.error('❌ 최종 JSON 파싱 실패:', finalError);
        throw finalError;
      }
    }
    
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
        // AI가 생성한 실제 제목 사용 (중국어인 경우)
        const extractedTitle = titleMatch?.[1] || subtitleMatch?.[1] || '사용자 가이드';
        return createFallbackManualData(extractedTitle, language);
      }
      
    } catch (backupError) {
      console.error('🚨 백업 파싱도 실패:', backupError);
    }
    
    console.log('🔄 완전 폴백 모드...');
    return createFallbackManualData(undefined, language);
  }
}

// 🔧 검증된 매뉴얼 데이터 생성 (새로운 HybridManualData 구조)
function createValidatedManualData(parsed: any): HybridManualData {
  return {
    title: parsed.title || '사용자 가이드',
    subtitle: parsed.subtitle || '상세한 사용법과 주의사항',
    version: parsed.version || '1.0',
    date: parsed.date || new Date().toLocaleDateString('ko-KR'),
    basicUsage: {
      initialSetup: {
        title: parsed.basicUsage?.initialSetup?.title || '초기 설정',
        description: parsed.basicUsage?.initialSetup?.description || '제품을 처음 사용할 때 따라야 할 단계를 설명합니다',
        steps: Array.isArray(parsed.basicUsage?.initialSetup?.steps) ? 
          parsed.basicUsage.initialSetup.steps : ['단계1', '단계2', '단계3', '단계4']
      },
      basicGestures: {
        title: parsed.basicUsage?.basicGestures?.title || '기본 조작',
        description: parsed.basicUsage?.basicGestures?.description || '제품의 기본적인 조작 방법을 설명합니다',
        gestures: Array.isArray(parsed.basicUsage?.basicGestures?.gestures) ? 
          parsed.basicUsage.basicGestures.gestures : [
            {"name": "기본 조작1", "description": "기본 조작 방법의 상세 설명"},
            {"name": "기본 조작2", "description": "기본 조작 방법의 상세 설명"},
            {"name": "기본 조작3", "description": "기본 조작 방법의 상세 설명"},
            {"name": "기본 조작4", "description": "기본 조작 방법의 상세 설명"}
          ]
      },
      watchfaceCustomization: {
        title: parsed.basicUsage?.watchfaceCustomization?.title || '개인화 설정',
        description: parsed.basicUsage?.watchfaceCustomization?.description || '개인 취향에 맞게 설정을 변경하는 방법을 설명합니다',
        steps: Array.isArray(parsed.basicUsage?.watchfaceCustomization?.steps) ? 
          parsed.basicUsage.watchfaceCustomization.steps : ['단계1', '단계2', '단계3', '단계4']
      }
    },
    precautions: {
      batteryManagement: {
        title: parsed.precautions?.batteryManagement?.title || '유지보수',
        description: parsed.precautions?.batteryManagement?.description || '제품 유지보수와 관리를 위한 주의사항을 설명합니다',
        tips: Array.isArray(parsed.precautions?.batteryManagement?.tips) ? 
          parsed.precautions.batteryManagement.tips : ['팁1', '팁2', '팁3', '팁4']
      },
      waterproofPrecautions: {
        title: parsed.precautions?.waterproofPrecautions?.title || '사용 주의사항',
        description: parsed.precautions?.waterproofPrecautions?.description || '사용 시 주의사항과 예방 조치를 설명합니다',
        tips: Array.isArray(parsed.precautions?.waterproofPrecautions?.tips) ? 
          parsed.precautions.waterproofPrecautions.tips : ['팁1', '팁2', '팁3', '팁4']
      },
      smartphoneConnection: {
        title: parsed.precautions?.smartphoneConnection?.title || '연결 및 동기화',
        description: parsed.precautions?.smartphoneConnection?.description || '다른 기기와의 연결 및 동기화를 위한 팁을 제공합니다',
        tips: Array.isArray(parsed.precautions?.smartphoneConnection?.tips) ? 
          parsed.precautions.smartphoneConnection.tips : ['팁1', '팁2', '팁3', '팁4']
      }
    },
    troubleshooting: Array.isArray(parsed.troubleshooting) && parsed.troubleshooting.length > 0 ? 
      parsed.troubleshooting : [
        { problem: "일반적인 문제1", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] },
        { problem: "일반적인 문제2", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] },
        { problem: "일반적인 문제3", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] }
      ],
    faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 ? 
      parsed.faq : [
        { question: "자주 묻는 질문1", answer: "질문에 대한 답변을 상세히 설명합니다" },
        { question: "자주 묻는 질문2", answer: "질문에 대한 답변을 상세히 설명합니다" },
        { question: "자주 묻는 질문3", answer: "질문에 대한 답변을 상세히 설명합니다" }
      ]
  };
}

// 🔧 폴백 매뉴얼 데이터 생성
function createFallbackManualData(topic?: string, language?: string): HybridManualData {
  const topicName = topic || '제품';
  const isKorean = language === 'ko-zh';
  
  return {
    title: isKorean ? `${topicName} 사용자 가이드` : `${topicName} 用户指南`,
    subtitle: isKorean ? `${topicName}를 효과적으로 사용하는 방법` : `${topicName}的有效使用方法`,
    version: "1.0",
    date: new Date().toLocaleDateString(isKorean ? 'ko-KR' : 'zh-CN'),
    basicUsage: {
      initialSetup: {
        title: isKorean ? "초기 설정" : "初始设置",
        description: isKorean ? `${topicName}를 처음 사용할 때 따라야 할 단계를 설명합니다` : `${topicName}首次使用时的设置步骤说明`,
        steps: isKorean ? ["단계1", "단계2", "단계3", "단계4"] : ["步骤1", "步骤2", "步骤3", "步骤4"]
      },
      basicGestures: {
        title: isKorean ? "기본 조작" : "基本操作",
        description: isKorean ? `${topicName}의 기본적인 조작 방법을 설명합니다` : `${topicName}的基本操作方法说明`,
        gestures: isKorean ? [
          {"name": "기본 조작1", "description": "기본 조작 방법의 상세 설명"},
          {"name": "기본 조작2", "description": "기본 조작 방법의 상세 설명"},
          {"name": "기본 조작3", "description": "기본 조작 방법의 상세 설명"},
          {"name": "기본 조작4", "description": "기본 조작 방법의 상세 설명"}
        ] : [
          {"name": "基本操作1", "description": "基本操作方法的详细说明"},
          {"name": "基本操作2", "description": "基本操作方法的详细说明"},
          {"name": "基本操作3", "description": "基本操作方法的详细说明"},
          {"name": "基本操作4", "description": "基本操作方法的详细说明"}
        ]
      },
      watchfaceCustomization: {
        title: isKorean ? "개인화 설정" : "个性化设置",
        description: isKorean ? "개인 취향에 맞게 설정을 변경하는 방법을 설명합니다" : "根据个人喜好更改设置的方法说明",
        steps: isKorean ? ["단계1", "단계2", "단계3", "단계4"] : ["步骤1", "步骤2", "步骤3", "步骤4"]
      }
    },
    precautions: {
      batteryManagement: {
        title: isKorean ? "유지보수" : "维护保养",
        description: isKorean ? "제품 유지보수와 관리를 위한 주의사항을 설명합니다" : "产品维护和保养的注意事项说明",
        tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
      },
      waterproofPrecautions: {
        title: isKorean ? "사용 주의사항" : "使用注意事项",
        description: isKorean ? "사용 시 주의사항과 예방 조치를 설명합니다" : "使用时的注意事项和预防措施说明",
        tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
      },
      smartphoneConnection: {
        title: isKorean ? "연결 및 동기화" : "连接与同步",
        description: isKorean ? "다른 기기와의 연결 및 동기화를 위한 팁을 제공합니다" : "与其他设备连接和同步的提示",
        tips: isKorean ? ["팁1", "팁2", "팁3", "팁4"] : ["提示1", "提示2", "提示3", "提示4"]
      }
    },
    troubleshooting: isKorean ? [
      { problem: "일반적인 문제1", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] },
      { problem: "일반적인 문제2", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] },
      { problem: "일반적인 문제3", solution: ["해결 방법1", "해결 방법2", "해결 방법3"] }
    ] : [
      { problem: "常见问题1", solution: ["解决方法1", "解决方法2", "解决方法3"] },
      { problem: "常见问题2", solution: ["解决方法1", "解决方法2", "解决方法3"] },
      { problem: "常见问题3", solution: ["解决方法1", "解决方法2", "解决方法3"] }
    ],
    faq: isKorean ? [
      { question: "자주 묻는 질문1", answer: "질문에 대한 답변을 상세히 설명합니다" },
      { question: "자주 묻는 질문2", answer: "질문에 대한 답변을 상세히 설명합니다" },
      { question: "자주 묻는 질문3", answer: "질문에 대한 답변을 상세히 설명합니다" }
    ] : [
      { question: "常见问题1", answer: "详细的问题解答说明" },
      { question: "常见问题2", answer: "详细的问题解答说明" },
      { question: "常见问题3", answer: "详细的问题解答说明" }
    ]
  };
}

// 🎨 템플릿 기반 매뉴얼 HTML 생성
async function generateManualWithTemplate(data: HybridManualData, templateType: string): Promise<string> {
  const { getManualTemplate } = await import('./templates/manualTemplateEngine');
  return getManualTemplate(data);
}

// 🔥 슬라이드 형태 매뉴얼 생성 함수
async function generateManualSlides(data: HybridManualData, templateType: string, request?: ContentRequest): Promise<Array<{
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}>> {
  const { generateManualSlides } = await import('./templates/manualTemplateEngine');
  return generateManualSlides(data, templateType, request);
}

// ⚠️ 설명서 폴백 생성
function createManualFallback(request: ContentRequest): GeneratedContent {
  const fallbackData: HybridManualData = createFallbackManualData(request.topic, request.language);
  
  // 언어별 폴백 슬라이드 제목
  const isKorean = request.language === 'ko-zh';
  const slideTitles = isKorean ? {
    basic: '📱 기본 이해',
    advanced: '⚙️ 고급 설정 및 실용 기능',
    troubleshooting: '🔧 문제 해결',
    faq: '❓ 자주 묻는 질문'
  } : {
    basic: '📱 基本了解',
    advanced: '⚙️ 高级设置及实用功能',
    troubleshooting: '🔧 问题解决',
    faq: '❓ 常见问题'
  };
  
  const slideSubtitles = isKorean ? {
    basic: '기본 개념 및 사용법 소개',
    advanced: '개인화 설정 및 스마트 사용법',
    troubleshooting: '자주 발생하는 문제와 해결방법',
    faq: 'FAQ 및 기타 정보'
  } : {
    basic: '基本概念及使用方法介绍',
    advanced: '个性化设置和智能使用方法',
    troubleshooting: '常见问题及解决方法',
    faq: 'FAQ及其他信息'
  };
  
  const fallbackSlides = [
    {
      id: 1,
      title: slideTitles.basic,
      subtitle: slideSubtitles.basic,
      html: createFallbackSlideHTML(slideTitles.basic, '', 'basic', request.topic, request.language)
    },
    {
      id: 2,
      title: slideTitles.advanced,
      subtitle: slideSubtitles.advanced,
      html: createFallbackSlideHTML(slideTitles.advanced, '', 'advanced', request.topic, request.language)
    },
    {
      id: 3,
      title: slideTitles.troubleshooting,
      subtitle: slideSubtitles.troubleshooting,
      html: createFallbackSlideHTML(slideTitles.troubleshooting, '', 'troubleshooting', request.topic, request.language)
    },
    {
      id: 4,
      title: slideTitles.faq,
      subtitle: slideSubtitles.faq,
      html: createFallbackSlideHTML(slideTitles.faq, '', 'faq', request.topic, request.language)
    }
  ];
  
  const fallbackHTML = `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', sans-serif;">
      <h1 style="color: #2c3e50; margin-bottom: 20px;">${fallbackData.title}</h1>
      <p style="color: #7f8c8d; margin-bottom: 30px;">${fallbackData.subtitle}</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h3 style="color: #34495e; margin-bottom: 15px;">📋 매뉴얼 개요</h3>
        <p><strong>버전:</strong> ${fallbackData.version}</p>
        <p><strong>날짜:</strong> ${fallbackData.date}</p>
      </div>
      <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #3498db; background: white;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">기본 사용법</h3>
        <p>${fallbackData.basicUsage.initialSetup.description}</p>
      </div>
      <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #e74c3c; background: white;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">주의사항</h3>
        <p>${fallbackData.precautions.batteryManagement.description}</p>
      </div>
      <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #f39c12; background: white;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">문제해결</h3>
        <p>${fallbackData.troubleshooting[0]?.problem || '일반적인 문제'}</p>
      </div>
      <div style="margin-bottom: 30px; padding: 20px; border-left: 4px solid #27ae60; background: white;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">FAQ</h3>
        <p>${fallbackData.faq[0]?.question || '자주 묻는 질문'}</p>
      </div>
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
      category: 'user-guide',
      sections: fallbackSlides.map((s, index) => ({ 
        id: `fallback_${index}`, 
        title: s.title,
        originalText: s.title 
      })),
      totalSections: fallbackSlides.length,
      slides: fallbackSlides
    },
    sections: fallbackSlides.map((s, index) => ({ 
      id: `fallback_${index}`, 
      title: s.title,
      originalText: s.title 
    })),
    html: fallbackHTML
  };
}

// 🔥 폴백 슬라이드 HTML 생성
function createFallbackSlideHTML(title: string, content: string, type: string, topic?: string, language?: string): string {
  const themeColors = {
    basic: '#3498db',
    advanced: '#9b59b6',
    troubleshooting: '#e74c3c',
    faq: '#27ae60'
  };
  
  const color = themeColors[type as keyof typeof themeColors] || '#3498db';
  const dynamicContent = generateDynamicContent(type, topic || '해당 주제', language);
  
  // 언어별 버튼 텍스트
  const buttonText = language === 'ko-zh' ? '주제를 입력하여 상세한 AI 매뉴얼을 생성하세요 🚀' : '请输入主题生成详细的AI手册 🚀';
  
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
        ${buttonText}
      </div>
    </div>
  `;
}

// 🎯 주제에 맞는 동적 콘텐츠 생성 (언어별)
function generateDynamicContent(type: string, topic: string, language?: string): string {
  const isKorean = language === 'ko-zh';
  const topicKeyword = isKorean ? 
    topic.replace(/사용법|가이드|매뉴얼|설명서/g, '').trim() :
    topic.replace(/使用法|指南|手册|说明书/g, '').trim();
  
  if (isKorean) {
    switch (type) {
      case 'basic':
        return `${topicKeyword}의 기본 구성 요소와 기본 조작 방법을 알아봅니다.`;
      
      case 'advanced':
        return `${topicKeyword}의 개인화 설정과 효율적인 사용을 위한 고급 기능을 알아봅니다.`;
      
      case 'troubleshooting':
        return `${topicKeyword} 사용 중 자주 발생하는 문제와 해결 방법을 알아봅니다.`;
      
      case 'faq':
        return `${topicKeyword}에 대한 자주 묻는 질문과 답변, 그리고 기타 유용한 정보를 확인하세요.`;
      
      default:
        return `${topicKeyword}에 대한 유용한 정보와 사용 방법을 알아봅니다.`;
    }
  } else {
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
