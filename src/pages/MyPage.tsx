import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import useAuthStore from "../stores/authStore";
import "../styles/pages/mypage.css";

const MyPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, nickname, role, checkLogin, logout } = useAuthStore();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const avatarInitial = nickname ? nickname.slice(0, 1).toUpperCase() : "?";

  const menuItems = [
    { icon: User, label: "프로필 설정", onClick: () => {} },
    { icon: Settings, label: "환경설정", onClick: () => {} },
    { icon: HelpCircle, label: "도움말", onClick: () => {} },
    {
      icon: LogOut,
      label: "로그아웃",
      onClick: () => {
        logout();
        navigate("/");
      },
      isDanger: true,
    },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="mypage">
      <h1 className="mypage__title">마이페이지</h1>

      <section className="mypage__profile-card">
        <div className="mypage__avatar" aria-hidden>
          {avatarInitial}
        </div>
        <div className="mypage__profile-info">
          <p className="mypage__profile-name">{nickname}</p>
          <p className="mypage__profile-meta">고2, 블브고등학교</p>
          <p className="mypage__profile-subjects">담당 과목: 국어, 수학</p>
        </div>
      </section>

      <ul className="mypage__menu" role="menu">
        {menuItems.map(({ icon: Icon, label, onClick, isDanger }) => (
          <li key={label} role="none">
            <button
              type="button"
              className={`mypage__menu-item ${isDanger ? "mypage__menu-item--danger" : ""}`}
              onClick={onClick}
              role="menuitem"
            >
              <span className="mypage__menu-icon" aria-hidden>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;
