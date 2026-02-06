import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button/Button";
import EmailInput from "../../components/common/input/EmailInput";
import PasswordInput from "../../components/common/input/PasswordInput";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import type { LoginResponse } from "../../libs/types/apiResponse";
import type { UserRole } from "../../libs/types/user";

const ROLE_LABEL: Record<UserRole, string> = {
  MENTOR: "멘토",
  MENTEE: "멘티",
};

const LoginPage = () => {
  const navigate = useNavigate();
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
    navigate("/signup");
  };

  const handleLogin = () => {
    apiCall<LoginResponse>("/auth/login/email", "POST", { email, password }).then(
      (response) => {
        if (response.status === 200 && response.data?.accessToken) {
          const { accessToken, nickname, role } = response.data;
          const userRole = role ?? "MENTEE";
          login(accessToken, nickname, userRole);
          const roleLabel = ROLE_LABEL[userRole];
          // 멘토/멘티 구별 메시지 후 메인으로 이동
          alert(`${roleLabel} || ${nickname}(으)로 로그인되었습니다.`);
          navigate("/");
        } else if (response.status === 401) {
          setError("이메일 또는 비밀번호가 잘못되었습니다.");
        } else {
          setError("서버 오류가 발생했습니다.");
        }
      }
    );
  };



  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);


  return (
    <div className="flex flex-col justify-center items-center w-80 m-auto">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="mb-4 w-full text-center text-primary">로그인</h1>

        <div className="flex flex-col gap-2">
          <EmailInput
            value={email}
            onChange={handleEmailChange}
            width="full"
            ariaLabel="로그인 이메일란"
          />
        </div>

        <div className="flex flex-col gap-2">
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            width="full"
            ariaLabel="로그인 비밀번호란"
          />
          {error && <p className="caption text-danger">{error}</p>}
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
  );
};

export default LoginPage;
