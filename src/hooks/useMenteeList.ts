import { useQuery } from '@tanstack/react-query';
import { getMenteeList } from '../api/mentor';

const MENTEES_QUERY_KEY = ['mentees'] as const;

/**
 * 멘토용 멘티 목록 조회 훅.
 * GET /users/mentor/mentees 호출 후 id, name, subject, avatar 형태로 반환.
 */
export function useMenteeList() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: MENTEES_QUERY_KEY,
    queryFn: () => getMenteeList().catch(() => []),
  });

  return {
    menteeList: data ?? [],
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
