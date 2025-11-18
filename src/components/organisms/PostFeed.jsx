import { useState, useEffect } from "react"
import PostCard from "@/components/organisms/PostCard"
import SortControls from "@/components/molecules/SortControls"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import { postService } from "@/services/api/postService"
import { voteService } from "@/services/api/voteService"
import { toast } from "react-toastify"

const PostFeed = ({ communityFilter = null, className }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentSort, setCurrentSort] = useState("hot")

  useEffect(() => {
    loadPosts()
  }, [currentSort, communityFilter])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError("")
      
      let data
      if (communityFilter) {
        data = await postService.getByCommunity(communityFilter)
      } else {
        data = await postService.getAll()
      }
      
      // Sort posts based on current sort option
      const sortedData = sortPosts(data, currentSort)
      setPosts(sortedData)
    } catch (err) {
      console.error("Failed to load posts:", err)
      setError("Failed to load posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const sortPosts = (postsData, sortBy) => {
    const sorted = [...postsData]
    
    switch (sortBy) {
      case "new":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case "top":
        return sorted.sort((a, b) => b.votes - a.votes)
      case "controversial":
        // Simple controversial algorithm: posts with moderate votes but high engagement
        return sorted.sort((a, b) => {
          const aScore = Math.abs(a.votes) + a.commentCount
          const bScore = Math.abs(b.votes) + b.commentCount
          return bScore - aScore
        })
      case "hot":
      default:
        // Hot algorithm: combine votes with recency
        return sorted.sort((a, b) => {
          const now = new Date()
          const aAge = (now - new Date(a.createdAt)) / (1000 * 60 * 60) // hours
          const bAge = (now - new Date(b.createdAt)) / (1000 * 60 * 60)
          
          const aHotScore = (a.votes + a.commentCount) / Math.pow(aAge + 2, 1.8)
          const bHotScore = (b.votes + b.commentCount) / Math.pow(bAge + 2, 1.8)
          
          return bHotScore - aHotScore
        })
    }
  }

  const handleVote = async (postId, direction, targetType) => {
    try {
      await voteService.vote(postId, direction, targetType)
      
      // Update post votes optimistically
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.Id === postId) {
            const voteChange = direction === "up" ? 1 : -1
            return { ...post, votes: post.votes + voteChange }
          }
          return post
        })
      )

      toast.success(`${direction === "up" ? "Upvoted" : "Downvoted"}!`)
    } catch (error) {
      console.error("Vote failed:", error)
      toast.error("Failed to vote")
    }
  }

  const handleSortChange = (newSort) => {
    setCurrentSort(newSort)
  }

  const handleRetry = () => {
    loadPosts()
  }

  const handleCreatePost = () => {
    // This would typically open a create post modal
    toast.info("Create post functionality coming soon!")
  }

  if (loading) {
    return <Loading variant="feed" className={className} />
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={handleRetry}
        className={className}
      />
    )
  }

  if (posts.length === 0) {
    return (
      <Empty
        title={communityFilter ? `No posts in r/${communityFilter}` : "No posts yet"}
        description={communityFilter 
          ? "This community is waiting for its first post. Be the pioneer!"
          : "The feed is empty. Start the conversation by creating the first post!"
        }
        actionLabel="Create First Post"
        onAction={handleCreatePost}
        icon="MessageCircle"
        className={className}
      />
    )
  }

  return (
    <div className={className}>
      {/* Sort Controls */}
      <div className="mb-6">
        <SortControls
          currentSort={currentSort}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.Id}
            post={post}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  )
}

export default PostFeed