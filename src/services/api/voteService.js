import votesData from "@/services/mockData/votes.json"

class VoteService {
  constructor() {
    this.votes = [...votesData]
    this.currentUserId = "currentUser" // In real app, would come from auth
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async vote(targetId, direction, targetType) {
    await this.delay()
    
    // Check if user already voted on this target
    const existingVote = this.votes.find(vote => 
      vote.userId === this.currentUserId && 
      vote.targetId === parseInt(targetId) && 
      vote.targetType === targetType
    )
    
    if (existingVote) {
      if (existingVote.direction === direction) {
        // Remove vote (toggle off)
        const index = this.votes.indexOf(existingVote)
        this.votes.splice(index, 1)
        return { action: "removed", direction }
      } else {
        // Change vote direction
        existingVote.direction = direction
        return { action: "changed", direction }
      }
    } else {
      // Create new vote
      const newVote = {
        Id: Math.max(...this.votes.map(v => v.Id)) + 1,
        userId: this.currentUserId,
        targetId: parseInt(targetId),
        targetType,
        direction
      }
      
      this.votes.push(newVote)
      return { action: "created", direction }
    }
  }

  async getUserVote(targetId, targetType) {
    await this.delay(100)
    
    const vote = this.votes.find(vote => 
      vote.userId === this.currentUserId && 
      vote.targetId === parseInt(targetId) && 
      vote.targetType === targetType
    )
    
    return vote ? vote.direction : null
  }

  async getVoteCount(targetId, targetType) {
    await this.delay(100)
    
    const targetVotes = this.votes.filter(vote => 
      vote.targetId === parseInt(targetId) && 
      vote.targetType === targetType
    )
    
    const upvotes = targetVotes.filter(vote => vote.direction === "up").length
    const downvotes = targetVotes.filter(vote => vote.direction === "down").length
    
    return {
      total: upvotes - downvotes,
      upvotes,
      downvotes
    }
  }

  async getVotesByUser(userId = this.currentUserId) {
    await this.delay()
    
    return this.votes.filter(vote => vote.userId === userId)
  }
}

export const voteService = new VoteService()