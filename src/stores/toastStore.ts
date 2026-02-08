import { create } from "zustand";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  message: string;
  title?: string;
  type?: ToastType;
  createdAt: number;
  exiting?: boolean;
  /** 클릭 시 이동할 URI (선택) */
  uri?: string;
}

const DEFAULT_DURATION_MS = 4000;
const EXIT_DURATION_MS = 300;

interface ToastStore {
  toasts: ToastItem[];
  addToast: (payload: {
    message: string;
    title?: string;
    type?: ToastType;
    durationMs?: number;
    uri?: string;
  }) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;
function nextId() {
  return `toast-${Date.now()}-${++toastId}`;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: ({ message, title, type = "info", durationMs = DEFAULT_DURATION_MS, uri }) => {
    const id = nextId();
    const item: ToastItem = {
      id,
      message,
      title,
      type,
      createdAt: Date.now(),
      uri,
    };
    set((state) => ({ toasts: [...state.toasts, item] }));

    if (durationMs > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, durationMs);
    }
  },
  removeToast: (id) => {
    const state = get();
    const toast = state.toasts.find((t) => t.id === id);
    if (!toast) return;
    if (toast.exiting) return;

    set((s) => ({
      toasts: s.toasts.map((t) =>
        t.id === id ? { ...t, exiting: true } : t
      ),
    }));

    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, EXIT_DURATION_MS);
  },
}));
