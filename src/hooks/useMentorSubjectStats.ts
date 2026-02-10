import { useQuery } from '@tanstack/react-query';
import { getMentorSubjectStats, type MentorSubjectStatsItem } from '../api/mentor';

const QUERY_KEY_PREFIX = ['mentorSubjectStats'] as const;

function todayYYYYMMDD(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * GET /reports/mentor/statistics
 * 멘티 과목별 통계(공부 시간·달성률). 과제 관리 페이지 등에서 사용.
 */
export function useMentorSubjectStats(
  menteeId: number | null,
  options?: { reportDate?: string; period?: 'WEEKLY' | 'MONTHLY' }
) {
  const reportDate = options?.reportDate ?? todayYYYYMMDD();
  const period = options?.period ?? 'WEEKLY';
  const enabled = menteeId != null && menteeId > 0;

  const { data = [], isLoading, isError, error, refetch } = useQuery<MentorSubjectStatsItem[]>({
    queryKey: [...QUERY_KEY_PREFIX, menteeId, reportDate, period],
    queryFn: () => getMentorSubjectStats(menteeId!, { period, reportDate }),
    enabled,
  });

  const overallAchievementRate =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.achievementRate, 0) / data.length
        )
      : 0;

  return {
    subjectStats: data,
    overallAchievementRate,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
