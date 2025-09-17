import {
  printOrders,
  printOrder,
  createPrintOrder,
  updatePrintOrder,
  deletePrintOrder,
} from './printOrders'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('printOrders', () => {
  scenario('returns all printOrders', async (scenario) => {
    const result = await printOrders()

    expect(result.length).toEqual(Object.keys(scenario.printOrder).length)
  })

  scenario('returns a single printOrder', async (scenario) => {
    const result = await printOrder({ id: scenario.printOrder.one.id })

    expect(result).toEqual(scenario.printOrder.one)
  })

  scenario('creates a printOrder', async (scenario) => {
    const result = await createPrintOrder({
      input: {
        orderId: scenario.printOrder.two.orderId,
        updatedAt: '2025-09-17T17:28:50.799Z',
      },
    })

    expect(result.orderId).toEqual(scenario.printOrder.two.orderId)
    expect(result.updatedAt).toEqual(new Date('2025-09-17T17:28:50.799Z'))
  })

  scenario('updates a printOrder', async (scenario) => {
    const original = await printOrder({
      id: scenario.printOrder.one.id,
    })
    const result = await updatePrintOrder({
      id: original.id,
      input: { updatedAt: '2025-09-18T17:28:50.854Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2025-09-18T17:28:50.854Z'))
  })

  scenario('deletes a printOrder', async (scenario) => {
    const original = await deletePrintOrder({
      id: scenario.printOrder.one.id,
    })
    const result = await printOrder({ id: original.id })

    expect(result).toEqual(null)
  })
})
