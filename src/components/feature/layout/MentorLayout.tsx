import { Outlet } from "react-router-dom";
import { SessionProvider, SessionGuard } from "../../../providers/SessionGuard";

const MentorLayout = () => {
    return (
        <SessionProvider>
            <SessionGuard role="MENTOR">
                <Outlet />
            </SessionGuard>
        </SessionProvider>
    );
}

export default MentorLayout;