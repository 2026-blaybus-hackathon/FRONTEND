import { useQuery } from '@tanstack/react-query';
import { getMenteeList } from '../api/mentor';

const MENTEES_QUERY_KEY = ['mentees'] as const;
const MENTEE_SEARCH_QUERY_KEY = ['mentees', 'search'] as const;

export interface UseMenteeListOptions {
  /**
   * 검색어 (서버 사이드 검색)
   */
  searchQuery?: string;
  /**
   * 과목 필터
   */
  subject?: string;
  /**
   * 정렬 기준
   */
  sortBy?: 'name' | 'recent' | 'progress';
  /**
   * 자동 조회 활성화 여부
   */
  enabled?: boolean;
}

/**
 * 멘토용 멘티 목록 조회 훅.
 * GET /users/mentor/mentees 호출 후 id, name, subject, avatar 형태로 반환.
 * 
 * @example
 * // 기본 사용
 * const { menteeList, isLoading } = useMenteeList();
 * 
 * @example
 * // 검색 사용
 * const { menteeList } = useMenteeList({ searchQuery: '홍길동' });
 * 
 * @example
 * // 과목 필터
 * const { menteeList } = useMenteeList({ subject: '수학' });
 */
export function useMenteeList(options: UseMenteeListOptions = {}) {
  const { searchQuery, subject, sortBy = 'name', enabled = true } = options;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: searchQuery 
      ? [...MENTEE_SEARCH_QUERY_KEY, searchQuery, subject, sortBy]
      : [...MENTEES_QUERY_KEY, subject, sortBy],
    queryFn: async () => {
      try {
        // 검색어가 있으면 검색 API 사용 (향후 구현)
        if (searchQuery) {
          // TODO: 서버 사이드 검색 API 구현 시 사용
          // return await searchMentees(searchQuery);
          const allMentees = await getMenteeList();
          return allMentees.filter((m) => 
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        return await getMenteeList();
      } catch (err) {
        console.error('Failed to fetch mentee list:', err);
        return [];
      }
    },
    enabled,
  });

  // 클라이언트 사이드 필터링 및 정렬
  let filteredList = data ?? [];

  // 과목 필터
  if (subject && subject !== '전체') {
    filteredList = filteredList.filter((mentee) => 
      mentee.subject.includes(subject)
    );
  }

  // 정렬
  if (sortBy === 'name') {
    filteredList = [...filteredList].sort((a, b) => 
      a.name.localeCompare(b.name, 'ko-KR')
    );
  }
  // TODO: 'recent', 'progress' 정렬은 서버에서 추가 데이터 필요

  return {
    menteeList: filteredList,
    totalCount: filteredList.length,
    isLoading,
    isError,
    error: error ?? null,
    refetch,
  };
}

/**
 * 특정 멘티 상세 정보 조회 훅
 * 
 * @example
 * const { mentee, isLoading } = useMenteeDetail(menteeId);
 */
export function useMenteeDetail(menteeId: number | null) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['mentee', menteeId],
    queryFn: async () => {
      if (!menteeId) return null;
      
      // TODO: 멘티 상세 정보 API 구현 시 사용
      // return await getMenteeDetail(menteeId);
      
      // 임시: 목록에서 찾기
      const list = await getMenteeList();
      return list.find((m) => m.id === menteeId) ?? null;
    },
    enabled: menteeId !== null,
  });

  return {
    mentee: data ?? null,
    isLoading,
    isError,
    error: error ?? null,
  };
}
