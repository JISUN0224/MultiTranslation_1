// 기본 콘텐츠 타입
export interface ContentData {
  title: string;
  subtitle?: string;
  sections: string[];
  slides?: Array<{
    id: number;
    title: string;
    html: string;
  }>;
  styles?: string;
}

export interface TemplateProps {
  data: ContentData;
  currentSection: number;
}

export type ContentType = 'ppt' | 'manual';

// AI 콘텐츠 생성 관련 타입
export interface ContentRequest {
  type: ContentType;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko-zh' | 'zh-ko';
  style?: string;
  length?: 'short' | 'medium' | 'long';
  industry?: string;
}

export interface GeneratedContent {
  id: string;
  type: ContentType;
  topic: string;
  createdAt: Date;
  data: any; // PPTData
  sections: TranslationSection[];
  html?: string; // Manual HTML 콘텐츠용
}

export interface TranslationSection {
  id: string;
  originalText: string;
  translatedText?: string;
  feedback?: FeedbackData;
  html?: string; // AI HTML 생성 방식용
  title?: string; // AI HTML 생성 방식용
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

export interface PPTSlide {
  id: number;
  title: string;
  subtitle?: string;
  html: string;
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
  onSectionChange?: (index: number) => void;
}

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: React.ComponentType<any>;
}

export interface PPTData {
  slides: PPTSlide[];
  templateType: string;
  theme: string;
}

export interface ContentTemplates {
  ppt: PPTData;
}
