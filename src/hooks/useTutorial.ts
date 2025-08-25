import { useState, useEffect } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  padding?: number;
}

export interface TutorialConfig {
  key: string;
  steps: TutorialStep[];
  autoStart?: boolean;
  autoStartDelay?: number;
}

export const useTutorial = (config: TutorialConfig) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 튜토리얼 완료 여부 확인
  const isCompleted = () => {
    return localStorage.getItem(`tutorial_${config.key}_completed`) === 'true';
  };

  // 튜토리얼 시작
  const startTutorial = () => {
    setIsVisible(true);
    setCurrentStep(0);
  };

  // 튜토리얼 종료
  const closeTutorial = (opts?: { dontShowAgain?: boolean }) => {
    setIsVisible(false);
    setCurrentStep(0);
    
    if (opts?.dontShowAgain) {
      localStorage.setItem(`tutorial_${config.key}_completed`, 'true');
    }
  };

  // 다음 단계로 이동
  const nextStep = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      closeTutorial();
    }
  };

  // 이전 단계로 이동
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 튜토리얼 리셋 (테스트용)
  const resetTutorial = () => {
    localStorage.removeItem(`tutorial_${config.key}_completed`);
  };

  // 자동 시작 설정
  useEffect(() => {
    if (config.autoStart && !isCompleted()) {
      const delay = config.autoStartDelay || 2000;
      const timer = setTimeout(() => {
        startTutorial();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [config.autoStart, config.autoStartDelay]);

  return {
    isVisible,
    currentStep,
    currentStepData: config.steps[currentStep],
    totalSteps: config.steps.length,
    isCompleted: isCompleted(),
    startTutorial,
    closeTutorial,
    nextStep,
    prevStep,
    resetTutorial,
    steps: config.steps
  };
};
