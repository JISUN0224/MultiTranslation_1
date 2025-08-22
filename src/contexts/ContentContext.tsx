import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeneratedContent, ContentRequest } from '../types';
import { generateContentWithAI, checkAPIKey } from '../services/aiService';
import { generateHybridPPT, checkHybridAPIKey } from '../services/hybrid'; // 🚀 하이브리드 추가



interface ContentContextType {
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  generationProgress: number;
  generationMessage: string;
  generateNewContent: (request: ContentRequest) => Promise<void>;
  clearContent: () => void;
  isAPIKeyValid: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  // 🎯 localStorage에서 저장된 콘텐츠 복원 (새로고침 시에도 유지)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(() => {
    const saved = localStorage.getItem('generatedContent');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [isAPIKeyValid] = useState(checkAPIKey());
  const [useSampleData, setUseSampleData] = useState(false);
  
  // 🚀 하이브리드 모드가 기본값 (legacy=true로 기존 방식 사용 가능)
  const useLegacyMode = new URLSearchParams(window.location.search).get('legacy') === 'true';
  const useHybridMode = !useLegacyMode; // 기본값: 하이브리드

  const generateNewContent = async (request: ContentRequest) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationMessage('시작 중...');

      // 진행 상황 콜백 함수
      const onProgress = (progress: number, message: string) => {
        setGenerationProgress(progress);
        setGenerationMessage(message);
      };

      let content;
      
      // 🚀 하이브리드 모드 vs 기존 모드 선택
      if (useHybridMode) {
        console.log('🚀 하이브리드 AI로 콘텐츠 생성 중... (90% 토큰 절약, 3배 빠른 속도)');
        setGenerationMessage('새로운 하이브리드 AI로 생성 중... ⚡');
        
        // 통합 하이브리드 함수 사용 (PPT, 브로슈어, 설명서 모두 지원)
        const { generateHybridContent } = await import('../services/hybrid');
        content = await generateHybridContent(request, onProgress);
      } else {
        console.log('🔄 레거시 모드로 콘텐츠 생성 중...');
        setGenerationMessage('기존 방식으로 생성 중...');
        content = await generateContentWithAI(request, onProgress);
      }
      
      setGeneratedContent(content);
      // localStorage에 콘텐츠 저장 (새로고침 시에도 유지)
      localStorage.setItem('generatedContent', JSON.stringify(content));
      setUseSampleData(false); // 실제 AI 콘텐츠 생성 시 샘플 모드 해제

    } catch (error) {
      console.error('콘텐츠 생성 중 오류:', error);
      const errorMsg = useHybridMode 
        ? '하이브리드 AI 오류가 발생했습니다. 다시 시도해주세요.' 
        : '기존 AI 오류가 발생했습니다. 다시 시도해주세요.';
      setGenerationMessage(errorMsg);
      // API 오류 시 콘텐츠 초기화
      setGeneratedContent(null);
      setUseSampleData(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearContent = () => {
    setGeneratedContent(null);
    // localStorage에서도 콘텐츠 제거
    localStorage.removeItem('generatedContent');
    setGenerationProgress(0);
    setGenerationMessage('');
    setUseSampleData(false);
  };



  const value: ContentContextType = {
    generatedContent,
    isGenerating,
    generationProgress,
    generationMessage,
    generateNewContent,
    clearContent,
    isAPIKeyValid,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
