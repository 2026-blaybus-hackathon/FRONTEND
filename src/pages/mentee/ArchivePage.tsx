import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import axios from '../../libs/axios';
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

interface FeedbackApiResponse {
  feedbackId: number;
  taskTitle: string;
  subject: string;
  createdAt: string;
  mentorName: string;
  summaryFeedback?: string;
  detailFeedback?: string;
}

interface UnreadCountResponse {
  unreadCount: number;
  totalCount: number;
}

interface TaskHistoryResponse {
  taskId: number;
  title: string;
  subject: string;
  studyTime: number;
  isCompleted: boolean;
  createdAt: string;
}

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  // 피드백 목록 조회
  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const response = await axios.get<FeedbackApiResponse[]>('/feedback/mentee/feedbacks');
      console.log('피드백 데이터:', response.data);
      return response.data;
    },
    retry: 1,
  });

  // 안 읽은 피드백 개수 조회
  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const response = await axios.get<UnreadCountResponse>('/feedback/mentee/unread-count');
      console.log('안읽은 개수:', response.data);
      return response.data;
    },
    retry: 1,
  });

  // 학습 히스토리 조회 (최근 30일)
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['taskHistory'],
    queryFn: async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const response = await axios.get<TaskHistoryResponse[]>('/tasks/mentee/list', {
        params: {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
        },
      });
      console.log('히스토리 데이터:', response.data);
      return response.data;
    },
    retry: 1,
  });

  // API 데이터를 Feedback 형식으로 변환
  const feedbacks: Feedback[] = feedbackData?.map((item) => ({
    id: item.feedbackId,
    subject: item.subject,
    title: item.taskTitle,
    fileName: '파일명',
    fileSize: '2.1MB',
    score: 0,
    mentorPick: false,
    date: new Date(item.createdAt).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    mentorName: item.mentorName,
    mentorComment: item.summaryFeedback || item.detailFeedback || '피드백 내용',
    imageUrl: '',
  })) || [];

  const handleViewFeedback = (feedbackId: number) => {
    setSelectedFeedback(feedbackId);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };

  const currentFeedback = feedbacks.find(f => f.id === selectedFeedback);

  // 배지 텍스트 생성
  const badgeText = unreadData 
    ? `${unreadData.unreadCount}/${unreadData.totalCount}` 
    : '0/0';

  return (
    <>
      <div className="review-container">
        {/* 헤더 */}
        <div className="review-header">
          <h1>💾 복습 아카이브</h1>
          <p className="review-subtitle">도착한 피드백을 확인하고 지난 학습 기록을 관리하세요.</p>
        </div>

        {/* 탭 */}
        <div className="review-tabs">
          <button
            className={`review-tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <span style={{ fontSize: '18px' }}>📋</span>
            도착한 피드백
            <span className="tab-badge">{badgeText}</span>
          </button>
          <button
            className={`review-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span style={{ fontSize: '18px' }}>📅</span>
            학습 히스토리
          </button>
        </div>

        {/* 컨텐츠 */}
        {activeTab === 'feedback' ? (
          <div className="feedback-list">
            {feedbackLoading ? (
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
            {historyLoading ? (
              <div className="empty-state">
                <p className="empty-title">로딩 중...</p>
              </div>
            ) : !historyData || historyData.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="25" stroke="#D1D5DB" strokeWidth="3"/>
                  <path d="M40 25v15l10 10" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">아직 히스토리가 없어요.</p>
                <p className="empty-subtitle">피드백을 확인하면 여기에 저장됩니다!</p>
              </div>
            ) : (
              <div className="feedback-grid">
                {historyData.map((task) => (
                  <div key={task.taskId} className="history-card">
                    <div className="history-card-header">
                      <span className="history-subject">{task.subject}</span>
                      <span className={`history-status ${task.isCompleted ? 'completed' : 'incomplete'}`}>
                        {task.isCompleted ? '완료' : '미완료'}
                      </span>
                    </div>
                    <h3 className="history-title">{task.title}</h3>
                    <div className="history-info">
                      <span>공부시간: {task.studyTime}분</span>
                      <span>{new Date(task.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
