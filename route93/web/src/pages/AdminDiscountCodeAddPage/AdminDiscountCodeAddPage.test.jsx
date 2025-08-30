import { render } from '@redwoodjs/testing/web'

import AdminDiscountCodeAddPage from './AdminDiscountCodeAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDiscountCodeAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDiscountCodeAddPage />)
    }).not.toThrow()
  })
})
