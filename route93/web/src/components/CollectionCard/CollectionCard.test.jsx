import { render } from '@redwoodjs/testing/web'

import CollectionCard from './CollectionCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CollectionCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CollectionCard />)
    }).not.toThrow()
  })
})
