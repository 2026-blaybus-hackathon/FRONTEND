import { X, Clock, MessageSquare, CheckCircle, Circle } from 'lucide-react';
import { useTaskDetail } from '../../../hooks/useTaskDetail';

export interface TaskDetailModalProps {
  taskId: number | null;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * GET /tasks/:taskId 연동 할 일 상세 모달.
 * taskId가 있으면 API로 상세 조회 후 표시.
 */
const TaskDetailModal = ({ taskId, onClose }: TaskDetailModalProps) => {
  const { task, totalFeedback, isLoading, isError } = useTaskDetail(taskId);

  if (taskId == null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 id="task-detail-modal-title" className="text-lg font-bold text-gray-900 m-0 truncate pr-4">
            할 일 상세
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">상세 정보를 불러오는 중...</div>
          ) : isError ? (
            <div className="py-8 text-center text-sm text-red-600">불러오지 못했습니다.</div>
          ) : !task ? (
            <div className="py-8 text-center text-sm text-gray-500">내용이 없습니다.</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
                    {task.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(task.date)}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 m-0">{task.title}</h3>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {task.status ? (
                  <span className="inline-flex items-center gap-1.5 text-green-700">
                    <CheckCircle className="w-4 h-4" aria-hidden />
                    완료
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-gray-500">
                    <Circle className="w-4 h-4" aria-hidden />
                    미완료
                  </span>
                )}
                {task.time != null && task.time > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4" aria-hidden />
                    {task.time}분
                  </span>
                )}
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">피드백: {task.feedbackStatus}</span>
              </div>

              {task.menteeComment?.trim() && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 m-0 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                    멘티 코멘트
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap m-0">{task.menteeComment}</p>
                </div>
              )}

              {task.feedback?.content?.trim() && (
                <div className="p-3 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-100)]">
                  <p className="text-xs font-medium text-[var(--color-primary-700)] m-0 mb-1">피드백</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap m-0">{task.feedback.content}</p>
                </div>
              )}

              {totalFeedback?.trim() && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-800 m-0 mb-1">종합 피드백</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap m-0">{totalFeedback}</p>
                </div>
              )}

              {task.images?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 m-0 mb-2">과제 이미지</p>
                  <div className="flex flex-wrap gap-2">
                    {[...task.images]
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((img) => (
                        <a
                          key={img.sequence}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 hover:border-[var(--color-primary-300)]"
                        >
                          <img
                            src={img.url}
                            alt={img.name || `이미지 ${img.sequence}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
