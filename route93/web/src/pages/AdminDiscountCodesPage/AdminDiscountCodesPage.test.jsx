import { render } from '@redwoodjs/testing/web'

import AdminDiscountCodesPage from './AdminDiscountCodesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDiscountCodesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDiscountCodesPage />)
    }).not.toThrow()
  })
})
