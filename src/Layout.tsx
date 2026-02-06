import { Outlet } from "react-router-dom";

/**
 * 기본 레이아웃 - 각 페이지에서 자체 레이아웃 관리
 */
const Layout = () => {
  return <Outlet />;
};

export default Layout;
