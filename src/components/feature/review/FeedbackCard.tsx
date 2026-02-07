import { SUBJECT_COLORS } from '../../../static/subjects';
import '../../../styles/components/feedback-card.css';

interface FeedbackCardProps {
  id: number;
  subject: string;
  title: string;
  fileName: string;
  fileSize: string;
  score: number;
  mentorPick?: boolean;
  onViewFeedback: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  subject,
  title,
  fileName,
  fileSize,
  score,
  mentorPick,
  onViewFeedback,
}) => {
  const subjectColor = SUBJECT_COLORS[subject] || '#6B7280';

  return (
    <div className="feedback-card">
      {/* 과목 뱃지 */}
      <div className="feedback-subject" style={{ backgroundColor: subjectColor }}>
        {subject}
      </div>

      {/* Mentor Pick 뱃지 */}
      {mentorPick && (
        <div className="mentor-pick-badge">
          # Mentor Pick
        </div>
      )}

      {/* 제목 */}
      <h3 className="feedback-title">{title}</h3>

      {/* 파일 정보 */}
      <div className="feedback-file">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M11 2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-6-5z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 2v5h5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <text x="7" y="14" fontSize="6" fill="#EF4444" fontWeight="bold">PDF</text>
        </svg>
        <div className="file-info">
          <span className="file-name">{fileName}</span>
          <span className="file-size">{fileSize}</span>
        </div>
        <button className="download-btn" aria-label="파일 다운로드">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8m0 0l3-3m-3 3L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 점수 */}
      <div className="feedback-score">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5z" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span className="score-text">{score}점</span>
      </div>

      {/* 피드백 확인 버튼 */}
      <button className="view-feedback-btn" onClick={onViewFeedback}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3C4.5 3 1.7 5.6 1 8c.7 2.4 3.5 5 7 5s6.3-2.6 7-5c-.7-2.4-3.5-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        피드백 확인하기
      </button>
    </div>
  );
};

export default FeedbackCard;
