import { useState } from 'react';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import '../../styles/pages/review.css';

interface Feedback {
  id: number;
  subject: string;
  title: string;
  fileName: string;
  fileSize: string;
  score: number;
  mentorPick?: boolean;
  date: string;
  mentorName: string;
  mentorComment: string;
  imageUrl: string;
}

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  // 임시 데이터 (추후 API 연동)
  const feedbacks: Feedback[] = [];

  const handleViewFeedback = (feedbackId: number) => {
    setSelectedFeedback(feedbackId);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };

  const currentFeedback = feedbacks.find(f => f.id === selectedFeedback);

  return (
    <>
      <div className="review-container">
        {/* 헤더 */}
        <div className="review-header">
          <h1>📚 학습 아카이브</h1>
          <p className="review-subtitle">도착한 피드백을 확인하고 지난 학습 기록을 관리하세요.</p>
        </div>

        {/* 탭 */}
        <div className="review-tabs">
          <button
            className={`review-tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="6" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="6" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            도착한 피드백
            <span className="tab-badge">2/1</span>
          </button>
          <button
            className={`review-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 5v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            학습 히스토리
          </button>
        </div>

        {/* 컨텐츠 */}
        {activeTab === 'feedback' ? (
          <div className="feedback-list">
            {feedbacks.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="20" y="15" width="40" height="50" rx="2" stroke="#D1D5DB" strokeWidth="3"/>
                  <line x1="28" y1="25" x2="52" y2="25" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="28" y1="35" x2="52" y2="35" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="28" y1="45" x2="45" y2="45" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">도착한 피드백이 없습니다.</p>
                <p className="empty-subtitle">멘토님이 피드백을 작성하면 여기에 표시됩니다</p>
              </div>
            ) : (
              <div className="feedback-grid">
                {feedbacks.map((feedback) => (
                  <FeedbackCard 
                    key={feedback.id} 
                    {...feedback} 
                    onViewFeedback={() => handleViewFeedback(feedback.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="history-list">
            <div className="empty-state">
              <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="25" stroke="#D1D5DB" strokeWidth="3"/>
                <path d="M40 25v15l10 10" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <p className="empty-title">학습 히스토리가 없습니다.</p>
              <p className="empty-subtitle">학습을 완료하면 여기에 기록이 표시됩니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* 피드백 상세 모달 */}
      {currentFeedback && (
        <FeedbackDetailModal
          isOpen={selectedFeedback !== null}
          onClose={handleCloseModal}
          feedback={{
            subject: currentFeedback.subject,
            title: currentFeedback.title,
            date: currentFeedback.date,
            mentorName: currentFeedback.mentorName,
            mentorComment: currentFeedback.mentorComment,
            imageUrl: currentFeedback.imageUrl,
          }}
        />
      )}
    </>
  );
};

export default ArchivePage;
