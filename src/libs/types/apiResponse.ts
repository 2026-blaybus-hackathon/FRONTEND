export type OAuthLoginResponse = OAuthLogin200Response | OAuthLogin303Response;

interface OAuthLogin200Response {
    accessToken: string;
    nickname: string;
}

interface OAuthLogin303Response {
    accessToken: string;
}

export type UserRole = 'MENTOR' | 'MENTEE';

export interface LoginResponse {
    accessToken: string;
    nickname: string;
    role?: UserRole;
    name?: string;
    email?: string;
    schoolName?: string;
    grade?: string | null;
    targetSchool?: string | null;
    targetDate?: number | null;
}

/** 로그인 응답에서 accessToken 제외한 프로필 (localStorage 저장용) */
export type LoginProfile = Omit<LoginResponse, 'accessToken'>;

export interface OAuthSignupResponse {
    accessToken: string;
    nickname: string;
}

export interface VerifyCodeResponse {
    emailVerifyToken: string;
}

export interface ValidateNicknameResponse {
    available: boolean;
}