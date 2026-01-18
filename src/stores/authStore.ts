import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    login: (accessToken: string, nickname: string) => void;
    logout: () => void;
    checkLogin: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    login: (accessToken, nickname) => {
        Cookies.set('access_token', accessToken);
        Cookies.set('nickname', nickname);
        set({ isLoggedIn: true, nickname: nickname });
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('nickname');
        set({ isLoggedIn: false, nickname: "" });
    },
    checkLogin: () => {
        const accessToken = Cookies.get('access_token');
        const nickname = Cookies.get('nickname');
        if (accessToken && nickname) {
            set({ isLoggedIn: true, nickname: nickname });
        } else {
            set({ isLoggedIn: false, nickname: "" });
        }
    }
}));

export default useAuthStore;