import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const SortControls = ({ currentSort = "hot", onSortChange, className }) => {
  const sortOptions = [
    { value: "hot", label: "Hot", icon: "TrendingUp" },
    { value: "new", label: "New", icon: "Clock" },
    { value: "top", label: "Top", icon: "Award" },
    { value: "controversial", label: "Controversial", icon: "Zap" }
  ]

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={currentSort === option.value ? "primary" : "ghost"}
          size="sm"
          onClick={() => onSortChange(option.value)}
          className={cn(
            "transition-all duration-200",
            currentSort === option.value 
              ? "bg-gradient-to-r from-primary to-orange-600 text-white shadow-md" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
        >
          <ApperIcon name={option.icon} size={14} className="mr-1" />
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export default SortControls