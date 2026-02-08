import axios from '../libs/axios';
import type { MenteeListItem, MenteeResponse } from '../libs/types/mentee';

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
