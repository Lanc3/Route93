import {
  cartItems,
  cartItem,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from './cartItems'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('cartItems', () => {
  scenario('returns all cartItems', async (scenario) => {
    const result = await cartItems()

    expect(result.length).toEqual(Object.keys(scenario.cartItem).length)
  })

  scenario('returns a single cartItem', async (scenario) => {
    const result = await cartItem({ id: scenario.cartItem.one.id })

    expect(result).toEqual(scenario.cartItem.one)
  })

  scenario('creates a cartItem', async (scenario) => {
    const result = await createCartItem({
      input: {
        quantity: 5892627,
        updatedAt: '2025-08-26T15:05:25.877Z',
        userId: scenario.cartItem.two.userId,
        productId: scenario.cartItem.two.productId,
      },
    })

    expect(result.quantity).toEqual(5892627)
    expect(result.updatedAt).toEqual(new Date('2025-08-26T15:05:25.877Z'))
    expect(result.userId).toEqual(scenario.cartItem.two.userId)
    expect(result.productId).toEqual(scenario.cartItem.two.productId)
  })

  scenario('updates a cartItem', async (scenario) => {
    const original = await cartItem({
      id: scenario.cartItem.one.id,
    })
    const result = await updateCartItem({
      id: original.id,
      input: { quantity: 7124097 },
    })

    expect(result.quantity).toEqual(7124097)
  })

  scenario('deletes a cartItem', async (scenario) => {
    const original = await deleteCartItem({
      id: scenario.cartItem.one.id,
    })
    const result = await cartItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
