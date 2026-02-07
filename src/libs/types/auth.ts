import type { UserRole } from './apiResponse';

export interface User {
    name: string;
    school?: string;
    dDay?: string;
}

export interface AuthStore {
    isLoggedIn: boolean;
    nickname: string;
    role: UserRole | null;
    user: User | null;
    login: (accessToken: string, nickname: string, role: UserRole) => void;
    logout: () => void;
    checkLogin: () => void;
    setUser: (user: User) => void;
}
