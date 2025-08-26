import { render } from '@redwoodjs/testing/web'

import ProductPage from './ProductPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ProductPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ProductPage />)
    }).not.toThrow()
  })
})
