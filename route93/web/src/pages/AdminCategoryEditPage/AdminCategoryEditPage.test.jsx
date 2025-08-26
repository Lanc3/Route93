import { render } from '@redwoodjs/testing/web'

import AdminCategoryEditPage from './AdminCategoryEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminCategoryEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminCategoryEditPage id={42} />)
    }).not.toThrow()
  })
})
