import { render } from '@redwoodjs/testing/web'

import SizeGuidePage from './SizeGuidePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SizeGuidePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SizeGuidePage />)
    }).not.toThrow()
  })
})
