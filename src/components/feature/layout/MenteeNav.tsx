import Nav from "./Nav";
import {
  Calendar,
  FoldedDocument,
  Megaphone,
  OpenedBookBookmark,
  StarShield,
  User,
} from "../../../icons";
import { cn } from "../../../libs/utils";
import { useLocation, useNavigate } from "react-router-dom";

// path 수정 필요
const manageSchedule = [
  {
    name: "오늘의 학습",
    Icon: Calendar,
    path: "/mentee/today",
  },
  {
    name: "약점 솔루션",
    Icon: StarShield,
    path: "/mentee/solution",
  },
  {
    name: "리포트",
    Icon: FoldedDocument,
    path: "/mentee/report",
  },
  {
    name: "학습 보관함",
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

const MenteeNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isActive = (path: string) => {
        return path === pathname;
    }
  return (
    <Nav>
      {/* mentee card */}
      <div className="flex flex-col w-60 bg-gray-800 rounded-400 py-300 px-250 border border-gray-600 gap-100">
        <div className="flex gap-150 items-center">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
            <p className="heading-4 font-weight-bold text-white">홍</p>
          </div>
          <div className="flex flex-col">
            <p className="heading-4 font-weight-bold text-white">홍길동</p>
            <p className="heading-6 text-gray-300">한국고등학교 2학년</p>
          </div>
        </div>
        <p className="subtitle-2 text-gray-500 h-[19px]">D- 312 | 서울대학교</p>
      </div>

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
