import axios from '../libs/axios';
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
