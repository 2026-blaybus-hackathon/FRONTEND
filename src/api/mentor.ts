import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';
import type { subjectTypes, imageTypes } from '../types';
import type {
  MentorMenteeTasksResponse,
  MentorTaskAssignmentRequest,
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
 * GET /tasks/mentees/:menteeId?page=0&size=20
 * 백엔드는 List<TaskWithFeedbackResponse>를 반환하므로, 첫 요소를 사용해 단일 객체 형태로 정규화합니다.
 */
export async function getMentorMenteeTasks(
  menteeId: number,
  params: GetMentorMenteeTasksParams = {}
): Promise<MentorMenteeTasksResponse> {
  const { page = 0, size = 20 } = params;
  const response = await axios.get<MentorMenteeTasksResponse | MentorMenteeTasksResponse[]>(
    `/tasks/mentees/${menteeId}`,
    { params: { page, size } }
  );
  const raw = response.data;
  // 백엔드가 배열로 반환하는 경우(멘토: 어제 과제 1건 등) 첫 요소 사용
  const single = Array.isArray(raw) ? raw[0] : raw;
  if (!single) {
    return { menteeId, tasks: { content: [], page: 0, size: 0, totalPages: 0, totalElements: 0 } };
  }
  return {
    menteeId: single.menteeId,
    tasks: single.tasks ?? { content: [], page: 0, size: 0, totalPages: 0, totalElements: 0 },
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

/**
 * 멘토 주/월간 리포트 생성.
 * POST /reports/mentor
 */
export async function createMentorReport(
  payload: MentorReportCreateRequest
): Promise<unknown> {
  const response = await axios.post('/reports/mentor', payload);
  return response.data;
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
  feedback: {
    feedbackId: number;
    content: string;
  } | null;
}

export interface MentorFeedbackMenteeDetail {
  tasks: MentorFeedbackTask[];
  totalFeedback: string | null;
}

export async function getMentorFeedbackMenteeList(): Promise<MentorFeedbackMenteeList> {
  const response = await axios.get<MentorFeedbackMenteeList>('/feedback/mentor/mentees');
  return response.data;
}

export async function getMentorFeedbackMenteeDetail(menteeId: number): Promise<MentorFeedbackMenteeDetail> {
  const response = await axios.get<MentorFeedbackMenteeDetail>(`/task/mentor/${menteeId}`);
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