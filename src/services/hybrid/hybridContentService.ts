// 🚀 PPT 전용 하이브리드 AI 서비스
// services/hybrid/hybridContentService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../../types';

// PPT 전용 하이브리드 데이터 생성
export const generateHybridPPT = async (
  request: ContentRequest,
  onProgress: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  onProgress(10, '🎨 PPT 데이터 생성 중...');
  
  // AI로부터 간단한 JSON 데이터만 받아옴 (토큰 절약)
  const aiData = await generatePPTAIData(request);
  
  onProgress(50, '📝 PPT 템플릿 적용 중...');
  
  // 템플릿 엔진으로 HTML 생성 (templateEngine.ts 사용)
  const { getTemplateSlides } = await import('./templates/templateEngine');
  const slides = getTemplateSlides(aiData, request.topic);
  
  onProgress(90, '✅ PPT 완성 중...');
  
  // GeneratedContent 형식으로 변환
  const result: GeneratedContent = {
    id: `ppt_${Date.now()}`,
    type: 'ppt',
    topic: request.topic,
    createdAt: new Date(),
    data: {
      slides: slides,
      templateType: 'ppt',
      theme: 'modern'
    },
    sections: slides.map((slide, index) => ({
      id: index + 1,
      originalText: slide.title,
      translatedText: slide.title
    }))
  };

  onProgress(100, '🎉 PPT 생성 완료!');
  return result;
};

// AI 데이터 생성 함수 (간단한 버전)
async function generatePPTAIData(request: ContentRequest) {
  // 언어별 제목 설정
  const isChinese = request.language === 'zh-ko';
  const slideTitles = {
    marketAnalysis: isChinese ? '市场分析' : '시장 분석',
    coreFeatures: isChinese ? '核心功能' : '핵심 기능',
    pricing: isChinese ? '价格政策' : '가격 정책',
    growthStrategy: isChinese ? '成长战略' : '성장 전략'
  };
  
  const slideDescriptions = {
    marketAnalysis: isChinese ? '当前市场情况和趋势' : '현재 시장 상황과 트렌드',
    coreFeatures: isChinese ? '主要特点和优势' : '주요 특징과 장점',
    pricing: isChinese ? '有竞争力的价格策略' : '경쟁력 있는 가격 전략',
    growthStrategy: isChinese ? '未来发展方向' : '미래 발전 방향'
  };
  
  // 실제로는 Gemini API 호출, 지금은 샘플 데이터
  return {
    title: request.topic,
    subtitle: isChinese ? `${request.topic}的综合分析` : `${request.topic}에 대한 종합적인 분석`,
    features: [
      { icon: '📊', title: slideTitles.marketAnalysis, description: slideDescriptions.marketAnalysis },
      { icon: '🚀', title: slideTitles.coreFeatures, description: slideDescriptions.coreFeatures },
      { icon: '💰', title: slideTitles.pricing, description: slideDescriptions.pricing },
      { icon: '📈', title: slideTitles.growthStrategy, description: slideDescriptions.growthStrategy }
    ],
    chartData: [
      { year: '2022', value: 12 },
      { year: '2023', value: 18 },
      { year: '2024', value: 25 }
    ],
    timeline: [
      { phase: '1단계', title: '기획 및 설계', description: '전략 수립 및 기본 설계' },
      { phase: '2단계', title: '개발 및 테스트', description: '핵심 기능 개발 및 검증' },
      { phase: '3단계', title: '출시 및 마케팅', description: '시장 진입 및 홍보' }
    ]
  };
}

export { generatePPTAIData };