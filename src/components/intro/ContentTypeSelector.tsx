import React from 'react';
import { Presentation, BookOpen } from 'lucide-react';
import { ContentType } from '../../types';

interface ContentTypeSelectorProps {
  selectedType: ContentType;
  onTypeSelect: (type: ContentType) => void;
}

const contentTypes = [
  {
    id: 'ppt' as ContentType,
    title: 'PPT 발표 자료',
    description: '프레젠테이션용 슬라이드 자료',
    icon: Presentation,
    features: ['제목 슬라이드', '기능 소개', '시장 분석', '제품 포트폴리오', '가격 정책'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'manual' as ContentType,
    title: '설명서/매뉴얼',
    description: '상세한 사용법과 가이드 문서',
    icon: BookOpen,
    features: ['개요 및 목적', '단계별 가이드', '주의사항', '문제해결', '자주 묻는 질문'],
    color: 'from-green-500 to-teal-600'
  }
];

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  selectedType,
  onTypeSelect
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          콘텐츠 타입을 선택하세요
        </h2>
        <p className="text-gray-600">
          번역 연습에 사용할 콘텐츠의 형태를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={`
                relative p-8 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* 선택 표시 */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}

              {/* 아이콘 */}
              <div className={`
                w-16 h-16 rounded-lg flex items-center justify-center mb-6
                bg-gradient-to-br ${type.color}
              `}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* 제목과 설명 */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {type.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {type.description}
              </p>

              {/* 특징 목록 */}
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-500 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
