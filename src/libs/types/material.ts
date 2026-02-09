/** GET /materials 응답 항목 - 학습 자료 목록 */
export interface LearningMaterialItem {
  id: number;
  title: string;
  taskType: string;
  subject: string;
  content: string;
  originalFileName: string;
  fileUrl: string;
  createdDateTime: string;
}

/** POST /materials 요청 body (multipart의 request 필드) */
export interface MaterialRegisterRequest {
  title: string;
  taskType: 'COLUMN' | 'WEAKNESS_SOLUTION';
  subject: string;
  content: string;
}
