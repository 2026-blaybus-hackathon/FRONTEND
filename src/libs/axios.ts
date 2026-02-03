import axios from "axios";
import Cookies from "js-cookie";
import useAuthStore from "../stores/authStore";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    config => {
        // 쿠키에서 access_token 가져오기
        const accessToken = Cookies.get('access_token');

        // access_token이 있으면 헤더에 추가
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        // 요청 오류가 있는 경우 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const config = error.config;
        // /auth/login에서 401 에러가 발생한 경우 바로 에러 반환
        if (error.response?.status === 401 && config.url === '/auth/login/email') {
            return Promise.reject(error);
        }

        // 403 Forbidden / 401 Unauthorized → _retry 기준 refetch 후 실패 시 로그아웃
        const shouldRetry = (error.response?.status === 401 || error.response?.status === 403) && !config._retry;
        if (shouldRetry) {
            config._retry = true;

            try {
                return axios.post('/auth/refresh', {}, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL
                }).then(response => {
                    const newAccessToken = response.data.accessToken;
                    Cookies.set('access_token', newAccessToken);
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(config);
                }).catch(refreshError => {
                    if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
                        handleLogout();
                    }
                    return Promise.reject(refreshError);
                });
            } catch (err) {
                return Promise.reject(err);
            }
        }
        
        // 응답 오류가 있는 경우 처리
        return Promise.reject(error);
    }
);

// 로그아웃 처리
async function handleLogout() {
    return axios.post('/auth/logout', {}, {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL
    }).then(() => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        useAuthStore.getState().logout();
        window.location.reload(); // 재진입 시 SessionGuard의 refreshSession → 401 → 리다이렉트
    }).catch(refreshError => {
        // refresh 요청도 401이면 로그아웃
        if (refreshError.response?.status === 401) {
            handleLogout();
        }
        return Promise.reject(refreshError);
    });
}

export default axiosInstance;