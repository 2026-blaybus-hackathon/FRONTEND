import { useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { OAuthLoginResponse } from "../../libs/types/apiResponse";

const OAuthCallbackPage = () => {
  const { apiCall, isLoading } = useApi();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [params] = useSearchParams();
  const code = params.get("code");

  const isCalled = useRef(false);

  const tryLogin = () => {
    if (isLoading || isCalled.current) return;
    isCalled.current = true;

    if (!code) {
      navigate("/main", { replace: true });
      return;
    }

    apiCall<OAuthLoginResponse>("/auth/login/google", "POST", {
      code: code,
      provider: "GOOGLE",
    }).then((response) => {
      if (response.status === 200 && response.data && typeof response.data === 'object' && 'nickname' in response.data) {
        login(response.data?.accessToken as string, response.data?.nickname as string);
        navigate("/mentor-dashboard", { replace: true });
      } else if (response.status === 303) {
        const data: any = response.data || {};
        const token = data.accessToken || data.socialSignUpToken || data.signUpToken || data.token;
        if (token) {
          navigate("/oauth2/signup", { replace: true, state: { socialSignUpToken: token } });
        } else {
          navigate("/main", { replace: true });
        }
      } else {
        navigate("/main", { replace: true });
      }
    });
  }

  useEffect(() => {
    tryLogin();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-gray-600">로그인 중...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
