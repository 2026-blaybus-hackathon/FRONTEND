import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";

/**
 * 모바일 전용 레이아웃: Header + main(Outlet) + TabBar
 */
const MobileLayout = ({ children }: { children: React.ReactNode }) => {


  return (
    <div className="layout-mobile">
      {children}
      <main className="layout-mobile__content">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};

export default MobileLayout;
