import SearchInput from "../../components/common/input/SearchInput";
import { useState, useEffect } from "react";
import { cn } from "../../libs/utils";
import { Play, PlayReverse } from "../../icons";
import IconButton from "../../components/common/button/IconButton";
import Button from "../../components/common/button/Button";
import MarkdownEditor from "../../components/common/MarkdownEditor";

interface Mentee {
  id: number;
  name: string;
  school: string;
  grade: string;
  status: "WAITING_FEEDBACK" | "COMPLETED";
}

interface TodayAssignment {
  title: string;
  subject: "KOREAN" | "ENGLISH" | "MATH";
  date: string;
  status: "PENDING" | "COMPLETED";
  time: string;
}

// 데이터 예시 추후 삭제
const menteesExample: Mentee[] = [
  {
    id: 1,
    name: "John Doe",
    school: "가나고등학교",
    grade: "1",
    status: "WAITING_FEEDBACK",
  },
  {
    id: 2,
    name: "Jane Doe",
    school: "가나다고등학교",
    grade: "2",
    status: "COMPLETED",
  },
  {
    id: 3,
    name: "Jim Beam",
    school: "가나다라고등학교",
    grade: "3",
    status: "WAITING_FEEDBACK",
  },
  {
    id: 4,
    name: "John Doe",
    school: "John Doe",
    grade: "4",
    status: "COMPLETED",
  },
  {
    id: 5,
    name: "John Doe",
    school: "John Doe",
    grade: "5",
    status: "WAITING_FEEDBACK",
  },
  {
    id: 6,
    name: "John Doe",
    school: "John Doe",
    grade: "6",
    status: "COMPLETED",
  },
  {
    id: 7,
    name: "John Doe",
    school: "John Doe",
    grade: "7",
    status: "WAITING_FEEDBACK",
  },
];

const TodayAssignmentsExample: TodayAssignment[] = [
  {
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
  {
    title: "오늘의 과제",
    subject: "ENGLISH",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
  {
    title: "오늘의 과제",
    subject: "MATH",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
  {
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
  {
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
  {
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "10:00",
  },
]

const MentorFeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [mentees] = useState<Mentee[]>(menteesExample);
  const [selectedMentee, setSelectedMentee] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    const mqXl = window.matchMedia("(min-width: 1640px)");
    const mq2xl = window.matchMedia("(min-width: 1920px)");
    const update = () => {
      setPageSize(mq2xl.matches ? 5 : mqXl.matches ? 4 : 3);
    };
    update();
    mqXl.addEventListener("change", update);
    mq2xl.addEventListener("change", update);
    return () => {
      mqXl.removeEventListener("change", update);
      mq2xl.removeEventListener("change", update);
    };
  }, []);

  const lastPage = Math.ceil(mentees.length / pageSize);
  const effectivePage = Math.min(page, Math.max(0, lastPage - 1));
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <div className="lg:h-full flex flex-col gap-10">
      {/* 검색, 학생 리스트 */}
      <div className="flex flex-col gap-7.5">
        <SearchInput value={search} onChange={handleSearch} ariaLabel="search" className="w-45" />
        <div className="flex justify-between items-center">
          <IconButton variant="primary-line" Icon={<PlayReverse />} onClick={() => setPage(effectivePage - 1)} ariaLabel="previous page" disabled={effectivePage === 0}/>
          <div className="flex flex-1 flex-col sm:flex-row gap-100 lg:gap-500 justify-center">
            {mentees.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize).map((mentee) => (
              <
                MenteeListCard key={mentee.id} {...mentee}
                selected={selectedMentee === mentee.id}
                onClick={() => setSelectedMentee(mentee.id)}
              />
            ))}
          </div>
          <IconButton variant="primary-line" Icon={<Play />} onClick={() => setPage(effectivePage + 1)} ariaLabel="next page" disabled={effectivePage >= lastPage - 1}/>
        </div>
      </div>
      
      {/* 학생 과제 확인 */}
      <div className="w-full flex flex-1 flex-col-reverse md:flex-row gap-300 min-h-0">
        <div className="md:w-fit w-full flex flex-col md:gap-300 gap-100 overflow-y-auto min-h-0">
            {TodayAssignmentsExample.map((assignment, index) => (
              <MenteeAssignmentCard key={assignment.title + assignment.date + index.toString()} {...assignment} onClick={() => {}} />
            ))}
        </div>
        <div className="flex-1 flex flex-col px-10 py-8 bg-white rounded-600 border-1 border-gray-100 gap-7">
          <div className="flex flex-col gap-2">
            <p className="heading-6 font-weight-700 text-gray-800">종합 피드백</p>
            <p className="body-3 font-weight-500 text-gray-500">오늘의 과제 달성률과 전체적인 학습에 대해 피드백을 남겨주세요.</p>
          </div>
          <div className="flex-1">
            {/* 에디터 */}
            <MarkdownEditor value={feedback} setValue={setFeedback} />
          </div>
          <div className="w-full flex justify-end gap-100 h-fit">
            <Button variant="gray" onClick={() => {}} ariaLabel="임시 저장">임시 저장</Button>
            <Button onClick={() => {}} ariaLabel="피드백 등록" className="font-weight-700">피드백 등록</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MenteeListCardProps {
  id: number;
  name: string;
  profileImage?: string;
  school: string;
  grade: string;
  status: "WAITING_FEEDBACK" | "COMPLETED";
  selected: boolean;
  onClick: () => void;
}

const MenteeListCard = ({
  name,
  profileImage,
  school,
  grade,
  status,
  selected = false,
  onClick,
}: MenteeListCardProps) => {
  return (
    <div
      className={cn(
        "w-full md:h-45 xl:min-w-60 xl:w-fit lg:h-32 flex flex-col gap-3 rounded-[12px] py-150 lg:py-300 px-150 lg:px-250 relative overflow-hidden",
        "bg-white"
      )}
      onClick={onClick}
      aria-label={"학생 카드 - 클릭 시 학생 상세 보임"}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[12px] bg-[linear-gradient(90deg,#5D46DC_0%,#6F41DE_50%,#843CE0_100%)] transition-opacity duration-300",
          selected ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden
      />
      <div className="h-full relative z-10 flex flex-col justify-between">
        <div className="flex gap-150 flex-row sm:flex-col md:flex-row">
          {
            profileImage ?
            <img src={profileImage} alt={name} className="w-36 h-36 rounded-full" /> :
            <div className="min-w-12 min-h-12 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white heading-4 font-weight-500">{name[0]}</div>
          }
          <div className="flex flex-col">
            <p className={cn("heading-6 md:heading-4 font-weight-500", selected ? "text-white" : "text-gray-800", "transition-all duration-300")}>{name}</p>
            <div className={cn("subtitle-1 md:heading-6 flex flex-wrap gap-x-50", selected ? "text-white" : "text-gray-300", "transition-all duration-300")}>
              <p>{school} </p>
              <p>{grade}학년</p>
            </div>
          </div>
        </div>
        <p className={cn("subtitle-2 font-weight-500 text-right md:text-left", selected ? "text-white" : "text-gray-300", "transition-all duration-300")}>피드백 {status === "WAITING_FEEDBACK" ? "대기" : "완료"}</p>
      </div>
    </div>
  );
}

interface MenteeAssignmentCardProps {
  title: string;
  subject: "KOREAN" | "ENGLISH" | "MATH";
  date: string;
  status: "PENDING" | "COMPLETED";
  time: string;
  onClick: () => void;
}

const MenteeAssignmentCard = ({
  title,
  subject,
  date,
  status,
  time,
  onClick,
}: MenteeAssignmentCardProps) => {
  const subjectInfo = {
    "KOREAN": {
      label: "국어",
      style: "bg-green-100 text-green-500"
    },
    "ENGLISH": {
      label: "영어",
      style: "bg-red-100 text-red-500"
    },
    "MATH": {
      label: "수학",
      style: "bg-blue-100 text-blue-500"
    }
  }

  return (
    <div className="md:w-66 w-full rounded-600 py-150 px-200 gap-100 flex md:flex-col bg-white shadow-100 justify-between" onClick={onClick}>
      <div className="flex flex-col gap-50 md:gap-100">
        <span className={cn("w-fit body-4 font-weight-700 px-100 py-1 rounded-900", subjectInfo[subject].style)}>{subjectInfo[subject].label}</span>
        <p className="text-100 text-black font-weight-500">{title}</p>
      </div>
      <div className="flex flex-col md:gap-50 justify-end align-center">
        <div className="w-full flex gap-200 text-50 font-weight-500 text-gray-700 justify-end md:justify-start">
          <p className="">{status === "PENDING" ? "-.-.-" : date}</p>
          <p className="">{status === "PENDING" ? "미" : ""}완료</p>
        </div>
        <div className="w-full flex gap-200 text-50 font-weight-500 text-gray-700 justify-end md:justify-start">
          <p className="">투입시간</p>
          <p className="">{time ? time : "00:00:00"}</p>
        </div>
      </div>
    </div>
  );
}

export default MentorFeedbackPage;