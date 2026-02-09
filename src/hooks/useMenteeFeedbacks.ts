import { useQuery } from '@tanstack/react-query';
import axios from '../libs/axios';

const FEEDBACKS_QUERY_KEY = ['menteeFeedbacks'] as const;
const UNREAD_COUNT_QUERY_KEY = ['unreadFeedbackCount'] as const;

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
 * GET /api/v1/feedback/mentee/feedbacks
 */
export function useMenteeFeedbacks() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: FEEDBACKS_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await axios.get<{ feedbacks: FeedbackItem[] }>('/feedback/mentee/feedbacks');
        return response.data.feedbacks || [];
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
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
        console.error('Failed to fetch unread feedback count:', err);
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
