// 🎨 완전한 템플릿 엔진 - 하이브리드 시스템용
// services/hybrid/templates/templateEngine.ts

interface HybridPPTData {
  title: string;
  subtitle: string;
  theme: 'tech' | 'business' | 'beauty' | 'medical' | 'finance';
  stats: Array<{
    value: string;
    label: string;
    color: 'gold' | 'blue' | 'red' | 'green' | 'purple';
  }>;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  pricing?: Array<{
    name: string;
    price: string;
    features: string[];
    highlight?: boolean;
  }>;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
}

interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}

// 🎨 테마별 색상 팔레트
const themeColors = {
  tech: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    accent: '#FFD700',
    stats: { gold: '#FFD700', blue: '#00D4FF', red: '#FF6B6B', green: '#00B894', purple: '#A29BFE' }
  },
  business: {
    primary: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
    secondary: 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
    accent: '#E74C3C',
    stats: { gold: '#F39C12', blue: '#3498DB', red: '#E74C3C', green: '#27AE60', purple: '#9B59B6' }
  },
  beauty: {
    primary: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
    secondary: 'linear-gradient(135deg, #FFA1C9 0%, #C1FBA4 100%)',
    accent: '#FF6B9D',
    stats: { gold: '#FFD700', blue: '#74B9FF', red: '#FD79A8', green: '#00B894', purple: '#A29BFE' }
  },
  medical: {
    primary: 'linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)',
    secondary: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
    accent: '#00B894',
    stats: { gold: '#FDCB6E', blue: '#74B9FF', red: '#FD79A8', green: '#00B894', purple: '#6C5CE7' }
  },
  finance: {
    primary: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
    secondary: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    accent: '#F39C12',
    stats: { gold: '#F39C12', blue: '#3498DB', red: '#E74C3C', green: '#27AE60', purple: '#8E44AD' }
  }
};

// 🎯 메인 템플릿 생성 함수
export const getTemplateSlides = (data: HybridPPTData, templateType: string): SlideData[] => {
  const colors = themeColors[data.theme] || themeColors.business;
  
  return [
    createTitleSlide(data, colors),
    createFeaturesSlide(data, colors),
    createStatsSlide(data, colors),
    createPricingSlide(data, colors),
    createTimelineSlide(data, colors)
  ];
};

// 나머지 함수들은 여기서 완성됩니다...
function createTitleSlide(data: HybridPPTData, colors: any): SlideData {
  // 개선된 타이틀 슬라이드 구현
  return {
    id: 1,
    title: data.title,
    subtitle: data.subtitle,
    html: `<div style="
      background: ${colors.primary};
      width: 100%;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;
      position: relative;
      overflow: hidden;
    ">
      <!-- 배경 장식 -->
      <div style="
        position: absolute;
        top: -50px;
        right: -50px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        animation: float 6s ease-in-out infinite;
      "></div>
      
      <div style="
        position: absolute;
        bottom: -30px;
        left: -30px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
        animation: float 8s ease-in-out infinite reverse;
      "></div>

      <!-- 메인 콘텐츠 -->
      <div style="z-index: 2; position: relative;">
        <!-- 아이콘 -->
        <div style="
          font-size: 5rem;
          margin-bottom: 30px;
          animation: bounce 2s ease-in-out infinite;
        ">🚀</div>

        <!-- 제목 (별도 줄) -->
        <h1 style="
          font-size: 4rem;
          font-weight: bold;
          margin: 0 0 30px 0;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          line-height: 1.2;
          animation: slideInDown 1s ease-out;
        ">${data.title}</h1>

        <!-- 부제목 (별도 줄) -->
        <p style="
          font-size: 1.8rem;
          margin: 0 0 40px 0;
          opacity: 0.9;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
          line-height: 1.4;
          animation: slideInUp 1s ease-out 0.3s both;
        ">${data.subtitle}</p>

        <!-- CTA 버튼 -->
        <div style="
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: bold;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        ">자세히 알아보기 →</div>
      </div>

      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
      </style>
    </div>`
  };
}

function createFeaturesSlide(data: HybridPPTData, colors: any): SlideData {
  // 언어별 제목 설정
  const isChinese = data.language === 'zh-ko';
  const title = isChinese ? '核心功能' : '핵심 기능';
  
  return {
    id: 2,
    title: title,
    html: `<div style="background: ${colors.secondary}; color: white; min-height: 600px; padding: 60px;">
      <h2 style="text-align: center; font-size: 3rem; margin-bottom: 40px;">${title}</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px;">
        ${data.features.map(feature => `
          <div style="background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">${feature.icon}</div>
            <h3 style="font-size: 1.3rem; margin-bottom: 10px;">${feature.title}</h3>
            <p>${feature.description}</p>
          </div>
        `).join('')}
      </div>
    </div>`
  };
}

function createStatsSlide(data: HybridPPTData, colors: any): SlideData {
  // 언어별 제목 설정
  const isChinese = data.language === 'zh-ko';
  const title = isChinese ? '市场分析' : '시장 분석';
  
  return {
    id: 3,
    title: title,
    html: `<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; min-height: 600px; padding: 40px; display: flex; flex-direction: column;">
      <!-- 상단: 제목 -->
      <h2 style="text-align: center; font-size: 3rem; margin-bottom: 30px;">📊 ${title}</h2>
      
      <!-- 중단: 통계 카드들 -->
      <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 40px;">
        ${data.stats.map(stat => `
          <div style="background: rgba(255,255,255,0.15); padding: 30px; border-radius: 20px; text-align: center; min-width: 180px; backdrop-filter: blur(10px);">
            <div style="font-size: 2.5rem; font-weight: bold; color: ${colors.stats[stat.color]}; margin-bottom: 10px;">${stat.value}</div>
            <div style="font-size: 1rem;">${stat.label}</div>
          </div>
        `).join('')}
      </div>
      
      <!-- 하단: 그래프와 설명 -->
      <div style="flex: 1; display: flex; gap: 30px; align-items: stretch;">
        <!-- 왼쪽: 그래프 -->
        <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px);">
          <h3 style="text-align: center; font-size: 1.5rem; margin-bottom: 20px; color: ${colors.accent};">📈 ${isChinese ? '增长趋势' : '성장 추이'}</h3>
          <div style="display: flex; align-items: end; justify-content: space-around; height: 120px; margin-bottom: 15px;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 5px 5px 0 0; height: 60px; margin-bottom: 8px;"></div>
              <span style="font-size: 0.8rem;">2022</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 5px 5px 0 0; height: 80px; margin-bottom: 8px;"></div>
              <span style="font-size: 0.8rem;">2023</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 5px 5px 0 0; height: 100px; margin-bottom: 8px;"></div>
              <span style="font-size: 0.8rem;">2024</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="width: 30px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 5px 5px 0 0; height: 120px; margin-bottom: 8px;"></div>
              <span style="font-size: 0.8rem;">2025</span>
            </div>
          </div>
          <div style="text-align: center; font-size: 0.9rem; opacity: 0.8;">${isChinese ? '年增长率: +25%' : '연간 성장률: +25%'}</div>
        </div>
        
        <!-- 오른쪽: 텍스트 설명 -->
        <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px);">
          <h3 style="text-align: center; font-size: 1.5rem; margin-bottom: 20px; color: ${colors.accent};">💡 ${isChinese ? '市场洞察' : '시장 인사이트'}</h3>
          <div style="line-height: 1.6; font-size: 0.95rem;">
            <p style="margin-bottom: 15px;">• <strong>${isChinese ? '全球扩张:' : '글로벌 확장:'}</strong> ${isChinese ? '海外市场进入加速营收增长' : '해외 시장 진출로 매출 성장 가속화'}</p>
            <p style="margin-bottom: 15px;">• <strong>${isChinese ? '技术创新:' : '기술 혁신:'}</strong> ${isChinese ? 'AI技术引入增强竞争力' : 'AI 기술 도입으로 경쟁력 강화'}</p>
            <p style="margin-bottom: 15px;">• <strong>${isChinese ? '客户满意:' : '고객 만족:'}</strong> ${isChinese ? '服务质量改善提高回购率' : '서비스 품질 개선으로 재구매율 증가'}</p>
            <p style="margin-bottom: 15px;">• <strong>${isChinese ? '市场份额:' : '시장 점유율:'}</strong> ${isChinese ? '主要竞争对手相比保持优势' : '주요 경쟁사 대비 우위 확보'}</p>
          </div>
          <div style="text-align: center; margin-top: 20px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; font-size: 0.9rem;">
            🎯 <strong>${isChinese ? '目标:' : '목표:'}</strong> ${isChinese ? '2025年之前实现市场份额第一' : '2025년까지 시장 점유율 1위 달성'}
          </div>
        </div>
      </div>
    </div>`
  };
}

function createPricingSlide(data: HybridPPTData, colors: any): SlideData {
  // 언어별 제목 설정
  const isChinese = data.language === 'zh-ko';
  const title = isChinese ? '价格政策' : '가격 정책';
  
  const defaultPricing = isChinese ? [
    { name: '基本', price: '¥29,900', features: ['基本功能', '5GB存储'], highlight: false },
    { name: '高级', price: '¥59,900', features: ['所有功能', '无限存储'], highlight: true },
    { name: '企业', price: '¥99,900', features: ['高级功能', '优先支持'], highlight: false }
  ] : [
    { name: '기본', price: '₩29,900', features: ['기본 기능', '5GB 저장'], highlight: false },
    { name: '프리미엄', price: '₩59,900', features: ['모든 기능', '무제한 저장'], highlight: true },
    { name: '엔터프라이즈', price: '₩99,900', features: ['고급 기능', '우선 지원'], highlight: false }
  ];
  
  const pricing = data.pricing || defaultPricing;
  
  return {
    id: 4,
    title: title,
    html: `<div style="background: ${colors.primary}; color: white; min-height: 600px; padding: 60px;">
      <h2 style="text-align: center; font-size: 3rem; margin-bottom: 40px;">💰 ${title}</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1000px; margin: 0 auto;">
        ${pricing.map(plan => `
          <div style="background: rgba(255,255,255,0.2); padding: 40px; border-radius: 20px; text-align: center; ${plan.highlight ? 'border: 2px solid #FFD700; transform: scale(1.05);' : ''}">
            <h3 style="font-size: 1.5rem; margin-bottom: 20px;">${plan.name}</h3>
            <div style="font-size: 2.5rem; font-weight: bold; color: #FFD700; margin-bottom: 20px;">${plan.price}</div>
            <ul style="list-style: none; padding: 0;">
              ${plan.features.map(feature => `<li style="margin-bottom: 10px;">✓ ${feature}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>`
  };
}

function createTimelineSlide(data: HybridPPTData, colors: any): SlideData {
  // 언어별 제목 설정
  const isChinese = data.language === 'zh-ko';
  const title = isChinese ? '未来计划' : '향후 계획';
  
  const defaultTimeline = isChinese ? [
    { year: '2024', title: '发布', description: '正式推出' },
    { year: '2025', title: '扩展', description: '功能增强' },
    { year: '2026', title: '全球化', description: '海外进军' }
  ] : [
    { year: '2024', title: '출시', description: '공식 런칭' },
    { year: '2025', title: '확장', description: '기능 강화' },
    { year: '2026', title: '글로벌', description: '해외 진출' }
  ];
  
  const timeline = data.timeline || defaultTimeline;
  
  return {
    id: 5,
    title: title,
    html: `<div style="background: ${colors.secondary}; color: white; min-height: 600px; padding: 60px;">
              <h2 style="text-align: center; font-size: 3rem; margin-bottom: 40px;">🚀 ${title}</h2>
      <div style="display: flex; justify-content: space-between; max-width: 800px; margin: 0 auto;">
        ${timeline.map(item => `
          <div style="text-align: center;">
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 3px solid ${colors.accent};">
              <span style="font-size: 1.2rem; font-weight: bold;">${item.year}</span>
            </div>
            <h4 style="font-size: 1.3rem; margin-bottom: 10px;">${item.title}</h4>
            <p style="font-size: 0.9rem; opacity: 0.9;">${item.description}</p>
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 60px;">
        <button style="background: linear-gradient(45deg, ${colors.accent}, #FFA500); color: white; padding: 20px 40px; border: none; border-radius: 50px; font-size: 1.2rem; font-weight: bold; cursor: pointer;">
          함께 성장하기
        </button>
      </div>
    </div>`
  };
}