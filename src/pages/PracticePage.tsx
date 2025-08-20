import React from 'react';
import '../App.css';

// Components
import Layout from '../components/layout/Layout';
import Header from '../components/layout/Header';
import TranslationPanel from '../components/translation/TranslationPanel';
import PPTTemplate from '../components/content/PPTTemplate';
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
  } = useTranslation('ppt');

  // 생성된 콘텐츠가 없으면 기본 데이터 사용
  const contentData = generatedContent ? {
    title: generatedContent.topic,
    subtitle: `${generatedContent.type.toUpperCase()}`,
    sections: generatedContent.sections.map(section => section.originalText)
  } : currentData;

  // 네비게이션 props
  const navigationProps = {
    currentSection,
    totalSections,
    onPrevious: goToPreviousSection,
    onNext: goToNextSection,
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
        return <PPTTemplate {...templateProps} />;
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
      totalSections={totalSections}
    />
  );

  // 번역 패널 컴포넌트
  const translationPanelComponent = (
    <TranslationPanel
      sourceText={translationState.originalText}
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
