import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeneratedContent, ContentRequest } from '../types';
import { generateContentWithAI, checkAPIKey } from '../services/aiService';

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
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [isAPIKeyValid] = useState(checkAPIKey());

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

                // AI 콘텐츠 생성 (실제 진행 상황과 연동)
                const content = await generateContentWithAI(request, onProgress);
                setGeneratedContent(content);

              } catch (error) {
                console.error('콘텐츠 생성 중 오류:', error);
                setGenerationMessage('오류가 발생했습니다. 다시 시도해주세요.');
              } finally {
                setIsGenerating(false);
              }
            };

  const clearContent = () => {
    setGeneratedContent(null);
    setGenerationProgress(0);
    setGenerationMessage('');
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
