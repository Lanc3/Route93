import {
  productCollections,
  productCollection,
  createProductCollection,
  updateProductCollection,
  deleteProductCollection,
} from './productCollections'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('productCollections', () => {
  scenario('returns all productCollections', async (scenario) => {
    const result = await productCollections()

    expect(result.length).toEqual(
      Object.keys(scenario.productCollection).length
    )
  })

  scenario('returns a single productCollection', async (scenario) => {
    const result = await productCollection({
      id: scenario.productCollection.one.id,
    })

    expect(result).toEqual(scenario.productCollection.one)
  })

  scenario('creates a productCollection', async (scenario) => {
    const result = await createProductCollection({
      input: {
        productId: scenario.productCollection.two.productId,
        collectionId: scenario.productCollection.two.collectionId,
      },
    })

    expect(result.productId).toEqual(scenario.productCollection.two.productId)
    expect(result.collectionId).toEqual(
      scenario.productCollection.two.collectionId
    )
  })

  scenario('updates a productCollection', async (scenario) => {
    const original = await productCollection({
      id: scenario.productCollection.one.id,
    })
    const result = await updateProductCollection({
      id: original.id,
      input: { productId: scenario.productCollection.two.productId },
    })

    expect(result.productId).toEqual(scenario.productCollection.two.productId)
  })

  scenario('deletes a productCollection', async (scenario) => {
    const original = await deleteProductCollection({
      id: scenario.productCollection.one.id,
    })
    const result = await productCollection({ id: original.id })

    expect(result).toEqual(null)
  })
})
