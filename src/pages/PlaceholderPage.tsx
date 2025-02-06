import DashboardLayout from '../components/feature/layout/DashboardLayout';

/**
 * Nav/TabBar 링크용 플레이스홀더. 실제 페이지로 교체하면 됩니다.
 */
const PlaceholderPage = ({ name }: { name: string }) => (
  <DashboardLayout>
    <div className="dashboard-container">
      <div style={{ 
        padding: '80px 24px', 
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '18px',
        fontWeight: 500
      }}>
        {name} 페이지 (준비 중)
      </div>
    </div>
  </DashboardLayout>
);

export default PlaceholderPage;
