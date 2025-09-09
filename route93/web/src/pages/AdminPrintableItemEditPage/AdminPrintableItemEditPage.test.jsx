import { render } from '@redwoodjs/testing/web'

import AdminPrintableItemEditPage from './AdminPrintableItemEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminPrintableItemEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminPrintableItemEditPage />)
    }).not.toThrow()
  })
})
