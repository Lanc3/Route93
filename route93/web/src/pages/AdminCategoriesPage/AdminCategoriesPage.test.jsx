import { render } from '@redwoodjs/testing/web'

import AdminCategoriesPage from './AdminCategoriesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCategoriesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCategoriesPage />)
    }).not.toThrow()
  })
})
