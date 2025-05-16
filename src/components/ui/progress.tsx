import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  max?: number
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, max = 100, className, ...props }, ref) => {
    const percentage = (value / max) * 100

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all bg-sky-500"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
