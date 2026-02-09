import Nav from "./Nav";
import {
  Calendar,
  FoldedDocument,
  Megaphone,
  OpenedBookBookmark,
  // StarShield,
  User,
} from "../../../icons";
import { cn, getProfileImageUrl } from "../../../libs/utils";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { useMenteeProfile } from "../../../hooks/useMenteeProfile";

// path 수정 필요
const manageSchedule = [
  {
    name: "오늘의 학습",
    Icon: Calendar,
    path: "/mentee/dashboard",
  },
  // {
  //   name: "약점 솔루션",
  //   Icon: StarShield,
  //   path: "/mentee/solution",
  // },
  {
    name: "주간 리포트",
    Icon: FoldedDocument,
    path: "/mentee/report",
  },
  {
    name: "복습 아카이브",
    Icon: OpenedBookBookmark,
    path: "/mentee/archive",
  },
];

const myInfo = [
  {
    name: "알림 센터",
    Icon: Megaphone,
    path: "/mentee/notification",
  },
  {
    name: "마이 페이지",
    Icon: User,
    path: "/mentee/my-page",
  },
];

const MenteeNav = ({ isOpen }: { isOpen?: boolean }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useAuthStore((state) => state.user);
    const nickname = useAuthStore((state) => state.nickname);
    const { data: profile } = useMenteeProfile();
    const displayName = user?.name || nickname || '-';
    const profileImageUrl = getProfileImageUrl(profile?.profileUrl);
    const isActive = (path: string) => {
        return path === pathname;
    }
  return (
    <Nav isOpen={isOpen}>
      <button
        type="button"
        onClick={() => navigate('/mentee/profile')}
        className="flex flex-col w-60 bg-gray-800 rounded-400 py-300 px-250 border border-gray-600 gap-100 text-left cursor-pointer hover:bg-gray-700/80 transition-colors"
        aria-label="프로필 작성 페이지로 이동"
      >
        <div className="flex gap-150 items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center overflow-hidden shrink-0">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <p className="heading-4 font-weight-bold text-white">{displayName[0] || '-'}</p>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="heading-4 font-weight-bold text-white truncate">{displayName}</p>
            <p className="heading-6 text-gray-300 truncate">{user?.school || '학교를 설정해주세요'}</p>
          </div>
        </div>
        <p className="subtitle-2 text-gray-500 h-[19px]">
          {[user?.dDay, user?.targetSchool].filter(Boolean).join(' | ') || '-'}
        </p>
      </button>

      {/* manage schedule */}
      <div className="flex flex-col gap-100 w-full">
        <p className="px-300 text-white text-50 line-height-50 letter-spacing-0 font-600">
          일정 관리
        </p>
        <ul className="layout-nav__menu">
          {manageSchedule.map((item) => (
            <li key={item.name} className={cn("layout-nav__link", isActive(item.path) ? "layout-nav__link--active" : "")} onClick={() => navigate(item.path)}>
              <span className="layout-nav__link-icon" aria-hidden>
                <item.Icon
                  className={cn("w-6 h-6 shrink-0", isActive(item.path) ? "text-white" : "text-gray-300")}
                  aria-label={item.name}
                />
              </span>
              <span className={cn(isActive(item.path) ? "text-white" : "text-gray-300")}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* my info */}
      <div className="flex flex-col gap-100 w-full">
        <p className="px-300 text-white text-50 line-height-50 letter-spacing-0 font-600">
          내 정보
        </p>
        <ul className="layout-nav__menu">
          {myInfo.map((item) => (
            <li key={item.name} className={cn("layout-nav__link", isActive(item.path) ? "layout-nav__link--active" : "")} onClick={() => navigate(item.path)}>
              <span className="layout-nav__link-icon" aria-hidden>
                <item.Icon
                  className={cn("w-6 h-6 shrink-0 text-gray-300", isActive(item.path) ? "text-white" : "")}
                  aria-label={item.name}
                />
              </span>
              <span className={cn("text-100 text-gray-300", isActive(item.path) ? "text-white" : "")}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Nav>
  );
};

export default MenteeNav;
