import { cn } from "@/utils/cn"

const Loading = ({ className, variant = "feed" }) => {
  if (variant === "feed") {
    return (
      <div className={cn("space-y-6", className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex flex-col space-y-2">
                <div className="skeleton w-8 h-8 rounded" />
                <div className="skeleton w-6 h-6 rounded" />
                <div className="skeleton w-8 h-6 rounded" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="skeleton w-20 h-4 rounded-full" />
                  <div className="skeleton w-2 h-2 rounded-full" />
                  <div className="skeleton w-16 h-4 rounded" />
                  <div className="skeleton w-2 h-2 rounded-full" />
                  <div className="skeleton w-20 h-4 rounded" />
                </div>
                <div className="skeleton w-3/4 h-6 rounded" />
                <div className="space-y-2">
                  <div className="skeleton w-full h-4 rounded" />
                  <div className="skeleton w-5/6 h-4 rounded" />
                  <div className="skeleton w-4/6 h-4 rounded" />
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="skeleton w-16 h-6 rounded" />
                  <div className="skeleton w-16 h-6 rounded" />
                  <div className="skeleton w-16 h-6 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "comments") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={`border-l-2 border-gray-100 pl-4 ${index > 2 ? 'ml-6' : ''}`}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="skeleton w-16 h-4 rounded" />
                <div className="skeleton w-2 h-2 rounded-full" />
                <div className="skeleton w-12 h-4 rounded" />
              </div>
              <div className="space-y-2">
                <div className="skeleton w-full h-4 rounded" />
                <div className="skeleton w-3/4 h-4 rounded" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="skeleton w-12 h-5 rounded" />
                <div className="skeleton w-12 h-5 rounded" />
                <div className="skeleton w-12 h-5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="text-center space-y-4">
        <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default Loading