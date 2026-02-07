import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/button/Button";
import EmailInput from "../../components/common/input/EmailInput";
import PasswordInput from "../../components/common/input/PasswordInput";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import Container from "../../components/common/Container";
import '../../styles/pages/auth.css';

interface LoginResponse {
    accessToken: string;
    nickname: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role'); // mentee or mentor
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleLogin = () => {
        apiCall<LoginResponse>('/auth/login/email', 'POST', {
            email,
            password
        })
        .then((response) => {
            if (response.status === 200 && response.data?.accessToken) {
                login(response.data.accessToken, response.data.nickname);
                navigate("/mentor-dashboard");
            } else if (response.status === 401) {
                setError("이메일 또는 비밀번호가 잘못되었습니다.");
            } else {
                alert("Server Error");
            }
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/mentor-dashboard");
        }
    }, [isLoggedIn, navigate]);

    return (
        <Container>
            <div className="auth-page">
                <div className="auth-header">
                    <button className="back-link" onClick={handleBackClick}>
                        ← 돌아가기
                    </button>
                    <h1 className="auth-title">
                        {role ? `${role === 'mentee' ? '멘티' : '멘토'} ` : ''}로그인
                    </h1>
                    <p className="auth-subtitle">SeolStudy에 오신 것을 환영합니다</p>
                </div>

                <div className="auth-form">
                    <div className="form-group">
                        <EmailInput
                            value={email}
                            onChange={handleEmailChange}
                            width="full"
                            ariaLabel="로그인 이메일란"
                        />
                    </div>

                    <div className="form-group">
                        <PasswordInput
                            onChange={handlePasswordChange}
                            value={password}
                            width="full"
                            ariaLabel="로그인 비밀번호란"
                        />
                        {error && <p className="error-message">{error}</p>}
                    </div>

                    <Button
                        onClick={handleLogin}
                        disabled={!isLoginValid || isLoading}
                        width="full"
                        ariaLabel="로그인 버튼"
                    >
                        로그인
                    </Button>
                    
                    <Button
                        variant="secondary"
                        onClick={handleSignupClick}
                        width="full"
                        ariaLabel="회원가입 버튼"
                    >
                        회원가입
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default LoginPage;
