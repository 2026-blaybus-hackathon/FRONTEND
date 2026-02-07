import { useNavigate } from 'react-router-dom';
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
                            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
                                {/* 학생 일러스트 */}
                                <circle cx="100" cy="50" r="25" fill="#FEF3C7"/>
                                <rect x="80" y="75" width="40" height="50" rx="5" fill="#FBBF24"/>
                                <rect x="70" y="85" width="20" height="35" rx="3" fill="#F59E0B"/>
                                <rect x="110" y="85" width="20" height="35" rx="3" fill="#F59E0B"/>
                                <path d="M85 50 Q100 60 115 50" stroke="#92400E" strokeWidth="2" fill="none"/>
                                <circle cx="90" cy="45" r="3" fill="#92400E"/>
                                <circle cx="110" cy="45" r="3" fill="#92400E"/>
                                <rect x="85" y="125" width="12" height="25" rx="2" fill="#D97706"/>
                                <rect x="103" y="125" width="12" height="25" rx="2" fill="#D97706"/>
                            </svg>
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
                            <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
                                {/* 선생님 일러스트 */}
                                <circle cx="100" cy="50" r="25" fill="#DBEAFE"/>
                                <rect x="80" y="75" width="40" height="50" rx="5" fill="#3B82F6"/>
                                <rect x="70" y="85" width="20" height="35" rx="3" fill="#2563EB"/>
                                <rect x="110" y="85" width="20" height="35" rx="3" fill="#2563EB"/>
                                <path d="M85 50 Q100 60 115 50" stroke="#1E3A8A" strokeWidth="2" fill="none"/>
                                <circle cx="90" cy="45" r="3" fill="#1E3A8A"/>
                                <circle cx="110" cy="45" r="3" fill="#1E3A8A"/>
                                <rect x="85" y="125" width="12" height="25" rx="2" fill="#1D4ED8"/>
                                <rect x="103" y="125" width="12" height="25" rx="2" fill="#1D4ED8"/>
                                {/* 안경 */}
                                <circle cx="90" cy="45" r="6" stroke="#1E3A8A" strokeWidth="1.5" fill="none"/>
                                <circle cx="110" cy="45" r="6" stroke="#1E3A8A" strokeWidth="1.5" fill="none"/>
                                <line x1="96" y1="45" x2="104" y2="45" stroke="#1E3A8A" strokeWidth="1.5"/>
                            </svg>
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