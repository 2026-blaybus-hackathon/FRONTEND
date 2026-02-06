export type OAuthLoginResponse = OAuthLogin200Response | OAuthLogin303Response;

interface OAuthLogin200Response {
    accessToken: string;
    nickname: string;
}

interface OAuthLogin303Response {
    accessToken: string;
}

import type { UserRole } from "./user";

export interface LoginResponse {
    accessToken: string;
    nickname: string;
    role: UserRole;
    name?: string;
    email?: string;
}

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