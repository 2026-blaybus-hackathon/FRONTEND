import { useNotificationStream } from "../../../hooks/useNotificationStream";
import type { NotificationPayload } from "../../../hooks/useNotificationStream";
import { useToastStore } from "../../../stores/toastStore";
import type { ToastType } from "../../../stores/toastStore";
import { ToastContainer } from "./ToastContainer";

function payloadToToast(payload: NotificationPayload): {
  message: string;
  title?: string;
  type?: ToastType;
  uri?: string;
} {
  const body = typeof payload.body === "string" ? payload.body : "";
  const msg = typeof payload.message === "string" ? payload.message : "";
  const titleStr = typeof payload.title === "string" ? payload.title : "";
  const message = body || msg || titleStr || "새 알림이 도착했습니다.";
  const title = titleStr && (body || msg) ? titleStr : undefined;
  const type = payload.type as ToastType | undefined;
  const uri = typeof payload.link === "string" ? payload.link : typeof payload.uri === "string" ? payload.uri : undefined;
  return {
    message,
    title,
    type: type && ["info", "success", "warning", "error"].includes(type) ? type : "info",
    uri,
  };
}

/**
 * 로그인 상태에서 SSE 알림 스트림을 구독하고, 수신 시 토스트로 표시합니다.
 * App 상단에 한 번만 렌더링하면 됩니다.
 */
export function NotificationToasts() {
  const addToast = useToastStore((s) => s.addToast);

  useNotificationStream((data: NotificationPayload) => {
    addToast(payloadToToast(data));
  });

  return <ToastContainer />;
}
