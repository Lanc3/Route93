import { render } from '@redwoodjs/testing/web'

import AdminDiscountReportsPage from './AdminDiscountReportsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDiscountReportsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDiscountReportsPage />)
    }).not.toThrow()
  })
})
