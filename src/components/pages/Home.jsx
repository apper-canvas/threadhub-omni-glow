import PostFeed from "@/components/organisms/PostFeed"
import CommunitySidebar from "@/components/organisms/CommunitySidebar"

const Home = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Feed */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Home Feed
          </h1>
          <p className="text-gray-600 mt-1">
            Your personalized feed of posts from all communities
          </p>
        </div>
        
        <PostFeed />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CommunitySidebar />
        </div>
      </div>
    </div>
  )
}

export default Home