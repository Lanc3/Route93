import { formatDistanceToNow } from 'date-fns'

const ReviewCard = ({ review }) => {
  const { rating, title, comment, createdAt, user } = review

  // Generate star display
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-medium text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1">
          {renderStars(rating)}
          <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
        </div>
      </div>

      {/* Review Content */}
      {title && (
        <h5 className="font-medium text-gray-900 mb-2">{title}</h5>
      )}
      
      {comment && (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {comment}
        </p>
      )}
    </div>
  )
}

export default ReviewCard
