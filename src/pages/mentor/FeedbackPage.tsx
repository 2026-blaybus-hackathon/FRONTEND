import SearchInput from "../../components/common/input/SearchInput";
import { useState, useEffect } from "react";
import { cn } from "../../libs/utils";
import { Play, PlayReverse } from "../../icons";
import { ChevronLeft } from "lucide-react";
import IconButton from "../../components/common/button/IconButton";
import SubjectBadge from "../../components/feature/subject/SubjectBadge";
import Button from "../../components/common/button/Button";
import MarkdownEditor from "../../components/common/markdown/MarkdownEditor";
import MarkdownRenderer from "../../components/common/markdown/MarkdownRenderer";

interface Mentee {
  id: number;
  name: string;
  school: string;
  grade: string;
  status: "WAITING_FEEDBACK" | "COMPLETED";
}

interface TodayAssignment {
  id: number;
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
    id: 1,
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
  {
    id: 2,
    title: "오늘의 과제",
    subject: "ENGLISH",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
  {
    id: 3,
    title: "오늘의 과제",
    subject: "MATH",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
  {
    id: 4,
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
  {
    id: 5,
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
  {
    id: 6,
    title: "오늘의 과제",
    subject: "KOREAN",
    date: "2026-02-07",
    status: "PENDING",
    time: "00:10:00",
  },
]

const MentorFeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [mentees] = useState<Mentee[]>(menteesExample);
  const [selectedMentee, setSelectedMentee] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<TodayAssignment | null>(null);

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
                onClick={() => {
                setSelectedMentee(mentee.id);
                setSelectedAssignment(null);
              }}
              />
            ))}
          </div>
          <IconButton variant="primary-line" Icon={<Play />} onClick={() => setPage(effectivePage + 1)} ariaLabel="next page" disabled={effectivePage >= lastPage - 1}/>
        </div>
      </div>
      
      {/* 학생 과제 확인 */}
      <div className="w-full flex flex-1 flex-col-reverse md:flex-row gap-300 min-h-0">
        <div className="md:w-fit w-full flex flex-col md:gap-300 gap-100 overflow-y-auto min-h-0">
          {selectedAssignment ? (
            <AssignmentDetailCard
              {...selectedAssignment}
              time={selectedAssignment.time || "00:00:00"}
              menteeComment="수학 오답노트 토요일로 바꿔도 될까요? 내일 수학 클리닉이 있어서 그 때 문제를 고치거든요...."
              onBack={() => setSelectedAssignment(null)}
            />
          ) : (
            TodayAssignmentsExample.map((assignment) => (
              <MenteeAssignmentCard
                key={assignment.id}
                {...assignment}
                onClick={() => setSelectedAssignment(assignment)}
              />
            ))
          )}
        </div>
        <div className="max-h-[466px] flex-1 flex flex-col px-10 py-8 bg-white rounded-600 border-1 border-gray-100 gap-7 shrink-0">
          <div className="flex flex-col gap-2">
            {selectedAssignment && <SubjectBadge subject={selectedAssignment.subject} />}
            <p className="heading-6 font-weight-700 text-gray-800">{selectedAssignment ? selectedAssignment.title : "종합 피드백"}</p>
            <p className="body-3 font-weight-500 text-gray-500">
              {selectedAssignment ? "학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요." : "오늘의 과제 달성률과 전체적인 학습에 대해 피드백을 남겨주세요."}
            </p>
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* 에디터: 부모 높이에 맞추고, 내용은 내부 스크롤 */}
            {
              feedbackSaved ?
              <MarkdownRenderer markdown={feedback} /> :
              <MarkdownEditor value={feedback} setValue={setFeedback} />
            }
          </div>
          <div className="w-full flex justify-end gap-100 shrink-0">
            {!feedbackSaved && <Button variant="gray" onClick={() => {}} ariaLabel="임시 저장">임시 저장</Button>}
            <Button
              onClick={() => {setFeedbackSaved(prev => !prev)}}
              ariaLabel="피드백 등록"
              className="font-weight-700"
              disabled={!feedback}
            >
              {feedbackSaved ? "피드백 수정" : "피드백 등록"}
            </Button>
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
  return (
    <div className="md:w-66 w-full rounded-600 py-150 px-200 gap-100 flex md:flex-col bg-white shadow-100 justify-between" onClick={onClick}>
      <div className="flex flex-col gap-50 md:gap-100">
        <SubjectBadge subject={subject} />
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

interface AssignmentDetailCardProps {
  title: string;
  subject: "KOREAN" | "ENGLISH" | "MATH";
  date: string;
  status: "PENDING" | "COMPLETED";
  time: string;
  menteeComment?: string;
  assignmentImageUrl?: string;
  onBack: () => void;
}

const AssignmentDetailCard = ({
  title,
  subject,
  date,
  status,
  time,
  menteeComment = "",
  assignmentImageUrl,
  onBack,
}: AssignmentDetailCardProps) => {
  return (
    <div className="md:w-66 w-full bg-white rounded-600 border border-gray-100 shadow-100 overflow-hidden flex flex-col">
      {/* 뒤로가기 */}
      <div className="px-200 pt-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center body-3 font-weight-500 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="과제 목록으로 돌아가기"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" aria-hidden />
          뒤로
        </button>
      </div>
      {/* 과제 요약 */}
      <div className="py-150 px-200 gap-100 flex flex-col">
        <div className="flex flex-col gap-50 md:gap-100">
          <SubjectBadge subject={subject} />
          <p className="text-100 text-black font-weight-500">{title}</p>
        </div>
        <div className="flex flex-col md:gap-50 justify-end align-center">
          <div className="w-full flex gap-200 text-50 font-bold text-gray-700 justify-end md:justify-start">
            <p>{status === "PENDING" ? "-.-.-" : date}</p>
            <p>{status === "PENDING" ? "미" : ""}완료</p>
          </div>
          <div className="w-full flex gap-200 text-50 font-bold text-gray-700 justify-end md:justify-start">
            <p>투입시간</p>
            <p>{time ? time : "00:00:00"}</p>
          </div>
        </div>
      </div>

      {/* 멘티 코멘트 */}
      <div className="px-200 pb-200 flex flex-col gap-100">
        <p className="text-50 font-bold text-gray-800">멘티 코멘트</p>
        <div className="rounded-400 bg-gray-50 px-200 py-150">
          <p className="body-3 font-weight-500 text-gray-700 whitespace-pre-wrap">
            {menteeComment || "멘티 코멘트가 없습니다."}
          </p>
        </div>
      </div>

      {/* 과제 이미지 */}
      <div className="px-200 pb-200 flex flex-col gap-100">
        <p className="text-50 font-bold text-gray-800">과제 이미지</p>
        <div className="rounded-400 overflow-hidden bg-gray-50 border border-gray-100 min-h-[200px] flex items-center justify-center">
          {assignmentImageUrl ? (
            <img src={assignmentImageUrl} alt="과제 이미지" className="w-full h-auto object-contain max-h-[480px]" />
          ) : (
            <p className="body-3 text-gray-400 py-800">과제 이미지가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorFeedbackPage;