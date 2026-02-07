import { useState } from 'react';
import MenteeNav from './MenteeNav';
import '../../../styles/components/dashboard-layout.css';

interface MenteeDashboardLayoutProps {
  children: React.ReactNode;
}

const MenteeDashboardLayout = ({ children }: MenteeDashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* 모바일 햄버거 버튼 */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMobileMenu}
        aria-label="메뉴 열기"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* 사이드바 오버레이 (모바일) */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMobileMenu}
        />
      )}

      {/* 사이드바 */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <MenteeNav />
      </div>

      {/* 메인 컨텐츠 */}
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default MenteeDashboardLayout;
