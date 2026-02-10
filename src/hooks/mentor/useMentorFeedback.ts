import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMentorFeedbackMenteeList,
    getMentorFeedbackMenteeDetail,
    writeMentorTaskFeedback,
    writeMentorTotalFeedback,
    type WriteMentorTaskFeedbackPayload,
    type WriteMentorTotalFeedbackPayload,
    type MentorFeedbackMenteeDetail,
} from "../../api/mentor";

// ── Query Keys ──────────────────────────────────────────────
export const mentorFeedbackKeys = {
    all: ['mentorFeedback'] as const,
    mentees: () => [...mentorFeedbackKeys.all, 'mentees'] as const,
    menteeDetail: (menteeId: number) =>
        [...mentorFeedbackKeys.all, 'menteeDetail', menteeId] as const,
};

// ── Queries ─────────────────────────────────────────────────
export function useMentorMentees() {
    return useQuery({
        queryKey: mentorFeedbackKeys.mentees(),
        queryFn: getMentorFeedbackMenteeList,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 1
    });
}

export function useMentorMenteeDetail(menteeId: number, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: mentorFeedbackKeys.menteeDetail(menteeId),
        queryFn: () => getMentorFeedbackMenteeDetail(menteeId),
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

// ── Mutations ───────────────────────────────────────────────
export function useWriteTaskFeedback(menteeId: number, taskId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: WriteMentorTaskFeedbackPayload) => writeMentorTaskFeedback(taskId, payload),
        onSuccess: () => {
            // 현재 캐시된 멘티 상세에서 과제 피드백 완료 여부 확인
            const cached = queryClient.getQueryData<MentorFeedbackMenteeDetail>(
                mentorFeedbackKeys.menteeDetail(menteeId)
            );

            if (cached) {
                // 방금 작성한 taskId는 완료로 간주, 나머지도 모두 COMPLETED인지 확인
                const allTasksDone = cached.tasks.every(
                    (task) => task.taskId === taskId || task.feedbackStatus === "COMPLETED"
                );

                if (allTasksDone) {
                    // 모든 과제 피드백 완료 → 멘티 목록 갱신 (상태 배지 업데이트)
                    queryClient.invalidateQueries({
                        queryKey: mentorFeedbackKeys.mentees(),
                    });
                }
            }

            queryClient.invalidateQueries({
                queryKey: mentorFeedbackKeys.menteeDetail(menteeId),
            });
        },
    });
}

export function useWriteTotalFeedback(menteeId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: WriteMentorTotalFeedbackPayload) => writeMentorTotalFeedback(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: mentorFeedbackKeys.menteeDetail(menteeId),
            });
        },
    });
}
