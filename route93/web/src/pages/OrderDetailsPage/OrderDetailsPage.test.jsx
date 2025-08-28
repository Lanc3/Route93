import { render } from '@redwoodjs/testing/web'

import OrderDetailsPage from './OrderDetailsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OrderDetailsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderDetailsPage />)
    }).not.toThrow()
  })
})
