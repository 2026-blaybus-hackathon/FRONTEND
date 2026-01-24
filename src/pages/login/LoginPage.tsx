import { useState, useEffect } from "react";
import Button from "../../components/common/button/Button";
import EmailInput from "../../components/common/input/EmailInput";
import PasswordInput from "../../components/common/input/PasswordInput";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

interface LoginResponse {
    accessToken: string;
    nickname: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const { apiCall, isLoading } = useApi();
    const [password, setPassword] = useState("");
    const { isLoggedIn, login } = useAuthStore();

    // 에러를 key로 저장
    const [error, setError] = useState<null | string>(null);

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
        navigate("/signup")
    }

    const handleLogin = () => {
        // 로그인 로직 처리 후 에러 발생 시
        apiCall<LoginResponse>('/auth/login/email', 'POST', {
            email,
            password
        })
        .then((response) => {
            if (response.status === 200 && response.data?.accessToken) {
                login(response.data.accessToken, response.data.nickname);
                navigate("/");
            } else if (response.status === 401) {
                setError("이메일 또는 비밀번호가 잘못되었습니다.");
            } else {
                alert("Server Error");
            }
        });
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="flex flex-col justify-center items-center w-80 m-auto">
            <div className="flex flex-col gap-2 w-full">
                <h1 className="mb-4 w-full text-center">
                    로그인
                </h1>
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
                        onChange={handlePasswordChange}
                        value={password}
                        width="full"
                        ariaLabel="로그인 비밀번호란"
                    />
                    {error && <p className="caption text-error">{error}</p>}
                </div>

                <Button
                    onClick={handleLogin}
                    disabled={!isLoginValid || isLoading}
                    width="full"
                    ariaLabel={"로그인 버튼"}
                >
                    로그인
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleSignupClick}
                    width="full"
                    ariaLabel={"회원가입 버튼"}
                >
                    회원가입
                </Button>
            </div>

            <div className="mt-4 mb-6 flex justify-center items-center gap-3">
                <div className="w-30 h-[1px] bg-gray-2" />
                <span className="text-gray-3">or</span>
                <div className="w-30 h-[1px] bg-gray-2" />
            </div>

            <GoogleButton />
        </div>
    );
};


const GoogleButton = () => {
    const OAuthLoginUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
        `client_id=${encodeURIComponent(import.meta.env.VITE_PUBLIC_GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(import.meta.env.VITE_PUBLIC_GOOGLE_REDIRECT_URI)}` +
        "&response_type=code" + "&scope=email%20openid%20profile" + "&access_type=offline" + "&prompt=select_account";

    const handleGoogleLogin = () => {
        window.location.href = OAuthLoginUrl;
    }

    return (
        <button className="my-0 mx-auto border-none bg-transparent cursor-pointer w-45" onClick={handleGoogleLogin}>
            <img src="/googleSignupButton.png" alt="google" />
        </button>       
    );
}

export default LoginPage;
