import { useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import useAuthStore from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import type { OAuthLoginResponse } from "../../libs/types/apiResponse";

const OAuthCallbackPage = () => {
  const { apiCall, isLoading } = useApi();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  const isCalled = useRef(false);

  const tryLogin = () => {
    if (isLoading || isCalled.current) return;
    isCalled.current = true;

    // redirect
    if (!code) {
      navigate("/login", { replace: true });
    }

    apiCall<OAuthLoginResponse>("/auth/login/google", "POST", {
      code: code,
      socialType: "GOOGLE",
    }).then((response) => {
      if (response.status === 200 && response.data && typeof response.data === 'object' && 'nickname' in response.data) {
        // 로그인 처리
        login(response.data?.accessToken as string, response.data?.nickname as string);
        // 필요하면 홈으로 이동
        navigate("/", { replace: true });
      } else if (response.status === 303) {
        // 회원가입이 필요한 경우 signup 페이지로 token 전달
        const data: any = response.data || {};
        const token = data.accessToken || data.socialSignUpToken || data.signUpToken || data.token;
        if (token) {
          // router로 전달
          navigate("/oauth2/signup", { replace: true, state: { socialSignUpToken: token } });
        } else {
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    });
  }

  useEffect(() => {
    tryLogin();
  }, []);

  return <div>Loading...</div>;
};

export default OAuthCallbackPage;
