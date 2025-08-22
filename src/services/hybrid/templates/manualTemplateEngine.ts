// 📚 설명서 템플릿 엔진 - manualTemplateEngine.ts
// services/hybrid/templates/manualTemplateEngine.ts

interface HybridManualData {
  title: string;
  subtitle: string;
  category: 'technical' | 'user-guide' | 'tutorial' | 'reference' | 'troubleshooting';
  overview: {
    purpose: string;
    audience: string;
    requirements: string[];
  };
  sections: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'steps' | 'warning' | 'note' | 'example';
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  }>;
  troubleshooting?: Array<{
    problem: string;
    solution: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  appendix?: {
    glossary?: Array<{ term: string; definition: string; }>;
    references?: string[];
    version: string;
    lastUpdated: string;
  };
}

// 🎨 카테고리별 테마 색상
const manualThemes = {
  technical: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: '#3498db',
    accent: '#e74c3c',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    background: '#f8f9fa',
    text: '#2c3e50'
  },
  'user-guide': {
    primary: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    secondary: '#00b894',
    accent: '#fd79a8',
    success: '#00b894',
    warning: '#fdcb6e',
    danger: '#e17055',
    background: '#ffffff',
    text: '#2d3436'
  },
  tutorial: {
    primary: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
    secondary: '#fd79a8',
    accent: '#fdcb6e',
    success: '#00b894',
    warning: '#e17055',
    danger: '#d63031',
    background: '#f1f2f6',
    text: '#2f3542'
  },
  reference: {
    primary: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    secondary: '#74b9ff',
    accent: '#fd79a8',
    success: '#00b894',
    warning: '#fdcb6e',
    danger: '#e84393',
    background: '#ffffff',
    text: '#2d3436'
  },
  troubleshooting: {
    primary: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
    secondary: '#74b9ff',
    accent: '#fdcb6e',
    success: '#00b894',
    warning: '#e17055',
    danger: '#d63031',
    background: '#fff5f5',
    text: '#2d3436'
  }
};

// 🎯 메인 템플릿 생성 함수
export const getManualTemplate = (data: HybridManualData, templateType: string): string => {
  const theme = manualThemes[data.category] || manualThemes['user-guide'];
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        ${getManualStyles(theme)}
    </style>
</head>
<body>
    <div class="manual-container">
        ${createManualHeader(data, theme)}
        ${createTableOfContents(data)}
        ${createOverviewSection(data, theme)}
        ${createMainSections(data, theme)}
        ${createTroubleshootingSection(data, theme)}
        ${createFAQSection(data, theme)}
        ${createAppendixSection(data, theme)}
        ${createManualFooter(data, theme)}
    </div>
    
    <script>
        ${getManualScripts()}
    </script>
</body>
</html>
  `;
};

// 🔥 슬라이드 형태 매뉴얼 템플릿 생성 함수
export const getManualSlideTemplate = (data: any, templateType: string): string => {
  const theme = manualThemes[data.category] || manualThemes['user-guide'];
  const config = data.slideConfig;
  
  return `
    <div style="
      background: ${theme.primary};
      color: white;
      min-height: 600px;
      padding: 40px;
      font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
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
      
      ${generateSlideContent(config, theme)}
      
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-content {
          animation: fadeInUp 0.8s ease-out;
        }
        .slide-item {
          background: rgba(255,255,255,0.15);
          margin: 15px 0;
          padding: 20px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border-left: 4px solid ${theme.accent};
        }
        .slide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
      </style>
    </div>
  `;
};

// 🔥 슬라이드 콘텐츠 생성 함수
function generateSlideContent(config: any, theme: any): string {
  const { id, title, subtitle, type, content } = config;
  
  switch (type) {
    case 'basic':
      return `
        <div class="slide-content" style="position: relative; z-index: 2; text-align: center;">
          <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
            ${title}
          </h1>
          <p style="font-size: 1.4rem; margin-bottom: 40px; opacity: 0.9;">${subtitle}</p>
          
          <div style="text-align: left; max-width: 800px; margin: 0 auto;">
            <div class="slide-item">
              <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #000000;">📌 목적</h3>
              <p style="font-size: 1.1rem; line-height: 1.6;">${content.overview?.purpose || '이 가이드의 목적을 설명합니다.'}</p>
            </div>
            
            <div class="slide-item">
              <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #000000;">👥 대상 사용자</h3>
              <p style="font-size: 1.1rem; line-height: 1.6;">${content.overview?.audience || '모든 사용자'}</p>
            </div>
            
            <div class="slide-item">
              <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #000000;">✅ 준비사항</h3>
              <ul style="font-size: 1.1rem; line-height: 1.6;">
                ${(content.overview?.requirements || ['기본적인 이해', '필요한 도구', '충분한 시간']).map((req: string) => `<li>${req}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
      
    case 'advanced':
      return `
        <div class="slide-content" style="position: relative; z-index: 2;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
              ${title}
            </h1>
            <p style="font-size: 1.4rem; opacity: 0.9;">${subtitle}</p>
          </div>
          
          <div class="slide-grid">
            ${(content.sections || []).slice(0, 4).map((section: any, index: number) => `
              <div class="slide-item">
                <h3 style="font-size: 1.3rem; margin-bottom: 15px; color: #000000;">🔧 ${section.title || `고급 기능 ${index + 1}`}</h3>
                <p style="font-size: 1rem; line-height: 1.6;">${section.content || '스마트폰을 더욱 효율적으로 사용할 수 있는 고급 기능들을 알아봅니다.'}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <div style="background: rgba(255,255,255,0.2); padding: 15px 30px; border-radius: 25px; backdrop-filter: blur(10px);">
              💡 <strong>팁:</strong> 각 단계를 차근차근 따라해보며 익숙해져 보세요!
            </div>
          </div>
        </div>
      `;
      
    case 'troubleshooting':
      return `
        <div class="slide-content" style="position: relative; z-index: 2;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
              ${title}
            </h1>
            <p style="font-size: 1.4rem; opacity: 0.9;">${subtitle}</p>
          </div>
          
          <div style="max-width: 800px; margin: 0 auto;">
            ${(content.troubleshooting || [
              { problem: '기기가 느려요', solution: '불필요한 앱을 종료하고 재시작해보세요.', severity: 'medium' },
              { problem: 'Wi-Fi가 연결되지 않아요', solution: 'Wi-Fi를 껐다 켜거나 공유기를 재시작해보세요.', severity: 'low' },
              { problem: '배터리가 빨리 닳아요', solution: '화면 밝기를 낮추고 배터리 절약 모드를 사용하세요.', severity: 'medium' }
            ]).map((item: any, index: number) => {
              const severityColors = { high: '#e74c3c', medium: '#f39c12', low: '#27ae60' };
              const severityColor = severityColors[item.severity as keyof typeof severityColors] || '#f39c12';
              
              return `
                <div class="slide-item" style="border-left-color: ${severityColor};">
                  <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="background: ${severityColor}; color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">
                      문제 ${index + 1}
                    </div>
                    <div style="flex: 1;">
                      <h4 style="font-size: 1.2rem; margin-bottom: 10px; color: #000000;">${item.problem}</h4>
                      <p style="font-size: 1rem; line-height: 1.6; opacity: 0.9;">${item.solution}</p>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <div style="background: rgba(255,255,255,0.2); padding: 15px 30px; border-radius: 25px; backdrop-filter: blur(10px);">
              ⚠️ 문제가 지속되면 전문가의 도움을 받으세요
            </div>
          </div>
        </div>
      `;
      
    case 'faq':
      return `
        <div class="slide-content" style="position: relative; z-index: 2;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
              ${title}
            </h1>
            <p style="font-size: 1.4rem; opacity: 0.9;">${subtitle}</p>
          </div>
          
          <div style="max-width: 800px; margin: 0 auto;">
            ${(content.faq || [
              { question: '데이터를 새 폰으로 옮기려면?', answer: '제조사 전용 앱이나 클라우드 백업을 활용하세요.' },
              { question: '보안을 강화하려면?', answer: '복잡한 비밀번호와 최신 업데이트를 유지하세요.' },
              { question: '사용 시간을 줄이려면?', answer: '화면 시간 관리 기능과 집중 모드를 활용하세요.' }
            ]).map((item: any, index: number) => `
              <div class="slide-item">
                <div style="display: flex; align-items: flex-start; gap: 15px;">
                  <div style="background: ${theme.accent}; color: white; padding: 8px 12px; border-radius: 50%; font-weight: bold; min-width: 40px; text-align: center;">
                    Q${index + 1}
                  </div>
                  <div style="flex: 1;">
                    <h4 style="font-size: 1.2rem; margin-bottom: 10px; color: #000000;">${item.question}</h4>
                    <p style="font-size: 1rem; line-height: 1.6; opacity: 0.9;">${item.answer}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <div style="background: rgba(255,255,255,0.2); padding: 15px 30px; border-radius: 25px; backdrop-filter: blur(10px);">
              💬 더 많은 도움이 필요하시면 제조사 고객센터에 문의하세요
            </div>
          </div>
        </div>
      `;
      
    default:
      return `
        <div class="slide-content" style="position: relative; z-index: 2; text-align: center;">
          <h1 style="font-size: 3.5rem; margin-bottom: 20px; text-shadow: 2px 2px 8px rgba(0,0,0,0.3);">
            ${title}
          </h1>
          <p style="font-size: 1.4rem; opacity: 0.9;">${subtitle}</p>
          <div style="margin-top: 40px;">
            <p style="font-size: 1.2rem; line-height: 1.8;">콘텐츠를 준비 중입니다...</p>
          </div>
        </div>
      `;
  }
}
function getManualStyles(theme: any): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Malgun Gothic', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
      color: ${theme.text};
      background: ${theme.background};
    }

    .manual-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 30px rgba(0,0,0,0.1);
      min-height: 100vh;
    }

    /* 헤더 스타일 */
    .manual-header {
      background: ${theme.primary};
      color: white;
      padding: 60px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .manual-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
      animation: float 20s ease-in-out infinite;
    }

    .manual-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
      position: relative;
      z-index: 2;
    }

    .manual-subtitle {
      font-size: 1.4rem;
      opacity: 0.9;
      position: relative;
      z-index: 2;
    }

    .manual-meta {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 25px;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
      z-index: 3;
    }

    /* 목차 스타일 */
    .table-of-contents {
      background: #f8f9fa;
      padding: 30px 40px;
      border-bottom: 3px solid ${theme.secondary};
    }

    .toc-title {
      font-size: 1.8rem;
      color: ${theme.text};
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toc-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .toc-item {
      background: white;
      padding: 15px 20px;
      border-radius: 10px;
      border-left: 4px solid ${theme.secondary};
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .toc-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .toc-item a {
      text-decoration: none;
      color: ${theme.text};
      font-weight: 500;
    }

    /* 섹션 스타일 */
    .manual-section {
      padding: 40px;
      border-bottom: 1px solid #eee;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid ${theme.secondary};
    }

    .section-icon {
      font-size: 2rem;
      margin-right: 15px;
      width: 50px;
      height: 50px;
      background: ${theme.secondary};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .section-title {
      font-size: 2.2rem;
      color: ${theme.text};
      font-weight: 600;
    }

    .section-content {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #555;
    }

    /* 콘텐츠 타입별 스타일 */
    .content-text {
      margin-bottom: 20px;
    }

    .content-steps {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 25px;
      margin: 20px 0;
    }

    .content-steps ol {
      counter-reset: step-counter;
      list-style: none;
    }

    .content-steps li {
      counter-increment: step-counter;
      margin-bottom: 15px;
      padding: 15px;
      background: white;
      border-radius: 8px;
      border-left: 4px solid ${theme.secondary};
      position: relative;
    }

    .content-steps li::before {
      content: counter(step-counter);
      position: absolute;
      left: -25px;
      top: 15px;
      width: 30px;
      height: 30px;
      background: ${theme.secondary};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .content-warning {
      background: linear-gradient(135deg, #fff3cd, #ffeaa7);
      border: 1px solid ${theme.warning};
      border-left: 4px solid ${theme.warning};
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      position: relative;
    }

    .content-warning::before {
      content: '⚠️';
      font-size: 1.5rem;
      position: absolute;
      top: 20px;
      left: 20px;
    }

    .content-warning .warning-title {
      font-weight: bold;
      color: #856404;
      margin-left: 30px;
      margin-bottom: 10px;
    }

    .content-warning .warning-content {
      margin-left: 30px;
      color: #856404;
    }

    .content-note {
      background: linear-gradient(135deg, #d1ecf1, #bee5eb);
      border: 1px solid ${theme.secondary};
      border-left: 4px solid ${theme.secondary};
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      position: relative;
    }

    .content-note::before {
      content: '💡';
      font-size: 1.5rem;
      position: absolute;
      top: 20px;
      left: 20px;
    }

    .content-note .note-title {
      font-weight: bold;
      color: #0c5460;
      margin-left: 30px;
      margin-bottom: 10px;
    }

    .content-note .note-content {
      margin-left: 30px;
      color: #0c5460;
    }

    .content-example {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      border: 1px solid ${theme.success};
      border-left: 4px solid ${theme.success};
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      position: relative;
    }

    .content-example::before {
      content: '📋';
      font-size: 1.5rem;
      position: absolute;
      top: 20px;
      left: 20px;
    }

    .content-example .example-title {
      font-weight: bold;
      color: #155724;
      margin-left: 30px;
      margin-bottom: 10px;
    }

    .content-example .example-content {
      margin-left: 30px;
      color: #155724;
    }

    /* 하위 섹션 스타일 */
    .subsection {
      margin: 25px 0;
      padding-left: 20px;
      border-left: 3px solid ${theme.secondary};
    }

    .subsection-title {
      font-size: 1.4rem;
      font-weight: 600;
      color: ${theme.text};
      margin-bottom: 15px;
    }

    /* 문제해결 섹션 */
    .troubleshooting-item {
      background: white;
      border-radius: 10px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .trouble-header {
      padding: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.3s ease;
    }

    .trouble-header:hover {
      background: #f8f9fa;
    }

    .trouble-header.severity-high {
      border-left: 5px solid ${theme.danger};
    }

    .trouble-header.severity-medium {
      border-left: 5px solid ${theme.warning};
    }

    .trouble-header.severity-low {
      border-left: 5px solid ${theme.success};
    }

    .trouble-problem {
      font-weight: 600;
      color: ${theme.text};
    }

    .trouble-toggle {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }

    .trouble-toggle.open {
      transform: rotate(180deg);
    }

    .trouble-solution {
      padding: 0 20px 20px 20px;
      background: #f8f9fa;
      display: none;
      border-top: 1px solid #eee;
    }

    .trouble-solution.show {
      display: block;
    }

    /* FAQ 섹션 */
    .faq-item {
      background: white;
      border-radius: 10px;
      margin-bottom: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .faq-question {
      padding: 20px;
      background: #f8f9fa;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      color: ${theme.text};
      transition: background 0.3s ease;
    }

    .faq-question:hover {
      background: #e9ecef;
    }

    .faq-answer {
      padding: 20px;
      display: none;
      line-height: 1.8;
      color: #555;
    }

    .faq-answer.show {
      display: block;
    }

    /* 부록 섹션 */
    .appendix-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }

    .appendix-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-top: 4px solid ${theme.secondary};
    }

    .appendix-card h4 {
      font-size: 1.3rem;
      color: ${theme.text};
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .glossary-term {
      font-weight: bold;
      color: ${theme.secondary};
      margin-bottom: 5px;
    }

    .glossary-definition {
      margin-bottom: 15px;
      padding-left: 15px;
      color: #666;
    }

    /* 푸터 */
    .manual-footer {
      background: ${theme.primary};
      color: white;
      padding: 40px;
      text-align: center;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-info {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .footer-actions {
      display: flex;
      gap: 15px;
    }

    .footer-btn {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .footer-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    /* 애니메이션 */
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-10px) rotate(1deg); }
      66% { transform: translateY(5px) rotate(-1deg); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .manual-section {
      animation: fadeInUp 0.6s ease-out;
    }

    /* 반응형 디자인 */
    @media (max-width: 768px) {
      .manual-container {
        margin: 0;
        box-shadow: none;
      }

      .manual-header {
        padding: 40px 20px;
      }

      .manual-title {
        font-size: 2.5rem;
      }

      .manual-section {
        padding: 20px;
      }

      .section-title {
        font-size: 1.8rem;
      }

      .toc-list {
        grid-template-columns: 1fr;
      }

      .appendix-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }

    /* 인쇄 스타일 */
    @media print {
      .manual-container {
        box-shadow: none;
      }

      .footer-actions {
        display: none;
      }

      .trouble-solution,
      .faq-answer {
        display: block !important;
      }

      .manual-section {
        page-break-inside: avoid;
      }
    }
  `;
}

// 📋 헤더 섹션 생성
function createManualHeader(data: HybridManualData, theme: any): string {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  return `
    <header class="manual-header">
      <div class="manual-meta">
        버전 ${data.appendix?.version || '1.0'} | ${currentDate}
      </div>
      <h1 class="manual-title">${data.title}</h1>
      <p class="manual-subtitle">${data.subtitle}</p>
    </header>
  `;
}

// 📋 목차 생성
function createTableOfContents(data: HybridManualData): string {
  const sections = [
    { id: 'overview', title: '📋 개요', icon: '📋' },
    ...data.sections.map(section => ({ 
      id: section.id, 
      title: section.title,
      icon: getSectionIcon(section.type)
    })),
    ...(data.troubleshooting ? [{ id: 'troubleshooting', title: '🔧 문제해결', icon: '🔧' }] : []),
    ...(data.faq ? [{ id: 'faq', title: '❓ FAQ', icon: '❓' }] : []),
    ...(data.appendix ? [{ id: 'appendix', title: '📚 부록', icon: '📚' }] : [])
  ];

  return `
    <section class="table-of-contents">
      <h2 class="toc-title">📑 목차</h2>
      <ul class="toc-list">
        ${sections.map(section => `
          <li class="toc-item">
            <a href="#${section.id}">
              ${section.icon} ${section.title}
            </a>
          </li>
        `).join('')}
      </ul>
    </section>
  `;
}

// 📋 개요 섹션 생성
function createOverviewSection(data: HybridManualData, theme: any): string {
  return `
    <section id="overview" class="manual-section">
      <div class="section-header">
        <div class="section-icon">📋</div>
        <h2 class="section-title">개요</h2>
      </div>
      
      <div class="section-content">
        <div class="content-text">
          <h3>📌 목적</h3>
          <p>${data.overview.purpose}</p>
        </div>
        
        <div class="content-text">
          <h3>👥 대상 사용자</h3>
          <p>${data.overview.audience}</p>
        </div>
        
        <div class="content-text">
          <h3>✅ 준비사항</h3>
          <ul>
            ${data.overview.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

// 📋 메인 섹션들 생성
function createMainSections(data: HybridManualData, theme: any): string {
  return data.sections.map(section => `
    <section id="${section.id}" class="manual-section">
      <div class="section-header">
        <div class="section-icon">${getSectionIcon(section.type)}</div>
        <h2 class="section-title">${section.title}</h2>
      </div>
      
      <div class="section-content">
        ${formatSectionContent(section)}
        
        ${section.subsections ? section.subsections.map(subsection => `
          <div class="subsection">
            <h3 class="subsection-title">${subsection.title}</h3>
            <div class="subsection-content">${subsection.content}</div>
          </div>
        `).join('') : ''}
      </div>
    </section>
  `).join('');
}

// 🔧 문제해결 섹션 생성
function createTroubleshootingSection(data: HybridManualData, theme: any): string {
  if (!data.troubleshooting || data.troubleshooting.length === 0) return '';

  return `
    <section id="troubleshooting" class="manual-section">
      <div class="section-header">
        <div class="section-icon">🔧</div>
        <h2 class="section-title">문제해결</h2>
      </div>
      
      <div class="section-content">
        ${data.troubleshooting.map((item, index) => `
          <div class="troubleshooting-item">
            <div class="trouble-header severity-${item.severity}" onclick="toggleTrouble(${index})">
              <div class="trouble-problem">${item.problem}</div>
              <div class="trouble-toggle" id="toggle-${index}">▼</div>
            </div>
            <div class="trouble-solution" id="solution-${index}">
              <p>${item.solution}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ❓ FAQ 섹션 생성
function createFAQSection(data: HybridManualData, theme: any): string {
  if (!data.faq || data.faq.length === 0) return '';

  return `
    <section id="faq" class="manual-section">
      <div class="section-header">
        <div class="section-icon">❓</div>
        <h2 class="section-title">FAQ</h2>
      </div>
      
      <div class="section-content">
        ${data.faq.map((item, index) => `
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFAQ(${index})">
              <span>${item.question}</span>
              <span id="faq-toggle-${index}">▼</span>
            </div>
            <div class="faq-answer" id="faq-answer-${index}">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// 📚 부록 섹션 생성
function createAppendixSection(data: HybridManualData, theme: any): string {
  if (!data.appendix) return '';

  return `
    <section id="appendix" class="manual-section">
      <div class="section-header">
        <div class="section-icon">📚</div>
        <h2 class="section-title">부록</h2>
      </div>
      
      <div class="appendix-grid">
        ${data.appendix.glossary && data.appendix.glossary.length > 0 ? `
          <div class="appendix-card">
            <h4>📖 용어집</h4>
            ${data.appendix.glossary.map(term => `
              <div class="glossary-term">${term.term}</div>
              <div class="glossary-definition">${term.definition}</div>
            `).join('')}
          </div>
        ` : ''}
        
        ${data.appendix.references && data.appendix.references.length > 0 ? `
          <div class="appendix-card">
            <h4>🔗 참고자료</h4>
            <ul>
              ${data.appendix.references.map(ref => `<li>${ref}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="appendix-card">
          <h4>📄 문서 정보</h4>
          <p><strong>버전:</strong> ${data.appendix.version}</p>
          <p><strong>최종 업데이트:</strong> ${data.appendix.lastUpdated}</p>
          <p><strong>카테고리:</strong> ${data.category}</p>
        </div>
      </div>
    </section>
  `;
}

// 📋 푸터 생성
function createManualFooter(data: HybridManualData, theme: any): string {
  return `
    <footer class="manual-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>© 2024 AI 설명서 생성 시스템 | 버전 ${data.appendix?.version || '1.0'}</p>
          <p>문서 생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
        </div>
        <div class="footer-actions">
          <button class="footer-btn" onclick="window.print()">🖨️ 인쇄</button>
          <button class="footer-btn" onclick="copyManualHTML()">📋 복사</button>
          <button class="footer-btn" onclick="downloadManual()">💾 다운로드</button>
        </div>
      </div>
    </footer>
  `;
}

// 🔧 유틸리티 함수들
function getSectionIcon(type: string): string {
  const icons = {
    text: '📝',
    steps: '📋',
    warning: '⚠️',
    note: '💡',
    example: '📊'
  };
  return icons[type as keyof typeof icons] || '📝';
}

function formatSectionContent(section: any): string {
  const content = section.content.replace(/\n/g, '<br>');
  
  switch (section.type) {
    case 'steps':
      const steps = section.content.split('\n').filter((s: string) => s.trim());
      return `
        <div class="content-steps">
          <ol>
            ${steps.map((step: string) => `<li>${step.replace(/^\d+\.\s*/, '')}</li>`).join('')}
          </ol>
        </div>
      `;
    
    case 'warning':
      return `
        <div class="content-warning">
          <div class="warning-title">⚠️ 주의사항</div>
          <div class="warning-content">${content}</div>
        </div>
      `;
    
    case 'note':
      return `
        <div class="content-note">
          <div class="note-title">💡 참고</div>
          <div class="note-content">${content}</div>
        </div>
      `;
    
    case 'example':
      return `
        <div class="content-example">
          <div class="example-title">📋 예시</div>
          <div class="example-content">${content}</div>
        </div>
      `;
    
    default:
      return `<div class="content-text">${content}</div>`;
  }
}

// 📋 자바스크립트 함수들
function getManualScripts(): string {
  return `
    function toggleTrouble(index) {
      const solution = document.getElementById('solution-' + index);
      const toggle = document.getElementById('toggle-' + index);
      
      if (solution.classList.contains('show')) {
        solution.classList.remove('show');
        toggle.classList.remove('open');
        toggle.textContent = '▼';
      } else {
        solution.classList.add('show');
        toggle.classList.add('open');
        toggle.textContent = '▲';
      }
    }

    function toggleFAQ(index) {
      const answer = document.getElementById('faq-answer-' + index);
      const toggle = document.getElementById('faq-toggle-' + index);
      
      if (answer.classList.contains('show')) {
        answer.classList.remove('show');
        toggle.textContent = '▼';
      } else {
        answer.classList.add('show');
        toggle.textContent = '▲';
      }
    }

    function copyManualHTML() {
      const manualHTML = document.documentElement.outerHTML;
      navigator.clipboard.writeText(manualHTML).then(() => {
        alert('설명서 HTML이 클립보드에 복사되었습니다!');
      }).catch(() => {
        alert('복사에 실패했습니다.');
      });
    }

    function downloadManual() {
      const manualHTML = document.documentElement.outerHTML;
      const blob = new Blob([manualHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'manual_설명서.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // 섹션 진입 애니메이션
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out';
        }
      });
    });

    document.querySelectorAll('.manual-section').forEach(section => {
      observer.observe(section);
    });
  `;
}
