import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useToastStore } from '../../stores/toastStore';
import SubmittedTaskModal from '../../components/feature/dashboard/SubmittedTaskModal';
import { useMenteeList } from '../../hooks/useMenteeList';
import { getProfileImageUrl } from '../../libs/utils';
import { useMentorMenteeTasks } from '../../hooks/useMentorMenteeTasks';
import { getMentorMenteeTasks } from '../../api/mentor';

const MentorArchivePage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'reminder' | 'history'>('reminder');
  const [selectedSubject, setSelectedSubject] = useState<string>('전체');
  const [selectedMentee, setSelectedMentee] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const addToast = useToastStore((state) => state.addToast);

  // 캐러셀 스크롤 관련 상태
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 멘티 목록 조회
  const { menteeList, isLoading: isLoadingMentees } = useMenteeList();

  // 선택된 멘티의 과제 목록 조회
  const { tasks: selectedMenteeTasks, isLoading: isLoadingSelectedTasks } = useMentorMenteeTasks(selectedMentee, {
    page: 0,
    size: 100,
    enabled: selectedMentee !== null,
  });

  // 전체 멘티의 과제 목록 (선택 안 했을 때) - useQueries 사용
  const allMenteesTasksQueries = useQueries({
    queries: menteeList.map((mentee) => ({
      queryKey: ['mentorMenteeTasks', mentee.id, 0, 100],
      queryFn: () => getMentorMenteeTasks(mentee.id, { page: 0, size: 100 }),
      enabled: selectedMentee === null && menteeList.length > 0,
    })),
  });

  // 전체 과제 합치기
  const allTasks = selectedMentee 
    ? (selectedMenteeTasks?.content || [])
    : allMenteesTasksQueries.flatMap((query, index) => {
        const content = query.data?.tasks?.content || [];
        const mentee = menteeList[index];
        return content.map(task => ({
          ...task,
          menteeName: mentee?.name,
          menteeSubject: mentee?.subject,
        }));
      });

  const isLoadingTasks = selectedMentee 
    ? isLoadingSelectedTasks 
    : allMenteesTasksQueries.some(q => q.isLoading);
  
  const tasks = allTasks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const foundMentee = menteeList.find(
      (mentee) => mentee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundMentee) {
      setSelectedMentee(foundMentee.id);
      addToast({
        message: `${foundMentee.name} 학생을 선택했습니다.`,
        type: 'success',
      });
    } else {
      addToast({
        message: '검색 결과가 없어요.\n학생의 이름을 다시 한번 확인해 주세요',
        type: 'warning',
      });
    }
  };

  const handleFeedbackClick = (taskId: number) => {
    const task = tasks.find((t) => t.taskId === taskId);
    
    if (selectedTab === 'history') {
      // 과제 히스토리 탭: 모달 열기
      if (task) {
        setSelectedTask(task);
        setIsModalOpen(true);
      }
    } else {
      // 피드백 리마인드 탭: 페이지 이동
      navigate(`/mentor/feedback?taskId=${taskId}`);
    }
  };

  // 탭과 과목 필터에 따라 과제 필터링
  const filteredTasks = tasks.filter((task) => {
    // 탭 필터: 피드백 리마인드는 feedback이 없는 것만, 과제 히스토리는 feedback이 있는 것만
    if (selectedTab === 'reminder' && task.feedback) {
      return false;
    }
    if (selectedTab === 'history' && !task.feedback) {
      return false;
    }

    // 과목 필터 (과제 히스토리 탭에서만)
    if (selectedTab === 'history' && selectedSubject !== '전체') {
      if (task.subject !== selectedSubject) {
        return false;
      }
    }

    return true;
  });

  // 피드백 리마인드 개수 (feedback이 없는 과제)
  const pendingFeedbackCount = tasks.filter((task) => !task.feedback).length;

  // 현재 선택된 멘티 정보
  const currentMentee = menteeList.find((m) => m.id === selectedMentee);

  // 스크롤 가능 여부 체크
  const checkScrollability = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // 초기 로드 및 멘티 목록 변경 시 스크롤 가능 여부 체크
  useEffect(() => {
    checkScrollability();
  }, [menteeList]);

  // 좌측 스크롤
  const scrollLeft = () => {
    if (!carouselRef.current) return;
    
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  };

  // 우측 스크롤
  const scrollRight = () => {
    if (!carouselRef.current) return;
    
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F2FF' }}>
      <div className="max-w-6xl mx-auto pl-16 pr-12 py-10">
        {/* 검색창 */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="relative w-72">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="멘티 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-white rounded-full text-sm border border-gray-100 focus:outline-none focus:ring-0"
            />
          </form>
        </div>

        {/* 헤더 */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">보관함</h1>
          </div>
          <p className="text-sm text-gray-500">
            미작성 피드백을 확인하고 학생들의 학습 기록을 관리하세요.
          </p>
        </div>

        {/* 멘티 캐러셀 */}
        <div className="flex items-center gap-5 my-10">
          <button 
            className="shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 12 12">
              <path d="M8 2L3 6l5 4V2z" />
            </svg>
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-6 flex-1 overflow-x-auto"
            onScroll={checkScrollability}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {isLoadingMentees ? (
              <div className="flex-1 text-center py-8 text-gray-500">
                멘티 목록을 불러오는 중...
              </div>
            ) : menteeList.length > 0 ? (
              menteeList.map((mentee) => (
                <div
                  key={mentee.id}
                  className={`min-w-[calc(33.333%-1rem)] bg-white rounded-2xl p-5 flex flex-col items-center ring-1 cursor-pointer transition-all ${
                    selectedMentee === mentee.id
                      ? 'ring-purple-500 ring-2'
                      : 'ring-gray-100'
                  }`}
                  onClick={() => setSelectedMentee(mentee.id)}
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold mb-2.5 overflow-hidden"
                    style={{ backgroundColor: '#7C3AED' }}
                  >
                    {getProfileImageUrl(mentee.profileUrl) ? (
                      <img src={getProfileImageUrl(mentee.profileUrl)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      mentee.avatar
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">{mentee.name}</h3>
                  <p className="text-xs text-gray-500">{mentee.subject}</p>
                </div>
              ))
            ) : (
              <div className="flex-1 text-center py-8 text-gray-500">
                등록된 멘티가 없습니다.
              </div>
            )}
          </div>

          <button 
            className="shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 12 12">
              <path d="M4 2v8l5-4-5-4z" />
            </svg>
          </button>
        </div>

        {/* 탭 */}
        <div className="flex items-center gap-4 mb-6">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              selectedTab === 'reminder'
                ? 'bg-white border border-purple-500 text-purple-600'
                : 'text-gray-600'
            }`}
            onClick={() => setSelectedTab('reminder')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            피드백 리마인드
            {selectedTab === 'reminder' && pendingFeedbackCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                {pendingFeedbackCount}개
              </span>
            )}
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              selectedTab === 'history'
                ? 'bg-white border border-purple-500 text-purple-600'
                : 'text-gray-600'
            }`}
            onClick={() => setSelectedTab('history')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            과제 히스토리
          </button>
        </div>

        {/* 과목 필터 (과제 히스토리 탭일 때만 표시) */}
        {selectedTab === 'history' && (
          <div className="flex gap-3 mb-8">
            {['전체', '국어', '수학', '영어'].map((subject) => (
              <button
                key={subject}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedSubject === subject
                    ? 'text-white'
                    : 'bg-white text-gray-600'
                }`}
                style={
                  selectedSubject === subject
                    ? { backgroundColor: '#7C3AED' }
                    : {}
                }
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
        )}

        {/* 과제 카드 */}
        <div className="grid grid-cols-2 gap-6">
          {isLoadingTasks ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-20">
              <div className="text-gray-500">과제 목록을 불러오는 중...</div>
            </div>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
            <div
              key={task.taskId}
              className="bg-white rounded-2xl p-7 ring-1 ring-gray-100"
            >
              {/* 과목 pill */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                  {task.subject || '과목'}
                </span>
              </div>

              {/* 과제명 */}
              <h3 className="text-base font-bold text-gray-900 mb-4">{task.title}</h3>

              {/* 날짜 pill */}
              {task.createdAt && (
                <div className="mb-5">
                  <span 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: '#7C3AED' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(task.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              {/* 하단 정보 */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '') : ''}
                  </span>
                  {selectedTab === 'reminder' && (
                    <span className="text-gray-500">
                      {task.feedbackStatus === 'COMPLETED' ? '완료' : '대기중'}
                    </span>
                  )}
                </div>
                {currentMentee && (
                  <div className="text-xs text-gray-500">
                    {currentMentee.name} · {currentMentee.subject}
                  </div>
                )}
                {!currentMentee && (task as any).menteeName && (
                  <div className="text-xs text-gray-500">
                    {(task as any).menteeName} · {(task as any).menteeSubject}
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="text-right">
                <button 
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                  onClick={() => handleFeedbackClick(task.taskId)}
                >
                  {selectedTab === 'reminder' ? '피드백 작성하기' : '피드백 확인하기'}
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M4 2v8l5-4-5-4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-20">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 font-medium mb-1">
                {filteredTasks.length === 0 && selectedTab === 'reminder' ? '모든 피드백을 작성했어요!' : '과제가 없습니다'}
              </p>
              <p className="text-sm text-gray-400">
                학생의 이름을 검색하거나 선택해서 과제를 확인하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 제출 과제 조회 모달 */}
      {selectedTask && (
        <SubmittedTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          task={{
            id: selectedTask.taskId,
            title: selectedTask.title,
            subject: selectedTask.subject || '과목',
            date: selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString('ko-KR') : '',
            studyTime: '학습 시간 정보 없음',
            images: selectedTask.images?.map((img: any) => img.url) || [],
            comment: selectedTask.feedback?.comment,
            feedback: selectedTask.feedback ? {
              summary: selectedTask.feedback.summary,
              detail: selectedTask.feedback.comment,
            } : undefined,
          }}
        />
      )}
    </div>
  );
};

export default MentorArchivePage;
