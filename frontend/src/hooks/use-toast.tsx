import { nanoid } from "nanoid"
import { Toast } from "@/components/ui/toast"
import { create } from "zustand"


type ToastItem = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "destructive"
  duration?: number
  component: typeof Toast
}

type ToastState = {
  toasts: ToastItem[]
  notify: (toast: Omit<ToastItem, "id" | "component">) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  notify: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: nanoid(),
          component: Toast,
        },
      ],
    })),
  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function useToast() {
  const notify = useToastStore((s) => s.notify)
  return { toast: notify }
}
