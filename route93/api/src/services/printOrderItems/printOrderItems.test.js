import {
  printOrderItems,
  printOrderItem,
  createPrintOrderItem,
  updatePrintOrderItem,
  deletePrintOrderItem,
} from './printOrderItems'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('printOrderItems', () => {
  scenario('returns all printOrderItems', async (scenario) => {
    const result = await printOrderItems()

    expect(result.length).toEqual(Object.keys(scenario.printOrderItem).length)
  })

  scenario('returns a single printOrderItem', async (scenario) => {
    const result = await printOrderItem({
      id: scenario.printOrderItem.one.id,
    })

    expect(result).toEqual(scenario.printOrderItem.one)
  })

  scenario('creates a printOrderItem', async (scenario) => {
    const result = await createPrintOrderItem({
      input: {
        printOrderId: scenario.printOrderItem.two.printOrderId,
        printableItemId: scenario.printOrderItem.two.printableItemId,
        unitPrice: 6422254.845129622,
        totalPrice: 838694.2373524331,
      },
    })

    expect(result.printOrderId).toEqual(
      scenario.printOrderItem.two.printOrderId
    )
    expect(result.printableItemId).toEqual(
      scenario.printOrderItem.two.printableItemId
    )
    expect(result.unitPrice).toEqual(6422254.845129622)
    expect(result.totalPrice).toEqual(838694.2373524331)
  })

  scenario('updates a printOrderItem', async (scenario) => {
    const original = await printOrderItem({
      id: scenario.printOrderItem.one.id,
    })
    const result = await updatePrintOrderItem({
      id: original.id,
      input: { unitPrice: 2203087.2105909307 },
    })

    expect(result.unitPrice).toEqual(2203087.2105909307)
  })

  scenario('deletes a printOrderItem', async (scenario) => {
    const original = await deletePrintOrderItem({
      id: scenario.printOrderItem.one.id,
    })
    const result = await printOrderItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
