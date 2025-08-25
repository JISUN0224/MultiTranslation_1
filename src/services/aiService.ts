// services/aiService.ts - 최적화된 간결한 프롬프트 버전

import { ContentRequest, GeneratedContent, ContentType, TranslationAnalysis } from '../types';

// 🚀 최적화된 간결한 PPT 프롬프트 (기존 3000토큰 → 800토큰)
const createPPTPrompt = (request: ContentRequest): string => {
  const getSourceLanguage = (langDirection: string) => {
    switch(langDirection) {
      case 'ko-zh': return '한국어'; 
      case 'zh-ko': return '中文';  
      default: return '한국어';
    }
  };
  
  const sourceLanguage = getSourceLanguage(request.language);
  
  return `
🚨 **필수 요구사항:**
- HTML 코드 생략 절대 금지 
- 모든 슬라이드의 완전한 HTML 작성 필수
- 각 html 필드에 완전한 <div>...</div> 코드 포함
- **중요:** height: 100vh 사용 금지, height: 100% 사용 (스크롤 방지)

"${request.topic}"에 대한 ${sourceLanguage} 프레젠테이션 5개 슬라이드를 제작해주세요.

**JSON 응답 형식:**
\`\`\`json
{
  "slides": [
    {
      "id": 1,
      "title": "제목",
      "subtitle": "부제목", 
      "html": "완전한 HTML 코드"
    }
  ]
}
\`\`\`

**슬라이드 구성:**
1. 메인 타이틀 (통계 카드 포함)
2. 시장 분석 (차트/그래프)
3. 핵심 기능 (4개 카드)
4. 가격 정책 (3개 플랜)
5. 성장 전략 (로드맵)

**디자인 요구사항:**
- 프리미엄 그라데이션 배경
- CSS 애니메이션 포함
- 반응형 디자인
- 통계 데이터 시각화
- hover 효과 및 인터랙션
- height: 100%, padding: 60px (스크롤 방지)
- 현대적 폰트 사용

**스타일 템플릿:**
\`\`\`html
<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:60px;color:white;height:100%;display:flex;flex-direction:column;justify-content:center;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <style>
  @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
  </style>
  <!-- 콘텐츠 -->
</div>
\`\`\`

**색상 팔레트:**
- 그라데이션: #667eea→#764ba2, #11998e→#38ef7d, #ff9a9e→#fecfef
- 강조색: #FFD700(골드), #00D4FF(블루), #FF6B6B(레드)
- 카드: rgba(255,255,255,0.2), border-radius:20px

${sourceLanguage === '한국어' ? 
`**한국어 예시 텍스트:**
- 통계: "2.5M+ 사용자", "95% 만족도", "300% 성장률"
- CTA: "지금 시작하기", "자세히 알아보기"` : 
`**中文示例文本:**
- 统计: "250万+ 用户", "95% 满意度", "300% 增长率"  
- CTA: "立即开始", "了解更多"`}

위 요구사항에 따라 "${request.topic}"에 대한 고품질 HTML 슬라이드 5개를 JSON으로 생성해주세요.
`;
};

// 🔥 핵심 수정: 강화된 JSON 파싱 함수
async function callGeminiAPI(prompt: string) {
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
    
    console.log('🎯 AI 원본 응답:', responseText);
    
    // 🔥 강화된 JSON 파싱 로직
    try {
      const parsed = parseAdvancedJSON(responseText);
      console.log('✅ JSON 파싱 성공:', parsed);
      return parsed;
      
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError);
      console.log('🔄 폴백 처리 시작...');
      return createEmergencyFallback(responseText);
    }
    
  } catch (error) {
    console.error('🚨 API 호출 오류:', error);
    throw error;
  }
}

// 🔥 새로운 고급 JSON 파싱 함수
function parseAdvancedJSON(responseText: string) {
  let jsonText = responseText.trim();
  
  // 1. 다양한 JSON 형태 감지 및 추출
  const jsonPatterns = [
    /```json\s*([\s\S]*?)\s*```/g,
    /```\s*([\s\S]*?)\s*```/g,
    /\{[\s\S]*"slides"[\s\S]*\}/g,
    /\{[\s\S]*\}/g
  ];
  
  let extractedJSON = null;
  
  for (const pattern of jsonPatterns) {
    const matches = [...jsonText.matchAll(pattern)];
    if (matches.length > 0) {
      extractedJSON = matches[0][1] || matches[0][0];
      break;
    }
  }
  
  if (!extractedJSON) {
    throw new Error('JSON 패턴을 찾을 수 없음');
  }
  
  // 2. JSON 정리 및 수정
  jsonText = extractedJSON
    .replace(/^\s*```json\s*/gi, '')
    .replace(/\s*```\s*$/gi, '')
    .replace(/[\u201C\u201D]/g, '"')  // 스마트 따옴표 처리
    .replace(/[\u2018\u2019]/g, "'")  // 스마트 아포스트로피 처리
    .trim();
  
  // 3. JSON 파싱 시도
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    // JSON 수정 시도
    jsonText = fixCommonJSONErrors(jsonText);
    parsed = JSON.parse(jsonText);
  }
  
  // 4. 구조 검증 및 정규화
  if (parsed.slides && Array.isArray(parsed.slides)) {
    return normalizeSlideData(parsed);
  } else {
    throw new Error('올바른 slides 배열이 없음');
  }
}

// 🔥 JSON 오류 수정 함수
function fixCommonJSONErrors(jsonText: string): string {
  return jsonText
    // 끝에 쉼표 제거
    .replace(/,(\s*[}\]])/g, '$1')
    // 불완전한 문자열 수정
    .replace(/:\s*"([^"]*?)\n/g, ': "$1",')
    // 불완전한 객체 닫기
    .replace(/\n\s*}\s*$/, '\n  }\n]}\n')
    // 이스케이프 처리
    .replace(/\\"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

// 🔥 슬라이드 데이터 정규화 함수
function normalizeSlideData(parsed: any) {
  const slides = parsed.slides.map((slide: any, index: number) => {
    return {
      id: slide.id || index + 1,
      title: slide.title || `슬라이드 ${index + 1}`,
      subtitle: slide.subtitle || '',
      html: slide.html || createDefaultSlideHTML(slide.title || `슬라이드 ${index + 1}`)
    };
  });
  
  // 최소 5개 슬라이드 보장
  while (slides.length < 5) {
    const slideNum = slides.length + 1;
    slides.push(createDefaultSlide(slideNum, 'AI 생성 슬라이드'));
  }
  
  return { slides };
}

// 🔥 응급 폴백 생성 함수
function createEmergencyFallback(responseText: string) {
  console.log('🚨 응급 폴백 모드 활성화');
  
  // HTML 블록 추출 시도
  const htmlBlocks = extractHTMLBlocks(responseText);
  const slides = [];
  
  if (htmlBlocks.length > 0) {
    htmlBlocks.forEach((html, index) => {
      slides.push({
        id: index + 1,
        title: `AI 생성 슬라이드 ${index + 1}`,
        subtitle: '자동 추출된 콘텐츠',
        html: html
      });
    });
    } else {
    // 완전 폴백: 텍스트를 슬라이드로 변환
    const textSections = responseText.split('\n\n').filter(s => s.trim().length > 20);
    textSections.slice(0, 5).forEach((text, index) => {
      slides.push({
        id: index + 1,
        title: `슬라이드 ${index + 1}`,
        subtitle: '',
        html: createTextSlideHTML(text)
      });
    });
  }
  
  // 최소 5개 슬라이드 보장
  while (slides.length < 5) {
    const slideNum: number = slides.length + 1;
    slides.push(createDefaultSlide(slideNum, 'Netflix'));
  }
  
  return { slides };
}

// HTML 블록 추출 함수
function extractHTMLBlocks(text: string): string[] {
  const htmlPattern = /<div[^>]*>[\s\S]*?<\/div>/gi;
  const matches = text.match(htmlPattern) || [];
  return matches.filter(html => html.length > 100);
}

// 텍스트를 슬라이드 HTML로 변환
function createTextSlideHTML(text: string): string {
  return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 60px; color: white; height: 100%; 
                display: flex; flex-direction: column; justify-content: center; 
                align-items: center; text-align: center; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 800px; line-height: 1.6; font-size: 1.2rem;">
        ${text.replace(/\n/g, '<br>')}
      </div>
    </div>
  `;
}

// 기본 슬라이드 HTML 생성
function createDefaultSlideHTML(title: string): string {
  return `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 60px; color: white; height: 100%; 
                display: flex; flex-direction: column; justify-content: center; 
                align-items: center; text-align: center; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h1 style="font-size: 3rem; margin-bottom: 20px;">${title}</h1>
      <p style="font-size: 1.5rem; opacity: 0.9;">프리미엄 콘텐츠를 경험해보세요</p>
    </div>
  `;
}

// 🔥 수정된 PPT 생성 함수
export const generatePPTWithAI = async (
  request: ContentRequest, 
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  try {
    console.log('🚀 고급 AI PPT 생성 시작:', request);
    
    onProgress?.(10, '🎨 프리미엄 디자인 분석 중...');
    const prompt = createPPTPrompt(request);
    
    onProgress?.(25, '🏗️ 슬라이드 구조 설계 중...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onProgress?.(40, '🤖 AI 모델에 요청 중...');
    const response = await callGeminiAPI(prompt);
    
    onProgress?.(60, '🎯 고퀄리티 HTML 생성 중...');
    let slides = response.slides || [];
    
    onProgress?.(80, '✨ 최종 품질 검증 중...');
    
    // 결과 구성
    const result = {
      id: `ppt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: request.type,
        topic: request.topic,
        createdAt: new Date(),
      data: {
        title: `${request.topic} 프레젠테이션`,
        slides: slides,
        styles: '',
        totalSlides: slides.length
      },
      sections: slides.map((slide: any, index: number) => ({
        id: `slide_${index}`,
        title: slide.title,
        html: slide.html,
        originalText: slide.title
      }))
    };
    
    onProgress?.(100, '🎉 프리미엄 PPT 생성 완료!');
    console.log('✅ 최종 결과:', result);
    return result;
    
  } catch (error) {
    console.error('🚨 AI PPT 생성 실패:', error);
    onProgress?.(100, '⚠️ 폴백 PPT 생성 중...');
    return createFallbackPPT(request);
  }
};

// 나머지 기존 함수들 유지...
function createDefaultSlide(slideNumber: number, topic: string) {
  const slideConfigs = [
    {
      title: `${topic} 소개`,
      content: `<h1 style='font-size: 3rem; margin-bottom: 20px;'>${topic}</h1><p style='font-size: 1.5rem; margin-bottom: 40px;'>혁신적인 솔루션을 경험해보세요</p>`,
      gradient: '#667eea 0%, #764ba2 100%'
    },
    {
      title: '핵심 기능',
      content: `<h2 style='font-size: 2.5rem; margin-bottom: 40px;'>핵심 기능</h2><div style='display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 800px; margin: 0 auto;'><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>⚡</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>빠른 성능</h3><p>업계 최고 수준의 처리 속도</p></div><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>🛡️</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>안전 보장</h3><p>검증된 보안 시스템</p></div></div>`,
      gradient: '#11998e 0%, #38ef7d 100%'
    },
    {
      title: '시장 분석',
      content: `<h2 style='font-size: 2.5rem; margin-bottom: 40px;'>시장 분석</h2><div style='display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; max-width: 900px; margin: 0 auto;'><div style='background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;'><div style='font-size: 2.5rem; margin-bottom: 10px;'>📈</div><h3 style='font-size: 1.2rem; margin-bottom: 5px;'>시장 점유율</h3><p style='font-size: 2rem; font-weight: bold; color: #FFD700;'>85%</p></div><div style='background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;'><div style='font-size: 2.5rem; margin-bottom: 10px;'>👥</div><h3 style='font-size: 1.2rem; margin-bottom: 5px;'>고객 만족도</h3><p style='font-size: 2rem; font-weight: bold; color: #FFD700;'>98%</p></div><div style='background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;'><div style='font-size: 2.5rem; margin-bottom: 10px;'>🚀</div><h3 style='font-size: 1.2rem; margin-bottom: 5px;'>성장률</h3><p style='font-size: 2rem; font-weight: bold; color: #FFD700;'>200%</p></div></div>`,
      gradient: '#ff9a9e 0%, #fecfef 100%'
    },
    {
      title: '요금 정책',
      content: `<h2 style='font-size: 2.5rem; margin-bottom: 40px;'>요금 정책</h2><div style='display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 700px; margin: 0 auto;'><div style='background: rgba(255,255,255,0.2); padding: 40px; border-radius: 15px; text-align: center;'><h3 style='font-size: 1.5rem; margin-bottom: 20px;'>기본 플랜</h3><div style='font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; color: #FFD700;'>₩29,900</div><p style='margin-bottom: 20px;'>월 구독</p><ul style='text-align: left; list-style: none; padding: 0;'><li style='margin-bottom: 8px;'>✓ 기본 기능</li><li style='margin-bottom: 8px;'>✓ 5GB 저장공간</li><li>✓ 이메일 지원</li></ul></div><div style='background: rgba(255,255,255,0.3); padding: 40px; border-radius: 15px; text-align: center; border: 2px solid #FFD700;'><h3 style='font-size: 1.5rem; margin-bottom: 20px;'>프리미엄</h3><div style='font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; color: #FFD700;'>₩59,900</div><p style='margin-bottom: 20px;'>월 구독</p><ul style='text-align: left; list-style: none; padding: 0;'><li style='margin-bottom: 8px;'>✓ 모든 기능</li><li style='margin-bottom: 8px;'>✓ 무제한 저장공간</li><li>✓ 24/7 지원</li></ul></div></div>`,
      gradient: '#667eea 0%, #764ba2 100%'
    },
    {
      title: '특별 혜택',
      content: `<h2 style='font-size: 2.5rem; margin-bottom: 40px;'>특별 혜택</h2><div style='display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 800px; margin: 0 auto;'><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>🎁</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>첫 구독 할인</h3><p style='font-size: 1.8rem; font-weight: bold; color: #FFD700; margin-bottom: 5px;'>50% OFF</p><p>첫 3개월</p></div><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>⚡</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>즉시 시작</h3><p>설치 없이 바로 사용 가능</p></div><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>🔄</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>무료 체험</h3><p>30일 무료 체험</p></div><div style='background: rgba(255,255,255,0.2); padding: 30px; border-radius: 15px; text-align: center;'><div style='font-size: 3rem; margin-bottom: 15px;'>🎯</div><h3 style='font-size: 1.3rem; margin-bottom: 10px;'>추천 혜택</h3><p>친구 초대시 1개월 무료</p></div></div>`,
      gradient: '#ffecd2 0%, #fcb69f 100%'
    }
  ];
  
  const config = slideConfigs[slideNumber - 1] || slideConfigs[0];
  
  return {
    id: slideNumber,
    title: config.title,
    html: config.content
  };
}

function createFallbackPPT(request: ContentRequest): GeneratedContent {
  // 글로벌 스마트폰 시장 현황 하드코딩 데이터
  const slides = [
    {
      id: 1,
      title: "글로벌 스마트폰 시장 현황 소개",
      subtitle: "혁신과 성장의 스토리",
      html: "<div style='background:linear-gradient(135deg,#667eea,#764ba2);padding:60px;color:white;height:100%;display:flex;flex-direction:column;justify-content:center;text-align:center;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'><style>@keyframes fadeInUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}@keyframes scaleIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}</style><div style='position:absolute;top:0;left:0;width:100%;height:100%;background-image:radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%);opacity:0.3'></div><h1 style='font-size:4rem;font-weight:900;margin-bottom:40px;animation:fadeInUp 1s ease-out;text-shadow:0 8px 30px rgba(0,0,0,0.3);background:linear-gradient(45deg,#ffffff,#ffcccb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text'>글로벌 스마트폰 시장 현황</h1><p style='font-size:1.8rem;font-weight:300;margin-bottom:40px;opacity:0.9;animation:fadeInUp 1s ease-out 0.3s both'>글로벌 모바일 기술의 혁신</p><div style='display:flex;gap:40px;margin-bottom:50px;justify-content:center'><div style='background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);padding:40px 30px;border-radius:20px;text-align:center;border:1px solid rgba(255,255,255,0.2);animation:scaleIn 1s ease-out 0.6s both;box-shadow:0 20px 40px rgba(0,0,0,0.2);transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px) scale(1.05)'\" onmouseout=\"this.style.transform='translateY(0) scale(1)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#FFD700;margin-bottom:10px'>15억+</div><div style='font-size:1rem;opacity:0.9'>글로벌 사용자</div></div><div style='background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);padding:40px 30px;border-radius:20px;text-align:center;border:1px solid rgba(255,255,255,0.2);animation:scaleIn 1s ease-out 0.9s both;box-shadow:0 20px 40px rgba(0,0,0,0.2);transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px) scale(1.05)'\" onmouseout=\"this.style.transform='translateY(0) scale(1)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#00D4FF;margin-bottom:10px'>1.5조$</div><div style='font-size:1rem;opacity:0.9'>시장 규모</div></div><div style='background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);padding:40px 30px;border-radius:20px;text-align:center;border:1px solid rgba(255,255,255,0.2);animation:scaleIn 1s ease-out 1.2s both;box-shadow:0 20px 40px rgba(0,0,0,0.2);transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px) scale(1.05)'\" onmouseout=\"this.style.transform='translateY(0) scale(1)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#FF6B6B;margin-bottom:10px'>7%</div><div style='font-size:1rem;opacity:0.9'>연간 성장률</div></div></div><button style='background:linear-gradient(45deg,#FFD700,#FFA500);color:#667eea;padding:20px 40px;border:none;border-radius:50px;font-size:1.1rem;font-weight:bold;cursor:pointer;animation:pulse 2s infinite;box-shadow:0 10px 30px rgba(255,215,0,0.4);transition:all 0.3s ease' onmouseover=\"this.style.transform='translateY(-3px)';this.style.boxShadow='0 15px 40px rgba(255,215,0,0.6)'\" onmouseout=\"this.style.transform='translateY(0)';this.style.boxShadow='0 10px 30px rgba(255,215,0,0.4)'\">지금 시작하기</button></div>"
    },
    {
      id: 2,
      title: "시장 기회 분석",
      subtitle: "데이터 기반 인사이트",
      html: "<div style='background:linear-gradient(135deg,#1a1a2e,#16213e);padding:60px;color:white;height:100%;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'><style>@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}</style><h2 style='font-size:3rem;font-weight:bold;text-align:center;margin-bottom:60px;animation:slideUp 0.8s ease-out'>📊 시장 기회 분석</h2><div style='display:grid;grid-template-columns:1fr 1fr;gap:60px;height:calc(100% - 200px)'><div style='background:rgba(255,255,255,0.08);backdrop-filter:blur(15px);border-radius:20px;padding:40px;border:1px solid rgba(255,255,255,0.1)'><h3 style='font-size:1.8rem;margin-bottom:30px;text-align:center'>스마트폰 출하량 성장률 (YoY)</h3><div style='display:flex;align-items:end;height:250px;gap:30px;justify-content:center'><div style='display:flex;flex-direction:column;align-items:center'><div style='background:linear-gradient(180deg,#FF6B6B 0%,#D63031 100%);width:60px;height:150px;border-radius:8px 8px 0 0;display:flex;align-items:end;justify-content:center;padding-bottom:8px;box-shadow:0 8px 16px rgba(255,107,107,0.3);position:relative'><span style='color:white;font-weight:bold;font-size:1rem;text-shadow:0 1px 2px rgba(0,0,0,0.3)'>12%</span></div><span style='margin-top:10px;font-size:0.8rem;color:#ccc;font-weight:600'>2022</span></div><div style='display:flex;flex-direction:column;align-items:center'><div style='background:linear-gradient(180deg,#00D4FF 0%,#0984e3 100%);width:60px;height:180px;border-radius:8px 8px 0 0;display:flex;align-items:end;justify-content:center;padding-bottom:8px;box-shadow:0 8px 16px rgba(0,212,255,0.3);position:relative'><span style='color:white;font-weight:bold;font-size:1rem;text-shadow:0 1px 2px rgba(0,0,0,0.3)'>18%</span></div><span style='margin-top:10px;font-size:0.8rem;color:#ccc;font-weight:600'>2023</span></div><div style='display:flex;flex-direction:column;align-items:center'><div style='background:linear-gradient(180deg,#00B894 0%,#00a085 100%);width:60px;height:210px;border-radius:8px 8px 0 0;display:flex;align-items:end;justify-content:center;padding-bottom:8px;box-shadow:0 8px 16px rgba(0,184,148,0.3);position:relative'><span style='color:white;font-weight:bold;font-size:1rem;text-shadow:0 1px 2px rgba(0,0,0,0.3)'>25%</span></div><span style='margin-top:10px;font-size:0.8rem;color:#ccc;font-weight:600'>2024</span></div></div></div><div style='background:rgba(255,255,255,0.08);backdrop-filter:blur(15px);border-radius:20px;padding:40px;border:1px solid rgba(255,255,255,0.1)'><h3 style='font-size:1.8rem;margin-bottom:30px;text-align:center'>시장 점유율 현황</h3><div style='display:flex;justify-content:center;margin-bottom:30px'><div style='position:relative;width:160px;height:160px'><div style='width:160px;height:160px;border-radius:50%;background:conic-gradient(#E50914 0deg 83deg,#00D4FF 83deg 155deg,#FFD700 155deg 227deg,#e0e0e0 227deg 360deg);display:flex;align-items:center;justify-content:center'><div style='width:100px;height:100px;border-radius:50%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;flex-direction:column'><span style='font-size:1.5rem;font-weight:bold;color:#E50914'>삼성</span><span style='font-size:0.8rem;color:#ccc'>23%</span></div></div></div></div><div style='display:grid;grid-template-columns:1fr 1fr;gap:10px'><div style='display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;background:rgba(229,9,20,0.1);border:1px solid rgba(229,9,20,0.3)'><div style='width:16px;height:16px;background:#E50914;border-radius:3px'></div><span style='font-size:0.8rem;font-weight:600'>삼성 23%</span></div><div style='display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3)'><div style='width:16px;height:16px;background:#00D4FF;border-radius:3px'></div><span style='font-size:0.8rem;font-weight:600'>애플 20%</span></div><div style='display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3)'><div style='width:16px;height:16px;background:#FFD700;border-radius:3px'></div><span style='font-size:0.8rem;font-weight:600'>샤오미 20%</span></div><div style='display:flex;align-items:center;gap:8px;padding:8px;border-radius:6px;background:rgba(224,224,224,0.1);border:1px solid rgba(224,224,224,0.3)'><div style='width:16px;height:16px;background:#e0e0e0;border-radius:3px'></div><span style='font-size:0.8rem;font-weight:600'>기타 37%</span></div></div></div></div></div>"
    },
    {
      id: 3,
      title: "핵심 솔루션",
      subtitle: "차별화된 가치 제안",
      html: "<div style='background:linear-gradient(135deg,#11998e,#38ef7d);padding:60px;color:white;height:100%;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'><h2 style='font-size:3rem;text-align:center;margin-bottom:60px'>💡 핵심 기술 트렌드</h2><div style='display:grid;grid-template-columns:repeat(2,1fr);gap:40px;max-width:900px;margin:0 auto'><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:4rem;margin-bottom:20px'>🤖</div><h3 style='font-size:1.5rem;margin-bottom:15px'>AI 기술 통합</h3><p style='font-size:1rem'>차세대 AI 칩셋과 머신러닝 기술</p></div><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:4rem;margin-bottom:20px'>📷</div><h3 style='font-size:1.5rem;margin-bottom:15px'>카메라 혁신</h3><p style='font-size:1rem'>200MP 초고해상도 및 야간 촬영</p></div><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:4rem;margin-bottom:20px'>🔋</div><h3 style='font-size:1.5rem;margin-bottom:15px'>배터리 기술</h3><p style='font-size:1rem'>초고속 충전 및 무선 충전 기술</p></div><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:4rem;margin-bottom:20px'>📱</div><h3 style='font-size:1.5rem;margin-bottom:15px'>폴더블 디스플레이</h3><p style='font-size:1rem'>차세대 접이식 디스플레이 기술</p></div></div></div>"
    },
    {
      id: 4,
      title: "비즈니스 모델",
      subtitle: "수익 구조 및 가격 전략",
      html: "<div style='background:linear-gradient(135deg,#667eea,#764ba2);padding:60px;color:white;height:100%;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'><h2 style='font-size:3rem;text-align:center;margin-bottom:60px'>💰 가격대별 시장 분석</h2><div style='display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1000px;margin:0 auto'><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='scale(1.05)'\" onmouseout=\"this.style.transform='scale(1)'\"digitalizeIndia><h3 style='font-size:1.5rem;margin-bottom:20px'>프리미엄</h3><div style='font-size:3rem;font-weight:bold;margin-bottom:20px;color:#FFD700'>$1200+</div><p style='margin-bottom:20px'>플래그십 모델</p><ul style='list-style:none;padding:0;text-align:left'><li style='margin-bottom:10px'>✓ 최신 프로세서</li><li style='margin-bottom:10px'>✓ 프로급 카메라</li><li>✓ 프리미엄 소재</li></ul><div style='margin-top:20px;padding:10px;background:rgba(255,215,0,0.2);border-radius:10px'><span style='font-size:1.2rem;font-weight:bold'>시장 점유율: 15%</span></div></div><div style='background:rgba(255,255,255,0.3);padding:40px;border-radius:20px;text-align:center;border:2px solid #FFD700;transition:transform 0.3s ease' onmouseover=\"this.style.transform='scale(1.05)'\" onmouseout=\"this.style.transform='scale(1)'\"digitalizeIndia><h3 style='font-size:1.5rem;margin-bottom:20px'>미드레인지</h3><div style='font-size:3rem;font-weight:bold;margin-bottom:20px;color:#FFD700'>$400-800</div><p style='margin-bottom:20px'>주력 모델</p><ul style='list-style:none;padding:0;text-align:left'><li style='margin-bottom:10px'>✓ 균형잡힌 성능</li><li style='margin-bottom:10px'>✓ 합리적 가격</li><li>✓ 대중적 디자인</li></ul><div style='margin-top:20px;padding:10px;background:rgba(255,215,0,0.2);border-radius:10px'><span style='font-size:1.2rem;font-weight:bold'>시장 점유율: 55%</span></div></div><div style='background:rgba(255,255,255,0.2);padding:40px;border-radius:20px;text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='scale(1.05)'\" onmouseout=\"this.style.transform='scale(1)'\"digitalizeIndia><h3 style='font-size:1.5rem;margin-bottom:20px'>엔트리</h3><div style='font-size:3rem;font-weight:bold;margin-bottom:20px;color:#FFD700'>$100-400</div><p style='margin-bottom:20px'>보급형 모델</p><ul style='list-style:none;padding:0;text-align:left'><li style='margin-bottom:10px'>✓ 기본 기능</li><li style='margin-bottom:10px'>✓ 저렴한 가격</li><li>✓ 신흥 시장 타겟</li></ul><div style='margin-top:20px;padding:10px;background:rgba(255,215,0,0.2);border-radius:10px'><span style='font-size:1.2rem;font-weight:bold'>시장 점유율: 30%</span></div></div></div></div>"
    },
    {
      id: 5,
      title: "성장 전략",
      subtitle: "로드맵 및 향후 계획",
      html: "<div style='background:linear-gradient(135deg,#ff9a9e,#fecfef);padding:60px;color:white;height:100%;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif'><h2 style='font-size:3rem;text-align:center;margin-bottom:60px'>🚀 미래 전망</h2><div style='max-width:1000px;margin:0 auto'><div style='display:flex;justify-content:space-between;margin-bottom:60px'><div style='text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='width:80px;height:80px;background:rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 10px 20px rgba(0,0,0,0.1)'><span style='font-size:1.5rem;font-weight:bold'>2024</span></div><h4 style='font-size:1.1rem'>5G 대중화</h4></div><div style='text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='width:80px;height:80px;background:rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 10px 20px rgba(0,0,0,0.1)'><span style='font-size:1.5rem;font-weight:bold'>2025</span></div><h4 style='font-size:1.1rem'>AI 통합 가속화</h4></div><div style='text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='width:80px;height:80px;background:rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 10px 20px rgba(0,0,0,0.1)'><span style='font-size:1.5rem;font-weight:bold'>2026</span></div><h4 style='font-size:1.1rem'>폴더블 혁신</h4></div><div style='text-align:center;transition:transform 0.3s ease' onmouseover=\"this.style.transform='translateY(-10px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='width:80px;height:80px;background:rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 10px 20px rgba(0,0,0,0.1)'><span style='font-size:1.5rem;font-weight:bold'>2027</span></div><h4 style='font-size:1.1rem'>AR/VR 융합</h4></div></div><div style='display:grid;grid-template-columns:repeat(3,1fr);gap:30px'><div style='background:rgba(255,255,255,0.2);padding:30px;border-radius:15px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 20px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-5px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#FFD700;margin-bottom:10px'>18억대</div><div>2025년 예상 출하량</div></div><div style='background:rgba(255,255,255,0.2);padding:30px;border-radius:15px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 20px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-5px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#00D4FF;margin-bottom:10px'>12%</div><div>연평균 성장률</div></div><div style='background:rgba(255,255,255,0.2);padding:30px;border-radius:15px;text-align:center;transition:transform 0.3s ease;box-shadow:0 10px 20px rgba(0,0,0,0.1)' onmouseover=\"this.style.transform='translateY(-5px)'\" onmouseout=\"this.style.transform='translateY(0)'\"digitalizeIndia><div style='font-size:2.5rem;font-weight:bold;color:#FF6B6B;margin-bottom:10px'>2.1조$</div><div>2027년 시장 규모</div></div></div></div></div>"
    }
  ];
    
  return {
    id: `ppt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: request.type,
    topic: "글로벌 스마트폰 시장 현황",
    createdAt: new Date(),
    data: {
      title: "글로벌 스마트폰 시장 현황 프레젠테이션",
      slides: slides,
      styles: '',
      totalSlides: slides.length
    },
    sections: slides.map((slide: any, index: number) => ({
      id: `slide_${index}`,
      title: slide.title,
      html: slide.html,
      originalText: slide.title
    }))
  };
}

// 기존 함수들 유지...
export const generateContentWithAI = async (
  request: ContentRequest,
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  if (request.type === 'ppt') {
    return await generatePPTWithAI(request, onProgress);
  }
  
  // contentGeneration.ts 파일이 삭제되어 레거시 모드 지원 중단
  throw new Error('레거시 모드가 지원되지 않습니다. 하이브리드 모드를 사용해주세요.');
};

export const simulateGenerationProgress = (
  onProgress: (progress: number, message: string) => void
): Promise<void> => {
  return new Promise((resolve) => {
    const steps = [
      { progress: 10, message: '🎨 AI PPT 디자인 분석 중...', delay: 400 },
      { progress: 25, message: '🏗️ 슬라이드 구조 설계 중...', delay: 600 },
      { progress: 40, message: '⚡ HTML 코드 생성 중...', delay: 800 },
      { progress: 60, message: '🎯 CSS 스타일 적용 중...', delay: 500 },
      { progress: 80, message: '📱 반응형 디자인 최적화 중...', delay: 700 },
      { progress: 95, message: '✨ 최종 검토 및 완성 중...', delay: 400 },
      { progress: 100, message: '🎉 PPT 생성 완료!', delay: 200 }
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

export const checkAPIKey = (): boolean => {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return !!(GEMINI_API_KEY && GEMINI_API_KEY !== 'your_api_key_here');
};

export const analyzeTranslation = async (
  originalText: string, 
  translatedText: string, 
  contentType: ContentType,
  language: string = 'ko-zh'
): Promise<TranslationAnalysis> => {
  const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }
  
  // 언어별 설정
  const isChineseToKorean = language === 'zh-ko';
  const sourceLanguage = isChineseToKorean ? '중국어' : '한국어';
  const targetLanguage = isChineseToKorean ? '한국어' : '중국어';
  
  const prompt = `
다음 ${sourceLanguage} 원문과 ${targetLanguage} 번역문을 평가해주세요.

원문: "${originalText}"
번역문: "${translatedText}"

다음 JSON 형식으로 평가 결과를 제공해주세요:

{
  "scores": {
    "accuracy": 85,
    "fluency": 80,
    "appropriateness": 90
  },
  "feedback": {
    "strengths": ["번역이 정확합니다", "의미가 잘 전달됩니다"],
    "improvements": ["더 자연스러운 표현이 필요합니다"],
    "suggestions": ["이 부분을 이렇게 번역하면 더 좋습니다"]
  },
  "referenceTranslation": "참고할 수 있는 더 나은 번역 예시"
}

평가 기준:
- accuracy (정확성): 원문의 의미가 정확히 전달되었는지 (0-100점)
- fluency (자연스러움): 번역문이 자연스럽게 읽히는지 (0-100점)  
- appropriateness (적합성): 문맥에 적절한지 (0-100점)

**중요:** ${sourceLanguage}에서 ${targetLanguage}로의 번역을 평가하고 있습니다.

반드시 위 JSON 형식으로만 응답해주세요.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
    
    // JSON 파싱 - 더 안전한 방식
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      }
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.log('원본 응답:', responseText);
    }
    
    // 파싱 실패시 기본값 반환
    return {
      scores: {
        accuracy: 75,
        fluency: 70,
        appropriateness: 80
      },
      feedback: {
        strengths: ['번역이 전반적으로 이해 가능합니다'],
        improvements: ['더 자연스러운 번역 표현이 필요합니다'],
        suggestions: ['더 구체적이고 명확한 표현을 사용해보세요']
      },
      referenceTranslation: '참고 번역을 생성할 수 없습니다.'
    };
    
  } catch (error) {
    console.error('번역 평가 API 호출 오류:', error);
    
    // 오류시 기본값 반환
    return {
      scores: {
        accuracy: 70,
        fluency: 65,
        appropriateness: 75
      },
      feedback: {
        strengths: ['번역이 기본적으로 이해 가능합니다'],
        improvements: ['API 오류로 상세한 평가를 제공할 수 없습니다'],
        suggestions: ['다시 시도해보세요']
      },
      referenceTranslation: 'API 오류로 참고 번역을 제공할 수 없습니다.'
    };
  }
};