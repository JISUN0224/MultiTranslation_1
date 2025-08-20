import React from 'react';
import { CheckCircle, XCircle, Lightbulb, Eye, Star } from 'lucide-react';
import { TranslationAnalysis } from '../../types';

interface FeedbackSectionProps {
  feedback?: TranslationAnalysis;
  isVisible: boolean;
  onShowReference: () => void;
  showReference: boolean;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedback,
  isVisible,
  onShowReference,
  showReference,
}) => {
  if (!isVisible || !feedback) {
    return null;
  }



  return (
    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
      {/* 점수 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">정확성</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{feedback.scores.accuracy}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">자연스러움</span>
          </div>
          <p className="text-lg font-bold text-green-600">{feedback.scores.fluency}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">적합성</span>
          </div>
          <p className="text-lg font-bold text-purple-600">{feedback.scores.appropriateness}</p>
        </div>
      </div>

      {/* 장점 */}
      {feedback.feedback.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-green-800 mb-2">번역의 장점</h4>
              <ul className="space-y-1">
                {feedback.feedback.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-green-700">
                    • {strength}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 개선점 */}
      {feedback.feedback.improvements.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">개선이 필요한 부분</h4>
              <ul className="space-y-1">
                {feedback.feedback.improvements.map((improvement, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 개선 제안 */}
      {feedback.feedback.suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 mb-2">개선 제안</h4>
              <ul className="space-y-1">
                {feedback.feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 참고 번역 */}
      <div className="space-y-2">
        <button
          onClick={onShowReference}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          <span>{showReference ? '참고 번역 숨기기' : '참고 번역 보기'}</span>
        </button>
        
        {showReference && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-1 duration-200">
            <h4 className="font-medium text-green-800 mb-2">참고 번역</h4>
            <p className="text-sm text-green-700 leading-relaxed">
              {feedback.referenceTranslation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;
