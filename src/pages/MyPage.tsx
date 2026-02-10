import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../libs/axios';
import { User, Settings, HelpCircle, LogOut, Users, Clock, Flag } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { useMenteeProfile } from '../hooks/useMenteeProfile';
import { getProfileImageUrl } from '../libs/utils';

interface MentorDashboardStats {
  totalMenteeCount: number;
  averageProgress: number;
  progressChange: number;
  pendingFeedbackCount?: number;
  averageStudyTimeHours?: number;
}

const menuItems = [
  { label: '프로필 설정', Icon: User, path: 'profile' },
  { label: '환경설정', Icon: Settings, path: '#' },
  { label: '도움말', Icon: HelpCircle, path: '#' },
];

const MyPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const nickname = useAuthStore((state) => state.nickname);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  const isMentee = role === 'MENTEE';
  const isMentor = role === 'MENTOR';
  const canEditProfile = isMentee || isMentor;
  const { data: profile } = useMenteeProfile({
    enabled: canEditProfile,
  });
  const displayName = user?.name || nickname || profile?.name || '사용자';
  const initial = displayName[0] || '?';
  const school = user?.school || profile?.schoolName || '학교 정보 없음';
  const subjectLine = role === 'MENTOR' ? '담당 과목: 국어, 수학' : null;
  const profileImageUrl = getProfileImageUrl(profile?.profileUrl);

  const { data: mentorDashboard } = useQuery({
    queryKey: ['mentorDashboard'],
    queryFn: async () => {
      const res = await axios.get<{ stats: MentorDashboardStats }>('/dashboard/mentor/dashboard');
      return res.data?.stats ?? null;
    },
    enabled: isMentor,
  });

  const handleLogout = () => {
    logout();
    navigate('/main');
  };

  const cardBase =
    'bg-white border border-gray-200 rounded-lg transition-shadow';

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full">
      {/* 프로필 카드 */}
      <div
        className={`${cardBase} flex items-center gap-6 p-6 md:p-8 w-full`}
      >
        <div
          className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[var(--color-primary-500)] text-white text-xl md:text-2xl font-semibold flex items-center justify-center shrink-0 overflow-hidden"
          aria-hidden
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt=""
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 m-0 mb-2 leading-tight">
            {displayName}
          </h1>
          <p className="text-sm text-gray-600 m-0 leading-normal">{school}</p>
          {subjectLine && (
            <p className="text-sm text-gray-600 mt-1 m-0 leading-normal">
              {subjectLine}
            </p>
          )}
        </div>
      </div>

      {/* 멘토 전용: 나의 멘티 현황 */}
      {isMentor && (
        <section className="w-full" aria-label="나의 멘티 현황">
          <h2 className="text-base font-semibold text-gray-800 m-0 mb-4">
            나의 멘티 현황
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className={`${cardBase} p-6 flex flex-col items-start gap-2`}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-orange-100 text-orange-600"
                aria-hidden
              >
                <Users size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 leading-tight">
                {mentorDashboard ? `${mentorDashboard.totalMenteeCount}명` : '-'}
              </div>
              <div className="text-sm text-gray-600 m-0">멘티 수</div>
            </div>
            <div
              className={`${cardBase} p-6 flex flex-col items-start gap-2`}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-blue-100 text-blue-600"
                aria-hidden
              >
                <Clock size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 leading-tight">
                {mentorDashboard?.averageStudyTimeHours != null
                  ? `${mentorDashboard.averageStudyTimeHours}시간`
                  : '-'}
              </div>
              <div className="text-sm text-gray-600 m-0">평균 학습 시간</div>
            </div>
            <div
              className={`${cardBase} p-6 flex flex-col items-start gap-2`}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 bg-pink-100 text-pink-600"
                aria-hidden
              >
                <Flag size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-900 leading-tight">
                {mentorDashboard != null
                  ? `${Math.round(mentorDashboard.averageProgress)}%`
                  : '-'}
              </div>
              <div className="text-sm text-gray-600 m-0">평균 과제 완료율</div>
            </div>
          </div>
        </section>
      )}

      {/* 메뉴 카드 */}
      {menuItems.map(({ label, Icon, path }) => (
        <button
          key={label}
          type="button"
          className={`${cardBase} flex items-center gap-4 w-full text-left cursor-pointer py-4 px-6 text-base font-medium text-gray-900 hover:bg-gray-50 hover:shadow-sm`}
          onClick={() => {
            if (label === '프로필 설정' && canEditProfile && path === 'profile') {
              navigate(role === 'MENTOR' ? '/mentor/profile' : '/mentee/profile');
            } else if (path !== '#') {
              navigate(path.startsWith('/') ? path : (role === 'MENTOR' ? `/mentor/${path}` : `/mentee/${path}`));
            }
          }}
          aria-label={label}
        >
          <Icon className="shrink-0 text-gray-600" size={24} aria-hidden />
          <span>{label}</span>
        </button>
      ))}

      <button
        type="button"
        className={`${cardBase} flex items-center gap-4 w-full text-left cursor-pointer py-4 px-6 text-base font-medium text-gray-900 border-2 border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)]`}
        onClick={handleLogout}
        aria-label="로그아웃"
      >
        <LogOut
          className="shrink-0 text-[var(--color-primary-500)]"
          size={24}
          aria-hidden
        />
        <span className="font-medium">로그아웃</span>
      </button>
    </div>
  );
};

export default MyPage;
