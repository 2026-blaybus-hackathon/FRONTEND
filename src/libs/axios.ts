import axios from "axios";
import Cookies from "js-cookie";

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
        // FormData일 때 Content-Type 제거 → 브라우저가 multipart/form-data; boundary= 설정
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = false as unknown as string;
        }
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
        
        // 401 Unauthorized 에러 처리 - 토큰 갱신 시도
        if (error.response?.status === 401 && !config._retry) {
            config._retry = true;
            
            try {
                // /auth/refresh에 Bearer refreshToken을 헤더에 붙여서 요청
                return axios.post('/auth/refresh', {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                    baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL
                }).then(response => {
                    // refresh 성공 시 새로운 access token을 쿠키에 저장
                    const newAccessToken = response.data.accessToken;
                    Cookies.set('access_token', newAccessToken);
                    
                    // 새로운 access token으로 원래 요청 재시도
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(config);
                }).catch(refreshError => {
                    // refresh 요청도 401이면 로그아웃
                    if (refreshError.response?.status === 401) {
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
        window.location.href = '/';
    }).catch(refreshError => {
        // refresh 요청도 401이면 로그아웃
        if (refreshError.response?.status === 401) {
            handleLogout();
        }
        return Promise.reject(refreshError);
    });
}

export default axiosInstance;