// ===== 콘텐츠 디버깅 유틸리티 =====

export interface ContentDebugInfo {
  timestamp: string;
  operation: string;
  input?: any;
  output?: any;
  duration?: number;
  warnings?: string[];
  errors?: string[];
  suggestions?: string[];
}

export class ContentDebugger {
  private static logs: ContentDebugInfo[] = [];
  private static isEnabled = process.env.NODE_ENV === 'development';

  /**
   * 콘텐츠 파싱 과정을 모니터링하고 로깅
   */
  static debugContentParsing(
    operation: string,
    input: any,
    output: any,
    duration?: number
  ): void {
    if (!this.isEnabled) return;

    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 텍스트 길이 분석
    if (typeof input === 'string') {
      const textLength = input.length;
      if (textLength < 50) {
        warnings.push('입력 텍스트가 너무 짧습니다 (50자 미만)');
      } else if (textLength > 2000) {
        warnings.push('입력 텍스트가 너무 깁니다 (2000자 초과)');
      }
    }

    // 제목 검증
    if (output?.title) {
      const titleLength = output.title.length;
      if (titleLength < 5) {
        warnings.push('제목이 너무 짧습니다');
      } else if (titleLength > 50) {
        warnings.push('제목이 너무 깁니다 (50자 초과)');
        suggestions.push('제목을 50자 이내로 줄이세요');
      }
    }

    // 특징 검증
    if (output?.features && Array.isArray(output.features)) {
      if (output.features.length === 0) {
        warnings.push('특징이 추출되지 않았습니다');
      } else if (output.features.length > 6) {
        warnings.push('특징이 너무 많습니다 (6개 초과)');
        suggestions.push('중요한 특징만 4-6개로 제한하세요');
      }

      output.features.forEach((feature: any, index: number) => {
        if (!feature.title || feature.title.length < 3) {
          warnings.push(`특징 ${index + 1}의 제목이 너무 짧습니다`);
        }
        if (!feature.description || feature.description.length < 10) {
          warnings.push(`특징 ${index + 1}의 설명이 너무 짧습니다`);
        }
      });
    }

    // 차트 데이터 검증
    if (output?.chartData && Array.isArray(output.chartData)) {
      output.chartData.forEach((data: any, index: number) => {
        if (typeof data.value !== 'number' || data.value < 0 || data.value > 100) {
          warnings.push(`차트 데이터 ${index + 1}의 값이 유효하지 않습니다 (0-100 범위)`);
        }
        if (!data.label || data.label.length < 2) {
          warnings.push(`차트 데이터 ${index + 1}의 라벨이 너무 짧습니다`);
        }
      });
    }

    // 가격 검증
    if (output?.price) {
      const priceStr = output.price.toString();
      if (!priceStr.includes('₩') && !priceStr.includes('원')) {
        suggestions.push('가격에 통화 단위를 포함하세요 (예: ₩100,000)');
      }
    }

    const debugInfo: ContentDebugInfo = {
      timestamp: new Date().toISOString(),
      operation,
      input,
      output,
      duration,
      warnings,
      suggestions
    };

    this.logs.push(debugInfo);
    this.logToConsole(debugInfo);
  }

  /**
   * 레이아웃 호환성 검사
   */
  static checkLayoutCompatibility(content: any): {
    isCompatible: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // 제목 길이 검사
    if (content.title && content.title.length > 40) {
      issues.push('제목이 너무 길어 레이아웃에 문제가 될 수 있습니다');
      recommendations.push('제목을 40자 이내로 줄이세요');
    }

    // 특징 설명 길이 검사
    if (content.features) {
      content.features.forEach((feature: any, index: number) => {
        if (feature.description && feature.description.length > 100) {
          issues.push(`특징 ${index + 1}의 설명이 너무 깁니다`);
          recommendations.push('설명을 100자 이내로 줄이세요');
        }
      });
    }

    // 차트 데이터 균형 검사
    if (content.chartData && content.chartData.length > 0) {
      const values = content.chartData.map((data: any) => data.value);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);
      
      if (maxValue - minValue > 80) {
        issues.push('차트 데이터 간 격차가 너무 큽니다');
        recommendations.push('데이터를 더 균형있게 조정하세요');
      }
    }

    return {
      isCompatible: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * 번역 적합성 검사
   */
  static checkTranslationSuitability(content: any): {
    isSuitable: boolean;
    complexity: 'low' | 'medium' | 'high';
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let technicalTerms = 0;
    let longSentences = 0;
    let totalWords = 0;

    // 텍스트 분석
    const analyzeText = (text: string) => {
      if (!text) return;
      
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.split(/\s+/).filter(w => w.length > 0);
      totalWords += words.length;

      // 긴 문장 검사
      sentences.forEach(sentence => {
        if (sentence.length > 100) {
          longSentences++;
        }
      });

      // 기술 용어 검사
      const technicalKeywords = [
        'API', 'SDK', '프레임워크', '아키텍처', '인터페이스', '프로토콜',
        '알고리즘', '데이터베이스', '서버', '클라이언트', '미들웨어',
        '캐싱', '로드밸런싱', '스케일링', '마이크로서비스', '컨테이너'
      ];

      technicalKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          technicalTerms++;
        }
      });
    };

    // 모든 텍스트 분석
    if (content.title) analyzeText(content.title);
    if (content.subtitle) analyzeText(content.subtitle);
    if (content.features) {
      content.features.forEach((feature: any) => {
        if (feature.title) analyzeText(feature.title);
        if (feature.description) analyzeText(feature.description);
      });
    }

    // 복잡도 평가
    let complexity: 'low' | 'medium' | 'high' = 'low';
    const complexityScore = (technicalTerms * 3) + (longSentences * 2) + (totalWords / 100);

    if (complexityScore > 20) {
      complexity = 'high';
      issues.push('번역 복잡도가 높습니다');
      suggestions.push('문장을 더 짧고 명확하게 작성하세요');
    } else if (complexityScore > 10) {
      complexity = 'medium';
      suggestions.push('일부 문장을 단순화하세요');
    }

    if (technicalTerms > 5) {
      issues.push('기술 용어가 너무 많습니다');
      suggestions.push('일반적인 용어로 대체하세요');
    }

    if (longSentences > 3) {
      issues.push('긴 문장이 너무 많습니다');
      suggestions.push('문장을 더 짧게 나누세요');
    }

    return {
      isSuitable: issues.length === 0,
      complexity,
      issues,
      suggestions
    };
  }

  /**
   * 성능 모니터링
   */
  static monitorPerformance<T>(
    operation: string,
    fn: () => T
  ): T {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(`성능 경고: ${operation}이 ${duration.toFixed(2)}ms 소요되었습니다`);
    }

    this.debugContentParsing(operation, null, result, duration);
    return result;
  }

  /**
   * 디버그 로그 내보내기
   */
  static exportDebugLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 로그 초기화
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * 콘솔에 로그 출력
   */
  private static logToConsole(debugInfo: ContentDebugInfo): void {
    const { operation, duration, warnings, suggestions } = debugInfo;

    console.group(`🔍 ${operation}`);
    
    if (duration) {
      console.log(`⏱️  실행 시간: ${duration.toFixed(2)}ms`);
    }

    if (warnings && warnings.length > 0) {
      console.warn('⚠️  경고:', warnings);
    }

    if (suggestions && suggestions.length > 0) {
      console.info('💡 제안:', suggestions);
    }

    console.groupEnd();
  }

  /**
   * 디버그 대시보드 생성
   */
  static createDebugDashboard(): string {
    const totalLogs = this.logs.length;
    const warnings = this.logs.reduce((sum, log) => sum + (log.warnings?.length || 0), 0);
    const errors = this.logs.reduce((sum, log) => sum + (log.errors?.length || 0), 0);
    const avgDuration = this.logs.reduce((sum, log) => sum + (log.duration || 0), 0) / totalLogs;

    return `
      <div style="font-family: monospace; padding: 20px; background: #f5f5f5;">
        <h2>🔍 콘텐츠 디버그 대시보드</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3>총 로그</h3>
            <p style="font-size: 24px; font-weight: bold; color: #3b82f6;">${totalLogs}</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3>경고</h3>
            <p style="font-size: 24px; font-weight: bold; color: #f59e0b;">${warnings}</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3>오류</h3>
            <p style="font-size: 24px; font-weight: bold; color: #ef4444;">${errors}</p>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3>평균 실행 시간</h3>
            <p style="font-size: 24px; font-weight: bold; color: #10b981;">${avgDuration.toFixed(2)}ms</p>
          </div>
        </div>
        <button onclick="console.log(JSON.stringify(window.debugLogs, null, 2))" style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          로그 내보내기
        </button>
      </div>
    `;
  }
}

/**
 * 파싱된 콘텐츠 유효성 검사
 */
export function validateParsedContent(content: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 필수 필드 검사
  if (!content.title) {
    errors.push('제목이 없습니다');
  }

  if (!content.subtitle) {
    warnings.push('부제목이 없습니다');
  }

  if (!content.features || !Array.isArray(content.features)) {
    errors.push('특징 배열이 없거나 유효하지 않습니다');
  } else if (content.features.length === 0) {
    warnings.push('특징이 없습니다');
  }

  // 특징 구조 검사
  if (content.features && Array.isArray(content.features)) {
    content.features.forEach((feature: any, index: number) => {
      if (!feature.title) {
        errors.push(`특징 ${index + 1}에 제목이 없습니다`);
      }
      if (!feature.description) {
        warnings.push(`특징 ${index + 1}에 설명이 없습니다`);
      }
      if (!feature.icon) {
        warnings.push(`특징 ${index + 1}에 아이콘이 없습니다`);
      }
    });
  }

  // 차트 데이터 검사
  if (content.chartData && Array.isArray(content.chartData)) {
    content.chartData.forEach((data: any, index: number) => {
      if (typeof data.value !== 'number') {
        errors.push(`차트 데이터 ${index + 1}의 값이 숫자가 아닙니다`);
      }
      if (!data.label) {
        errors.push(`차트 데이터 ${index + 1}에 라벨이 없습니다`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 콘텐츠 품질 점수 계산
 */
export function calculateContentQualityScore(content: any): {
  score: number;
  breakdown: Record<string, number>;
  suggestions: string[];
} {
  let totalScore = 0;
  const breakdown: Record<string, number> = {};
  const suggestions: string[] = [];

  // 제목 품질 (20점)
  let titleScore = 0;
  if (content.title) {
    const titleLength = content.title.length;
    if (titleLength >= 5 && titleLength <= 50) {
      titleScore = 20;
    } else if (titleLength > 0) {
      titleScore = 10;
      suggestions.push('제목 길이를 5-50자로 조정하세요');
    }
  }
  breakdown.title = titleScore;
  totalScore += titleScore;

  // 부제목 품질 (15점)
  let subtitleScore = 0;
  if (content.subtitle) {
    const subtitleLength = content.subtitle.length;
    if (subtitleLength >= 10 && subtitleLength <= 100) {
      subtitleScore = 15;
    } else if (subtitleLength > 0) {
      subtitleScore = 7;
      suggestions.push('부제목 길이를 10-100자로 조정하세요');
    }
  }
  breakdown.subtitle = subtitleScore;
  totalScore += subtitleScore;

  // 특징 품질 (40점)
  let featuresScore = 0;
  if (content.features && Array.isArray(content.features)) {
    const featureCount = content.features.length;
    if (featureCount >= 3 && featureCount <= 6) {
      featuresScore = 20;
    } else if (featureCount > 0) {
      featuresScore = 10;
      suggestions.push('특징을 3-6개로 조정하세요');
    }

    // 각 특징의 품질 검사
    let featureQualityScore = 0;
    content.features.forEach((feature: any) => {
      if (feature.title && feature.description && feature.icon) {
        featureQualityScore += 5;
      } else if (feature.title || feature.description) {
        featureQualityScore += 2;
      }
    });
    featuresScore += Math.min(featureQualityScore, 20);
  }
  breakdown.features = featuresScore;
  totalScore += featuresScore;

  // 차트 데이터 품질 (15점)
  let chartScore = 0;
  if (content.chartData && Array.isArray(content.chartData)) {
    const chartCount = content.chartData.length;
    if (chartCount >= 2 && chartCount <= 4) {
      chartScore = 10;
    } else if (chartCount > 0) {
      chartScore = 5;
    }

    // 데이터 유효성 검사
    let dataQualityScore = 0;
    content.chartData.forEach((data: any) => {
      if (typeof data.value === 'number' && data.value >= 0 && data.value <= 100 && data.label) {
        dataQualityScore += 1;
      }
    });
    chartScore += Math.min(dataQualityScore, 5);
  }
  breakdown.chartData = chartScore;
  totalScore += chartScore;

  // CTA 품질 (10점)
  let ctaScore = 0;
  if (content.ctaText && content.ctaSubtext) {
    ctaScore = 10;
  } else if (content.ctaText || content.ctaSubtext) {
    ctaScore = 5;
    suggestions.push('CTA 텍스트와 부제목을 모두 추가하세요');
  }
  breakdown.cta = ctaScore;
  totalScore += ctaScore;

  return {
    score: Math.min(totalScore, 100),
    breakdown,
    suggestions
  };
}

// 전역 디버그 로그 저장 (개발 환경에서만)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugLogs = ContentDebugger['logs'];
  (window as any).ContentDebugger = ContentDebugger;
}
