import React from 'react';
import { Copy, Volume2 } from 'lucide-react';

interface SourceTextProps {
  text: string;
  onCopy?: () => void;
  onSpeak?: () => void;
}

const SourceText: React.FC<SourceTextProps> = ({ text, onCopy, onSpeak }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onCopy?.();
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      speechSynthesis.speak(utterance);
    }
    onSpeak?.();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">원문</h3>
        <div className="flex space-x-1">
          <button
            onClick={handleSpeak}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="음성으로 듣기"
          >
            <Volume2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            title="텍스트 복사"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-gray-800 leading-relaxed text-sm">
          {text}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>글자수: {text.length}자</span>
        <span>단어수: {text.split(/\s+/).length}개</span>
      </div>
    </div>
  );
};

export default SourceText;
