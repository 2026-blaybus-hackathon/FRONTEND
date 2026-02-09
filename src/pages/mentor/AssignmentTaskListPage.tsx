import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useMentorMenteeTasks } from '../../hooks/useMentorMenteeTasks';
import { useMenteeList } from '../../hooks/useMenteeList';
import TaskDetailModal from '../../components/common/modal/TaskDetailModal';
import type { MentorTaskItem } from '../../libs/types/mentor';

const AssignmentTaskListPage = () => {
  const [searchParams] = useSearchParams();
  const menteeIdParam = searchParams.get('menteeId');
  const menteeId = menteeIdParam ? Number(menteeIdParam) : null;
  const [detailTaskId, setDetailTaskId] = useState<number | null>(null);

  const { menteeList } = useMenteeList();
  const { tasks, isLoading, isError } = useMentorMenteeTasks(menteeId, {
    page: 0,
    size: 100,
    enabled: menteeId != null && menteeId > 0,
  });

  const content = tasks?.content ?? [];
  const mentee = menteeId ? menteeList.find((m) => m.id === menteeId) : null;

  if (menteeId == null || menteeId <= 0) {
    return (
      <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full">
        <nav className="text-sm text-[var(--color-text-muted)]" aria-label="breadcrumb">
          <Link to="/mentor" className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]">
            Desktop
          </Link>
          <span className="mx-2">/</span>
          <Link to="/mentor/assignment" className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]">
            과제 관리
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-primary-500)] font-medium">과제 전체 조회</span>
        </nav>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-600 m-0 mb-4">멘티를 선택한 뒤 과제 전체 조회를 이용해 주세요.</p>
          <Link
            to="/mentor/assignment"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary-500)] text-white font-medium hover:bg-[var(--color-primary-600)] no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            과제 관리로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content flex flex-col gap-6 bg-[var(--color-primary-50)] min-h-full">
      <nav className="text-sm text-[var(--color-text-muted)]" aria-label="breadcrumb">
        <Link to="/mentor" className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]">
          Desktop
        </Link>
        <span className="mx-2">/</span>
        <Link to="/mentor/assignment" className="text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary-500)]">
          과제 관리
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-primary-500)] font-medium">과제 전체 조회</span>
      </nav>

      <section className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            to="/mentor/assignment"
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            aria-label="과제 관리로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">
              과제 전체 조회
              {mentee && <span className="text-lg font-normal text-gray-600 ml-2">({mentee.name})</span>}
            </h1>
            <p className="text-sm text-gray-500 m-0 mt-0.5">
              총 {tasks?.totalElements ?? 0}건
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">과제 목록을 불러오는 중...</div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-600">목록을 불러오지 못했습니다.</div>
        ) : content.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">제공한 과제가 없습니다.</div>
        ) : (
          <ul className="list-none m-0 p-0 divide-y divide-gray-100">
            {content.map((item: MentorTaskItem) => (
              <li key={item.taskId}>
                <button
                  type="button"
                  onClick={() => setDetailTaskId(item.taskId)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-0 bg-transparent cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-100)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[var(--color-primary-500)]" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-medium text-gray-900 m-0 truncate">{item.title}</p>
                    <p className="text-sm text-gray-500 m-0 mt-0.5">과제 ID: {item.taskId}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {detailTaskId != null && (
        <TaskDetailModal taskId={detailTaskId} onClose={() => setDetailTaskId(null)} />
      )}
    </div>
  );
};

export default AssignmentTaskListPage;
