// 🚀 통합 콘텐츠 생성 서비스 - contentGeneratorService.ts
// services/contentGeneratorService.ts

import { ContentRequest, GeneratedContent, ContentType } from '../types';
import { generateHybridPPT } from './hybrid/hybridAIService';
import { generateHybridManual } from './hybrid/hybridManualService';

// 콘텐츠 타입 확장
export type ExtendedContentType = ContentType | 'manual' | 'documentation' | 'guide';

interface ExtendedContentRequest extends Omit<ContentRequest, 'type'> {
  type: ExtendedContentType;
  format?: 'ppt' | 'manual' | 'documentation';
  detailLevel?: 'basic' | 'detailed' | 'comprehensive';
}

// 🎯 메인 콘텐츠 생성 함수
export const generateContent = async (
  request: ExtendedContentRequest,
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent> => {
  try {
    console.log('🚀 콘텐츠 생성 시작:', request);
    
    // 타입에 따른 라우팅
    switch (request.type) {
      case 'presentation':
      case 'ppt':
        return await generateHybridPPT(request as ContentRequest, onProgress);
        
      case 'manual':
      case 'documentation':
      case 'guide':
        return await generateHybridManual(request as ContentRequest, onProgress);
        
      default:
        // 기본적으로 PPT 생성
        return await generateHybridPPT(request as ContentRequest, onProgress);
    }
    
  } catch (error) {
    console.error('🚨 콘텐츠 생성 실패:', error);
    throw error;
  }
};

// 🎨 스마트 타입 추천 시스템
export const recommendContentType = (topic: string, industry?: string): ExtendedContentType => {
  const topic_lower = topic.toLowerCase();
  
  // 키워드 기반 타입 추천
  const manualKeywords = [
    '사용법', '설치', '설정', '가이드', '매뉴얼', '설명서', 
    '튜토리얼', '방법', '단계', '절차', '사용방법',
    'how to', 'tutorial', 'guide', 'manual', 'installation'
  ];
  
  const presentationKeywords = [
    '소개', '발표', '제안', '기획', '전략', '분석', '리포트',
    '프레젠테이션', '피치', '제품소개', '서비스소개',
    'presentation', 'pitch', 'proposal', 'strategy'
  ];
  
  // 설명서 타입 키워드 매칭
  if (manualKeywords.some(keyword => topic_lower.includes(keyword))) {
    return 'manual';
  }
  
  // 프레젠테이션 타입 키워드 매칭
  if (presentationKeywords.some(keyword => topic_lower.includes(keyword))) {
    return 'presentation';
  }
  
  // 산업별 기본 추천
  const industryDefaults: Record<string, ExtendedContentType> = {
    'IT/기술': 'manual',
    '화장품/뷰티': 'presentation',
    '식품/음료': 'presentation',
    '패션/의류': 'presentation',
    '자동차': 'manual',
    '건강/의료': 'manual',
    '금융': 'presentation',
    '교육': 'manual',
    '건설/부동산': 'presentation'
  };
  
  return industryDefaults[industry || ''] || 'presentation';
};

// 📊 콘텐츠 미리보기 생성
export const generateContentPreview = (request: ExtendedContentRequest): {
  estimatedTime: number;
  tokenUsage: number;
  sections: string[];
  features: string[];
} => {
  const baseTime = 30; // 기본 30초
  const complexityMultiplier = getComplexityMultiplier(request);
  
  let sections: string[] = [];
  let features: string[] = [];
  let tokenUsage = 0;
  
  if (request.type === 'presentation' || request.type === 'ppt') {
    sections = ['타이틀 슬라이드', '핵심 기능', '시장 분석', '가격 정책', '향후 계획'];
    features = [
      '🎨 프리미엄 디자인 템플릿',
      '📊 자동 차트 생성',
      '🎯 맞춤형 콘텐츠',
      '📱 반응형 디자인',
      '🚀 애니메이션 효과'
    ];
    tokenUsage = 1000 + (request.topic?.length || 0) * 2;
  } else {
    sections = ['개요', '준비사항', '단계별 가이드', '문제해결', '자주 묻는 질문'];
    features = [
      '📚 체계적인 구조',
      '🔍 상세한 설명',
      '⚠️ 주의사항 강조',
      '💡 유용한 팁',
      '🔧 문제해결 가이드'
    ];
    tokenUsage = 1400 + (request.topic?.length || 0) * 3;
  }
  
  return {
    estimatedTime: Math.round(baseTime * complexityMultiplier),
    tokenUsage: Math.round(tokenUsage * complexityMultiplier),
    sections,
    features
  };
};

// 🔧 복잡도 계산
function getComplexityMultiplier(request: ExtendedContentRequest): number {
  let multiplier = 1;
  
  // 상세 수준에 따른 배수
  switch (request.detailLevel) {
    case 'comprehensive': multiplier *= 2; break;
    case 'detailed': multiplier *= 1.5; break;
    case 'basic': multiplier *= 0.8; break;
  }
  
  // 주제 길이에 따른 배수
  const topicLength = request.topic?.length || 0;
  if (topicLength > 50) multiplier *= 1.3;
  else if (topicLength > 30) multiplier *= 1.1;
  
  // 업계 복잡도
  const complexIndustries = ['IT/기술', '건강/의료', '금융'];
  if (complexIndustries.includes(request.industry || '')) {
    multiplier *= 1.2;
  }
  
  return Math.min(multiplier, 3); // 최대 3배까지
}

// 📤 콘텐츠 내보내기
export const exportContent = (
  content: GeneratedContent, 
  format: 'html' | 'json' | 'markdown'
): string => {
  switch (format) {
    case 'html':
      return content.data.content || '';
      
    case 'json':
      return JSON.stringify(content, null, 2);
      
    case 'markdown':
      return convertToMarkdown(content);
      
    default:
      return content.data.content || '';
  }
};

// 📝 Markdown 변환
function convertToMarkdown(content: GeneratedContent): string {
  let markdown = '';
  
  // 제목
  markdown += `# ${content.data.title}\n\n`;
  markdown += `${content.data.subtitle}\n\n`;
  
  // 메타데이터
  markdown += `**생성일:** ${content.createdAt.toLocaleDateString('ko-KR')}\n`;
  markdown += `**타입:** ${content.type}\n`;
  markdown += `**섹션 수:** ${content.sections?.length || 0}개\n\n`;
  
  // 섹션별 내용
  if (content.sections && content.sections.length > 0) {
    content.sections.forEach((section, index) => {
      markdown += `## ${index + 1}. ${section}\n\n`;
      // 실제 내용은 HTML에서 추출해야 함
      markdown += `[섹션 내용]\n\n`;
    });
  }
  
  return markdown;
}

// 🔍 콘텐츠 검색
export const searchContent = (
  contents: GeneratedContent[], 
  query: string
): GeneratedContent[] => {
  const searchTerm = query.toLowerCase();
  
  return contents.filter(content => 
    content.topic.toLowerCase().includes(searchTerm) ||
    content.data.title.toLowerCase().includes(searchTerm) ||
    content.data.subtitle.toLowerCase().includes(searchTerm) ||
    content.sections?.some(section => 
      section.toLowerCase().includes(searchTerm)
    )
  );
};

// 📈 콘텐츠 통계
export const getContentStats = (contents: GeneratedContent[]): {
  total: number;
  byType: Record<string, number>;
  byIndustry: Record<string, number>;
  averageSections: number;
  recentActivity: number;
} => {
  const stats = {
    total: contents.length,
    byType: {} as Record<string, number>,
    byIndustry: {} as Record<string, number>,
    averageSections: 0,
    recentActivity: 0
  };
  
  let totalSections = 0;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  contents.forEach(content => {
    // 타입별 통계
    const type = content.type;
    stats.byType[type] = (stats.byType[type] || 0) + 1;
    
    // 섹션 수 합계
    totalSections += content.sections?.length || 0;
    
    // 최근 활동 (1주일 내)
    if (content.createdAt > oneWeekAgo) {
      stats.recentActivity++;
    }
  });
  
  stats.averageSections = contents.length > 0 ? Math.round(totalSections / contents.length) : 0;
  
  return stats;
};

// 🎯 개인화 추천
export const getPersonalizedRecommendations = (
  userHistory: GeneratedContent[],
  availableIndustries: string[]
): {
  recommendedType: ExtendedContentType;
  recommendedIndustry: string;
  suggestedTopics: string[];
} => {
  // 사용자 선호도 분석
  const typeCounts: Record<string, number> = {};
  const industryCounts: Record<string, number> = {};
  
  userHistory.forEach(content => {
    typeCounts[content.type] = (typeCounts[content.type] || 0) + 1;
    // industry 정보가 있다면 추가
  });
  
  // 가장 많이 사용한 타입 추천
  const recommendedType = Object.keys(typeCounts).reduce((a, b) => 
    typeCounts[a] > typeCounts[b] ? a : b
  ) as ExtendedContentType || 'presentation';
  
  // 랜덤 업계 추천
  const recommendedIndustry = availableIndustries[
    Math.floor(Math.random() * availableIndustries.length)
  ] || '';
  
  // 주제 추천 (사용자 히스토리 기반)
  const suggestedTopics = [
    '스마트폰 사용법',
    '마케팅 전략',
    '프로젝트 관리',
    '고객 서비스 가이드',
    '제품 소개서'
  ];
  
  return {
    recommendedType,
    recommendedIndustry,
    suggestedTopics
  };
};

// 🔄 배치 생성
export const generateBatchContent = async (
  requests: ExtendedContentRequest[],
  onProgress?: (progress: number, message: string) => void
): Promise<GeneratedContent[]> => {
  const results: GeneratedContent[] = [];
  
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    const progress = Math.round((i / requests.length) * 100);
    
    onProgress?.(progress, `${i + 1}/${requests.length} 생성 중: ${request.topic}`);
    
    try {
      const content = await generateContent(request);
      results.push(content);
    } catch (error) {
      console.error(`배치 생성 실패 (${i + 1}번째):`, error);
      // 에러가 있어도 계속 진행
    }
  }
  
  onProgress?.(100, '배치 생성 완료!');
  return results;
};

// 💾 콘텐츠 저장/로드
export const saveContentToStorage = (content: GeneratedContent): void => {
  try {
    const savedContents = JSON.parse(localStorage.getItem('savedContents') || '[]');
    savedContents.push(content);
    localStorage.setItem('savedContents', JSON.stringify(savedContents));
  } catch (error) {
    console.error('콘텐츠 저장 실패:', error);
  }
};

export const loadContentFromStorage = (): GeneratedContent[] => {
  try {
    const savedContents = JSON.parse(localStorage.getItem('savedContents') || '[]');
    return savedContents.map((content: any) => ({
      ...content,
      createdAt: new Date(content.createdAt)
    }));
  } catch (error) {
    console.error('콘텐츠 로드 실패:', error);
    return [];
  }
};

// 🗑️ 콘텐츠 삭제
export const deleteContentFromStorage = (contentId: string): void => {
  try {
    const savedContents = JSON.parse(localStorage.getItem('savedContents') || '[]');
    const filteredContents = savedContents.filter((content: GeneratedContent) => 
      content.id !== contentId
    );
    localStorage.setItem('savedContents', JSON.stringify(filteredContents));
  } catch (error) {
    console.error('콘텐츠 삭제 실패:', error);
  }
};
