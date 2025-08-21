// TestPage.tsx - 새로운 AI HTML 생성 방식 테스트 페이지

import React, { useState } from 'react';
import { generatePPTWithAI, simulateGenerationProgress } from '../services/aiService';
import { ContentRequest, GeneratedContent } from '../types';
import PPTDirectRender from '../components/content/PPTDirectRender';

const TestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [slides, setSlides] = useState<Array<{
    id: number;
    title: string;
    subtitle?: string;
    html: string;
  }>>([]);
  const [extractedText, setExtractedText] = useState('');
  const [formData, setFormData] = useState({
    topic: '스마트 홈 IoT 솔루션',
    difficulty: 'intermediate' as const,
    style: '전문적인',
    industry: '기술'
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    setProgress(0);
    setProgressMessage('');

    const request: ContentRequest = {
      type: 'ppt',
      topic: formData.topic,
      difficulty: formData.difficulty,
      language: 'ko-zh',
      style: formData.style,
      industry: formData.industry
    };

    try {
      // 진행률 시뮬레이션
      await simulateGenerationProgress((progress, message) => {
        setProgress(progress);
        setProgressMessage(message);
      });

      // AI PPT 생성
      const content = await generatePPTWithAI(request);
      setGeneratedContent(content);
      
      // AI가 생성한 슬라이드 데이터를 PPTDirectRender 형식으로 변환
      if (content.data?.slides) {
        const formattedSlides = content.data.slides.map((slide: any) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          html: slide.html
        }));
        setSlides(formattedSlides);
        console.log('생성된 슬라이드:', formattedSlides);
      }
      
    } catch (error) {
      console.error('PPT 생성 실패:', error);
      alert('PPT 생성에 실패했습니다. API 키를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 텍스트 추출 콜백
  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
    console.log('추출된 텍스트:', text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI PPT 생성 테스트</h1>
              <p className="text-sm text-gray-600">새로운 AI HTML 직접 렌더링 방식</p>
            </div>
            <a 
              href="/" 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 설정 패널 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">PPT 생성 설정</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주제
                  </label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 스마트 홈 IoT 솔루션"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    난이도
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="beginner">초급</option>
                    <option value="intermediate">중급</option>
                    <option value="advanced">고급</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    스타일
                  </label>
                  <input
                    type="text"
                    value={formData.style}
                    onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 전문적인"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업계
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 기술"
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '생성 중...' : 'AI PPT 생성하기'}
                </button>
              </div>

              {/* 진행률 표시 */}
              {isLoading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{progressMessage}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 정보 패널 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">테스트 정보</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>새로운 방식:</strong> HTML 직접 렌더링
                </div>
                <div>
                  <strong>장점:</strong> 완전히 자유로운 디자인, 키보드 네비게이션
                </div>
                <div>
                  <strong>구성:</strong> 5개 슬라이드 (제목, 기능, 시장분석, 가격, 혜택)
                </div>
                <div>
                  <strong>API 키:</strong> .env 파일에 VITE_GEMINI_API_KEY 설정 필요
                </div>
              </div>
            </div>

            {/* 추출된 텍스트 */}
            {extractedText && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">추출된 텍스트</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{extractedText}</p>
                </div>
              </div>
            )}
          </div>

          {/* PPT 표시 영역 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-[300px]">
              {slides.length > 0 ? (
                <PPTDirectRender 
                  slides={slides} 
                  onTextExtracted={handleTextExtracted}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-medium mb-2">PPT가 생성되지 않았습니다</h3>
                    <p className="text-sm">왼쪽 설정에서 PPT를 생성해보세요</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
