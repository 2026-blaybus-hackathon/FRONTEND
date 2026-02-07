import { useEffect, useMemo, useState } from "react";
// import useAuthStore from "../../../stores/authStore";
// import DesktopLayout from "./DesktopLayout";
import MenteeNav from "./MenteeNav";
import MentorNav from "./MentorNav";
// import MobileLayout from "./MobileLayout";
import { Outlet, useLocation } from "react-router-dom";
// import TabBar from "./TabBar";
import MobileHeader from "./MobileHeader";

const Layout = () => {
  // 테스트를 위해 pathname을 사용하고 있습니다.
  // const { role } = useAuthStore();
  const { pathname } = useLocation();

  // const Nav = useMemo(() => {
  //   if (role === "MENTEE") {
  //     return <MenteeNav />;
  //   }
  //   if (role === "MENTOR") {
  //     return <MentorNav />;
  //   }
  //   return null;
  // }, [role]); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* 1024px 미만에서 body 스크롤 제거 (콘텐츠 영역만 스크롤) */
  useEffect(() => {
    document.body.classList.add("layout-dashboard-body");
    return () => document.body.classList.remove("layout-dashboard-body");
  }, []);

  const Nav = useMemo(() => {
    if (pathname.startsWith("/mentee")) {
      return <MenteeNav isOpen={isMobileMenuOpen} />;
    } else if (pathname.startsWith("/mentor")) {
      return <MentorNav isOpen={isMobileMenuOpen} />;
    }
    return null;
  }, [pathname, isMobileMenuOpen]);
  
  return (
    <>
      <div className="layout-dashboard-root">
        <MobileHeader isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        <div className="layout-dashboard-wrap">
          {Nav}
          <div className="layout-main">
            <Outlet />
          </div>
        </div>
        {/* <TabBar /> */}
      </div>
    </>
  )
}

export default Layout;