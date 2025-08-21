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
      <main className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Desktop: 좌우 분할, Mobile: 상하 분할 */}
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* 콘텐츠 영역 - Desktop: 70%, Mobile: 전체 높이의 50% */}
          <div className="w-full lg:w-[70%] h-1/2 lg:h-full flex">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full h-full">
              {contentArea}
            </div>
          </div>

          {/* 번역 패널 - Desktop: 30%, Mobile: 전체 높이의 50% */}
          <div className="w-full lg:w-[30%] h-1/2 lg:h-full flex">
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
