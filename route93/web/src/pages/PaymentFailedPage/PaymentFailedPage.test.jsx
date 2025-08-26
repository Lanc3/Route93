import { render } from '@redwoodjs/testing/web'

import PaymentFailedPage from './PaymentFailedPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PaymentFailedPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PaymentFailedPage />)
    }).not.toThrow()
  })
})
