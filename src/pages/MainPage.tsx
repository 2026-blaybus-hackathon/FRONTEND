import { useNavigate } from 'react-router-dom';
import Button from '../components/common/button/Button';

const MainPage = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return(
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#6366F1' }}>
                    📖 SeolStudy
                </h1>
                <p className="text-lg" style={{ color: '#6B7280' }}>
                    학습 관리 플랫폼 (베타)
                </p>
            </div>
            
            <div className="flex gap-4">
                <Button
                    onClick={handleLoginClick}
                    ariaLabel="로그인 페이지로 이동"
                    size="lg"
                >
                    로그인
                </Button>
                <Button
                    onClick={handleSignupClick}
                    variant="secondary"
                    ariaLabel="회원가입 페이지로 이동"
                    size="lg"
                >
                    회원가입
                </Button>
            </div>
        </div>
    )
}

export default MainPage