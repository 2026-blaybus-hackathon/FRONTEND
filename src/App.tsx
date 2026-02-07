import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from './pages/signup/SignupPage';
import OAuthCallbackPage from './pages/signup/OAuthCallbackPage';
import OAuthSignupPage from './pages/signup/OAuthSignupPage';
import MainPage from './pages/MainPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 루트는 메인으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/main" replace />} />
          
          {/* 로그인 전 메인 페이지 (사이드바 없음) */}
          <Route path="/main" element={<MainPage />} />
          
          {/* 인증 페이지 (사이드바 없음) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />
          <Route path="/oauth2/signup" element={<OAuthSignupPage />} />
          
          {/* 로그인 후 페이지들 (사이드바 있음) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submission" element={<PlaceholderPage name="약점 솔루션" />} />
          <Route path="/report" element={<PlaceholderPage name="리포트" />} />
          <Route path="/review" element={<PlaceholderPage name="학습 보관함" />} />
          <Route path="/calendar" element={<PlaceholderPage name="일정 센터" />} />
          <Route path="/my-page" element={<PlaceholderPage name="마이 페이지" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
