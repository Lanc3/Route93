import { render } from '@redwoodjs/testing/web'

import HelpCenterPage from './HelpCenterPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HelpCenterPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HelpCenterPage />)
    }).not.toThrow()
  })
})
