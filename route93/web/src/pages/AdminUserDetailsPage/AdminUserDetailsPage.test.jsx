import { render } from '@redwoodjs/testing/web'

import AdminUserDetailsPage from './AdminUserDetailsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminUserDetailsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminUserDetailsPage id={42} />)
    }).not.toThrow()
  })
})
