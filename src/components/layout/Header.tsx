import React from 'react';
import { Globe, Presentation as PresentationIcon, BookOpen as ManualIcon, Home } from 'lucide-react';
import { ContentType, ContentTypeOption } from '../../types';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentContentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  currentSection: number;
  totalSections: number;
}

const Header: React.FC<HeaderProps> = ({
  currentContentType,
  onContentTypeChange,
  currentSection,
  totalSections,
}) => {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate('/');
  };
  const contentTypes: ContentTypeOption[] = [
    { id: 'ppt', label: 'PPT', icon: PresentationIcon },
    { id: 'manual', label: '설명서', icon: ManualIcon },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex justify-between items-center h-16">
           {/* 홈 버튼 (왼쪽) */}
           <div className="flex items-center">
             <button
               onClick={handleHomeClick}
               className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
             >
               <Home className="h-5 w-5" />
               <span className="hidden sm:inline text-sm font-bold">홈으로</span>
             </button>
           </div>

           {/* 로고 및 제목 (가운데) */}
           <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
             <Globe className="h-8 w-8 text-primary-600" />
             <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
               번역 연습 시스템
             </h1>
           </div>

           {/* 콘텐츠 타입 표시 (오른쪽) */}
           <div className="flex items-center space-x-2">
             <span className="text-sm font-medium text-gray-700 hidden sm:inline">
               타입:
             </span>
             <div className="flex bg-gray-100 rounded-lg p-1">
               {(() => {
                 const currentType = contentTypes.find(type => type.id === currentContentType);
                 if (!currentType) return null;
                 
                 const Icon = currentType.icon;
                 return (
                   <div className="flex items-center space-x-2 px-3 py-2 bg-white text-primary-600 shadow-sm rounded-md text-sm font-medium">
                     <Icon className="h-4 w-4" />
                     <span className="hidden sm:inline">{currentType.label}</span>
                   </div>
                 );
               })()}
             </div>
           </div>
         </div>


      </div>
    </header>
  );
};

export default Header;
