import { useNavigate } from 'react-router-dom';
import StudentIllustration from '../components/feature/main/StudentIllustration';
import TeacherIllustration from '../components/feature/main/TeacherIllustration';
import '../styles/pages/main.css';

const MainPage = () => {
    const navigate = useNavigate();

    const handleMenteeClick = () => {
        // 멘티 로그인 페이지로 이동
        navigate('/login?role=mentee');
    };

    const handleMentorClick = () => {
        // 멘토 로그인 페이지로 이동
        navigate('/login?role=mentor');
    };

    return(
        <div className="main-page">
            <div className="main-header">
                <div className="main-logo">
                    <div className="logo-icon">📖</div>
                    <h1 className="logo-text">SeolStudy</h1>
                </div>
                <p className="main-subtitle">다양한 교육 서비스를 하나의 아이디로</p>
            </div>

            <div className="role-selection">
                <div 
                    className="role-card mentee-card" 
                    onClick={handleMenteeClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleMenteeClick();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="멘티로 로그인"
                >
                    <div className="role-content">
                        <h2 className="role-title">멘티</h2>
                        <div className="role-illustration">
                            <StudentIllustration />
                        </div>
                    </div>
                    <button className="role-button mentee-button">
                        로그인
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div 
                    className="role-card mentor-card" 
                    onClick={handleMentorClick}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleMentorClick();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="멘토로 로그인"
                >
                    <div className="role-content">
                        <h2 className="role-title">멘토</h2>
                        <div className="role-illustration">
                            <TeacherIllustration />
                        </div>
                    </div>
                    <button className="role-button mentor-button">
                        로그인
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <button className="back-button" onClick={() => window.history.back()}>
                돌아가기
            </button>
        </div>
    )
}

export default MainPage