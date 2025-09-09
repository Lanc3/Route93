import { render } from '@redwoodjs/testing/web'

import CustomPrintsPage from './CustomPrintsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CustomPrintsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CustomPrintsPage />)
    }).not.toThrow()
  })
})
