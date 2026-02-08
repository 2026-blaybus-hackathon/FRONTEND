import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';
import type { MentorMenteeTasksResponse } from '../libs/types/mentor';

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
