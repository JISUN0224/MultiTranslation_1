// PPTTemplateNew.tsx - 새로운 AI HTML 직접 렌더링 방식

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';

interface PPTTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const PPTTemplateNew: React.FC<PPTTemplateProps> = ({ data, currentSection, navigation }) => {
  // AI가 생성한 slides 데이터 우선 사용, 없으면 기존 sections 사용
  const slides = data.slides || []; // AI 생성 슬라이드 배열
  const sections = data.sections || []; // 텍스트 섹션 배열
  
  // 슬라이드 데이터가 있으면 우선 사용
  const currentSlide = slides.length > 0 ? slides[currentSection] : null;
  const totalSlides = slides.length > 0 ? slides.length : sections.length;
  
  console.log('PPTTemplateNew 데이터:', { slides, sections, currentSlide });
  


  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-semibold mb-1">{data.title || 'PPT 프레젠테이션'}</h2>
        <p className="text-sm opacity-90">
          슬라이드 {currentSection + 1} / {totalSlides}: {currentSlide?.title || sections[currentSection] || '로딩 중...'}
        </p>
      </div>

      {/* AI 생성 슬라이드 영역 */}
      <div className="flex-1 p-2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-7xl mx-auto">
          <div 
            className="relative w-full mx-auto shadow-2xl overflow-hidden border-4 border-white"
            style={{ aspectRatio: '4/3', minHeight: '800px' }}
          >
            {/* AI가 생성한 HTML 또는 텍스트 렌더링 */}
            <div className="w-full h-full">
              {currentSlide?.html ? (
                // AI 생성 HTML 슬라이드 렌더링
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: currentSlide.html }}
                />
              ) : (
                // 기본 텍스트 슬라이드 렌더링
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 flex flex-col justify-center">
                  <h1 className="text-4xl font-bold mb-6 text-center">
                    슬라이드 {currentSection + 1}
                  </h1>
                  <div className="text-lg leading-relaxed">
                    {sections[currentSection]?.split('\n').map((line: string, index: number) => (
                      <p key={index} className="mb-4">{line}</p>
                    )) || '내용을 로딩 중입니다...'}
                  </div>
                </div>
              )}
            </div>
            
            {/* 슬라이드 번호 */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">
                {currentSection + 1} / {totalSlides}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 스타일 적용 */}
      {data.styles && (
        <style dangerouslySetInnerHTML={{ __html: data.styles }} />
      )}

      {/* 네비게이션 */}
      <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
        <button
          onClick={navigation.onPrevious}
          disabled={navigation.currentSection === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px)"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>이전</span>
        </button>

        <div className="flex items-center space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => navigation.onSectionChange?.(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === totalSlides - 1}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px) shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white"
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PPTTemplateNew;
