import {
  collections,
  collection,
  createCollection,
  updateCollection,
  deleteCollection,
} from './collections'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('collections', () => {
  scenario('returns all collections', async (scenario) => {
    const result = await collections()

    expect(result.length).toEqual(Object.keys(scenario.collection).length)
  })

  scenario('returns a single collection', async (scenario) => {
    const result = await collection({ id: scenario.collection.one.id })

    expect(result).toEqual(scenario.collection.one)
  })

  scenario('creates a collection', async () => {
    const result = await createCollection({
      input: {
        name: 'String',
        slug: 'String546002',
        updatedAt: '2025-08-26T11:53:52.524Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.slug).toEqual('String546002')
    expect(result.updatedAt).toEqual(new Date('2025-08-26T11:53:52.524Z'))
  })

  scenario('updates a collection', async (scenario) => {
    const original = await collection({
      id: scenario.collection.one.id,
    })
    const result = await updateCollection({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a collection', async (scenario) => {
    const original = await deleteCollection({
      id: scenario.collection.one.id,
    })
    const result = await collection({ id: original.id })

    expect(result).toEqual(null)
  })
})
