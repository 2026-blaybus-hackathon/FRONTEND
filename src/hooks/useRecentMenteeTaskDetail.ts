import { useState, useCallback } from 'react';
import { useRecentMenteeTasks } from './useRecentMenteeTasks';
import type { MentorTaskItem } from '../libs/types/mentor';

/**
 * 최근 제공 과제 목록 + 상세 모달용 선택 상태.
 * GET /tasks/mentor/mentee/:menteeId 데이터를 사용하며,
 * 목록 항목 클릭 시 상세 모달에 넘길 task를 선택할 수 있음.
 */
export function useRecentMenteeTaskDetail(menteeId: number | null): {
  recentTasks: MentorTaskItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  /** 모달에 표시할 과제. null이면 모달 비표시 */
  selectedTask: MentorTaskItem | null;
  /** 해당 과제 상세 모달 열기 */
  openTaskDetail: (task: MentorTaskItem) => void;
  /** 상세 모달 닫기 */
  closeTaskDetail: () => void;
} {
  const { recentTasks, isLoading, isError, error, refetch } = useRecentMenteeTasks(menteeId);
  const [selectedTask, setSelectedTask] = useState<MentorTaskItem | null>(null);

  const openTaskDetail = useCallback((task: MentorTaskItem) => {
    setSelectedTask(task);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setSelectedTask(null);
  }, []);

  return {
    recentTasks,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
    selectedTask,
    openTaskDetail,
    closeTaskDetail,
  };
}
