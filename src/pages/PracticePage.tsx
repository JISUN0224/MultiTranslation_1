import React from 'react';
import '../App.css';

// Components
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import TranslationPanel from '../components/translation/TranslationPanel';
import PPTTemplate from '../components/content/PPTTemplate';
import PPTDirectRender from '../components/content/PPTDirectRender'; // ✅ TestPage와 동일한 컴포넌트 사용
import BrochureTemplate from '../components/content/BrochureTemplate';
import ManualTemplate from '../components/content/ManualTemplate';

// Hooks
import { useTranslation } from '../hooks/useTranslation';

// Context
import { useContent } from '../contexts/ContentContext';

const PracticePage: React.FC = () => {
  const { generatedContent } = useContent();
  
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
  } = useTranslation('ppt');

  // ✅ TestPage와 동일한 데이터 처리 방식
  const contentData = generatedContent ? {
    title: generatedContent.topic,
    subtitle: `${generatedContent.type.toUpperCase()}`,
    sections: generatedContent.data?.slides ? 
      generatedContent.data.slides.map((slide: any) => slide.title || `슬라이드 ${slide.id}`) : 
      generatedContent.sections.map(section => section.originalText),
    slides: generatedContent.data?.slides, // AI가 생성한 slides 배열
    styles: generatedContent.data?.styles // AI가 생성한 styles
  } : currentData;

  // ✅ TestPage와 동일한 슬라이드 배열 추출
  const slides = generatedContent?.data?.slides ? 
    generatedContent.data.slides.map((slide: any) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      html: slide.html
    })) : [];

  // 총 섹션 수 계산
  const actualTotalSections = slides.length > 0 ? 
    slides.length : 
    (generatedContent ? generatedContent.sections.length : totalSections);
  
  // 디버깅용 로그
  console.log('PracticePage AI 슬라이드 정보:', {
    generatedContent: !!generatedContent,
    slidesLength: slides.length,
    sectionsLength: generatedContent?.sections?.length,
    actualTotalSections,
    slides: slides
  });

  // 네비게이션 props
  const navigationProps = {
    currentSection,
    totalSections: actualTotalSections,
    onPrevious: goToPreviousSection,
    onNext: goToNextSection,
    onSectionChange: goToSection,
  };

  // ✅ 텍스트 추출 콜백 (TestPage와 동일)
  const handleTextExtracted = (text: string) => {
    console.log('추출된 텍스트:', text);
    // 필요시 번역 패널에 전달하는 로직 추가 가능
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
        // ✅ AI 콘텐츠가 있으면 TestPage와 동일한 PPTDirectRender 사용
        return generatedContent && slides.length > 0 ? 
          <PPTDirectRender 
            slides={slides} 
            onTextExtracted={handleTextExtracted}
          /> : 
          <PPTTemplate {...templateProps} />;
      case 'brochure':
        return <BrochureTemplate {...templateProps} />;
      case 'manual':
        return <ManualTemplate {...templateProps} />;
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

  // ✅ 번역 패널에 현재 슬라이드 텍스트 전달
  const getCurrentSlideText = () => {
    if (slides.length > 0 && slides[currentSection]) {
      // HTML에서 텍스트 추출
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
    return translationState.originalText;
  };

  // 번역 패널 컴포넌트
  const translationPanelComponent = (
    <TranslationPanel
      sourceText={getCurrentSlideText()}
      contentType={contentType}
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