import { useEffect } from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
  onDismiss?: (id: string) => void
}

export function Toast({ id, title, description, variant, duration = 3000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onDismiss?.(id)
    }, duration)
    return () => clearTimeout(timeout)
  }, [id, duration, onDismiss])

  return (
    <div className={cn(toastVariants({ variant }))}>
      <div className="flex flex-col gap-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    </div>
  )
}
