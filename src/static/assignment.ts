import type {
  AssignmentFormValues,
  MentorMenteeAssignmentDetail,
  MentorTaskType,
} from '../libs/types/mentor';

/** API 과목 코드 ↔ 라벨 */
export const SUBJECT_OPTIONS: { value: string; label: string }[] = [
  { value: 'KOREAN', label: '국어' },
  { value: 'MATH', label: '수학' },
  { value: 'ENGLISH', label: '영어' },
];

/** API 과제 유형 ↔ 라벨 */
export const TASK_TYPE_OPTIONS: { value: MentorTaskType; label: string }[] = [
  { value: 'COLUMN', label: '칼럼' },
  { value: 'WEAKNESS_SOLUTION', label: '약점 보완 솔루션' },
];

/** 과제 제공 폼 기본값 */
export const ASSIGNMENT_FORM_DEFAULT: AssignmentFormValues = {
  taskType: 'WEAKNESS_SOLUTION',
  title: '',
  content: '',
  subject: 'KOREAN',
  date: '',
};

/** 멘티 과제 상세 기본값 (API 미제공 시) */
export const DEFAULT_MENTEE_ASSIGNMENT_DETAIL: MentorMenteeAssignmentDetail = {
  school: '-',
  achievementRate: 0,
};
