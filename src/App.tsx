import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from './pages/signup/SignupPage';
import MainPage from './pages/MainPage';
import MenteeDashboardPage from './pages/dashboard/MenteeDashboardPage';
import MentorDashboardPage from './pages/dashboard/MentorDashboardPage';
import ReviewPage from './pages/review/ReviewPage';
import ArchivePage from './pages/mentee/ArchivePage';
import PlaceholderPage from './static/PlaceholderPage';
import MyPage from './pages/MyPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MentorFeedbackPage from './pages/mentor/FeedbackPage';
import AssignmentManagementPage from './pages/mentor/AssignmentManagementPage';
import LearningMaterialPage from './pages/mentor/LearningMaterialPage';
import ColumnWritePage from './pages/mentor/ColumnWritePage';
import NotificationCenterPage from './pages/mentee/NotificationCenterPage';
import ReportPage from './pages/mentee/ReportPage';
import useAuthStore from './stores/authStore';
import Layout from './components/feature/layout/Layout';
import { NotificationToasts } from './components/common/toast/NotificationToasts';

const queryClient = new QueryClient()

function App() {
  const checkLogin = useAuthStore((state) => state.checkLogin)

  useEffect(() => {
    checkLogin()
  }, [checkLogin])

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationToasts />
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
            <Route path="report" element={<ReportPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="notification" element={<NotificationCenterPage />} />
            <Route path="my-page" element={<MyPage />} />
          </Route>

          {/* 멘토 페이지 */}
          <Route path="/mentor" element={<Layout />} >
            <Route index element={<Navigate to="mentee" replace />} />
            <Route path="mentee" element={<MentorDashboardPage />} />
            <Route path="feedback" element={<MentorFeedbackPage />} />
            <Route path="assignment" element={<AssignmentManagementPage />} />
            <Route path="material" element={<Outlet />}>
              <Route index element={<LearningMaterialPage />} />
              <Route path="column" element={<ColumnWritePage />} />
            </Route>
            <Route path="report" element={<PlaceholderPage name="주간 리포트" />} />
            <Route path="archive" element={<PlaceholderPage name="보관함" />} />
            <Route path="my-page" element={<MyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
