import {
  addresses,
  address,
  createAddress,
  updateAddress,
  deleteAddress,
} from './addresses'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('addresses', () => {
  scenario('returns all addresses', async (scenario) => {
    const result = await addresses()

    expect(result.length).toEqual(Object.keys(scenario.address).length)
  })

  scenario('returns a single address', async (scenario) => {
    const result = await address({ id: scenario.address.one.id })

    expect(result).toEqual(scenario.address.one)
  })

  scenario('creates a address', async (scenario) => {
    const result = await createAddress({
      input: {
        firstName: 'String',
        lastName: 'String',
        address1: 'String',
        city: 'String',
        state: 'String',
        zipCode: 'String',
        updatedAt: '2025-08-26T15:04:46.747Z',
        userId: scenario.address.two.userId,
      },
    })

    expect(result.firstName).toEqual('String')
    expect(result.lastName).toEqual('String')
    expect(result.address1).toEqual('String')
    expect(result.city).toEqual('String')
    expect(result.state).toEqual('String')
    expect(result.zipCode).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-08-26T15:04:46.747Z'))
    expect(result.userId).toEqual(scenario.address.two.userId)
  })

  scenario('updates a address', async (scenario) => {
    const original = await address({ id: scenario.address.one.id })
    const result = await updateAddress({
      id: original.id,
      input: { firstName: 'String2' },
    })

    expect(result.firstName).toEqual('String2')
  })

  scenario('deletes a address', async (scenario) => {
    const original = await deleteAddress({
      id: scenario.address.one.id,
    })
    const result = await address({ id: original.id })

    expect(result).toEqual(null)
  })
})
