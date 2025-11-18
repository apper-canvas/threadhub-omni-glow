import { Link } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-8">
              <ApperIcon 
                name="MessageCircleX" 
                className="w-16 h-16 text-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The post might have been removed or you may have mistyped the URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button 
              className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <ApperIcon name="Home" size={20} className="mr-2" />
              Go to Home Feed
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
              Go Back
            </Button>
            <span className="text-gray-400">•</span>
            <Button 
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Help Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/" 
              className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="TrendingUp" size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Popular Posts</span>
            </Link>
            <Link 
              to="/" 
              className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="Users" size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">Communities</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound