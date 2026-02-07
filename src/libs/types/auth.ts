import type { UserRole } from './apiResponse';
import type { LoginProfile } from './apiResponse';

export interface User {
    name: string;
    school?: string;
    dDay?: string;
    targetSchool?: string;
}

export interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    role: UserRole | null;
    user: User | null;
    login: (accessToken: string, profile: LoginProfile) => void;
    logout: () => void;
    checkLogin: () => void;
    setUser: (user: User) => void;
}
