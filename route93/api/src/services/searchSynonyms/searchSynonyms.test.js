import {
  searchSynonyms,
  searchSynonym,
  createSearchSynonym,
  updateSearchSynonym,
  deleteSearchSynonym,
} from './searchSynonyms'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('searchSynonyms', () => {
  scenario('returns all searchSynonyms', async (scenario) => {
    const result = await searchSynonyms()

    expect(result.length).toEqual(Object.keys(scenario.searchSynonym).length)
  })

  scenario('returns a single searchSynonym', async (scenario) => {
    const result = await searchSynonym({ id: scenario.searchSynonym.one.id })

    expect(result).toEqual(scenario.searchSynonym.one)
  })

  scenario('creates a searchSynonym', async () => {
    const result = await createSearchSynonym({
      input: {
        term: 'String9999216',
        synonyms: 'String',
        updatedAt: '2025-09-10T02:17:16.976Z',
      },
    })

    expect(result.term).toEqual('String9999216')
    expect(result.synonyms).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-09-10T02:17:16.976Z'))
  })

  scenario('updates a searchSynonym', async (scenario) => {
    const original = await searchSynonym({
      id: scenario.searchSynonym.one.id,
    })
    const result = await updateSearchSynonym({
      id: original.id,
      input: { term: 'String55953772' },
    })

    expect(result.term).toEqual('String55953772')
  })

  scenario('deletes a searchSynonym', async (scenario) => {
    const original = await deleteSearchSynonym({
      id: scenario.searchSynonym.one.id,
    })
    const result = await searchSynonym({ id: original.id })

    expect(result).toEqual(null)
  })
})
