import { render } from '@redwoodjs/testing/web'

import AdminInventoryPage from './AdminInventoryPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminInventoryPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminInventoryPage />)
    }).not.toThrow()
  })
})
