import { useState } from 'react';
import { useMenteeFeedbacks } from '../../hooks/useMenteeFeedbacks';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import '../../styles/pages/review.css';

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  // 피드백 목록 조회
  const { feedbacks: feedbacksData, isLoading } = useMenteeFeedbacks();

  const feedbacks = feedbacksData.map((fb) => ({
    id: fb.feedbackId,
    subject: fb.subject || '과목',
    title: fb.taskTitle,
    fileName: '',
    fileSize: '',
    score: 0,
    mentorPick: false,
    date: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    mentorName: '멘토',
    mentorComment: fb.comment || fb.summary,
    imageUrl: '',
  }));

  const handleViewFeedback = (feedbackId: number) => {
    setSelectedFeedback(feedbackId);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };

  const currentFeedback = feedbacks.find((f: { id: number }) => f.id === selectedFeedback);

  return (
    <>
      <div className="review-container">
        {/* 헤더 */}
        <div className="review-header">
          <h1>지난 기록실</h1>
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
            {feedbacks.length > 0 && <span className="tab-badge">{feedbacks.length}</span>}
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
            {isLoading ? (
              <div className="empty-state">
                <p className="empty-title">로딩 중...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="20" y="15" width="40" height="50" rx="2" stroke="#D1D5DB" strokeWidth="3"/>
                  <line x1="28" y1="25" x2="52" y2="25" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="28" y1="35" x2="52" y2="35" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="28" y1="45" x2="45" y2="45" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">도착한 피드백이 없습니다.</p>
                <p className="empty-subtitle">멘토님의 피드백이 도착하면 여기에 표시됩니다.</p>
              </div>
            ) : (
              <div className="feedback-grid">
                {feedbacks.map((feedback: {
                  id: number;
                  subject: string;
                  title: string;
                  fileName: string;
                  fileSize: string;
                  score: number;
                  mentorPick: boolean;
                  date: string;
                  mentorName: string;
                  mentorComment: string;
                  imageUrl: string;
                }) => (
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
      <FeedbackDetailModal
        isOpen={selectedFeedback !== null}
        onClose={handleCloseModal}
        feedback={currentFeedback ? {
          subject: currentFeedback.subject,
          title: currentFeedback.title,
          date: currentFeedback.date,
          mentorName: currentFeedback.mentorName,
          mentorComment: currentFeedback.mentorComment,
          imageUrl: currentFeedback.imageUrl,
        } : null}
      />
    </>
  );
};

export default ReviewPage;
