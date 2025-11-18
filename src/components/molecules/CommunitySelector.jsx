import { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { communityService } from "@/services/api/communityService"

const CommunitySelector = ({ selectedCommunity, onSelect, className }) => {
  const [communities, setCommunities] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCommunities()
  }, [])

  const loadCommunities = async () => {
    try {
      setLoading(true)
      const data = await communityService.getAll()
      setCommunities(data)
    } catch (error) {
      console.error("Failed to load communities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (community) => {
    onSelect(community)
    setIsOpen(false)
  }

  const selectedCommunityData = communities.find(c => c.name === selectedCommunity)

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
        disabled={loading}
      >
        <div className="flex items-center">
          <ApperIcon name="Users" size={16} className="mr-2 text-gray-600" />
          {selectedCommunityData ? (
            <span>r/{selectedCommunityData.name}</span>
          ) : (
            <span className="text-gray-500">Choose a community</span>
          )}
        </div>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={cn(
            "transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <ApperIcon name="Loader2" size={16} className="animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading communities...</p>
            </div>
          ) : communities.length > 0 ? (
            <>
              {communities.map((community) => (
                <button
                  key={community.Id}
                  onClick={() => handleSelect(community.name)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mr-3"
                    >
                      <span className="text-white text-xs font-bold">
                        {community.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">r/{community.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {community.memberCount.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No communities found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommunitySelector