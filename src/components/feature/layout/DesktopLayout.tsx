import { Outlet } from "react-router-dom";
import MenteeNav from "./MenteeNav";
import { useAuthStore } from "../../../stores/authStore";
import MentorNav from "./MentorNav";
import { useMemo } from "react";
// import Header from "./Header";

/**
 * 데스크톱 전용 레이아웃: Nav + Header + main(Outlet)
 */
const DesktopLayout = () => {
  const { role } = useAuthStore();

  const Nav = useMemo(() => {
    if (role === "MENTEE") {
      return <MenteeNav />;
    }
    if (role === "MENTOR") {
      return <MentorNav />;
    }
    return null;
  }, [role]);
  return (
    <div className="layout-desktop">
      {Nav}
      <div className="layout-desktop__main">
        {/* <Header /> */}
        <main className="layout-desktop__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
