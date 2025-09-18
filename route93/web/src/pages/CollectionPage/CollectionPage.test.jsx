import { render } from '@redwoodjs/testing/web'

import CollectionPage from './CollectionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CollectionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CollectionPage />)
    }).not.toThrow()
  })
})
