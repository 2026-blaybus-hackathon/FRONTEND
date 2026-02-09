import { useQuery } from '@tanstack/react-query';
import { getMentorMenteeTasks } from '../api/mentor';
import type { MentorTaskItem } from '../libs/types/mentor';

const QUERY_KEY_PREFIX = ['recentMenteeTasks'] as const;

const RECENT_LIMIT = 2;

/**
 * 과제 관리 등에서 "최근 제공 과제" 2개만 조회하는 훅.
 * GET /tasks/mentor/mentee/:menteeId?page=0&size=2
 * 멘티 미선택(menteeId null/0)이면 요청하지 않음.
 */
export function useRecentMenteeTasks(menteeId: number | null): {
  recentTasks: MentorTaskItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, menteeId],
    queryFn: () => getMentorMenteeTasks(menteeId!, { page: 0, size: RECENT_LIMIT }),
    enabled: menteeId != null && menteeId > 0,
  });

  const recentTasks = data?.tasks?.content?.slice(0, RECENT_LIMIT) ?? [];

  return {
    recentTasks,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
