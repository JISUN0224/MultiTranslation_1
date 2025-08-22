import React from 'react';
import { Lightbulb, Settings } from 'lucide-react';

interface TopicInputProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onDifficultyChange: (difficulty: 'beginner' | 'intermediate' | 'advanced') => void;
  language: 'ko-zh' | 'zh-ko';
  onLanguageChange: (language: 'ko-zh' | 'zh-ko') => void;
}

const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  onTopicChange,
  difficulty,
  onDifficultyChange,
  language,
  onLanguageChange
}) => {
  const difficulties = [
    { value: 'beginner', label: '초급', description: '기본적인 표현과 문장' },
    { value: 'intermediate', label: '중급', description: '비즈니스 수준의 표현' },
    { value: 'advanced', label: '고급', description: '전문적이고 복잡한 표현' }
  ];

  const languages = [
    { value: 'ko-zh', label: 'KR 한국어', flag: '🇰🇷' },
    { value: 'zh-ko', label: 'CN 중국어', flag: '🇨🇳' }
  ];



  return (
    <div className="space-y-8">
      {/* 주제 입력 */}
      <div className="space-y-4" data-testid="topic-input-field">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">주제 입력</h3>
        </div>
        
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            콘텐츠 주제
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="예: 스마트폰, 갤럭시 워치, 스마트 TV, 넷플릭스 등 설명서 또는 PPT에 어울리는 주제"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            설명서 또는 PPT에 어울리는 주제를 입력해주세요
          </p>
        </div>
      </div>

      {/* 옵션 설정 */}
      <div className="space-y-6" data-testid="options-section">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">옵션 설정</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 난이도 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              난이도
            </label>
            <div className="space-y-2">
              {difficulties.map((diff) => (
                <label key={diff.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={diff.value}
                    checked={difficulty === diff.value}
                    onChange={(e) => onDifficultyChange(e.target.value as any)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{diff.label}</div>
                    <div className="text-xs text-gray-500">{diff.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 언어 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              생성 언어
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <label key={lang.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="language"
                    value={lang.value}
                    checked={language === lang.value}
                    onChange={(e) => onLanguageChange(e.target.value as any)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm text-gray-900">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;
