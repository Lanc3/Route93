import {
  orderItems,
  orderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from './orderItems'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('orderItems', () => {
  scenario('returns all orderItems', async (scenario) => {
    const result = await orderItems()

    expect(result.length).toEqual(Object.keys(scenario.orderItem).length)
  })

  scenario('returns a single orderItem', async (scenario) => {
    const result = await orderItem({ id: scenario.orderItem.one.id })

    expect(result).toEqual(scenario.orderItem.one)
  })

  scenario('creates a orderItem', async (scenario) => {
    const result = await createOrderItem({
      input: {
        quantity: 798560,
        price: 4697144.374556779,
        totalPrice: 5602930.8120494895,
        orderId: scenario.orderItem.two.orderId,
        productId: scenario.orderItem.two.productId,
      },
    })

    expect(result.quantity).toEqual(798560)
    expect(result.price).toEqual(4697144.374556779)
    expect(result.totalPrice).toEqual(5602930.8120494895)
    expect(result.orderId).toEqual(scenario.orderItem.two.orderId)
    expect(result.productId).toEqual(scenario.orderItem.two.productId)
  })

  scenario('updates a orderItem', async (scenario) => {
    const original = await orderItem({
      id: scenario.orderItem.one.id,
    })
    const result = await updateOrderItem({
      id: original.id,
      input: { quantity: 5764636 },
    })

    expect(result.quantity).toEqual(5764636)
  })

  scenario('deletes a orderItem', async (scenario) => {
    const original = await deleteOrderItem({
      id: scenario.orderItem.one.id,
    })
    const result = await orderItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
