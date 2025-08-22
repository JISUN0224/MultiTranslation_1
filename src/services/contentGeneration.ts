// services/contentGeneration.ts - 개선된 버전

import { ContentRequest, GeneratedContent, ContentType } from '../types';

// Vite 환경 변수 타입 확장
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 실제 AI 콘텐츠 생성 (Gemini API 호출)
export const generateContent = async (request: ContentRequest): Promise<GeneratedContent> => {
  console.log('AI 콘텐츠 생성 요청:', request);

  try {
    // 실제 Gemini API 호출
    const aiResponse = await callGeminiAPI(request);
    
    // 번역 섹션 생성 - 원본 텍스트를 그대로 사용
    const sections = generateTranslationSectionsFromOriginal(aiResponse.sections);

    const generatedContent: GeneratedContent = {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: request.type,
      topic: request.topic,
      createdAt: new Date(),
      data: {
        title: aiResponse.title,
        subtitle: aiResponse.subtitle,
        sections: aiResponse.sections
      },
      sections
    };

    console.log('생성된 콘텐츠:', generatedContent);
    return generatedContent;
    
  } catch (error) {
    console.error('AI 콘텐츠 생성 실패:', error);
    throw new Error('AI 콘텐츠 생성에 실패했습니다. API 키를 확인해주세요.');
  }
};

// 실제 AI API 호출 (Gemini API)
async function callGeminiAPI(request: ContentRequest) {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.');
  }
  
  // 프롬프트 생성
  const prompt = generatePrompt(request.topic, request.type, request.style, request.industry, request.language, request.difficulty);
  
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const data = await response.json();
    
    // AI 응답을 파싱하여 구조화된 데이터로 변환
    return parseAIResponse(data, request.type);
    
  } catch (error) {
    console.error('Gemini API 호출 오류:', error);
    throw new Error('Gemini API 호출에 실패했습니다.');
  }
}

// 타입별 상세 프롬프트 생성
export function generatePrompt(topic: string, type: ContentType, style?: string, industry?: string, language: string, difficulty: string): string {
  switch (type) {
    case 'ppt':
      return generatePPTPrompt(topic, style || '전문적인', industry || '', language, difficulty);
    default:
      throw new Error(`지원하지 않는 콘텐츠 타입: ${type}`);
  }
}

// PPT 전용 HTML 슬라이드 프롬프트 - 시각적이고 인터랙티브하게
function generatePPTPrompt(topic: string, style: string, industry: string, language: string, difficulty: string): string {
  return `
${topic}에 대한 PPT 발표 자료를 HTML 형태로 작성해주세요.

다음 JSON 형식으로 5개 슬라이드를 작성해주세요:

{
  "slides": [
    {
      "id": 1,
      "title": "제목 슬라이드",
      "html": "<div style='완전한 HTML과 인라인 CSS'>${topic} 소개 슬라이드</div>"
    },
    {
      "id": 2, 
      "title": "핵심 기능",
      "html": "<div style='완전한 HTML과 인라인 CSS'>핵심 기능들을 카드 형태로 표시</div>"
    },
    {
      "id": 3,
      "title": "시장 분석", 
      "html": "<div style='완전한 HTML과 인라인 CSS'>차트와 그래프가 포함된 시장 분석</div>"
    },
    {
      "id": 4,
      "title": "가격 정보",
      "html": "<div style='완전한 HTML과 인라인 CSS'>가격표와 혜택 정보</div>"
    },
    {
      "id": 5,
      "title": "마무리",
      "html": "<div style='완전한 HTML과 인라인 CSS'>CTA와 연락처 정보</div>"
    }
  ]
}

슬라이드 제작 규칙:
1. 각 슬라이드는 완전한 HTML div로 작성
2. 모든 스타일은 인라인 CSS로 포함
3. 배경: 그라데이션 사용 (linear-gradient)
4. 크기: width:100%, height:100%, 16:9 비율 고려
5. 폰트: 'Segoe UI', 'Malgun Gothic', sans-serif (한국어 지원)
6. 색상: 슬라이드별로 다른 색상 테마
7. 이미지 대신 CSS 아이콘 사용 (📱, 💰, 📊, ⭐ 등)
8. 애니메이션 효과 포함 (transform, transition)
9. 반응형 디자인 (flexbox, grid 활용)
10. 데이터 시각화: CSS로 구현된 차트나 프로그레스 바

시각적 요소:
- 슬라이드 1: 메인 타이틀과 부제목은 각각 다른 줄에 배치, 중앙 정렬, 배경에 아이콘이나 도형 추가
- 슬라이드 2: 4개 기능을 카드 형태로 배치, 아이콘 포함, 호버 효과
- 슬라이드 3: 3개 통계 박스와 하단에 추가 정보나 차트 포함, 빈 공간 최소화
- 슬라이드 4: 가격표를 테이블이나 카드 형태로 구성
- 슬라이드 5: 콜투액션 버튼과 연락처 정보

필수 디자인 요구사항:
- 슬라이드 1: 제목과 부제목을 반드시 다른 줄에 배치 (flex-direction: column 사용)
- 슬라이드 3: 3개 박스 아래에 추가 콘텐츠 배치 (차트, 설명, 그래프 등)로 공간 활용
- 모든 슬라이드: 최소 높이 800px 확보
- 텍스트 가독성 확보 (적절한 폰트 크기와 대비)

주제: ${topic}
스타일: ${style}
언어: ${language}

예시 참고 - 슬라이드 1 (제목과 부제목 반드시 분리):
```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: white; font-family: 'Segoe UI', 'Malgun Gothic', sans-serif; position: relative;">
  <div style="font-size: 5rem; margin-bottom: 30px;">🚀</div>
  <h1 style="font-size: 4rem; font-weight: bold; margin: 0 0 30px 0; text-shadow: 2px 2px 8px rgba(0,0,0,0.3); line-height: 1.2;">${topic}</h1>
  <p style="font-size: 1.8rem; margin: 0 0 40px 0; opacity: 0.9; text-shadow: 1px 1px 4px rgba(0,0,0,0.3); line-height: 1.4;">부제목은 반드시 여기에 별도로</p>
  <div style="background: rgba(255,255,255,0.2); padding: 15px 40px; border-radius: 50px; font-size: 1.2rem; font-weight: bold;">시작하기</div>
</div>
```

예시 참고 - 슬라이드 3 (3개 박스 + 하단 차트로 공간 활용):
```html
<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); width: 100%; height: 100%; display: flex; flex-direction: column; color: white; padding: 60px; font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;">
  <div style="text-align: center; margin-bottom: 50px;">
    <h2 style="font-size: 3rem; margin-bottom: 15px;">📊 시장 분석</h2>
  </div>
  
  <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 60px;">
    <div style="background: rgba(255,215,0,0.2); padding: 40px; border-radius: 20px; text-align: center; min-width: 200px;">
      <div style="font-size: 3.5rem; color: #FFD700; margin-bottom: 10px;">20억+</div>
      <div style="font-size: 1.2rem;">글로벌 조회수</div>
    </div>
    <div style="background: rgba(0,212,255,0.2); padding: 40px; border-radius: 20px; text-align: center; min-width: 200px;">
      <div style="font-size: 3.5rem; color: #00D4FF; margin-bottom: 10px;">50+</div>
      <div style="font-size: 1.2rem;">진출 국가</div>
    </div>
    <div style="background: rgba(255,107,107,0.2); padding: 40px; border-radius: 20px; text-align: center; min-width: 200px;">
      <div style="font-size: 3.5rem; color: #FF6B6B; margin-bottom: 10px;">300만+</div>
      <div style="font-size: 1.2rem;">팬 수</div>
    </div>
  </div>
  
  <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
    <div style="background: rgba(255,255,255,0.05); border-radius: 20px; padding: 30px;">
      <h3 style="margin-bottom: 20px;">📈 성장률</h3>
      <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; margin-bottom: 10px;"><div style="background: #FFD700; height: 100%; width: 87%; border-radius: 4px;"></div></div>
      <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px;"><div style="background: #00D4FF; height: 100%; width: 94%; border-radius: 4px;"></div></div>
    </div>
    <div style="background: rgba(255,255,255,0.05); border-radius: 20px; padding: 30px;">
      <h3 style="margin-bottom: 20px;">🌍 지역별 인기</h3>
      <div style="margin-bottom: 10px;">아시아: 95%</div>
      <div style="margin-bottom: 10px;">북미: 78%</div>
      <div>유럽: 82%</div>
    </div>
  </div>
</div>
```

반드시 위 JSON 형식으로만 응답하고, 각 html 필드에는 완전한 인라인 스타일 HTML을 포함해주세요.
`;
}

// AI 응답 파싱 - JSON 슬라이드 및 텍스트 모두 지원
function parseAIResponse(data: any, type: ContentType) {
  try {
    // AI 응답에서 텍스트 추출
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('AI 원본 응답:', responseText);
    
    // PPT 타입이고 JSON 형태의 slides가 있는지 확인
    if (type === 'ppt') {
      try {
        // JSON 부분 추출 시도
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          
          // slides 배열이 있으면 PPT 슬라이드 데이터로 처리
          if (jsonData.slides && Array.isArray(jsonData.slides)) {
            console.log('PPT 슬라이드 데이터 파싱 성공:', jsonData.slides);
            
            return {
              title: '프레젠테이션',
              subtitle: 'AI 생성 PPT',
              sections: jsonData.slides.map((slide: any) => slide.title || `슬라이드 ${slide.id}`),
              slides: jsonData.slides // PPT 전용 슬라이드 데이터 추가
            };
          }
        }
      } catch (jsonError) {
        console.log('JSON 파싱 실패, 텍스트 파싱으로 전환:', jsonError);
      }
    }
    
    // 기존 텍스트 기반 파싱 (PPT JSON 파싱 실패시 또는 다른 타입)
    const sections = [];
    const sectionPattern = /섹션\s*(\d+)[:\s]*([\s\S]*?)(?=섹션\s*\d+|$)/g;
    let match;
    
    while ((match = sectionPattern.exec(responseText)) !== null) {
      const sectionContent = match[2].trim();
      if (sectionContent.length > 10) {
        sections.push(sectionContent);
      }
    }
    
    // 섹션이 없으면 단락별로 분리
    if (sections.length === 0) {
      const paragraphs = responseText.split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 20)
        .slice(0, type === 'ppt' ? 5 : 4); 
      
      sections.push(...paragraphs);
    }
    
    // 최소 섹션 수 보장
    const minSections = type === 'ppt' ? 5 : 4;
    while (sections.length < minSections) {
      sections.push(`섹션 ${sections.length + 1}에 대한 내용이 생성되지 않았습니다.`);
    }
    
    // 제목과 부제목 추출
    const lines = responseText.split('\n').filter(line => line.trim());
    const firstLine = lines[0] || '';
    
    let title = firstLine.replace(/^[#\-\*\s]*/, '').trim();
    if (title.length > 30) {
      title = title.substring(0, 30) + '...';
    }
    
    let subtitle = lines[1] || '';
    subtitle = subtitle.replace(/^[#\-\*\s]*/, '').trim();
    if (subtitle.length > 50) {
      subtitle = subtitle.substring(0, 50) + '...';
    }
    
    const result = {
      title: title || '새로운 프레젠테이션',
      subtitle: subtitle || '상세 내용',
      sections: sections.slice(0, minSections)
    };
    
    console.log('파싱된 결과:', result);
    return result;
    
  } catch (error) {
    console.error('AI 응답 파싱 오류:', error);
    throw new Error('AI 응답을 파싱할 수 없습니다.');
  }
}

// 구조화된 응답 파싱
function parseStructuredResponse(parsed: any, type: ContentType) {
  // 구조화된 데이터를 텍스트로 변환
  const sections: string[] = [];
  
  parsed.sections.forEach((section: any) => {
    let sectionText = '';
    
    switch (section.type) {
      case 'title':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n${section.data.intro}\n${section.data.timeline}`;
        break;
      case 'features':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.abilities.forEach((ability: any) => {
          sectionText += `${ability.icon} ${ability.title}: ${ability.description}\n`;
        });
        break;
      case 'market_data':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.metrics.forEach((metric: any) => {
          sectionText += `${metric.icon} ${metric.title}: ${metric.value} - ${metric.description}\n`;
        });
        break;
      case 'pricing':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n${section.data.priceInfo}\n${section.data.specialOffer}\n${section.data.purchaseCondition}`;
        break;
      case 'brand_info':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n${section.data.concept}\n${section.data.tagline}`;
        break;
      case 'product_lineup':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.products.forEach((product: any) => {
          sectionText += `${product.name}: ${product.price}\n`;
          product.features.forEach((feature: string) => {
            sectionText += `• ${feature}\n`;
          });
          sectionText += `대상: ${product.target}\n\n`;
        });
        break;
      case 'special_offers':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n${section.data.discount}\n${section.data.freeService}\n`;
        section.data.additionalBenefits.forEach((benefit: string) => {
          sectionText += `• ${benefit}\n`;
        });
        sectionText += `${section.data.eventPeriod}`;
        break;
      case 'customer_reviews':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.reviews.forEach((review: any) => {
          sectionText += `${review.name} (${review.rating}점): ${review.comment}\n`;
        });
        break;
      case 'overview':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n${section.data.introduction}\n`;
        section.data.components.forEach((component: string) => {
          sectionText += `• ${component}\n`;
        });
        section.data.precautions.forEach((precaution: string) => {
          sectionText += `⚠ ${precaution}\n`;
        });
        break;
      case 'installation':
      case 'usage':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.steps.forEach((step: any) => {
          sectionText += `${step.step}. ${step.action}: ${step.detail}\n`;
        });
        break;
      case 'maintenance':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.maintenanceItems.forEach((item: any) => {
          sectionText += `• ${item.item} (${item.frequency}): ${item.method}\n`;
        });
        section.data.cleaning.forEach((method: string) => {
          sectionText += `🧹 ${method}\n`;
        });
        section.data.troubleshooting.forEach((solution: string) => {
          sectionText += `🔧 ${solution}\n`;
        });
        break;
      case 'safety':
        sectionText = `${section.data.title}\n${section.data.subtitle}\n`;
        section.data.warnings.forEach((warning: string) => {
          sectionText += `⚠ ${warning}\n`;
        });
        section.data.prohibitions.forEach((prohibition: string) => {
          sectionText += `🚫 ${prohibition}\n`;
        });
        section.data.emergency.forEach((emergency: string) => {
          sectionText += `🚨 ${emergency}\n`;
        });
        break;
      default:
        sectionText = JSON.stringify(section.data);
    }
    
    sections.push(sectionText.trim());
  });
  
  return {
    title: parsed.title || '제목 없음',
    subtitle: parsed.subtitle || '부제목 없음',
    sections: sections
  };
}

// 텍스트를 섹션으로 분할
function parseTextToSections(text: string, type: ContentType) {
  const sections = text.split('\n\n').filter(section => section.trim().length > 0);
  
  return {
    title: sections[0]?.split('\n')[0] || '제목 없음',
    subtitle: sections[0]?.split('\n')[1] || '부제목 없음',
    sections: sections.slice(1) || []
  };
}

// 폴백 응답 생성 (API 실패시)
function generateFallbackResponse(request: ContentRequest) {
  return {
    title: `${request.topic} ${getTypeName(request.type)}`,
    subtitle: 'AI 생성 중 오류가 발생했습니다.',
    sections: [
      '콘텐츠를 생성하는 중 오류가 발생했습니다.',
      '잠시 후 다시 시도해주세요.',
      '문제가 지속되면 관리자에게 문의하세요.'
    ]
  };
}

// 원본 텍스트 기반 번역 섹션 생성 (콘텐츠와 일치)
function generateTranslationSectionsFromOriginal(originalSections: string[]) {
  const sections: Array<{id: string, originalText: string}> = [];
  
  originalSections.forEach((sectionText: string, sectionIndex: number) => {
    // 각 섹션을 의미있는 단위로 분할
    const lines = sectionText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    lines.forEach((line, lineIndex) => {
      // 의미있는 길이의 텍스트만 번역 섹션으로 추가
      if (line.length > 10) {
          sections.push({
          id: `section_${sectionIndex}_line_${lineIndex}`,
          originalText: line
          });
        }
      });

    // 불릿 포인트도 개별 번역 단위로 추가
    const bulletPoints = extractBulletPoints(sectionText);
    bulletPoints.forEach((bullet, bulletIndex) => {
      sections.push({
        id: `section_${sectionIndex}_bullet_${bulletIndex}`,
        originalText: bullet
      });
        });
      });

  return sections;
}

// 기존 함수 유지 (호환성)
function generateAdvancedTranslationSections(data: any, type: ContentType) {
  const sections: Array<{id: string, originalText: string}> = [];
  
  // 각 섹션의 텍스트를 더 세밀하게 분할
  data.sections.forEach((sectionText: string, sectionIndex: number) => {
    const lines = sectionText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    lines.forEach((line, lineIndex) => {
      // 제목, 가격, 중요 정보 등은 별도 세션으로 분리
      if (isImportantLine(line)) {
            sections.push({
          id: `section_${sectionIndex}_important_${lineIndex}`,
          originalText: line
            });
      } else if (line.length > 20) { // 의미있는 길이의 텍스트만
              sections.push({
          id: `section_${sectionIndex}_line_${lineIndex}`,
          originalText: line
            });
          }
        });
    
    // 불릿 포인트나 특징들을 개별 번역 단위로 분리
    const bulletPoints = extractBulletPoints(sectionText);
    bulletPoints.forEach((bullet, bulletIndex) => {
      sections.push({
        id: `section_${sectionIndex}_bullet_${bulletIndex}`,
        originalText: bullet
      });
        });
      });

  return sections;
}

// 중요한 라인 판별 함수
function isImportantLine(line: string): boolean {
  return (
    /₩[\d,]+/.test(line) || // 가격 정보
    line.includes('%') || // 퍼센트 정보
    line.length < 50 && line.length > 5 || // 제목/부제목 후보
    /^\d+\./.test(line) || // 번호가 있는 단계
    ['특징', '장점', '혜택', '기능', '주의', '경고'].some(keyword => line.includes(keyword))
  );
}

// 불릿 포인트 추출 함수  
function extractBulletPoints(text: string): string[] {
  const bulletRegex = /^[•\-\*]\s*(.+)$/gm;
  const matches = [];
  let match;
  
  while ((match = bulletRegex.exec(text)) !== null) {
    if (match[1].trim().length > 10) {
      matches.push(match[1].trim());
    }
  }
  
  return matches;
}

// 생성 진행률 시뮬레이션 (개선된 버전)
export const simulateGenerationProgress = (
  onProgress: (progress: number, message: string) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 5, message: '요청 분석 중...', delay: 300 },
      { progress: 15, message: '주제 키워드 추출 중...', delay: 500 },
      { progress: 25, message: '콘텐츠 구조 설계 중...', delay: 800 },
      { progress: 35, message: 'AI 모델 요청 준비 중...', delay: 400 },
      { progress: 50, message: 'AI 콘텐츠 생성 중...', delay: 1200 },
      { progress: 65, message: '텍스트 품질 검토 중...', delay: 600 },
      { progress: 75, message: '번역 섹션 구성 중...', delay: 700 },
      { progress: 85, message: '템플릿 적용 중...', delay: 400 },
      { progress: 95, message: '최종 검토 및 최적화 중...', delay: 500 },
      { progress: 100, message: '완료!', delay: 200 }
    ];

    let currentStep = 0;
    
    function runNextStep() {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
        
        setTimeout(runNextStep, step.delay);
      } else {
        resolve();
      }
    }
    
    runNextStep();
  });
};

// 콘텐츠 타입별 라벨
export const contentTypeLabels: Record<ContentType, string> = {
  ppt: 'PPT 발표 자료'
};

// 콘텐츠 타입별 예상 섹션 수
export const contentTypeSections: Record<ContentType, number> = {
  ppt: 5
};
