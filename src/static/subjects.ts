// 과목 목록
export const SUBJECTS = ['국어', '수학', '영어'] as const;

// 과목 타입
export type Subject = typeof SUBJECTS[number];

// 필터 목록 (전체 + 과목)
export const FILTERS = ['전체', ...SUBJECTS] as const;

// 과목별 색상
export const SUBJECT_COLORS: Record<string, string> = {
  '국어': '#EF4444',
  '수학': '#3B82F6',
  '영어': '#10B981',
};
