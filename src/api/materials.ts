import axios from '../libs/axios';
import type { LearningMaterialItem, MaterialRegisterRequest } from '../libs/types/material';

/**
 * 학습 자료 목록 조회.
 * GET /materials?taskType= (자료 유형별 필터, 없으면 전체)
 */
export async function getMaterials(taskType?: string): Promise<LearningMaterialItem[]> {
  const response = await axios.get<LearningMaterialItem[]>('/materials', {
    params: taskType ? { taskType } : undefined,
  });
  return response.data ?? [];
}

/**
 * 학습 자료 등록.
 * POST /materials (multipart/form-data)
 * - request: 자료 정보 JSON (필수)
 * - file: 첨부 파일 PDF 등 (선택, 칼럼은 텍스트만 가능)
 */
export async function createMaterial(
  request: MaterialRegisterRequest,
  file?: File
): Promise<unknown> {
  const formData = new FormData();
  const jsonString = JSON.stringify(request);
  // 서버가 JSON 파싱 시 "잘못된 JSON 형식"을 반환하지 않도록, Blob으로 application/json 전송 (File+filename 일부 환경에서 파싱 이슈 방지)
  const jsonBlob = new Blob([jsonString], { type: 'application/json' });
  formData.append('request', jsonBlob);
  if (file) {
    formData.append('file', file);
  }
  const response = await axios.post('/materials', formData, {
    headers: {
      'Content-Type': false as unknown as string,
    },
  });
  return response.data;
}

/**
 * 학습 자료 삭제.
 * DELETE /materials/{materialId}
 */
export async function deleteMaterial(materialId: number): Promise<void> {
  await axios.delete(`/materials/${materialId}`);
}

/**
 * 학습 자료 파일 다운로드 (Blob).
 * GET /materials/:id/download — 서버에서 파일 스트리밍 시 사용.
 * 404면 직접 fileUrl 사용해야 함.
 */
export async function getMaterialFileBlob(id: number): Promise<Blob> {
  const response = await axios.get<Blob>(`/materials/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
}
