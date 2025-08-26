import { render } from '@redwoodjs/testing/web'

import AdminCategoryAddPage from './AdminCategoryAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCategoryAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCategoryAddPage />)
    }).not.toThrow()
  })
})
