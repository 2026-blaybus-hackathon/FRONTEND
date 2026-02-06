// import { NavLink } from "react-router-dom";
// import { Home, Calendar, FileText, User } from "lucide-react";
import openedBook from "../../../assets/opened-book.svg";

// const navItems = [
//   { to: "/", label: "홈", icon: Home },
//   { to: "/planner", label: "플래너", icon: Calendar },
//   { to: "/report", label: "리포트", icon: FileText },
//   { to: "/my", label: "마이", icon: User },
// ];

const Nav = ({ children }: { children?: React.ReactNode }) => {
  return (
    <nav className="layout-nav">
      <div className="layout-nav__top">
        <div className="layout-nav__brand">
          <img src={openedBook} alt="Seolstudy" />
          <span className="layout-nav__brand-name heading-3">Seolstudy</span>
        </div>
      </div>

      {children}

      {/* <ul className="layout-nav__menu">
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
      </ul> */}
    </nav>
  );
};

export default Nav;
