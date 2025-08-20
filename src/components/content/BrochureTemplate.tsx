import React from 'react';
import { ChevronLeft, ChevronRight, Star, Gift } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';

interface BrochureTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const BrochureTemplate: React.FC<BrochureTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-sm text-gray-600">{data.subtitle}</p>
        )}
      </div>

      {/* 브로슈어 영역 */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto">
          {/* A4 비율 브로슈어 */}
          <div 
            className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
            style={{ aspectRatio: '210/297' }}
          >
            {/* 상단 헤더 (그라데이션 배경) */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">섹션 {currentSection + 1}</h3>
                <div className="flex justify-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
                  ))}
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="p-6 space-y-6">
              {/* 콘텐츠 카드 */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-800 leading-relaxed text-sm">
                  {currentText}
                </p>
              </div>

              {/* 특별 혜택 박스 */}
              {currentSection === 2 && (
                <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gift className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">특별 혜택</h4>
                  </div>
                  <p className="text-orange-700 text-sm">
                    지금 주문하시면 추가 할인 혜택을 받으실 수 있습니다!
                  </p>
                </div>
              )}

              {/* 제품 그리드 (짝수 섹션에서만 표시) */}
              {currentSection % 2 === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded p-3">
                      <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                      <p className="text-xs text-gray-600 text-center">제품 {i + 1}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 하단 */}
            <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500">
                페이지 {currentSection + 1} / {data.sections.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="p-6 border-t border-gray-200 flex items-center justify-between">
        <button
          onClick={navigation.onPrevious}
          disabled={navigation.currentSection === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>이전</span>
        </button>

        <div className="flex items-center space-x-2">
          {data.sections.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentSection ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === navigation.totalSections - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200"
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BrochureTemplate;
