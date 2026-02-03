import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Header from "./Header";

/**
 * 데스크톱 전용 레이아웃: Nav + Header + main(Outlet)
 */
const DesktopLayout = () => {
  return (
    <div className="layout-desktop">
      <Nav />
      <div className="layout-desktop__main">
        <Header />
        <main className="layout-desktop__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
