import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';
import { parsePPTContent, getTextDisplayConfig, smartTextSplit } from '../../utils/contentParser';

interface PPTTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

// 반응형 카드 컴포넌트
const ResponsiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div 
    className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 transition-all duration-300 hover:transform hover:scale-105 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// 동적 텍스트 컴포넌트 - PPT용 길이 조정
const DynamicText: React.FC<{
  text: string;
  className?: string;
  maxLength?: number;
}> = ({ text, className = '', maxLength }) => {
  if (!text || typeof text !== 'string') {
    return <div className={`${className}`}>콘텐츠를 불러오는 중...</div>;
  }
  
  const config = getTextDisplayConfig(text);
  
  // PPT 컴텍스트에 따른 자동 길이 조정
  let autoMaxLength = maxLength;
  if (!maxLength) {
    // 컴텍스트에 따라 자동 조정
    if (className.includes('title') || className.includes('h1')) {
      autoMaxLength = 40; // 제목은 40자
    } else if (className.includes('subtitle') || className.includes('h2')) {
      autoMaxLength = 60; // 부제목은 60자
    } else if (className.includes('description')) {
      autoMaxLength = 120; // 설명은 120자
    } else {
      autoMaxLength = 80; // 기본은 80자
    }
  }
  
  const displayText = text.length > (autoMaxLength || 80) ? 
    smartTextSplit(text, autoMaxLength || 80) : text;
  
  return (
    <span className={`${config.fontSize} ${className}`}>
      {displayText}
    </span>
  );
};

// 기능 카드 컴포넌튴 - 설명 길이 증가
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  gradient?: string;
}> = ({ icon, title, description, gradient = 'from-yellow-400 to-orange-500' }) => (
  <ResponsiveCard>
    <div className="text-center">
      <div className={`w-8 h-8 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center text-base mb-2 mx-auto`}>
        {icon}
      </div>
      <h3 className="text-base font-bold text-white mb-1">
        <DynamicText text={title} maxLength={25} />
      </h3>
      <div className="text-blue-50 text-xs leading-relaxed">
        <DynamicText text={description} maxLength={150} className="description" />
      </div>
    </div>
  </ResponsiveCard>
);

// 차트 카드 컴포넌트
const ChartCard: React.FC<{
  value: number;
  label: string;
}> = ({ value, label }) => (
  <ResponsiveCard>
    <div className="text-center">
      <div className="text-lg md:text-xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text mb-1">
        {value}%
      </div>
      <div className="text-blue-100 text-xs">
        <DynamicText text={label} maxLength={20} />
      </div>
      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-pink-400 h-1 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  </ResponsiveCard>
);

const PPTTemplate: React.FC<PPTTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];
  const parsedContent = parsePPTContent(currentText, currentSection);

  const renderSlideContent = () => {
    switch (currentSection) {
                           case 0: // 타이틀 슬라이드
          return (
                        <div className="text-center space-y-4 h-full flex flex-col justify-center">
               <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-white leading-tight">
                 <DynamicText text={parsedContent.title} maxLength={50} />
               </h1>
               <h2 className="text-base md:text-lg lg:text-xl font-semibold mb-4 text-blue-100 opacity-90">
                 <DynamicText text={parsedContent.subtitle} maxLength={80} />
               </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto mb-4">
               {parsedContent.features.slice(0, 2).map((feature, idx) => (
                 <FeatureCard
                   key={idx}
                   icon={feature.icon}
                   title={feature.title}
                   description={feature.description}
                   gradient={idx === 0 ? 'from-yellow-400 to-orange-500' : 'from-blue-400 to-purple-500'}
                 />
               ))}
             </div>

                           <ResponsiveCard className="max-w-xl mx-auto">
                <div className="text-center">
                  <h3 className="text-base font-bold text-white mb-1">
                    <DynamicText text={parsedContent.ctaText} maxLength={30} />
                  </h3>
                  <p className="text-blue-50 text-xs leading-relaxed">
                    <DynamicText text={parsedContent.ctaSubtext} maxLength={50} />
                  </p>
                </div>
              </ResponsiveCard>
           </div>
         );

             case 1: // 핵심 기능
                   return (
            <div className="space-y-4 h-full flex flex-col justify-center">
              <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">핵심 기능</h2>
                <p className="text-sm md:text-base text-blue-100">
                  <DynamicText text={parsedContent.subtitle} maxLength={80} className="subtitle" />
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {parsedContent.features.map((feature, idx) => (
                 <FeatureCard
                   key={idx}
                   icon={feature.icon}
                   title={feature.title}
                   description={feature.description}
                   gradient={idx % 2 === 0 ? 'from-green-400 to-teal-500' : 'from-purple-400 to-pink-500'}
                 />
               ))}
             </div>
           </div>
         );

             case 2: // 시장 분석
                   return (
            <div className="space-y-3 h-full flex flex-col justify-center">
              <div className="text-center mb-3">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1">시장 분석</h2>
                <p className="text-xs md:text-sm text-blue-100">시장에서의 위치와 경쟁력</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
               {parsedContent.chartData.map((data, idx) => (
                 <ChartCard key={idx} value={data.value} label={data.label} />
               ))}
             </div>

                           <ResponsiveCard className="text-center">
                <h3 className="text-sm font-bold text-white mb-1">
                  <DynamicText text={parsedContent.ctaText} maxLength={15} />
                </h3>
                <p className="text-blue-100 text-xs">
                  <DynamicText text={parsedContent.ctaSubtext} maxLength={25} />
                </p>
              </ResponsiveCard>
           </div>
         );

             case 3: // 특별 혜택
                   return (
            <div className="space-y-4 h-full flex flex-col justify-center">
              <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">특별 혜택</h2>
                <p className="text-sm md:text-base text-blue-100">합리적인 가격과 다양한 혜택</p>
              </div>
             
                           {parsedContent.price && (
                <div className="text-center mb-4">
                  <div className="text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text mb-1">
                    {parsedContent.price}
                  </div>
                  <div className="text-blue-100 text-xs">시작 가격</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <ResponsiveCard className="text-center">
                 <div className="text-xl mb-2">💰</div>
                 <h3 className="text-lg font-bold text-white mb-1">특가 할인</h3>
                 <div className="text-lg font-bold text-green-300 mb-1">30% 할인</div>
                 <p className="text-green-100 text-xs">출시 기념 특별 혜택</p>
               </ResponsiveCard>
               
               <ResponsiveCard className="text-center">
                 <div className="text-xl mb-2">🚚</div>
                 <h3 className="text-lg font-bold text-white mb-1">무료 배송</h3>
                 <div className="text-lg font-bold text-blue-300 mb-1">전국 무료</div>
                 <p className="text-blue-100 text-xs">빠르고 안전한 배송</p>
               </ResponsiveCard>
               
               <ResponsiveCard className="text-center">
                 <div className="text-xl mb-2">🔧</div>
                 <h3 className="text-lg font-bold text-white mb-1">A/S 지원</h3>
                 <div className="text-lg font-bold text-purple-300 mb-1">2년 무상</div>
                 <p className="text-purple-100 text-xs">평생 기술 지원</p>
               </ResponsiveCard>
               
               <ResponsiveCard className="text-center">
                 <div className="text-xl mb-2">🎁</div>
                 <h3 className="text-lg font-bold text-white mb-1">추가 혜택</h3>
                 <div className="text-lg font-bold text-pink-300 mb-1">무료 증정</div>
                 <p className="text-pink-100 text-xs">프리미엄 패키지</p>
               </ResponsiveCard>
             </div>
           </div>
         );

      default:
        return (
          <div className="text-center space-y-6 h-full flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <DynamicText text={parsedContent.title} maxLength={30} />
            </h3>
            <p className="text-lg text-blue-100">
              <DynamicText text={parsedContent.subtitle} maxLength={50} />
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-semibold mb-1">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90">{data.subtitle}</p>
        )}
      </div>

             {/* PPT 슬라이드 영역 */}
       <div className="flex-1 p-4 flex items-center justify-center">
         <div className="w-full max-w-3xl mx-auto">
                       {/* 짧은 슬라이드 비율 */}
            <div 
              className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-white"
              style={{ aspectRatio: '16/9', minHeight: '600px' }}
            >
            {/* 배경 효과 */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse" style={{top: '20%', left: '80%'}} />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-70 animate-pulse" style={{bottom: '20%', right: '80%'}} />
            </div>

            {/* 슬라이드 내용 */}
            <div className="relative h-full p-4 md:p-6 flex flex-col justify-center z-10">
              {renderSlideContent()}
            </div>

            {/* 슬라이드 번호 */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">
                {currentSection + 1} / {data.sections.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between">
        <button
          onClick={navigation.onPrevious}
          disabled={navigation.currentSection === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px)"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>이전</span>
        </button>

        <div className="flex items-center space-x-3">
          {data.sections.map((_, index) => (
            <button
              key={index}
              onClick={() => navigation.onSectionChange?.(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === navigation.totalSections - 1}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px) shadow-lg
            bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-300 disabled:text-gray-500 text-white
          `}
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PPTTemplate;

