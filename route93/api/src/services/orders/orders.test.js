import { orders, order, createOrder, updateOrder, deleteOrder } from './orders'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('orders', () => {
  scenario('returns all orders', async (scenario) => {
    const result = await orders()

    expect(result.length).toEqual(Object.keys(scenario.order).length)
  })

  scenario('returns a single order', async (scenario) => {
    const result = await order({ id: scenario.order.one.id })

    expect(result).toEqual(scenario.order.one)
  })

  scenario('creates a order', async (scenario) => {
    const result = await createOrder({
      input: {
        orderNumber: 'String2108519',
        totalAmount: 9703352.863697363,
        updatedAt: '2025-08-26T15:04:18.919Z',
        userId: scenario.order.two.userId,
        shippingAddressId: scenario.order.two.shippingAddressId,
        billingAddressId: scenario.order.two.billingAddressId,
      },
    })

    expect(result.orderNumber).toEqual('String2108519')
    expect(result.totalAmount).toEqual(9703352.863697363)
    expect(result.updatedAt).toEqual(new Date('2025-08-26T15:04:18.919Z'))
    expect(result.userId).toEqual(scenario.order.two.userId)
    expect(result.shippingAddressId).toEqual(
      scenario.order.two.shippingAddressId
    )
    expect(result.billingAddressId).toEqual(scenario.order.two.billingAddressId)
  })

  scenario('updates a order', async (scenario) => {
    const original = await order({ id: scenario.order.one.id })
    const result = await updateOrder({
      id: original.id,
      input: { orderNumber: 'String14017732' },
    })

    expect(result.orderNumber).toEqual('String14017732')
  })

  scenario('deletes a order', async (scenario) => {
    const original = await deleteOrder({ id: scenario.order.one.id })
    const result = await order({ id: original.id })

    expect(result).toEqual(null)
  })
})
