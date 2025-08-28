import { render } from '@redwoodjs/testing/web'

import CreateReviewForm from './CreateReviewForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CreateReviewForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateReviewForm />)
    }).not.toThrow()
  })
})
