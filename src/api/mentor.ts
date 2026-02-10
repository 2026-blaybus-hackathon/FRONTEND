import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';
import type { subjectTypes, imageTypes } from '../types';
import type {
  MentorMenteeTasksResponse,
  MentorTaskAssignmentRequest,
  MentorTaskItem,
  TaskAssignmentResponse,
  TaskByIdResponse,
  MenteeStatsResponse,
  MenteeStatsPeriod,
  MentorReportCreateRequest,
} from '../libs/types/mentor';

function toMenteeListItem(mentee: MenteeResponse): MenteeListItem {
  const name = mentee.name ?? '';
  return {
    id: mentee.menteeId,
    name,
    subject: Array.isArray(mentee.subjects) ? mentee.subjects.join('/') : (mentee.schoolName ?? ''),
    avatar: name[0] ?? '-',
    profileUrl: mentee.profileUrl ?? null,
  };
}

/**
 * 멘토용 멘티 목록 조회.
 * GET /users/mentor/mentees
 */
export async function getMenteeList(): Promise<MenteeListItem[]> {
  const response = await axios.get<MenteeResponse[]>('/users/mentor/mentees');

  return (response.data ?? []).map(toMenteeListItem);
}

/**
 * 멘티 이름 검색 (서버 사이드)
 * GET /users/mentor/mentees/search?name={name}
 */
export async function searchMentees(name: string): Promise<MenteeListItem[]> {
  const response = await axios.get<MenteeResponse[]>('/users/mentor/mentees/search', {
    params: { name },
  });
  return (response.data ?? []).map(toMenteeListItem);
}

export interface GetMentorMenteeTasksParams {
  page?: number;
  size?: number;
}

/**
 * 멘토용 특정 멘티 과제 목록 조회.
 * GET /api/v1/tasks/mentees?menteeId=62&page=0&size=20
 * 백엔드는 List<TaskWithFeedbackResponse>를 반환하므로, 배열 요소들의 tasks.content를 합쳐 단일 목록으로 정규화합니다.
 */
export async function getMentorMenteeTasks(
  menteeId: number,
  params: GetMentorMenteeTasksParams = {}
): Promise<MentorMenteeTasksResponse> {
  const { page = 0, size = 20 } = params;
  const response = await axios.get<MentorMenteeTasksResponse | MentorMenteeTasksResponse[]>(
    '/tasks/mentees',
    { params: { menteeId, page, size } }
  );
  const raw = response.data;
  if (!raw) {
    return { menteeId, tasks: { content: [], page: 0, size: 0, totalPages: 0, totalElements: 0 } };
  }
  const items = Array.isArray(raw) ? raw : [raw];
  const seen = new Set<number>();
  const content: MentorTaskItem[] = [];
  let totalElements = 0;
  for (const item of items) {
    const taskPage = item.tasks;
    if (!taskPage?.content) continue;
    totalElements = Math.max(totalElements, taskPage.totalElements ?? taskPage.content.length);
    for (const t of taskPage.content) {
      if (t.taskId != null && !seen.has(t.taskId)) {
        seen.add(t.taskId);
        content.push(normalizeMentorTaskItem(t));
      }
    }
  }
  return {
    menteeId: items[0]?.menteeId ?? menteeId,
    tasks: {
      content,
      page: 0,
      size: content.length,
      totalPages: content.length > 0 ? 1 : 0,
      totalElements: totalElements || content.length,
    },
  };
}

/** API 과제 항목 → MentorTaskItem (feedbackStatus NOTSUBMITTED → NOT_SUBMITTED 등) */
function normalizeMentorTaskItem(t: {
  taskId: number;
  title?: string;
  subject?: string;
  date?: string;
  time?: number | null;
  status?: boolean;
  menteeComment?: string | null;
  feedbackStatus?: string;
  images?: { url?: string; name?: string; sequence?: number }[];
  feedback?: { feedbackId?: number; content?: string | null };
}): MentorTaskItem {
  const feedbackStatus = t.feedbackStatus === 'NOTSUBMITTED' ? 'NOT_SUBMITTED' : (t.feedbackStatus as MentorTaskItem['feedbackStatus']);
  return {
    taskId: t.taskId,
    title: t.title ?? '',
    subject: t.subject,
    images: Array.isArray(t.images) ? t.images.map((img) => ({ url: img.url ?? '', name: img.name ?? '', sequence: img.sequence ?? 0 })) : [],
    feedback: {
      feedbackId: t.feedback?.feedbackId ?? 0,
      summary: t.feedback?.content ?? '',
      comment: t.feedback?.content ?? '',
    },
    feedbackStatus: feedbackStatus ?? 'NOT_SUBMITTED',
  };
}

/**
 * 할 일 ID로 상세 조회.
 * GET /tasks/:taskId
 */
export async function getTaskById(taskId: number): Promise<TaskByIdResponse> {
  const response = await axios.get<TaskByIdResponse>(`/tasks/${taskId}`);
  return response.data;
}

export interface GetMenteeStatsParams {
  date: string; // YYYY-MM-DD
  period: MenteeStatsPeriod;
}

/**
 * 멘티 주/월간 과제 달성률 및 총 공부 시간 조회.
 * GET /users/mentor/mentees/:menteeId/stats?date=YYYY-MM-DD&period=WEEK|MONTH
 */
export async function getMenteeStats(
  menteeId: number,
  params: GetMenteeStatsParams
): Promise<MenteeStatsResponse> {
  const response = await axios.get<MenteeStatsResponse>(
    `/users/mentor/mentees/${menteeId}/stats`,
    { params: { date: params.date, period: params.period } }
  );
  return response.data;
}

/** GET /reports/mentor/statistics 응답 항목 - 과목별 공부 시간·달성률 */
export interface MentorSubjectStatsItem {
  subject: string;
  studyMinutes: number;
  achievementRate: number;
}

/**
 * 멘티 과목별 통계 조회 (이번 주/이번 달).
 * GET /reports/mentor/statistics?menteeId=&period=WEEKLY|MONTHLY&reportDate=YYYY-MM-DD
 */
export async function getMentorSubjectStats(
  menteeId: number,
  params: { period: 'WEEKLY' | 'MONTHLY'; reportDate: string }
): Promise<MentorSubjectStatsItem[]> {
  const response = await axios.get<MentorSubjectStatsItem[]>('/reports/mentor/statistics', {
    params: { menteeId, period: params.period, reportDate: params.reportDate },
  });
  return response.data ?? [];
}

/**
 * 멘토 주/월간 리포트 생성.
 * POST /reports/mentor
 */
export async function createMentorReport(
  payload: MentorReportCreateRequest
): Promise<unknown> {
  try {
    const response = await axios.post('/reports/mentor', payload);
    return response.data;
  } catch (err: unknown) {
    const ax = err as { response?: { status?: number; data?: unknown }; message?: string };
    const body =
      ax.response?.data != null
        ? JSON.stringify(ax.response.data, null, 2)
        : '(응답 body 없음)';
    console.error('[createMentorReport] POST /reports/mentor 실패. 서버 응답 body:', body);
    console.error('[createMentorReport] status:', ax.response?.status, 'payload:', {
      menteeId: payload.menteeId,
      period: payload.period,
      reportDate: payload.reportDate,
    });
    throw err;
  }
}

/**
 * 멘티 과제, 피드백 조회 (보관함용)
 * GET /mentor/mentee/{menteeId}/task-feedback
 */
export interface MenteeTaskFeedbackResponse {
  tasks: Array<{
    taskId: number;
    title: string;
    subject: string;
    createdAt: string;
    feedbackStatus: 'PENDING' | 'COMPLETED';
    images: Array<{
      url: string;
      name: string;
      sequence: number;
    }>;
    feedback?: {
      feedbackId: number;
      summary: string;
      comment: string;
    };
  }>;
}

export async function getMenteeTaskFeedback(
  menteeId: number
): Promise<MenteeTaskFeedbackResponse> {
  const response = await axios.get<MenteeTaskFeedbackResponse>(
    `/mentor/mentee/${menteeId}/task-feedback`
  );
  return response.data;
}

/**
 * 멘티에게 과제 할당 (자료실 연동).
 * POST /tasks/mentor/assignment (multipart/form-data)
 * - request: 과제 할당 요청 정보 JSON (필수)
 * - file: 직접 파일 업로드 (materialId 없을 때 사용, 선택·복수 가능)
 */
export async function assignTask(
  payload: MentorTaskAssignmentRequest,
  files?: File[]
): Promise<TaskAssignmentResponse> {
  const formData = new FormData();
  const jsonString = JSON.stringify(payload);
  const jsonBlob = new Blob([jsonString], { type: 'application/json' });
  formData.append('request', jsonBlob);
  if (files?.length) {
    files.forEach((file) => formData.append('file', file));
  }

  const response = await axios.post<TaskAssignmentResponse>('/tasks/mentor/assignment', formData, {
    headers: {
      'Content-Type': false as unknown as string,
    },
  });
  return response.data;
}

/**
 * 멘토 피드백 페이지 용 조회 및 작성 API
 */

// 멘토 피드백 페이지 내 멘티 상태
export type MentorFeedbackMenteeStatus = "PENDING" | "COMPLETED";
// 멘토 피드백 페이지 내 과제 상태
export type MentorFeedbackTaskStatus = "PENDING" | "COMPLETED" | "NOT_SUBMITTED";

// 멘토 피드백 페이지 내 멘티 리스트
export interface MentorFeedbackMenteeListItem {
    id: number;
    name: string;
    profileUrl: string;
    schoolName: string;
    grade: string;
    status: MentorFeedbackMenteeStatus;
}

export type MentorFeedbackMenteeList = MentorFeedbackMenteeListItem[]

export interface MentorFeedbackTask {
  taskId: number;
  subject: subjectTypes.Subject;
  title: string;
  time: number;
  date: string;
  status: boolean;
  menteeComment: string;
  feedbackStatus: MentorFeedbackTaskStatus;
  images: imageTypes.Image[];
  feedback: string;
}

export interface MentorFeedbackMenteeDetail {
tasks: MentorFeedbackTask[];
totalFeedback: string;
}

export async function getMentorFeedbackMenteeList(): Promise<MentorFeedbackMenteeList> {
  const response = await axios.get<MentorFeedbackMenteeList>('/feedback/mentor/mentees');
  return response.data;
}

export async function getMentorFeedbackMenteeDetail(menteeId: number): Promise<MentorFeedbackMenteeDetail> {
  const response = await axios.get<MentorFeedbackMenteeDetail>(`/feedback/mentor/mentees/${menteeId}`);
  return response.data;
}

export interface WriteMentorTaskFeedbackPayload {
  content: string;
}

export interface WriteMentorTotalFeedbackPayload {
  menteeId: number;
  content: string;
}

// 피드백 작성
export async function writeMentorTaskFeedback(taskId: number, payload: WriteMentorTaskFeedbackPayload): Promise<void> {
  const response = await axios.post<void>(`/feedback/mentor/task/${taskId}`, payload);
  
  return response.data;
}

export async function writeMentorTotalFeedback(payload: WriteMentorTotalFeedbackPayload): Promise<void> {
  const response = await axios.post<void>(`/feedback/mentor/mentees/daily-planner/total-feedback`, payload);
  return response.data;
}