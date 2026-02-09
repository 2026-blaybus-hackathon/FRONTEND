import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import axios from '../../libs/axios';
import Cookies from 'js-cookie';
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
  mentorName?: string;
  summary?: string;
  comment?: string;
  summaryFeedback?: string;
  detailFeedback?: string;
}

interface UnreadCountResponse {
  count?: number;
  unreadCount?: number;
  totalCount?: number;
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
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);

  // 액세스 토큰 확인
  const accessToken = Cookies.get('access_token');

  // 로그인하지 않았거나 멘티가 아닌 경우
  if (!isLoggedIn) {
    return (
      <div className="review-container">
        <div className="empty-state" style={{ paddingTop: '100px' }}>
          <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" stroke="#EF4444" strokeWidth="3"/>
            <path d="M40 25v20M40 55v5" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="empty-title">로그인이 필요합니다.</p>
          <p className="empty-subtitle">복습 아카이브를 이용하려면 로그인해주세요.</p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  if (role !== 'MENTEE') {
    return (
      <div className="review-container">
        <div className="empty-state" style={{ paddingTop: '100px' }}>
          <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" stroke="#F59E0B" strokeWidth="3"/>
            <path d="M40 25v20M40 55v5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <p className="empty-title">멘티 전용 페이지입니다.</p>
          <p className="empty-subtitle">현재 {role === 'MENTOR' ? '멘토' : '게스트'} 계정으로 로그인되어 있습니다.</p>
        </div>
      </div>
    );
  }

  // 피드백 목록 조회 - 올바른 엔드포인트 사용
  const { data: feedbackData, isLoading: feedbackLoading, isError: feedbackError } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      try {
        const response = await axios.get<FeedbackApiResponse[]>('/feedbacks');
        return Array.isArray(response.data) ? response.data : [];
      } catch (error: any) {
        return [];
      }
    },
    retry: 0,
    enabled: isLoggedIn && role === 'MENTEE',
  });

  // 안 읽은 피드백 개수 조회
  const { data: unreadData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      try {
        const response = await axios.get<UnreadCountResponse>('/feedback/mentee/unread-count');
        return response.data;
      } catch (error: any) {
        return { unreadCount: 0, totalCount: 0 };
      }
    },
    retry: 0,
    enabled: isLoggedIn && role === 'MENTEE',
  });

  // 학습 히스토리 조회 (완료된 과제만)
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['taskHistory'],
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get<TaskHistoryResponse[]>('/tasks/mentee/list', {
          params: { date: today },
        });
        return Array.isArray(response.data) 
          ? response.data.filter(task => task.isCompleted)
          : [];
      } catch (error: any) {
        return [];
      }
    },
    retry: 0,
    enabled: isLoggedIn && role === 'MENTEE',
  });

  // API 데이터를 Feedback 형식으로 변환
  const feedbacks: Feedback[] = feedbackData?.map((item) => ({
    id: item.feedbackId,
    subject: item.subject || '과목',
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
    mentorName: item.mentorName || '멘토',
    mentorComment: item.comment || item.summary || item.summaryFeedback || item.detailFeedback || '피드백 내용',
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
    ? `${unreadData.unreadCount || unreadData.count || 0}/${unreadData.totalCount || feedbacks.length}` 
    : `0/${feedbacks.length}`;

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
                <div className="loading-spinner">
                  <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="empty-title">피드백을 불러오는 중...</p>
              </div>
            ) : feedbackError ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="30" stroke="#EF4444" strokeWidth="3"/>
                  <path d="M40 25v20M40 55v5" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">피드백을 불러오는데 실패했습니다.</p>
                <p className="empty-subtitle">
                  {!accessToken 
                    ? '로그인 세션이 만료되었습니다. 다시 로그인해주세요.' 
                    : '서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.'}
                </p>
                {!accessToken && (
                  <button 
                    onClick={() => navigate('/login')}
                    style={{
                      marginTop: '20px',
                      padding: '12px 24px',
                      background: '#6366F1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    로그인하러 가기
                  </button>
                )}
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
                <div className="loading-spinner">
                  <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="empty-title">학습 기록을 불러오는 중...</p>
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
