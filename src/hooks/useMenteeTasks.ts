import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../libs/axios';
import type { MentorTaskType } from '../libs/types/mentor';
import type { subjectTypes } from '../types';

const QUERY_KEY_PREFIX = ['menteeTasks'] as const;

export interface TaskItem {
  assignment: {
    id: number;
    originalFileName: string;
    url: string;
  }[];
  isCompleted: boolean;
  isMentorAssigned: boolean;
  task: {
    id: number;
    taskType: MentorTaskType;
    title: string;
    subject: subjectTypes.Subject;
    studyDurationInMinutes: number;
  }
}

export interface TaskListResponse {
  content: TaskItem[];
  hasNext: boolean;
}

/**
 * 멘티 과제 목록 조회 훅 (커서 기반 페이지네이션)
 * GET /api/v1/tasks/mentee/list?date=YYYY-MM-DD&lastId=...
 */
export function useMenteeTasks(date: string) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...QUERY_KEY_PREFIX, date],
    queryFn: async ({ pageParam }) => {
      try {
        const params: Record<string, unknown> = { date };
        if (pageParam != null) {
          params.lastTaskId = pageParam;
        }
        const response = await axios.get<TaskListResponse>('/tasks/mentee/list', {
          params,
        });
        return response.data;
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        return { content: [], hasNext: false } as TaskListResponse;
      }
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.hasNext && lastPage.content.length > 0) {
        const lastItem = lastPage.content[lastPage.content.length - 1];
        return lastItem.task.id;
      }
      return undefined;
    },
  });

  return {
    data,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
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
