import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../libs/axios';

// useSession, SessionGuard, SessionProvider 선언
type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface Session {
  id: number;
  nickname: string;
  role: 'MENTEE' | 'MENTOR';
}

type SessionContextValue = {
  status: SessionStatus;
  session: Session | null;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const SESSION_ENDPOINT = '/auth/me'; // 세션 확인용 엔드포인트 (같은 axios → 401 시 인터셉터에서 refresh/로그아웃 처리)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<SessionStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);

  const refreshSession = useCallback(async () => {
    try {
      const res = await axios.get<Session | false>(SESSION_ENDPOINT);
      const valid = res.status === 200 && res.data !== false && res.data != null;
      if (valid) {
        setSession(res.data as Session);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch {
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  // 세션 fetch는 SessionGuard가 마운트될 때만 수행 (보호된 라우트 진입 시). 단일 책임.
  const value: SessionContextValue = {
    status,
    session,
    isAuthenticated: status === 'authenticated',
    refreshSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession은 SessionProvider 안에서만 사용하세요.');
  return ctx;
};

const loginPathByRole: Record<'MENTEE' | 'MENTOR', string> = {
  MENTEE: '/login/mentee',
  MENTOR: '/login/mentor',
};

export const SessionGuard = ({
  role,
  children,
}: {
  role: 'MENTEE' | 'MENTOR';
  children?: ReactNode;
}) => {
  const { status, session, refreshSession } = useSession();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 보호된 라우트 진입 시 + pathname 변경 시에만 세션 재검증 (세션 fetch는 여기서만 발생)
  useEffect(() => {
    void refreshSession();
  }, [pathname, refreshSession]);
  const sessionRole = session?.role;

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && sessionRole !== role)) {
      navigate(loginPathByRole[role], { replace: true });
    }
  }, [status, sessionRole, role, navigate]);

  if (status !== 'authenticated' || sessionRole !== role) {
    return null;
  }

  return <>{children}</>;
};