import { Outlet } from "react-router-dom";
import Header from "./components/feature/layout/Header";

const Layout = () => {
    return (
        <div className="flex flex-col gap-10">
            <Header />
            <Outlet />
        </div>
    );
};

export default Layout;