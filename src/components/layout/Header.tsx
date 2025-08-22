import React from 'react';
import { Globe, Presentation as PresentationIcon } from 'lucide-react';
import { ContentType, ContentTypeOption } from '../../types';

interface HeaderProps {
  currentContentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  currentSection: number;
  totalSections: number;
}

const Header: React.FC<HeaderProps> = ({
  currentContentType,
  onContentTypeChange,
  currentSection,
  totalSections,
}) => {
  const contentTypes: ContentTypeOption[] = [
    { id: 'ppt', label: 'PPT', icon: PresentationIcon },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 제목 */}
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              번역 연습 시스템
            </h1>
          </div>

          {/* 진행률 */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">진행률:</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentSection + 1) / totalSections) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {currentSection + 1}/{totalSections}
                </span>
              </div>
            </div>
          </div>

          {/* 콘텐츠 타입 선택기 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              타입:
            </span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => onContentTypeChange(type.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      currentContentType === type.id
                        ? 'bg-white text-primary-600 shadow-sm transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 모바일 진행률 */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              섹션 {currentSection + 1} / {totalSections}
            </span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSection + 1) / totalSections) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
