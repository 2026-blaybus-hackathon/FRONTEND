import DashboardLayout from '../components/feature/layout/DashboardLayout';
import '../styles/pages/dashboard.css';

/**
 * Nav/TabBar 링크용 플레이스홀더. 실제 페이지로 교체하면 됩니다.
 */
const PlaceholderPage = ({ name }: { name: string }) => (
  <DashboardLayout>
    <div className="dashboard-container">
      <div className="placeholder-content">
        {name} 페이지 (준비 중)
      </div>
    </div>
  </DashboardLayout>
);

export default PlaceholderPage;
