import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const ErrorView = ({ 
  className, 
  message = "Something went wrong",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          className="w-12 h-12 text-error"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If the problem persists, please refresh the page or try again later.
        </p>
      </div>
    </div>
  )
}

export default ErrorView