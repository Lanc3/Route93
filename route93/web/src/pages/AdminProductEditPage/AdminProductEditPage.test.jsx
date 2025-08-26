import { render } from '@redwoodjs/testing/web'

import AdminProductEditPage from './AdminProductEditPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminProductEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminProductEditPage id={42} />)
    }).not.toThrow()
  })
})
