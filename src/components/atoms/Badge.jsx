import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-primary to-orange-600 text-white",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
    success: "bg-gradient-to-r from-accent to-green-600 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white",
    community: "bg-gradient-to-r from-secondary to-blue-600 text-white"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge