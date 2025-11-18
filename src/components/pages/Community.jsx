import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import PostFeed from "@/components/organisms/PostFeed"
import CommunitySidebar from "@/components/organisms/CommunitySidebar"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import { communityService } from "@/services/api/communityService"

const Community = () => {
  const { communityName } = useParams()
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    if (communityName) {
      loadCommunity()
    }
  }, [communityName])

  const loadCommunity = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await communityService.getByName(communityName)
      if (data) {
        setCommunity(data)
        document.title = `r/${data.name} - ThreadHub`
      } else {
        setError("Community not found")
      }
    } catch (err) {
      console.error("Failed to load community:", err)
      setError("Failed to load community. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinToggle = () => {
    setIsJoined(!isJoined)
    setCommunity(current => {
      if (!current) return current
      const memberChange = isJoined ? -1 : 1
      return {
        ...current,
        memberCount: current.memberCount + memberChange
      }
    })
  }

  const handleRetry = () => {
    loadCommunity()
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Loading />
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="max-w-7xl mx-auto">
        <ErrorView
          message={error}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Community Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl font-bold text-white">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  r/{community.name}
                </h1>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Users" size={18} />
                    <span className="font-medium">
                      {community.memberCount.toLocaleString()} members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" size={18} />
                    <span>
                      Created {formatDistanceToNow(new Date(community.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleJoinToggle}
              variant={isJoined ? "secondary" : "ghost"}
              className={isJoined 
                ? "bg-white text-primary hover:bg-gray-100" 
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }
            >
              <ApperIcon 
                name={isJoined ? "UserMinus" : "UserPlus"} 
                size={16} 
                className="mr-2" 
              />
              {isJoined ? "Leave" : "Join"}
            </Button>
          </div>
          
          <div className="mt-6">
            <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
              {community.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts Feed */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Posts in r/{community.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Latest posts from this community
            </p>
          </div>
          
          <PostFeed communityFilter={community.name} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CommunitySidebar currentCommunity={community} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community