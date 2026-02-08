import { useState } from 'react';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import '../../styles/pages/review.css';

const ReviewPage = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  // 임시 데이터 (추후 API 연동)
  const feedbacks = [
    {
      id: 1,
      subject: '영어',
      title: '단어 시험 (Day 15)',
      fileName: 'Day15_Word_Test.pdf',
      fileSize: '2.1MB',
      score: 45,
      mentorPick: true,
      date: '2025년 2월 5일',
      mentorName: '김영희',
      mentorComment: '단어 암기를 정말 열심히 하셨네요! 특히 Day 15의 어려운 단어들을 잘 소화하신 것 같습니다.\n\n다만 몇 가지 철자 실수가 있었어요:\n- "receive"를 "recieve"로 쓰신 부분\n- "separate"를 "seperate"로 쓰신 부분\n\n이런 헷갈리는 철자는 따로 노트에 정리해서 반복 학습하시면 좋을 것 같아요. 전체적으로 잘하고 계십니다. 화이팅!',
      imageUrl: '',
    },
  ];

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
            {feedbacks.length === 0 ? (
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
