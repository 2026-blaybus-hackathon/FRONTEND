import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/button/Button";
import EmailInput from "../../components/common/input/EmailInput";
import PasswordInput from "../../components/common/input/PasswordInput";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import type { LoginResponse } from "../../libs/types/apiResponse";
import '../../styles/pages/auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role'); // mentee or mentor
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<null | string>(null);
    
    const { apiCall, isLoading } = useApi();
    const { isLoggedIn, login } = useAuthStore();

    const isLoginValid = email !== "" && password !== "";

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError(null);
    };

    const handleSignupClick = () => {
        navigate(`/signup${role ? `?role=${role}` : ''}`);
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    const handleForgotPassword = () => {
        // TODO: 비밀번호 찾기 기능 구현
        alert('비밀번호 찾기 기능은 준비 중입니다.');
    };

    const handleLogin = () => {
        apiCall<LoginResponse>('/auth/login/email', 'POST', {
            email,
            password
        })
        .then((response) => {
            if (response.status === 200 && response.data?.accessToken) {
                const data = response.data;
                const { accessToken } = data;
                const profile = {
                    nickname: data.nickname,
                    role: data.role,
                    name: data.name,
                    email: data.email,
                    schoolName: data.schoolName,
                    grade: data.grade,
                    targetSchool: data.targetSchool,
                    targetDate: data.targetDate,
                };
                
                login(accessToken, profile);
                
                // 서버에서 받은 role을 기준으로 리다이렉션
                const userRole = data.role?.toLowerCase();
                const dashboardPath = userRole === 'mentor' ? '/mentor/mentee' : '/mentee/dashboard';
                navigate(dashboardPath);
            } else if (response.status === 401) {
                setError("이메일 또는 비밀번호가 잘못되었습니다.");
            } else {
                alert("Server Error");
            }
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            // 이미 로그인되어 있으면 role에 맞는 대시보드로 이동
            const userRole = useAuthStore.getState().role?.toLowerCase();
            const dashboardPath = userRole === 'mentor' ? '/mentor/mentee' : '/mentee/dashboard';
            navigate(dashboardPath);
        }
    }, [isLoggedIn, navigate]);

    const isMentor = role === 'mentor';

    return (
        <div className="auth-page-new">
            {/* 우측 상단 로고 */}
            <div className="auth-logo-top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#F3F2FF"/>
                    <path d="M8 9h8M8 12h8M8 15h5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="auth-logo-text">SeolStudy</span>
            </div>

            {/* 로그인 폼 컨테이너 */}
            <div className="auth-container-new">
                <div className="auth-card-new">
                    {/* 뒤로가기 */}
                    <button className="back-link-new" onClick={handleBackClick}>
                        ← 돌아가기
                    </button>

                    {/* 타이틀 */}
                    <div className="auth-header-new">
                        <h1 className="auth-title-new">
                            {isMentor ? '멘토' : '학생'} 로그인
                        </h1>
                        <p className="auth-subtitle-new">
                            계정 정보를 입력해주세요
                        </p>
                    </div>

                    {/* 폼 */}
                    <div className="auth-form-new">
                        <div className="form-group-new">
                            <label className="form-label-new">이메일</label>
                            <EmailInput
                                value={email}
                                onChange={handleEmailChange}
                                width="full"
                                ariaLabel="로그인 이메일란"
                            />
                        </div>

                        <div className="form-group-new">
                            <label className="form-label-new">비밀번호</label>
                            <PasswordInput
                                onChange={handlePasswordChange}
                                value={password}
                                width="full"
                                ariaLabel="로그인 비밀번호란"
                            />
                            <p className="form-hint-new">8~16자, 영문, 특수문자 포함</p>
                            {error && <p className="error-message-new">{error}</p>}
                        </div>

                        {/* 자동 로그인 & 비밀번호 찾기 */}
                        <div className="form-options-new">
                            <label className="checkbox-label-new">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="checkbox-input-new"
                                />
                                <span>자동 로그인</span>
                            </label>
                            <button 
                                className="forgot-password-new"
                                onClick={handleForgotPassword}
                            >
                                ID/비밀번호 찾기
                            </button>
                        </div>

                        {/* 로그인 버튼 */}
                        <Button
                            onClick={handleLogin}
                            disabled={!isLoginValid || isLoading}
                            width="full"
                            ariaLabel="로그인 버튼"
                            className="login-button-new"
                        >
                            {isLoading ? '로그인 중...' : '시작하기'}
                        </Button>

                        {/* 회원가입 버튼 */}
                        <Button
                            variant="secondary"
                            onClick={handleSignupClick}
                            width="full"
                            ariaLabel="회원가입 버튼"
                            className="signup-button-new"
                        >
                            회원가입
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
