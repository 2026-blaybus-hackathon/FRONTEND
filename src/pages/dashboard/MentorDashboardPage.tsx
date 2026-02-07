import { useState } from 'react';
import '../../styles/pages/mentor-dashboard.css';

const MentorDashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState<'hub' | 'timeline'>('hub');

  const stats = {
    mentees: 3,
    completionRate: 80,
    studyDays: 1,
  };

  const menteeList = [
    { id: 1, name: '민유진', subject: '국어/영어', avatar: '민' },
    { id: 2, name: '김철수', subject: '수학/과학', avatar: '김' },
    { id: 3, name: '이영희', subject: '영어/국어', avatar: '이' },
  ];

  const assignments = [
    { subject: '과학', mentor: '제출 완료' },
    { subject: '과학', mentor: '국어' },
    { subject: '미술', mentor: '문학 문제 풀이' },
    { subject: '음악', mentor: '민유진' },
  ];

  const recentSubmissions = [
    { title: '대수학 과제물', date: '오늘 2:37 · 2025.02.03' },
    { title: '대수학 과제물', date: '오늘 2:37 · 2025.02.03' },
  ];

  return (
    <div className="mentor-dashboard-layout">
      {/* 왼쪽 사이드바 */}
      <aside className="mentor-sidebar">
        <div className="mentor-sidebar-header">
          <div className="logo">
            <span className="logo-icon">📖</span>
            <span className="logo-text">SeolStudy</span>
          </div>
        </div>

        <div className="mentor-nav">
          <div className="nav-section">
            <button className="nav-item active">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>멘티 목록</span>
            </button>
            <button className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="3" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>피드백 관리</span>
            </button>
            <button className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>과제 관리</span>
            </button>
            <button className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="5" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>학습 기록 관리</span>
            </button>
          </div>

          <div className="nav-section">
            <button className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>알림</span>
            </button>
            <button className="nav-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>프로필</span>
            </button>
          </div>
        </div>
      </aside>

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
              <div className="stat-value">{stats.mentees}명</div>
              <div className="stat-desc">활동중 멘티 수</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">과제 완료율</div>
              <div className="stat-value">{stats.completionRate}%</div>
              <div className="stat-desc">지난주 대비 +5%</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">연속 학습일수</div>
              <div className="stat-value">{stats.studyDays}건</div>
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
                {assignments.map((item, idx) => (
                  <div key={idx} className="list-item">
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
              <div className="submission-items">
                {recentSubmissions.map((item, idx) => (
                  <div key={idx} className="submission-item">
                    <div className="submission-title">{item.title}</div>
                    <div className="submission-date">{item.date}</div>
                    <div className="submission-status">제출 완료</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboardPage;
