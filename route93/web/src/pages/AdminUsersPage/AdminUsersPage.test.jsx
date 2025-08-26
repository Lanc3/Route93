import { render } from '@redwoodjs/testing/web'

import AdminUsersPage from './AdminUsersPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminUsersPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminUsersPage />)
    }).not.toThrow()
  })
})
