import { useEffect } from 'react';
import { useToastStore } from '../stores/toastStore';

export interface NotificationPayload {
  body?: string;
  message?: string;
  title?: string;
  type?: string;
  link?: string;
  uri?: string;
}

export const useNotificationStream = (onNotification?: (data: NotificationPayload) => void) => {
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    // SSE 연결 설정 (추후 구현)
    // const eventSource = new EventSource('/api/v1/notifications/stream');
    
    // eventSource.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   if (onNotification) {
    //     onNotification(notification);
    //   } else {
    //     addToast({
    //       id: Date.now().toString(),
    //       message: notification.message,
    //       type: notification.type || 'info',
    //     });
    //   }
    // };

    // return () => {
    //   eventSource.close();
    // };
  }, [addToast, onNotification]);
};
