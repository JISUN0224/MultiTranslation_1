import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { ContentProvider } from './contexts/ContentContext';

// Pages
import IntroPage from './pages/IntroPage';
import PracticePage from './pages/PracticePage';
import TestPage from './pages/TestPage';
import PPTDirectTestPage from './pages/PPTDirectTestPage';

const App: React.FC = () => {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/ppt-direct-test" element={<PPTDirectTestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
};

export default App;
