import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from './pages/signup/SignupPage';
import MainPage from './pages/MainPage';
import MenteeDashboardPage from './pages/dashboard/MenteeDashboardPage';
import ReviewPage from './pages/review/ReviewPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MentorFeedbackPage from './pages/mentor/FeedbackPage';
import useAuthStore from './stores/authStore';
import Layout from './components/feature/layout/Layout';

const queryClient = new QueryClient()

function App() {
  const checkLogin = useAuthStore((state) => state.checkLogin)

  useEffect(() => {
    checkLogin()
  }, [checkLogin])

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
          
          {/* 로그인 후 페이지들 (사이드바 있음) */}
          <Route path="/mentee" element={<Layout />} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MenteeDashboardPage />} />
            <Route path="solution" element={<PlaceholderPage name="약점 솔루션" />} />
            <Route path="report" element={<PlaceholderPage name="리포트" />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="notification" element={<PlaceholderPage name="알림 센터" />} />
            <Route path="my-page" element={<PlaceholderPage name="마이 페이지" />} />
          </Route>

          {/* 멘토 페이지 */}
          <Route path="/mentor" element={<Layout />} >
            <Route index element={<Navigate to="mentee" replace />} />
            <Route path="mentee" element={<PlaceholderPage name="멘티 관리" />} />
            <Route path="feedback" element={<MentorFeedbackPage />} />
            <Route path="assignment" element={<PlaceholderPage name="과제 관리" />} />
            <Route path="material" element={<PlaceholderPage name="학습 자료 관리" />} />
            <Route path="report" element={<PlaceholderPage name="리포트" />} />
            <Route path="archive" element={<PlaceholderPage name="보관함" />} />
            <Route path="my-page" element={<PlaceholderPage name="마이 페이지" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
