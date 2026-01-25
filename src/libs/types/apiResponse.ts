export type OAuthLoginResponse = OAuthLogin200Response | OAuthLogin303Response;

interface OAuthLogin200Response {
    accessToken: string;
    nickname: string;
}

interface OAuthLogin303Response {
    accessToken: string;
}

export interface LoginResponse {
    accessToken: string;
    nickname: string;
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