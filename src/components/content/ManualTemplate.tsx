import React from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';
import { parseManualContent } from '../../utils/contentParser';

interface ManualTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const ManualTemplate: React.FC<ManualTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];
  const parsedContent = parseManualContent(currentText, currentSection);
  
  const sectionIcons = {
    overview: '📦',
    installation: '🔧',
    usage: '⚡',
    maintenance: '🛠️'
  };

  const sectionColors = {
    overview: 'from-blue-500 to-cyan-500',
    installation: 'from-green-500 to-emerald-500',
    usage: 'from-purple-500 to-violet-500',
    maintenance: 'from-orange-500 to-red-500'
  };

  const renderManualContent = () => {
    return (
      <>
        {/* 헤더 */}
        <div className={`bg-gradient-to-r ${sectionColors[parsedContent.sectionType]} text-white p-8`}>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-4xl">{sectionIcons[parsedContent.sectionType]}</span>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{parsedContent.title}</h1>
              <p className="text-lg opacity-90">{parsedContent.subtitle}</p>
            </div>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="p-8 space-y-6">
          {/* 단계별 가이드 */}
          {parsedContent.steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-6 p-6 bg-gray-50 rounded-2xl border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {idx + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                
                {/* 단계별 팁 */}
                {step.tip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-1">💡 유용한 팁</h5>
                        <p className="text-blue-700 text-sm">{step.tip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 경고사항 */}
                {step.warning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-yellow-800 mb-1">⚠️ 주의사항</h5>
                        <p className="text-yellow-700 text-sm">{step.warning}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 섹션별 특별 정보 */}
          {currentSection === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-green-800 mb-3">✅ 확인 체크리스트</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['본체', '전원 어댑터', '필터', '리모컨', '사용설명서', '보증서'].map((item, idx) => (
                      <label key={idx} className="flex items-center space-x-2 text-sm text-green-700 cursor-pointer hover:text-green-800">
                        <input type="checkbox" className="rounded border-green-300 text-green-600 focus:ring-green-500" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 설치 관련 추가 정보 */}
          {currentSection === 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-800 mb-3">💡 설치 관련 정보</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• 설치 공간: 벽에서 최소 30cm 이상 거리 확보</p>
                    <p>• 전원 요구사항: AC 220V, 50/60Hz</p>
                    <p>• 설치 온도: 5°C ~ 35°C</p>
                    <p>• 습도: 20% ~ 80% (결로 없을 것)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 사용법 관련 추가 정보 */}
          {currentSection === 2 && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-purple-800 mb-3">💡 효율적인 사용 팁</h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <p>• 자동 모드 활용으로 에너지 절약 효과</p>
                    <p>• 정기적인 설정 점검으로 최적 성능 유지</p>
                    <p>• 계절별 모드 조정으로 효율성 극대화</p>
                    <p>• 스마트 기능 활용으로 편리한 원격 제어</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 유지보수 관련 추가 정보 */}
          {currentSection === 3 && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-800 mb-3">⚠️ 안전 수칙</h4>
                    <div className="space-y-2 text-sm text-red-700">
                      <p>• 청소 시 반드시 전원을 끄고 플러그를 뽑으세요</p>
                      <p>• 물이나 화학 세제를 직접 뿌리지 마세요</p>
                      <p>• 내부 수리는 전문 업체에 맡기세요</p>
                      <p>• 이상 징후 발견 시 즉시 사용을 중단하세요</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-800 mb-3">💡 A/S 및 고객지원</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>• 구매일로부터 2년간 무상 A/S 제공</p>
                      <p>• 고객센터: 1588-0000 (평일 09:00-18:00)</p>
                      <p>• 온라인 지원: www.company.com/support</p>
                      <p>• 전국 서비스센터 운영 (당일 방문 가능)</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 추가 안전 수칙 */}
          {parsedContent.safetyNotes && parsedContent.safetyNotes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-800 mb-3">⚠️ 중요 안전 수칙</h4>
                  <div className="space-y-2">
                    {parsedContent.safetyNotes.map((note, idx) => (
                      <p key={idx} className="text-yellow-700 text-sm">• {note}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${sectionColors[parsedContent.sectionType]} text-white`}>
        <h2 className="text-lg font-semibold mb-1">{data.title}</h2>
        {data.subtitle && (
          <p className="text-sm opacity-90">{data.subtitle}</p>
        )}
      </div>

      {/* 매뉴얼 영역 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="w-full max-w-4xl mx-auto">
          {/* 매뉴얼 문서 */}
          <div className="bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden min-h-full">
            {renderManualContent()}
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
                  ? `bg-gradient-to-r ${sectionColors[parsedContent.sectionType]} shadow-lg` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={navigation.onNext}
          disabled={navigation.currentSection === navigation.totalSections - 1}
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${sectionColors[parsedContent.sectionType]} hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:transform hover:translateY(-1px) shadow-lg`}
        >
          <span>다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ManualTemplate;
