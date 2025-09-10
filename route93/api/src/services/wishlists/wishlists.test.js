import {
  wishlists,
  wishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
} from './wishlists'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('wishlists', () => {
  scenario('returns all wishlists', async (scenario) => {
    const result = await wishlists()

    expect(result.length).toEqual(Object.keys(scenario.wishlist).length)
  })

  scenario('returns a single wishlist', async (scenario) => {
    const result = await wishlist({ id: scenario.wishlist.one.id })

    expect(result).toEqual(scenario.wishlist.one)
  })

  scenario('creates a wishlist', async (scenario) => {
    const result = await createWishlist({
      input: {
        userId: scenario.wishlist.two.userId,
        productId: scenario.wishlist.two.productId,
        updatedAt: '2025-09-10T02:17:03.200Z',
      },
    })

    expect(result.userId).toEqual(scenario.wishlist.two.userId)
    expect(result.productId).toEqual(scenario.wishlist.two.productId)
    expect(result.updatedAt).toEqual(new Date('2025-09-10T02:17:03.200Z'))
  })

  scenario('updates a wishlist', async (scenario) => {
    const original = await wishlist({
      id: scenario.wishlist.one.id,
    })
    const result = await updateWishlist({
      id: original.id,
      input: { updatedAt: '2025-09-11T02:17:03.248Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2025-09-11T02:17:03.248Z'))
  })

  scenario('deletes a wishlist', async (scenario) => {
    const original = await deleteWishlist({
      id: scenario.wishlist.one.id,
    })
    const result = await wishlist({ id: original.id })

    expect(result).toEqual(null)
  })
})
