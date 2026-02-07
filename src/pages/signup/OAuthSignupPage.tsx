import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputForm from "../../components/common/form/InputForm";
import Button from "../../components/common/button/Button";
import { useApi } from "../../hooks/useApi";
import type { OAuthSignupResponse, ValidateNicknameResponse } from "../../libs/types/apiResponse";
import useAuthStore from "../../stores/authStore";
import Container from "../../components/common/Container";
import '../../styles/pages/auth.css';

const OAuthSignupPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { socialSignUpToken?: string } | null;
    const socialSignUpToken = state?.socialSignUpToken;

    const { login } = useAuthStore();

    useEffect(() => {
        if (!socialSignUpToken) {
            navigate("/main", { replace: true });
        }
    }, [socialSignUpToken, navigate]);

    const [nickname, setNickname] = useState({ value: "", error: "", success: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const { apiCall: nicknameValidateApiCall, isLoading: nicknameValidateIsLoading } = useApi();
    const { apiCall: submitApiCall, isLoading: submitIsLoading } = useApi();

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname((prev) => ({ ...prev, value: e.target.value }));
    };

    const validateNickname = () => {
        nicknameValidateApiCall<ValidateNicknameResponse>("/auth/validate/nickname", "POST", { nickname: nickname.value }).then((response) => {
            if (response.status === 200 && response.data?.available === true) {
                setNickname((prev) => ({ ...prev, error: "", success: "사용 가능한 닉네임입니다." }));
            } else {
                setNickname((prev) => ({ ...prev, error: "이미 존재하는 닉네임입니다.", success: "" }));
            }
        });
    };

    const handleSubmit = () => {
        if (!socialSignUpToken) return;
        submitApiCall<OAuthSignupResponse>("/auth/signup/google", "POST", { socialSignUpToken, nickname: nickname.value }).then((response) => {
            if ((response.status === 200 || response.status === 201) && response.data?.accessToken && response.data?.nickname) {
                login(response.data.accessToken, response.data.nickname);
                navigate("/mentor-dashboard");
            } else if (response.status === 409) {
                setErrorMessage("이미 존재하는 이메일입니다. 로그인 화면으로 돌아갑니다...");
                setIsButtonDisabled(true);
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            } else {
                navigate("/login");
            }
        });
    };

    const nicknameValid = nickname.value.length > 0 && !nickname.error && nickname.success;
    const canSubmit = nicknameValid && !nicknameValidateIsLoading && !submitIsLoading && !isButtonDisabled;

    return (
        <Container>
            <div className="auth-page">
                <div className="auth-header">
                    <h1 className="auth-title">소셜 회원가입</h1>
                    <p className="auth-subtitle">소셜 계정이 인증되었습니다. 닉네임을 입력해주세요.</p>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                </div>

                <div className="auth-form">
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
                            onClick: validateNickname,
                            variant: "primary",
                            disabled: nickname.value.length === 0 || nicknameValidateIsLoading || submitIsLoading,
                        }}
                    />
                    
                    <Button
                        onClick={handleSubmit}
                        ariaLabel="signup"
                        width="full"
                        disabled={!canSubmit}
                    >
                        회원가입
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default OAuthSignupPage;
