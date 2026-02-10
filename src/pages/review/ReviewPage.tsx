import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenteeFeedbacks } from '../../hooks/useMenteeFeedbacks';
import { useMenteeTasks } from '../../hooks/useMenteeTasks';
import FeedbackCard from '../../components/feature/review/FeedbackCard';
import FeedbackDetailModal from '../../components/feature/review/FeedbackDetailModal';
import '../../styles/pages/review.css';

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'feedback' | 'history'>('feedback');
  const [selectedFeedback, setSelectedFeedback] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');

  // Query parameter에서 feedbackId 가져오기
  const feedbackIdParam = searchParams.get('feedbackId');
  const taskIdParam = searchParams.get('taskId');

  // 피드백 목록 조회
  const { feedbacks: feedbacksData, isLoading: isLoadingFeedbacks, isError: isFeedbackError } = useMenteeFeedbacks();

  // 학습 히스토리 조회 (완료된 과제 목록)
  const today = new Date().toISOString().split('T')[0];
  const { tasks, isLoading: isLoadingTasks } = useMenteeTasks(today);

  // 피드백 데이터 매핑
  const feedbacks = feedbacksData.map((fb) => ({
    id: fb.feedbackId,
    subject: fb.subject || '과목',
    title: fb.taskTitle,
    fileName: `${fb.taskTitle}.pdf`,
    fileSize: '2.4 MB',
    score: 0,
    mentorPick: false,
    date: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    mentorName: '멘토',
    mentorComment: fb.comment || fb.summary,
    imageUrl: '',
    summary: fb.summary,
    comment: fb.comment,
  }));

  // 학습 히스토리 데이터 (완료된 과제만)
  const completedTasks = (tasks || [])
    .filter((task: any) => task.isCompleted)
    .map((task: any) => ({
      id: task.taskId,
      subject: task.subject || '과목',
      title: task.title,
      date: task.date ? new Date(task.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
      studyTime: task.studyTime || 0,
      isCompleted: task.isCompleted,
    }));

  const filteredHistory = selectedSubject === '전체' 
    ? completedTasks 
    : completedTasks.filter((task: any) => task.subject === selectedSubject);

  const handleViewFeedback = (feedbackId: number) => {
    setSelectedFeedback(feedbackId);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
  };

  const currentFeedback = feedbacks.find((f) => f.id === selectedFeedback);

  // URL에서 taskId가 있으면 해당 과제의 피드백 조회 후 모달 열기
  useEffect(() => {
    if (taskIdParam) {
      const taskId = Number(taskIdParam);
      const feedback = feedbacks.find(f => f.id === taskId);
      if (feedback) {
        setSelectedFeedback(feedback.id);
        setActiveTab('feedback');
      }
    } else if (feedbackIdParam) {
      const feedbackId = Number(feedbackIdParam);
      const feedback = feedbacks.find(f => f.id === feedbackId);
      if (feedback) {
        setSelectedFeedback(feedbackId);
        setActiveTab('feedback');
      }
    }
  }, [feedbackIdParam, taskIdParam, feedbacksData]);

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
            {isLoadingFeedbacks ? (
              <div className="empty-state">
                <div className="loading-spinner">
                  <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="empty-title">피드백을 불러오는 중...</p>
              </div>
            ) : isFeedbackError ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="30" stroke="#EF4444" strokeWidth="3"/>
                  <path d="M40 25v20M40 55v5" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">피드백을 불러오는데 실패했습니다.</p>
                <p className="empty-subtitle">잠시 후 다시 시도해주세요.</p>
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
            {/* 과목 필터 */}
            <div className="history-filters">
              {['전체', '국어', '수학', '영어'].map((subject) => (
                <button
                  key={subject}
                  className={`filter-btn ${selectedSubject === subject ? 'active' : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            {isLoadingTasks ? (
              <div className="empty-state">
                <div className="loading-spinner">
                  <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="empty-title">학습 기록을 불러오는 중...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="25" stroke="#D1D5DB" strokeWidth="3"/>
                  <path d="M40 25v15l10 10" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="empty-title">학습 히스토리가 없습니다.</p>
                <p className="empty-subtitle">학습을 완료하면 여기에 기록이 표시됩니다.</p>
              </div>
            ) : (
              <div className="history-grid">
                {filteredHistory.map((task: any) => (
                  <div key={task.id} className="history-card">
                    <div className="history-card-header">
                      <span 
                        className="history-subject-badge"
                        style={{ 
                          backgroundColor: task.subject === '국어' ? '#10B981' : 
                                         task.subject === '수학' ? '#3B82F6' : 
                                         task.subject === '영어' ? '#F59E0B' : '#6B7280' 
                        }}
                      >
                        {task.subject}
                      </span>
                      <span className="history-date">{task.date}</span>
                    </div>
                    <h3 className="history-title">{task.title}</h3>
                    <div className="history-footer">
                      <div className="history-study-time">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{task.studyTime}분</span>
                      </div>
                      <span className="history-status completed">완료</span>
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
            mentorComment: currentFeedback.comment || currentFeedback.summary || '피드백 내용이 없습니다.',
            imageUrl: currentFeedback.imageUrl,
          }}
        />
      )}
    </>
  );
};

export default ReviewPage;
