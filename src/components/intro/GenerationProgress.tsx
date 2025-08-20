import React from 'react';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';

interface GenerationProgressProps {
  progress: number;
  message: string;
  isGenerating: boolean;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  message,
  isGenerating
}) => {
  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center space-y-6">
          {/* 아이콘 */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              {progress < 100 ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <CheckCircle className="w-8 h-8 text-white" />
              )}
            </div>
            {progress < 100 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* 제목 */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {progress < 100 ? 'AI가 콘텐츠를 생성하고 있습니다' : '생성 완료!'}
            </h3>
            <p className="text-gray-600">
              {progress < 100 ? '잠시만 기다려주세요...' : '번역 연습을 시작할 수 있습니다'}
            </p>
          </div>

          {/* 진행률 바 */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">진행률</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 메시지 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 font-medium">
              {message}
            </p>
          </div>

          {/* 애니메이션 효과 */}
          {progress < 100 && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
