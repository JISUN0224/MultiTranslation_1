// 🎨 완전한 템플릿 엔진 - 하이브리드 시스템용
// services/hybrid/templates/templateEngine.ts

interface HybridPPTData {
  title: string;
  subtitle: string;
  theme: 'tech' | 'business' | 'beauty' | 'medical' | 'finance';
  language?: 'ko-zh' | 'zh-ko';
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
  // 언어별 제목 설정
  const isChinese = data.language === 'zh-ko';
  
  // 개선된 타이틀 슬라이드 구현
  return {
    id: 1,
    title: data.title,
    subtitle: data.subtitle,
    html: `<div style="
      background: ${colors.primary};
      width: 100%;
      min-height: 100vh;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
             color: white;
       font-family: ${isChinese ? "'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif" : "'Segoe UI', 'Malgun Gothic', sans-serif"};
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
                 ">${isChinese ? '了解更多 →' : '자세히 알아보기 →'}</div>
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
         html: `<div style="background: ${colors.secondary}; color: white; min-height: 100vh; height: 100vh; padding: 60px; font-family: ${isChinese ? "'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif" : "'Segoe UI', 'Malgun Gothic', sans-serif"};">
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
                   html: `<div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; min-height: 100vh; height: 100vh; padding: 40px; display: flex; flex-direction: column; justify-content: center; font-family: ${isChinese ? "'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif" : "'Segoe UI', 'Malgun Gothic', sans-serif"};">
       <!-- 상단: 제목 -->
       <h2 style="text-align: center; font-size: 3rem; margin-bottom: 50px;">📊 ${title}</h2>
       
       <!-- 중단: 통계 카드들 -->
       <div style="display: flex; justify-content: center; gap: 40px; margin-bottom: 60px;">
         ${data.stats.map(stat => `
           <div style="background: rgba(255,255,255,0.15); padding: 35px; border-radius: 20px; text-align: center; min-width: 200px; backdrop-filter: blur(10px);">
             <div style="font-size: 3rem; font-weight: bold; color: ${colors.stats[stat.color]}; margin-bottom: 15px;">${stat.value}</div>
             <div style="font-size: 1.1rem;">${stat.label}</div>
           </div>
         `).join('')}
       </div>
       
       <!-- 하단: 그래프와 설명 -->
       <div style="flex: 1; display: flex; gap: 40px; align-items: stretch; max-height: 400px;">
         <!-- 왼쪽: 그래프 -->
         <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 15px; padding: 35px; backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: space-between;">
           <h3 style="text-align: center; font-size: 1.8rem; margin-bottom: 30px; color: ${colors.accent};">📈 ${isChinese ? '增长趋势' : '성장 추이'}</h3>
           <div style="display: flex; align-items: end; justify-content: space-around; height: 180px; margin-bottom: 20px;">
             <div style="display: flex; flex-direction: column; align-items: center;">
               <div style="width: 40px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 8px 8px 0 0; height: 90px; margin-bottom: 12px;"></div>
               <span style="font-size: 1rem;">2022</span>
             </div>
             <div style="display: flex; flex-direction: column; align-items: center;">
               <div style="width: 40px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 8px 8px 0 0; height: 120px; margin-bottom: 12px;"></div>
               <span style="font-size: 1rem;">2023</span>
             </div>
             <div style="display: flex; flex-direction: column; align-items: center;">
               <div style="width: 40px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 8px 8px 0 0; height: 150px; margin-bottom: 12px;"></div>
               <span style="font-size: 1rem;">2024</span>
             </div>
             <div style="display: flex; flex-direction: column; align-items: center;">
               <div style="width: 40px; background: linear-gradient(to top, ${colors.stats.gold}, ${colors.stats.blue}); border-radius: 8px 8px 0 0; height: 180px; margin-bottom: 12px;"></div>
               <span style="font-size: 1rem;">2025</span>
             </div>
           </div>
           <div style="text-align: center; font-size: 1.1rem; opacity: 0.9; font-weight: 500;">${isChinese ? '年增长率: +25%' : '연간 성장률: +25%'}</div>
         </div>
         
         <!-- 오른쪽: 텍스트 설명 -->
         <div style="flex: 1; background: rgba(255,255,255,0.1); border-radius: 15px; padding: 35px; backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: space-between;">
           <h3 style="text-align: center; font-size: 1.8rem; margin-bottom: 30px; color: ${colors.accent};">💡 ${isChinese ? '市场洞察' : '시장 인사이트'}</h3>
           <div style="line-height: 1.8; font-size: 1.1rem; flex: 1;">
             <p style="margin-bottom: 20px;">• <strong>${isChinese ? '全球扩张:' : '글로벌 확장:'}</strong> ${isChinese ? '海外市场进入加速营收增长' : '해외 시장 진출로 매출 성장 가속화'}</p>
             <p style="margin-bottom: 20px;">• <strong>${isChinese ? '技术创新:' : '기술 혁신:'}</strong> ${isChinese ? 'AI技术引入增强竞争力' : 'AI 기술 도입으로 경쟁력 강화'}</p>
             <p style="margin-bottom: 20px;">• <strong>${isChinese ? '客户满意:' : '고객 만족:'}</strong> ${isChinese ? '服务质量改善提高回购率' : '서비스 품질 개선으로 재구매율 증가'}</p>
             <p style="margin-bottom: 20px;">• <strong>${isChinese ? '市场份额:' : '시장 점유율:'}</strong> ${isChinese ? '主要竞争对手相比保持优势' : '주요 경쟁사 대비 우위 확보'}</p>
           </div>
           <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.15); border-radius: 12px; font-size: 1rem; font-weight: 500;">
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
         html: `<div style="background: ${colors.primary}; color: white; min-height: 100vh; height: 100vh; padding: 40px; display: flex; flex-direction: column; justify-content: center; font-family: ${isChinese ? "'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif" : "'Segoe UI', 'Malgun Gothic', sans-serif"};">
      <!-- 상단: 제목 -->
      <h2 style="text-align: center; font-size: 3.5rem; margin-bottom: 60px;">💰 ${title}</h2>
      
      <!-- 중단: 가격 카드들 -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; flex: 1;">
        ${pricing.map(plan => `
          <div style="background: rgba(255,255,255,0.2); padding: 50px 40px; border-radius: 25px; text-align: center; ${plan.highlight ? 'border: 3px solid #FFD700; transform: scale(1.05);' : ''} backdrop-filter: blur(10px); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="font-size: 1.8rem; margin-bottom: 25px; font-weight: bold;">${plan.name}</h3>
              <div style="font-size: 3rem; font-weight: bold; color: #FFD700; margin-bottom: 30px;">${plan.price}</div>
              <ul style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 1.6;">
                ${plan.features.map(feature => `<li style="margin-bottom: 15px;">✓ ${feature}</li>`).join('')}
              </ul>
            </div>
            <div style="margin-top: 30px;">
              <button style="background: linear-gradient(45deg, ${colors.accent}, #FFA500); color: white; padding: 15px 30px; border: none; border-radius: 25px; font-size: 1.1rem; font-weight: bold; cursor: pointer; width: 100%;">
                ${isChinese ? '选择方案' : '선택하기'}
              </button>
            </div>
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
         html: `<div style="background: ${colors.secondary}; color: white; min-height: 100vh; height: 100vh; padding: 40px; display: flex; flex-direction: column; justify-content: center; font-family: ${isChinese ? "'Microsoft YaHei', 'PingFang SC', 'SimHei', sans-serif" : "'Segoe UI', 'Malgun Gothic', sans-serif"};">
      <!-- 상단: 제목 -->
      <h2 style="text-align: center; font-size: 3.5rem; margin-bottom: 60px;">🚀 ${title}</h2>
      
      <!-- 중단: 타임라인 -->
      <div style="display: flex; justify-content: space-between; max-width: 1000px; margin: 0 auto; flex: 1; align-items: center;">
        ${timeline.map((item, index) => `
          <div style="text-align: center; flex: 1; position: relative; min-width: 280px;">
            <!-- 연결선 (모든 아이템에 일관되게 적용) -->
            <div style="position: absolute; top: 50px; left: 50%; width: 100%; height: 3px; background: linear-gradient(90deg, ${colors.accent}, rgba(255,255,255,0.3)); transform: translateX(-50%); z-index: 1;"></div>
            
            <!-- 연도 원형 (통일된 크기) -->
            <div style="width: 120px; height: 120px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 40px; border: 4px solid ${colors.accent}; backdrop-filter: blur(10px); position: relative; z-index: 2;">
              <span style="font-size: 1.8rem; font-weight: bold;">${item.year}</span>
            </div>
            
            <!-- 제목과 설명 (통일된 크기) -->
            <div style="background: rgba(255,255,255,0.1); padding: 35px 25px; border-radius: 20px; backdrop-filter: blur(10px); min-height: 140px; display: flex; flex-direction: column; justify-content: center;">
              <h4 style="font-size: 1.7rem; margin-bottom: 20px; font-weight: bold;">${item.title}</h4>
              <p style="font-size: 1.2rem; opacity: 0.9; line-height: 1.6; margin: 0;">${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- 하단: CTA 버튼 -->
      <div style="text-align: center; margin-top: 50px;">
        <button style="background: linear-gradient(45deg, ${colors.accent}, #FFA500); color: white; padding: 25px 50px; border: none; border-radius: 50px; font-size: 1.4rem; font-weight: bold; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          ${isChinese ? '共同成长' : '함께 성장하기'}
        </button>
      </div>
    </div>`
  };
}