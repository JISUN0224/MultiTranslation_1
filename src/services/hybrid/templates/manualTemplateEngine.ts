// 📚 설명서 템플릿 엔진 - manualTemplateEngine.ts
// services/hybrid/templates/manualTemplateEngine.ts

interface HybridManualData {
  title: string;
  subtitle: string;
  version: string;
  date: string;
  basicUsage: {
    initialSetup: {
      title: string;
      description: string;
      steps: string[];
    };
    basicGestures: {
    title: string;
      description: string;
      gestures: Array<{ name: string; description: string; }>;
    };
    watchfaceCustomization: {
      title: string;
      description: string;
      steps: string[];
    };
  };
  precautions: {
    batteryManagement: {
      title: string;
      description: string;
      tips: string[];
    };
    waterproofPrecautions: {
      title: string;
      description: string;
      tips: string[];
    };
    smartphoneConnection: {
      title: string;
      description: string;
      tips: string[];
    };
  };
  troubleshooting: Array<{
    problem: string;
    solution: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

// 🎯 메인 템플릿 생성 함수
export const getManualTemplate = (data: HybridManualData): string => {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Malgun Gothic', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.7;
            color: #2d3436;
            background: #ffffff;
            overflow-x: hidden;
    }

    .manual-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 0 30px rgba(0,0,0,0.1);
      min-height: 100vh;
    }

        /* 첫 페이지 전체 스타일 */
        .first-page {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
            min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

        .first-page::before {
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

        /* 헤더 스타일 */
        .manual-header {
            padding: 60px 40px 40px 40px;
            text-align: center;
            position: relative;
            z-index: 2;
        }

    .manual-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 20px;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
    }

    .manual-subtitle {
      font-size: 1.4rem;
      opacity: 0.9;
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
            padding: 40px;
            position: relative;
            z-index: 2;
    }

    .toc-title {
      font-size: 1.8rem;
            color: white;
            margin-bottom: 30px;
            text-align: center;
    }

    .toc-list {
      display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            list-style: none;
            max-width: 600px;
            margin: 0 auto;
    }

    .toc-item a {
            display: flex;
            align-items: center;
            padding: 20px 25px;
            background: rgba(255,255,255,0.15);
            border-radius: 15px;
      text-decoration: none;
            color: white;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            font-size: 1.1rem;
      font-weight: 500;
    }

        .toc-item a:hover {
            transform: translateY(-3px);
            background: rgba(255,255,255,0.25);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

    /* 섹션 스타일 */
    .manual-section {
      padding: 40px;
            border-bottom: 1px solid #e9ecef;
    }

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
    }

    .section-icon {
      font-size: 2rem;
      margin-right: 15px;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
      color: white;
            width: 60px;
            height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
            box-shadow: 0 5px 15px rgba(116, 185, 255, 0.3);
    }

    .section-title {
      font-size: 2.2rem;
            color: #2d3436;
            font-weight: bold;
    }

    .section-content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            border-left: 5px solid #74b9ff;
        }

    .content-text {
            margin-bottom: 25px;
        }

        .content-text h3 {
            font-size: 1.3rem;
            color: #0984e3;
      margin-bottom: 10px;
            font-weight: 600;
        }

        .content-text p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #2d3436;
        }

        .content-text ul {
            margin-left: 20px;
        }

        .content-text li {
            margin-bottom: 8px;
            font-size: 1.1rem;
        }

        /* 문제해결 섹션 - 펼쳐진 형태 */
        .trouble-item {
      background: white;
      border-radius: 10px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .trouble-header {
            background: #fd79a8;
            color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
            align-items: center;
    }

    .trouble-solution {
            padding: 20px;
            background: #fff5f5;
        }

        /* FAQ 섹션 - 펼쳐진 형태 */
    .faq-item {
      background: white;
      border-radius: 10px;
      margin-bottom: 15px;
      overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .faq-question {
            background: #fdcb6e;
            color: #2d3436;
      padding: 20px;
      display: flex;
      justify-content: space-between;
            align-items: center;
      font-weight: 600;
    }

    .faq-answer {
      padding: 20px;
            background: #fffbf0;
    }

    /* 푸터 */
    .manual-footer {
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
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
                padding: 40px 20px 30px 20px;
      }

      .manual-title {
        font-size: 2.5rem;
      }

            .table-of-contents {
                padding: 30px 20px;
      }

      .toc-list {
        grid-template-columns: 1fr;
                gap: 15px;
            }

            .manual-section {
                padding: 20px;
            }

            .section-title {
                font-size: 1.8rem;
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

      .manual-section {
        page-break-inside: avoid;
      }
    }
    </style>
</head>
<body>
    <div class="manual-container">
        <!-- 페이지 1: 표지 + 목차 -->
        <div class="first-page">
    <header class="manual-header">
      <div class="manual-meta">
                    ${data.version} | ${data.date}
      </div>
      <h1 class="manual-title">${data.title}</h1>
      <p class="manual-subtitle">${data.subtitle}</p>
    </header>

    <section class="table-of-contents">
      <h2 class="toc-title">📑 목차</h2>
      <ul class="toc-list">
          <li class="toc-item">
                        <a href="#basic-usage">
                            📱 기본 사용법
            </a>
          </li>
                    <li class="toc-item">
                        <a href="#precautions">
                            ⚠️ 주의사항
                        </a>
                    </li>
                    <li class="toc-item">
                        <a href="#troubleshooting">
                            🔧 문제해결
                        </a>
                    </li>
                    <li class="toc-item">
                        <a href="#faq">
                            ❓ FAQ
                        </a>
                    </li>
      </ul>
    </section>
        </div>

        <!-- 페이지 2: 기본 사용법 -->
        <section id="basic-usage" class="manual-section">
      <div class="section-header">
                <div class="section-icon">📱</div>
                <h2 class="section-title">기본 사용법</h2>
      </div>
      
      <div class="section-content">
        <div class="content-text">
                    <h3>🔋 ${data.basicUsage.initialSetup.title}</h3>
                    <p>${data.basicUsage.initialSetup.description}</p>
                    <ul>
                        ${data.basicUsage.initialSetup.steps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
        </div>
        
        <div class="content-text">
                    <h3>🎯 ${data.basicUsage.basicGestures.title}</h3>
                    <p>${data.basicUsage.basicGestures.description}</p>
                    <ul>
                        ${data.basicUsage.basicGestures.gestures.map(gesture => 
                            `<li><strong>${gesture.name}:</strong> ${gesture.description}</li>`
                        ).join('')}
                    </ul>
        </div>
        
        <div class="content-text">
                    <h3>🎨 ${data.basicUsage.watchfaceCustomization.title}</h3>
                    <p>${data.basicUsage.watchfaceCustomization.description}</p>
          <ul>
                        ${data.basicUsage.watchfaceCustomization.steps.map(step => `<li>${step}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>

        <!-- 페이지 3: 주의사항 -->
        <section id="precautions" class="manual-section">
      <div class="section-header">
                <div class="section-icon">⚠️</div>
                <h2 class="section-title">주의사항</h2>
      </div>
      
      <div class="section-content">
                <div class="content-text">
                    <h3>🔋 ${data.precautions.batteryManagement.title}</h3>
                    <p>${data.precautions.batteryManagement.description}</p>
                    <ul>
                        ${data.precautions.batteryManagement.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="content-text">
                    <h3>💧 ${data.precautions.waterproofPrecautions.title}</h3>
                    <p>${data.precautions.waterproofPrecautions.description}</p>
                    <ul>
                        ${data.precautions.waterproofPrecautions.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
          </div>

                <div class="content-text">
                    <h3>📱 ${data.precautions.smartphoneConnection.title}</h3>
                    <p>${data.precautions.smartphoneConnection.description}</p>
                    <ul>
                        ${data.precautions.smartphoneConnection.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
      </div>
    </section>

        <!-- 페이지 4: 문제해결 -->
    <section id="troubleshooting" class="manual-section">
      <div class="section-header">
        <div class="section-icon">🔧</div>
        <h2 class="section-title">문제해결</h2>
      </div>
      
      <div class="section-content">
                ${data.troubleshooting.map(item => `
                    <div class="trouble-item">
                        <div class="trouble-header">
                            <span>${item.problem}</span>
            </div>
                        <div class="trouble-solution">
                            <p><strong>해결 방법:</strong></p>
                            <ul>
                                ${item.solution.map(step => `<li>${step}</li>`).join('')}
                            </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

        <!-- 페이지 5: FAQ -->
    <section id="faq" class="manual-section">
      <div class="section-header">
        <div class="section-icon">❓</div>
                <h2 class="section-title">자주 묻는 질문</h2>
      </div>
      
      <div class="section-content">
                ${data.faq.map(item => `
          <div class="faq-item">
                        <div class="faq-question">
              <span>${item.question}</span>
            </div>
                        <div class="faq-answer">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

        <!-- 푸터 -->
    <footer class="manual-footer">
      <div class="footer-content">
        <div class="footer-info">
                    <p>${data.title} ${data.version}</p>
                    <p>© 2024 Samsung Electronics. All rights reserved.</p>
        </div>
        <div class="footer-actions">
                    <button class="footer-btn" onclick="copyManualHTML()">HTML 복사</button>
                    <button class="footer-btn" onclick="downloadManual()">다운로드</button>
        </div>
      </div>
    </footer>
        </div>

    <script>
    function copyManualHTML() {
      const manualHTML = document.documentElement.outerHTML;
      navigator.clipboard.writeText(manualHTML).then(() => {
                alert('매뉴얼 HTML이 클립보드에 복사되었습니다!');
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
            a.download = 'manual.html';
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
    </script>
</body>
</html>`;
};

// 🎯 매뉴얼 슬라이드 생성 함수
export const generateManualSlides = async (data: HybridManualData, templateType: string, request: any): Promise<Array<{
  id: number;
  title: string;
  subtitle?: string;
  html: string;
}>> => {
  // 각 페이지별 개별 HTML 생성
  const pages = [
    {
      id: 1,
      title: '표지 + 목차',
      subtitle: '매뉴얼 개요 및 목차',
      html: generateCoverPageHTML(data)
    },
    {
      id: 2,
      title: '기본 사용법',
      subtitle: '초기 설정 및 기본 조작법',
      html: generateBasicUsagePageHTML(data)
    },
    {
      id: 3,
      title: '주의사항',
      subtitle: '사용 시 주의사항 및 팁',
      html: generatePrecautionsPageHTML(data)
    },
    {
      id: 4,
      title: '문제해결',
      subtitle: '자주 발생하는 문제와 해결방법',
      html: generateTroubleshootingPageHTML(data)
    },
    {
      id: 5,
      title: 'FAQ',
      subtitle: '자주 묻는 질문과 답변',
      html: generateFAQPageHTML(data)
    }
  ];

  return pages;
};

// 🎯 표지 + 목차 페이지 HTML 생성
function generateCoverPageHTML(data: HybridManualData): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', 'Malgun Gothic', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.7;
                color: #2d3436;
                background: #ffffff;
                overflow-x: hidden;
            }

            .manual-container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 30px rgba(0,0,0,0.1);
            }

                         /* 첫 페이지 전체 스타일 */
             .first-page {
                 background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                 color: white;
                 min-height: 100vh;
                 height: 100vh;
                 position: relative;
                 overflow: hidden;
                 display: flex;
                 flex-direction: column;
                 justify-content: space-between;
             }

            .first-page::before {
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

                         /* 헤더 스타일 */
             .manual-header {
                 padding: 120px 40px 80px 40px;
                 text-align: center;
                 position: relative;
                 z-index: 2;
                 flex: 1;
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
             }

            .manual-title {
                font-size: 3.5rem;
                font-weight: bold;
                margin-bottom: 20px;
                text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            }

            .manual-subtitle {
                font-size: 1.4rem;
                opacity: 0.9;
            }

                         /* 목차 스타일 */
             .table-of-contents {
                 padding: 80px 40px 120px 40px;
                 position: relative;
                 z-index: 2;
             }

                         .toc-title {
                 font-size: 1.8rem;
                 color: white;
                 margin-bottom: 60px;
                 text-align: center;
             }

            .toc-list {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                list-style: none;
                max-width: 600px;
                margin: 0 auto;
            }

            .toc-item a {
                display: flex;
                align-items: center;
                padding: 20px 25px;
                background: rgba(255,255,255,0.15);
                border-radius: 15px;
                text-decoration: none;
                color: white;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                font-size: 1.1rem;
                font-weight: 500;
            }

            .toc-item a:hover {
                transform: translateY(-3px);
                background: rgba(255,255,255,0.25);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }

            /* 애니메이션 */
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                33% { transform: translateY(-10px) rotate(1deg); }
                66% { transform: translateY(5px) rotate(-1deg); }
            }
        </style>
    </head>
    <body>
        <div class="manual-container">
            <div class="first-page">
                <header class="manual-header">
                    <h1 class="manual-title">${data.title}</h1>
                    <p class="manual-subtitle">${data.subtitle}</p>
                </header>

                <section class="table-of-contents">
                    <h2 class="toc-title">📑 목차</h2>
                    <ul class="toc-list">
                        <li class="toc-item">
                            <a href="#basic-usage">
                                📱 기본 사용법
                            </a>
                        </li>
                        <li class="toc-item">
                            <a href="#precautions">
                                ⚠️ 주의사항
                            </a>
                        </li>
                        <li class="toc-item">
                            <a href="#troubleshooting">
                                🔧 문제해결
                            </a>
                        </li>
                        <li class="toc-item">
                            <a href="#faq">
                                ❓ FAQ
                            </a>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </body>
    </html>`;
}

// 🎯 기본 사용법 페이지 HTML 생성
function generateBasicUsagePageHTML(data: HybridManualData): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>기본 사용법</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                background: #f8f9fa;
                min-height: 100vh;
                height: 100vh;
            }
            
            .manual-section {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                min-height: 100vh;
                height: 100vh;
            }
            
            .section-title {
                font-size: 2.5rem;
                color: #2d3436;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .content-text {
                margin-bottom: 30px;
            }
            
            .content-text h3 {
                font-size: 1.5rem;
                color: #0984e3;
                margin-bottom: 15px;
                font-weight: 600;
            }
            
            .content-text p {
                font-size: 1.1rem;
                line-height: 1.8;
                color: #2d3436;
                margin-bottom: 15px;
            }
            
            .content-text ul {
                margin-left: 20px;
            }
            
            .content-text li {
                margin-bottom: 10px;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            .gesture-item {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 15px;
                border-left: 4px solid #74b9ff;
            }
            
            .gesture-name {
                font-weight: 600;
                color: #0984e3;
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="manual-section">
            <div class="section-title">📱 기본 사용법</div>
            
                         <div class="content-text">
                 <h3>🎯 ${data.basicUsage.basicGestures.title}</h3>
                 <p>${data.basicUsage.basicGestures.description}</p>
                 ${data.basicUsage.basicGestures.gestures.map(gesture => `
                     <div class="gesture-item">
                         <div class="gesture-name">${gesture.name}</div>
                         <div>${gesture.description}</div>
                     </div>
                 `).join('')}
             </div>
        </div>
    </body>
    </html>`;
}

// 🎯 주의사항 페이지 HTML 생성
function generatePrecautionsPageHTML(data: HybridManualData): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>주의사항</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                background: #f8f9fa;
                min-height: 100vh;
                height: 100vh;
            }
            
            .manual-section {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                min-height: 100vh;
                height: 100vh;
            }
            
            .section-title {
                font-size: 2.5rem;
                color: #2d3436;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .precaution-item {
                background: white;
                border-radius: 15px;
                margin-bottom: 25px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border: 1px solid #e9ecef;
            }
            
            .precaution-header {
                background: #00b894;
                color: white;
                padding: 25px;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .precaution-content {
                padding: 25px;
                background: #f0fff4;
            }
            
            .precaution-content p {
                margin-bottom: 15px;
                font-size: 1.1rem;
                line-height: 1.6;
                color: #2d3436;
            }
            
            .precaution-content ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .precaution-content li {
                margin-bottom: 8px;
                font-size: 1.1rem;
                line-height: 1.6;
                color: #2d3436;
            }
        </style>
    </head>
    <body>
        <div class="manual-section">
            <div class="section-title">⚠️ 주의사항</div>
            
                         <div class="precaution-item">
                 <div class="precaution-header">🔋 ${data.precautions.batteryManagement.title}</div>
                 <div class="precaution-content">
                     <ul>
                         ${data.precautions.batteryManagement.tips.slice(0, 2).map(tip => `<li>${tip}</li>`).join('')}
                     </ul>
                 </div>
             </div>
            
                         <div class="precaution-item">
                 <div class="precaution-header">💧 ${data.precautions.waterproofPrecautions.title}</div>
                 <div class="precaution-content">
                     <ul>
                         ${data.precautions.waterproofPrecautions.tips.slice(0, 2).map(tip => `<li>${tip}</li>`).join('')}
                     </ul>
                 </div>
             </div>
            
                         <div class="precaution-item">
                 <div class="precaution-header">📱 ${data.precautions.smartphoneConnection.title}</div>
                 <div class="precaution-content">
                     <ul>
                         ${data.precautions.smartphoneConnection.tips.slice(0, 2).map(tip => `<li>${tip}</li>`).join('')}
                     </ul>
                 </div>
             </div>
        </div>
    </body>
    </html>`;
}

// 🎯 문제해결 페이지 HTML 생성
function generateTroubleshootingPageHTML(data: HybridManualData): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>문제해결</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                background: #f8f9fa;
                min-height: 100vh;
                height: 100vh;
            }
            
            .manual-section {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                min-height: 100vh;
                height: 100vh;
            }
            
            .section-title {
                font-size: 2.5rem;
                color: #2d3436;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .trouble-item {
                background: white;
                border-radius: 15px;
                margin-bottom: 25px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border: 1px solid #e9ecef;
            }
            
            .trouble-header {
                background: #fd79a8;
                color: white;
                padding: 25px;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .trouble-solution {
                padding: 25px;
                background: #fff5f5;
            }
            
            .trouble-solution ul {
                margin: 0;
                padding-left: 20px;
            }
            
            .trouble-solution li {
                margin-bottom: 10px;
                font-size: 1.1rem;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="manual-section">
            <div class="section-title">🔧 문제해결</div>
            
                         ${data.troubleshooting.map(item => `
                 <div class="trouble-item">
                     <div class="trouble-header">${item.problem}</div>
                     <div class="trouble-solution">
                         <ul>
                             ${item.solution.slice(0, 2).map(sol => `<li>${sol}</li>`).join('')}
                         </ul>
                     </div>
                 </div>
             `).join('')}
        </div>
    </body>
    </html>`;
}

// 🎯 FAQ 페이지 HTML 생성
function generateFAQPageHTML(data: HybridManualData): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FAQ</title>
        <style>
            body {
                margin: 0;
                padding: 40px;
                font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
                background: #f8f9fa;
                min-height: 100vh;
                height: 100vh;
            }
            
            .manual-section {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                min-height: 100vh;
                height: 100vh;
            }
            
            .section-title {
                font-size: 2.5rem;
                color: #2d3436;
                font-weight: bold;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .faq-item {
                background: white;
                border-radius: 15px;
                margin-bottom: 20px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border: 1px solid #e9ecef;
            }
            
            .faq-question {
                background: #fdcb6e;
                color: #2d3436;
                padding: 25px;
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .faq-answer {
                padding: 25px;
                background: #fffbf0;
                font-size: 1.1rem;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="manual-section">
            <div class="section-title">❓ 자주 묻는 질문</div>
            
            ${data.faq.map(item => `
                <div class="faq-item">
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer">${item.answer}</div>
                </div>
            `).join('')}
        </div>
    </body>
    </html>`;
}

// 🎯 매뉴얼 템플릿 선택 함수
export const selectManualTemplate = (category: string): string => {
  const templateMap: { [key: string]: string } = {
    'technical': 'technical',
    'user-guide': 'user-guide',
    'tutorial': 'tutorial',
    'reference': 'reference',
    'troubleshooting': 'troubleshooting'
  };
  
  return templateMap[category] || 'user-guide';
};
