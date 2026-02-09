interface SubmittedTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: number;
    title: string;
    subject: string;
    date: string;
    studyTime: string;
    images: string[];
    comment?: string;
    feedback?: {
      summary: string;
      detail: string;
    };
  };
}

const SubmittedTaskModal = ({ isOpen, onClose, task }: SubmittedTaskModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">제출 과제 조회</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 과목 태그 */}
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
              {task.subject}
            </span>
            <p className="text-sm text-gray-500 mt-1">{task.date}</p>
          </div>

          {/* 과제명 */}
          <div>
            <h3 className="text-base font-bold text-gray-900">{task.title}</h3>
          </div>

          {/* 공부 시간 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공부한 시간 *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={task.studyTime.split('시간')[0]}
                readOnly
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
              />
              <span className="text-sm text-gray-600">시간</span>
              <input
                type="number"
                value={task.studyTime.split('시간')[1]?.replace('분', '').trim() || '0'}
                readOnly
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center bg-gray-50"
              />
              <span className="text-sm text-gray-600">분</span>
            </div>
          </div>

          {/* 학습 인증샷 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              학습 인증샷 *
            </label>
            <div className="space-y-3">
              {task.images.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`학습 인증샷 ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 질문 코멘트 */}
          {task.comment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                질문 코멘트
              </label>
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                {task.comment}
              </div>
            </div>
          )}

          {/* 피드백 */}
          {task.feedback && (
            <>
              {/* 피드백 요약 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피드백 요약
                </label>
                <div className="p-4 bg-purple-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {task.feedback.summary}
                </div>
              </div>

              {/* 피드백 상세 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피드백 상세
                </label>
                <div className="p-4 bg-purple-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {task.feedback.detail}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmittedTaskModal;
