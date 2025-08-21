import { useState, useCallback, useEffect } from 'react';
import { ContentType, TranslationState } from '../types';
import { getTemplateData } from '../data/templates';

export const useTranslation = (initialContentType: ContentType = 'ppt') => {
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [currentSection, setCurrentSection] = useState(0);
  const [translationState, setTranslationState] = useState<TranslationState>({
    originalText: '',
    translatedText: '',
    feedback: undefined,
    isLoading: false,
  });

  // 현재 콘텐츠 데이터 가져오기
  const currentData = getTemplateData(contentType);
  const totalSections = currentData.sections.length;

  // 현재 섹션의 원문 텍스트 업데이트
  useEffect(() => {
    const currentText = currentData.sections[currentSection] || '';
    setTranslationState(prev => ({
      ...prev,
      originalText: currentText,
      translatedText: '',
      feedback: undefined,
    }));
  }, [contentType, currentSection, currentData.sections]);

  // 콘텐츠 타입 변경
  const handleContentTypeChange = useCallback((newType: ContentType) => {
    setContentType(newType);
    setCurrentSection(0); // 섹션 초기화
  }, []);

  // 섹션 네비게이션
  const goToPreviousSection = useCallback(() => {
    setCurrentSection(prev => Math.max(0, prev - 1));
  }, []);

  const goToNextSection = useCallback(() => {
    setCurrentSection(prev => Math.min(totalSections - 1, prev + 1));
  }, [totalSections]);

  const goToSection = useCallback((sectionIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(totalSections - 1, sectionIndex));
    setCurrentSection(clampedIndex);
  }, [totalSections]);

  // 번역 텍스트 업데이트
  const updateTranslation = useCallback((text: string) => {
    setTranslationState(prev => ({
      ...prev,
      translatedText: text,
    }));
  }, []);

  // 번역 제출 및 피드백 받기
  const submitTranslation = useCallback(async (translatedText: string) => {
    if (!translatedText.trim()) return;

    setTranslationState(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      // 시뮬레이션된 AI 분석 (실제로는 AI API 호출)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockFeedback = generateMockFeedback(translatedText);
      
      setTranslationState(prev => ({
        ...prev,
        feedback: mockFeedback,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Translation submission failed:', error);
      setTranslationState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  // 번역 상태 초기화
  const resetTranslation = useCallback(() => {
    setTranslationState(prev => ({
      ...prev,
      translatedText: '',
      feedback: undefined,
    }));
  }, []);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) {
        return; // 입력 필드에서는 단축키 비활성화
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (currentSection > 0) {
            goToPreviousSection();
          }
          break;
        case 'ArrowRight':
          if (currentSection < totalSections - 1) {
            goToNextSection();
          }
          break;
        case 'Escape':
          resetTranslation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, totalSections, goToPreviousSection, goToNextSection, resetTranslation]);

  return {
    // 상태
    contentType,
    currentSection,
    totalSections,
    currentData,
    translationState,
    
    // 액션
    handleContentTypeChange,
    goToPreviousSection,
    goToNextSection,
    goToSection,
    updateTranslation,
    submitTranslation,
    resetTranslation,
    
    // 계산된 값
    canGoPrevious: currentSection > 0,
    canGoNext: currentSection < totalSections - 1,
    progress: ((currentSection + 1) / totalSections) * 100,
  };
};

// 모의 피드백 생성 함수
const generateMockFeedback = (translatedText: string) => {
  const wordCount = translatedText.split(/\s+/).filter(word => word.length > 0).length;
  const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100 사이
  
  const corrections = [];
  const suggestions = [];
  
  // 길이에 따른 피드백
  if (wordCount < 10) {
    corrections.push("번역이 너무 짧습니다. 원문의 의미를 더 완전히 전달해보세요.");
  }
  
  // 대소문자 검사
  if (!/^[A-Z]/.test(translatedText.trim())) {
    corrections.push("문장의 첫 글자는 대문자로 시작해야 합니다.");
  }
  
  // 마침표 검사
  if (!/[.!?]$/.test(translatedText.trim())) {
    corrections.push("문장의 끝에 적절한 문장부호를 사용해주세요.");
  }
  
  // 일반적인 제안
  suggestions.push("더 자연스러운 번역 표현을 사용해보세요.");
  suggestions.push("문맥에 맞는 전문 용어를 확인해보세요.");
  
  return {
    score: baseScore,
    corrections,
    suggestions,
    referenceTranslation: generateReferenceTranslation(translatedText),
  };
};

// 참고 번역 생성 함수
const generateReferenceTranslation = (_translatedText: string): string => {
  // 실제로는 AI API를 사용하여 참고 번역을 생성
  return "This is a reference translation that would be generated by AI based on the original text.";
};
