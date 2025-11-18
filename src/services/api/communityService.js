import communitiesData from "@/services/mockData/communities.json"

class CommunityService {
  constructor() {
    this.communities = [...communitiesData]
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
}

export const communityService = new CommunityService()