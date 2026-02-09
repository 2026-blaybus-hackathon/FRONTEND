import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getMentorFeedbackMenteeList,
    getMentorFeedbackMenteeDetail,
    writeMentorTaskFeedback,
    writeMentorTotalFeedback,
    type WriteMentorTaskFeedbackPayload,
    type WriteMentorTotalFeedbackPayload,
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
    });
}

export function useMentorMenteeDetail(menteeId: number, date: string, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: mentorFeedbackKeys.menteeDetail(menteeId),
        queryFn: () => getMentorFeedbackMenteeDetail(menteeId, date),
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
        ...options,
    });
}

// ── Mutations ───────────────────────────────────────────────
export function useWriteTaskFeedback(menteeId: number, taskId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: WriteMentorTaskFeedbackPayload) => writeMentorTaskFeedback(taskId, payload),
        onSuccess: () => {
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
