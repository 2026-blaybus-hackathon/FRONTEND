import { Outlet } from "react-router-dom";
import Header from "./Header";
import TabBar from "./TabBar";

/**
 * 모바일 전용 레이아웃: Header + main(Outlet) + TabBar
 */
const MobileLayout = () => {
  return (
    <div className="layout-mobile">
      <Header />
      <main className="layout-mobile__content">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};

export default MobileLayout;
