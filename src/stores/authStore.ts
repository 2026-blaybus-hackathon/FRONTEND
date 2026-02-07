// 쿠키: access_token. localStorage: login_profile
import { create } from "zustand";
import Cookies from "js-cookie";
import type { UserRole } from "../libs/types/apiResponse";
import type { LoginProfile } from "../libs/types/apiResponse";
import type { AuthStore, User } from "../libs/types/auth";

const ACCESS_TOKEN_KEY = 'access_token';
const LOGIN_PROFILE_KEY = 'login_profile';
const COOKIE_OPTIONS = { expires: 7, path: '/', sameSite: 'Lax' as const };

function getStoredProfile(): LoginProfile | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(LOGIN_PROFILE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as LoginProfile;
    } catch {
        localStorage.removeItem(LOGIN_PROFILE_KEY);
        return null;
    }
}

function setStoredProfile(profile: LoginProfile): void {
    try {
        localStorage.setItem(LOGIN_PROFILE_KEY, JSON.stringify(profile));
    } catch {
        localStorage.removeItem(LOGIN_PROFILE_KEY);
    }
}

function buildUserFromProfile(profile: LoginProfile): User | null {
    const name = profile.name ?? profile.nickname;
    if (!name) return null;
    const dDay = profile.targetDate != null && profile.targetDate >= 0
        ? `D-${profile.targetDate}`
        : undefined;
    return {
        name,
        school: profile.schoolName ?? undefined,
        dDay,
        targetSchool: profile.targetSchool ?? undefined,
    };
}

function applyProfileToState(profile: LoginProfile | null) {
    const role = (profile?.role ?? 'MENTEE') as UserRole;
    const nickname = profile?.nickname ?? profile?.name ?? '';
    const user = profile ? buildUserFromProfile(profile) : null;
    return { nickname, role, user };
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    nickname: "",
    role: null,
    user: null,
    login: (accessToken, profile) => {
        Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS);
        setStoredProfile(profile);
        const { nickname, role, user } = applyProfileToState(profile);
        set({ isLoggedIn: true, nickname, role, user });
    },
    logout: () => {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove('refresh_token');
        localStorage.removeItem(LOGIN_PROFILE_KEY);
        set({ isLoggedIn: false, nickname: "", role: null, user: null });
    },
    checkLogin: () => {
        const accessToken = Cookies.get(ACCESS_TOKEN_KEY);
        const profile = getStoredProfile();
        if (accessToken) {
            const { nickname, role, user } = applyProfileToState(profile);
            set({ isLoggedIn: true, nickname, role, user });
        } else {
            localStorage.removeItem(LOGIN_PROFILE_KEY);
            set({ isLoggedIn: false, nickname: "", role: null, user: null });
        }
    },
    setUser: (user) => {
        set({ user });
        const profile = getStoredProfile();
        if (profile && user) {
            const updated: LoginProfile = {
                ...profile,
                name: user.name,
                schoolName: user.school,
                targetSchool: user.targetSchool,
                targetDate: user.dDay ? parseInt(user.dDay.replace('D-', ''), 10) : undefined,
            };
            setStoredProfile(updated);
        }
    }
}));

if (typeof window !== 'undefined') useAuthStore.getState().checkLogin();

export default useAuthStore;
export { useAuthStore };
export type { User } from "../libs/types/auth";