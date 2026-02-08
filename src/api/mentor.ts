import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';
import type {
  MentorMenteeTasksResponse,
  MentorTaskAssignmentRequest,
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
