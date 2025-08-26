import {
  reviews,
  review,
  createReview,
  updateReview,
  deleteReview,
} from './reviews'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('reviews', () => {
  scenario('returns all reviews', async (scenario) => {
    const result = await reviews()

    expect(result.length).toEqual(Object.keys(scenario.review).length)
  })

  scenario('returns a single review', async (scenario) => {
    const result = await review({ id: scenario.review.one.id })

    expect(result).toEqual(scenario.review.one)
  })

  scenario('creates a review', async (scenario) => {
    const result = await createReview({
      input: {
        rating: 6756461,
        updatedAt: '2025-08-26T15:05:36.992Z',
        userId: scenario.review.two.userId,
        productId: scenario.review.two.productId,
      },
    })

    expect(result.rating).toEqual(6756461)
    expect(result.updatedAt).toEqual(new Date('2025-08-26T15:05:36.992Z'))
    expect(result.userId).toEqual(scenario.review.two.userId)
    expect(result.productId).toEqual(scenario.review.two.productId)
  })

  scenario('updates a review', async (scenario) => {
    const original = await review({ id: scenario.review.one.id })
    const result = await updateReview({
      id: original.id,
      input: { rating: 1305744 },
    })

    expect(result.rating).toEqual(1305744)
  })

  scenario('deletes a review', async (scenario) => {
    const original = await deleteReview({
      id: scenario.review.one.id,
    })
    const result = await review({ id: original.id })

    expect(result).toEqual(null)
  })
})
