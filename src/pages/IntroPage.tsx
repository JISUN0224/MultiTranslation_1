import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Globe } from 'lucide-react';
import { ContentType, ContentRequest } from '../types';
import { useContent } from '../contexts/ContentContext';
import ContentTypeSelector from '../components/intro/ContentTypeSelector';
import TopicInput from '../components/intro/TopicInput';
import GenerationProgress from '../components/intro/GenerationProgress';

const IntroPage: React.FC = () => {
  const navigate = useNavigate();
  const { generateNewContent, isGenerating, generationProgress, generationMessage, isAPIKeyValid } = useContent();
  
  // 폼 상태
  const [selectedType, setSelectedType] = useState<ContentType>('ppt');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [language, setLanguage] = useState<'ko-zh' | 'zh-ko'>('ko-zh');
  const [style, setStyle] = useState('전문적인');
  const [industry, setIndustry] = useState('');

  // 폼 유효성 검사
  const isFormValid = topic.trim().length > 0;

  // 콘텐츠 생성 핸들러
  const handleGenerateContent = async () => {
    if (!isFormValid) return;

    const request: ContentRequest = {
      type: selectedType,
      topic: topic.trim(),
      difficulty,
      language,
      style,
      industry: industry || undefined
    };

                  try {
                await generateNewContent(request);
                // 생성 완료 후 잠시 대기 후 페이지 이동
                setTimeout(() => {
                  navigate('/practice');
                }, 1000);
              } catch (error) {
                console.error('콘텐츠 생성 실패:', error);
              }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 진행률 모달 */}
      <GenerationProgress 
        progress={generationProgress}
        message={generationMessage}
        isGenerating={isGenerating}
      />

      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-primary-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                AI 번역 연습 시스템
              </h1>
            </div>
            <a 
              href="/test" 
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
              🧪 AI PPT 테스트
            </a>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 환영 메시지 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">
              AI로 만드는 번역 연습
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            원하는 주제와 스타일을 선택하면 AI가 자동으로 번역 연습용 콘텐츠를 생성합니다.
            고정된 템플릿에 맞춰 전문적이고 체계적인 내용을 제공합니다.
          </p>
        </div>

        {/* 단계별 폼 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* 단계 표시 */}
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">콘텐츠 생성 설정</h3>
              <div className="flex items-center space-x-2 text-white text-sm">
                <span>단계 1/2</span>
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 폼 내용 */}
          <div className="p-8 space-y-8">
            {/* 1단계: 콘텐츠 타입 선택 */}
            <div>
              <ContentTypeSelector
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
              />
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200"></div>

            {/* 2단계: 주제 및 옵션 입력 */}
            <div>
              <TopicInput
                topic={topic}
                onTopicChange={setTopic}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                language={language}
                onLanguageChange={setLanguage}
                style={style}
                onStyleChange={setStyle}
                industry={industry}
                onIndustryChange={setIndustry}
              />
            </div>
          </div>

                              {/* 하단 액션 버튼 */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {!isAPIKeyValid ? (
                            <span className="text-red-600">⚠️ API 키가 설정되지 않았습니다</span>
                          ) : isFormValid ? (
                            <span className="text-green-600">✓ 모든 설정이 완료되었습니다</span>
                          ) : (
                            <span>주제를 입력해주세요</span>
                          )}
                        </div>
                        <button
                          onClick={handleGenerateContent}
                          disabled={!isFormValid || isGenerating || !isAPIKeyValid}
                          className={`
                            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                            ${isFormValid && !isGenerating && isAPIKeyValid
                              ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {isGenerating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>생성 중...</span>
                            </>
                          ) : (
                            <>
                              <span>콘텐츠 생성하기</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              💡 AI 생성의 장점
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <strong>다양한 주제</strong>
                <p>원하는 분야의 콘텐츠를 자유롭게 생성</p>
              </div>
              <div>
                <strong>일관된 품질</strong>
                <p>전문적이고 체계적인 내용 제공</p>
              </div>
              <div>
                <strong>즉시 사용</strong>
                <p>생성 즉시 번역 연습 시작 가능</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntroPage;
