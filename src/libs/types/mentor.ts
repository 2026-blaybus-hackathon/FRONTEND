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

/** 과제 조회 응답에서 추출한 피드백 (과제 정보 포함) */
export interface MenteeFeedbackItem extends MentorTaskFeedback {
  taskId: number;
  taskTitle: string;
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

/** 과제 유형 (백엔드 TaskType) */
export type MentorTaskType = 'COLUMN' | 'WEAKNESS_SOLUTION';

/** POST /tasks/mentor/assignment 요청 (과제 정보 JSON) */
export interface MentorTaskAssignmentRequest {
  menteeId: number;
  taskType: MentorTaskType;
  title: string;
  content: string;
  subject: string;
  date: string;
}

/** 과제 제공 폼 상태 */
export interface AssignmentFormValues {
  taskType: MentorTaskType;
  title: string;
  content: string;
  subject: string;
  date: string;
}

/** 멘티 과제 상세 (학교·달성률, API 연동 시 교체) */
export interface MentorMenteeAssignmentDetail {
  school: string;
  achievementRate: number;
}

/** GET /users/mentor/mentees/:menteeId/stats 응답 */
export type MenteeStatsPeriod = 'WEEK' | 'MONTH';

export interface MenteeStatsResponse {
  achievementRate: {
    achievementRate: number;
  };
  weeklyStudyTimeMinutes: number;
}

/** POST /reports/mentor 요청 - 멘토 주/월간 리포트 생성 */
export type MentorReportPeriod = 'WEEKLY' | 'MONTHLY';

export interface MentorReportCreateRequest {
  menteeId: number;
  overallReview: string;
  period: MentorReportPeriod;
  keepContent: string;
  problemContent: string;
  tryContent: string;
  reportDate: string; // YYYY-MM-DD
}
