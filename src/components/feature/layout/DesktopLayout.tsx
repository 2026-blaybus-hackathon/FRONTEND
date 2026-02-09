import { Outlet } from "react-router-dom";

/**
 * 데스크톱 전용 레이아웃: Nav + Header + main(Outlet)
 */
const DesktopLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="layout-desktop">
      {children}
      <div className="layout-desktop__main">
        <main className="layout-desktop__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DesktopLayout;
