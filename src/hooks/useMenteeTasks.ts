import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../libs/axios';

const QUERY_KEY_PREFIX = ['menteeTasks'] as const;

interface TaskItem {
  taskId: number;
  title: string;
  subject: string;
  isCompleted: boolean;
  studyTime?: number;
  date: string;
}

/**
 * 멘티 과제 목록 조회 훅
 * GET /api/v1/tasks/mentee/list?date=YYYY-MM-DD
 */
export function useMenteeTasks(date: string) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...QUERY_KEY_PREFIX, date],
    queryFn: async () => {
      try {
        const response = await axios.get<{ tasks: TaskItem[] }>('/tasks/mentee/list', {
          params: { date }
        });
        return response.data.tasks || [];
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        return [];
      }
    },
  });

  return {
    tasks: data ?? [],
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}

/**
 * 멘티 과제 생성 mutation 훅
 */
export function useCreateMenteeTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: { title: string; subject: string; date: string }) => {
      const response = await axios.post('/tasks/mentee', taskData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}

/**
 * 멘티 과제 수정 mutation 훅
 */
export function useUpdateMenteeTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, ...data }: { taskId: number; title?: string; subject?: string; date?: string }) => {
      const response = await axios.patch(`/tasks/mentee/${taskId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}

/**
 * 멘티 과제 삭제 mutation 훅
 */
export function useDeleteMenteeTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      await axios.delete(`/tasks/mentee/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}

/**
 * 멘티 과제 완료 상태 변경 mutation 훅
 */
export function useUpdateMenteeTaskCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: number; isCompleted: boolean }) => {
      await axios.patch(`/tasks/mentee/${taskId}/isCompleted`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}

/**
 * 멘티 과제 공부 시간 업데이트 mutation 훅
 */
export function useUpdateMenteeStudyTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, studyTime }: { taskId: number; studyTime: number }) => {
      await axios.patch(`/tasks/mentee/${taskId}/studyTime`, { studyTime });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}

/**
 * 멘티 과제 코멘트 업데이트 mutation 훅
 */
export function useUpdateMenteeTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, comment }: { taskId: number; comment: string }) => {
      await axios.patch(`/tasks/mentee/${taskId}/comment`, { comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PREFIX });
    },
  });
}
