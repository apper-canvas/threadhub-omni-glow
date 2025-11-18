import postsData from "@/services/mockData/posts.json"
import { voteService } from "@/services/api/voteService"

class PostService {
constructor() {
    this.posts = [...postsData]
    this.voteService = voteService
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

async getAll() {
    await this.delay()
    const posts = [...this.posts]
    
    // Get vote counts for all posts
    const postsWithVotes = await Promise.all(
      posts.map(async (post) => {
        const voteCount = await this.voteService.getVoteCount(post.Id, 'post')
        return {
          ...post,
          voteScore: voteCount
        }
      })
    )
    
    // Sort by vote count (descending), then by creation date for ties
    return postsWithVotes.sort((a, b) => {
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  async getById(id) {
    await this.delay()
    return this.posts.find(post => post.Id === id) || null
  }

async getByCommunity(communityName) {
    await this.delay()
    const filteredPosts = this.posts.filter(post => post.community === communityName)
    
    // Get vote counts for filtered posts
    const postsWithVotes = await Promise.all(
      filteredPosts.map(async (post) => {
        const voteCount = await this.voteService.getVoteCount(post.Id, 'post')
        return {
          ...post,
          voteScore: voteCount
        }
      })
    )
    
    // Sort by vote count (descending), then by creation date for ties
    return postsWithVotes.sort((a, b) => {
      if (b.voteScore !== a.voteScore) {
        return b.voteScore - a.voteScore
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  async create(postData) {
    await this.delay(500)
    
    const newPost = {
      Id: Math.max(...this.posts.map(p => p.Id)) + 1,
      title: postData.title,
      content: postData.content || "",
      linkUrl: postData.linkUrl || "",
      author: "currentUser", // In real app, would come from auth
      community: postData.community,
      votes: 1, // Start with 1 vote (author's upvote)
      commentCount: 0,
      createdAt: new Date().toISOString(),
      type: postData.type || "text"
    }
    
    this.posts.unshift(newPost)
    return newPost
  }

  async update(id, updateData) {
    await this.delay()
    
    const index = this.posts.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error("Post not found")
    }
    
    this.posts[index] = {
      ...this.posts[index],
      ...updateData
    }
    
    return this.posts[index]
  }

  async delete(id) {
    await this.delay()
    
    const index = this.posts.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error("Post not found")
    }
    
    this.posts.splice(index, 1)
    return true
  }

  async incrementCommentCount(postId) {
    const post = this.posts.find(p => p.Id === postId)
    if (post) {
      post.commentCount += 1
    }
  }
}

export const postService = new PostService()