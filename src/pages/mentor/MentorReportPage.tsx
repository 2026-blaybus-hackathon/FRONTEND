import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Gift,
  AlertTriangle,
  CheckSquare,
  X,
} from 'lucide-react';
import SearchInput from '../../components/common/input/SearchInput';
import type { MenteeListItem } from '../../libs/types/mentee';
import { useMenteeList } from '../../hooks/useMenteeList';
import { useMenteeStats } from '../../hooks/useMenteeStats';
import { useMentorSubjectStats } from '../../hooks/useMentorSubjectStats';
import { createMentorReport } from '../../api/mentor';
import { SUBJECT_OPTIONS } from '../../static/assignment';
import type { MentorReportPeriod, MenteeFeedbackItem } from '../../libs/types/mentor';
import { useMenteeFeedbacksFromTasks } from '../../hooks/useMenteeFeedbacksFromTasks';
import { DEFAULT_MENTEE_ASSIGNMENT_DETAIL } from '../../static/assignment';
import { cn, getProfileImageUrl } from '../../libs/utils';

function todayYYYYMMDD(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getDateForWeekOffset(weekOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + weekOffset * 7);
  return d.toISOString().slice(0, 10);
}

/** 주간: "2026년 2월 2주차", 월간: "2026년 2월" */
function getPeriodLabel(dateStr: string, isWeekly: boolean): string {
  const [y, m, day] = dateStr.split('-').map(Number);
  const year = y!;
  const month = m!;
  const date = day!;
  if (isWeekly) {
    const weekOfMonth = Math.ceil(date / 7);
    return `${year}년 ${month}월 ${weekOfMonth}주차`;
  }
  return `${year}년 ${month}월`;
}

const BAR_COLORS = ['bg-[var(--color-lime-500)]', 'bg-[var(--color-blue-500)]', 'bg-[var(--color-red-500)]'] as const;

const REPORT_TABS: { id: 'WEEKLY' | 'MONTHLY'; label: string; period: MentorReportPeriod }[] = [
  { id: 'WEEKLY', label: '주간 리포트', period: 'WEEKLY' },
  { id: 'MONTHLY', label: '월간 리포트', period: 'MONTHLY' },
];

const textareaBase =
  'w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white font-[inherit] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] resize-y min-h-[80px]';

const MentorReportPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<MenteeListItem | null>(null);
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [totalReview, setTotalReview] = useState('');
  const [goodPoints, setGoodPoints] = useState('');
  const [improvePoints, setImprovePoints] = useState('');
  const [tryContent, setTryContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<MenteeFeedbackItem | null>(null);

  const { menteeList, isLoading: menteeLoading } = useMenteeList();
  const { feedbacks, isLoading: feedbacksLoading } = useMenteeFeedbacksFromTasks(
    selectedMentee?.id ?? null,
    { page: 0, size: 3 }
  );
  const statsDate = getDateForWeekOffset(weekOffset);
  const {
    achievementRate: monthlyAchievement,
    studyTimeMinutes,
    isLoading: statsLoading,
  } = useMenteeStats(selectedMentee?.id ?? null, {
    date: statsDate,
    period: activeTab === 'WEEKLY' ? 'WEEK' : 'MONTH',
  });
  const { subjectStats, isLoading: subjectStatsLoading } = useMentorSubjectStats(selectedMentee?.id ?? null, {
    reportDate: statsDate,
    period: activeTab,
  });

  const filteredMentees = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return menteeList;
    return menteeList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [menteeList, searchValue]);

  // 첫 멘티를 기본 선택
  useEffect(() => {
    if (selectedMentee == null && filteredMentees.length > 0) {
      setSelectedMentee(filteredMentees[0]);
    }
  }, [filteredMentees, selectedMentee]);

  const selectedIndex = useMemo(() => {
    if (!selectedMentee) return 0;
    const i = filteredMentees.findIndex((m) => m.id === selectedMentee.id);
    return i >= 0 ? i : 0;
  }, [filteredMentees, selectedMentee]);

  const selectedDetail = selectedMentee ? DEFAULT_MENTEE_ASSIGNMENT_DETAIL : null;
  const studyTimeHours = Math.round(studyTimeMinutes / 60);
  const periodLabel = activeTab === 'WEEKLY'
    ? getPeriodLabel(statsDate, true)
    : getPeriodLabel(todayYYYYMMDD(), false);

  const handleCarouselPrev = () => {
    if (filteredMentees.length === 0) return;
    const next = selectedIndex <= 0 ? filteredMentees.length - 1 : selectedIndex - 1;
    setSelectedMentee(filteredMentees[next]);
  };

  const handleCarouselNext = () => {
    if (filteredMentees.length === 0) return;
    const next = selectedIndex >= filteredMentees.length - 1 ? 0 : selectedIndex + 1;
    setSelectedMentee(filteredMentees[next]);
  };

  const handleSaveReport = async () => {
    if (!selectedMentee) return;
    const periodTab = REPORT_TABS.find((t) => t.id === activeTab);
    if (!periodTab) return;
    setSaving(true);
    try {
      await createMentorReport({
        menteeId: selectedMentee.id,
        overallReview: totalReview,
        period: periodTab.period,
        keepContent: goodPoints,
        problemContent: improvePoints,
        tryContent,
        reportDate: getDateForWeekOffset(weekOffset),
      });
      alert(activeTab === 'WEEKLY' ? '주간 리포트가 등록되었습니다.' : '월간 리포트가 등록되었습니다.');
    } catch (err: unknown) {
      const ax = err as {
        response?: { status?: number; data?: { code?: number; message?: string } };
        message?: string;
      };
      const data = ax.response?.data;
      const isConflictReport = data?.code === -20000;
      const alertMessage = isConflictReport
        ? (data?.message ?? '이미 생성된 리포트가 존재합니다.')
        : '리포트 등록에 실패했습니다. 다시 시도해 주세요.';
      console.error('[MentorReportPage] handleSaveReport failed', {
        status: ax.response?.status,
        data: ax.response?.data,
        message: ax.message,
      });
      alert(alertMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full pb-4">
      {/* 브레드크럼 */}
      <nav className="text-sm text-gray-500" aria-label="breadcrumb">
        <Link
          to="/mentor"
          className="text-[var(--color-gray-500)] no-underline hover:text-[var(--color-primary-500)]"
        >
          Desktop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-500)] font-medium">
          {activeTab === 'WEEKLY' ? '주간 리포트' : '월간 리포트'}
        </span>
      </nav>

      {/* 상단: 검색 */}
      <div className="flex justify-start">
        <div className="min-w-[200px] w-full max-w-sm">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="멘티 검색"
            ariaLabel="멘티 검색"
          />
        </div>
      </div>

      {/* 제목 + 설명 */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 m-0">
          <BarChart2 size={22} className="text-[var(--color-primary-500)]" />
          학습 리포트
        </h1>
        <p className="text-sm text-gray-600 mt-1 m-0">
          학생의 학습을 분석하고 맞춤형 피드백을 작성해 주세요.
        </p>
      </div>

      {/* 주간 / 월간 탭 + 해당 기간 표시 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-[10px] bg-gray-100 p-1 gap-0.5">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-2 px-5 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-600" aria-live="polite">
          {activeTab === 'WEEKLY' ? '해당 주: ' : '해당 월: '}
          <strong className="text-gray-900">{periodLabel}</strong>
        </span>
      </div>

      {/* 멘티 캐러셀 */}
      <section className="flex items-center gap-3 overflow-hidden py-2" aria-label="멘티 선택">
        <button
          type="button"
          className="shrink-0 w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleCarouselPrev}
          disabled={filteredMentees.length <= 1}
          aria-label="이전 멘티"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center justify-center gap-3 flex-1 min-h-[100px]">
          {menteeLoading ? (
            <div className="text-sm text-gray-500 py-4">멘티 목록을 불러오는 중...</div>
          ) : filteredMentees.length === 0 ? (
            <div className="text-sm text-gray-500 py-4">검색 결과가 없습니다.</div>
          ) : (
            filteredMentees.map((mentee) => (
              <button
                key={mentee.id}
                type="button"
                className={cn(
                  'shrink-0 w-[200px] p-4 rounded-xl border-2 text-center cursor-pointer transition-colors',
                  selectedMentee?.id === mentee.id
                    ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
                    : 'border-transparent bg-gray-50 opacity-75 hover:opacity-100 hover:bg-gray-100'
                )}
                onClick={() => setSelectedMentee(mentee)}
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary-500)] text-white text-lg font-bold flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  {getProfileImageUrl(mentee.profileUrl) ? (
                    <img src={getProfileImageUrl(mentee.profileUrl)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    mentee.avatar
                  )}
                </div>
                <div className="font-semibold text-gray-900 truncate">{mentee.name}</div>
                <div className="text-xs text-gray-600 truncate mb-1">
                  {selectedDetail?.school ?? mentee.subject}
                </div>
                <div className="text-xs text-gray-600">
                  {selectedMentee?.id === mentee.id && !statsLoading
                    ? `총 학습 시간 ${studyTimeHours}h · 평균 진척률 ${Math.round(monthlyAchievement)}%`
                    : selectedMentee?.id === mentee.id
                      ? '로딩 중…'
                      : '선택하여 보기'}
                </div>
              </button>
            ))
          )}
        </div>
        <button
          type="button"
          className="shrink-0 w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={handleCarouselNext}
          disabled={filteredMentees.length <= 1}
          aria-label="다음 멘티"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* 하단: 왼쪽 학습 요약 + 오른쪽 리포트 작성 */}
      {selectedMentee && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 왼쪽: 멘티 학습 요약 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-600)] text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {getProfileImageUrl(selectedMentee.profileUrl) ? (
                  <img src={getProfileImageUrl(selectedMentee.profileUrl)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  selectedMentee.avatar
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900">{selectedMentee.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedDetail?.school ?? selectedMentee.subject}
                </div>
              </div>
            </div>

            <div className="text-[0.8125rem] font-semibold text-gray-800 mb-3">1일 1회 학습 결과</div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-[var(--color-primary-50)] text-center">
                <div className="text-xs text-gray-600 mb-1">과제 완료율</div>
                <div className="text-2xl font-bold text-[var(--color-primary-600)]">
                  {statsLoading ? '-' : `${Math.round(monthlyAchievement)}%`}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-primary-50)] text-center">
                <div className="text-xs text-gray-600 mb-1">총 공부 시간</div>
                <div className="text-2xl font-bold text-[var(--color-primary-600)]">
                  {statsLoading ? '-' : `${studyTimeHours}H`}
                </div>
              </div>
            </div>

            <div className="text-[0.8125rem] font-semibold text-gray-800 mb-3">과목별 분석</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-3 mb-5">
              {subjectStatsLoading ? (
                <li className="text-sm text-gray-500">불러오는 중…</li>
              ) : subjectStats.length === 0 ? (
                <li className="text-sm text-gray-500">과목별 데이터가 없습니다.</li>
              ) : (
                subjectStats.map((item, index) => {
                  const label = SUBJECT_OPTIONS.find((o) => o.value === item.subject)?.label ?? item.subject;
                  const timeHours = Math.floor(item.studyMinutes / 60);
                  const barColor = BAR_COLORS[index % BAR_COLORS.length];
                  return (
                    <li key={item.subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{label}</span>
                        <span className="text-gray-600">
                          {timeHours}h, {item.achievementRate}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden bg-gray-200">
                        <div
                          className={cn('h-full rounded-full min-w-[4px]', barColor)}
                          style={{ width: `${item.achievementRate}%` }}
                        />
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="text-[0.8125rem] font-semibold text-gray-800 mb-3 flex justify-between items-center">
              최근 피드백
              <Link to="/mentor/feedback" className="text-[0.8125rem] text-[var(--color-primary-500)] no-underline hover:underline">
                피드백 더보기 &gt;
              </Link>
            </div>
            <ul className="list-none m-0 p-0 text-sm text-gray-600 space-y-1">
              {feedbacksLoading ? (
                <li className="text-gray-400">불러오는 중…</li>
              ) : feedbacks.length === 0 ? (
                <li className="text-gray-400">최근 피드백이 없습니다.</li>
              ) : (
                feedbacks.map((fb, index) => (
                  <li key={fb.feedbackId ? `feedback-${fb.feedbackId}` : `task-${fb.taskId}-${index}`}>
                    <button
                      type="button"
                      className="text-left w-full py-1 pr-2 rounded hover:bg-gray-50 hover:text-[var(--color-primary-600)] transition-colors cursor-pointer border-none bg-transparent"
                      onClick={() => setSelectedFeedback(fb)}
                    >
                      {fb.taskTitle}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 오른쪽: 주간/월간 리포트 작성 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-4 m-0">
              {activeTab === 'WEEKLY' ? '주간 리포트 작성' : '월간 리포트 작성'}
            </h2>

            <div className="flex items-start gap-2 mb-4">
              <div className="shrink-0 w-5 h-5 text-gray-500 mt-[0.35rem] flex items-center justify-center">
                <BarChart2 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="report-total">
                  멘트 총평
                </label>
                <textarea
                  id="report-total"
                  value={totalReview}
                  onChange={(e) => setTotalReview(e.target.value)}
                  className={textareaBase}
                  placeholder="짧은 시간의 힘, 자투리 10분이 성적을 바꾼다"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <Gift size={18} className="shrink-0 w-5 h-5 text-gray-500 mt-[0.35rem]" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="report-good">
                  칭찬할 점 (Keep)
                </label>
                <textarea
                  id="report-good"
                  value={goodPoints}
                  onChange={(e) => setGoodPoints(e.target.value)}
                  className={textareaBase}
                  placeholder="매일 꾸준히 학습하는 습관이 잘 형성되었어요"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <AlertTriangle size={18} className="shrink-0 w-5 h-5 text-gray-500 mt-[0.35rem]" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="report-improve">
                  개선할 점 (Problem)
                </label>
                <textarea
                  id="report-improve"
                  value={improvePoints}
                  onChange={(e) => setImprovePoints(e.target.value)}
                  className={textareaBase}
                  placeholder="문제 풀이 속도를 높일 필요가 있어요"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 mb-4">
              <CheckSquare size={18} className="shrink-0 w-5 h-5 text-gray-500 mt-[0.35rem]" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="report-try">
                  다음 주 목표 (Try)
                </label>
                <textarea
                  id="report-try"
                  value={tryContent}
                  onChange={(e) => setTryContent(e.target.value)}
                  className={textareaBase}
                  placeholder="타이머를 활용해 문제풀이 연습하기"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                className="py-2.5 px-5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50"
              >
                임시 저장
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveReport}
                className="py-2.5 px-5 rounded-lg border-none bg-[var(--color-primary-500)] text-white text-sm font-medium cursor-pointer hover:bg-[var(--color-primary-600)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? '등록 중…' : '리포트 등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주간 네비게이션 (주간 리포트일 때만) */}
      {selectedMentee && activeTab === 'WEEKLY' && (
        <nav className="flex items-center justify-center gap-4 py-4 mt-4" aria-label="주간 이동">
          <button
            type="button"
            className="py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm cursor-pointer hover:bg-gray-50"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            &lt; 이전주
          </button>
          <button
            type="button"
            className="py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm cursor-pointer hover:bg-gray-50"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            다음주 &gt;
          </button>
        </nav>
      )}

      {/* 최근 피드백 상세 모달 (최근 제공 과제와 동일한 스타일) */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedFeedback(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-detail-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 id="feedback-detail-modal-title" className="text-lg font-bold text-gray-900 m-0 truncate pr-4">
                {selectedFeedback.taskTitle} 피드백
              </h2>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 min-h-0 flex flex-col gap-4">
              {selectedFeedback.summary?.trim() ? (
                <div>
                  <p className="text-xs font-medium text-gray-500 m-0 mb-1">요약</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap m-0">{selectedFeedback.summary}</p>
                </div>
              ) : null}
              <div className="p-3 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-100)]">
                <p className="text-xs font-medium text-[var(--color-primary-700)] m-0 mb-1">상세 코멘트</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap m-0">
                  {selectedFeedback.comment?.trim() || '작성된 코멘트가 없습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorReportPage;
