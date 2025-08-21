import React from 'react';
import { RotateCcw, Check } from 'lucide-react';

interface TranslationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const TranslationInput: React.FC<TranslationInputProps> = ({
  value,
  onChange,
  onSubmit,
  onReset,
  isLoading = false,
  placeholder = "여기에 번역을 입력하세요...",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">번역문</h3>
        <div className="flex space-x-2">
          <button
            onClick={onReset}
            disabled={!value || isLoading}
            className="p-1.5 text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors duration-200"
            title="초기화"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm leading-relaxed disabled:bg-gray-50 disabled:text-gray-500"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>글자수: {value.length}자</span>
          <span>단어수: {value.split(/\s+/).filter(word => word.length > 0).length}개</span>
        </div>
        <div className="text-xs text-gray-400">
          Ctrl+Enter로 제출
        </div>
      </div>
      
      <button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200 font-medium"
      >
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            <span>분석 중...</span>
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            <span>번역 제출</span>
          </>
        )}
      </button>
    </div>
  );
};

export default TranslationInput;
