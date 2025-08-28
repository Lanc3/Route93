import { useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'
import { gql } from '@apollo/client'

const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReviewMutation($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      title
      comment
      createdAt
      user {
        id
        name
      }
    }
  }
`

const CreateReviewForm = ({ productId, onReviewCreated }) => {
  const { isAuthenticated, currentUser } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createReview] = useMutation(CREATE_REVIEW_MUTATION, {
    onCompleted: () => {
      toast.success('Review submitted successfully!')
      setRating(0)
      setTitle('')
      setComment('')
      setIsSubmitting(false)
      if (onReviewCreated) {
        onReviewCreated()
      }
    },
    onError: (error) => {
      toast.error(error.message)
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!rating) {
      toast.error('Please select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Please write a comment')
      return
    }

    setIsSubmitting(true)

    try {
      await createReview({
        variables: {
          input: {
            rating,
            title: title.trim() || null,
            comment: comment.trim(),
            isVerified: false,
            userId: currentUser.id,
            productId: parseInt(productId),
          },
        },
      })
    } catch (error) {
      console.error('Error creating review:', error)
    }
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full p-1"
        >
          <svg
            className={`w-8 h-8 ${
              i <= (hoveredRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } transition-colors duration-200`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      )
    }
    return stars
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="text-center">
          <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-blue-900 mb-2">Sign in to write a review</h3>
          <p className="text-blue-700 mb-4">You need to be signed in to share your thoughts about this product.</p>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center space-x-2">
            {renderStars()}
            <span className="ml-3 text-sm text-gray-600">
              {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Summarize your experience..."
            maxLength={100}
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Share your thoughts about this product..."
            maxLength={1000}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !rating || !comment.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isSubmitting || !rating || !comment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateReviewForm
