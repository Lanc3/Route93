import { render } from '@redwoodjs/testing/web'

import OrderConfirmationPage from './OrderConfirmationPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OrderConfirmationPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OrderConfirmationPage id={42} />)
    }).not.toThrow()
  })
})
