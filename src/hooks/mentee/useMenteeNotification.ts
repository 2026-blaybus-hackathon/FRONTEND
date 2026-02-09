import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { readMenteeNotification } from "../../api/mentee";
import { getMenteeNotifications } from "../../api/mentee";

// ── Query Keys ──────────────────────────────────────────────
export const menteeNotificationKeys = {
    all: ['menteeNotifications'] as const,
} as const;

// ── Queries ─────────────────────────────────────────────────
export function useMenteeNotifications(options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: menteeNotificationKeys.all,
        queryFn: () => getMenteeNotifications(),
        staleTime: 1 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
        retry: 1,
        ...options,
    });
}

// ── Mutations ─────────────────────────────────────────────────
export function useReadMenteeNotification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationId: number) => readMenteeNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menteeNotificationKeys.all });
        },
    });
}