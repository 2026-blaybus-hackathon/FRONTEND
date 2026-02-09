import axios from '../libs/axios';
import type { MentorMenteeTasksResponse } from '../libs/types/mentorTask';

export interface GetMentorMenteeTasksParams {
  page?: number;
  size?: number;
}


export async function getMentorMenteeTasks(
  menteeId: number,
  params: GetMentorMenteeTasksParams = {}
): Promise<MentorMenteeTasksResponse> {
  const { page = 0, size = 20 } = params;
  const response = await axios.get<MentorMenteeTasksResponse>(
    `/tasks/mentees/${menteeId}`,
    { params: { page, size } }
  );
  return response.data;
}
