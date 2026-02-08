import { useToastStore } from "../../../stores/toastStore";
import { Toast } from "./Toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed top-4 right-4 z-[9999] flex max-w-[min(360px,calc(100vw-32px))] flex-col gap-2 [&>*]:pointer-events-auto"
      aria-label="알림"
    >
      {toasts.map((item) => (
        <Toast key={item.id} item={item} onClose={removeToast} />
      ))}
    </div>
  );
}
