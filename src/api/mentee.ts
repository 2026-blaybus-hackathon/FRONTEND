import axios from "../libs/axios";
import type { subjectTypes } from "../types";

/**
 * 멘티용 API.
 * - 피드백 목록, 미읽음 개수, 과제 이력 등 (추가 시 이 파일에 정의)
 */

/**
 * 멘티 리포트 조회
 */
export type MenteeReportPeriod = 'WEEKLY' | 'MONTHLY';
export interface MenteeReportResponse {
    reportId: number;
    period: MenteeReportPeriod;
    startDate: string;
    endDate: string;
    formattedPeriod: string;
    overallReview: string;
    keepContent: string;
    problemContent: string;
    tryContent: string;
    totalStudyMinutes: number;
    totalAchievementRate: number;
    subjectReports: {
        subject: subjectTypes.Subject;
        studyMinutes: number;
        achievementRate: number;
    }[];
}

export async function getMenteeReport(period: MenteeReportPeriod, reportDate: string): Promise<MenteeReportResponse> {
  const response = await axios.get<MenteeReportResponse>(`/reports?period=${period}&reportDate=${reportDate}`);
  return response.data;
}

/**
 * 멘티 알림 조회
 */

export interface MenteeNotificationResponse {
	notificationId: number;
	title: string;
	time: string;
	read: boolean;
	type: "TASK_FEEDBACK"| "TOTAL_FEEDBACK" | "REPORT";
	taskId?: number;
	dateId?: number;
	reportId?: number;
}