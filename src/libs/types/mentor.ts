/** 과제 이미지 */
export interface MentorTaskImage {
  url: string;
  name: string;
  sequence: number;
}

/** 과제 피드백 */
export interface MentorTaskFeedback {
  feedbackId: number;
  summary: string;
  comment: string;
}

/** 멘토-멘티 과제 목록 항목 */
export interface MentorTaskItem {
  taskId: number;
  title: string;
  images: MentorTaskImage[];
  feedback: MentorTaskFeedback;
}

/** 페이지네이션된 과제 목록 */
export interface MentorTaskPage {
  content: MentorTaskItem[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

/** GET /tasks/mentor/mentee/:menteeId 응답 */
export interface MentorMenteeTasksResponse {
  menteeId: number;
  tasks: MentorTaskPage;
}
