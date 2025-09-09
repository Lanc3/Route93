import { render } from '@redwoodjs/testing/web'

import AdminPrintableItemsPage from './AdminPrintableItemsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminPrintableItemsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminPrintableItemsPage />)
    }).not.toThrow()
  })
})
