import axios from "../libs/axios";
import type { subjectTypes } from "../types";
import type { MenteeProfileResponse, UpdateMenteeProfileRequest } from '../libs/types/mentee';

/**
 * 멘티 내 프로필 조회.
 * GET /users/mentee/profile
 */

export async function getMenteeProfile(): Promise<MenteeProfileResponse> {
    const response = await axios.get<MenteeProfileResponse>('/users/mentee/profile');
    return response.data;
}

/**
 * 멘티 프로필 수정.
 * PUT /users/mentee/profile
 */
export async function updateMenteeProfile(
    body: UpdateMenteeProfileRequest
  ): Promise<void> {
    await axios.put('/users/mentee/profile', body);
  }
  
/**
 * 멘티 프로필 이미지 수정.
 * PATCH /users/mentee/profile-image (multipart/form-data)
 */
export async function updateMenteeProfileImage(file: File | null): Promise<void> {
    const formData = new FormData();
    if (file) {
        formData.append('profile', file);
    }
    await axios.patch('/users/mentee/profile-image', formData, {
        headers: {
        'Content-Type': false as unknown as string,
        },
    });
}


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

export type MenteeNotificationType = "TASK_FEEDBACK"| "TOTAL_FEEDBACK" | "REPORT";

export interface MenteeNotification {
	notificationId: number;
	title: string;
	time: string;
	read: boolean;
	type: "TASK_FEEDBACK"| "TOTAL_FEEDBACK" | "REPORT";
	taskId?: number;
	date?: number;
	report?: {
        date: string;
        period: MenteeReportPeriod;
    }
}

type MenteeNotificationResponse = MenteeNotification[];

export async function getMenteeNotifications(): Promise<MenteeNotificationResponse> {
    const response = await axios.get<MenteeNotificationResponse>('/notifications/mentee');
    return response.data;
}

export async function readMenteeNotification(notificationId: number): Promise<void> {
    await axios.post(`/notifications/mentee/${notificationId}/read`);
}


