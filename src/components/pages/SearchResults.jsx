import { useSearchParams } from "react-router-dom"
import PostFeed from "@/components/organisms/PostFeed"
import ApperIcon from "@/components/ApperIcon"

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Search" size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Search Results
            </h1>
          </div>
          
          {query && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Search" size={16} className="text-gray-500" />
                <span className="text-gray-600">Showing results for:</span>
                <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  "{query}"
                </span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600">
            {query 
              ? "Posts matching your search across all communities"
              : "Enter a search term to find posts by title or content"
            }
          </p>
        </div>

        {/* Search Results Feed */}
        <PostFeed 
          searchQuery={query}
          className="space-y-4"
        />
      </div>
    </div>
  )
}

export default SearchResults