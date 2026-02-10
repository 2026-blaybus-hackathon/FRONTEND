import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from "react";
import { cn } from "../../libs/utils";
import { Calendar } from "../../icons";
import Button from "../../components/common/button/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMenteeReport } from '../../hooks/mentee/useMenteeReport';
import { subjectTypes } from '../../types';
import type { MenteeReportPeriod } from '../../api/mentee';
import { useToastStore } from '../../stores/toastStore';
import { isAxiosError } from 'axios';

export type SubjectWithAll = "ALL" | subjectTypes.Subject;
export const REPORTDETAILS = ['keepContent', 'problemContent', 'tryContent'] as const;
export type ReportDetail = typeof REPORTDETAILS[number];

const ReportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get("date");
  const period = searchParams.get("period") as MenteeReportPeriod | null;
  const { addToast } = useToastStore();

  const { data: report, isLoading: isReportLoading, isError: isReportError, error: reportError } = useMenteeReport(
    period as MenteeReportPeriod, date as string,
    { enabled: !!date && !!period },
  );

  const is404Error = isReportError && isAxiosError(reportError) && reportError.response?.status === 404;

  // 에러 처리 (404는 토스트 대신 UI에 표시)
  useEffect(() => {
    if (isReportError && !is404Error) {
      addToast({
        title: "리포트 조회 실패",
        message: "리포트를 불러오는 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  }, [isReportError, is404Error, addToast]);

  // 성과율 데이터
  const pillsData = useMemo(() => {
    if (!report) return undefined;
    const total = {
      subject: "ALL" as const,
      feedback: { hours: report.totalStudyMinutes, rate: report.totalAchievementRate },
    };
    const subjects = report.subjectReports.map((subject) => ({
      subject: subject.subject,
      feedback: { hours: subject.studyMinutes, rate: subject.achievementRate },
    }));
    return [total, ...subjects];
  }, [report]);

  // 주/월 탭 클릭 이벤트
  const handlePeriodButtonClick = (buttonPeriod: MenteeReportPeriod) => {
    if (period === buttonPeriod) return;
    
    setSearchParams({
      date: new Date().toISOString().split('T')[0], // 오늘 날짜로 재설정
      period: buttonPeriod,
    }, { replace: true });
  };

  const getNewDate = (direction: 'prev' | 'next') => {
    if (period === 'WEEKLY') {
      const baseDate = new Date(date as string);
      baseDate.setDate(baseDate.getDate() + (direction === 'prev' ? -7 : 7));
      return baseDate.toISOString().split('T')[0];
    } else {
      const baseDate = new Date(date as string);
      baseDate.setMonth(baseDate.getMonth() + (direction === 'prev' ? -1 : 1));
      return baseDate.toISOString().split('T')[0];
    }
  };

  // 주/월 이동 버튼 클릭 이벤트
  const handlePeriodMoveButtonClick = (direction: 'prev' | 'next') => {
    const newDate = getNewDate(direction);
    setSearchParams({
      date: newDate,
      period: period as MenteeReportPeriod,
    }, { replace: true });
  };

  // 날짜와 기간이 설정되지 않았을 때 기본값 설정 + 미래 날짜 리다이렉팅
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // 미래 날짜 접근 시 오늘로 리다이렉팅
    if (date && date > today) {
      setSearchParams({
        date: today,
        period: period || "WEEKLY",
      }, { replace: true });
      return;
    }
    if (date && period) return;
    setSearchParams({
      date: today,
      period: "WEEKLY",
    }, { replace: true });
  }, [date, period, setSearchParams]);

  // 이전/다음 버튼 비활성화 여부
  const todayStr = new Date().toISOString().split('T')[0];
  const isNextDisabled = !date || !period || getNewDate('next') > todayStr;
  const isPrevDisabled = is404Error;

  return (
    <div
      className="w-full h-full flex flex-col gap-6 lg:max-h-[calc(100vh-112px)] min-h-[calc(100vh-136px)]"
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
        <ReportModeButton currentPeriod={period ?? "WEEKLY"} period="WEEKLY" onClick={() => handlePeriodButtonClick("WEEKLY")} />
        <ReportModeButton currentPeriod={period ?? "WEEKLY"} period="MONTHLY" onClick={() => handlePeriodButtonClick("MONTHLY")} />
      </section>

      {isReportLoading ? (
        /* 스켈레톤 UI */
        <article className="w-full flex flex-col rounded-2xl bg-white gap-200 py-400 px-500 border border-gray-100 animate-pulse">
          {/* 제목 스켈레톤 */}
          <div className="h-fit flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-300 bg-gray-200" />
            <div className="h-5 w-40 rounded bg-gray-200" />
          </div>

          {/* 과목별 피드백 pill 스켈레톤 */}
          <div className="flex flex-wrap gap-x-400 gap-y-200">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-28 rounded-full bg-gray-200" />
            ))}
          </div>

          {/* 멘토 총평 스켈레톤 */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
              <div className="h-3 w-4/6 rounded bg-gray-200" />
            </div>
          </div>

          {/* KPT 3열 스켈레톤 */}
          <div className="h-fit grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-100 py-300 px-200 flex flex-col gap-250">
                <div className="h-5 w-32 rounded bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : is404Error ? (
        /* 리포트 미존재 */
        <article className="w-full flex items-center justify-center rounded-2xl bg-white py-600 px-500 border border-gray-100 min-h-[200px]">
          <p className="text-200 font-medium text-gray-500">해당 리포트가 존재하지 않습니다.</p>
        </article>
      ) : (
        /* 실제 콘텐츠 */
        <>
          {/* 메인 섹션(아티클): 내용 높이에 맞춤. 총평이 길면 총평 내부 스크롤 */}
          <article className="w-full flex flex-col rounded-2xl bg-white gap-200 py-400 px-500 border border-gray-100">
            {/* 제목 */}
            <div className="h-fit flex items-center gap-2">
              <div className={cn(
                "p-2 shrink-0 rounded-300 transition-colors duration-300",
                period === "WEEKLY" ? "bg-primary-100 text-primary-500" : "bg-grape-100 text-grape-500",
              )}>
                <Calendar className="h-4 w-4" aria-hidden />
              </div>
              <h2 className="text-200 font-semibold text-gray-900">
                <span>{period === "WEEKLY" ? "주간" : "월간"} 리포트</span>
                {period === "WEEKLY" && <span>({report?.startDate} ~ {report?.endDate})</span>}
              </h2>
            </div>

            {/* 과목별 피드백 */}
            <div className="flex flex-wrap gap-x-400 gap-y-200">
              {pillsData?.map((pill: { subject: SubjectWithAll; feedback: { hours: number, rate: number } }) => (
                <SubjectFeedbackPill
                  key={pill.subject}
                  subject={pill.subject}
                  feedback={pill.feedback}
                />
              ))}
            </div>

            {/* 멘토 총평: 짧으면 본문 높이만, 길면 max-h 내부 스크롤 */}
            <section className="flex flex-col" aria-label="멘토 총평">
              <h3 className="text-100 font-semibold text-gray-900 mb-2">멘토 총평</h3>
              <p className="max-h-[50vh] text-sm text-gray-700 leading-relaxed text-justify overflow-y-auto">
                {report?.overallReview ? `“${report?.overallReview}”` : ''}
              </p>
            </section>

            {/* KPT 3열 */}
            <section className="h-fit grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" aria-label="KPT">
              {REPORTDETAILS.map((detail) =>
                report?.[detail] ? (
                  <ReportDetailCard key={detail} detail={detail} content={report[detail]!} />
                ) : null
              )}
            </section>
          </article>

        </>
      )}

      {/* 주/월 이동 버튼 */}
      {!isReportLoading && (
        <div className="h-fit flex justify-center gap-3">
          <button
            type="button"
            disabled={isPrevDisabled}
            className={cn(
              "flex gap-100 items-center rounded-300 px-300 py-150 transition-colors duration-300",
              period === "WEEKLY" ? "bg-primary-100 text-primary-500" : "bg-grape-100 text-grape-500",
              isPrevDisabled && "opacity-40 cursor-not-allowed",
            )}
            onClick={() => handlePeriodMoveButtonClick("prev")}
          >
            <span aria-hidden><ChevronLeftIcon /></span> 이전 {period === "WEEKLY" ? "주" : "달"}
          </button>
          <button
            type="button"
            disabled={isNextDisabled}
            className={cn(
              "flex gap-100 items-center rounded-300 px-300 py-150 transition-colors duration-300",
              period === "WEEKLY" ? "bg-primary-500 text-white" : "bg-grape-500 text-white",
              isNextDisabled && "opacity-40 cursor-not-allowed",
            )}
            onClick={() => handlePeriodMoveButtonClick("next")}
          >
            다음 {period === "WEEKLY" ? "주" : "달"} <span aria-hidden><ChevronRightIcon /></span>
          </button>
        </div>
      )}
    </div>
  );
};

const ReportModeButton = ({ currentPeriod, period, onClick }: { currentPeriod: MenteeReportPeriod, period: MenteeReportPeriod, onClick: () => void }) => {
  const label = period === "WEEKLY" ? "주간 리포트" : "월간 리포트";
  const className = {
    WEEKLY: "",
    MONTHLY: "text-grape-500",
  }
  const isActive = currentPeriod === period;  
  return (
    <Button
      variant={isActive ? "secondary" : "gray"}
      ariaLabel={label}
      className={cn("rounded-300 px-200",
        className[period], isActive ? "shadow-sm" : "bg-gray-50 text-gray-500")}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

const SubjectFeedbackPill = ({ subject, feedback }: { subject: SubjectWithAll, feedback: { hours: number, rate: number } }) => {
  const SUBJECT_PILLS: Record<SubjectWithAll, { label: string, className: string }> = {
    ALL: { label: "전체", className: "bg-primary-50 border-primary-100 text-primary-500" },
    ENGLISH: { label: "영어", className: "bg-red-50 border-red-100 text-red-500" },
    KOREAN: { label: "국어", className: "bg-green-50 border-lime-100 text-lime-500" },
    MATH: { label: "수학", className: "bg-blue-50 border-blue-100 text-blue-500" },
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
    keepContent: { label: "Keep (잘한 점)", className: "bg-blue-50 border-blue-100 text-blue-500" },
    problemContent: { label: "Problem (부족한 점)", className: "bg-red-50 border-red-100 text-red-500" },
    tryContent: { label: "Try (시도할 점)", className: "bg-green-50 border-lime-100 text-lime-500" },
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