import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';

const MainPage = () => {
    const { isLoggedIn, nickname, role, checkLogin } = useAuthStore();
    
    useEffect(() => {
        checkLogin();
    }, [checkLogin]);

    return(
        <div className="flex flex-col items-center justify-center h-full">
            <h1>{isLoggedIn ? `${role} ${nickname}님, 안녕하세요!` : '안녕하세요!'}</h1>
        </div>
    )
}

export default MainPage