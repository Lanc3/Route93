import { render } from '@redwoodjs/testing/web'

import TermsOfServicePage from './TermsOfServicePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TermsOfServicePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TermsOfServicePage />)
    }).not.toThrow()
  })
})
