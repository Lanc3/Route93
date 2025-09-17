import {
  printCartItems,
  printCartItem,
  createPrintCartItem,
  updatePrintCartItem,
  deletePrintCartItem,
} from './printCartItems'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('printCartItems', () => {
  scenario('returns all printCartItems', async (scenario) => {
    const result = await printCartItems()

    expect(result.length).toEqual(Object.keys(scenario.printCartItem).length)
  })

  scenario('returns a single printCartItem', async (scenario) => {
    const result = await printCartItem({ id: scenario.printCartItem.one.id })

    expect(result).toEqual(scenario.printCartItem.one)
  })

  scenario('creates a printCartItem', async (scenario) => {
    const result = await createPrintCartItem({
      input: {
        updatedAt: '2025-09-17T17:28:27.040Z',
        userId: scenario.printCartItem.two.userId,
        printableItemId: scenario.printCartItem.two.printableItemId,
      },
    })

    expect(result.updatedAt).toEqual(new Date('2025-09-17T17:28:27.040Z'))
    expect(result.userId).toEqual(scenario.printCartItem.two.userId)
    expect(result.printableItemId).toEqual(
      scenario.printCartItem.two.printableItemId
    )
  })

  scenario('updates a printCartItem', async (scenario) => {
    const original = await printCartItem({
      id: scenario.printCartItem.one.id,
    })
    const result = await updatePrintCartItem({
      id: original.id,
      input: { updatedAt: '2025-09-18T17:28:27.098Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2025-09-18T17:28:27.098Z'))
  })

  scenario('deletes a printCartItem', async (scenario) => {
    const original = await deletePrintCartItem({
      id: scenario.printCartItem.one.id,
    })
    const result = await printCartItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
