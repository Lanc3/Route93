import {
  designs,
  design,
  createDesign,
  updateDesign,
  deleteDesign,
} from './designs'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('designs', () => {
  scenario('returns all designs', async (scenario) => {
    const result = await designs()

    expect(result.length).toEqual(Object.keys(scenario.design).length)
  })

  scenario('returns a single design', async (scenario) => {
    const result = await design({ id: scenario.design.one.id })

    expect(result).toEqual(scenario.design.one)
  })

  scenario('creates a design', async () => {
    const result = await createDesign({
      input: {
        name: 'String',
        imageUrl: 'String',
        publicId: 'String',
        updatedAt: '2025-09-08T15:48:53.282Z',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.imageUrl).toEqual('String')
    expect(result.publicId).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-09-08T15:48:53.282Z'))
  })

  scenario('updates a design', async (scenario) => {
    const original = await design({ id: scenario.design.one.id })
    const result = await updateDesign({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a design', async (scenario) => {
    const original = await deleteDesign({
      id: scenario.design.one.id,
    })
    const result = await design({ id: original.id })

    expect(result).toEqual(null)
  })
})
