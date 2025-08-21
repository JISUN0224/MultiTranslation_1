// PPTDirectRender.tsx - HTML 직접 렌더링 방식

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PPTDirectRenderProps {
  slides: Array<{
    id: number;
    title: string;
    subtitle?: string;
    html: string;
  }>;
  onTextExtracted?: (text: string) => void; // 추출된 텍스트 콜백
}

const PPTDirectRender: React.FC<PPTDirectRenderProps> = ({ slides, onTextExtracted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;

  // 현재 슬라이드가 변경될 때 텍스트 추출
  useEffect(() => {
    if (slides[currentSlide]?.html) {
      const extractedText = extractTextFromHTML(slides[currentSlide].html);
      onTextExtracted?.(extractedText);
    }
  }, [currentSlide, slides, onTextExtracted]);

  // HTML에서 텍스트 추출 함수
  const extractTextFromHTML = (html: string): string => {
    try {
      // DOMParser로 HTML 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 텍스트만 추출 (태그 제거)
      const textContent = doc.body.textContent || doc.body.innerText || '';
      
      // 여러 공백을 하나로 정리하고 줄바꿈 정리
      return textContent
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    } catch (error) {
      console.error('텍스트 추출 실패:', error);
      return '';
    }
  };

  // 네비게이션 함수들
  const goToPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  if (!slides || slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">슬라이드가 없습니다</h2>
          <p className="text-gray-400">PPT를 생성해주세요.</p>
        </div>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{slide.title}</h2>
            {slide.subtitle && (
              <p className="text-sm text-gray-600">{slide.subtitle}</p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            슬라이드 {currentSlide + 1} / {totalSlides}
          </div>
        </div>
      </div>

      {/* 메인 슬라이드 영역 - 더 큰 비율 */}
      <div className="flex-1 flex items-center justify-center p-2">
        <div className="w-full max-w-full mx-auto">
          <div 
            className="relative w-full shadow-2xl rounded-lg overflow-hidden"
            style={{ aspectRatio: '4/3', minHeight: '300px' }}
          >
            {/* 🔥 HTML 직접 렌더링 */}
            <div 
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: slide.html }}
            />
            
            {/* 슬라이드 번호 오버레이 */}
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* 이전 버튼 */}
          <button
            onClick={goToPrevious}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>이전</span>
          </button>

          {/* 슬라이드 점들 */}
          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 shadow-lg scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={goToNext}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <span>다음</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 풀스크린 모드 버튼 */}
      <button
        onClick={() => {
          const element = document.documentElement;
          if (element.requestFullscreen) {
            element.requestFullscreen();
          }
        }}
        className="fixed bottom-4 left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
        title="풀스크린 모드"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    </div>
  );
};

export default PPTDirectRender;
