import { useNavigate, useSearchParams } from 'react-router-dom';
import { Megaphone } from '../../icons';
import { cn } from '../../libs/utils';
import { useMenteeNotifications, useReadMenteeNotification } from '../../hooks/mentee/useMenteeNotification';
import type { MenteeNotification } from '../../api/mentee';

type NotificationFilterType = "all" | "feedback" | "report";

const VALID_TYPES: NotificationFilterType[] = ['feedback', 'report'];

const NotificationCenterPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawType = searchParams.get('type');
  const filter: NotificationFilterType = VALID_TYPES.includes(rawType as NotificationFilterType)
    ? (rawType as NotificationFilterType)
    : 'all';

  const { data: notifications, isLoading } = useMenteeNotifications();
  const { mutate: readNotificationMutation } = useReadMenteeNotification();

  const filtered = filter === 'all'
    ? notifications
    : notifications?.filter((n) => {
        if (filter === 'feedback') return n.type === 'TASK_FEEDBACK' || n.type === 'TOTAL_FEEDBACK';
        if (filter === 'report') return n.type === 'REPORT';
        return true;
      });

  const handleClickFilter = (type: NotificationFilterType) => {
    if (type === 'all') {
      searchParams.delete('type');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ type }, { replace: true });
    }
  };

  const handleNotificationClick = (item: MenteeNotification) => {
    const path = item.type === 'REPORT' ?
    `/mentee/report?date=${item.report?.date}&period=${item.report?.period}` :
    item.type === 'TASK_FEEDBACK' ?
    `/mentee/review?taskId=${item.taskId}` :
    `/mentee/dashboard?date=${item.date}&showTotalFeedback=true`;
    readNotificationMutation(item.notificationId, {
      onSuccess: () => {
        navigate(path);
      }
    });
  };

  const getTypeLabel = (type: NotificationFilterType) => {
    switch (type) {
      case 'all':
        return '전체';
      case 'feedback':
        return '피드백';
      case 'report':
        return '리포트';
    }
  };

  return (
    <div className="w-full flex flex-col items-end gap-250 lg:px-5 pb-[calc(var(--tabbar-height,60px)+24px)] sm:px-6 sm:py-8 sm:pb-[calc(var(--tabbar-height,60px)+40px)] lg:pb-32">
      <header className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-400 font-semibold leading-tight text-gray-900 flex gap-200">
            <span>🔔</span><span>알림 센터</span>
          </h1>
          <p className="heading-6 font-normal leading-snug text-gray-500 sm:text-sm">
            도착한 모든 알림을 확인하세요.
          </p>
        </div>
      </header>
      
      <div className="w-fit h-fit flex h-10.5 justify-end px-200 py-100 cursor-pointer rounded-300 hover:bg-primary-100" onClick={() => {}}>
        <p className="subtitle-1 font-weight-500 text-primary-500">모두 읽음 처리</p>
      </div>

      <section className="w-full gap-250 flex flex-col" aria-label="알림 목록">
        <div className="w-full flex flex-wrap lg:gap-x-250 gap-x-100 gap-y-100" aria-label="알림 필터">
          {
            ['all', 'feedback', 'report'].map((type) => (
              <button
                key={type}
                type="button"
                className={cn(
                  'subtitle-2 font-weight-500 bg-white gap-1.5 rounded-full py-2 px-4 text-sm font-medium transition-all whitespace-nowrap sm:flex-initial sm:justify-start sm:px-5',
                  filter === type ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:shadow-100 hover:translate-y-[-1px]'
                )}
                onClick={() => handleClickFilter(type as NotificationFilterType)}
                aria-pressed={filter === type}
              >
                {getTypeLabel(type as NotificationFilterType)}
              </button>
            ))
          }
        </div>
        <div className="w-full overflow-hidden rounded-xl bg-white" aria-label="알림 목록">
          {isLoading ? (
            <ul className="m-0 list-none p-0 flex flex-col px-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <li key={idx}>
                  <div className="flex py-200 lg:py-300 items-center animate-pulse">
                    <div className="relative w-6 h-6 rounded-full mr-200 lg:mr-[45px] bg-gray-100" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 lg:mb-2.5 h-4 w-3/5 rounded bg-gray-100" />
                      <div className="h-3 w-1/4 rounded bg-gray-50" />
                    </div>
                  </div>
                  {idx !== 4 && <div className="w-full h-[1px] bg-gray-50" />}
                </li>
              ))}
            </ul>
          ) : filtered?.length === 0 ? (
            <div className="flex min-h-0 flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[320px] sm:px-10 sm:py-20">
              <div className="mx-auto mb-6 flex items-center justify-center opacity-20">
                <Megaphone className="h-12 w-12 text-gray-900 sm:h-20 sm:w-20" aria-hidden />
              </div>
              <p className="mb-2 text-base font-semibold leading-snug text-gray-900">
                {filter === 'all' ? '알림이 없습니다' : '읽지 않은 알림이 없습니다'}
              </p>
              <p className="max-w-xs text-sm leading-snug text-gray-400 sm:text-sm">
                {filter === 'all'
                  ? '모든 알림을 읽으셨습니다.'
                  : '새 피드백이나 과제가 있으면 여기에 표시됩니다.'}
              </p>
            </div>
          ) : (
            <ul className="m-0 list-none p-0 flex flex-col px-400">
              {filtered?.map((item, idx) => (
                <li key={item.notificationId}>
                  <article
                    className={cn(
                      'flex cursor-pointer py-200 lg:py-300 items-center bg-white text-left transition-colors',
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNotificationClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNotificationClick(item);
                      }
                    }}
                    aria-label={`${item.title} ${item.time}`}
                  >
                    <NotificationStatusBadge status={item.read ? 'read' : 'unread'} />
                    <div className="min-w-0 flex-1">
                      <h2 className={cn("mb-1 lg:mb-2.5 heading-6 font-weight-500", item.read ? 'text-gray-500' : 'text-black')}>
                        {item.title}
                      </h2>
                      <p className="text-[12px] text-gray-300 font-weight-500">{elapsedTime(item.time)}</p>
                    </div>
                  </article>
                  {idx !== filtered.length - 1 && <div className="w-full h-[1px] bg-gray-50" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

const NotificationStatusBadge = ({ status }: { status: 'unread' | 'read' }) => {
  return (
    <div className={cn("relative w-6 h-6 flex justify-center items-center rounded-full mr-200 lg:mr-[45px]")}>
      <div className={cn("absolute top-1 right-1 w-4 h-4 rounded-full z-1", status === 'unread' ? 'bg-red-500' : 'bg-gray-100')} />
      <div className={cn("absolute top-0 right-0 w-full h-full rounded-full", status === 'unread' ? 'animate-pulse bg-red-100' : 'bg-white')} />
    </div>
  );
};

const elapsedTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (created.toDateString() === yesterday.toDateString()) return '어제';
  return `${diffDays}일 전`;
};

export default NotificationCenterPage;
