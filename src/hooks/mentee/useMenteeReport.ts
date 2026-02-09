import { useQuery } from "@tanstack/react-query";
import { getMenteeReport, type MenteeReportPeriod } from "../../api/mentee";

// ── Query Keys ──────────────────────────────────────────────
export const menteeReportKeys = {
    all: ['menteeReport'] as const,
    report: () => [...menteeReportKeys.all, 'report'] as const,
};

// ── Queries ─────────────────────────────────────────────────
export function useMenteeReport(period: MenteeReportPeriod, reportDate: string, options: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: menteeReportKeys.report(),
        queryFn: () => getMenteeReport(period, reportDate),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        ...options,
        retry: 3
    });
}