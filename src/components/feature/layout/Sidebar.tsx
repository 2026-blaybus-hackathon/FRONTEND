import '../../../styles/components/sidebar.css';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="sidebar">
      {/* 로고 */}
      <div className="sidebar-logo">
        <div className="logo-icon">📖</div>
        <span className="logo-text">SeolStudy</span>
      </div>

      {/* 사용자 프로필 */}
      <div className="sidebar-profile">
        <div className="profile-avatar">홍</div>
        <div className="profile-info">
          <div className="profile-name">홍길동</div>
          <div className="profile-school">한국고등학교 2학년</div>
          <div className="profile-date">D-322 남았습니다</div>
        </div>
      </div>

      {/* 학습 관리 메뉴 */}
      <div className="sidebar-section">
        <div className="section-title">학습 관리</div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item active" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="8" y1="8" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="nav-text">오늘의 학습</span>
          </a>
          <a href="/submission" className="nav-item" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3 6v5c0 4 7 7 7 7s7-3 7-7V6l-7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span className="nav-text">약점 솔루션</span>
          </a>
          <a href="/report" className="nav-item" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="2" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">리포트</span>
          </a>
          <a href="/review" className="nav-item" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 7h14" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="6" y="2" width="8" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="nav-text">학습 보관함</span>
          </a>
        </nav>
      </div>

      {/* 내 관리 메뉴 */}
      <div className="sidebar-section">
        <div className="section-title">내 관리</div>
        <nav className="sidebar-nav">
          <a href="/calendar" className="nav-item" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="7" y1="2" x2="7" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="13" y1="2" x2="13" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">일정 센터</span>
          </a>
          <a href="/my-page" className="nav-item" onClick={onNavigate}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-text">마이 페이지</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
