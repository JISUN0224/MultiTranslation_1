// 🎨 브로슈어 템플릿 엔진 - 하이브리드 시스템용
// services/hybrid/templates/brochureTemplateEngine.ts

interface HybridBrochureData {
  title: string;
  subtitle: string;
  theme: 'tech' | 'business' | 'beauty' | 'medical' | 'finance';
  brand: {
    name: string;
    slogan: string;
    concept: string;
    tagline: string;
  };
  products: Array<{
    name: string;
    features: string[];
    price: string;
    target: string;
  }>;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    rating: number;
  }>;
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}

interface BrochurePageData {
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}

// 🎨 브로슈어 테마별 색상 팔레트
const brochureThemeColors = {
  tech: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#FFD700',
    text: '#2C3E50',
    light: '#F8F9FA'
  },
  business: {
    primary: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    accent: '#E74C3C',
    text: '#2C3E50',
    light: '#F8F9FA'
  },
  beauty: {
    primary: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
    accent: '#FF6B9D',
    text: '#444444',
    light: '#FFF5F8'
  },
  medical: {
    primary: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    accent: '#00B894',
    text: '#2C3E50',
    light: '#F0F8FF'
  },
  finance: {
    primary: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
    accent: '#F39C12',
    text: '#2C3E50',
    light: '#F8F9FA'
  }
};

// 🎯 브로슈어 페이지 생성 함수
export const getBrochurePages = (data: HybridBrochureData, templateType: string): BrochurePageData[] => {
  const colors = brochureThemeColors[data.theme] || brochureThemeColors.business;
  
  return [
    createBrochureCoverPage(data, colors),
    createBrandInfoPage(data, colors),
    createProductsPage(data, colors),
    createBenefitsPage(data, colors),
    createTestimonialsPage(data, colors),
    createContactPage(data, colors)
  ];
};

// 1. 📄 커버 페이지
function createBrochureCoverPage(data: HybridBrochureData, colors: any): BrochurePageData {
  return {
    id: 1,
    title: "커버 페이지",
    subtitle: data.title,
    html: `
    <div style="
      background: ${colors.primary};
      color: white;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: 'Arial', sans-serif;
      padding: 60px 40px;
    ">
      <h1 style="
        font-size: 4rem;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        line-height: 1.2;
      ">${data.title}</h1>
      
      <p style="
        font-size: 1.5rem;
        margin-bottom: 40px;
        opacity: 0.9;
        line-height: 1.4;
      ">${data.subtitle}</p>
      
      <div style="
        display: inline-block;
        padding: 15px 40px;
        background: ${colors.accent};
        color: white;
        border-radius: 50px;
        font-size: 1.2rem;
        font-weight: bold;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        margin-bottom: 60px;
      ">${data.brand.tagline}</div>
      
      <div style="text-align: center;">
        <h3 style="
          font-size: 1.8rem;
          margin-bottom: 10px;
          font-weight: bold;
        ">${data.brand.name}</h3>
        <p style="
          font-size: 1rem;
          opacity: 0.8;
        ">${data.brand.slogan}</p>
      </div>
    </div>`
  };
}

// 2. 🏢 브랜드 정보 페이지
function createBrandInfoPage(data: HybridBrochureData, colors: any): BrochurePageData {
  return {
    id: 2,
    title: "브랜드 소개",
    html: `<div style="background: ${colors.light}; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
      <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 3rem; color: ${colors.text}; margin-bottom: 60px;">브랜드 스토리</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 20px;">🏢</div>
            <h3 style="font-size: 2rem; color: ${colors.text}; margin-bottom: 15px;">${data.brand.name}</h3>
            <p style="font-size: 1.2rem; color: #666;">${data.brand.slogan}</p>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="font-size: 3rem; margin-bottom: 20px;">💡</div>
            <h3 style="font-size: 2rem; color: ${colors.text}; margin-bottom: 15px;">브랜드 컨셉</h3>
            <p style="font-size: 1.2rem; color: #666;">${data.brand.concept}</p>
          </div>
        </div>
      </div>
    </div>`
  };
}

// 3. 📦 제품 라인업 페이지
function createProductsPage(data: HybridBrochureData, colors: any): BrochurePageData {
  const productsHtml = data.products.map((product, index) => `
    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-left: 5px solid ${colors.accent};">
      <h3 style="font-size: 1.8rem; color: ${colors.text}; margin-bottom: 15px;">${product.name}</h3>
      <p style="color: ${colors.accent}; font-size: 1.2rem; font-weight: bold; margin-bottom: 20px;">${product.price}</p>
      <div style="margin-bottom: 20px;">
        ${product.features.map(feature => `
          <div style="display: flex; align-items: center; margin-bottom: 8px; color: #666;">
            <span style="color: ${colors.accent}; margin-right: 10px;">✓</span>
            ${feature}
          </div>
        `).join('')}
      </div>
      <p style="background: ${colors.light}; padding: 15px; border-radius: 8px; color: #666; font-style: italic;">
        <strong>추천 대상:</strong> ${product.target}
      </p>
    </div>
  `).join('');

  return {
    id: 3,
    title: "제품 라인업",
    html: `<div style="background: ${colors.light}; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 3rem; color: ${colors.text}; margin-bottom: 20px;">제품 라인업</h2>
          <p style="font-size: 1.3rem; color: #666;">고객의 다양한 니즈를 충족하는 프리미엄 제품들</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;">
          ${productsHtml}
        </div>
      </div>
    </div>`
  };
}

// 4. ⭐ 혜택 페이지
function createBenefitsPage(data: HybridBrochureData, colors: any): BrochurePageData {
  const benefitsHtml = data.benefits.map(benefit => `
    <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
      <div style="font-size: 4rem; margin-bottom: 25px;">${benefit.icon}</div>
      <h3 style="font-size: 1.8rem; color: ${colors.text}; margin-bottom: 20px;">${benefit.title}</h3>
      <p style="font-size: 1.1rem; color: #666; line-height: 1.6;">${benefit.description}</p>
    </div>
  `).join('');

  return {
    id: 4,
    title: "특별 혜택",
    html: `<div style="background: ${colors.light}; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 3rem; color: ${colors.text}; margin-bottom: 20px;">특별 혜택</h2>
          <p style="font-size: 1.3rem; color: #666;">고객님만을 위한 프리미엄 서비스와 혜택</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          ${benefitsHtml}
        </div>
      </div>
    </div>`
  };
}

// 5. 💬 고객 후기 페이지
function createTestimonialsPage(data: HybridBrochureData, colors: any): BrochurePageData {
  const testimonialsHtml = data.testimonials.map(testimonial => `
    <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <div style="text-align: center; margin-bottom: 25px;">
        ${'⭐'.repeat(testimonial.rating)}
      </div>
      <p style="font-size: 1.2rem; color: #666; line-height: 1.6; text-align: center; margin-bottom: 30px; font-style: italic;">
        "${testimonial.content}"
      </p>
      <div style="text-align: center; border-top: 2px solid ${colors.light}; padding-top: 25px;">
        <h4 style="font-size: 1.3rem; color: ${colors.text}; margin-bottom: 5px;">${testimonial.name}</h4>
        <p style="font-size: 1rem; color: ${colors.accent};">${testimonial.role}</p>
      </div>
    </div>
  `).join('');

  return {
    id: 5,
    title: "고객 후기",
    html: `<div style="background: ${colors.light}; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
      <div style="max-width: 1000px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 3rem; color: ${colors.text}; margin-bottom: 20px;">고객 후기</h2>
          <p style="font-size: 1.3rem; color: #666;">실제 고객들이 경험한 만족과 감동</p>
        </div>
        <div>${testimonialsHtml}</div>
      </div>
    </div>`
  };
}

// 6. 📞 연락처 페이지
function createContactPage(data: HybridBrochureData, colors: any): BrochurePageData {
  return {
    id: 6,
    title: "연락처",
    html: `<div style="background: ${colors.primary}; color: white; min-height: 100vh; padding: 80px 60px; font-family: Arial;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 3rem; margin-bottom: 20px;">연락처 정보</h2>
          <p style="font-size: 1.3rem; opacity: 0.9;">언제든지 편하게 문의해주세요</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 60px;">
          <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📞</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">전화번호</h3>
            <p style="font-size: 1.2rem; opacity: 0.9;">${data.contact.phone}</p>
          </div>
          <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📧</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">이메일</h3>
            <p style="font-size: 1.2rem; opacity: 0.9;">${data.contact.email}</p>
          </div>
          <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🌐</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">웹사이트</h3>
            <p style="font-size: 1.2rem; opacity: 0.9;">${data.contact.website}</p>
          </div>
          <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📍</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 10px;">주소</h3>
            <p style="font-size: 1.2rem; opacity: 0.9; line-height: 1.4;">${data.contact.address}</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 50px; background: rgba(255,255,255,0.15); border-radius: 25px;">
          <h3 style="font-size: 2.5rem; margin-bottom: 20px;">지금 바로 시작하세요!</h3>
          <p style="font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9;">무료 상담 및 문의를 통해 더 자세한 정보를 받아보세요</p>
          <div style="display: inline-flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
            <div style="padding: 15px 40px; background: ${colors.accent}; color: white; border-radius: 50px; font-size: 1.2rem; font-weight: bold;">무료 상담 신청</div>
            <div style="padding: 15px 40px; background: transparent; color: white; border: 2px solid white; border-radius: 50px; font-size: 1.2rem; font-weight: bold;">카탈로그 다운로드</div>
          </div>
        </div>
      </div>
    </div>`
  };
}

// 🎨 브로슈어 데이터 검증
export const validateBrochureData = (data: any): HybridBrochureData => {
  return {
    title: data.title || '브로슈어 제목',
    subtitle: data.subtitle || '브로슈어 부제목',
    theme: data.theme || 'business',
    brand: {
      name: data.brand?.name || '브랜드명',
      slogan: data.brand?.slogan || '브랜드 슬로건',
      concept: data.brand?.concept || '브랜드 컨셉',
      tagline: data.brand?.tagline || '마케팅 태그라인'
    },
    products: data.products || [
      {
        name: '기본 제품',
        features: ['특징 1', '특징 2', '특징 3'],
        price: '₩99,000',
        target: '일반 고객'
      }
    ],
    benefits: data.benefits || [
      {
        icon: '⭐',
        title: '특별 혜택',
        description: '고객만을 위한 특별한 서비스'
      }
    ],
    testimonials: data.testimonials || [
      {
        name: '홍길동',
        role: '일반 고객',
        content: '정말 만족스러운 서비스였습니다.',
        rating: 5
      }
    ],
    contact: {
      phone: data.contact?.phone || '02-1234-5678',
      email: data.contact?.email || 'info@company.com',
      website: data.contact?.website || 'www.company.com',
      address: data.contact?.address || '서울시 강남구 테헤란로 123'
    }
  };
};

export type { HybridBrochureData, BrochurePageData };