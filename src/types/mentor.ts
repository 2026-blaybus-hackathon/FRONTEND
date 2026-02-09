import type { Image } from "./image";
import type { MenteeTaskStatus } from "./mentee";

/*
    멘토 피드백 페이지
*/

// 멘토 피드백 페이지 내 멘티 상태
export type MentorFeedbackMenteeStatus = "PENDING" | "COMPLETED";
// 멘토 피드백 페이지 내 과제 상태
export type MentorFeedbackTaskStatus = "PENDING" | "COMPLETED" | "NOT_SUBMITTED";

// 멘토 피드백 페이지 내 멘티 리스트
export interface MentorFeedbackMenteeListItem {
    id: number;
    name: string;
    profileUrl: string;
    schoolName: string;
    grade: string;
    status: MentorFeedbackMenteeStatus;
}

export type MentorFeedbackMenteeList = MentorFeedbackMenteeListItem[]

export interface MentorFeedbackTask {
    taskId: number;
    subject: string;
    title: string;
    date: string;
    status: MenteeTaskStatus;
    time: number;
    feedbackStatus: MentorFeedbackTaskStatus;
    menteecomment: string;
    images: Image[];
    feedback: string;
}

export interface MentorFeedbackMenteeDetail {
	tasks: MentorFeedbackTask[];
	totalFeedback: string;
}