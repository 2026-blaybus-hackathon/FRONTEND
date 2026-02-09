import { useQuery } from '@tanstack/react-query';
import { getTaskById } from '../api/mentor';

const QUERY_KEY_PREFIX = ['taskDetail'] as const;

/**
 * GET /tasks/:taskId 할 일 상세 조회 훅.
 * taskId가 없으면 요청하지 않음.
 */
export function useTaskDetail(taskId: number | null) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, taskId],
    queryFn: () => getTaskById(taskId!),
    enabled: taskId != null && taskId > 0,
  });

  const task = data?.tasks?.content?.[0] ?? null;

  return {
    data,
    task,
    totalFeedback: data?.totalFeedback ?? null,
    menteeId: data?.menteeId ?? null,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
