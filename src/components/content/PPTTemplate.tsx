import React from 'react';
import { ChevronLeft, ChevronRight, Star, Zap, Shield, Wifi, Battery, Camera, Smartphone } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';

interface PPTTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const PPTTemplate: React.FC<PPTTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];

  // 슬라이드 타입별 렌더링
  const renderSlideContent = () => {
    const slideType = currentSection === 0 ? 'title' : 
                     currentSection === 1 ? 'features' : 
                     currentSection === 2 ? 'market' : 
                     currentSection === 3 ? 'portfolio' : 'pricing';

    switch (slideType) {
      case 'title':
        return (
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              {data.title || 'Nova X Pro'}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-blue-100">
              차세대 스마트폰의 시작
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-blue-50">
              <div className="flex items-center justify-center space-x-3">
                <Zap className="h-6 w-6 text-yellow-300" />
                <span>혁신적인 AI 카메라 시스템</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Wifi className="h-6 w-6 text-green-300" />
                <span>초고속 5G 연결성</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Battery className="h-6 w-6 text-blue-300" />
                <span>48시간 배터리 지속력</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Shield className="h-6 w-6 text-purple-300" />
                <span>군사급 보안 시스템</span>
              </div>
            </div>
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl max-w-2xl mx-auto">
              <p className="text-2xl font-bold mb-2">2024년 3월 15일 글로벌 출시</p>
              <p className="text-lg opacity-90">사전 예약 시 30% 할인 혜택</p>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">핵심 기능</h2>
              <p className="text-xl text-blue-100">혁신적인 기술로 만든 완벽한 경험</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">초고화소 108MP 카메라</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  뛰어난 디테일과 선명한 화질로 생생한 순간을 포착하세요.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-500 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">최신 옥타코어 프로세서</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  끊김 없는 부드러운 사용 환경과 강력한 멀티태스킹 성능을 경험하세요.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <Battery className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">5000mAh 대용량 배터리</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  하루 종일 사용 가능한 긴 배터리 수명을 자랑합니다.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-purple-500 p-3 rounded-full">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">6.8인치 AMOLED 디스플레이</h3>
                </div>
                <p className="text-blue-50 leading-relaxed">
                  생생한 색감과 몰입감 넘치는 시각 경험을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">시장 분석</h2>
              <p className="text-xl text-blue-100">경쟁사 대비 우수한 성능</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">35%</div>
                <div className="text-blue-100">삼성</div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">30%</div>
                <div className="text-blue-100">애플</div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-3xl font-bold text-white mb-2">15%</div>
                <div className="text-blue-100">Nova</div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">경쟁 우위</h3>
              <div className="space-y-3 text-blue-50">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>동급 최고 수준의 카메라 화질</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>경쟁사 대비 2배 긴 배터리 수명</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span>혁신적인 AI 기능으로 차별화</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">제품 라인업</h2>
              <p className="text-xl text-blue-100">다양한 용량으로 선택하세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">128GB</h3>
                <div className="text-3xl font-bold text-blue-300 mb-4">₩999,000</div>
                <ul className="text-blue-50 space-y-2 text-left">
                  <li>• 기본 저장 공간</li>
                  <li>• 일상 사용에 적합</li>
                  <li>• 가성비 최고</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-center border-2 border-white/30 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  인기
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">256GB</h3>
                <div className="text-3xl font-bold text-yellow-300 mb-4">₩1,199,000</div>
                <ul className="text-blue-50 space-y-2 text-left">
                  <li>• 충분한 저장 공간</li>
                  <li>• 사진/영상 저장</li>
                  <li>• 게임 플레이</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-4">512GB</h3>
                <div className="text-3xl font-bold text-purple-300 mb-4">₩1,399,000</div>
                <ul className="text-blue-50 space-y-2 text-left">
                  <li>• 대용량 저장</li>
                  <li>• 전문가용</li>
                  <li>• 미래 지향적</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">가격 정책</h2>
              <p className="text-xl text-blue-100">합리적인 가격으로 혁신을 경험하세요</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-white mb-2">₩999,000</div>
                <div className="text-xl text-blue-100">기본 가격 (128GB)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">출시 기념 할인</h3>
                  <div className="text-3xl font-bold text-yellow-300 mb-2">10만원 할인</div>
                  <p className="text-green-100">10월 31일까지</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">할부 혜택</h3>
                  <div className="text-3xl font-bold text-yellow-300 mb-2">24개월 무이자</div>
                  <p className="text-blue-100">제휴 카드 이용 시</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-blue-50 text-lg">
                  자세한 내용은 <span className="text-yellow-300 font-bold">Nova 공식 웹사이트</span>를 참조하세요
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold text-white mb-4">
              {currentText}
            </h3>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-semibold mb-1">
          {data.title || 'Nova X Pro'}
        </h2>
        {data.subtitle && (
          <p className="text-sm opacity-90">{data.subtitle}</p>
        )}
      </div>

      {/* PPT 슬라이드 영역 */}
      <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-6xl">
          {/* 16:9 비율 슬라이드 */}
          <div 
            className="relative w-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden border-4 border-white"
            style={{ aspectRatio: '16/9' }}
          >
            {/* 슬라이드 내용 */}
            <div className="absolute inset-0 p-8 md:p-12">
              {renderSlideContent()}
            </div>

            {/* 슬라이드 번호 */}
            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
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
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>이전</span>
        </button>

        <div className="flex items-center space-x-2">
          {data.sections.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSection ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === navigation.totalSections - 1}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg transition-colors duration-200"
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PPTTemplate;
