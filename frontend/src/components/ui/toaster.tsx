import { useToastStore } from "@/lib/hooks/use-toast"

export function Toaster() {
  const { toasts, remove } = useToastStore()
  if (toasts.length === 0) return null

  return (
    <div className="fixed z-50 top-4 right-4 flex flex-col gap-2">
      {toasts.map(toast => (
        <toast.component
          key={toast.id}
          {...toast}
          onDismiss={() => remove(toast.id)}
        />
      ))}
    </div>
  )
}
