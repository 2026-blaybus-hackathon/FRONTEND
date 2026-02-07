import DashboardLayout from '../components/feature/layout/DashboardLayout';
import '../styles/pages/placeholder.css';

/**
 * Nav/TabBar 링크용 플레이스홀더. 실제 페이지로 교체하면 됩니다.
 */
const PlaceholderPage = ({ name }: { name: string }) => (
  <DashboardLayout>
    <div className="placeholder-page">
      <div className="placeholder-content">
        <svg className="placeholder-icon" width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="20" y="30" width="80" height="60" rx="8" stroke="#D1D5DB" strokeWidth="3"/>
          <circle cx="40" cy="50" r="8" fill="#E5E7EB"/>
          <line x1="55" y1="50" x2="90" y2="50" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round"/>
          <line x1="30" y1="70" x2="90" y2="70" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <h2 className="placeholder-title">{name}</h2>
        <p className="placeholder-description">이 페이지는 현재 준비 중입니다.</p>
      </div>
    </div>
  </DashboardLayout>
);

export default PlaceholderPage;
