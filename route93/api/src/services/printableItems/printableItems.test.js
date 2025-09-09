import {
  printableItems,
  printableItem,
  createPrintableItem,
  updatePrintableItem,
  deletePrintableItem,
} from './printableItems'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('printableItems', () => {
  scenario('returns all printableItems', async (scenario) => {
    const result = await printableItems()

    expect(result.length).toEqual(Object.keys(scenario.printableItem).length)
  })

  scenario('returns a single printableItem', async (scenario) => {
    const result = await printableItem({ id: scenario.printableItem.one.id })

    expect(result).toEqual(scenario.printableItem.one)
  })

  scenario('creates a printableItem', async () => {
    const result = await createPrintableItem({
      input: {
        name: 'String',
        price: 9846723.331022464,
        updatedAt: '2025-09-08T15:37:53.972Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.price).toEqual(9846723.331022464)
    expect(result.updatedAt).toEqual(new Date('2025-09-08T15:37:53.972Z'))
  })

  scenario('updates a printableItem', async (scenario) => {
    const original = await printableItem({
      id: scenario.printableItem.one.id,
    })
    const result = await updatePrintableItem({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a printableItem', async (scenario) => {
    const original = await deletePrintableItem({
      id: scenario.printableItem.one.id,
    })
    const result = await printableItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
