import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ManualSlideViewerProps {
  html: string;
  title: string;
  language?: string;
}

const ManualSlideViewer: React.FC<ManualSlideViewerProps> = ({ html, title, language }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // 언어 감지 (기본값: 한국어)
  const isKorean = language !== 'zh-ko';
  
  // HTML을 페이지별로 분할 (언어별 동적 제목)
  const pages = [
    { id: 'cover', title: isKorean ? '표지 + 목차' : '封面 + 目录', icon: '📑' },
    { id: 'basic-usage', title: isKorean ? '기본 사용법' : '基本使用方法', icon: '📱' },
    { id: 'precautions', title: isKorean ? '주의사항' : '注意事项', icon: '⚠️' },
    { id: 'troubleshooting', title: isKorean ? '문제해결' : '问题解决', icon: '🔧' },
    { id: 'faq', title: isKorean ? '자주 묻는 질문' : '常见问题', icon: '❓' }
  ];

  const goToPage = (pageIndex: number) => {
    setCurrentPage(Math.max(0, Math.min(pageIndex, pages.length - 1)));
  };

  const goToPrevious = () => {
    goToPage(currentPage - 1);
  };

  const goToNext = () => {
    goToPage(currentPage + 1);
  };

  return (
    <div className="manual-slide-viewer" data-testid="manual-container">
      {/* 네비게이션 바 */}
      <div className="manual-navigation" data-testid="slide-navigation">
        <div className="nav-info">
          <h2 className="nav-title">{title}</h2>
          <span className="nav-page">
            {currentPage + 1} / {pages.length}
          </span>
        </div>
        
        <div className="nav-controls">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 0}
            className="nav-btn"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="nav-dots">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => goToPage(index)}
                className={`nav-dot ${index === currentPage ? 'active' : ''}`}
                title={page.title}
              >
                <span className="dot-icon">{page.icon}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={goToNext}
            disabled={currentPage === pages.length - 1}
            className="nav-btn"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 매뉴얼 콘텐츠 */}
      <div className="manual-content" data-testid="manual-content">
        <div 
          className="manual-html-content"
          dangerouslySetInnerHTML={{ __html: html }}
          data-testid="manual-sections"
        />
      </div>

      <style jsx>{`
        .manual-slide-viewer {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8f9fa;
        }

        .manual-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .nav-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3436;
          margin: 0;
        }

        .nav-page {
          background: #74b9ff;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .nav-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          background: white;
          color: #2d3436;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-btn:hover:not(:disabled) {
          background: #74b9ff;
          color: white;
          border-color: #74b9ff;
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-dots {
          display: flex;
          gap: 0.5rem;
        }

        .nav-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-dot:hover {
          background: #f8f9fa;
          border-color: #74b9ff;
        }

        .nav-dot.active {
          background: #74b9ff;
          border-color: #74b9ff;
          color: white;
        }

        .dot-icon {
          font-size: 1rem;
        }

        .manual-content {
          flex: 1;
          overflow: auto;
          padding: 2rem;
        }

        .manual-html-content {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .manual-navigation {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .nav-controls {
            width: 100%;
            justify-content: center;
          }

          .manual-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManualSlideViewer;
