import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../libs/axios';
import '../../styles/pages/mentor-dashboard.css';

interface MenteeResponse {
  menteeId: number;
  name: string;
  subjects: string[];
}

interface DashboardStats {
  totalMentees: number;
  completionRate: number;
  consecutiveStudyDays: number;
}

interface RecentTask {
  taskId: number;
  title: string;
  subject: string;
  menteeName: string;
  submittedAt: string;
}

interface DashboardResponse {
  stats: DashboardStats;
  recentTasks: RecentTask[];
}

const MentorDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState<'hub' | 'timeline'>('hub');

  // 멘티 목록 조회
  const { data: menteeData, isLoading: menteeLoading } = useQuery({
    queryKey: ['mentees'],
    queryFn: async () => {
      const response = await axios.get<MenteeResponse[]>('/users/mentor/mentees');
      console.log('멘티 목록:', response.data);
      return response.data;
    },
  });

  // 대시보드 통계 조회
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['mentorDashboard'],
    queryFn: async () => {
      const response = await axios.get<DashboardResponse>('/dashboard/mentor/dashboard');
      console.log('대시보드 데이터:', response.data);
      return response.data;
    },
  });

  const stats = dashboardData?.stats || {
    totalMentees: 0,
    completionRate: 0,
    consecutiveStudyDays: 0,
  };

  const menteeList = menteeData?.map((mentee) => ({
    id: mentee.menteeId,
    name: mentee.name,
    subject: mentee.subjects.join('/'),
    avatar: mentee.name[0],
  })) || [];

  const recentSubmissions = dashboardData?.recentTasks?.map((task) => ({
    id: task.taskId,
    title: task.title,
    date: new Date(task.submittedAt).toLocaleDateString('ko-KR'),
    menteeName: task.menteeName,
    subject: task.subject,
  })) || [];

  const assignments = [
    { id: 'assign-1', subject: '과학', mentor: '제출 완료' },
    { id: 'assign-2', subject: '과학', mentor: '국어' },
    { id: 'assign-3', subject: '미술', mentor: '문학 문제 풀이' },
    { id: 'assign-4', subject: '음악', mentor: '민유진' },
  ];

  return (
    <div className="mentor-dashboard-layout">
      {/* 메인 컨텐츠 */}
      <main className="mentor-main">
        {/* 헤더 */}
        <header className="mentor-header">
          <div className="header-tabs">
            <button
              className={`header-tab ${selectedTab === 'hub' ? 'active' : ''}`}
              onClick={() => setSelectedTab('hub')}
            >
              Mentor Hub
            </button>
            <button
              className={`header-tab ${selectedTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setSelectedTab('timeline')}
            >
              멘티 타임
            </button>
          </div>
          <div className="header-actions">
            <input type="text" placeholder="멘티 검색..." className="search-input" />
            <button className="notification-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </header>

        {/* 컨텐츠 */}
        <div className="mentor-content">
          {/* 통계 카드 */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">나의 멘티 수</div>
              <div className="stat-value">{dashboardLoading ? '-' : stats.totalMentees}명</div>
              <div className="stat-desc">활동중 멘티 수</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">과제 완료율</div>
              <div className="stat-value">{dashboardLoading ? '-' : stats.completionRate}%</div>
              <div className="stat-desc">지난주 대비 +5%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">연속 학습일수</div>
              <div className="stat-value">{dashboardLoading ? '-' : stats.consecutiveStudyDays}일</div>
              <div className="stat-desc">매일 꾸준히 학습하세요</div>
            </div>
          </div>

          {/* 멘티 목록 */}
          <section className="content-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              멘티 목록
            </h2>
            {menteeLoading ? (
              <div className="loading-state">로딩 중...</div>
            ) : menteeList.length === 0 ? (
              <div className="empty-state">등록된 멘티가 없습니다.</div>
            ) : (
              <div className="mentee-grid">
                {menteeList.map((mentee) => (
                  <div key={mentee.id} className="mentee-card">
                    <div className="mentee-avatar">{mentee.avatar}</div>
                    <div className="mentee-info">
                      <div className="mentee-name">{mentee.name}</div>
                      <div className="mentee-subject">{mentee.subject}</div>
                    </div>
                    <div className="mentee-actions">
                      <button className="action-btn">피드백 확인</button>
                      <button className="action-btn primary">과제 제출</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 하단 섹션 */}
          <div className="bottom-row">
            {/* 과제 제공 */}
            <section className="content-section half">
              <div className="section-header">
                <h2 className="section-title">과제 제공</h2>
                <button className="more-btn">⋯</button>
              </div>
              <div className="list-items">
                {assignments.map((item) => (
                  <div key={item.id} className="list-item">
                    <span>{item.subject}</span>
                    <span>{item.mentor}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 최근 제출 과제 */}
            <section className="content-section half">
              <div className="section-header">
                <h2 className="section-title">최근 제출 과제 목록</h2>
                <button className="view-all">전체 보기</button>
              </div>
              {dashboardLoading ? (
                <div className="loading-state">로딩 중...</div>
              ) : recentSubmissions.length === 0 ? (
                <div className="empty-state">최근 제출된 과제가 없습니다.</div>
              ) : (
                <div className="submission-items">
                  {recentSubmissions.map((item) => (
                    <div key={item.id} className="submission-item">
                      <div className="submission-title">{item.title}</div>
                      <div className="submission-date">
                        {item.menteeName} · {item.date}
                      </div>
                      <div className="submission-status">제출 완료</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboardPage;
