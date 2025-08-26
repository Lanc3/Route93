import { render } from '@redwoodjs/testing/web'

import ReturnsPage from './ReturnsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ReturnsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ReturnsPage />)
    }).not.toThrow()
  })
})
