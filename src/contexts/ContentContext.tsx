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

                // 진행률 시뮬레이션
                const progressPromise = new Promise<void>((resolve) => {
                  const steps = [
                    { progress: 10, message: '주제 분석 중...' },
                    { progress: 25, message: '콘텐츠 구조 설계 중...' },
                    { progress: 40, message: 'AI 모델에 요청 중...' },
                    { progress: 60, message: '콘텐츠 생성 중...' },
                    { progress: 80, message: '번역 섹션 구성 중...' },
                    { progress: 95, message: '최종 검토 중...' },
                    { progress: 100, message: '완료!' }
                  ];

                  let currentStep = 0;
                  const interval = setInterval(() => {
                    if (currentStep < steps.length) {
                      const step = steps[currentStep];
                      setGenerationProgress(step.progress);
                      setGenerationMessage(step.message);
                      currentStep++;
                    } else {
                      clearInterval(interval);
                      resolve();
                    }
                  }, 500 + Math.random() * 1000);
                });

                // AI 콘텐츠 생성
                const contentPromise = generateContentWithAI(request);

                // 두 작업을 병렬로 실행
                await Promise.all([progressPromise, contentPromise]);

                const content = await contentPromise;
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
