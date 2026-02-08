import { useEffect } from 'react';
import { useToastStore } from '../stores/toastStore';

export const useNotificationStream = () => {
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    // SSE 연결 설정 (추후 구현)
    // const eventSource = new EventSource('/api/v1/notifications/stream');
    
    // eventSource.onmessage = (event) => {
    //   const notification = JSON.parse(event.data);
    //   addToast({
    //     id: Date.now().toString(),
    //     message: notification.message,
    //     type: notification.type || 'info',
    //   });
    // };

    // return () => {
    //   eventSource.close();
    // };
  }, [addToast]);
};
