import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';
import type {
  MentorMenteeTasksResponse,
  MentorTaskAssignmentRequest,
  MenteeStatsResponse,
  MenteeStatsPeriod,
  MentorReportCreateRequest,
} from '../libs/types/mentor';

function toMenteeListItem(mentee: MenteeResponse): MenteeListItem {
  const name = mentee.name ?? '';
  return {
    id: mentee.menteeId,
    name,
    subject: Array.isArray(mentee.subjects) ? mentee.subjects.join('/') : '',
    avatar: name[0] ?? '-',
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
 * GET /tasks/mentor/mentee/:menteeId?page=0&size=20
 */
export async function getMentorMenteeTasks(
  menteeId: number,
  params: GetMentorMenteeTasksParams = {}
): Promise<MentorMenteeTasksResponse> {
  const { page = 0, size = 20 } = params;
  const response = await axios.get<MentorMenteeTasksResponse>(
    `/tasks/mentor/mentee/${menteeId}`,
    { params: { page, size } }
  );
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
 * 멘티에게 과제 할당 (PDF 포함).
 * POST /tasks/mentor/assignment
 * - request: 과제 정보 JSON (필수)
 * - file: 학습 자료 PDF (선택, 복수 가능)
 */
export async function assignTask(
  payload: MentorTaskAssignmentRequest,
  files?: File[]
): Promise<unknown> {
  console.log('[assignTask] payload:', payload);
  console.log('[assignTask] files:', files?.length ?? 0, files?.map((f) => f.name));

  const formData = new FormData();
  const jsonString = JSON.stringify(payload);
  const jsonFile = new File([jsonString], 'request.json', {
    type: 'application/json; charset=UTF-8',
  });
  formData.append('request', jsonFile);
  if (files?.length) {
    files.forEach((file) => formData.append('file', file));
  }

  try {
    const response = await axios.post('/tasks/mentor/assignment', formData, {
      headers: {
        'Content-Type': false as unknown as string,
      },
    });
    console.log('[assignTask] success', response.status, response.data);
    return response.data;
  } catch (err: unknown) {
    const ax = err as { response?: { status: number; data: unknown }; config?: { headers?: unknown } };
    console.log('[assignTask] error', ax.response?.status, ax.response?.data, 'headers:', ax.config?.headers);
    throw err;
  }
}
