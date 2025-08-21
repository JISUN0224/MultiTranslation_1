// utils/contentParser.ts - AI 텍스트 우선 사용 버전

export interface ParsedPPTContent {
  title: string;
  subtitle: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  chartData: Array<{
    value: number;
    label: string;
  }>;
  price?: string;
  ctaText: string;
  ctaSubtext: string;
}

// 텍스트 길이에 따른 동적 크기 조정
export function getTextDisplayConfig(text: string) {
  const length = text.length;
  
  if (length <= 20) {
    return { fontSize: 'text-xl', maxLines: 1, truncate: false };
  } else if (length <= 40) {
    return { fontSize: 'text-lg', maxLines: 2, truncate: false };
  } else if (length <= 80) {
    return { fontSize: 'text-base', maxLines: 3, truncate: true };
  } else {
    return { fontSize: 'text-sm', maxLines: 4, truncate: true };
  }
}

// 스마트 텍스트 분할 함수
export function smartTextSplit(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  
  // 자연스러운 끊기 지점 찾기 (문장 단위로)
  const breakPoints = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
  
  for (const breakPoint of breakPoints) {
    const index = text.lastIndexOf(breakPoint, maxLength);
    if (index > maxLength * 0.6) {
      return text.substring(0, index + breakPoint.length - 1);
    }
  }
  
  // 쉼표나 다른 구분자로 자르기
  const softBreakPoints = [', ', ': ', '; ', ' - ', ' / '];
  for (const breakPoint of softBreakPoints) {
    const index = text.lastIndexOf(breakPoint, maxLength);
    if (index > maxLength * 0.5) {
      return text.substring(0, index + breakPoint.length - 1) + '...';
    }
  }
  
  // 공백으로 자르기
  const spaceIndex = text.lastIndexOf(' ', maxLength);
  if (spaceIndex > maxLength * 0.5) {
    return text.substring(0, spaceIndex) + '...';
  }
  
  // 강제로 자르기
  return text.substring(0, maxLength - 3) + '...';
}

// 키워드 기반 구조 분석
function analyzeContentStructure(text: string) {
  const lines = text.split('\n').filter(line => line.trim());
  
  return {
    title: extractTitle(lines),
    subtitle: extractSubtitle(lines),
    features: extractFeatures(lines),
    chartData: extractChartData(lines),
    pricing: extractPricing(lines),
    benefits: extractBenefits(lines)
  };
}

// AI 텍스트에서 실제 주제 추출 - PPT용 간결한 제목
function extractTitle(lines: string[]): string {
  const fullText = lines.join(' ');
  
  // 첫 번째 문장에서 주요 키워드 추출
  const firstSentence = fullText.split(/[.!?]/)[0]?.trim() || '';
  
  // 주요 키워드들 추출 (고유명사, 제품명 등)
  const keywords = extractMainKeywords(firstSentence);
  
  // PPT용 간결한 제목 생성
  if (keywords.length > 0) {
    // 첫 번째 키워드만 사용하거나 조합하여 간결하게
    const mainKeyword = keywords[0];
    
    // 제품명이 있으면 제품명만 사용
    if (mainKeyword.includes('크림') || mainKeyword.includes('게임') || mainKeyword.includes('앱')) {
      return mainKeyword;
    }
    
    // 두 키워드 조합이 25자 이내면 사용
    if (keywords.length > 1) {
      const combined = keywords.slice(0, 2).join(' ');
      if (combined.length <= 25) {
        return combined;
      }
    }
    
    return mainKeyword;
  }
  
  // 첫 번째 문장에서 핵심 명사 추출
  const nounMatch = firstSentence.match(/([가-힣A-Za-z]{2,15}(?:크림|게임|앱|시스템|서비스|솔루션))/g);
  if (nounMatch && nounMatch[0]) {
    return nounMatch[0];
  }
  
  // 첫 번째 줄을 15자 이내로 자르기 (PPT 제목 최적화)
  const firstLine = lines[0]?.trim() || '';
  if (firstLine.length > 5) {
    // 자연스러운 끊기 지점 찾기
    const words = firstLine.split(' ');
    let title = '';
    
    for (const word of words) {
      if ((title + ' ' + word).length <= 15) {
        title += (title ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    return title || firstLine.substring(0, 15);
  }
  
  return '새로운 솔루션';
}

// 주요 키워드 추출 함수 - PPT용 간결한 키워드 우선
function extractMainKeywords(text: string): string[] {
  const keywords: string[] = [];
  
  // 제품명/브랜드명 패턴 (우선순위 높음)
  const productPatterns = [
    /([가-힣A-Za-z\s]{2,15}(?:크림|로션|세럼|오일))/g,
    /([가-힣A-Za-z\s]{2,15}(?:게임|앱|소프트웨어))/g,
    /([가-힣A-Za-z\s]{2,15}(?:시스템|플랫폼|서비스))/g,
    /([가-힣A-Za-z\s]{2,15}(?:솔루션|기술|방법))/g
  ];
  
  productPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    keywords.push(...matches.map(match => match.trim()));
  });
  
  // 고유명사 패턴 (대문자로 시작하는 단어들)
  const properNouns = text.match(/[A-Z][a-zA-Z가-힣]+/g) || [];
  keywords.push(...properNouns);
  
  // 핵심 키워드 패턴
  const corePatterns = [
    /(K팝|케이팝)/g,
    /(AI|인공지능)/g,
    /(VR|AR)/g,
    /모바일/g,
    /스마트/g,
    /리듬/g,
    /데몬헌터스/g,
    /미백/g,
    /글로우/g,
    /라이트닝/g
  ];
  
  corePatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    keywords.push(...matches);
  });
  
  // 중복 제거, 길이 필터링, PPT용 간결함 우선
  const uniqueKeywords = [...new Set(keywords)]
    .filter(keyword => keyword.length >= 2 && keyword.length <= 15)
    .sort((a, b) => {
      // 제품명/브랜드명 우선
      const aIsProduct = /(?:크림|게임|앱|시스템|서비스)/.test(a);
      const bIsProduct = /(?:크림|게임|앱|시스템|서비스)/.test(b);
      
      if (aIsProduct && !bIsProduct) return -1;
      if (!aIsProduct && bIsProduct) return 1;
      
      // 길이가 짧을수록 우선 (PPT용)
      return a.length - b.length;
    });
  
  return uniqueKeywords;
}

// AI 텍스트에서 부제목 추출
function extractSubtitle(lines: string[]): string {
  const title = extractTitle(lines);
  const fullText = lines.join(' ');
  
  // AI 텍스트의 첫 번째 문장을 부제목으로 사용
  const sentences = fullText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
  
  for (const sentence of sentences) {
    if (sentence !== title && sentence.length >= 15 && sentence.length <= 80) {
      return sentence;
    }
  }
  
  // 대체: 두 번째 줄을 부제목으로 시도
  if (lines.length > 1) {
    const secondLine = lines[1]?.trim();
    if (secondLine && secondLine.length >= 10 && secondLine.length <= 80) {
      return secondLine;
    }
  }
  
  // 대체: 첫 번째 줄에서 일부 추출
  const firstLine = lines[0]?.trim() || '';
  if (firstLine.length > 30) {
    const words = firstLine.split(' ');
    let subtitle = '';
    for (const word of words) {
      if ((subtitle + ' ' + word).length <= 50) {
        subtitle += (subtitle ? ' ' : '') + word;
      } else {
        break;
      }
    }
    if (subtitle.length >= 10) {
      return subtitle + '...';
    }
  }
  
  return '혁신적인 솔루션의 새로운 시작';
}

// AI 텍스트에서 특징 추출 - 하드코딩 제거
function extractFeatures(lines: string[]): Array<{icon: string, title: string, description: string}> {
  const features: Array<{icon: string, title: string, description: string}> = [];
  const fullText = lines.join(' ');
  
  // AI 텍스트에서 실제 특징들을 추출
  const keywords = extractMainKeywords(fullText);
  
  // 키워드에서 특징 생성 (첫 번째 방법)
  keywords.forEach((keyword, index) => {
    if (features.length < 4) {
      features.push({
        icon: selectSmartIcon(keyword),
        title: keyword,
        description: `${keyword}을 통한 차별화된 경험을 제공합니다`
      });
    }
  });
  
  // 문장에서 핵심 내용 추출 (두 번째 방법)
  const sentences = fullText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 10);
  
  for (const sentence of sentences) {
    if (features.length >= 4) break;
    
    // 특징을 나타내는 키워드가 포함된 문장 찾기
    const featureKeywords = ['기능', '특징', '장점', '혜택', '협업', '콘텐츠', '기술', '서비스', '시스템', '지원'];
    
    if (featureKeywords.some(keyword => sentence.includes(keyword))) {
      // 문장에서 핵심 부분 추출
      const mainPart = extractMainPartFromSentence(sentence);
      if (mainPart && mainPart.length >= 5 && mainPart.length <= 30) {
        features.push({
          icon: selectSmartIcon(mainPart),
          title: mainPart,
          description: sentence.length <= 80 ? sentence : sentence.substring(0, 80) + '...'
        });
      }
    }
  }
  
  // 여전히 부족한 경우에만 AI 텍스트 기반 동적 생성
  while (features.length < 4) {
    const remainingKeywords = ['리듬게임', '모바일', 'K팝', 'AR기술', '실시간', '협업', '콘텐츠', '차별화'];
    const keyword = remainingKeywords[features.length] || '핵심 기능';
    
    features.push({
      icon: selectSmartIcon(keyword),
      title: keyword,
      description: `${keyword} 관련 혁신적인 기능을 제공합니다`
    });
  }
  
  return features.slice(0, 4);
}

// 문장에서 핵심 부분 추출하는 함수
function extractMainPartFromSentence(sentence: string): string {
  // 주어 + 핵심 동사/명사 추출
  const patterns = [
    /([\uac00-\ud7a3A-Za-z]+)\s*은\/는\s*([^,\.]{5,20})/,
    /([\uac00-\ud7a3A-Za-z]+)\s*를\/을\s*([^,\.]{5,20})/,
    /([\uac00-\ud7a3A-Za-z]{3,15})\s*(기능|특징|시스템|콘텐츠|서비스)/,
    /(실시간|실제|차별화된|혁신적인)\s*([\uac00-\ud7a3A-Za-z]{3,15})/
  ];
  
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      return match[1] + ' ' + match[2];
    }
  }
  
  // 패턴이 맞지 않으면 문장의 첫 부분 반환
  const words = sentence.split(' ').slice(0, 4);
  return words.join(' ');
}

function extractChartData(lines: string[]): Array<{value: number, label: string}> {
  const chartData: Array<{value: number, label: string}> = [];
  
  lines.forEach(line => {
    // 퍼센트 패턴 찾기
    const percentMatch = line.match(/(\d+)%/g);
    if (percentMatch) {
      percentMatch.forEach(match => {
        const value = parseInt(match.replace('%', ''));
        const label = line.replace(/\d+%/g, '').trim() || '성과 지표';
        if (value > 0 && value <= 100) {
          chartData.push({ value, label: smartTextSplit(label, 15) });
        }
      });
    }
    
    // 숫자 + 배수 패턴 (예: 3배 증가)
    const multipleMatch = line.match(/(\d+)배/);
    if (multipleMatch) {
      const value = Math.min(parseInt(multipleMatch[1]) * 20, 100); // 배수를 퍼센트로 변환, 100 제한
      const label = line.replace(/\d+배/, '').trim() || '성장률';
      chartData.push({ value, label: smartTextSplit(label, 15) });
    }
  });
  
  // AI 텍스트에서 충분한 데이터를 추출했다면 기본값 사용하지 않음
  if (chartData.length >= 3) {
    return chartData.slice(0, 3);
  }
  
  // 부족한 경우에만 랜덤 데이터로 보완
  while (chartData.length < 3) {
    const randomValue = Math.floor(Math.random() * 40) + 60; // 60-100 사이
    const labels = ['만족도', '성능', '품질', '효율성', '신뢰도', '편의성'];
    const unusedLabel = labels.find(label => 
      !chartData.some(data => data.label.includes(label))
    ) || `지표 ${chartData.length + 1}`;
    
    chartData.push({ 
      value: randomValue, 
      label: unusedLabel 
    });
  }
  
  return chartData.slice(0, 3);
}

function extractPricing(lines: string[]): string | undefined {
  const pricePattern = /₩[\d,]+|[₩]?\s*\d{1,3}(,\d{3})*\s*원|\$\d+/;
  return lines.find(line => pricePattern.test(line));
}

function extractBenefits(lines: string[]): string[] {
  return lines.filter(line => 
    /할인|혜택|무료|이벤트|특가|증정|서비스/.test(line)
  ).slice(0, 3);
}

// 스마트 아이콘 선택 - 주제 반영
function selectSmartIcon(text: string): string {
  const combinedText = text.toLowerCase();
  
  const iconMappings = [
    { keywords: ['ai', '인공지능', 'artificial', 'intelligence', '스마트', '자동'], icons: ['🤖', '🧠', '⚡', '🔮'] },
    { keywords: ['카메라', '사진', '촬영', '렌즈', 'camera', 'photo'], icons: ['📷', '📸', '🎥', '📹'] },
    { keywords: ['배터리', '전력', '충전', '에너지', 'battery', 'power'], icons: ['🔋', '⚡', '🔌', '⭐'] },
    { keywords: ['보안', '안전', '보호', '방어', 'security', 'safe'], icons: ['🛡️', '🔒', '🔐', '🚨'] },
    { keywords: ['속도', '빠른', '고속', '즉시', 'fast', 'speed'], icons: ['⚡', '🚀', '💨', '⭐'] },
    { keywords: ['품질', '프리미엄', '고급', '최고', 'premium', 'quality'], icons: ['💎', '👑', '🏆', '⭐'] },
    { keywords: ['연결', '네트워크', '통신', '인터넷', 'network', 'connect'], icons: ['🌐', '📡', '🔗', '📶'] },
    { keywords: ['저장', '메모리', '용량', '공간', 'storage', 'memory'], icons: ['💾', '🗄️', '📦', '💿'] },
    { keywords: ['화면', '디스플레이', '스크린', 'display', 'screen'], icons: ['📱', '💻', '🖥️', '📺'] },
    { keywords: ['소리', '음향', '오디오', '스피커', 'audio', 'sound'], icons: ['🔊', '🎵', '🎧', '🔈'] },
    { keywords: ['앱', '소프트웨어', '프로그램', 'app', 'software'], icons: ['📱', '💻', '⚙️', '🔧'] },
    { keywords: ['화장품', '뷰티', '미용', 'cosmetic', 'beauty'], icons: ['✨', '💄', '🌸', '💅'] },
    { keywords: ['건강', '의료', '헬스', 'health', 'medical'], icons: ['🏥', '💊', '🩺', '❤️'] },
    { keywords: ['게임', '리듬', 'k팝', '케이팝', '모바일'], icons: ['🎮', '🎵', '🎤', '📱'] },
    { keywords: ['데몬헌터스', '협업', '실시간', 'ar'], icons: ['⚔️', '🤝', '⚡', '🔮'] }
  ];
  
  for (const mapping of iconMappings) {
    if (mapping.keywords.some(keyword => combinedText.includes(keyword))) {
      return mapping.icons[Math.floor(Math.random() * mapping.icons.length)];
    }
  }
  
  // 기본 아이콘
  const defaultIcons = ['✨', '🎯', '💡', '🔥', '🌟', '✅'];
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
}

// 개선된 PPT 콘텐츠 파서 - 주제 정보 활용
export function parsePPTContent(aiText: string, sectionIndex: number, topic: string = ''): ParsedPPTContent {
  console.log('AI 텍스트 파싱 시작:', { aiText, sectionIndex, topic });
  
  const analyzed = analyzeContentStructure(aiText);
  
  const result = {
    title: analyzed.title,
    subtitle: analyzed.subtitle,
    features: analyzed.features,
    chartData: analyzed.chartData,
    price: analyzed.pricing,
    ctaText: generateCTAText(sectionIndex, analyzed.benefits, topic),
    ctaSubtext: generateCTASubtext(sectionIndex, analyzed.benefits, topic)
  };
  
  console.log('파싱 결과:', result);
  return result;
}

function generateCTAText(sectionIndex: number, benefits: string[], topic: string = ''): string {
  if (benefits.length > 0) {
    return smartTextSplit(benefits[0], 30);
  }
  
  const topicBasedCTA = topic ? [
    `${topic}를 지금 체험해보세요`,
    `${topic} 특별 혜택 확인하기`,
    `${topic}의 뛰어난 성능 확인`,
    `${topic} 합리적인 가격과 혜택`
  ] : [
    '지금 바로 경험해보세요',
    '특별 할인 혜택을 만나보세요', 
    '업계 최고의 성과를 확인하세요',
    '합리적인 가격과 다양한 혜택'
  ];
  
  return topicBasedCTA[sectionIndex] || topicBasedCTA[0];
}

function generateCTASubtext(sectionIndex: number, benefits: string[], topic: string = ''): string {
  if (benefits.length > 1) {
    return smartTextSplit(benefits[1], 40);
  }
  
  const ctaSubtexts = [
    '특별 출시 기념 할인 혜택',
    '검증된 성능과 신뢰성',
    '한정된 시간만 제공되는 특별 혜택',
    '무료 배송 및 A/S 지원 포함'
  ];
  
  return ctaSubtexts[sectionIndex] || ctaSubtexts[0];
}

// 브로슈어 콘텐츠 파싱 (기존 함수들 유지)
export interface ParsedBrochureContent {
  title: string;
  subtitle: string;
  products: Array<{
    name: string;
    description: string;
    price: string;
    category?: string;
  }>;
  specialOffer: {
    title: string;
    description: string;
    highlight?: string;
  };
  testimonials?: Array<{
    name: string;
    rating: number;
    comment: string;
  }>;
}

export function parseBrochureContent(aiText: string, sectionIndex: number): ParsedBrochureContent {
  const lines = aiText.split('\n').filter(line => line.trim());
  
  // 기본 구조 추출
  const title = extractTitle(lines);
  const subtitle = extractSubtitle(lines);
  
  // 제품 정보 추출
  const products = extractProducts(lines);
  
  // 특별 혜택 추출
  const specialOffer = extractSpecialOffer(lines);
  
  // 고객 후기 추출 (3페이지인 경우)
  const testimonials = sectionIndex === 2 ? extractTestimonials(lines) : undefined;
  
  return {
    title,
    subtitle,
    products,
    specialOffer,
    testimonials
  };
}

function extractProducts(lines: string[]): Array<{name: string, description: string, price: string, category?: string}> {
  const products: Array<{name: string, description: string, price: string, category?: string}> = [];
  const pricePattern = /₩[\d,]+|[₩]?\s*\d{1,3}(,\d{3})*\s*원/;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (pricePattern.test(trimmed)) {
      const price = trimmed.match(pricePattern)?.[0] || '';
      const name = trimmed.replace(pricePattern, '').trim();
      
      if (name.length > 0) {
        products.push({
          name: smartTextSplit(name, 20),
          description: `${name}의 뛰어난 성능과 품질을 경험해보세요.`,
          price,
          category: name.includes('프리미엄') ? 'premium' : 'standard'
        });
      }
    }
  });
  
  // 기본 제품 추가
  if (products.length === 0) {
    return [
      { name: '기본 모델', description: '합리적인 가격의 기본 기능', price: '₩99,000', category: 'standard' },
      { name: '프리미엄 모델', description: '고급 기능이 포함된 프리미엄 버전', price: '₩199,000', category: 'premium' }
    ];
  }
  
  return products.slice(0, 4);
}

function extractSpecialOffer(lines: string[]): {title: string, description: string, highlight?: string} {
  const offerLines = lines.filter(line => 
    /할인|혜택|무료|이벤트|특가|증정/.test(line)
  );
  
  if (offerLines.length > 0) {
    return {
      title: '특별 런칭 이벤트',
      description: offerLines[0],
      highlight: offerLines.length > 1 ? offerLines[1] : undefined
    };
  }
  
  return {
    title: '특별 혜택',
    description: '출시 기념 특별 할인 혜택을 만나보세요.'
  };
}

function extractTestimonials(lines: string[]): Array<{name: string, rating: number, comment: string}> {
  const testimonials: Array<{name: string, rating: number, comment: string}> = [];
  
  lines.forEach(line => {
    if (line.includes('님') && line.includes('점')) {
      const nameMatch = line.match(/(.+?)님/);
      const ratingMatch = line.match(/(\d+)점/);
      
      if (nameMatch && ratingMatch) {
        testimonials.push({
          name: nameMatch[1],
          rating: parseInt(ratingMatch[1]),
          comment: line.replace(/(.+?)님.*?(\d+)점/, '').trim() || '정말 만족스러운 제품입니다.'
        });
      }
    }
  });
  
  return testimonials.length > 0 ? testimonials : [
    { name: '김', rating: 5, comment: '정말 만족스러운 제품입니다. 품질이 기대 이상이에요.' },
    { name: '박', rating: 5, comment: '배송도 빠르고 사용법도 간단해서 좋아요.' }
  ];
}

// 매뉴얼 콘텐츠 파싱 (기존 함수들 유지)
export interface ParsedManualContent {
  title: string;
  subtitle: string;
  sectionType: 'overview' | 'installation' | 'usage' | 'maintenance';
  steps: Array<{
    title: string;
    description: string;
    tip?: string;
    warning?: string;
  }>;
  safetyNotes?: string[];
}

export function parseManualContent(aiText: string, sectionIndex: number): ParsedManualContent {
  const lines = aiText.split('\n').filter(line => line.trim());
  
  const sectionTypes = ['overview', 'installation', 'usage', 'maintenance'];
  const sectionType = sectionTypes[sectionIndex] as any;
  
  const title = extractTitle(lines);
  const subtitle = extractSubtitle(lines);
  const steps = extractSteps(lines);
  const safetyNotes = extractSafetyNotes(lines);
  
  return {
    title,
    subtitle,
    sectionType,
    steps,
    safetyNotes
  };
}

function extractSteps(lines: string[]): Array<{title: string, description: string, tip?: string, warning?: string}> {
  const steps: Array<{title: string, description: string, tip?: string, warning?: string}> = [];
  let currentStep: {title: string, description: string, tip?: string, warning?: string} | null = null;
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    // 단계 번호 찾기
    const stepMatch = trimmed.match(/^(\d+)\.?\s*(.+)/);
    if (stepMatch) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        title: stepMatch[2],
        description: ''
      };
    } else if (currentStep && trimmed.length > 0) {
      if (trimmed.includes('팁') || trimmed.includes('tip')) {
        currentStep.tip = trimmed;
      } else if (trimmed.includes('주의') || trimmed.includes('경고')) {
        currentStep.warning = trimmed;
      } else {
        currentStep.description += (currentStep.description ? ' ' : '') + trimmed;
      }
    }
  });
  
  if (currentStep) {
    steps.push(currentStep);
  }
  
  return steps.length > 0 ? steps : [
    { title: '기본 설정', description: '제품을 사용하기 전 기본 설정을 완료하세요.' },
    { title: '사용법 확인', description: '사용 설명서를 참고하여 올바른 사용법을 익히세요.' }
  ];
}

function extractSafetyNotes(lines: string[]): string[] {
  return lines.filter(line => 
    /주의|경고|안전|금지|위험/.test(line)
  ).map(line => line.trim());
}

// 범용 아이콘 선택 함수 (기존 유지)
export const UNIVERSAL_ICONS = {
  '🚀': ['혁신', '기술', '발전', '진보'],
  '💎': ['품질', '프리미엄', '고급', '최고'],
  '⚡': ['속도', '빠른', '즉시', '효율'],
  '🛡️': ['보안', '안전', '보호', '방어'],
  '🔧': ['설정', '조정', '관리', '유지보수'],
  '📱': ['모바일', '스마트폰', '앱', '디지털'],
  '💻': ['컴퓨터', '노트북', 'PC', '데스크톱'],
  '🌐': ['인터넷', '네트워크', '온라인', '웹'],
  '🔋': ['배터리', '전력', '충전', '에너지'],
  '📷': ['카메라', '사진', '촬영', '이미지']
};

export function selectIcon(text: string): string {
  const lowerText = text.toLowerCase();
  
  for (const [icon, keywords] of Object.entries(UNIVERSAL_ICONS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return icon;
    }
  }
  
  // 기본 아이콘들
  const defaultIcons = ['✨', '🎯', '💡', '🔥', '🌟', '✅'];
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
}