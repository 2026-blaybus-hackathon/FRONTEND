import DesktopLayout from "./components/feature/layout/DesktopLayout";
import MobileLayout from "./components/feature/layout/MobileLayout";

/**
 * 721px 기준으로 데스크톱/모바일 레이아웃 분기 했습니다.
 * - 데스크톱: Nav + Header + main(Outlet)
 * - 모바일: Header + main(Outlet) + TabBar
 */
const Layout = () => {
  return (
    <>
      <div className="layout-desktop-wrapper">
        <DesktopLayout />
      </div>
      <div className="layout-mobile-wrapper">
        <MobileLayout />
      </div>
    </>
  );
};

export default Layout;
