import React from 'react';

interface LayoutProps {
  header: React.ReactNode;
  contentArea: React.ReactNode;
  translationPanel: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, contentArea, translationPanel }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {header}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop: 좌우 분할, Mobile: 상하 분할 */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          {/* 콘텐츠 영역 - Desktop: 60%, Mobile: 전체 높이의 50% */}
          <div className="w-full lg:w-3/5 h-1/2 lg:h-full flex">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full h-full">
              {contentArea}
            </div>
          </div>

          {/* 번역 패널 - Desktop: 40%, Mobile: 전체 높이의 50% */}
          <div className="w-full lg:w-2/5 h-1/2 lg:h-full flex">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full h-full">
              {translationPanel}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
