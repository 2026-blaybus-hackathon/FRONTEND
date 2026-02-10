import { useQuery } from '@tanstack/react-query';
import axios from '../../libs/axios';
import { useMenteeList } from '../../hooks/useMenteeList';
import '../../styles/pages/mentor-dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Bell, Flag, Users } from '../../icons';

// interface DashboardStats {
//   totalMentees: number;
//   completionRate: number;
//   consecutiveStudyDays: number;
// }

// interface RecentTask {
//   taskId: number;
//   title: string;
//   subject: string;
//   menteeName: string;
//   submittedAt: string;
// }

interface MenteeSummary {
  menteeId: number;
  name: string;
  school: string;
  grade: string;
  profileImageUrl?: string;
}

interface DashboardResponse {
  stats: {
    totalMenteeCount: number;
    averageProgress: number;
    progressChange: number;
    pendingFeedbackCount: number;
  };
  mentees: MenteeSummary[];
  recentTasks: Array<{
    taskId: number;
    title: string;
    menteeName: string;
    schoolAndGrade: string;
    targetSchool?: string;
    targetDate?: string;
    date: string;
    isFeedbackCompleted: boolean;
  }>;
}

const MentorDashboardPage = () => {
  const navigate = useNavigate();
  const { menteeList, isLoading: menteeLoading } = useMenteeList();

  // 대시보드 통계 조회
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['mentorDashboard'],
    queryFn: async () => {
      try {
        const response = await axios.get<DashboardResponse>('/dashboard/mentor/dashboard');
        return response.data;
      } catch {
        return null;
      }
    },
  });

  const recentTasks = dashboardData?.recentTasks ?? [];
  const recentSubmissions = recentTasks.map((task) => {
    const date = task?.date ? new Date(task.date) : new Date();
    return {
      id: task.taskId,
      title: task.title ?? '',
      date: Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('ko-KR'),
      menteeName: task.menteeName ?? '',
      schoolAndGrade: task.schoolAndGrade ?? '',
      isFeedbackCompleted: task.isFeedbackCompleted,
    };
  });

  return (
    <div className="mentor-dashboard-layout">
      <header className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-400 font-semibold leading-tight text-gray-900 flex gap-200">
            <span>👩🏻‍🎓</span><span>멘티 관리</span>
          </h1>
        </div>
      </header>
      
      {/* 메인 컨텐츠 */}
      <main className="mentor-main">
        {/* 컨텐츠 */}
        <div className="mentor-content">
          {/* 통계 카드 */}
          <div className="stats-row">
            <div className="stat-box shadow-sm">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-400 flex justify-center items-center mb-2 shrink-0">
                <Users width={16} height={16} />
              </div>
              <div className="heading-6">{dashboardLoading ? '-' : dashboardData?.stats.totalMenteeCount || 0}명</div>
              <div className="stat-label">나의 멘티 수</div>
            </div>
            <div className="stat-box shadow-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-400 flex justify-center items-center mb-2 shrink-0">
                <Flag />
              </div>
              <div className="heading-6">{dashboardLoading ? '-' : dashboardData?.stats.averageProgress || 0}%</div>
              <div className="stat-label">이번 달 완료율</div>
            </div>
            <div className="stat-box shadow-sm">
              <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-400 flex justify-center items-center mb-2 shrink-0">
                <Bell />
              </div>
              <div className="heading-6">{dashboardLoading ? '-' : dashboardData?.stats.pendingFeedbackCount || 0}개</div>
              <div className="stat-label">미완료 피드백 개수</div>
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
                      <button className="action-btn" onClick={() => navigate(`/mentor/feedback?menteeId=${mentee.id}`)}>피드백 작성</button>
                      <button className="action-btn primary" onClick={() => navigate(`/mentor/assignment?menteeId=${mentee.id}`)}>과제 제공</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 하단 섹션 */}
          <div className="bottom-row">
            {/* 미작성 피드백 */}
            <section className="content-section half">
              <div className="section-header">
                <h2 className="section-title">미작성 피드백</h2>
                <span className="badge">{dashboardData?.stats.pendingFeedbackCount || 0}개</span>
              </div>
              {dashboardLoading ? (
                <div className="loading-state">로딩 중...</div>
              ) : (dashboardData?.stats.pendingFeedbackCount || 0) === 0 ? (
                <div className="empty-state">모든 피드백을 작성했습니다!</div>
              ) : (
                <div className="list-items">
                  <div className="empty-state">피드백 목록은 보관함에서 확인하세요</div>
                </div>
              )}
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
                        {item.menteeName} · {item.schoolAndGrade}
                      </div>
                      <div className="submission-status">
                        {item.isFeedbackCompleted ? '피드백 완료' : '피드백 대기'}
                      </div>
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
