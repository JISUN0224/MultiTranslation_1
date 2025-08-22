// 🎯 콘텐츠 생성 메인 컴포넌트 - ContentGeneratorComponent.tsx
import React, { useState, useEffect } from 'react';
import { 
  generateContent, 
  recommendContentType, 
  generateContentPreview,
  exportContent,
  ExtendedContentRequest,
  ExtendedContentType 
} from '../services/contentGeneratorService';
import { GeneratedContent } from '../types';

interface ContentGeneratorProps {
  onContentGenerated?: (content: GeneratedContent) => void;
  defaultType?: ExtendedContentType;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ 
  onContentGenerated,
  defaultType = 'presentation' 
}) => {
  // 상태 관리
  const [formData, setFormData] = useState<ExtendedContentRequest>({
    topic: '',
    type: defaultType,
    industry: '',
    style: '전문적인',
    language: 'ko-zh',
    detailLevel: 'detailed'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [recommendedType, setRecommendedType] = useState<ExtendedContentType>('presentation');

  // 업계 옵션
  const industries = [
    'IT/기술', '화장품/뷰티', '식품/음료', '패션/의류', 
    '자동차', '건강/의료', '금융', '교육', '건설/부동산'
  ];

  // 스타일 옵션
  const styles = [
    '전문적인', '친근한', '창의적인', '간결한', '상세한'
  ];

  // 주제 변경 시 타입 추천
  useEffect(() => {
    if (formData.topic.length > 3) {
      const recommended = recommendContentType(formData.topic, formData.industry);
      setRecommendedType(recommended);
      
      // 미리보기 생성
      const previewData = generateContentPreview(formData);
      setPreview(previewData);
    }
  }, [formData.topic, formData.industry]);

  // 폼 데이터 업데이트
  const updateFormData = (field: keyof ExtendedContentRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 콘텐츠 생성
  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('주제를 입력해주세요!');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage('생성 준비 중...');

    try {
      const content = await generateContent(
        formData,
        (progress, message) => {
          setProgress(progress);
          setProgressMessage(message);
        }
      );

      setGeneratedContent(content);
      onContentGenerated?.(content);
      
    } catch (error) {
      console.error('생성 실패:', error);
      alert('콘텐츠 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  // 콘텐츠 내보내기
  const handleExport = (format: 'html' | 'json' | 'markdown') => {
    if (!generatedContent) return;

    const exported = exportContent(generatedContent, format);
    
    if (typeof exported === 'string') {
      const blob = new Blob([exported], { 
        type: format === 'html' ? 'text/html' : 
             format === 'json' ? 'application/json' : 'text/markdown' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.data.title?.replace(/[^a-zA-Z0-9가-힣]/g, '_') || 'content'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="content-generator">
      <div className="generator-container">
        {/* 헤더 */}
        <header className="generator-header">
          <h1>🚀 AI 콘텐츠 생성기</h1>
          <p>PPT와 설명서를 한 번에 생성하세요!</p>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="generator-content">
          {!generatedContent ? (
            // 생성 폼
            <div className="generation-form">
              {/* 기본 정보 */}
              <div className="form-section">
                <h3>📝 기본 정보</h3>
                
                <div className="form-group">
                  <label htmlFor="topic">주제 *</label>
                  <input
                    id="topic"
                    type="text"
                    value={formData.topic}
                    onChange={(e) => updateFormData('topic', e.target.value)}
                    placeholder="예: 스마트폰 사용법, 마케팅 전략 등"
                    className="form-input"
                  />
                  {recommendedType !== formData.type && formData.topic && (
                    <div className="recommendation">
                      💡 추천 타입: <strong>{recommendedType === 'manual' ? '설명서' : 'PPT'}</strong>
                      <button 
                        onClick={() => updateFormData('type', recommendedType)}
                        className="apply-recommendation"
                      >
                        적용
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="type">콘텐츠 타입</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-button ${formData.type === 'presentation' ? 'active' : ''}`}
                      onClick={() => updateFormData('type', 'presentation')}
                    >
                      📊 PPT 프레젠테이션
                    </button>
                    <button
                      type="button"
                      className={`type-button ${formData.type === 'manual' ? 'active' : ''}`}
                      onClick={() => updateFormData('type', 'manual')}
                    >
                      📚 설명서/매뉴얼
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="industry">업계</label>
                    <select
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => updateFormData('industry', e.target.value)}
                      className="form-select"
                    >
                      <option value="">선택안함</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="style">스타일</label>
                    <select
                      id="style"
                      value={formData.style}
                      onChange={(e) => updateFormData('style', e.target.value)}
                      className="form-select"
                    >
                      {styles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="detailLevel">상세 수준</label>
                  <div className="detail-level-selector">
                    {(['basic', 'detailed', 'comprehensive'] as const).map(level => (
                      <button
                        key={level}
                        type="button"
                        className={`detail-button ${formData.detailLevel === level ? 'active' : ''}`}
                        onClick={() => updateFormData('detailLevel', level)}
                      >
                        {level === 'basic' ? '간단히' : 
                         level === 'detailed' ? '상세히' : '완전히'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 미리보기 */}
              {preview && (
                <div className="preview-section">
                  <h3>🔍 생성 예상 정보</h3>
                  <div className="preview-stats">
                    <div className="stat-item">
                      <span className="stat-label">예상 시간</span>
                      <span className="stat-value">{preview.estimatedTime}초</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">토큰 사용</span>
                      <span className="stat-value">{preview.tokenUsage.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">섹션 수</span>
                      <span className="stat-value">{preview.sections.length}개</span>
                    </div>
                  </div>
                  
                  <div className="preview-features">
                    <h4>포함될 기능</h4>
                    <ul>
                      {preview.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 생성 버튼 */}
              <div className="generation-actions">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.topic.trim()}
                  className="generate-button"
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner"></div>
                      생성 중...
                    </>
                  ) : (
                    <>
                      🚀 {formData.type === 'manual' ? '설명서' : 'PPT'} 생성하기
                    </>
                  )}
                </button>
              </div>

              {/* 진행 상황 */}
              {isGenerating && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-message">{progressMessage}</p>
                </div>
              )}
            </div>
          ) : (
            // 생성 결과
            <div className="result-section">
              <div className="result-header">
                <h3>✅ 생성 완료!</h3>
                <div className="result-actions">
                  <button 
                    onClick={() => setGeneratedContent(null)}
                    className="new-generation-button"
                  >
                    새로 생성
                  </button>
                </div>
              </div>

              <div className="result-info">
                <h4>{generatedContent.data.title}</h4>
                <p>{generatedContent.data.subtitle}</p>
                <div className="result-meta">
                  <span>타입: {generatedContent.type === 'manual' ? '설명서' : 'PPT'}</span>
                  <span>섹션: {generatedContent.sections?.length || 0}개</span>
                  <span>생성일: {generatedContent.createdAt.toLocaleDateString('ko-KR')}</span>
                </div>
              </div>

              {/* 콘텐츠 미리보기 */}
              <div className="content-preview">
                {generatedContent.type === 'manual' ? (
                  <div 
                    className="manual-preview"
                    dangerouslySetInnerHTML={{ __html: generatedContent.data.content || '' }}
                  />
                ) : (
                  <div className="slides-preview">
                    {generatedContent.data.slides?.map((slide: any, index: number) => (
                      <div key={index} className="slide-preview">
                        <h5>슬라이드 {index + 1}: {slide.title}</h5>
                        <div dangerouslySetInnerHTML={{ __html: slide.html || slide.content }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 내보내기 옵션 */}
              <div className="export-section">
                <h4>📤 내보내기</h4>
                <div className="export-buttons">
                  <button onClick={() => handleExport('html')}>
                    🌐 HTML 다운로드
                  </button>
                  <button onClick={() => handleExport('markdown')}>
                    📝 Markdown 다운로드
                  </button>
                  <button onClick={() => handleExport('json')}>
                    📊 JSON 다운로드
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 스타일 */}
      <style jsx>{`
        .content-generator {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', 'Malgun Gothic', sans-serif;
        }

        .generator-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .generator-header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .form-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .form-section h3 {
          font-size: 1.5rem;
          color: #34495e;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #3498db;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #3498db;
        }

        .type-selector, .detail-level-selector {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .type-button, .detail-button {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .type-button.active, .detail-button.active {
          border-color: #3498db;
          background: #3498db;
          color: white;
        }

        .recommendation {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .apply-recommendation {
          margin-left: 10px;
          padding: 4px 8px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .preview-section {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .preview-section h3 {
          font-size: 1.3rem;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .preview-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 25px;
        }

        .stat-item {
          background: white;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stat-label {
          display: block;
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 5px;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .preview-features h4 {
          margin-bottom: 15px;
          color: #34495e;
        }

        .preview-features ul {
          list-style: none;
          padding: 0;
        }

        .preview-features li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          color: #555;
        }

        .generation-actions {
          text-align: center;
          margin: 30px 0;
        }

        .generate-button {
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 200px;
          justify-content: center;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
        }

        .generate-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .progress-section {
          margin-top: 30px;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #ecf0f1;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #2980b9);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-message {
          text-align: center;
          color: #7f8c8d;
          font-weight: 500;
        }

        .result-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #27ae60;
        }

        .result-header h3 {
          color: #27ae60;
          font-size: 1.5rem;
          margin: 0;
        }

        .new-generation-button {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .new-generation-button:hover {
          background: #c0392b;
          transform: translateY(-1px);
        }

        .result-info h4 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .result-info p {
          color: #7f8c8d;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        .result-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .result-meta span {
          background: #ecf0f1;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          color: #34495e;
        }

        .content-preview {
          margin: 30px 0;
          max-height: 600px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fafafa;
        }

        .manual-preview {
          padding: 20px;
        }

        .slides-preview {
          padding: 20px;
        }

        .slide-preview {
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .slide-preview h5 {
          margin-bottom: 15px;
          color: #2c3e50;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }

        .export-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .export-section h4 {
          margin-bottom: 20px;
          color: #34495e;
        }

        .export-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .export-buttons button {
          background: #95a5a6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .export-buttons button:hover {
          background: #7f8c8d;
          transform: translateY(-1px);
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .content-generator {
            padding: 10px;
          }

          .generator-header h1 {
            font-size: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .preview-stats {
            grid-template-columns: 1fr;
          }

          .type-selector, .detail-level-selector {
            flex-direction: column;
          }

          .result-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .result-meta {
            flex-direction: column;
            gap: 10px;
          }

          .export-buttons {
            flex-direction: column;
          }
        }

        /* 다크모드 지원 */
        @media (prefers-color-scheme: dark) {
          .content-generator {
            background: #1a1a1a;
            color: #e0e0e0;
          }

          .form-section, .result-section {
            background: #2d2d2d;
            color: #e0e0e0;
          }

          .form-input, .form-select {
            background: #3d3d3d;
            border-color: #555;
            color: #e0e0e0;
          }

          .preview-section {
            background: #2d2d2d;
          }

          .stat-item, .slide-preview {
            background: #3d3d3d;
          }
        }
      `}</style>
    </div>
  );
};

export default ContentGenerator;
