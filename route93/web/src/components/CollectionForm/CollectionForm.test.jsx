import { render } from '@redwoodjs/testing/web'

import CollectionForm from './CollectionForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CollectionForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CollectionForm />)
    }).not.toThrow()
  })
})
