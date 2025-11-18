import commentsData from "@/services/mockData/comments.json"
import { postService } from "./postService"

class CommentService {
  constructor() {
    this.comments = [...commentsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  buildCommentTree(comments) {
    // Comments are already structured with replies in the mock data
    return comments.filter(comment => comment.parentId === null)
  }

  async getAll() {
    await this.delay()
    return this.buildCommentTree(this.comments)
  }

  async getById(id) {
    await this.delay()
    return this.comments.find(comment => comment.Id === id) || null
  }

  async getByPostId(postId) {
    await this.delay()
    const postComments = this.comments.filter(comment => 
      comment.postId === parseInt(postId) && comment.parentId === null
    )
    return postComments
  }

  async create(commentData) {
    await this.delay(400)
    
    const newComment = {
      Id: Math.max(...this.comments.map(c => c.Id)) + 1,
      postId: parseInt(commentData.postId),
      parentId: commentData.parentId,
      author: "currentUser", // In real app, would come from auth
      content: commentData.content,
      votes: 1, // Start with 1 vote (author's upvote)
      createdAt: new Date().toISOString(),
      replies: []
    }
    
    this.comments.push(newComment)
    
    // Update post comment count
    await postService.incrementCommentCount(parseInt(commentData.postId))
    
    return newComment
  }

  async update(id, updateData) {
    await this.delay()
    
    const findAndUpdateComment = (commentsList) => {
      for (let comment of commentsList) {
        if (comment.Id === id) {
          Object.assign(comment, updateData)
          return comment
        }
        if (comment.replies) {
          const found = findAndUpdateComment(comment.replies)
          if (found) return found
        }
      }
      return null
    }
    
    const updated = findAndUpdateComment(this.comments)
    if (!updated) {
      throw new Error("Comment not found")
    }
    
    return updated
  }

  async delete(id) {
    await this.delay()
    
    const deleteFromTree = (commentsList) => {
      for (let i = 0; i < commentsList.length; i++) {
        if (commentsList[i].Id === id) {
          commentsList.splice(i, 1)
          return true
        }
        if (commentsList[i].replies) {
          if (deleteFromTree(commentsList[i].replies)) {
            return true
          }
        }
      }
      return false
    }
    
    const deleted = deleteFromTree(this.comments)
    if (!deleted) {
      throw new Error("Comment not found")
    }
    
    return true
  }
}

export const commentService = new CommentService()