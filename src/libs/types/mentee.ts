/** 멘티 목록 아이템 (UI/훅에서 사용) */
export interface MenteeListItem {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  profileUrl?: string | null;
}

/** GET /users/mentor/mentees API 응답 (MenteeProfileResponse) */
export interface MenteeResponse {
  menteeId: number;
  name: string;
  profileUrl?: string | null;
  schoolName?: string | null;
  grade?: string | null;
  targetSchool?: string | null;
  targetDate?: number | null;
  subjects?: string[] | null;
}

/** GET /api/v1/users/profile 응답 */
export interface MenteeProfileResponse {
  name: string;
  profileName: string | null;
  profileUrl: string | null;
  schoolName: string | null;
  grade: string | null;
  targetSchool: string | null;
  targetDate: number | null; // D-day
}

/** PUT /api/v1/users/profile 요청 */
export interface UpdateMenteeProfileRequest {
  name: string;
  schoolName: string | null;
  grade: MenteeGrade | null;
  targetSchool: string;
  targetDate: string; // YYYY-MM-DD
}

export type MenteeGrade = 'FIRST' | 'SECOND' | 'THIRD' | 'DROPOUT' | 'GRADUATED';
