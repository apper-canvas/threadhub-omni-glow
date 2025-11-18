import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ApperIcon from "@/components/ApperIcon"
import { communityService } from "@/services/api/communityService"
import { cn } from "@/utils/cn"

const CommunitySidebar = ({ className, currentCommunity = null }) => {
  const [communities, setCommunities] = useState([])
  const [trendingCommunities, setTrendingCommunities] = useState([])
  const [joinedCommunities, setJoinedCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSidebarData()
  }, [])

const loadSidebarData = async () => {
    try {
      setLoading(true)
const allCommunities = await communityService.getAll()
      const joined = communityService.getJoinedCommunitiesData()
      
      // Sort by member count for trending
      const trending = [...allCommunities]
        .sort((a, b) => b.memberCount - a.memberCount)
        .slice(0, 5)
      
      setCommunities(allCommunities)
      setTrendingCommunities(trending)
      setJoinedCommunities(joined)
    } catch (error) {
      console.error("Failed to load sidebar data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-3">
            <div className="skeleton w-3/4 h-5 rounded" />
            <div className="skeleton w-full h-4 rounded" />
            <div className="skeleton w-5/6 h-4 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
<div className={cn("space-y-6", className)}>
      {/* My Communities */}
      {joinedCommunities.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ApperIcon name="Users" size={16} className="text-primary" />
            <h3 className="font-medium text-gray-900">My Communities</h3>
          </div>
          <div className="space-y-2">
            {joinedCommunities.map((community) => (
              <Link
                key={community.Id}
                to={`/community/${community.name}`}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors",
                  currentCommunity?.Id === community.Id && "bg-primary/10 border border-primary/20"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">r/{community.name}</div>
                    <div className="text-xs text-gray-500">{community.memberCount} members</div>
                  </div>
                </div>
                <ApperIcon name="ChevronRight" size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Current Community Info */}
      {currentCommunity && (
        <div className="bg-gradient-to-br from-primary to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-bold text-white">
                {currentCommunity.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold">r/{currentCommunity.name}</h3>
              <p className="text-white/80 text-sm">
                {currentCommunity.memberCount.toLocaleString()} members
              </p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-4">
            {currentCommunity.description}
          </p>
          <div className="text-white/80 text-xs">
            Created {formatDistanceToNow(new Date(currentCommunity.createdAt), { addSuffix: true })}
          </div>
        </div>
      )}

      {/* Today's Top Growing Communities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="TrendingUp" size={18} className="text-primary" />
          <h3 className="font-bold text-gray-900">Trending Communities</h3>
        </div>
        <div className="space-y-3">
          {trendingCommunities.map((community, index) => (
            <Link
              key={community.Id}
              to={`/community/${community.name}`}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-primary to-orange-600 rounded text-white text-xs font-bold">
                {index + 1}
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  r/{community.name}
                </p>
                <p className="text-sm text-gray-600">
                  {community.memberCount.toLocaleString()} members
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Communities */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Users" size={18} className="text-secondary" />
          <h3 className="font-bold text-gray-900">Popular Communities</h3>
        </div>
        <div className="space-y-3">
          {communities.slice(0, 8).map((community) => (
            <Link
              key={community.Id}
              to={`/community/${community.name}`}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-blue-600 flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  r/{community.name}
                </p>
                <p className="text-xs text-gray-600">
                  {community.memberCount.toLocaleString()} members
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <ApperIcon name="Plus" size={14} className="mr-2" />
            View All Communities
          </Button>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Shield" size={18} className="text-accent" />
          <h3 className="font-bold text-gray-900">Community Guidelines</h3>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-primary font-bold">1.</span>
            <span>Remember the human</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary font-bold">2.</span>
            <span>Behave like you would in real life</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary font-bold">3.</span>
            <span>Look for the original source of content</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary font-bold">4.</span>
            <span>Search for duplicates before posting</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-primary font-bold">5.</span>
            <span>Read the community's rules</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunitySidebar