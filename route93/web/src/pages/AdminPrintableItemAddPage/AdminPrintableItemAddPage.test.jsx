import { render } from '@redwoodjs/testing/web'

import AdminPrintableItemAddPage from './AdminPrintableItemAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminPrintableItemAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminPrintableItemAddPage />)
    }).not.toThrow()
  })
})
