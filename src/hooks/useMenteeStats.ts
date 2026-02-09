import { useQuery } from '@tanstack/react-query';
import { getMenteeStats } from '../api/mentor';
import type { MenteeStatsPeriod } from '../libs/types/mentor';

const QUERY_KEY_PREFIX = ['menteeStats'] as const;

function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const secs = 0;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

/**
 * GET /users/mentor/mentees/:menteeId/stats
 * 멘티의 주/월간 과제 달성률·총 공부 시간 조회.
 */
export function useMenteeStats(
  menteeId: number | null,
  params: { date: string; period: MenteeStatsPeriod }
) {
  const { date, period } = params;
  const enabled = menteeId != null && menteeId > 0 && !!date && !!period;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, menteeId, date, period],
    queryFn: () => getMenteeStats(menteeId!, { date, period }),
    enabled,
  });

  const achievementRate = data?.achievementRate?.achievementRate ?? 0;
  const displayRate = achievementRate <= 1 ? achievementRate * 100 : achievementRate;
  const studyTimeMinutes = data?.weeklyStudyTimeMinutes ?? 0;
  const studyTimeFormatted = formatMinutesToTime(studyTimeMinutes);

  return {
    data,
    achievementRate: displayRate,
    studyTimeMinutes,
    studyTimeFormatted,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
