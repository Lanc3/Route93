import { render } from '@redwoodjs/testing/web'

import AccountSettingsTabs from './AccountSettingsTabs'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AccountSettingsTabs', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AccountSettingsTabs />)
    }).not.toThrow()
  })
})
