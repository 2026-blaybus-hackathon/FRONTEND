import { Outlet } from "react-router-dom";
import { SessionProvider, SessionGuard } from "../../../providers/SessionGuard";

const MenteeLayout = () => {
    return (
        <SessionProvider>
            <SessionGuard role="MENTEE">
                <Outlet />
            </SessionGuard>
        </SessionProvider>
    );
}

export default MenteeLayout;