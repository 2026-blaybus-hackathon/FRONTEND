import { useQuery } from '@tanstack/react-query';
import axios from '../libs/axios';

const FEEDBACKS_QUERY_KEY = ['menteeFeedbacks'] as const;
const UNREAD_COUNT_QUERY_KEY = ['unreadFeedbackCount'] as const;
const TOTAL_FEEDBACK_QUERY_KEY = ['totalFeedback'] as const;

interface FeedbackItem {
  feedbackId: number;
  taskTitle: string;
  subject: string;
  createdAt: string;
  summary: string;
  comment: string;
  isRead: boolean;
}

/**
 * 멘티 피드백 목록 조회 훅
 * GET /api/v1/feedbacks
 */
export function useMenteeFeedbacks() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: FEEDBACKS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await axios.get<{ feedbacks: FeedbackItem[] }>('/feedbacks');
        const feedbacks = Array.isArray(response.data) 
          ? response.data 
          : response.data.feedbacks || [];
        return feedbacks;
      } catch (err) {
        return [];
      }
    },
  });

  return {
    feedbacks: data ?? [],
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}

/**
 * 안 읽은 피드백 개수 조회 훅
 * GET /api/v1/feedback/mentee/unread-count
 */
export function useUnreadFeedbackCount() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: UNREAD_COUNT_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await axios.get<{ count: number }>('/feedback/mentee/unread-count');
        return response.data.count || 0;
      } catch (err) {
        return 0;
      }
    },
  });

  return {
    count: data ?? 0,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}

/**
 * 종합 피드백 조회 훅
 * GET /api/v1/feedbacks/daily-planner/total-feedback?date=YYYY-MM-DD
 */
export function useTotalFeedback(date: string, enabled: boolean = true) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...TOTAL_FEEDBACK_QUERY_KEY, date],
    queryFn: async () => {
      try {
        const response = await axios.get<{ totalFeedback: string }>('/feedbacks/daily-planner/total-feedback', {
          params: { date }
        });
        return response.data.totalFeedback || '';
      } catch (err) {
        return '';
      }
    },
    enabled,
  });

  return {
    totalFeedback: data ?? '',
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
