import { useState } from "react";
import { cn } from "../../libs/utils";
import { Calendar } from "../../icons";
import Button from "../../components/common/button/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const SUBJECTS = ["all", "en", "ko", "math"] as const;
export const REPORTDETAILS = ['keep', 'problem', 'try'] as const;
export type Subject = typeof SUBJECTS[number];
export type ReportDetail = typeof REPORTDETAILS[number];
export type ReportMode = "weekly" | "monthly";

const ReportPage = () => {
  const [reportMode, setReportMode] = useState<ReportMode>("weekly");
  const [year] = useState<number | null>(null);
  const [week] = useState<number | null>(null);
  const [month] = useState<number | null>(null);
  const [day] = useState<number | null>(null);

  const [subjectFeedback] = useState({
    all: {
      hours: 60,
      rate: 85,
    },
    en: {
      hours: 24,
      rate: 95,
    },
    ko: {
      hours: 12,
      rate: 85,
    },
    math: {
      hours: 24,
      rate: 75,
    },
  });

  const [mentorReview] = useState({
    total: "설스터디 멘토링이 시작된 첫 주입니다. 학생의 현재 학습 상태를 진단하고, 약점인 국어 비문학 독해와 수학 풀이 습관을 교정하기 위한 기초 틀을 마련했습니다. 멘토와의 라포 형성 및 데일리 인증 루틴 적응에 초점을 맞췄습니다.",
    keep: "매일 플래너를 업로드하며 학습 시간을 확보하려는 노력이 돋보입니다. 영어 단어 테스트 통과율이 90% 이상으로 유지되고 있습니다.",
    problem: "수학 오답노트 작성 시, 단순히 풀이 과정을 베껴 적는 경향이 있어 '내가 왜 틀렸는지'에 대한 사고 과정 기록이 부족합니다.",
    try: "수학 오답노트 양식에 '틀린 이유(실수/개념부족)' 칸을 추가했으니 이를 활용해보세요. 국어 문법 강의 수강 후 백지 복습을 추가합시다.",
  });

  return (
    <div
      className="w-full h-full flex flex-col gap-6"
    >
      <header className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-400 font-semibold leading-tight text-gray-900 flex gap-200">
            <span>📊</span><span>학습 리포트</span>
          </h1>
          <p className="heading-6 font-weight-500 text-gray-500">
            KPT(Keep, Problem, Try) 프레임워크를 통해<br />잘한 점은 강화하고 부족한 점은 구체적인 행동으로 개선하는 차주 학습 전략을 수립합니다.
          </p>
        </div>
      </header>

      {/* 주간 / 월간 탭 (pill) */}
      <section aria-label="리포트 유형 선택" className="flex gap-200">
        <ReportModeButton currentMode={reportMode} reportMode="weekly" setReportMode={setReportMode} />
        <ReportModeButton currentMode={reportMode} reportMode="monthly" setReportMode={setReportMode} />
      </section>

      {/* 메인 섹션(아티클): 내용 높이에 맞춤. 총평이 길면 총평 내부 스크롤 */}
      <article className="w-full flex flex-col rounded-2xl bg-white gap-200 py-400 px-500 border border-gray-100">
        {/* 제목 */}
        <div className="h-fit flex items-center gap-2">
          <div className={cn(
            "p-2 shrink-0 rounded-300 transition-colors duration-300",
            reportMode === "weekly" ? "bg-primary-100 text-primary-500" : "bg-grape-100 text-grape-500",
          )}>
            <Calendar className="h-4 w-4" aria-hidden />
          </div>
          <h2 className="text-200 font-semibold text-gray-900">
            <span>{month ? month : "-"}월 {week ? week : "-"}주차 {reportMode === "weekly" ? "주간" : "월간"} 리포트</span>
            {reportMode === "weekly" && <span>({year}.{month}.{day} ~ {year}.{month}.{day ? day + 6 : ""})</span>}
          </h2>
        </div>

        {/* 과목별 피드백 */}
        <div className="flex flex-wrap gap-x-400 gap-y-200">
          {SUBJECTS.map((subject) => (
            <SubjectFeedbackPill
              key={subject}
              subject={subject}
              feedback={subjectFeedback[subject]}
            />
          ))}
        </div>

        {/* 멘토 총평: 짧으면 본문 높이만, 길면 max-h 내부 스크롤 */}
        <section className="flex flex-col" aria-label="멘토 총평">
          <h3 className="text-100 font-semibold text-gray-900 mb-2">멘토 총평</h3>
          <p className="max-h-[50vh] text-sm text-gray-700 leading-relaxed text-justify overflow-y-auto">
            &ldquo;{mentorReview.total}
            &rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;&ldquo;{mentorReview.total}&rdquo;
          </p>
        </section>

        {/* KPT 3열 */}
        <section className="h-fit grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" aria-label="KPT">
          {REPORTDETAILS.map((detail) => (
            <ReportDetailCard key={detail} detail={detail} content={mentorReview[detail]} />
          ))}
        </section>
      </article>

      {/* 주/월 이동 버튼 */}
      <div className="h-fit flex justify-center gap-3">
        <button
          type="button"
          className={cn(
            "flex gap-100 items-center rounded-300 bg-primary-100 px-300 py-150 text-primary-500 transition-colors duration-300",
            reportMode === "weekly" ? "bg-primary-100 text-primary-500" : "bg-grape-100 text-grape-500",
        )}
        >
          <span aria-hidden><ChevronLeftIcon /></span> 이전 {reportMode === "weekly" ? "주" : "달"}
        </button>
        <button
          type="button"
          className={cn(
            "flex gap-100 items-center rounded-300 bg-primary-500 px-300 py-150 text-white transition-colors duration-300",
            reportMode === "weekly" ? "bg-primary-500 text-white" : "bg-grape-500 text-white",
          )}
        >
          다음 {reportMode === "weekly" ? "주" : "달"} <span aria-hidden><ChevronRightIcon /></span>
        </button>
        </div>
    </div>
  );
};

const ReportModeButton = ({ currentMode, reportMode, setReportMode }: { currentMode: ReportMode, reportMode: ReportMode, setReportMode: (reportMode: ReportMode) => void }) => {
  const label = reportMode === "weekly" ? "주간 리포트" : "월간 리포트";
  const className = {
    weekly: "",
    monthly: "text-grape-500",
  }
  const isActive = currentMode === reportMode;  
  return (
    <Button
      variant={isActive ? "secondary" : "gray"}
      ariaLabel={label}
      className={cn("rounded-300 px-200", className[reportMode], isActive ? "shadow-sm" : "bg-gray-50 text-gray-500")}
      onClick={() => setReportMode(reportMode)}
    >
      {label}
    </Button>
  );
};

const SubjectFeedbackPill = ({ subject, feedback }: { subject: Subject, feedback: { hours: number, rate: number } }) => {
  const SUBJECT_PILLS: Record<Subject, { label: string, className: string }> = {
    all: { label: "전체", className: "bg-primary-50 border-primary-100 text-primary-500" },
    en: { label: "영어", className: "bg-red-50 border-red-100 text-red-500" },
    ko: { label: "국어", className: "bg-green-50 border-lime-100 text-lime-500" },
    math: { label: "수학", className: "bg-blue-50 border-blue-100 text-blue-500" },
  };

  return (
    <span className={cn(
      "flex items-center justify-center rounded-full border px-300 py-75 gap-200 lg:gap-300",
      SUBJECT_PILLS[subject].className,
    )}>
      <p className="text-175 font-weight-500">{SUBJECT_PILLS[subject].label}</p>
      <p className="text-sm font-weight-400 text-gray-800">{feedback.hours}h</p>
      <p className="text-sm font-weight-400 text-gray-800">{feedback.rate}%</p>
    </span>
  );
};

const ReportDetailCard = ({ detail, content }: { detail: ReportDetail, content: string }) => {
  const DETAIL_CARDS: Record<ReportDetail, { label: string, className: string }> = {
    keep: { label: "Keep (잘한 점)", className: "bg-blue-50 border-blue-100 text-blue-500" },
    problem: { label: "Problem (부족한 점)", className: "bg-red-50 border-red-100 text-red-500" },
    try: { label: "Try (시도할 점)", className: "bg-green-50 border-lime-100 text-lime-500" },
  };
  return (
    <div className={cn(
      "rounded-xl border py-300 px-200 flex flex-col gap-250",
      DETAIL_CARDS[detail].className,
    )}>
      <h4 className="heading-6 font-weight-500">{DETAIL_CARDS[detail].label}</h4>
      <p className="text-md text-gray-800 leading-relaxed">{content}</p>
    </div>
  );
};

export default ReportPage;