import Nav from "./Nav";
import { Users, Calendar, FoldedDocument, Folder, BarChart, Clock } from "../../../icons";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../../libs/utils";

const mentoMenu = [
  {
    name: "멘티 관리",
    Icon: Users,
    path: "/mentor/mentee",
  },
  {
    name: "피드백 관리",
    Icon: Calendar,
    path: "/mentor/feedback",
  },
  {
    name: "과제 관리",
    Icon: FoldedDocument,
    path: "/mentor/assignment",
  },
  {
    name: "학습 자료 관리",
    Icon: Folder,
    path: "/mentor/material",
  },
  {
    name: "리포트",
    Icon: BarChart,
    path: "/mentor/report",
  },
  {
    name: "보관함",
    Icon: Clock,
    path: "/mentor/archive",
  }
]

const MentorNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => {
    return path === pathname;
  }

  return (
    <Nav>
        <ul className="list-none margin-0 padding-0 flex flex-col flex-1 desktop:gap-500 gap-200">
          {mentoMenu.map((item) => (
            <li key={item.name} className={cn("layout-nav__link", isActive(item.path) ? "layout-nav__link--active" : "")} onClick={() => navigate(item.path)}>
              <span className="layout-nav__link-icon" aria-hidden>
                <item.Icon
                  className={cn("w-6 h-6 shrink-0", isActive(item.path) ? "text-white" : "text-gray-300")}
                  aria-label={item.name}
                />
              </span>
              <span className={cn("heading-6", isActive(item.path) ? "text-white" : "text-gray-300")}>{item.name}</span>
            </li>
          ))}
        </ul>
    </Nav>
  );
};

export default MentorNav;