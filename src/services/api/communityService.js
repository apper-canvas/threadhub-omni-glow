import communitiesData from "@/services/mockData/communities.json"
import { toast } from "react-toastify"

class CommunityService {
  constructor() {
this.communities = [...communitiesData]
    this.membershipKey = 'threadhub_joined_communities'
  }

  async delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.communities].sort((a, b) => b.memberCount - a.memberCount)
  }

  async getById(id) {
    await this.delay()
    return this.communities.find(community => community.Id === id) || null
  }

  async getByName(name) {
    await this.delay()
    return this.communities.find(community => 
      community.name.toLowerCase() === name.toLowerCase()
    ) || null
  }

  async create(communityData) {
    await this.delay(500)
    
    const newCommunity = {
      Id: Math.max(...this.communities.map(c => c.Id)) + 1,
      name: communityData.name,
      description: communityData.description,
      memberCount: 1, // Start with creator as first member
      createdAt: new Date().toISOString(),
      iconUrl: communityData.iconUrl || "/icons/default.png"
    }
    
    this.communities.push(newCommunity)
    return newCommunity
  }

  async update(id, updateData) {
    await this.delay()
    
    const index = this.communities.findIndex(community => community.Id === id)
    if (index === -1) {
      throw new Error("Community not found")
    }
    
    this.communities[index] = {
      ...this.communities[index],
      ...updateData
    }
    
    return this.communities[index]
  }

  async delete(id) {
    await this.delay()
    
    const index = this.communities.findIndex(community => community.Id === id)
    if (index === -1) {
      throw new Error("Community not found")
    }
    
    this.communities.splice(index, 1)
    return true
  }

  async getTrending(limit = 5) {
    await this.delay()
    return [...this.communities]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit)
  }

  async search(query) {
    await this.delay()
    return this.communities.filter(community =>
      community.name.toLowerCase().includes(query.toLowerCase()) ||
      community.description.toLowerCase().includes(query.toLowerCase())
    )
  }
// Membership management methods
  getJoinedCommunities() {
    try {
      const joinedData = localStorage.getItem(this.membershipKey)
      return joinedData ? JSON.parse(joinedData) : []
    } catch (error) {
      console.error('Failed to load joined communities:', error)
      return []
    }
  }

  saveJoinedCommunities(communityIds) {
    try {
      localStorage.setItem(this.membershipKey, JSON.stringify(communityIds))
    } catch (error) {
      console.error('Failed to save joined communities:', error)
    }
  }

  isUserJoined(communityId) {
    const joinedCommunities = this.getJoinedCommunities()
    return joinedCommunities.includes(communityId)
  }

  async joinCommunity(communityId) {
    const joinedCommunities = this.getJoinedCommunities()
    
    if (!joinedCommunities.includes(communityId)) {
      joinedCommunities.push(communityId)
      this.saveJoinedCommunities(joinedCommunities)
      
      // Update member count
      const community = this.communities.find(c => c.Id === communityId)
      if (community) {
        community.memberCount += 1
        toast.success(`Joined r/${community.name}!`)
      }
    }
    
    return true
  }

  async leaveCommunity(communityId) {
    const joinedCommunities = this.getJoinedCommunities()
    const index = joinedCommunities.indexOf(communityId)
    
    if (index > -1) {
      joinedCommunities.splice(index, 1)
      this.saveJoinedCommunities(joinedCommunities)
      
      // Update member count
      const community = this.communities.find(c => c.Id === communityId)
      if (community) {
        community.memberCount -= 1
        toast.success(`Left r/${community.name}`)
      }
    }
    
    return true
  }

  getJoinedCommunitiesData() {
    const joinedIds = this.getJoinedCommunities()
    return this.communities.filter(community => joinedIds.includes(community.Id))
  }
}

export const communityService = new CommunityService()