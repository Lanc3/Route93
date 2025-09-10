import {
  stockAlerts,
  stockAlert,
  createStockAlert,
  updateStockAlert,
  deleteStockAlert,
} from './stockAlerts'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('stockAlerts', () => {
  scenario('returns all stockAlerts', async (scenario) => {
    const result = await stockAlerts()

    expect(result.length).toEqual(Object.keys(scenario.stockAlert).length)
  })

  scenario('returns a single stockAlert', async (scenario) => {
    const result = await stockAlert({ id: scenario.stockAlert.one.id })

    expect(result).toEqual(scenario.stockAlert.one)
  })

  scenario('creates a stockAlert', async (scenario) => {
    const result = await createStockAlert({
      input: {
        productId: scenario.stockAlert.two.productId,
        unsubToken: 'String6130246',
        updatedAt: '2025-09-10T02:18:41.451Z',
      },
    })

    expect(result.productId).toEqual(scenario.stockAlert.two.productId)
    expect(result.unsubToken).toEqual('String6130246')
    expect(result.updatedAt).toEqual(new Date('2025-09-10T02:18:41.451Z'))
  })

  scenario('updates a stockAlert', async (scenario) => {
    const original = await stockAlert({
      id: scenario.stockAlert.one.id,
    })
    const result = await updateStockAlert({
      id: original.id,
      input: { unsubToken: 'String28581282' },
    })

    expect(result.unsubToken).toEqual('String28581282')
  })

  scenario('deletes a stockAlert', async (scenario) => {
    const original = await deleteStockAlert({
      id: scenario.stockAlert.one.id,
    })
    const result = await stockAlert({ id: original.id })

    expect(result).toEqual(null)
  })
})
