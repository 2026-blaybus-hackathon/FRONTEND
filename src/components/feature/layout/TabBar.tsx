import { NavLink } from "react-router-dom";
import { Home, Calendar, FileText, User } from "lucide-react";

const tabItems = [
  { to: "/", label: "홈", icon: Home },
  { to: "/planner", label: "플래너", icon: Calendar },
  { to: "/report", label: "리포트", icon: FileText },
  { to: "/my", label: "마이", icon: User },
];

const TabBar = () => {
  return (
    <nav className="layout-tabbar" role="tablist">
      {tabItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `layout-tabbar__item ${isActive ? "layout-tabbar__item--active" : ""}`
          }
          end={to === "/"}
          role="tab"
        >
          <Icon size={22} strokeWidth={2} />
          <span className="layout-tabbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default TabBar;
