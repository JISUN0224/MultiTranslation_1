import { TutorialStep } from '../hooks/useTutorial';

// 인트로 페이지 튜토리얼
export const introPageTutorial: TutorialStep[] = [
  {
    id: 'content-type',
    title: '📝 콘텐츠 타입 선택',
    description: 'PPT 또는 설명서 중 원하는 콘텐츠 타입을 선택하세요. 각각 다른 스타일의 번역 연습을 제공합니다.',
    targetSelector: '[data-testid="content-type-section"]',
    padding: 15
  },
  {
    id: 'topic-input',
    title: '💡 주제 입력',
    description: '번역 연습하고 싶은 주제를 입력하세요. 예: 스마트폰, 갤럭시 워치, 넷플릭스 등',
    targetSelector: '[data-testid="topic-input-field"]',
    padding: 15
  },
  {
    id: 'options',
    title: '⚙️ 옵션 설정',
    description: '난이도와 생성 언어를 선택하세요. 한국어→중국어 또는 중국어→한국어 번역 연습이 가능합니다.',
    targetSelector: '[data-testid="options-section"]',
    padding: 15
  },
  {
    id: 'generate',
    title: '🚀 콘텐츠 생성',
    description: '모든 설정이 완료되면 "콘텐츠 생성하기" 버튼을 클릭하세요. AI가 자동으로 번역 연습용 콘텐츠를 만들어줍니다.',
    targetSelector: '[data-testid="generate-button"]',
    padding: 10
  }
];

// 연습 페이지 튜토리얼
export const practicePageTutorial: TutorialStep[] = [
  {
    id: 'welcome-practice',
    title: '📚 번역 연습 페이지',
    description: '생성된 콘텐츠를 기반으로 번역 연습을 진행합니다. 각 섹션별로 단계적 학습이 가능합니다.',
    targetSelector: 'body',
    padding: 20
  },
  {
    id: 'navigation',
    title: '🧭 네비게이션',
    description: '좌우 화살표나 섹션 번호를 클릭하여 다른 페이지로 이동할 수 있습니다.',
    targetSelector: '[data-testid="navigation-section"]',
    padding: 15
  },
  {
    id: 'content-display',
    title: '📖 콘텐츠 표시',
    description: 'AI가 생성한 콘텐츠가 여기에 표시됩니다. 원문을 읽고 번역해보세요.',
    targetSelector: '[data-testid="content-display"]',
    padding: 15
  },
  {
    id: 'translation-panel',
    title: '✍️ 번역 패널',
    description: '원문을 참고하여 번역을 입력하세요. 실시간으로 번역 품질을 평가받을 수 있습니다.',
    targetSelector: '[data-testid="translation-panel"]',
    padding: 15
  },
  {
    id: 'feedback',
    title: '📊 피드백',
    description: '번역 완료 후 AI가 번역 품질을 평가하고 개선점을 제안해줍니다.',
    targetSelector: '[data-testid="feedback-section"]',
    padding: 15
  }
];

// PPT 전용 튜토리얼
export const pptTutorial: TutorialStep[] = [
  {
    id: 'ppt-intro',
    title: '📊 PPT 프레젠테이션',
    description: 'PPT 형태의 콘텐츠로 번역 연습을 진행합니다. 슬라이드별로 구성되어 있습니다.',
    targetSelector: '[data-testid="ppt-container"]',
    padding: 15
  },
  {
    id: 'slide-navigation',
    title: '🔄 슬라이드 네비게이션',
    description: '슬라이드 번호를 클릭하거나 화살표를 사용하여 슬라이드를 전환할 수 있습니다.',
    targetSelector: '[data-testid="slide-navigation"]',
    padding: 10
  },
  {
    id: 'slide-content',
    title: '📋 슬라이드 내용',
    description: '각 슬라이드의 내용을 읽고 번역해보세요. 시각적 요소도 함께 고려하세요.',
    targetSelector: '[data-testid="slide-content"]',
    padding: 15
  }
];

// 매뉴얼 전용 튜토리얼
export const manualTutorial: TutorialStep[] = [
  {
    id: 'manual-intro',
    title: '📖 매뉴얼 문서',
    description: '매뉴얼 형태의 콘텐츠로 번역 연습을 진행합니다. 단계별 설명서 형태입니다.',
    targetSelector: '[data-testid="manual-container"]',
    padding: 15
  },
  {
    id: 'manual-sections',
    title: '📑 매뉴얼 섹션',
    description: '목차, 기본 사용법, 주의사항, 문제해결, FAQ 등으로 구성되어 있습니다.',
    targetSelector: '[data-testid="manual-sections"]',
    padding: 15
  },
  {
    id: 'manual-content',
    title: '📝 매뉴얼 내용',
    description: '각 섹션의 내용을 읽고 번역해보세요. 실용적인 문서 번역 연습이 가능합니다.',
    targetSelector: '[data-testid="manual-content"]',
    padding: 15
  }
];

// 튜토리얼 설정 객체
export const tutorialConfigs = {
  intro: {
    key: 'intro-page',
    steps: introPageTutorial,
    autoStart: true,
    autoStartDelay: 2000
  },
  practice: {
    key: 'practice-page',
    steps: practicePageTutorial,
    autoStart: false
  },
  ppt: {
    key: 'ppt-content',
    steps: pptTutorial,
    autoStart: false
  },
  manual: {
    key: 'manual-content',
    steps: manualTutorial,
    autoStart: false
  }
};
