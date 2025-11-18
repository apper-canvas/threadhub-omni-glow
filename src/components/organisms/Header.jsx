import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import CommunitySelector from "@/components/molecules/CommunitySelector"
import CreatePostModal from "@/components/organisms/CreatePostModal"
import { cn } from "@/utils/cn"

const Header = ({ className }) => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

const handleCommunitySelect = (communityName) => {
    setSelectedCommunity(communityName)
    navigate(`/community/${communityName}`)
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handlePostCreated = () => {
    setIsCreatePostOpen(false)
    navigate("/")
  }

  return (
    <>
<header className={cn(
        "sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                ThreadHub
              </h1>
            </Link>

            {/* Center - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ApperIcon name="Search" size={16} className="text-gray-400" />
                  </div>
                </div>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon */}
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => {
                  const query = prompt("Search posts:")
                  if (query) handleSearch(query)
                }}
              >
                <ApperIcon name="Search" size={16} />
              </Button>

              <Button
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </Button>

              <Button variant="ghost" size="icon">
                <ApperIcon name="Search" size={20} />
              </Button>

              <Button variant="ghost" size="icon">
                <ApperIcon name="Bell" size={20} />
              </Button>

              <Button variant="ghost" size="icon">
                <ApperIcon name="User" size={20} />
              </Button>
            </div>
          </div>

          {/* Mobile Community Selector */}
          <div className="md:hidden pb-4">
            <CommunitySelector
              selectedCommunity={selectedCommunity}
              onSelect={handleCommunitySelect}
              className="w-full"
            />
          </div>
        </div>
      </header>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}

export default Header