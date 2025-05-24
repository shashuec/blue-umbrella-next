import * as React from "react"
import { cn } from "@/lib/utils"

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onOpenChange, className, ...props }, ref) => {
    // Simple dialog open/close state for demonstration
    const [isOpen, setIsOpen] = React.useState(open ?? false)

    React.useEffect(() => {
      if (open !== undefined) setIsOpen(open)
    }, [open])

    const handleClose = () => {
      setIsOpen(false)
      onOpenChange?.(false)
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
        <div
          className={cn("bg-white rounded-lg shadow-lg p-6", className)}
          ref={ref}
          onClick={e => e.stopPropagation()}
          {...props}
        />
      </div>
    )
  }
)
Dialog.displayName = "Dialog"

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full max-w-lg", className)}
      {...props}
    />
  )
)
DialogContent.displayName = "DialogContent"

export { Dialog, DialogContent }
