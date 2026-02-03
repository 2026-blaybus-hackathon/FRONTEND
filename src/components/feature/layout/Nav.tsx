import { NavLink } from "react-router-dom";
import { Home, Calendar, FileText, User } from "lucide-react";

const navItems = [
  { to: "/", label: "홈", icon: Home },
  { to: "/planner", label: "플래너", icon: Calendar },
  { to: "/report", label: "리포트", icon: FileText },
  { to: "/my", label: "마이", icon: User },
];

const Nav = () => {
  return (
    <nav className="layout-nav">
      <div className="layout-nav__top">
        <div className="layout-nav__brand">
          <span className="layout-nav__brand-name">Seolstudy</span>
          <span className="layout-nav__brand-sub">학습 코칭 플랫폼</span>
        </div>
      </div>

      <ul className="layout-nav__menu">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `layout-nav__link ${isActive ? "layout-nav__link--active" : ""}`
              }
              end={to === "/"}
            >
              <span className="layout-nav__link-icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="layout-nav__user">
        <div className="layout-nav__avatar">홍</div>
        <div className="layout-nav__user-info">
          <span className="layout-nav__user-name">홍길동</span>
          <span className="layout-nav__user-meta">고2, 블브고등학교</span>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
