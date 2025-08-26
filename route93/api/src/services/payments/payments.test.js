import {
  payments,
  payment,
  createPayment,
  updatePayment,
  deletePayment,
} from './payments'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('payments', () => {
  scenario('returns all payments', async (scenario) => {
    const result = await payments()

    expect(result.length).toEqual(Object.keys(scenario.payment).length)
  })

  scenario('returns a single payment', async (scenario) => {
    const result = await payment({ id: scenario.payment.one.id })

    expect(result).toEqual(scenario.payment.one)
  })

  scenario('creates a payment', async (scenario) => {
    const result = await createPayment({
      input: {
        amount: 6205096.65837165,
        method: 'String',
        updatedAt: '2025-08-26T15:05:09.410Z',
        orderId: scenario.payment.two.orderId,
      },
    })

    expect(result.amount).toEqual(6205096.65837165)
    expect(result.method).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-08-26T15:05:09.410Z'))
    expect(result.orderId).toEqual(scenario.payment.two.orderId)
  })

  scenario('updates a payment', async (scenario) => {
    const original = await payment({ id: scenario.payment.one.id })
    const result = await updatePayment({
      id: original.id,
      input: { amount: 2363529.0619807136 },
    })

    expect(result.amount).toEqual(2363529.0619807136)
  })

  scenario('deletes a payment', async (scenario) => {
    const original = await deletePayment({
      id: scenario.payment.one.id,
    })
    const result = await payment({ id: original.id })

    expect(result).toEqual(null)
  })
})
