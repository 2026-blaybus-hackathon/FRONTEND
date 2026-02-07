
export type UserRole = "MENTOR" | "MENTEE";


export interface User {
  email: string;
  name: string;
  nickname: string;
  role: UserRole;
}


export interface UserCreateRequest {
  email: string;
  name: string;
  nickname: string;
  password: string;
  role: UserRole;
}
