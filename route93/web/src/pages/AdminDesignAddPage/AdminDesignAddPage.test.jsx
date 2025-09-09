import { render } from '@redwoodjs/testing/web'

import AdminDesignAddPage from './AdminDesignAddPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AdminDesignAddPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AdminDesignAddPage />)
    }).not.toThrow()
  })
})
