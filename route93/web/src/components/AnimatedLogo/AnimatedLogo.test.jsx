import { render } from '@redwoodjs/testing/web'

import AnimatedLogo from './AnimatedLogo'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AnimatedLogo', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AnimatedLogo />)
    }).not.toThrow()
  })
})
