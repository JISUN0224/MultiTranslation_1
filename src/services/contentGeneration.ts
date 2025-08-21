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
  const prompt = generatePromptForType(request);
  
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
function generatePromptForType(request: ContentRequest): string {
  const { topic, type, difficulty, style, industry, language = '한국어' } = request;
  
  switch (type) {
    case 'ppt':
      return generatePPTPrompt(topic, style || '전문적인', industry || '', language, difficulty);
    case 'brochure':
      return generateBrochurePrompt(topic, style || '마케팅용', industry || '', language, difficulty);
    case 'manual':
      return generateManualPrompt(topic, style || '전문적인', industry || '', language, difficulty);
    default:
      return generateDefaultPrompt(request);
  }
}

// PPT 전용 간단한 프롬프트 - 직접적이고 명확하게
function generatePPTPrompt(topic: string, style: string, industry: string, language: string, difficulty: string): string {
  return `
${topic}에 대한 PPT 발표 자료를 작성해주세요.

다음 형식으로 4개 섹션을 작성해주세요:

섹션 1 (제목 슬라이드):
${topic}의 개요와 소개를 간단히 설명해주세요.

섹션 2 (핵심 기능):
${topic}의 주요 특징이나 기능 4가지를 설명해주세요.
각 기능은 간단한 제목과 설명으로 구성해주세요.

섹션 3 (시장 분석):
${topic}의 시장 현황, 경쟁력, 성과 등을 설명해주세요.
구체적인 수치나 퍼센트가 있으면 포함해주세요.

섹션 4 (혜택 및 가격):
${topic}의 가격 정보, 특별 혜택, 구매 조건 등을 설명해주세요.
가격은 ₩ 표시로 작성해주세요.

작성 규칙:
- 각 섹션은 3-5문장으로 구성
- PPT에 적합한 간결하고 명확한 문체
- ${style} 스타일로 작성
- 구체적인 정보와 수치 포함
- 한국어로 작성

섹션별로 구분해서 작성해주세요.
`;
}

// 브로슈어 전용 상세 프롬프트
function generateBrochurePrompt(topic: string, style: string, industry: string, language: string, difficulty: string): string {
  return `
당신은 전문 브로슈어 작성자입니다. ${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 브로슈어를 ${language}로 작성하고, JSON 객체 형태로 응답해주세요.

# JSON 스키마:
{
  "title": "<브로슈어 제목>",
  "subtitle": "<브로슈어 부제목>",
  "sections": [
    {
      "type": "brand_info",
      "data": {
        "title": "<브랜드명>",
        "subtitle": "<브랜드 슬로건>",
        "concept": "<브랜드 컨셉>",
        "tagline": "<마케팅 태그라인>"
      }
    },
    {
      "type": "product_lineup",
      "data": {
        "title": "<제품 라인업 제목>",
        "subtitle": "<제품 라인업 부제목>",
        "products": [
          {
            "name": "<제품명>",
            "features": ["<특징1>", "<특징2>", "<특징3>"],
            "price": "<가격 (₩ 표시)>",
            "target": "<대상 고객>"
          },
          {
            "name": "<제품명>",
            "features": ["<특징1>", "<특징2>", "<특징3>"],
            "price": "<가격 (₩ 표시)>",
            "target": "<대상 고객>"
          },
          {
            "name": "<제품명>",
            "features": ["<특징1>", "<특징2>", "<특징3>"],
            "price": "<가격 (₩ 표시)>",
            "target": "<대상 고객>"
          }
        ]
      }
    },
    {
      "type": "special_offers",
      "data": {
        "title": "<특별 혜택 제목>",
        "subtitle": "<특별 혜택 부제목>",
        "discount": "<할인 정보>",
        "freeService": "<무료 서비스>",
        "additionalBenefits": ["<추가 혜택1>", "<추가 혜택2>"],
        "eventPeriod": "<이벤트 기간>"
      }
    },
    {
      "type": "customer_reviews",
      "data": {
        "title": "<고객 후기 제목>",
        "subtitle": "<고객 후기 부제목>",
        "reviews": [
          {
            "name": "<고객명 (○○○ 형태)>",
            "rating": "<평점 (5점 만점)>",
            "comment": "<구체적 후기>"
          },
          {
            "name": "<고객명 (○○○ 형태)>",
            "rating": "<평점 (5점 만점)>",
            "comment": "<구체적 후기>"
          }
        ]
      }
    }
  ]
}

# 작성 규칙:
- 제목은 25자, 부제목은 50자 이내로
- 제품명은 20자 이내
- 가격은 ₩ 표시로 명확히
- ${language} 언어로 작성
- ${style} 톤으로 작성
- 난이도: ${getDifficultyName(difficulty)}

# 요청 내용:
- 주제: ${topic}
- 스타일: ${style}
- 산업: ${industry}
- 언어: ${language}
- 구성: 브랜드 정보, 제품 라인업(3개), 특별 혜택, 고객 후기(2개)

반드시 위 JSON 스키마 형태로만 응답해주세요.
`;
}

// 매뉴얼 전용 상세 프롬프트
function generateManualPrompt(topic: string, style: string, industry: string, language: string, difficulty: string): string {
  return `
당신은 전문 사용설명서 작성자입니다. ${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 사용설명서를 ${language}로 작성하고, JSON 객체 형태로 응답해주세요.

# JSON 스키마:
{
  "title": "<매뉴얼 제목>",
  "subtitle": "<매뉴얼 부제목>",
  "sections": [
    {
      "type": "overview",
      "data": {
        "title": "<제품 개요 제목>",
        "subtitle": "<제품 개요 부제목>",
        "introduction": "<제품 소개>",
        "components": ["<구성품1>", "<구성품2>", "<구성품3>"],
        "precautions": ["<사용 전 확인사항1>", "<사용 전 확인사항2>"]
      }
    },
    {
      "type": "installation",
      "data": {
        "title": "<설치 및 설정 제목>",
        "subtitle": "<설치 및 설정 부제목>",
        "steps": [
          { "step": 1, "action": "<설치 단계1>", "detail": "<상세 설명>" },
          { "step": 2, "action": "<설치 단계2>", "detail": "<상세 설명>" },
          { "step": 3, "action": "<설치 단계3>", "detail": "<상세 설명>" },
          { "step": 4, "action": "<설치 단계4>", "detail": "<상세 설명>" },
          { "step": 5, "action": "<설치 단계5>", "detail": "<상세 설명>" }
        ]
      }
    },
    {
      "type": "usage",
      "data": {
        "title": "<기본 사용법 제목>",
        "subtitle": "<기본 사용법 부제목>",
        "steps": [
          { "step": 1, "action": "<사용 단계1>", "detail": "<상세 설명>" },
          { "step": 2, "action": "<사용 단계2>", "detail": "<상세 설명>" },
          { "step": 3, "action": "<사용 단계3>", "detail": "<상세 설명>" },
          { "step": 4, "action": "<사용 단계4>", "detail": "<상세 설명>" },
          { "step": 5, "action": "<사용 단계5>", "detail": "<상세 설명>" }
        ]
      }
    },
    {
      "type": "maintenance",
      "data": {
        "title": "<유지보수 제목>",
        "subtitle": "<유지보수 부제목>",
        "maintenanceItems": [
          { "item": "<정기 점검 항목1>", "frequency": "<점검 주기>", "method": "<점검 방법>" },
          { "item": "<정기 점검 항목2>", "frequency": "<점검 주기>", "method": "<점검 방법>" },
          { "item": "<정기 점검 항목3>", "frequency": "<점검 주기>", "method": "<점검 방법>" }
        ],
        "cleaning": ["<청소 방법1>", "<청소 방법2>"],
        "troubleshooting": ["<문제 해결1>", "<문제 해결2>"]
      }
    },
    {
      "type": "safety",
      "data": {
        "title": "<안전 수칙 제목>",
        "subtitle": "<안전 수칙 부제목>",
        "warnings": ["<주의사항1>", "<주의사항2>", "<주의사항3>"],
        "prohibitions": ["<금지사항1>", "<금지사항2>"],
        "emergency": ["<비상시 대처법1>", "<비상시 대처법2>"]
      }
    }
  ]
}

# 작성 규칙:
- 제목은 25자, 부제목은 50자 이내로
- 단계별로 명확하게 구분
- 안전 주의사항 포함
- 전문 용어 정확히 사용
- 단계당 50자 이내로 간결
- ${language} 언어로 작성
- ${style} 톤으로 작성
- 난이도: ${getDifficultyName(difficulty)}

# 요청 내용:
- 주제: ${topic}
- 스타일: ${style}
- 산업: ${industry}
- 언어: ${language}
- 구성: 제품 개요, 설치 및 설정(5단계), 기본 사용법(5단계), 유지보수, 안전 수칙

반드시 위 JSON 스키마 형태로만 응답해주세요.
`;
}

// 기본 프롬프트 (fallback)
function generateDefaultPrompt(request: ContentRequest): string {
  const { topic, type, difficulty, style, industry, language = '한국어' } = request;
  
  return `
당신은 전문 콘텐츠 작성자입니다. ${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 ${getTypeName(type)}을 ${language}로 작성해주세요.

난이도: ${getDifficultyName(difficulty)}
스타일: ${style || '전문적인'}

다음 JSON 형태로 응답해주세요:
{
  "title": "제목 (25자 이내)",
  "subtitle": "부제목 (50자 이내)", 
  "sections": [
    "첫 번째 섹션 내용",
    "두 번째 섹션 내용",
    "세 번째 섹션 내용",
    "네 번째 섹션 내용"
  ]
}

각 섹션은 ${getSectionCount(type)}개로 구성하고, 번역 연습에 적합한 전문적인 내용으로 작성해주세요.
`;
}

// 타입별 이름
function getTypeName(type: ContentType): string {
  const names = {
    ppt: 'PPT 발표 자료',
    brochure: '브로슈어',
    manual: '사용 설명서'
  };
  return names[type];
}

// 난이도별 이름
function getDifficultyName(difficulty: string): string {
  const names = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급'
  };
  return names[difficulty as keyof typeof names] || '중급';
}

// 타입별 섹션 개수
function getSectionCount(type: ContentType): number {
  const counts = {
    ppt: 4,
    brochure: 4,
    manual: 5
  };
  return counts[type];
}

// AI 응답 파싱 - 간단한 텍스트 기반
function parseAIResponse(data: any, type: ContentType) {
  try {
    // AI 응답에서 텍스트 추출
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    console.log('AI 원본 응답:', responseText);
    
    // 섹션별로 분리 ("섹션 1", "섹션 2" 등으로 구분)
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
        .slice(0, 4); // PPT는 4개 섹션
      
      sections.push(...paragraphs);
    }
    
    // 최소 4개 섹션 보장
    while (sections.length < 4) {
      sections.push(`섹션 ${sections.length + 1}에 대한 내용이 생성되지 않았습니다.`);
    }
    
    // 제목과 부제목 추출
    const lines = responseText.split('\n').filter(line => line.trim());
    const firstLine = lines[0] || '';
    
    // 제목 추출 (첫 번째 줄에서)
    let title = firstLine.replace(/^[#\-\*\s]*/, '').trim();
    if (title.length > 30) {
      title = title.substring(0, 30) + '...';
    }
    
    // 부제목 추출 (두 번째 줄에서)
    let subtitle = lines[1] || '';
    subtitle = subtitle.replace(/^[#\-\*\s]*/, '').trim();
    if (subtitle.length > 50) {
      subtitle = subtitle.substring(0, 50) + '...';
    }
    
    const result = {
      title: title || '새로운 프레젠테이션',
      subtitle: subtitle || '상세 내용',
      sections: sections.slice(0, 4)
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
