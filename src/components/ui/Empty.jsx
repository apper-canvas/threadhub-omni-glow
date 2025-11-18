import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  className,
  title = "Nothing here yet",
  description = "Be the first to contribute!",
  actionLabel = "Get Started",
  onAction,
  icon = "MessageCircle",
  showAction = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-blue-400"
        />
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {showAction && onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary transform hover:scale-105 transition-all duration-200"
          size="lg"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg">
        <div className="text-center">
          <ApperIcon name="Users" className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Join Communities</p>
        </div>
        <div className="text-center">
          <ApperIcon name="Share" className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Share Content</p>
        </div>
        <div className="text-center">
          <ApperIcon name="MessageCircle" className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Start Discussions</p>
        </div>
      </div>
    </div>
  )
}

export default Empty