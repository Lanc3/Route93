import {
  priceAlerts,
  priceAlert,
  createPriceAlert,
  updatePriceAlert,
  deletePriceAlert,
} from './priceAlerts'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('priceAlerts', () => {
  scenario('returns all priceAlerts', async (scenario) => {
    const result = await priceAlerts()

    expect(result.length).toEqual(Object.keys(scenario.priceAlert).length)
  })

  scenario('returns a single priceAlert', async (scenario) => {
    const result = await priceAlert({ id: scenario.priceAlert.one.id })

    expect(result).toEqual(scenario.priceAlert.one)
  })

  scenario('creates a priceAlert', async (scenario) => {
    const result = await createPriceAlert({
      input: {
        productId: scenario.priceAlert.two.productId,
        unsubToken: 'String3604248',
        updatedAt: '2025-09-10T02:17:10.363Z',
      },
    })

    expect(result.productId).toEqual(scenario.priceAlert.two.productId)
    expect(result.unsubToken).toEqual('String3604248')
    expect(result.updatedAt).toEqual(new Date('2025-09-10T02:17:10.363Z'))
  })

  scenario('updates a priceAlert', async (scenario) => {
    const original = await priceAlert({
      id: scenario.priceAlert.one.id,
    })
    const result = await updatePriceAlert({
      id: original.id,
      input: { unsubToken: 'String2954322' },
    })

    expect(result.unsubToken).toEqual('String2954322')
  })

  scenario('deletes a priceAlert', async (scenario) => {
    const original = await deletePriceAlert({
      id: scenario.priceAlert.one.id,
    })
    const result = await priceAlert({ id: original.id })

    expect(result).toEqual(null)
  })
})
