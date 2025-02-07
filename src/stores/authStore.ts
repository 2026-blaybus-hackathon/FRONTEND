import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
    name: string;
    school?: string;
    dDay?: string;
}

interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    user: User | null;
    login: (accessToken: string, nickname: string) => void;
    logout: () => void;
    checkLogin: () => void;
    setUser: (user: User) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    user: null,
    login: (accessToken, nickname) => {
        Cookies.set('access_token', accessToken);
        Cookies.set('nickname', nickname);
        set({ isLoggedIn: true, nickname: nickname });
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('nickname');
        set({ isLoggedIn: false, nickname: "", user: null });
    },
    checkLogin: () => {
        const accessToken = Cookies.get('access_token');
        const nickname = Cookies.get('nickname');
        if (accessToken && nickname) {
            set({ isLoggedIn: true, nickname: nickname });
        } else {
            set({ isLoggedIn: false, nickname: "" });
        }
    },
    setUser: (user) => {
        set({ user });
    }
}));

export default useAuthStore;
export { useAuthStore };
export type { User };