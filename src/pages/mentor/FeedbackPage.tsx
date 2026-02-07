import SearchInput from "../../components/common/input/SearchInput";
import { useState } from "react";
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
    school: "John Doe",
    grade: "1",
    status: "WAITING_FEEDBACK",
  },
  {
    id: 2,
    name: "Jane Doe",
    school: "Jane Doe",
    grade: "2",
    status: "COMPLETED",
  },
  {
    id: 3,
    name: "Jim Beam",
    school: "Jim Beam",
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
  const pageSize = 3;
  const lastPage = Math.ceil(mentees.length / pageSize);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <div className="h-full flex flex-col gap-10">
      {/* 검색, 학생 리스트 */}
      <div className="flex flex-col gap-7.5">
        <SearchInput value={search} onChange={handleSearch} ariaLabel="search" className="w-45" />
        <div className="flex justify-between items-center">
          <IconButton variant="primary-line" Icon={<PlayReverse />} onClick={() => setPage(page - 1)} ariaLabel="previous page" disabled={page === 0}/>
          <div className="w-[800px] flex gap-500">
            {mentees.slice(page * pageSize, (page + 1) * pageSize).map((mentee) => (
              <
                MenteeListCard key={mentee.id} {...mentee}
                selected={selectedMentee === mentee.id}
                onClick={() => setSelectedMentee(mentee.id)}
              />
            ))}
          </div>
          <IconButton variant="primary-line" Icon={<Play />} onClick={() => setPage(page + 1)} ariaLabel="next page" disabled={page === lastPage - 1}/>
        </div>
      </div>
      
      {/* 학생 과제 확인 */}
      <div className="w-full h-full flex flex-1 gap-300 overflow-hidden">
        <div className="w-fit flex flex-col gap-300 overflow-y-auto scrollbar-hide">
            {TodayAssignmentsExample.map((assignment) => (
              <MenteeAssignmentCard key={assignment.title + assignment.date} {...assignment} onClick={() => {}} />
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
        "w-60 flex flex-col gap-3 rounded-[12px] py-300 px-250 relative overflow-hidden",
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
      <div className="relative z-10">
      <div className="flex items-center gap-150">
        {
          profileImage ?
          <img src={profileImage} alt={name} className="w-36 h-36 rounded-full" /> :
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white heading-4 font-weight-500">{name[0]}</div>
        }
        <div className="flex flex-col">
          <p className={cn("heading-4 font-weight-500", selected ? "text-white" : "text-gray-800", "transition-all duration-300")}>{name}</p>
          <p className={cn("heading-6", selected ? "text-white" : "text-gray-300", "transition-all duration-300")}>{school} {grade}학년</p>
        </div>
      </div>
      <p className={cn("subtitle-2 font-weight-500", selected ? "text-white" : "text-gray-300", "transition-all duration-300")}>피드백 {status === "WAITING_FEEDBACK" ? "대기" : "완료"}</p>
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
    <div className="w-66 rounded-600 py-150 px-200 gap-100 flex flex-col bg-white shadow-100" onClick={onClick}>
      <span className={cn("w-fit body-4 font-weight-700 px-100 py-1 rounded-900", subjectInfo[subject].style)}>{subjectInfo[subject].label}</span>
      <div className="w-full flex flex-col">
        <p className="text-100 text-black font-weight-500 mb-200">{title}</p>
        <div className="w-full flex gap-200 text-50 font-weight-500 text-gray-700">
          <p className="">{status === "PENDING" ? "-.-.-" : date}</p>
          <p className="">{status === "PENDING" ? "미" : ""}완료</p>
        </div>
        <div className="w-full flex gap-200 text-50 font-weight-500 text-gray-700">
          <p className="">투입시간</p>
          <p className="">{time ? time : "00:00:00"}</p>
        </div>
      </div>
    </div>
  );
}

export default MentorFeedbackPage;