import SearchInput from "../../components/common/input/SearchInput";
import { useState, useEffect, useRef, useMemo } from "react";
import { cn, getProfileImageUrl } from "../../libs/utils";
import { Play, PlayReverse } from "../../icons";
import IconButton from "../../components/common/button/IconButton";
import SubjectBadge from "../../components/feature/subject/SubjectBadge";
import Button from "../../components/common/button/Button";
import TextArea from "../../components/common/input/TextArea";
import AssignmentCard from "../../components/feature/assignment/AssignmentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMentorMentees, useMentorMenteeDetail, useWriteTaskFeedback, useWriteTotalFeedback } from "../../hooks/mentor/useMentorFeedback";
import type { MentorFeedbackMenteeStatus } from "../../api/mentor";

const MentorFeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMentee, setSelectedMentee] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [mode, setMode] = useState<"edit" | "view">("edit"); // 작성 모드(edit) / 조회 모드(view)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const assignmentListRef = useRef<HTMLDivElement>(null);

  const SCROLL_SHADOW_THRESHOLD = 10;

  const { data: mentees } = useMentorMentees();
  const { data: menteeDetail } = useMentorMenteeDetail(
    selectedMentee ?? 0,
    {
      enabled: selectedMentee !== null,
    }
  );

  const selectedTask = useMemo(() => {
    return menteeDetail?.tasks.find((task) => task.taskId === selectedTaskId);
  }, [menteeDetail, selectedTaskId]);

  const editorMode = selectedTaskId !== null ? "task" : "total";
  const isEditing = editorMode === "task" ? selectedTask?.feedback !== null : menteeDetail?.totalFeedback !== null;
  const isTotalFeedbackCompleted = menteeDetail?.totalFeedback !== null;
  

  const { mutate: writeTaskFeedback } = useWriteTaskFeedback(selectedMentee ?? 0, selectedTaskId ?? 0);
  const { mutate: writeTotalFeedback } = useWriteTotalFeedback(selectedMentee ?? 0);

  const handleEnrollTaskFeedback = () => {
    if (selectedTaskId === null) return;
    writeTaskFeedback({
      content: feedback,
    });
  }

  const handleEnrollTotalFeedback = () => {
    if (selectedMentee === null) return;
    writeTotalFeedback({
      content: feedback,
      menteeId: selectedMentee,
    });
  }

  const handleEnrollFeedback = () => {
    if (mode === "edit") {
      if (editorMode === "total") {
        handleEnrollTotalFeedback();
      } else {
        handleEnrollTaskFeedback();
      }
    } else if (mode === "view") {
      setMode("edit");
    } 
  }

  const handleMovePrevious = () => {
    if (selectedMentee === null) return;
    if (selectedTaskId === null) {
      const currentIndex = mentees?.findIndex((m) => m.id === selectedMentee) ?? -1;
      if (currentIndex > 0 && mentees) {
        setSelectedMentee(mentees[currentIndex - 1].id);
      }
    } else {
      const currentTaskIndex = menteeDetail?.tasks.findIndex((t) => t.taskId === selectedTaskId) ?? -1;
      if (currentTaskIndex > 0 && menteeDetail) {
        setSelectedTaskId(menteeDetail.tasks[currentTaskIndex - 1].taskId);
      }
    }
  }

  const handleMoveNext = () => {
    if (selectedMentee === null) return;
    if (selectedTaskId === null) {
      const currentIndex = mentees?.findIndex((m) => m.id === selectedMentee) ?? -1;
      if (mentees && currentIndex >= 0 && currentIndex < mentees.length - 1) {
        setSelectedMentee(mentees[currentIndex + 1].id);
      }
    } else {
      const currentTaskIndex = menteeDetail?.tasks.findIndex((t) => t.taskId === selectedTaskId) ?? -1;
      if (menteeDetail && currentTaskIndex >= 0 && currentTaskIndex < menteeDetail.tasks.length - 1) {
        setSelectedTaskId(menteeDetail.tasks[currentTaskIndex + 1].taskId);
      }
    }
  }

  const isPrevDisabled = selectedTaskId === null
  ? (mentees?.findIndex((m) => m.id === selectedMentee) ?? 0) <= 0
  : (menteeDetail?.tasks.findIndex((t) => t.taskId === selectedTaskId) ?? 0) <= 0;

  const isNextDisabled = selectedTaskId === null
    ? (mentees?.findIndex((m) => m.id === selectedMentee) ?? 0) >= (mentees?.length ?? 1) - 1
    : (menteeDetail?.tasks.findIndex((t) => t.taskId === selectedTaskId) ?? 0) >= (menteeDetail?.tasks.length ?? 1) - 1;


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

  useEffect(() => {
    const container = assignmentListRef.current;
    if (!container) return;

    const updateShadows = () => {
      const el = assignmentListRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const isScrollable = scrollHeight > clientHeight;
      const isNotAtTop = scrollTop > SCROLL_SHADOW_THRESHOLD;
      const isNotAtBottom = scrollTop + clientHeight < scrollHeight - SCROLL_SHADOW_THRESHOLD;

      setShowTopShadow(isScrollable && isNotAtTop);
      setShowBottomShadow(isScrollable && isNotAtBottom);
    };

    // 레이아웃이 끝난 뒤 한 번 더 계산 (초기 높이 0이었다가 채워지는 경우 대비)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(updateShadows);
    });

    updateShadows();
    container.addEventListener("scroll", updateShadows);
    window.addEventListener("resize", updateShadows);

    const resizeObserver = new ResizeObserver(updateShadows);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", updateShadows);
      window.removeEventListener("resize", updateShadows);
      resizeObserver.disconnect();
    };
  }, [selectedMentee, selectedTaskId]);

  const lastPage = Math.ceil((mentees ? mentees.length : 0) / pageSize);
  const effectivePage = Math.min(page, Math.max(0, lastPage - 1));
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  return (
    <div className="flex flex-col gap-10 lg:max-h-[calc(100vh-112px)] lg:overflow-hidden">
      {/* 검색, 학생 리스트 */}
      <div className="flex flex-col gap-7.5 shrink-0">
        <SearchInput value={search} onChange={handleSearch} ariaLabel="search" className="w-45" />
        <div className="flex justify-between items-center">
          <IconButton variant="primary-line" Icon={<PlayReverse />} onClick={() => setPage(effectivePage - 1)} ariaLabel="previous page" disabled={effectivePage === 0}/>
          <div className="flex flex-1 flex-col sm:flex-row gap-100 lg:gap-500 justify-center">
            {mentees?.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize).map((mentee) => (
              <MenteeListCard
                id={mentee.id}
                key={mentee.id}
                name={mentee.name}
                profileImage={getProfileImageUrl(mentee.profileUrl)}
                school={mentee.schoolName}
                grade={mentee.grade}
                status={mentee.status}
                selected={selectedMentee === mentee.id}
                onClick={() => {
                  setSelectedMentee(mentee.id);
                  setSelectedTaskId(null);
              }}
              />
            ))}
          </div>
          <IconButton variant="primary-line" Icon={<Play />} onClick={() => setPage(effectivePage + 1)} ariaLabel="next page" disabled={effectivePage >= lastPage - 1}/>
        </div>
      </div>
      
      {/* 학생 과제 확인 */}
      {selectedMentee && <div className="w-full flex flex-1 flex-col-reverse md:flex-row gap-300 lg:min-h-0">
        <div className="md:w-fit w-full relative lg:min-h-0">
          {/* 상단 안쪽 그림자: 스크롤 시 위에 더 있는 내용이 있음을 표시 */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-4 pointer-events-none transition-opacity duration-300 z-20",
              "bg-gradient-to-b from-black/30 via-black/15 to-transparent",
              showTopShadow ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />
          <div
            ref={assignmentListRef}
            className="flex flex-col md:gap-300 gap-100 overflow-y-auto min-h-0 max-h-[min(400px,50vh)] lg:max-h-full"
          >
            {selectedTask ? (
              <AssignmentCard
                {...selectedTask}
                time={selectedTask.time}
                onBack={() => setSelectedTaskId(null)}
                folded={false}
              />
            ) : (
              menteeDetail?.tasks.map((task) => (
                <AssignmentCard
                  key={task.taskId}
                  {...task}
                  onClick={() => setSelectedTaskId(task.taskId)}
                  onBack={() => setSelectedTaskId(null)}
                  folded={true}
                />
              ))
            )}
          </div>
          {/* 하단 안쪽 그림자: 스크롤 시 아래에 더 있는 내용이 있음을 표시 */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-4 pointer-events-none transition-opacity duration-300 z-20",
              "bg-gradient-to-t from-black/30 via-black/15 to-transparent",
              showBottomShadow ? "opacity-100" : "opacity-0"
            )}
            aria-hidden="true"
          />
        </div>
        <div className="max-h-[466px] flex-1 flex flex-col px-10 py-8 bg-white rounded-600 border-1 border-gray-100 gap-100 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              {selectedTaskId && selectedTask && <SubjectBadge subject={selectedTask.subject} />}
              <p className="heading-6 font-weight-700 text-gray-800">
                {selectedTaskId && selectedTask ? selectedTask.title : "종합 피드백"}
              </p>
            </div>
            <div className="flex gap-100">
              <button
                className="text-xs font-weight-500 text-gray-700 flex items-center hover:bg-gray-50 rounded-full py-50 pl-75 pr-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleMovePrevious}
                disabled={
                  isPrevDisabled
                }
              >
                <ChevronLeft width={16} height={16} />이전
              </button>
              <button
                className="text-xs font-weight-500 text-gray-700 flex items-center hover:bg-gray-50 rounded-full py-50 pl-100 pr-75 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleMoveNext}
                disabled={
                  isNextDisabled
                }
              >
                다음 <ChevronRight width={16} height={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* 에디터: 부모 높이에 맞추고, 내용은 내부 스크롤 */}
            {
              mode === "view" ?
              <p className="body-3 text-gray-700 whitespace-pre-wrap overflow-y-auto">{feedback}</p> :
              <TextArea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={
                  selectedTaskId !== null ?
                  "학생의 질문, 코멘트에 대한 답변이나 피드백을 남겨주세요." :
                  "오늘의 과제 달성률과 전체적인 학습에 대해 피드백을 남겨주세요."
                  }
                ariaLabel="피드백 입력"
                className="h-full"
                readOnly={editorMode === "task" && !isTotalFeedbackCompleted}
              />
            }
          </div>
          <div className="w-full flex justify-end gap-100 shrink-0">
            {/* {mode === "edit" && <Button variant="gray" onClick={() => {}} ariaLabel="임시 저장">임시 저장</Button>} */}
            <Button
              onClick={handleEnrollFeedback}
              ariaLabel="피드백 등록"
              className="font-weight-700"
              disabled={!feedback}
            >
              {isEditing ? "피드백 수정" : "피드백 등록"}
            </Button>
          </div>
        </div>
      </div>}
    </div>
  );
};

interface MenteeListCardProps {
  id: number;
  name: string;
  profileImage?: string;
  school: string;
  grade: string;
  status: MentorFeedbackMenteeStatus;
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
        <div className="flex gap-150 flex-row sm:flex-col md:flex-row items-center">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center text-white heading-4 font-weight-500">
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              name[0]
            )}
          </div>
          <div className="flex flex-col">
            <p className={cn("heading-6 md:heading-4 font-weight-500", selected ? "text-white" : "text-gray-800", "transition-all duration-300")}>{name}</p>
            <div className={cn("subtitle-1 md:heading-6 flex flex-wrap gap-x-50", selected ? "text-white" : "text-gray-300", "transition-all duration-300")}>
              <p>{school} </p>
              <p>{grade}학년</p>
            </div>
          </div>
        </div>
        <p className={cn(
          "subtitle-2 font-weight-500 text-right md:text-left",
          selected ? "text-white" : "text-gray-300", "transition-all duration-300")}
        >피드백 {status === "PENDING" ? "대기" : "완료"}
        </p>
      </div>
    </div>
  );
}

export default MentorFeedbackPage;