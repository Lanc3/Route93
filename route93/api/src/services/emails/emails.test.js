import { emails, email, createEmail, updateEmail, deleteEmail } from './emails'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('emails', () => {
  scenario('returns all emails', async (scenario) => {
    const result = await emails()

    expect(result.length).toEqual(Object.keys(scenario.email).length)
  })

  scenario('returns a single email', async (scenario) => {
    const result = await email({ id: scenario.email.one.id })

    expect(result).toEqual(scenario.email.one)
  })

  scenario('creates a email', async () => {
    const result = await createEmail({
      input: {
        to: 'String',
        subject: 'String',
        template: 'String',
        updatedAt: '2025-08-27T18:42:32.115Z',
      },
    })

    expect(result.to).toEqual('String')
    expect(result.subject).toEqual('String')
    expect(result.template).toEqual('String')
    expect(result.updatedAt).toEqual(new Date('2025-08-27T18:42:32.115Z'))
  })

  scenario('updates a email', async (scenario) => {
    const original = await email({ id: scenario.email.one.id })
    const result = await updateEmail({
      id: original.id,
      input: { to: 'String2' },
    })

    expect(result.to).toEqual('String2')
  })

  scenario('deletes a email', async (scenario) => {
    const original = await deleteEmail({ id: scenario.email.one.id })
    const result = await email({ id: original.id })

    expect(result).toEqual(null)
  })
})
