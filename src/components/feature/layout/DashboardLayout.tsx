import { useState, ReactNode } from 'react';
import Sidebar from './Sidebar';
import '../../../styles/components/dashboard-layout.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      
      {/* 모바일 사이드바 오버레이 */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="sidebar-mobile" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="dashboard-page">
        {/* 모바일 헤더 */}
        <div className="mobile-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="mobile-logo">📖 SeolStudy</span>
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
