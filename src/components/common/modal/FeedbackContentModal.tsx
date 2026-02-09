import type { MenteeFeedbackItem } from '../../../libs/types/mentor';
import '../../../styles/components/feedback-detail-modal.css';

export interface FeedbackContentModalProps {
  /** 표시할 피드백. null이면 모달을 렌더하지 않음 */
  feedback: MenteeFeedbackItem | null;
  onClose: () => void;
}

/**
 * 과제 피드백 내용을 보여주는 모달.
 * 리포트 페이지 등에서 MenteeFeedbackItem을 클릭했을 때 사용.
 */
const FeedbackContentModal = ({ feedback, onClose }: FeedbackContentModalProps) => {
  if (!feedback) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-content-modal-title"
      onClick={onClose}
    >
      <div
        className="feedback-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-detail-header">
          <div className="feedback-detail-title-section">
            <h2
              id="feedback-content-modal-title"
              className="feedback-detail-title m-0"
            >
              📝 {feedback.taskTitle} 피드백
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
          {feedback.summary ? (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 m-0 mb-2">
                요약
              </h3>
              <p className="text-sm text-gray-700 m-0 whitespace-pre-wrap">
                {feedback.summary}
              </p>
            </div>
          ) : null}
          <div className="mentor-comment-section">
            <div className="mentor-header">
              <span className="mentor-name">상세 코멘트</span>
            </div>
            <div className="mentor-comment">
              {feedback.comment || '작성된 코멘트가 없습니다.'}
            </div>
          </div>
        </div>

        <div className="feedback-detail-footer">
          <button
            type="button"
            className="feedback-cancel-btn"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackContentModal;
