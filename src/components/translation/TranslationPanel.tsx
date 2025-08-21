import React, { useState } from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import { ContentType, TranslationAnalysis } from '../../types';
import { analyzeTranslation } from '../../services/aiService';
import SourceText from './SourceText';
import TranslationInput from './TranslationInput';
import FeedbackSection from './FeedbackSection';

interface TranslationPanelProps {
  sourceText: string;
  contentType?: ContentType;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({ sourceText, contentType = 'ppt' }) => {
  const [translationText, setTranslationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<TranslationAnalysis | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async () => {
    if (!translationText.trim()) return;

    setIsLoading(true);
    
    try {
      // 실제 AI 번역 분석
      const analysis = await analyzeTranslation(sourceText, translationText, contentType);
      setFeedback(analysis);
      setShowFeedback(true);
    } catch (error) {
      console.error('AI 분석 실패:', error);
      // 에러 시 기본 피드백 제공
      const fallbackFeedback: TranslationAnalysis = {
        scores: { accuracy: 75, fluency: 70, appropriateness: 80 },
        feedback: {
          strengths: ['번역이 전반적으로 이해 가능합니다'],
          improvements: ['더 자연스러운 번역 표현이 필요합니다'],
          suggestions: ['더 구체적이고 명확한 표현을 사용해보세요']
        },
        referenceTranslation: '전문가 수준의 참고 번역을 제공할 수 없습니다.'
      };
      setFeedback(fallbackFeedback);
      setShowFeedback(true);
    } finally {
      setIsLoading(false);
    }
  };



  const handleReset = () => {
    setTranslationText('');
    setFeedback(null);
    setShowFeedback(false);
    setShowReference(false);
  };

  const handleCopy = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleAIAnalysis = () => {
    if (translationText.trim()) {
      handleSubmit();
    } else {
      alert('번역을 입력한 후 AI 분석을 실행해주세요.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">번역 연습</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleAIAnalysis}
              className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 text-sm"
            >
              <Brain className="h-4 w-4" />
              <span>AI 분석</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar space-y-6">
        {/* 원문 표시 */}
        <SourceText
          text={sourceText}
          onCopy={handleCopy}
        />

        {/* 번역 입력 */}
        <TranslationInput
          value={translationText}
          onChange={setTranslationText}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isLoading={isLoading}
        />

        {/* 피드백 섹션 */}
        <FeedbackSection
          feedback={feedback || undefined}
          isVisible={showFeedback}
          onShowReference={() => setShowReference(!showReference)}
          showReference={showReference}
        />
      </div>

      {/* 복사 성공 알림 */}
      {copySuccess && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm animate-in slide-in-from-top-2 duration-200">
          텍스트가 복사되었습니다!
        </div>
      )}
    </div>
  );
};

export default TranslationPanel;
