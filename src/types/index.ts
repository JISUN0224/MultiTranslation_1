// 기본 콘텐츠 타입
export interface ContentData {
  title: string;
  subtitle?: string;
  sections: string[];
}

export interface TemplateProps {
  data: ContentData;
  currentSection: number;
}

export type ContentType = 'ppt' | 'brochure' | 'manual';

// AI 콘텐츠 생성 관련 타입
export interface ContentRequest {
  type: ContentType;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko-en' | 'ko-ja' | 'ko-zh';
  style?: string;
  length?: 'short' | 'medium' | 'long';
  industry?: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  topic: string;
  createdAt: Date;
  data: any; // PPTData | BrochureData | ManualData
  sections: TranslationSection[];
}

export interface TranslationSection {
  id: string;
  originalText: string;
  translatedText?: string;
  feedback?: FeedbackData;
}

// PPT 관련 타입
export interface PPTSlideData {
  type: 'title' | 'features' | 'market' | 'portfolio' | 'pricing';
  title: string;
  subtitle?: string;
  content: any;
  brandColor: string;
}

export interface PPTFeature {
  icon: string;
  title: string;
  description: string;
}

export interface PPTMarketData {
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'radar';
  chartData: any[];
  title: string;
  subtitle?: string;
}

export interface PPTProduct {
  name: string;
  description: string;
  price: string;
  features: string[];
  image?: string;
}

// 브로슈어 관련 타입
export interface BrochureData {
  brand: {
    name: string;
    slogan: string;
    colors: { primary: string; secondary: string };
  };
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    image?: string;
    features: string[];
  }>;
  specialOffer: {
    title: string;
    description: string;
    discount: string;
    conditions: string[];
  };
}

// 매뉴얼 관련 타입
export interface ManualSection {
  type: 'overview' | 'installation' | 'usage' | 'troubleshooting' | 'maintenance';
  title: string;
  content: Array<{
    type: 'text' | 'steps' | 'warning' | 'info' | 'code';
    data: string | string[] | { title: string; items: string[] };
  }>;
}

// 콘텐츠 세트 타입
export interface ContentSet {
  ppt: PPTSlideData[];
  brochure: BrochureData;
  manual: ManualSection[];
}

// AI 번역 분석 타입
export interface TranslationAnalysis {
  scores: {
    accuracy: number;
    fluency: number;
    appropriateness: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  referenceTranslation: string;
}

// 기존 타입들
export interface FeedbackData {
  score: number;
  corrections: string[];
  suggestions: string[];
  referenceTranslation: string;
}

export interface TranslationState {
  originalText: string;
  translatedText: string;
  feedback?: FeedbackData;
  isLoading?: boolean;
}

export interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
}

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: React.ComponentType<any>;
}
