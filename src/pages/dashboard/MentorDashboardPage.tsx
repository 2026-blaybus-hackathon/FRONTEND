import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/feature/layout/DashboardLayout';
import AddTaskModal from '../../components/feature/dashboard/AddTaskModal';
import EditTaskModal from '../../components/feature/dashboard/EditTaskModal';
import TaskDetailModal from '../../components/feature/dashboard/TaskDetailModal';
import TaskCard from '../../components/feature/dashboard/TaskCard';
import type { Task, TaskData, TaskDetail } from '../../types';
import { FILTERS } from '../../static/subjects';
import '../../styles/pages/dashboard.css';

const MentorDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

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

  // 피드백 개수 (임시로 0, 추후 API 연동)
  const feedbackCount = 0;

  // 날짜별 과제 개수
  const taskCountByDate = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === selectedDate;
    }).length;
  }, [tasks, selectedDate]);

  const filters = FILTERS;

  const handleAddTask = (task: TaskData) => {
    const newTask: Task = {
      ...task,
      id: Date.now(), // 고유 ID 생성
      status: 'pending',
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (updatedTask: TaskData & { id: number }) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id 
        ? { ...task, ...updatedTask }
        : task
    ));
    // 수정 후 상세 정보 모달 열기
    const task = tasks.find(t => t.id === updatedTask.id);
    if (task) {
      setDetailTask({ ...task, ...updatedTask });
      setIsDetailModalOpen(true);
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (task: Task) => {
    setDetailTask(task);
    setIsDetailModalOpen(true);
  };

  const handleSubmitTaskDetail = (taskDetail: TaskDetail) => {
    setTasks(tasks.map(task => 
      task.id === taskDetail.id 
        ? { 
            ...task, 
            studyHours: taskDetail.studyHours,
            studyMinutes: taskDetail.studyMinutes,
            description: taskDetail.description,
            imageUrl: taskDetail.imageUrl,
            status: 'completed',
            dueTime: `${taskDetail.studyHours}시간 ${taskDetail.studyMinutes}분`
          }
        : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = selectedFilter === '전체' 
    ? tasks 
    : tasks.filter(task => task.subject === selectedFilter);

  return (
    <DashboardLayout>
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
            {filteredTasks.length === 0 ? (
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
            )}
          </div>

          {/* 플로팅 추가 버튼 */}
          <button className="floating-add-btn" onClick={() => setIsModalOpen(true)}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <line x1="16" y1="8" x2="16" y2="24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

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
    </DashboardLayout>
  );
};

export default MentorDashboardPage;
