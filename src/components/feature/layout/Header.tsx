import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import useAuthStore from "../../../stores/authStore";
import type { UserRole } from "../../../libs/types/apiResponse";

const ROLE_LABEL: Record<UserRole, string> = {
  MENTOR: "멘토",
  MENTEE: "멘티",
};

const Header = () => {
  const { isLoggedIn, logout, user, nickname, role } = useAuthStore();
  const roleLabel = role ? ROLE_LABEL[role] : null;
  const displayName = (user?.name || nickname) || '';

  return (
    <header className="layout-header">
      <div className="layout-header__left">
        <span className="layout-header__pill">{user?.dDay || 'D-120'}</span>
        <span className="layout-header__title">
          {isLoggedIn && displayName
            ? `${roleLabel ? `[${roleLabel}] ` : ""}${displayName}`
            : "로그인해 주세요"}
        </span>
      </div>

      <div className="layout-header__right">
        {isLoggedIn ? (
          <>
            <button
              type="button"
              className="layout-header__icon-btn"
              aria-label="알림"
            >
              <Bell size={22} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={logout}
              className="layout-header__logout"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" className="layout-header__login">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
