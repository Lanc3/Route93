import { useState } from 'react'
import ReviewCard from 'src/components/ReviewCard/ReviewCard'
import CreateReviewForm from 'src/components/CreateReviewForm/CreateReviewForm'

const ProductReviews = ({ product, onReviewCreated }) => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { reviews, _count } = product
  const reviewCount = _count?.reviews || 0

  const handleReviewCreated = () => {
    setShowCreateForm(false)
    if (onReviewCreated) {
      onReviewCreated()
    }
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const renderAverageStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return stars
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
          {reviewCount > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                {renderAverageStars(averageRating)}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} out of 5
              </span>
              <span className="text-sm text-gray-500">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary"
        >
          {showCreateForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Create Review Form */}
      {showCreateForm && (
        <CreateReviewForm 
          productId={product.id} 
          onReviewCreated={handleReviewCreated}
        />
      )}

      {/* Reviews List */}
      {reviewCount > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductReviews
