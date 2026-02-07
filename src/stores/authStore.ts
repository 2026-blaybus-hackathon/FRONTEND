import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserRole } from "../libs/types/apiResponse";
import type { AuthStore } from "../libs/types/auth";

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    role: null,
    user: null,
    login: (accessToken, nickname, role) => {
        Cookies.set('access_token', accessToken);
        Cookies.set('nickname', nickname);
        Cookies.set('user_role', role);
        set({ isLoggedIn: true, nickname, role });
    },
    logout: () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('nickname');
        Cookies.remove('user_role');
        set({ isLoggedIn: false, nickname: "", role: null, user: null });
    },
    checkLogin: () => {
        const accessToken = Cookies.get('access_token');
        const nickname = Cookies.get('nickname');
        const role = (Cookies.get('user_role') as UserRole) || null;
        if (accessToken && nickname) {
            set({ isLoggedIn: true, nickname, role });
        } else {
            set({ isLoggedIn: false, nickname: "", role: null });
        }
    },
    setUser: (user) => {
        set({ user });
    }
}));

export default useAuthStore;
export { useAuthStore };
export type { User } from "../libs/types/auth";