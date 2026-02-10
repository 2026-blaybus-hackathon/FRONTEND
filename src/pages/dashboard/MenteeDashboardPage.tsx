import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMenteeTasks, useCreateMenteeTask, useUpdateMenteeTask, useDeleteMenteeTask, useUpdateMenteeTaskCompletion, useUpdateMenteeStudyTime, useUpdateMenteeTaskComment } from '../../hooks/useMenteeTasks';
import { useUnreadFeedbackCount, useTotalFeedback } from '../../hooks/useMenteeFeedbacks';
import AddTaskModal from '../../components/feature/dashboard/AddTaskModal';
import EditTaskModal from '../../components/feature/dashboard/EditTaskModal';
import TaskDetailModal from '../../components/feature/dashboard/TaskDetailModal';
import TaskCard from '../../components/feature/dashboard/TaskCard';
import type { taskTypes } from '../../types';
import { FILTERS } from '../../static/subjects';
import type { TaskItem } from '../../hooks/useMenteeTasks';

type Task = taskTypes.Task;
type TaskData = taskTypes.TaskData;
type TaskDetail = taskTypes.TaskDetail;
import '../../styles/pages/mentee-dashboard.css';

const MenteeDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [showTotalFeedbackModal, setShowTotalFeedbackModal] = useState(false);

  // Query parameter에서 date와 showTotalFeedback 가져오기
  const dateParam = searchParams.get('date');
  const showTotalFeedbackParam = searchParams.get('showTotalFeedback');

  // 선택된 날짜 문자열 생성
  const selectedDateStr = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
  }, [selectedDate]);

  // 과제 목록 조회
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMenteeTasks(selectedDateStr);
  const tasksData: TaskItem[] = useMemo(() => {
    return data?.pages?.flatMap(page => page.content) ?? [];
  }, [data]);
  
  // 안 읽은 피드백 개수
  const { count: feedbackCount } = useUnreadFeedbackCount();

  // 종합 피드백 조회 (모달이 열릴 때만)
  const { totalFeedback, isLoading: isLoadingFeedback } = useTotalFeedback(
    selectedDateStr, 
    showTotalFeedbackModal
  );

  // Mutations
  const createTaskMutation = useCreateMenteeTask();
  const updateTaskMutation = useUpdateMenteeTask();
  const deleteTaskMutation = useDeleteMenteeTask();
  const updateCompletionMutation = useUpdateMenteeTaskCompletion();
  const updateStudyTimeMutation = useUpdateMenteeStudyTime();
  const updateCommentMutation = useUpdateMenteeTaskComment();

  // API 데이터를 Task 타입으로 변환
  const tasks: Task[] = useMemo(() => {
    return tasksData.map((task: TaskItem) => ({
      id: task.task.id,
      title: task.task.title,
      subject: task.task.subject,
      status: task.isCompleted ? 'completed' : 'pending',
      date: selectedDateStr,
      dueTime: task.task.studyDurationInMinutes ? `${Math.floor(task.task.studyDurationInMinutes / 60)}시간 ${task.task.studyDurationInMinutes % 60}분` : '',
      studyHours: task.task.studyDurationInMinutes ? Math.floor(task.task.studyDurationInMinutes / 60) : 0,
      studyMinutes: task.task.studyDurationInMinutes ? task.task.studyDurationInMinutes % 60 : 0,
    }));
  }, [tasksData, selectedDateStr]);

  // 현재 주의 날짜 계산
  const weekDays = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0(일) ~ 6(토)
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return days.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const dateNum = date.getDate();
      const hasTask = tasks.some(task => {
        const taskDate = new Date(task.date);
        return taskDate.getDate() === dateNum;
      });
      return { day, date: dateNum, hasTask };
    });
  }, [tasks]);

  // 현재 선택된 날짜 정보
  const selectedDateInfo = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const dayIndex = weekDays.findIndex(d => d.date === selectedDate);
    const dayName = dayIndex >= 0 ? weekDays[dayIndex].day : '';
    return { year, month, date: selectedDate, dayName };
  }, [selectedDate, weekDays]);

  // 오늘의 학습 시간 계산
  const todayFocus = useMemo(() => {
    const today = new Date().getDate();
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === today && task.status === 'completed';
    });
    const totalMinutes = todayTasks.reduce((sum, task) => {
      return sum + (task.studyHours || 0) * 60 + (task.studyMinutes || 0);
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  }, [tasks]);

  // 주간 점수 계산 (완료된 과제 비율)
  const weeklyScore = useMemo(() => {
    const thisWeek = tasks.filter(task => {
      const taskDate = new Date(task.date);
      const dateNum = taskDate.getDate();
      return weekDays.some(d => d.date === dateNum);
    });
    const completed = thisWeek.filter(t => t.status === 'completed').length;
    const total = thisWeek.length;
    if (total === 0) return 0;
    const score = Math.round((completed / total) * 3); // 0~3점
    return score;
  }, [tasks, weekDays]);

  // 날짜별 과제 개수
  const taskCountByDate = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === selectedDate;
    }).length;
  }, [tasks, selectedDate]);

  const filters = FILTERS;

  const handleAddTask = (task: TaskData) => {
    createTaskMutation.mutate({
      title: task.title,
      subject: task.subject,
      date: task.date,
    });
  };

  const handleEditTask = (updatedTaskData: TaskData & { id: number }) => {
    updateTaskMutation.mutate({
      taskId: updatedTaskData.id,
      title: updatedTaskData.title,
      subject: updatedTaskData.subject,
      date: updatedTaskData.date,
    }, {
      onSuccess: () => {
        const updatedTask = tasks.find(t => t.id === updatedTaskData.id);
        if (updatedTask) {
          setDetailTask(updatedTask);
          setIsDetailModalOpen(true);
        }
      }
    });
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (task: Task) => {
    setDetailTask(task);
    setIsDetailModalOpen(true);
  };

  const handleSubmitTaskDetail = async (taskDetail: TaskDetail) => {
    try {
      // 공부 시간 업데이트
      await updateStudyTimeMutation.mutateAsync({
        taskId: taskDetail.id,
        studyTime: (taskDetail.studyHours || 0) * 60 + (taskDetail.studyMinutes || 0)
      });
      
      // 코멘트 업데이트
      if (taskDetail.description) {
        await updateCommentMutation.mutateAsync({
          taskId: taskDetail.id,
          comment: taskDetail.description
        });
      }
      
      // 완료 상태로 변경
      await updateCompletionMutation.mutateAsync({
        taskId: taskDetail.id,
        isCompleted: true
      });
    } catch {
      // 에러 처리
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  const filteredTasks = selectedFilter === '전체' 
    ? tasks 
    : tasks.filter(task => task.subject === selectedFilter);

  // URL에서 date 파라미터가 있으면 해당 날짜로 이동
  useEffect(() => {
    if (dateParam) {
      try {
        const date = new Date(dateParam);
        if (!isNaN(date.getTime())) {
          setTimeout(() => setSelectedDate(date.getDate()), 0);
        }
      } catch {
        // 잘못된 날짜 형식 무시
      }
    }
  }, [dateParam]);

  // URL에서 showTotalFeedback 파라미터가 있으면 종합 피드백 모달 열기
  useEffect(() => {
    if (showTotalFeedbackParam === 'true') {
      setTimeout(() => setShowTotalFeedbackModal(true), 0);
    }
  }, [showTotalFeedbackParam]);

  return (
    <div className="dashboard-container">
      {/* 헤더 섹션 */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-title">
            <span className="pin-icon">📌</span>
            <h1>{selectedDateInfo.month}월 {selectedDateInfo.date}일 {selectedDateInfo.dayName}요일</h1>
          </div>
          <p className="header-subtitle">오늘 계획된 학습을 완료하고 있습니다.</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">TODAY'S FOCUS</span>
            <span className="stat-value focus">{todayFocus.hours}시간 {todayFocus.minutes}분</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">WEEKLY SCORE</span>
            <div className="score-dots">
              {[0, 1, 2].map((index) => (
                <span key={index} className={`dot ${index < weeklyScore ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 알림 배너 */}
      <div className="notification-banner">
        <div className="notification-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="4" width="12" height="16" rx="1" stroke="white" strokeWidth="2"/>
            <line x1="9" y1="8" x2="15" y2="8" stroke="white" strokeWidth="2"/>
            <line x1="9" y1="12" x2="15" y2="12" stroke="white" strokeWidth="2"/>
            <line x1="9" y1="16" x2="13" y2="16" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <div className="notification-content">
          <h3>새로운 피드백 {feedbackCount}개가 도착했습니다!</h3>
          <p>멘토님의 과제물을 확인하고 학습을 완료하세요.</p>
        </div>
        <button className="notification-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 주간 날짜 선택기 */}
      <div className="week-selector">
        <button className="week-nav-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {weekDays.map((item) => (
          <button
            key={item.date}
            className={`date-btn ${selectedDate === item.date ? 'active' : ''}`}
            onClick={() => setSelectedDate(item.date)}
          >
            <span className="date-day">{item.day}</span>
            <span className="date-number">{item.date}</span>
            {selectedDate === item.date && <span className="date-indicator"></span>}
          </button>
        ))}
        <button className="week-nav-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 15l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="filter-tabs">
        <div className="filter-left">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="filter-right">
          <button className="today-btn">TODAY</button>
          <button className="sort-btn">
            날짜 과제 <span className="badge">{taskCountByDate}</span>
          </button>
        </div>
      </div>

      {/* 과제 리스트 */}
      <div className="assignment-list">
        {isLoading ? (
          <div className="empty-state">
            <p className="empty-title">로딩 중...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="20" y="15" width="40" height="50" rx="2" stroke="#D1D5DB" strokeWidth="3"/>
              <line x1="28" y1="25" x2="52" y2="25" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
              <line x1="28" y1="35" x2="52" y2="35" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
              <line x1="28" y1="45" x2="45" y2="45" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="empty-title">등록된 과제가 없습니다.</p>
            <p className="empty-subtitle">우측 하단 버튼을 눌러 새로운 목표를 세워보세요!</p>
          </div>
        ) : (
          <>
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  subject={task.subject}
                  status={task.status}
                  dueTime={task.dueTime}
                  onEdit={() => handleOpenEditModal(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onDetail={() => handleOpenDetailModal(task)}
                />
              ))}
            </div>
            {hasNextPage && (
              <div className="load-more-wrapper">
                <button
                  className="load-more-btn"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? '불러오는 중...' : '더 불러오기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 플로팅 추가 버튼 */}
      <button className="floating-add-btn" onClick={() => setIsModalOpen(true)}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <line x1="16" y1="8" x2="16" y2="24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </button>

      {/* 할 일 추가 모달 */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* 할 일 수정 모달 */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleEditTask}
        task={editingTask}
      />

      {/* 과제 상세 정보 모달 */}
      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailTask(null);
        }}
        onSubmit={handleSubmitTaskDetail}
        task={detailTask}
      />

      {/* 종합 피드백 모달 */}
      {showTotalFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowTotalFeedbackModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
          }}>
            <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: '700' }}>
              종합 피드백
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '24px' }}>
              {selectedDateInfo.month}월 {selectedDateInfo.date}일의 종합 피드백입니다.
            </p>
            <div style={{ 
              background: '#F9FAFB', 
              padding: '20px', 
              borderRadius: '12px',
              marginBottom: '24px',
              minHeight: '200px',
            }}>
              {isLoadingFeedback ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                  <svg className="animate-spin h-8 w-8" style={{ color: '#7C3AED' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : totalFeedback ? (
                <p style={{ color: '#374151', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {totalFeedback}
                </p>
              ) : (
                <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '40px 0' }}>
                  아직 종합 피드백이 작성되지 않았습니다.
                </p>
              )}
            </div>
            <button
              onClick={() => setShowTotalFeedbackModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeDashboardPage;
