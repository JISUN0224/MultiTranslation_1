import { ContentRequest, GeneratedContent, ContentType } from '../types';

// AI 프롬프트 템플릿
const PROMPT_TEMPLATES = {
  ppt: (topic: string, style: string = '전문적인', industry: string = '') => `
${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 PPT 발표 자료를 만들어주세요.

요구사항:
- 제목 슬라이드 1개
- 주요 기능/특징 슬라이드 1개  
- 시장 분석/데이터 슬라이드 1개
- 제품 포트폴리오 슬라이드 1개
- 가격 정책 슬라이드 1개

스타일: ${style}
각 슬라이드는 한국어로 작성하고, 번역 연습에 적합한 전문적이고 명확한 문장으로 구성해주세요.

JSON 형태로 응답해주세요:
{
  "slides": [
    {
      "type": "title",
      "title": "제목",
      "subtitle": "부제목",
      "content": {
        "launchDate": "출시일",
        "tagline": "태그라인"
      },
      "brandColor": "#색상코드"
    }
  ]
}
`,

  brochure: (topic: string, style: string = '마케팅용', industry: string = '') => `
${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 브로슈어를 만들어주세요.

요구사항:
- 브랜드 정보 (이름, 슬로건)
- 3개 제품/서비스 정보
- 특별 혜택 정보
- ${style} 톤으로 작성

JSON 형태로 응답해주세요:
{
  "brand": {
    "name": "브랜드명",
    "slogan": "슬로건",
    "colors": {
      "primary": "#색상코드",
      "secondary": "#색상코드"
    }
  },
  "products": [
    {
      "id": "product1",
      "name": "제품명",
      "description": "제품 설명",
      "price": "가격",
      "features": ["특징1", "특징2", "특징3"]
    }
  ],
  "specialOffer": {
    "title": "특별 혜택 제목",
    "description": "혜택 설명",
    "discount": "할인 정보",
    "conditions": ["조건1", "조건2"]
  }
}
`,

  manual: (topic: string, style: string = '전문적인', industry: string = '') => `
${industry ? `${industry} 업계의 ` : ''}${topic}에 대한 사용설명서를 만들어주세요.

요구사항:
- 개요 섹션
- 설치/설정 방법
- 사용법
- 문제 해결
- 유지보수

스타일: ${style}
각 섹션은 한국어로 작성하고, 번역 연습에 적합한 명확하고 체계적인 문장으로 구성해주세요.

JSON 형태로 응답해주세요:
{
  "sections": [
    {
      "type": "overview",
      "title": "섹션 제목",
      "content": [
        {
          "type": "text",
          "data": "텍스트 내용"
        },
        {
          "type": "steps",
          "data": ["단계1", "단계2", "단계3"]
        }
      ]
    }
  ]
}
`
};

// 시뮬레이션된 AI 응답 데이터
const MOCK_AI_RESPONSES = {
  ppt: {
    slides: [
      {
        type: 'title',
        title: 'Galaxy S25',
        subtitle: '차세대 스마트폰의 혁신',
        content: {
          launchDate: '2024년 3월 출시',
          tagline: '미래를 만드는 기술'
        },
        brandColor: '#667eea'
      },
      {
        type: 'features',
        title: '핵심 기능',
        content: {
          features: [
            { icon: '📱', title: 'AI 카메라', description: '실시간 최적화' },
            { icon: '⚡', title: '5G 연결', description: '초고속 인터넷' },
            { icon: '🔋', title: '배터리', description: '2일 사용 가능' },
            { icon: '🛡️', title: '보안', description: '생체 인식' }
          ]
        },
        brandColor: '#667eea'
      },
      {
        type: 'market',
        title: '시장 점유율',
        content: {
          chartType: 'bar',
          chartData: [
            { name: '삼성', value: 35 },
            { name: '애플', value: 28 },
            { name: 'LG', value: 15 },
            { name: '기타', value: 22 }
          ],
          subtitle: '2024년 1분기 기준'
        },
        brandColor: '#667eea'
      },
      {
        type: 'portfolio',
        title: '제품 라인업',
        content: {
          products: [
            { name: 'Galaxy S25', price: '1,200,000원', features: ['AI 카메라', '5G'] },
            { name: 'Galaxy S25+', price: '1,400,000원', features: ['AI 카메라', '5G', '더 큰 화면'] },
            { name: 'Galaxy S25 Ultra', price: '1,800,000원', features: ['AI 카메라', '5G', 'S펜', '최고급 카메라'] }
          ]
        },
        brandColor: '#667eea'
      },
      {
        type: 'pricing',
        title: '가격 정책',
        content: {
          basePrice: '1,200,000원',
          discounts: ['사전예약 10% 할인', '통신사 할부 0%', '구형폰 보상 판매'],
          installment: '24개월 무이자'
        },
        brandColor: '#667eea'
      }
    ]
  },
  brochure: {
    brand: {
      name: 'Samsung Galaxy',
      slogan: '미래를 만드는 기술',
      colors: { primary: '#667eea', secondary: '#764ba2' }
    },
    products: [
      {
        id: 's25',
        name: 'Galaxy S25',
        description: 'AI 카메라와 5G 연결을 탑재한 차세대 스마트폰',
        price: '1,200,000원',
        features: ['AI 카메라', '5G 연결', '2일 배터리', '생체 인식']
      },
      {
        id: 's25plus',
        name: 'Galaxy S25+',
        description: '더 큰 화면과 향상된 성능',
        price: '1,400,000원',
        features: ['AI 카메라', '5G 연결', '6.7인치 화면', '고성능 프로세서']
      },
      {
        id: 's25ultra',
        name: 'Galaxy S25 Ultra',
        description: '최고급 카메라와 S펜을 탑재한 프리미엄 모델',
        price: '1,800,000원',
        features: ['AI 카메라', '5G 연결', 'S펜', '200MP 카메라']
      }
    ],
    specialOffer: {
      title: '사전예약 특별 혜택',
      description: '3월 15일까지 사전예약 시',
      discount: '10% 할인 + 무료 이어버드',
      conditions: ['사전예약 필수', '3월 15일까지', '1인 1대 한정']
    }
  },
  manual: {
    sections: [
      {
        type: 'overview',
        title: 'Galaxy S25 개요',
        content: [
          { type: 'text', data: 'Galaxy S25는 AI 카메라와 5G 연결을 탑재한 차세대 스마트폰입니다.' },
          { type: 'info', data: { title: '주요 특징', items: ['AI 카메라', '5G 연결', '2일 배터리', '생체 인식'] } }
        ]
      },
      {
        type: 'installation',
        title: '초기 설정',
        content: [
          { type: 'steps', data: ['SIM 카드 삽입', '전원 켜기', '언어 선택', 'Wi-Fi 연결', '계정 설정'] },
          { type: 'warning', data: 'SIM 카드는 전원을 끈 상태에서 삽입하세요.' }
        ]
      },
      {
        type: 'usage',
        title: '기본 사용법',
        content: [
          { type: 'text', data: 'AI 카메라 사용법과 5G 연결 설정 방법을 안내합니다.' },
          { type: 'steps', data: ['카메라 앱 실행', 'AI 모드 선택', '촬영', '자동 최적화 확인'] }
        ]
      },
      {
        type: 'troubleshooting',
        title: '문제 해결',
        content: [
          { type: 'info', data: { title: '자주 발생하는 문제', items: ['배터리 소모', '카메라 오류', '5G 연결 불안정'] } },
          { type: 'steps', data: ['재부팅', '앱 업데이트', '설정 초기화'] }
        ]
      }
    ]
  }
};

// AI 콘텐츠 생성 함수
export const generateContent = async (request: ContentRequest): Promise<GeneratedContent> => {
  console.log('AI 콘텐츠 생성 요청:', request);

  // 실제 AI API 호출을 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  // 프롬프트 생성
  const prompt = PROMPT_TEMPLATES[request.type](
    request.topic,
    request.style,
    request.industry
  );

  console.log('AI 프롬프트:', prompt);

  // 시뮬레이션된 AI 응답
  const aiResponse = MOCK_AI_RESPONSES[request.type];
  
  // 번역 섹션 생성
  const sections = generateTranslationSections(aiResponse, request.type);

  const generatedContent: GeneratedContent = {
    id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: request.type,
    topic: request.topic,
    createdAt: new Date(),
    data: aiResponse,
    sections
  };

  console.log('생성된 콘텐츠:', generatedContent);
  return generatedContent;
};

// 번역 섹션 생성 함수
const generateTranslationSections = (data: any, type: ContentType) => {
  const sections = [];

  switch (type) {
    case 'ppt':
      data.slides.forEach((slide: any, index: number) => {
        // 제목 슬라이드
        if (slide.type === 'title') {
          sections.push({
            id: `slide_${index}_title`,
            originalText: slide.title
          });
          if (slide.subtitle) {
            sections.push({
              id: `slide_${index}_subtitle`,
              originalText: slide.subtitle
            });
          }
        }
        
        // 기능 슬라이드
        if (slide.type === 'features' && slide.content.features) {
          slide.content.features.forEach((feature: any, featureIndex: number) => {
            sections.push({
              id: `slide_${index}_feature_${featureIndex}`,
              originalText: `${feature.title}: ${feature.description}`
            });
          });
        }

        // 제품 슬라이드
        if (slide.type === 'portfolio' && slide.content.products) {
          slide.content.products.forEach((product: any, productIndex: number) => {
            sections.push({
              id: `slide_${index}_product_${productIndex}`,
              originalText: `${product.name} - ${product.price}`
            });
          });
        }

        // 가격 슬라이드
        if (slide.type === 'pricing') {
          sections.push({
            id: `slide_${index}_price`,
            originalText: `기본 가격: ${slide.content.basePrice}`
          });
          slide.content.discounts.forEach((discount: string, discountIndex: number) => {
            sections.push({
              id: `slide_${index}_discount_${discountIndex}`,
              originalText: discount
            });
          });
        }
      });
      break;

    case 'brochure':
      // 브랜드 정보
      sections.push({
        id: 'brand_name',
        originalText: data.brand.name
      });
      sections.push({
        id: 'brand_slogan',
        originalText: data.brand.slogan
      });

      // 제품 정보
      data.products.forEach((product: any, index: number) => {
        sections.push({
          id: `product_${index}_name`,
          originalText: product.name
        });
        sections.push({
          id: `product_${index}_description`,
          originalText: product.description
        });
        sections.push({
          id: `product_${index}_price`,
          originalText: product.price
        });
      });

      // 특별 혜택
      sections.push({
        id: 'special_offer_title',
        originalText: data.specialOffer.title
      });
      sections.push({
        id: 'special_offer_description',
        originalText: data.specialOffer.description
      });
      break;

    case 'manual':
      data.sections.forEach((section: any, sectionIndex: number) => {
        section.content.forEach((content: any, contentIndex: number) => {
          if (content.type === 'text') {
            sections.push({
              id: `section_${sectionIndex}_content_${contentIndex}`,
              originalText: content.data
            });
          } else if (content.type === 'steps') {
            content.data.forEach((step: string, stepIndex: number) => {
              sections.push({
                id: `section_${sectionIndex}_step_${stepIndex}`,
                originalText: step
              });
            });
          }
        });
      });
      break;
  }

  return sections;
};

// 생성 진행률 시뮬레이션
export const simulateGenerationProgress = (
  onProgress: (progress: number, message: string) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 10, message: '주제 분석 중...' },
      { progress: 25, message: '콘텐츠 구조 설계 중...' },
      { progress: 40, message: 'AI 모델에 요청 중...' },
      { progress: 60, message: '콘텐츠 생성 중...' },
      { progress: 80, message: '번역 섹션 구성 중...' },
      { progress: 95, message: '최종 검토 중...' },
      { progress: 100, message: '완료!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        onProgress(step.progress, step.message);
        currentStep++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 500 + Math.random() * 1000);
  });
};
