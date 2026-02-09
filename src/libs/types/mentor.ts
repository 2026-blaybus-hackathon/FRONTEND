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
  subject?: string;
  taskType?: string;
  feedbackStatus?: 'PENDING' | 'COMPLETED';
  createdAt?: string;
  fileUrl?: string;
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

/** GET /tasks/:taskId 상세 조회 응답 (TaskWithFeedbackResponse, tasks.content는 1건) */
export interface TaskByIdResponse {
  menteeId: number;
  tasks: {
    content: TaskDetailItem[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  totalFeedback: string | null;
}

/** 할 일 상세 항목 (백엔드 TaskDetail) */
export interface TaskDetailItem {
  taskId: number;
  subject: string;
  title: string;
  time: number | null;
  date: string;
  status: boolean;
  menteeComment: string | null;
  feedbackStatus: string;
  images: { url: string; name: string; sequence: number }[];
  feedback: { feedbackId: number; content: string | null };
}

/** 과제 유형 (백엔드 TaskType) */
export type MentorTaskType = 'COLUMN' | 'WEAKNESS_SOLUTION';

/** POST /tasks/mentor/assignment 요청 (과제 정보 JSON, multipart request) */
export interface MentorTaskAssignmentRequest {
  menteeId: number;
  /** 자료실 ID. 있으면 자료실 내용을 복사해 할당, 없으면 직접 입력으로 일반 과제 할당 */
  materialId?: number | null;
  taskType: MentorTaskType;
  title: string;
  content?: string | null;
  subject: string;
  date: string;
}

/** POST /tasks/mentor/assignment 200 응답 */
export interface TaskAssignmentResponse {
  id: number;
  taskType: string;
  title: string;
  content: string;
  subject: string;
  studyDurationInMinutes: number;
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
