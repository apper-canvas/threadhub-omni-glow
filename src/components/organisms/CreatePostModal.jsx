import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import CommunitySelector from "@/components/molecules/CommunitySelector"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { postService } from "@/services/api/postService"
import { toast } from "react-toastify"

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    linkUrl: "",
    community: "",
    type: "text"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-detect post type based on content
    if (field === "linkUrl") {
      setFormData(prev => ({
        ...prev,
        type: value ? "link" : "text"
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }
    
    if (!formData.community) {
      toast.error("Please select a community")
      return
    }

    if (!formData.content.trim() && !formData.linkUrl.trim()) {
      toast.error("Please add content or a link")
      return
    }

    try {
      setIsSubmitting(true)
      
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        linkUrl: formData.linkUrl.trim(),
        community: formData.community,
        type: formData.linkUrl ? "link" : "text"
      }

      await postService.create(postData)
      
      toast.success("Post created successfully!")
      setFormData({
        title: "",
        content: "",
        linkUrl: "",
        community: "",
        type: "text"
      })
      
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error("Failed to create post:", error)
      toast.error("Failed to create post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-orange-600">
          <h2 className="text-xl font-bold text-white">Create a new post</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Community Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community *
              </label>
              <CommunitySelector
                selectedCommunity={formData.community}
                onSelect={(community) => handleInputChange("community", community)}
              />
            </div>

            {/* Post Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Post Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "text")}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200",
                    formData.type === "text" 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  <ApperIcon name="FileText" size={16} />
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("type", "link")}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200",
                    formData.type === "link" 
                      ? "bg-primary text-white border-primary" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  <ApperIcon name="ExternalLink" size={16} />
                  <span>Link</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                placeholder="An interesting title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-base"
                maxLength={300}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/300 characters
              </p>
            </div>

            {/* Link URL (for link posts) */}
            {formData.type === "link" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.linkUrl}
                  onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                  className="text-base"
                />
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === "link" ? "Description (optional)" : "Content"}
              </label>
              <Textarea
                placeholder={formData.type === "link" ? "Tell us more about this link..." : "What's on your mind?"}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                className="min-h-[120px] text-base"
                maxLength={10000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length}/10,000 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.community}
                className="bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    Create Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CreatePostModal