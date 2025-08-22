import React, { useState } from 'react';
import '../App.css';

// Components
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import TranslationPanel from '../components/translation/TranslationPanel';
import PPTTemplate from '../components/content/PPTTemplate';
import PPTDirectRender from '../components/content/PPTDirectRender';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Context
import { useContent } from '../contexts/ContentContext';

const PracticePage: React.FC = () => {
  const { generatedContent, currentRequest } = useContent();
  
  // 🔥 생성된 콘텐츠 타입에 따라 동적으로 초기 타입 설정
  const initialContentType = generatedContent?.type || 'ppt';
  
  const {
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
  } = useTranslation(initialContentType);

  // ✅ 콘텐츠 데이터 처리 (매뉴얼과 PPT 구분)
  const contentData = generatedContent ? {
    title: generatedContent.topic,
    subtitle: `${generatedContent.type.toUpperCase()}`,
    sections: generatedContent.type === 'manual' 
      ? (generatedContent.data?.slides?.map((slide: any) => slide.title) || generatedContent.sections.map(section => typeof section === 'string' ? section : section.originalText || section))
      : generatedContent.data?.slides 
        ? generatedContent.data.slides.map((slide: any) => slide.title || `슬라이드 ${slide.id}`) 
        : generatedContent.sections.map(section => typeof section === 'string' ? section : section.originalText || section),
    slides: generatedContent.data?.slides, // PPT와 매뉴얼 공통
    styles: generatedContent.data?.styles // PPT 전용
  } : currentData;

  // ✅ 슬라이드 배열 추출 (PPT와 매뉴얼 공통 처리)
  const slides = generatedContent?.data?.slides ? 
    generatedContent.data.slides.map((slide: any) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      html: slide.html
    })) : [];

  // ✅ 매뉴얼과 PPT 슬라이드 기반 섹션 계산
  const actualTotalSections = (() => {
    if (!generatedContent) return totalSections;
    
    // 매뉴얼/PPT 모두 slides가 있으면 슬라이드 수 사용
    if (slides.length > 0) {
      return slides.length;
    }
    
    // 매뉴얼의 경우 sections 배열 길이 사용
    if (generatedContent.type === 'manual') {
      return generatedContent.sections?.length || 1;
    }
    
    // 기본값
    return generatedContent.sections?.length || totalSections;
  })();
  
  // 디버깅용 로그 개선
  console.log('PracticePage 상태 정보:', {
    contentType,
    generatedContentType: generatedContent?.type,
    generatedContent: !!generatedContent,
    slidesLength: slides.length,
    sectionsLength: generatedContent?.sections?.length,
    actualTotalSections,
    currentSection,
    hasManualHTML: !!(generatedContent?.html || generatedContent?.data?.content),
    hasSlides: !!generatedContent?.data?.slides,
    slidesData: generatedContent?.data?.slides,
    sectionsData: generatedContent?.sections
  });

  // 네비게이션 props
  const navigationProps = {
    currentSection,
    totalSections: actualTotalSections,
    onPrevious: goToPreviousSection,
    onNext: goToNextSection,
    onSectionChange: goToSection,
  };

  // ✅ 추출된 텍스트 상태 관리
  const [extractedText, setExtractedText] = useState<string>('');

  // ✅ 텍스트 추출 콜백
  const handleTextExtracted = (text: string) => {
    console.log('추출된 텍스트:', text);
    setExtractedText(text);
  };

  // 현재 콘텐츠 타입에 따른 템플릿 컴포넌트 선택
  const renderContentTemplate = () => {
    const templateProps = {
      data: contentData,
      currentSection,
      navigation: navigationProps,
    };

    switch (contentType) {
      case 'ppt':
        // ✅ AI PPT 콘텐츠가 있으면 PPTDirectRender 사용
        if (generatedContent && generatedContent.type === 'ppt' && slides.length > 0) {
          return <PPTDirectRender 
            slides={slides} 
            onTextExtracted={handleTextExtracted}
          />;
        } else {
          return <PPTTemplate {...templateProps} />;
        }
        
      case 'manual':
        // ✅ 매뉴얼도 슬라이드가 있으면 PPTDirectRender 사용 (동일한 네비게이션)
        if (generatedContent && generatedContent.type === 'manual' && slides.length > 0) {
          return <PPTDirectRender 
            slides={slides} 
            onTextExtracted={handleTextExtracted}
          />;
        } else {
          // 🔥 슬라이드가 없는 기존 매뉴얼은 HTML 직접 렌더링
          const manualHTML = generatedContent?.html || generatedContent?.data?.content;
          
          if (!generatedContent || !manualHTML) {
            return (
              <div className="text-center py-20">
                <p className="text-gray-500">설명서 콘텐츠를 생성해주세요.</p>
              </div>
            );
          }
          
          return (
            <div 
              className="manual-content"
              dangerouslySetInnerHTML={{ __html: manualHTML }}
              style={{
                padding: '0',
                maxWidth: '100%',
                overflow: 'auto',
                minHeight: '600px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}
              ref={(element) => {
                if (element && manualHTML) {
                  try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(manualHTML, 'text/html');
                    const styleTags = doc.querySelectorAll('style');
                    styleTags.forEach(tag => tag.remove());
                    const textContent = doc.body.textContent || doc.body.innerText || '';
                    const cleanText = textContent.replace(/\s+/g, ' ').trim();
                    if (cleanText && cleanText !== extractedText) {
                      handleTextExtracted(cleanText);
                    }
                  } catch (error) {
                    console.error('Manual 텍스트 추출 오류:', error);
                  }
                }
              }}
            />
          );
        }
        
      default:
        return <PPTTemplate {...templateProps} />;
    }
  };

  // 헤더 컴포넌트
  const headerComponent = (
    <Header
      currentContentType={contentType}
      onContentTypeChange={handleContentTypeChange}
      currentSection={currentSection}
      totalSections={actualTotalSections}
    />
  );

  // ✅ 번역 패널에 추출된 텍스트 전달
  const getCurrentSlideText = () => {
    // 추출된 텍스트가 있으면 우선 사용
    if (extractedText) {
      return extractedText;
    }
    
    // 슬라이드가 있는 경우 (PPT/매뉴얼 공통)
    if (slides.length > 0 && slides[currentSection]) {
      const htmlContent = slides[currentSection].html;
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const textContent = doc.body.textContent || doc.body.innerText || '';
        return textContent.replace(/\s+/g, ' ').trim();
      } catch (error) {
        return slides[currentSection].title || '';
      }
    }
    
    // Manual 콘텐츠인 경우 HTML에서 텍스트 추출
    const manualHTML = generatedContent?.html || generatedContent?.data?.content;
    if (contentType === 'manual' && manualHTML && slides.length === 0) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(manualHTML, 'text/html');
        const styleTags = doc.querySelectorAll('style');
        styleTags.forEach(tag => tag.remove());
        const textContent = doc.body.textContent || doc.body.innerText || '';
        const cleanText = textContent.replace(/\s+/g, ' ').trim();
        return cleanText || '설명서 콘텐츠';
      } catch (error) {
        console.error('Manual HTML 텍스트 추출 오류:', error);
        return '설명서 콘텐츠';
      }
    }
    
    // 기본값 반환
    return translationState.originalText || '콘텐츠를 불러오는 중...';
  };

  // 번역 패널 컴포넌트
  const translationPanelComponent = (
    <TranslationPanel
      sourceText={getCurrentSlideText()}
      contentType={contentType}
      language={currentRequest?.language || 'ko-zh'}
    />
  );

  return (
    <Layout
      header={headerComponent}
      contentArea={renderContentTemplate()}
      translationPanel={translationPanelComponent}
    />
  );
};

export default PracticePage;