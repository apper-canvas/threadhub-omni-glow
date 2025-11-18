import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import VoteButtons from "@/components/molecules/VoteButtons"
import Button from "@/components/atoms/Button"
import Textarea from "@/components/atoms/Textarea"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { commentService } from "@/services/api/commentService"
import { voteService } from "@/services/api/voteService"
import { toast } from "react-toastify"

const Comment = ({ 
  comment, 
  level = 0, 
  onVote, 
  onReply, 
  maxLevel = 5 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty")
      return
    }

    try {
      setIsSubmitting(true)
      await onReply(comment.Id, replyContent)
      setReplyContent("")
      setShowReplyForm(false)
      toast.success("Reply posted!")
    } catch (error) {
      toast.error("Failed to post reply")
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasReplies = comment.replies && comment.replies.length > 0
  const showNestingLevel = level < maxLevel

  return (
    <div className={cn(
      "comment-thread",
      level > 0 && `level-${Math.min(level, 5)}`,
      level > 0 && "border-l-2 border-gray-100 pl-4"
    )}>
      <div className="py-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium text-gray-900">u/{comment.author}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
            {hasReplies && (
              <>
                <span>•</span>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-secondary hover:underline text-xs font-medium"
                >
                  {isCollapsed ? `[+] ${comment.replies.length} replies` : `[-] Collapse`}
                </button>
              </>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Comment Content */}
            <div className="flex items-start space-x-3 mb-3">
              <VoteButtons
                votes={comment.votes}
                onVote={onVote}
                targetId={comment.Id}
                targetType="comment"
                size="sm"
              />
              <div className="flex-1">
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center space-x-4 ml-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-gray-500 hover:text-gray-700 text-xs"
              >
                <ApperIcon name="Reply" size={14} className="mr-1" />
                Reply
              </Button>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-4 ml-12">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleReplySubmit}
                      disabled={isSubmitting || !replyContent.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-primary to-orange-600"
                    >
                      {isSubmitting ? (
                        <>
                          <ApperIcon name="Loader2" size={14} className="animate-spin mr-1" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Send" size={14} className="mr-1" />
                          Reply
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowReplyForm(false)
                        setReplyContent("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {hasReplies && showNestingLevel && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <Comment
                    key={reply.Id}
                    comment={reply}
                    level={level + 1}
                    onVote={onVote}
                    onReply={onReply}
                    maxLevel={maxLevel}
                  />
                ))}
              </div>
            )}

            {/* Continue Thread Link for Deep Nesting */}
            {hasReplies && !showNestingLevel && (
              <div className="mt-4">
                <Button
                  variant="link"
                  size="sm"
                  className="text-secondary hover:underline text-xs"
                >
                  Continue this thread →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const CommentThread = ({ postId, className }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (postId) {
      loadComments()
    }
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await commentService.getByPostId(postId)
      setComments(data)
    } catch (err) {
      console.error("Failed to load comments:", err)
      setError("Failed to load comments. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (commentId, direction, targetType) => {
    try {
      await voteService.vote(commentId, direction, targetType)
      
      // Update comment votes optimistically
      const updateCommentVotes = (commentsArray) => {
        return commentsArray.map(comment => {
          if (comment.Id === commentId) {
            const voteChange = direction === "up" ? 1 : -1
            return { ...comment, votes: comment.votes + voteChange }
          }
          if (comment.replies) {
            return { ...comment, replies: updateCommentVotes(comment.replies) }
          }
          return comment
        })
      }

      setComments(currentComments => updateCommentVotes(currentComments))
      toast.success(`${direction === "up" ? "Upvoted" : "Downvoted"}!`)
    } catch (error) {
      console.error("Vote failed:", error)
      toast.error("Failed to vote")
    }
  }

  const handleNewComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    try {
      setIsSubmitting(true)
      const comment = await commentService.create({
        postId,
        content: newComment.trim(),
        parentId: null
      })
      
      setComments(prev => [comment, ...prev])
      setNewComment("")
      toast.success("Comment posted!")
    } catch (error) {
      console.error("Failed to create comment:", error)
      toast.error("Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId, content) => {
    try {
      const reply = await commentService.create({
        postId,
        content: content.trim(),
        parentId
      })

      // Add reply to the appropriate parent comment
      const addReplyToComment = (commentsArray) => {
        return commentsArray.map(comment => {
          if (comment.Id === parentId) {
            const updatedReplies = comment.replies ? [reply, ...comment.replies] : [reply]
            return { ...comment, replies: updatedReplies }
          }
          if (comment.replies) {
            return { ...comment, replies: addReplyToComment(comment.replies) }
          }
          return comment
        })
      }

      setComments(currentComments => addReplyToComment(currentComments))
    } catch (error) {
      console.error("Failed to create reply:", error)
      throw error
    }
  }

  const handleRetry = () => {
    loadComments()
  }

  if (loading) {
    return <Loading variant="comments" className={className} />
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

  return (
    <div className={cn("space-y-6", className)}>
      {/* New Comment Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Add a comment</h3>
        <div className="space-y-4">
          <Textarea
            placeholder="What are your thoughts?"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setNewComment("")}
              disabled={!newComment.trim()}
            >
              Clear
            </Button>
            <Button
              onClick={handleNewComment}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-gradient-to-r from-primary to-orange-600"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <ApperIcon name="Send" size={16} className="mr-2" />
                  Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <Comment
                key={comment.Id}
                comment={comment}
                level={0}
                onVote={handleVote}
                onReply={handleReply}
              />
            ))}
          </div>
        </div>
      ) : (
        <Empty
          title="No comments yet"
          description="Be the first to share your thoughts on this post!"
          actionLabel="Add Comment"
          onAction={() => document.querySelector('textarea').focus()}
          icon="MessageCircle"
        />
      )}
    </div>
  )
}

export default CommentThread