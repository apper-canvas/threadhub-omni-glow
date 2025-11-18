import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white shadow-md hover:shadow-lg",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent text-secondary hover:text-blue-700 underline-offset-4 hover:underline",
    vote: "bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-all duration-150"
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg",
    icon: "p-2 rounded-md"
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button