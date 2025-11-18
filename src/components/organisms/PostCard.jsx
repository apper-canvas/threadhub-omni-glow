import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import VoteButtons from "@/components/molecules/VoteButtons"
import PostActions from "@/components/molecules/PostActions"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"

const PostCard = ({ post, onVote, onComment, className }) => {
  const [isSaved, setIsSaved] = useState(false)
  const navigate = useNavigate()

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.Id}`)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? "Post unsaved" : "Post saved!")
  }

  const handleCommentClick = () => {
    navigate(`/post/${post.Id}`)
  }

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const getPostTypeIcon = () => {
    switch (post.type) {
      case "link":
        return "ExternalLink"
      case "image":
        return "Image"
      default:
        return "FileText"
    }
  }

  return (
    <div className={cn(
      "post-card bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Vote Buttons */}
          <VoteButtons
            votes={post.votes}
            onVote={onVote}
            targetId={post.Id}
            targetType="post"
          />

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* Post Meta */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <Link 
                to={`/community/${post.community}`}
                className="hover:underline"
              >
                <Badge variant="community" className="text-xs">
                  r/{post.community}
                </Badge>
              </Link>
              <span>•</span>
              <span>Posted by u/{post.author}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              <ApperIcon name={getPostTypeIcon()} size={14} className="text-gray-400" />
            </div>

            {/* Post Title */}
            <Link to={`/post/${post.Id}`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-primary transition-colors duration-200 line-clamp-2">
                {post.title}
              </h2>
            </Link>

            {/* Post Content Preview */}
            {post.content && (
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {truncateContent(post.content)}
                </p>
              </div>
            )}

            {/* Link Preview */}
            {post.linkUrl && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="ExternalLink" size={16} className="text-gray-500" />
                  <a 
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline text-sm font-medium truncate"
                  >
                    {post.linkUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Post Actions */}
            <PostActions
              commentCount={post.commentCount}
              onComment={handleCommentClick}
              onShare={handleShare}
              onSave={handleSave}
              isSaved={isSaved}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard