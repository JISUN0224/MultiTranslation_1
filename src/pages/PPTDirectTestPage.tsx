// PPTDirectTestPage.tsx - HTML 직접 렌더링 PPT 테스트 페이지

import React, { useState, useEffect } from 'react';
import PPTDirectRender from '../components/content/PPTDirectRender';
import { generateContentWithAI, simulateGenerationProgress } from '../services/aiService';
import { ContentRequest } from '../types';

const PPTDirectTestPage: React.FC = () => {
  const [slides, setSlides] = useState<Array<{
    id: number;
    title: string;
    subtitle?: string;
    html: string;
  }>>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [extractedText, setExtractedText] = useState('');

  // 테스트용 PPT 생성
  const generateTestPPT = async () => {
    setIsGenerating(true);
    setProgress(0);
    setProgressMessage('PPT 생성 시작...');

    try {
      // 진행률 시뮬레이션
      await simulateGenerationProgress((progress, message) => {
        setProgress(progress);
        setProgressMessage(message);
      });

      // AI PPT 생성 요청
      const request: ContentRequest = {
        type: 'ppt',
        topic: '넷플릭스',
        language: 'ko-zh',
        difficulty: '중급',
        style: '모던',
        industry: '엔터테인먼트'
      };

      const result = await generateContentWithAI(request, (progress, message) => {
        setProgress(progress);
        setProgressMessage(message);
      });

      if (result.data?.slides) {
        // AI가 생성한 슬라이드 데이터를 PPTDirectRender 형식으로 변환
        const formattedSlides = result.data.slides.map((slide: any) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          html: slide.html
        }));
        
        setSlides(formattedSlides);
        console.log('생성된 슬라이드:', formattedSlides);
      } else {
        console.error('슬라이드 데이터가 없습니다:', result);
      }
    } catch (error) {
      console.error('PPT 생성 실패:', error);
      setProgressMessage('PPT 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 텍스트 추출 콜백
  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    console.log('추출된 텍스트:', text);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PPT HTML 직접 렌더링 테스트</h1>
              <p className="text-sm text-gray-600">AI가 생성한 HTML을 직접 렌더링하는 방식</p>
            </div>
            <button
              onClick={generateTestPPT}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isGenerating ? '생성 중...' : 'PPT 생성'}
            </button>
          </div>
        </div>
      </div>

      {/* 진행률 표시 */}
      {isGenerating && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{progressMessage}</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* PPT 렌더링 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg h-full overflow-hidden">
              {slides.length > 0 ? (
                <PPTDirectRender 
                  slides={slides} 
                  onTextExtracted={handleTextExtracted}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      PPT를 생성해주세요
                    </h2>
                    <p className="text-gray-500">
                      위의 "PPT 생성" 버튼을 클릭하여 AI PPT를 만들어보세요.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 - 정보 표시 */}
          <div className="space-y-6">
            {/* 슬라이드 정보 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">슬라이드 정보</h3>
              {slides.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">총 슬라이드:</span>
                    <span className="ml-2 text-sm text-gray-900">{slides.length}개</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">현재 슬라이드:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {slides[0]?.title || '제목 없음'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">슬라이드가 없습니다.</p>
              )}
            </div>

            {/* 추출된 텍스트 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">추출된 텍스트</h3>
              {extractedText ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">텍스트가 추출되지 않았습니다.</p>
              )}
            </div>

            {/* 디버그 정보 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">디버그 정보</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">렌더링 방식:</span>
                  <span className="ml-2 text-gray-900">HTML 직접 렌더링</span>
                </div>
                <div>
                  <span className="text-gray-500">비율:</span>
                  <span className="ml-2 text-gray-900">16:9</span>
                </div>
                <div>
                  <span className="text-gray-500">네비게이션:</span>
                  <span className="ml-2 text-gray-900">키보드 지원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPTDirectTestPage;
