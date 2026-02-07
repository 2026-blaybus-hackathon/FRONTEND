import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import '../../../styles/components/sidebar.css';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();
  const displayName = user?.name || nickname || '';
  const isMentor = role === 'MENTOR';
  const dashboardPath = isMentor ? '/mentor-dashboard' : '/mentee-dashboard';
  const dashboardLabel = isMentor ? '멘티 목록' : '오늘의 학습';
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* 로고 */}
      <div className="sidebar-logo">
        <div className="logo-icon">📖</div>
        <span className="logo-text">SeolStudy</span>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">{displayName?.[0] || '-'}</div>
        <div className="profile-info">
          <div className="profile-name">{displayName || '-'}</div>
          <div className="profile-school">{user?.school || '학교를 설정해주세요'}</div>
          <div className="profile-date">{user?.dDay ? `${user.dDay} 남았습니다` : 'D-day를 설정해주세요'}</div>
        </div>
      </div>

      {/* 학습 관리 메뉴 */}
      <div className="sidebar-section">
        <div className="section-title">학습 관리</div>
        <nav className="sidebar-nav">
          <Link 
            to={dashboardPath} 
            className={`nav-item ${isActive('/mentee-dashboard') || isActive('/mentor-dashboard') || isActive('/dashboard') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="8" y1="8" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="nav-text">{dashboardLabel}</span>
          </Link>
          <Link 
            to="/submission" 
            className={`nav-item ${isActive('/submission') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 6v5c0 4 7 7 7 7s7-3 7-7V6l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span className="nav-text">약점 솔루션</span>
          </Link>
          <Link 
            to="/report" 
            className={`nav-item ${isActive('/report') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="2" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">리포트</span>
          </Link>
          <Link 
            to="/review" 
            className={`nav-item ${isActive('/review') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 7h14" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="6" y="2" width="8" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="nav-text">학습 보관함</span>
          </Link>
        </nav>
      </div>

      {/* 내 관리 메뉴 */}
      <div className="sidebar-section">
        <div className="section-title">내 관리</div>
        <nav className="sidebar-nav">
          <Link 
            to="/calendar" 
            className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="2" x2="7" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="13" y1="2" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">일정 센터</span>
          </Link>
          <Link 
            to="/my-page" 
            className={`nav-item ${isActive('/my-page') ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">마이 페이지</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
