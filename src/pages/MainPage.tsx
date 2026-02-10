import { useNavigate } from 'react-router-dom';
import '../styles/pages/main.css';

const MainPage = () => {
    const navigate = useNavigate();

    const handleMenteeClick = () => {
        navigate('/login?role=mentee');
    };

    const handleMentorClick = () => {
        navigate('/login?role=mentor');
    };

    return (
        <div className="main-page-new">
            {/* 로고 및 타이틀 */}
            <div className="main-header-new">
                <div className="logo-icon-new">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="12" fill="#F3F2FF"/>
                        <path d="M16 18h16M16 24h16M16 30h10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 14h20v20H14z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h1 className="main-title-new">SeolStudy</h1>
                <p className="main-subtitle-new">서울대 멘토와 함께하는 맞춤형 멘토링 서비스</p>
            </div>

            {/* 역할 선택 섹션 */}
            <div className="role-selection-new">
                <h2 className="selection-title">어떤 역할로 시작할까요?</h2>
                
                <div className="role-cards-new">
                    {/* 학생 (멘티) 카드 */}
                    <div 
                        className="role-card-new mentee-card-new"
                        onClick={handleMenteeClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleMenteeClick();
                            }
                        }}
                    >
                        <span className="role-badge-new student-badge">Student</span>
                        <h3 className="role-name-new">학생 (멘티)</h3>
                        <p className="role-desc-new">체계적인 관리와 피드백을 받고 싶어요</p>
                    </div>

                    {/* 서울대생 (멘토) 카드 */}
                    <div 
                        className="role-card-new mentor-card-new"
                        onClick={handleMentorClick}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleMentorClick();
                            }
                        }}
                    >
                        <span className="role-badge-new teacher-badge">Teacher</span>
                        <h3 className="role-name-new">서울대생 (멘토)</h3>
                        <p className="role-desc-new">학생들을 성장을 돕고 싶어요</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;