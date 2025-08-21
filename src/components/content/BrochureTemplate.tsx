import React from 'react';
import { ChevronLeft, ChevronRight, Star, Gift } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';
import { parseBrochureContent } from '../../utils/contentParser';

interface BrochureTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const BrochureTemplate: React.FC<BrochureTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];
  const parsedContent = parseBrochureContent(currentText, currentSection);

  const renderBrochureContent = () => {
    switch (currentSection) {
      case 0: // 메인 제품
        return (
          <>
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-8 relative overflow-hidden">
              {/* 애니메이션 배경 */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute w-full h-full bg-repeat opacity-30" 
                     style={{
                       backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                       animation: 'float 20s linear infinite'
                     }} />
              </div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{parsedContent.title}</h1>
                <p className="text-lg md:text-xl opacity-90">{parsedContent.subtitle}</p>
              </div>
            </div>

            {/* 제품 그리드 */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {parsedContent.products.slice(0, 2).map((product, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:translateY(-5px)">
                    {/* 제품 이미지 */}
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                      {product.category === 'premium' && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                          PREMIUM
                        </div>
                      )}
                    </div>
                    
                    {/* 제품 정보 */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                          {product.price}
                        </div>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 특별 혜택 */}
              <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 border border-orange-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-3xl opacity-70">
                  <Gift />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-orange-800 mb-3 flex items-center">
                    <Gift className="w-6 h-6 mr-2" />
                    {parsedContent.specialOffer.title}
                  </h4>
                  <p className="text-orange-700 text-lg">{parsedContent.specialOffer.description}</p>
                  {parsedContent.specialOffer.highlight && (
                    <p className="text-orange-600 text-sm mt-2 font-medium">
                      {parsedContent.specialOffer.highlight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 1: // 확장 라인업
        return (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">확장 라인업</h1>
                <p className="text-lg md:text-xl opacity-90">더욱 다양한 선택의 즐거움</p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {parsedContent.products.slice(2, 4).map((product, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:translateY(-5px)">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-4 right-4 bg-red-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                          LIMITED
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        {product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-xl font-bold text-blue-800 mb-3">{parsedContent.specialOffer.title}</h4>
                <p className="text-blue-700 text-lg">{parsedContent.specialOffer.description}</p>
              </div>
            </div>
          </>
        );

      case 2: // 고객 후기
        return (
          <>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">고객 후기</h1>
                <p className="text-lg md:text-xl opacity-90">실제 사용자들의 생생한 경험</p>
              </div>
            </div>

            <div className="p-8">
              {/* 고객 후기 */}
              <div className="grid grid-cols-1 gap-6 mb-8">
                {parsedContent.testimonials?.map((testimonial, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-6 border-l-4 border-green-500">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name} 고객</h4>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="ml-2 text-gray-600 text-sm">{testimonial.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
                  </div>
                ))}
              </div>

              {/* 마지막 CTA */}
              <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-8 text-center border border-green-200">
                <h4 className="text-2xl font-bold text-green-800 mb-3">{parsedContent.specialOffer.title}</h4>
                <p className="text-green-700 text-lg mb-4">{parsedContent.specialOffer.description}</p>
                {parsedContent.specialOffer.highlight && (
                  <p className="text-green-600 font-medium">{parsedContent.specialOffer.highlight}</p>
                )}
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{parsedContent.title}</h3>
            <p className="text-gray-600">{parsedContent.subtitle}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-orange-400 text-white">
        <h2 className="text-lg font-semibold mb-1">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90">{data.subtitle}</p>
        )}
      </div>

      {/* 브로슈어 영역 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="w-full max-w-4xl mx-auto">
          {/* A4 비율 브로슈어 */}
          <div 
            className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden"
            style={{ aspectRatio: '210/297', minHeight: '700px' }}
          >
            {renderBrochureContent()}
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
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-gradient-to-r from-pink-500 to-orange-400 shadow-lg' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === navigation.totalSections - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px) shadow-lg"
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BrochureTemplate;
