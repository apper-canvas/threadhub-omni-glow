import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const PostActions = ({ 
  commentCount = 0, 
  onComment, 
  onShare, 
  onSave, 
  isSaved = false,
  size = "md" 
}) => {
  const iconSize = size === "sm" ? 14 : 16
  const textSize = size === "sm" ? "text-xs" : "text-sm"

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onComment}
        className={cn(
          "text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md transition-all duration-200",
          textSize
        )}
      >
        <ApperIcon name="MessageCircle" size={iconSize} className="mr-1" />
        {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        className={cn(
          "text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-md transition-all duration-200",
          textSize
        )}
      >
        <ApperIcon name="Share" size={iconSize} className="mr-1" />
        Share
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        className={cn(
          "hover:bg-gray-100 px-2 py-1 rounded-md transition-all duration-200",
          isSaved ? "text-primary" : "text-gray-500 hover:text-gray-700",
          textSize
        )}
      >
        <ApperIcon 
          name={isSaved ? "Bookmark" : "BookmarkPlus"} 
          size={iconSize} 
          className="mr-1" 
        />
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    </div>
  )
}

export default PostActions