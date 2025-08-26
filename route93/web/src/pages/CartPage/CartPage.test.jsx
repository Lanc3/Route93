import { render } from '@redwoodjs/testing/web'

import CartPage from './CartPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CartPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartPage />)
    }).not.toThrow()
  })
})
