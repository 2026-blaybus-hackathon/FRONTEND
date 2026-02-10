import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignTask } from '../../api/mentor';
import type { MentorTaskAssignmentRequest } from '../../libs/types/mentor';

const RECENT_TASKS_QUERY_KEY_PREFIX = ['recentMenteeTasks'] as const;
const MENTOR_MENTEE_TASKS_QUERY_KEY_PREFIX = ['mentorMenteeTasks'] as const;

export interface AssignTaskVariables {
  payload: MentorTaskAssignmentRequest;
  files?: File[];
}

/**
 * 멘티에게 과제 할당 뮤테이션 훅.
 * 성공 시 해당 멘티의 최근 과제·과제 목록 쿼리 무효화.
 */
export function useAssignTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ payload, files }: AssignTaskVariables) => {
      return assignTask(payload, files);
    },
    onSuccess: (data, variables) => {
      const menteeId = variables.payload.menteeId;
      queryClient.invalidateQueries({
        queryKey: [...RECENT_TASKS_QUERY_KEY_PREFIX, menteeId],
      });
      queryClient.invalidateQueries({
        queryKey: [...MENTOR_MENTEE_TASKS_QUERY_KEY_PREFIX, menteeId],
      });
    },
  });

  return {
    assignTask: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ?? null,
    isSuccess: mutation.isSuccess,
  };
}
