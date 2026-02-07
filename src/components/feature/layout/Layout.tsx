import { useEffect, useMemo, useState } from "react";
// import useAuthStore from "../../../stores/authStore";
// import DesktopLayout from "./DesktopLayout";
import MenteeNav from "./MenteeNav";
import MentorNav from "./MentorNav";
// import MobileLayout from "./MobileLayout";
import { Outlet, useLocation } from "react-router-dom";
import Menu from "../../../icons/Menu";
import openedBook from "../../../assets/opened-book.svg";
// import TabBar from "./TabBar";

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

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
        <div className="layout-dashboard-header w-100vw lg:hidden">
          <div className="flex justify-between items-center px-400 py-200">
            <div className="layout-nav__brand">
              <img src={openedBook} alt="Seolstudy" />
              <span className="layout-nav__brand-name heading-3">Seolstudy</span>
            </div>
            <MobileMenuToggle onClick={toggleMobileMenu} />
          </div>
        </div>

        {/* 사이드바 오버레이 (모바일) */}
        {isMobileMenuOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleMobileMenu}
          />
        )}

        <div className="layout-dashboard-wrap">
          {Nav}
          <div className="layout-main bg-primary-50 px-20 py-14">
            <Outlet />
          </div>
        </div>
        {/* <TabBar /> */}
      </div>
    </>
  )
}

const MobileMenuToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <button 
      className="hamburger-btn"
      onClick={onClick}
      aria-label="메뉴 열기"
    >
      <Menu />
    </button>
  );
};


export default Layout;