import { Link } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";

const Header = () => {
    const { isLoggedIn, logout } = useAuthStore();

    const classes = "decoration-solid text-white font-black px-4 py-2.5"

    return (
        <div className="h-20 bg-gray-5 text-white flex justify-between items-center px-10">
            <h1>Logo</h1>
            {
                isLoggedIn ?
                <button onClick={logout} className={classes}>로그아웃</button>
                :
                <Link to="/login" className={classes}>로그인</Link>
            }
        </div>
    )
}

export default Header;