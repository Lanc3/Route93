import { render } from '@redwoodjs/testing/web'

import ProductReviews from './ProductReviews'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ProductReviews', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductReviews />)
    }).not.toThrow()
  })
})
