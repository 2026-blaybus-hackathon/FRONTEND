import { useState } from 'react';
import type { MentorTaskItem } from '../../../libs/types/mentor';
import '../../../styles/components/feedback-detail-modal.css';

export interface RecentTaskDetailModalProps {
  /** 표시할 과제. null이면 렌더하지 않음 */
  task: MentorTaskItem | null;
  onClose: () => void;
}

/**
 * 과제관리 "최근 제공 과제" 클릭 시 상세 모달.
 * 과제 제목, 이미지(있을 때), 피드백 요약/코멘트 표시.
 */
const RecentTaskDetailModal = ({ task, onClose }: RecentTaskDetailModalProps) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (!task) return null;

  const handleImageError = (sequence: number) => {
    setImageErrors((prev) => new Set(prev).add(sequence));
  };

  const hasImages = task.images?.length > 0;
  const sortedImages = [...(task.images ?? [])].sort((a, b) => a.sequence - b.sequence);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recent-task-modal-title"
      onClick={onClose}
    >
      <div
        className="feedback-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-detail-header">
          <div className="feedback-detail-title-section">
            <h2 id="recent-task-modal-title" className="feedback-detail-title m-0">
              📌 {task.title}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="모달 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="feedback-detail-content">
          {hasImages && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 m-0 mb-2">첨부 이미지</h3>
              <div className="flex flex-col gap-3">
                {sortedImages.map((img) =>
                  imageErrors.has(img.sequence) ? (
                    <div
                      key={img.sequence}
                      className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-8 text-sm text-gray-500"
                    >
                      이미지를 불러올 수 없습니다.
                    </div>
                  ) : (
                    <div key={img.sequence} className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={img.url}
                        alt={img.name || `과제 이미지 ${img.sequence}`}
                        className="w-full h-auto object-contain max-h-[320px]"
                        onError={() => handleImageError(img.sequence)}
                      />
                      {img.name ? (
                        <p className="text-xs text-gray-500 px-2 py-1 m-0 bg-gray-50">{img.name}</p>
                      ) : null}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {task.feedback && (task.feedback.summary || task.feedback.comment) ? (
            <div className="mentor-comment-section">
              <div className="mentor-header">
                <span className="mentor-name">피드백</span>
              </div>
              {task.feedback.summary ? (
                <p className="text-sm text-gray-700 m-0 mb-2 font-medium">{task.feedback.summary}</p>
              ) : null}
              <div className="mentor-comment">
                {task.feedback.comment || '작성된 코멘트가 없습니다.'}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">등록된 피드백이 없습니다.</div>
          )}
        </div>

        <div className="feedback-detail-footer">
          <button type="button" className="feedback-cancel-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentTaskDetailModal;
