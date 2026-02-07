import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

/**
 * 로그인된 사용자의 role에 따라 멘토/멘티 대시보드로 리다이렉트
 */
const DashboardRedirect = () => {
  const role = useAuthStore((state) => state.role);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const path = role === 'MENTOR' ? '/mentor-dashboard' : '/mentee-dashboard';
  return <Navigate to={path} replace />;
};

export default DashboardRedirect;
