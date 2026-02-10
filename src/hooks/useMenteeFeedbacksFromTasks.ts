import { useMemo } from 'react';
import { useMentorMenteeTasks } from './useMentorMenteeTasks';
import type { MenteeFeedbackItem } from '../libs/types/mentor';

export interface UseMenteeFeedbacksFromTasksOptions {
  page?: number;
  size?: number;
  enabled?: boolean;
}

/**
 * 멘티 과제 조회 API 응답에서 피드백만 추출하는 훅.
 * GET /tasks/mentor/mentee/:menteeId 와 동일한 요청을 사용하며, 응답의 각 과제에 포함된 feedback을
 * taskId, taskTitle과 함께 배열로 반환합니다.
 */
export function useMenteeFeedbacksFromTasks(
  menteeId: number | null,
  options: UseMenteeFeedbacksFromTasksOptions = {}
): {
  feedbacks: MenteeFeedbackItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { tasks, isLoading, isError, error, refetch } = useMentorMenteeTasks(
    menteeId,
    options
  );

  const feedbacks = useMemo((): MenteeFeedbackItem[] => {
    const content = tasks?.content ?? [];
    const list = content
      .filter((task) => task.feedback != null)
      .map((task) => ({
        taskId: task.taskId,
        taskTitle: task.title,
        feedbackId: task.feedback.feedbackId,
        summary: task.feedback.summary ?? '',
        comment: task.feedback.comment ?? '',
      }));
    return list;
  }, [menteeId, tasks?.content]);

  return {
    feedbacks,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}
