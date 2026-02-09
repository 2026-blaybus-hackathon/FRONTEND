import { useNavigate } from "react-router-dom";
import { cn } from "../../../libs/utils";
import type { ToastItem, ToastType } from "../../../stores/toastStore";

interface ToastProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

const typeBgClasses: Record<ToastType, string> = {
  info: "bg-primary-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

const defaultTitleByType: Partial<Record<ToastType, string>> = {
  warning: "주의",
};

export function Toast({ item, onClose }: ToastProps) {
  const type = item.type ?? "info";
  const title = item.title ?? defaultTitleByType[type];
  const navigate = useNavigate();
  const isClickable = !!item.uri;

  const handleContentClick = () => {
    if (item.uri) {
      onClose(item.id);
      navigate(item.uri);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-4 py-3 shadow-[var(--size-shadow-100)] text-white",
        item.exiting ? "animate-[toast-out_0.3s_ease-in_forwards]" : "animate-[toast-in_0.3s_ease-out]",
        typeBgClasses[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div
        className={cn(
          "min-w-0 flex-1",
          isClickable && "cursor-pointer"
        )}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={isClickable ? handleContentClick : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleContentClick();
                }
              }
            : undefined
        }
      >
        {title && (
          <div className="mb-0.5 text-sm font-semibold text-white">
            {title}
          </div>
        )}
        <p className="text-[0.8125rem] leading-[1.4] text-white/95 m-0">
          {item.message}
        </p>
      </div>
      <button
        type="button"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded border-0 bg-transparent text-white/80 text-xl leading-none transition-colors hover:bg-white/20 hover:text-white"
        aria-label="닫기"
        onClick={(e) => {
          e.stopPropagation();
          onClose(item.id);
        }}
      >
        ×
      </button>
    </div>
  );
}
