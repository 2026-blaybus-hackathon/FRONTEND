import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import '../styles/pages/my-page.css';

const menuItems = [
  { label: '프로필 설정', Icon: User, path: '#' },
  { label: '환경설정', Icon: Settings, path: '#' },
  { label: '도움말', Icon: HelpCircle, path: '#' },
];

const MyPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const displayName = user?.name || nickname || '사용자';
  const initial = displayName[0] || '?';
  const school = user?.school || '학교 정보 없음';
  const subjectLine = role === 'MENTOR' ? '담당 과목: 국어, 수학' : null;

  const handleLogout = () => {
    logout();
    navigate('/main');
  };

  return (
    <div className="my-page">
      <div className="my-page__profile card">
        <div className="my-page__avatar" aria-hidden>
          {initial}
        </div>
        <div className="my-page__profile-info">
          <h1 className="my-page__name">{displayName}</h1>
          <p className="my-page__meta">{school}</p>
          {subjectLine && <p className="my-page__sub">{subjectLine}</p>}
        </div>
      </div>

      {menuItems.map(({ label, Icon, path }) => (
        <button
          key={label}
          type="button"
          className="my-page__menu-card card"
          onClick={() => path !== '#' && navigate(path)}
          aria-label={label}
        >
          <Icon className="my-page__menu-icon" size={24} aria-hidden />
          <span className="my-page__menu-label">{label}</span>
        </button>
      ))}

      <button
        type="button"
        className="my-page__menu-card my-page__menu-card--logout card"
        onClick={handleLogout}
        aria-label="로그아웃"
      >
        <LogOut className="my-page__menu-icon" size={24} aria-hidden />
        <span className="my-page__menu-label">로그아웃</span>
      </button>
    </div>
  );
};

export default MyPage;
