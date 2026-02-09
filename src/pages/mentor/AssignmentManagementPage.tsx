import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Minus, List } from 'lucide-react';
import SearchInput from '../../components/common/input/SearchInput';
import TaskDetailModal from '../../components/common/modal/TaskDetailModal';
import type { MenteeListItem } from '../../libs/types/mentee';
import type { AssignmentFormValues } from '../../libs/types/mentor';
import type { LearningMaterialItem } from '../../libs/types/material';
import {
  ASSIGNMENT_FORM_DEFAULT,
  DEFAULT_MENTEE_ASSIGNMENT_DETAIL,
  SUBJECT_OPTIONS,
  TASK_TYPE_OPTIONS,
} from '../../static/assignment';
import { useMenteeList } from '../../hooks/useMenteeList';
import { useRecentMenteeTasks } from '../../hooks/useRecentMenteeTasks';
import { useMaterials } from '../../hooks/task/useMaterials';
import { useAssignTask } from '../../hooks/task/useAssignTask';

const AssignmentManagementPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<MenteeListItem | null>(null);
  const [formValues, setFormValues] = useState<AssignmentFormValues>(ASSIGNMENT_FORM_DEFAULT);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);

  const { menteeList, isLoading: menteeLoading } = useMenteeList();
  const { recentTasks, isLoading: recentTasksLoading } = useRecentMenteeTasks(selectedMentee?.id ?? null);
  const { materials } = useMaterials();
  const { assignTask: submitAssignTask, isPending: assignPending } = useAssignTask();

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [detailTaskId, setDetailTaskId] = useState<number | null>(null);

  const filteredMentees = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return menteeList;
    return menteeList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
    );
  }, [menteeList, searchValue]);

  const selectedDetail = selectedMentee ? DEFAULT_MENTEE_ASSIGNMENT_DETAIL : null;

  const handleCancel = () => {
    setFormValues(ASSIGNMENT_FORM_DEFAULT);
    setAttachedFiles([]);
    setSelectedMaterialId(null);
  };

  const handleMaterialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSelectedMaterialId(null);
      setFormValues(ASSIGNMENT_FORM_DEFAULT);
      return;
    }
    const id = Number(value);
    const material = materials.find((m) => m.id === id) as LearningMaterialItem | undefined;
    if (!material) return;
    setSelectedMaterialId(id);
    setFormValues({
      taskType: (material.taskType === 'COLUMN' || material.taskType === 'WEAKNESS_SOLUTION' ? material.taskType : 'WEAKNESS_SOLUTION') as AssignmentFormValues['taskType'],
      title: material.title,
      content: material.content ?? '',
      subject: material.subject,
      date: formValues.date || new Date().toISOString().slice(0, 10),
    });
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
      materialId: selectedMaterialId ?? undefined,
      taskType,
      title: title.trim(),
      content: content.trim() || undefined,
      subject,
      date,
    };
    const filesToSend = selectedMaterialId == null && attachedFiles.length ? attachedFiles : undefined;
    try {
      await submitAssignTask({
        payload,
        files: filesToSend,
      });
      alert(`"${title}" 과제를 ${selectedMentee.name} 멘티에게 등록했습니다.`);
      setFormValues(ASSIGNMENT_FORM_DEFAULT);
      setAttachedFiles([]);
      setSelectedMaterialId(null);
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err ? (err as { response: { status: number; data: unknown } }).response : null;
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
    'w-full p-2.5 border border-gray-300 rounded-md text-sm text-gray-900 bg-white font-[inherit] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]';

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full">
      {/* 상단: 멘티 검색 */}
      <div className="flex justify-end">
        <div className="min-w-[200px] w-full max-w-sm">
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="멘티 검색"
            ariaLabel="멘티 검색"
          />
        </div>
      </div>

      {/* 타이틀 + 설명 (이미지: 학습 자료 관리) */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800 m-0">과제 관리</h1>
        <p className="text-sm text-gray-600 mt-1 m-0">
          도착한 피드백을 확인하고 지난 학습 기록을 관리하세요.
        </p>
      </section>

      {!selectedMentee ? (
        /* Step 1: 멘티 선택 */
        <div className="bg-white rounded-lg shadow-md p-6 max-w-[560px]">
          <h2 className="text-base font-semibold text-gray-800 m-0 mb-2">멘티 선택</h2>
          <p className="text-sm text-gray-600 m-0 mb-4">과제를 할당할 멘티를 검색하거나 목록에서 선택하세요.</p>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {menteeLoading ? (
              <li className="py-6 text-center text-sm text-gray-500">멘티 목록을 불러오는 중...</li>
            ) : filteredMentees.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-500">검색 결과가 없습니다.</li>
            ) : (
              filteredMentees.map((mentee) => (
                <li key={mentee.id}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-md text-left cursor-pointer transition-colors hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => setSelectedMentee(mentee)}
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-500)] text-white text-base font-bold flex items-center justify-center shrink-0">
                      {mentee.avatar}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-base font-medium text-gray-900">{mentee.name}</span>
                      <span className="text-sm text-gray-600">{mentee.subject}</span>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-gray-400" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : (
        /* Step 2: 과제 할당 - 두 패널 (이미지 스타일) */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* 왼쪽: 멘티 프로필 + 달성률 + 최근 과제 */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className="w-14 h-14 rounded-full bg-[var(--color-primary-500)] text-white text-xl font-bold flex items-center justify-center"
                  aria-hidden
                >
                  {selectedMentee.avatar}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 m-0">{selectedMentee.name}</h2>
                <p className="text-sm text-gray-600 m-0">
                  {selectedDetail?.school ?? selectedMentee.subject}
                </p>
                <button
                  type="button"
                  className="text-sm text-[var(--color-primary-500)] bg-transparent border-none cursor-pointer underline p-0 hover:text-[var(--color-primary-600)]"
                  onClick={() => setSelectedMentee(null)}
                >
                  멘티 변경
                </button>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 m-0 mb-2">이번 주 과제 달성률</p>
                <p className="text-4xl font-bold text-[var(--color-primary-600)] m-0 mb-3">
                  {selectedDetail?.achievementRate ?? 0}%
                </p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary-500)] rounded-full transition-[width] duration-200"
                    style={{ width: `${selectedDetail?.achievementRate ?? 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mt-6 mb-3">
                  <h3 className="font-semibold text-gray-800 m-0">최근 제공 과제</h3>
                  <Link
                    to={`/mentor/assignment/tasks?menteeId=${selectedMentee.id}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium no-underline"
                  >
                    <List className="w-4 h-4 shrink-0" aria-hidden />
                    과제 전체 조회
                  </Link>
                </div>
                <ul className="list-none m-0 p-0 flex flex-col gap-3">
                  {recentTasksLoading ? (
                    <li className="py-4 text-center text-sm text-gray-500">최근 과제를 불러오는 중...</li>
                  ) : recentTasks.length === 0 ? (
                    <li className="py-4 text-center text-sm text-gray-500">최근 제공 과제가 없습니다.</li>
                  ) : (
                    recentTasks.map((item) => (
                      <li key={item.taskId}>
                        <button
                          type="button"
                          onClick={() => setDetailTaskId(item.taskId)}
                          className="w-full text-left bg-white border border-gray-200 rounded-md p-3 hover:border-[var(--color-primary-200)] hover:shadow-sm transition-colors"
                        >
                          <span className="inline-block text-xs font-medium px-2 py-1 rounded-md mb-1 bg-blue-100 text-blue-800">
                            과제
                          </span>
                          <p className="text-sm font-medium text-gray-900 m-0">{item.title}</p>
                          <p className="text-sm text-gray-500 m-0 mt-0.5">클릭하면 상세 보기</p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* 오른쪽: 과제 제공 폼 (라벨 위, 보라 포커스, 보라 버튼) */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-gray-900 m-0 mb-1">과제 제공</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-material">
                    자료실에서 가져오기
                  </label>
                  <select
                    id="assignment-material"
                    className={inputBase}
                    value={selectedMaterialId ?? ''}
                    onChange={handleMaterialSelect}
                    aria-label="자료실 자료 선택 (선택 사항)"
                  >
                    <option value="">직접 입력</option>
                    {materials.map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.subject}] {m.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1 m-0">
                    자료를 선택하면 제목·내용·과목·유형이 채워지고, 해당 자료로 과제가 할당됩니다. 비우면 직접 입력합니다.
                  </p>
                </div>
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
                {selectedMaterialId == null && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="assignment-file">
                      직접 파일 업로드 (materialId 없을 때)
                    </label>
                    {attachedFiles.length === 0 ? (
                      <div className="flex items-center gap-2 p-2.5 border border-gray-300 rounded-md bg-white">
                        <span className="flex-1 min-w-0 text-sm text-gray-500">선택된 파일 없음</span>
                      </div>
                    ) : (
                      <ul className="list-none m-0 p-0 flex flex-col gap-2">
                        {attachedFiles.map((file, i) => (
                          <li key={i} className="flex items-center gap-2 p-2.5 border border-gray-300 rounded-md bg-white">
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
                      className="mt-2 text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[var(--color-primary-50)] file:text-[var(--color-primary-600)]"
                      aria-label="PDF 파일 선택"
                    />
                  </div>
                )}
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
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={assignPending}
                  className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={assignPending}
                  className="px-4 py-2 bg-[var(--color-primary-600)] text-white rounded-md hover:bg-[var(--color-primary-700)] disabled:opacity-50 font-medium"
                >
                  {assignPending ? '등록 중...' : '과제 등록'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {detailTaskId != null && (
        <TaskDetailModal taskId={detailTaskId} onClose={() => setDetailTaskId(null)} />
      )}
    </div>
  );
};

export default AssignmentManagementPage;
