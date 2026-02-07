import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputForm from "../../components/common/form/InputForm";
import { validateEmail } from "../../libs/validation/email";
import { validatePassword, validatePasswordConfirm } from "../../libs/validation/password";
import Button from "../../components/common/button/Button";
import { useApi } from "../../hooks/useApi";
import type {
    LoginResponse,
    VerifyCodeResponse,
    ValidateNicknameResponse
} from "../../libs/types/apiResponse";
import useAuthStore from "../../stores/authStore";
import Container from "../../components/common/Container";
import '../../styles/pages/auth.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role');

    const [email, setEmail] = useState({ value: "", error: "", success: "" });
    const [code, setCode] = useState({ value: "", error: "", success: "" });
    const [password, setPassword] = useState({ value: "", error: "", success: "" });
    const [passwordConfirm, setPasswordConfirm] = useState({ value: "", error: "", success: "" });
    const [name, setName] = useState({ value: "", error: "", success: "" });
    const [nickname, setNickname] = useState({ value: "", error: "", success: "" });

    const [emailVerifyToken, setEmailVerifyToken] = useState("");
    const [emailOver, setEmailOver] = useState(false);
    const [codeOver, setCodeOver] = useState(false);

    const { apiCall: codeApiCall, isLoading : codeIsLoading } = useApi();
    const { apiCall: nicknameApiCall, isLoading: nicknameIsLoading } = useApi();
    const { apiCall: signupApiCall, isLoading: signupIsLoading } = useApi();

    const { login } = useAuthStore();

    const handleBackClick = () => {
        navigate(`/login${role ? `?role=${role}` : ''}`);
    };

    const sendCode = () => {
        codeApiCall("/auth/email/send", "POST", { email: email.value }).then(response => {
            if (response.status === 204) {
                setEmail(prev => ({ ...prev, success: "코드가 발송되었습니다. 이메일을 확인해주세요." }))
                setEmailOver(true);
            } else {
                setEmail(prev => ({ ...prev, error: "이미 존재하는 이메일입니다." }));
            }
        });
    }

    const validateCode = () => {
        codeApiCall<VerifyCodeResponse>("/auth/email/verify", "POST", { email: email.value, code: code.value }).then(response => {
            if (response.status === 200) {
                if (response.data && response.data.emailVerifyToken) {
                    setEmailVerifyToken(response.data.emailVerifyToken as string);
                    setCodeOver(true);
                    setCode(prev => ({ ...prev, success: "인증되었습니다."}))
                }
            } else {
                setCode(prev => ({ ...prev, error: "코드가 일치하지 않습니다."}));
            }
        });
    }

    const validateNickName = () => {
        nicknameApiCall<ValidateNicknameResponse>("/auth/validate/nickname", "POST", { nickname: nickname.value }).then(response => {
            if (response.status === 200 && response.data?.available === true) {
                setNickname(prev => ({ ...prev, error: "", success: "사용 가능한 닉네임입니다." }));
            } else {
                setNickname(prev => ({ ...prev, error: "이미 존재하는 닉네임입니다.", success: "" }));
            }
        });
    }

    const signup = () => {
        signupApiCall("/auth/signup/email", "POST", { emailVerifyToken, nickname: nickname.value, password: password.value, name: name.value }).then(response => {
            if (response.status === 201 || response.status === 200) {
                signupApiCall<LoginResponse>("/auth/login/email", "POST", { email: email.value, password: password.value }).then(loginResponse => {
                    if (loginResponse.status === 200 && loginResponse.data?.accessToken && loginResponse.data?.nickname) {
                        const userRole = loginResponse.data.role ?? (role === 'mentor' ? 'MENTOR' : 'MENTEE');
                        login(loginResponse.data.accessToken, loginResponse.data.nickname, userRole);
                        const dashboardPath = userRole === 'MENTOR' ? '/mentor-dashboard' : '/mentee-dashboard';
                        navigate(dashboardPath);
                    }
                });
            }
        })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emailValue = e.target.value;
        const validation = validateEmail(emailValue);
        setEmail({ value: emailValue, ...validation });
        setEmailOver(false);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(prev => ({ ...prev, value: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordValue = e.target.value;
        const validation = validatePassword(passwordValue);
        setPassword({ value: passwordValue, ...validation });
        if (passwordConfirm) {
            const validation = validatePasswordConfirm(passwordConfirm.value, passwordValue);
            setPasswordConfirm(prev => ({...prev, ...validation }));
        }
    };

    const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const passwordConfirmValue = e.target.value;
        const validation = validatePasswordConfirm(passwordConfirmValue, password.value);
        setPasswordConfirm({ value: passwordConfirmValue, ...validation });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(prev => ({ ...prev, value: e.target.value }));
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(prev => ({ ...prev, value: e.target.value }));
    };

    return (
        <Container>
            <div className="auth-page">
                <div className="auth-header">
                    <button className="back-link" onClick={handleBackClick}>
                        ← 돌아가기
                    </button>
                    <h1 className="auth-title">
                        {role ? `${role === 'mentee' ? '멘티' : '멘토'} ` : ''}회원가입
                    </h1>
                    <p className="auth-subtitle">SeolStudy와 함께 시작하세요</p>
                </div>

                <div className="auth-form">
                    <InputForm
                        title="이메일" 
                        type="email" 
                        value={email.value} 
                        onChange={handleEmailChange} 
                        ariaLabel="signup email" 
                        error={email.error} 
                        success={email.success}
                        readOnly={emailOver}
                        button={{
                            text: "확인",
                            onClick: sendCode,
                            variant: "primary",
                            disabled: email.value.length === 0 || !!email.error || emailOver || codeIsLoading
                        }}
                    />
                    <InputForm
                        title="인증코드" 
                        type="text" 
                        value={code.value} 
                        onChange={handleCodeChange} 
                        ariaLabel="signup code" 
                        error={code.error} 
                        success={code.success}
                        readOnly={codeOver}
                        button={{
                            text: "인증",
                            onClick: validateCode,
                            variant: "primary",
                            disabled: !emailOver || code.value.length === 0 || codeOver
                        }}
                    />
                    <InputForm
                        title="비밀번호" 
                        type="password" 
                        value={password.value} 
                        onChange={handlePasswordChange} 
                        ariaLabel="signup password" 
                        error={password.error} 
                        success={password.success}
                    />
                    <InputForm
                        title="비밀번호 확인" 
                        type="password" 
                        value={passwordConfirm.value} 
                        onChange={handlePasswordConfirmChange} 
                        ariaLabel="signup password confirm" 
                        error={passwordConfirm.error} 
                        success={passwordConfirm.success}
                    />
                    <InputForm
                        title="이름"
                        type="text"
                        value={name.value}
                        onChange={handleNameChange}
                        ariaLabel="signup name"
                        error={name.error}
                        success={name.success}
                    />
                    <InputForm
                        title="닉네임" 
                        type="text" 
                        value={nickname.value} 
                        onChange={handleNicknameChange} 
                        ariaLabel="signup nickname" 
                        error={nickname.error} 
                        success={nickname.success}
                        button={{
                            text: "확인",
                            onClick: validateNickName,
                            variant: "primary",
                            disabled: nickname.value.length === 0 || nicknameIsLoading || signupIsLoading
                        }}
                    />
                    
                    <Button onClick={signup} ariaLabel="signup" width="full">
                        회원가입
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default SignupPage;