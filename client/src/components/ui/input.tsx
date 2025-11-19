import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground",
          // Enhanced focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400 focus-visible:ring-offset-2",
          // Hover state
          "hover:border-primary-300",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          // Error state
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
          // Transitions
          "transition-colors duration-200",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
