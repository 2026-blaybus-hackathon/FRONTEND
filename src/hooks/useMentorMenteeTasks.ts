import { useQuery } from '@tanstack/react-query';
import {
  getMentorMenteeTasks,
  type GetMentorMenteeTasksParams,
} from '../api/mentor';
import type { MentorMenteeTasksResponse } from '../libs/types/mentor';

const QUERY_KEY_PREFIX = ['mentorMenteeTasks'] as const;

export interface UseMentorMenteeTasksOptions extends GetMentorMenteeTasksParams {
  /** false면 요청하지 않음 (멘티 미선택 시 등) */
  enabled?: boolean;
}

/**
 * 멘토용 특정 멘티 과제 목록 조회 훅.
 * GET /tasks/mentor/mentee/:menteeId?page=&size=
 */
export function useMentorMenteeTasks(
  menteeId: number | null,
  options: UseMentorMenteeTasksOptions = {}
): {
  data: MentorMenteeTasksResponse | undefined;
  tasks: MentorMenteeTasksResponse['tasks'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { page = 0, size = 20, enabled = true } = options;

  const effectiveEnabled = enabled && menteeId != null && menteeId > 0;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, menteeId, page, size],
    queryFn: () => getMentorMenteeTasks(menteeId!, { page, size }),
    enabled: effectiveEnabled,
  });

  return {
    data,
    tasks: data?.tasks,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
