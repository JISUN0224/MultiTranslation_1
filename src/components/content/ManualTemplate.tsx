import React from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { TemplateProps, NavigationProps } from '../../types';

interface ManualTemplateProps extends TemplateProps {
  navigation: NavigationProps;
}

const ManualTemplate: React.FC<ManualTemplateProps> = ({ data, currentSection, navigation }) => {
  const currentText = data.sections[currentSection];
  
  // 섹션별 제목 매핑
  const sectionTitles = [
    '구성품 확인',
    '설치 방법',
    '기본 사용법',
    '주의사항'
  ];

  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0: return '📦';
      case 1: return '🔧';
      case 2: return '⚡';
      case 3: return '⚠️';
      default: return '📄';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-sm text-gray-600">{data.subtitle}</p>
        )}
      </div>

      {/* 매뉴얼 영역 */}
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="w-full max-w-3xl mx-auto">
          {/* 문서 형태 레이아웃 */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm min-h-full">
            {/* 문서 헤더 */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getSectionIcon(currentSection)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {sectionTitles[currentSection] || `섹션 ${currentSection + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    단계 {currentSection + 1} / {data.sections.length}
                  </p>
                </div>
              </div>
            </div>

            {/* 문서 내용 */}
            <div className="p-6 space-y-4">
              {/* 단계 번호 */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                  {currentSection + 1}
                </div>
                <h4 className="text-lg font-medium text-gray-900">
                  {sectionTitles[currentSection]}
                </h4>
              </div>

              {/* 메인 텍스트 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">
                  {currentText}
                </p>
              </div>

              {/* 주의사항 박스 (마지막 섹션에서만 표시) */}
              {currentSection === data.sections.length - 1 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">중요한 안전 수칙</h5>
                      <p className="text-yellow-700 text-sm">
                        제품을 안전하게 사용하기 위해 위의 주의사항을 반드시 준수해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 체크리스트 (첫 번째 섹션에서만 표시) */}
              {currentSection === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-3 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>확인 체크리스트</span>
                  </h5>
                  <div className="space-y-2">
                    {['본체', '전원 어댑터', '필터', '리모컨', '사용설명서'].map((item, index) => (
                      <label key={index} className="flex items-center space-x-2 text-sm text-green-700">
                        <input type="checkbox" className="rounded border-green-300 text-green-600 focus:ring-green-500" />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 문서 하단 */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">
                {data.title} - {sectionTitles[currentSection]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="p-6 border-t border-gray-200 flex items-center justify-between">
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
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
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

export default ManualTemplate;
