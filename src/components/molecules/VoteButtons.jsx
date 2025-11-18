import { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const VoteButtons = ({ 
  votes = 0, 
  userVote = null, 
  onVote, 
  targetId, 
  targetType = "post",
  orientation = "vertical",
  size = "md" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleVote = async (direction) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    
    if (onVote) {
      await onVote(targetId, direction, targetType)
    }
  }

  const iconSize = size === "sm" ? 16 : 20
  const buttonSize = size === "sm" ? "sm" : "md"

  const containerClass = orientation === "horizontal" 
    ? "flex items-center space-x-2" 
    : "flex flex-col items-center space-y-1"

  const scoreClass = cn(
    "font-semibold transition-all duration-300",
    isAnimating && "scale-110",
    userVote === "up" && "text-primary",
    userVote === "down" && "text-secondary",
    !userVote && "text-gray-600",
    size === "sm" ? "text-xs" : "text-sm"
  )

  return (
    <div className={containerClass}>
      <Button
        variant="vote"
        size={buttonSize}
        onClick={() => handleVote("up")}
        className={cn(
          "vote-button transition-all duration-150 hover:scale-110",
          userVote === "up" && "text-primary bg-orange-50 hover:bg-orange-100",
          !userVote && "text-gray-400 hover:text-primary"
        )}
      >
        <ApperIcon 
          name="ChevronUp" 
          size={iconSize}
          className={cn(
            "transition-colors duration-150",
            userVote === "up" && "text-primary"
          )}
        />
      </Button>

      <span className={scoreClass}>
        {votes.toLocaleString()}
      </span>

      <Button
        variant="vote"
        size={buttonSize}
        onClick={() => handleVote("down")}
        className={cn(
          "vote-button transition-all duration-150 hover:scale-110",
          userVote === "down" && "text-secondary bg-blue-50 hover:bg-blue-100",
          !userVote && "text-gray-400 hover:text-secondary"
        )}
      >
        <ApperIcon 
          name="ChevronDown" 
          size={iconSize}
          className={cn(
            "transition-colors duration-150",
            userVote === "down" && "text-secondary"
          )}
        />
      </Button>
    </div>
  )
}

export default VoteButtons