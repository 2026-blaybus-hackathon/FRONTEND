/** 멘티 목록 아이템 (UI/훅에서 사용) */
export interface MenteeListItem {
  id: number;
  name: string;
  subject: string;
  avatar: string;
}

/** GET /users/mentor/mentees API 응답 항목 */
export interface MenteeResponse {
  menteeId: number;
  name: string;
  subjects?: string[] | null;
}
