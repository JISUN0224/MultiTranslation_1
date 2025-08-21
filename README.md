# AI 번역 연습 시스템

React + Vite + TypeScript + Tailwind CSS 기반의 AI 번역 연습 웹 애플리케이션입니다.

## 🎯 주요 기능

### 1. AI 콘텐츠 생성
- **다양한 콘텐츠 타입**: PPT, 브로슈어, 사용설명서
- **개인화된 설정**: 난이도, 언어, 스타일, 업계 선택
- **실시간 생성**: Gemini AI API를 통한 즉시 콘텐츠 생성

### 2. 번역 연습 시스템
- **동적 템플릿**: AI가 생성한 JSON 데이터를 파싱하여 템플릿에 동적 삽입
- **섹션별 연습**: 단계별 번역 연습 진행
- **실시간 피드백**: AI 기반 번역 품질 분석

### 3. AI 번역 분석
- **3가지 평가 기준**: 정확성, 자연스러움, 적합성
- **상세한 피드백**: 장점, 개선점, 구체적인 제안
- **참고 번역**: 전문가 수준의 모범 번역 제공

## 🚀 시작하기

### 1. 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env` 파일을 생성하고 Gemini API 키를 설정하세요:
```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── layout/          # 레이아웃 컴포넌트
│   ├── content/         # 콘텐츠 템플릿 (AI JSON 파싱)
│   ├── translation/     # 번역 관련 컴포넌트
│   └── intro/          # 인트로 페이지 컴포넌트
├── pages/              # 페이지 컴포넌트
├── services/           # AI 서비스 (Gemini API)
├── contexts/           # React Context
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🎨 사용법

### 1. 콘텐츠 생성
1. **콘텐츠 타입 선택**: PPT, 브로슈어, 사용설명서 중 선택
2. **주제 입력**: 번역 연습할 콘텐츠 주제 입력
3. **옵션 설정**: 난이도, 언어, 스타일, 업계 선택
4. **생성 시작**: "콘텐츠 생성하기" 버튼 클릭

### 2. 번역 연습
1. **콘텐츠 확인**: AI가 생성한 콘텐츠를 왼쪽에서 확인
2. **번역 입력**: 오른쪽 패널에서 번역 입력
3. **AI 분석**: "AI 분석" 버튼으로 번역 품질 평가
4. **피드백 확인**: 점수, 장점, 개선점, 참고 번역 확인

## 🔧 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **AI Service**: Google Gemini API
- **Icons**: Lucide React
- **State Management**: React Context API

## 🎯 주요 특징

### 반응형 디자인
- 데스크톱: 좌우 분할 레이아웃 (60% : 40%)
- 모바일: 상하 분할 레이아웃
- 모든 화면 크기에서 최적화된 사용자 경험

### AI 통합
- **콘텐츠 생성**: Gemini AI를 통한 전문적인 콘텐츠 생성
- **JSON 파싱**: AI 응답을 구조화된 데이터로 파싱
- **동적 템플릿**: 파싱된 데이터를 템플릿에 동적 삽입
- **에러 처리**: API 오류 시 대체 콘텐츠 제공

### 사용자 경험
- **로딩 상태**: 진행률 표시 및 예상 시간 안내
- **성공 피드백**: 애니메이션과 함께 완료 알림
- **에러 처리**: 친화적인 오류 메시지 및 해결 방법 제시

## 🔑 API 키 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. `.env` 파일에 키 설정:
   ```env
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. 애플리케이션 재시작

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
