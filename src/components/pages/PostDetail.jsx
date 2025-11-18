import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import VoteButtons from "@/components/molecules/VoteButtons"
import PostActions from "@/components/molecules/PostActions"
import CommentThread from "@/components/organisms/CommentThread"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"
import { postService } from "@/services/api/postService"
import { voteService } from "@/services/api/voteService"
import { toast } from "react-toastify"

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (postId) {
      loadPost()
    }
  }, [postId])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await postService.getById(parseInt(postId))
      if (data) {
        setPost(data)
        document.title = `${data.title} - ThreadHub`
      } else {
        setError("Post not found")
      }
    } catch (err) {
      console.error("Failed to load post:", err)
      setError("Failed to load post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (targetId, direction, targetType) => {
    try {
      await voteService.vote(targetId, direction, targetType)
      
      if (targetType === "post") {
        setPost(current => {
          if (current && current.Id === targetId) {
            const voteChange = direction === "up" ? 1 : -1
            return { ...current, votes: current.votes + voteChange }
          }
          return current
        })
      }

      toast.success(`${direction === "up" ? "Upvoted" : "Downvoted"}!`)
    } catch (error) {
      console.error("Vote failed:", error)
      toast.error("Failed to vote")
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? "Post unsaved" : "Post saved!")
  }

  const handleRetry = () => {
    loadPost()
  }

  const handleBackToFeed = () => {
    navigate("/")
  }

  const getPostTypeIcon = () => {
    if (!post) return "FileText"
    switch (post.type) {
      case "link":
        return "ExternalLink"
      case "image":
        return "Image"
      default:
        return "FileText"
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Loading />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorView
          message={error}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={handleBackToFeed}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to feed
        </Button>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-8">
          <div className="flex items-start space-x-6">
            {/* Vote Buttons */}
            <VoteButtons
              votes={post.votes}
              onVote={handleVote}
              targetId={post.Id}
              targetType="post"
            />

            {/* Post Content */}
            <div className="flex-1 min-w-0">
              {/* Post Meta */}
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link 
                  to={`/community/${post.community}`}
                  className="hover:underline"
                >
                  <Badge variant="community" className="text-sm">
                    r/{post.community}
                  </Badge>
                </Link>
                <span>•</span>
                <span>Posted by u/{post.author}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <ApperIcon name={getPostTypeIcon()} size={16} className="text-gray-400" />
              </div>

              {/* Post Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Post Content */}
              {post.content && (
                <div className="mb-6">
                  <div className="prose max-w-none text-gray-900 leading-relaxed">
                    <p className="whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Link Preview */}
              {post.linkUrl && (
                <div className="mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <ApperIcon name="ExternalLink" size={20} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">External Link</span>
                  </div>
                  <a 
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline font-medium text-lg break-all"
                  >
                    {post.linkUrl}
                  </a>
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      onClick={() => window.open(post.linkUrl, '_blank')}
                      className="bg-gradient-to-r from-secondary to-blue-600 text-white hover:from-blue-600 hover:to-secondary"
                    >
                      <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                      Visit Link
                    </Button>
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <PostActions
                commentCount={post.commentCount}
                onComment={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                onShare={handleShare}
                onSave={handleSave}
                isSaved={isSaved}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div id="comments">
        <CommentThread postId={post.Id} />
      </div>
    </div>
  )
}

export default PostDetail