import { render } from '@redwoodjs/testing/web'

import AdminProductAddPage from './AdminProductAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminProductAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminProductAddPage />)
    }).not.toThrow()
  })
})
