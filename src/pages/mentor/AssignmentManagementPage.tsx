import { useState, useMemo, useEffect } from 'react';
import { Minus } from 'lucide-react';
import SearchInput from '../../components/common/input/SearchInput';
import IconButton from '../../components/common/button/IconButton';
import { Play, PlayReverse } from '../../icons';
import { cn } from '../../libs/utils';
import type { MenteeListItem } from '../../libs/types/mentee';
import type { MentorTaskItem } from '../../libs/types/mentor';
import type { AssignmentFormValues } from '../../libs/types/mentor';
import {
  ASSIGNMENT_FORM_DEFAULT,
  DEFAULT_MENTEE_ASSIGNMENT_DETAIL,
  SUBJECT_OPTIONS,
  TASK_TYPE_OPTIONS,
} from '../../static/assignment';
import { useMenteeList } from '../../hooks/useMenteeList';
import { useRecentMenteeTaskDetail } from '../../hooks/useRecentMenteeTaskDetail';
import { useAssignTask } from '../../hooks/useAssignTask';
import RecentTaskDetailModal from '../../components/common/modal/RecentTaskDetailModal';

const SUBJECT_BADGE: Record<string, { label: string; style: string }> = {
  KOREAN: { label: '국어', style: 'bg-[var(--color-lime-100)] text-[var(--color-lime-500)]' },
  MATH: { label: '수학', style: 'bg-[var(--color-blue-100)] text-[var(--color-blue-500)]' },
  ENGLISH: { label: '영어', style: 'bg-[var(--color-red-100)] text-[var(--color-red-500)]' },
};

const AssignmentManagementPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<MenteeListItem | null>(null);
  const [formValues, setFormValues] = useState<AssignmentFormValues>(ASSIGNMENT_FORM_DEFAULT);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const { menteeList, isLoading: menteeLoading } = useMenteeList();
  const {
    recentTasks,
    isLoading: recentTasksLoading,
    selectedTask,
    openTaskDetail,
    closeTaskDetail,
  } = useRecentMenteeTaskDetail(selectedMentee?.id ?? null);
  const { assignTask: submitAssignTask, isPending: assignPending } = useAssignTask();

  const filteredMentees = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return menteeList;
    return menteeList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [menteeList, searchValue]);

  useEffect(() => {
    const mqXl = window.matchMedia('(min-width: 1640px)');
    const mq2xl = window.matchMedia('(min-width: 1920px)');
    const update = () => {
      setPageSize(mq2xl.matches ? 5 : mqXl.matches ? 4 : 3);
    };
    update();
    mqXl.addEventListener('change', update);
    mq2xl.addEventListener('change', update);
    return () => {
      mqXl.removeEventListener('change', update);
      mq2xl.removeEventListener('change', update);
    };
  }, []);

  // 멘티가 1명이면 해당 멘티 선택 상태로 표시
  useEffect(() => {
    if (selectedMentee == null && filteredMentees.length === 1) {
      setSelectedMentee(filteredMentees[0]);
    }
  }, [filteredMentees, selectedMentee]);

  const lastPage = Math.ceil(filteredMentees.length / pageSize) || 1;
  const effectivePage = Math.min(page, Math.max(0, lastPage - 1));
  const paginatedMentees = filteredMentees.slice(
    effectivePage * pageSize,
    (effectivePage + 1) * pageSize
  );

  const selectedDetail = selectedMentee ? DEFAULT_MENTEE_ASSIGNMENT_DETAIL : null;

  const handleCancel = () => {
    setFormValues(ASSIGNMENT_FORM_DEFAULT);
    setAttachedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setAttachedFiles(Array.from(files));
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    if (!selectedMentee) return;
    const { taskType, title, content, subject, date } = formValues;
    if (!title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    if (!date) {
      alert('날짜를 선택해 주세요.');
      return;
    }
    const payload = {
      menteeId: selectedMentee.id,
      taskType,
      title: title.trim(),
      content: content.trim(),
      subject,
      date,
    };
    try {
      await submitAssignTask({
        payload,
        files: attachedFiles.length ? attachedFiles : undefined,
      });
      alert(`"${title}" 과제를 ${selectedMentee.name} 멘티에게 등록했습니다.`);
      setFormValues(ASSIGNMENT_FORM_DEFAULT);
      setAttachedFiles([]);
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err ? (err as { response: { status: number; data: unknown } }).response : null;
      console.error('[AssignmentManagementPage] assign error', res?.status, res?.data, err);
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof (err.response.data as Record<string, unknown>).message === 'string'
          ? (err.response.data as { message: string }).message
          : '과제 등록에 실패했습니다. 다시 시도해 주세요.';
      alert(message);
    }
  };

  const inputBase =
    'w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white font-[inherit] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]';

  return (
    <div className="main-content lg:h-full flex flex-col gap-10 bg-[var(--color-primary-50)] min-h-full">
      {/* 검색 + 멘티 카드 캐러셀 (피드백관리와 동일 레이아웃) */}
      <div className="flex flex-col gap-6">
        <SearchInput
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="멘티 검색"
          ariaLabel="멘티 검색"
          className="w-full max-w-[180px]"
        />
        <div className="flex justify-between items-center gap-4">
          <IconButton
            variant="primary-line"
            Icon={<PlayReverse />}
            onClick={() => setPage(Math.max(0, effectivePage - 1))}
            ariaLabel="이전"
            disabled={effectivePage === 0}
          />
          <div className="flex-1 flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center min-h-[100px]">
            {menteeLoading ? (
              <div className="py-8 text-center text-sm text-gray-500">멘티 목록을 불러오는 중...</div>
            ) : paginatedMentees.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">검색 결과가 없습니다.</div>
            ) : (
              paginatedMentees.map((mentee) => (
                <MenteeListCard
                  key={mentee.id}
                  id={mentee.id}
                  name={mentee.name}
                  subject={mentee.subject}
                  avatar={mentee.avatar}
                  selected={selectedMentee?.id === mentee.id}
                  onClick={() => setSelectedMentee(mentee)}
                />
              ))
            )}
          </div>
          <IconButton
            variant="primary-line"
            Icon={<Play />}
            onClick={() => setPage(Math.min(lastPage - 1, effectivePage + 1))}
            ariaLabel="다음"
            disabled={effectivePage >= lastPage - 1}
          />
        </div>
      </div>

      {/* 하단: 좌측 최근 제공 과제 카드 목록 | 우측 과제 제공 폼 (피드백관리와 동일 2단 구조) */}
      {selectedMentee && (
        <div className="w-full flex flex-1 flex-col-reverse md:flex-row gap-6 min-h-0">
          {/* 왼쪽: 최근 제공 과제 카드 목록 */}
          <div className="md:w-fit w-full flex flex-col gap-4 overflow-y-auto min-h-0">
            <h3 className="text-sm font-semibold text-gray-800 m-0">최근 제공 과제</h3>
            {recentTasksLoading ? (
              <div className="py-6 text-center text-sm text-gray-500">최근 과제를 불러오는 중...</div>
            ) : recentTasks.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">최근 제공 과제가 없습니다.</div>
            ) : (
              recentTasks.map((item) => (
                <RecentTaskCard
                  key={item.taskId}
                  task={item}
                  onClick={() => openTaskDetail(item)}
                />
              ))
            )}
          </div>

          {/* 오른쪽: 과제 제공 폼 (피드백관리 종합 피드백 영역과 동일 스타일) */}
          <div className="flex-1 flex flex-col px-6 py-6 bg-white rounded-2xl border border-gray-100 gap-6 min-h-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-800 m-0">과제 제공</h2>
                <span className="text-sm text-gray-500">멘티: {selectedMentee.name}</span>
                <button
                  type="button"
                  className="text-sm text-[var(--color-primary-500)] bg-transparent border-none cursor-pointer underline p-0 hover:text-[var(--color-primary-600)]"
                  onClick={() => setSelectedMentee(null)}
                >
                  멘티 변경
                </button>
              </div>
              <p className="text-sm text-gray-500 m-0">
                과제 유형, 과목, 제목과 내용을 입력하고 멘티에게 과제를 등록하세요.
              </p>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto min-h-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-taskType">
                  과제 유형
                </label>
                <select
                  id="assignment-taskType"
                  className={inputBase}
                  value={formValues.taskType}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, taskType: e.target.value as AssignmentFormValues['taskType'] }))
                  }
                  aria-label="과제 유형 선택"
                >
                  {TASK_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-subject">
                  과목
                </label>
                <select
                  id="assignment-subject"
                  className={inputBase}
                  value={formValues.subject}
                  onChange={(e) => setFormValues((v) => ({ ...v, subject: e.target.value }))}
                  aria-label="과목 선택"
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-file">
                  파일
                </label>
                {attachedFiles.length === 0 ? (
                  <div className="flex items-center gap-2 p-2.5 border border-gray-300 rounded-lg bg-white">
                    <span className="flex-1 min-w-0 text-sm text-gray-500">선택된 파일 없음</span>
                  </div>
                ) : (
                  <ul className="list-none m-0 p-0 flex flex-col gap-2">
                    {attachedFiles.map((file, i) => (
                      <li key={i} className="flex items-center gap-2 p-2.5 border border-gray-300 rounded-lg bg-white">
                        <span className="flex-1 min-w-0 text-sm text-gray-900 truncate">{file.name}</span>
                        <button
                          type="button"
                          className="w-6 h-6 rounded-full bg-red-500 text-white border-none flex items-center justify-center cursor-pointer shrink-0 hover:bg-red-600"
                          onClick={() => removeFile(i)}
                          aria-label={`${file.name} 제거`}
                        >
                          <Minus size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  id="assignment-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="mt-2 text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--color-primary-50)] file:text-[var(--color-primary-600)]"
                  aria-label="PDF 파일 선택"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-title">
                  제목
                </label>
                <input
                  id="assignment-title"
                  type="text"
                  className={inputBase}
                  value={formValues.title}
                  onChange={(e) => setFormValues((v) => ({ ...v, title: e.target.value }))}
                  placeholder="예: 수학 기출문제 풀이"
                  aria-label="과제 제목"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-content">
                  내용
                </label>
                <textarea
                  id="assignment-content"
                  className={inputBase + ' resize-y min-h-[72px]'}
                  value={formValues.content}
                  onChange={(e) => setFormValues((v) => ({ ...v, content: e.target.value }))}
                  placeholder="예: 첨부된 PDF 3페이지부터 10페이지까지 풀기"
                  rows={3}
                  aria-label="과제 내용"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-date">
                  날짜
                </label>
                <input
                  id="assignment-date"
                  type="date"
                  className={inputBase}
                  value={formValues.date}
                  onChange={(e) => setFormValues((v) => ({ ...v, date: e.target.value }))}
                  aria-label="과제 날짜"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={assignPending}
                className="px-4 py-2.5 text-gray-700 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleRegister}
                disabled={assignPending}
                className="px-4 py-2.5 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 text-sm font-medium"
              >
                {assignPending ? '등록 중...' : '과제 등록'}
              </button>
            </div>
          </div>
        </div>
      )}

      <RecentTaskDetailModal task={selectedTask} onClose={closeTaskDetail} />
    </div>
  );
};

/* 멘티 카드 (피드백관리 MenteeListCard와 동일 스타일) */
interface MenteeListCardProps {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  selected: boolean;
  onClick: () => void;
}

const MenteeListCard = ({ name, subject, avatar, selected, onClick }: MenteeListCardProps) => {
  return (
    <div
      className={cn(
        'w-full max-w-[160px] min-w-[120px] flex flex-col gap-3 rounded-[12px] py-4 px-4 relative overflow-hidden cursor-pointer transition-opacity shrink-0',
        'bg-white'
      )}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`멘티 ${name} - 클릭 시 과제 제공`}
    >
      <div
        className={cn(
          'absolute inset-0 rounded-[12px] bg-[linear-gradient(90deg,#5D46DC_0%,#6F41DE_50%,#843CE0_100%)] transition-opacity duration-300',
          selected ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden
      />
      <div className="h-full relative z-10 flex flex-col justify-between">
        <div className="flex gap-3 flex-row">
          <div className="min-w-10 w-10 h-10 rounded-full bg-[var(--color-primary-500)] flex items-center justify-center text-white text-base font-semibold shrink-0">
            {avatar}
          </div>
          <div className="flex flex-col min-w-0">
            <p className={cn('text-base font-medium truncate transition-colors duration-300', selected ? 'text-white' : 'text-gray-800')}>
              {name}
            </p>
            <p className={cn('text-sm truncate transition-colors duration-300', selected ? 'text-white/90' : 'text-gray-500')}>
              {subject || '-'}
            </p>
          </div>
        </div>
        <p className={cn('text-xs font-medium text-right mt-2 transition-colors duration-300', selected ? 'text-white/90' : 'text-gray-400')}>
          과제 제공
        </p>
      </div>
    </div>
  );
};

/* 최근 제공 과제 카드 (피드백관리 MenteeAssignmentCard와 동일 스타일) */
interface RecentTaskCardProps {
  task: MentorTaskItem;
  onClick: () => void;
}

const RecentTaskCard = ({ task, onClick }: RecentTaskCardProps) => {
  const subjectStyle = 'bg-[var(--color-blue-100)] text-[var(--color-blue-500)]';
  return (
    <button
      type="button"
      className="w-full md:w-[264px] rounded-xl py-4 px-5 gap-3 flex flex-col bg-white shadow-sm border border-gray-100 justify-between text-left hover:border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)] transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <span className={cn('w-fit text-xs font-bold px-2 py-1 rounded-full', subjectStyle)}>
          과제
        </span>
        <p className="text-sm text-gray-900 font-medium m-0 line-clamp-2">{task.title}</p>
      </div>
      <div className="flex flex-col gap-1 justify-end">
        <div className="flex gap-4 text-xs font-medium text-gray-600">
          <span>이미지</span>
          <span>{task.images?.length ? `${task.images.length}장` : '0장'}</span>
        </div>
      </div>
    </button>
  );
};

export default AssignmentManagementPage;
