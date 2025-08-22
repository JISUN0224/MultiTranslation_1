// 🚀 브로슈어 & 설명서 하이브리드 AI 서비스
// services/hybrid/hybridContentService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../../types';
import { validateBrochureData, getBrochurePages } from './templates/brochureTemplateEngine';

// 브로슈어용 하이브리드 데이터 생성
export const generateHybridBrochure = async (
  request: ContentRequest,
  onProgress: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  onProgress(10, '🎨 브로슈어 데이터 생성 중...');
  
  // AI로부터 간단한 JSON 데이터만 받아옴 (토큰 절약)
  const aiData = await generateBrochureAIData(request);
  
  onProgress(50, '📝 브로슈어 템플릿 적용 중...');
  
  // 템플릿 엔진으로 HTML 생성
  const validatedData = validateBrochureData(aiData);
  const pages = getBrochurePages(validatedData, 'marketing');
  
  onProgress(90, '✅ 브로슈어 완성 중...');
  
  // GeneratedContent 형식으로 변환
  const slides = pages.map(page => ({
    id: page.id,
    title: page.title,
    subtitle: page.subtitle || '',
    html: page.html
  }));

  const result: GeneratedContent = {
    id: `brochure_${Date.now()}`,
    type: 'brochure',
    topic: request.topic,
    createdAt: new Date(),
    data: {
      slides: slides,
      templateType: 'brochure',
      theme: validatedData.theme
    },
    sections: slides.map((slide, index) => ({
      id: index + 1,
      originalText: slide.title,
      translatedText: slide.title
    }))
  };

  onProgress(100, '🎉 브로슈어 생성 완료!');
  return result;
};

// 설명서용 하이브리드 데이터 생성
export const generateHybridManual = async (
  request: ContentRequest,
  onProgress: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  onProgress(10, '📚 설명서 데이터 생성 중...');
  
  const aiData = await generateManualAIData(request);
  
  onProgress(50, '📖 설명서 템플릿 적용 중...');
  
  // 간단한 설명서 페이지 생성
  const pages = [
    {
      id: 1,
      title: "사용 설명서",
      html: `<div style="background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%); color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: Arial;">
        <div style="font-size: 5rem; margin-bottom: 30px;">📚</div>
        <h1 style="font-size: 4rem; font-weight: bold; margin-bottom: 20px;">${aiData.title || request.topic + ' 사용 설명서'}</h1>
        <p style="font-size: 1.5rem; opacity: 0.9;">${aiData.subtitle || '제품 사용 가이드'}</p>
      </div>`
    },
    {
      id: 2,
      title: "제품 개요",
      html: `<div style="background: #F8F9FA; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 style="text-align: center; font-size: 3rem; color: #2C3E50; margin-bottom: 60px;">제품 개요</h2>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h3 style="font-size: 2rem; color: #2C3E50; margin-bottom: 20px;">📝 제품 설명</h3>
            <p style="font-size: 1.2rem; color: #666; line-height: 1.6;">${aiData.description || request.topic + '에 대한 상세한 설명입니다.'}</p>
            
            <h4 style="font-size: 1.5rem; color: #2C3E50; margin: 30px 0 20px;">⭐ 주요 기능</h4>
            ${(aiData.features || ['기본 기능 1', '기본 기능 2', '기본 기능 3']).map(feature => 
              `<div style="display: flex; align-items: center; margin-bottom: 12px; color: #666;">
                <span style="color: #E74C3C; margin-right: 10px; font-weight: bold;">✓</span>
                ${feature}
              </div>`
            ).join('')}
          </div>
        </div>
      </div>`
    },
    {
      id: 3,
      title: "사용 방법",
      html: `<div style="background: #F8F9FA; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 style="text-align: center; font-size: 3rem; color: #2C3E50; margin-bottom: 60px;">사용 방법</h2>
          ${(aiData.steps || [
            { title: '1단계: 시작하기', description: '제품을 처음 사용할 때의 기본 설정 방법입니다.' },
            { title: '2단계: 기본 사용', description: '일상적인 사용을 위한 기본 조작 방법입니다.' },
            { title: '3단계: 고급 활용', description: '더욱 효과적인 사용을 위한 고급 기능들입니다.' }
          ]).map((step, index) => 
            `<div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 30px;">
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 50px; height: 50px; background: #3498DB; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin-right: 20px;">${index + 1}</div>
                <h4 style="font-size: 1.5rem; color: #2C3E50; margin: 0;">${step.title}</h4>
              </div>
              <p style="font-size: 1.1rem; color: #666; line-height: 1.6;">${step.description}</p>
            </div>`
          ).join('')}
        </div>
      </div>`
    }
  ];

  const slides = pages.map(page => ({
    id: page.id,
    title: page.title,
    subtitle: '',
    html: page.html
  }));

  const result: GeneratedContent = {
    id: `manual_${Date.now()}`,
    type: 'manual',
    topic: request.topic,
    createdAt: new Date(),
    data: {
      slides: slides,
      templateType: 'manual',
      theme: 'business'
    },
    sections: slides.map((slide, index) => ({
      id: index + 1,
      originalText: slide.title,
      translatedText: slide.title
    }))
  };

  onProgress(100, '🎉 설명서 생성 완료!');
  return result;
};

// AI 데이터 생성 함수들 (간단한 버전)
async function generateBrochureAIData(request: ContentRequest) {
  // 실제로는 Gemini API 호출, 지금은 샘플 데이터
  return {
    title: `${request.topic} 브로슈어`,
    subtitle: '프리미엄 제품을 만나보세요',
    theme: 'business',
    brand: {
      name: '브랜드명',
      slogan: '혁신과 품질의 만남',
      concept: '고객 중심의 가치 창조',
      tagline: '더 나은 내일을 위한 선택'
    },
    products: [
      {
        name: '기본 제품',
        features: ['특징 1', '특징 2', '특징 3'],
        price: '₩99,000',
        target: '일반 고객층'
      },
      {
        name: '프리미엄 제품',
        features: ['고급 특징 1', '고급 특징 2', '고급 특징 3'],
        price: '₩149,000',
        target: '프리미엄 고객층'
      }
    ],
    benefits: [
      {
        icon: '⭐',
        title: '프리미엄 품질',
        description: '최고급 소재와 기술력으로 제작된 프리미엄 제품'
      },
      {
        icon: '🚀',
        title: '빠른 배송',
        description: '주문 후 24시간 내 빠른 배송 서비스'
      }
    ],
    testimonials: [
      {
        name: '김고객',
        role: '일반 사용자',
        content: '정말 만족스러운 제품이었습니다. 추천합니다!',
        rating: 5
      }
    ],
    contact: {
      phone: '02-1234-5678',
      email: 'contact@company.com',
      website: 'www.company.com',
      address: '서울시 강남구 테헤란로 123'
    }
  };
}

async function generateManualAIData(request: ContentRequest) {
  return {
    title: `${request.topic} 사용 설명서`,
    subtitle: '제품 사용 가이드',
    description: `${request.topic}에 대한 상세한 사용 방법과 주의사항을 안내합니다.`,
    features: ['기본 기능', '고급 기능', '안전 기능'],
    steps: [
      { title: '1단계: 시작하기', description: '제품을 처음 사용할 때의 기본 설정' },
      { title: '2단계: 기본 사용', description: '일상적인 사용을 위한 기본 조작' },
      { title: '3단계: 고급 활용', description: '효과적인 사용을 위한 고급 기능' }
    ]
  };
}

export { generateBrochureAIData, generateManualAIData };