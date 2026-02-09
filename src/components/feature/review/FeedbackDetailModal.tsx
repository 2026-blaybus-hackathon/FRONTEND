import { useState } from 'react';
import Button from '../../common/button/Button';
import { SUBJECT_COLORS } from '../../../static/subjects';
import '../../../styles/components/feedback-detail-modal.css';

interface FeedbackDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: {
    subject: string;
    title: string;
    date: string;
    mentorName: string;
    mentorComment: string;
    imageUrl?: string;
  } | null;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  isOpen,
  onClose,
  feedback,
}) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !feedback) return null;

  const subjectColor = SUBJECT_COLORS[feedback.subject] || '#6B7280';

  const handleClose = () => {
    setImageError(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="feedback-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="feedback-detail-header">
          <div className="feedback-detail-title-section">
            <h2 className="feedback-detail-title">
              📝 {feedback.title} 피드백
            </h2>
            <span 
              className="feedback-detail-subject-badge" 
              style={{ backgroundColor: subjectColor }}
            >
              {feedback.subject}
            </span>
          </div>
          <p className="feedback-detail-date">{feedback.date} | 멘토: {feedback.mentorName}</p>
          <button 
            className="modal-close-btn" 
            onClick={handleClose}
            aria-label="모달 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="feedback-detail-content">
          {/* 이미지 영역 */}
          <div className="feedback-image-section">
            {feedback.imageUrl && !imageError ? (
              <img 
                src={feedback.imageUrl} 
                alt="과제 이미지" 
                className="feedback-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="feedback-image-placeholder">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="10" y="15" width="60" height="50" rx="4" stroke="#D1D5DB" strokeWidth="3"/>
                  <circle cx="25" cy="30" r="5" fill="#D1D5DB"/>
                  <path d="M10 55l15-15 10 10 20-20 15 15" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="placeholder-text">첨부된 이미지 없음</p>
              </div>
            )}
          </div>

          {/* 멘토 코멘트 */}
          <div className="mentor-comment-section">
            <div className="mentor-header">
              <div className="mentor-avatar">T</div>
              <span className="mentor-name">멘토 코멘트</span>
            </div>
            <div className="mentor-comment">
              {feedback.mentorComment}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="feedback-detail-footer">
          <button className="feedback-cancel-btn" onClick={handleClose}>
            닫기
          </button>
          <Button onClick={handleClose} ariaLabel="피드백 확인 완료">
            확인 완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailModal;
