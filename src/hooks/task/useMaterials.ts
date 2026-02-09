import { useQuery } from '@tanstack/react-query';
import { getMaterials } from '../../api/materials';

const QUERY_KEY_PREFIX = ['materials'] as const;

/**
 * 학습 자료 목록 조회 훅.
 * GET /materials?taskType=
 * taskType 없으면 전체, 있으면 해당 유형만 (예: COLUMN, WEAKNESS_SOLUTION)
 */
export function useMaterials(taskType?: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, taskType ?? 'all'],
    queryFn: () => getMaterials(taskType),
  });

  return {
    materials: data ?? [],
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
