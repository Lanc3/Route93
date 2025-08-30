import { render } from '@redwoodjs/testing/web'

import AdminDiscountCodeEditPage from './AdminDiscountCodeEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDiscountCodeEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDiscountCodeEditPage />)
    }).not.toThrow()
  })
})
