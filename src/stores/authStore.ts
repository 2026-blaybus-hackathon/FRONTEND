import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserRole } from "../libs/types/user";

interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    role: UserRole | null;
    login: (accessToken: string, nickname: string, role?: UserRole) => void;
    logout: () => void;
    checkLogin: () => void;
}

const ROLE_KEY = "user_role";

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    role: null,
    login: (accessToken, nickname, role = "MENTEE") => {
        Cookies.set("access_token", accessToken);
        Cookies.set("nickname", nickname);
        Cookies.set(ROLE_KEY, role);
        set({ isLoggedIn: true, nickname, role });
    },
    logout: () => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("nickname");
        Cookies.remove(ROLE_KEY);
        set({ isLoggedIn: false, nickname: "", role: null });
    },
    checkLogin: () => {
        const accessToken = Cookies.get("access_token");
        const nickname = Cookies.get("nickname");
        const role = Cookies.get(ROLE_KEY) as UserRole | undefined;
        if (accessToken && nickname && (role === "MENTOR" || role === "MENTEE")) {
            set({ isLoggedIn: true, nickname, role });
        } else {
            set({ isLoggedIn: false, nickname: "", role: null });
        }
    },
}));

export default useAuthStore;