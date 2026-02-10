import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMenteeProfile,
  updateMenteeProfile,
  updateMenteeProfileImage,
} from '../api/mentee';
import type { UpdateMenteeProfileRequest } from '../libs/types/mentee';

const PROFILE_QUERY_KEY = ['menteeProfile'] as const;

/**
 * 멘티 내 프로필 조회.
 * GET /api/v1/users/profile
 * enabled: false면 요청하지 않음 (멘토 등)
 */
export function useMenteeProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getMenteeProfile,
    enabled: options?.enabled !== false,
  });
}

/**
 * 멘티 프로필 수정 뮤테이션.
 * PUT /api/v1/users/profile
 */
export function useUpdateMenteeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateMenteeProfileRequest) => updateMenteeProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

/**
 * 멘티 프로필 이미지 수정 뮤테이션.
 * PATCH /api/v1/users/profile-image
 */
export function useUpdateMenteeProfileImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File | null) => updateMenteeProfileImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}
