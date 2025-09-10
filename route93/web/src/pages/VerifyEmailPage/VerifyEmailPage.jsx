import { useEffect } from 'react'
import { Metadata, useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'

const VERIFY = gql`
  mutation VerifyEmail($token: String!) { verifyEmail(token: $token) }
`

const VerifyEmailPage = () => {
  const [verify] = useMutation(VERIFY)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      verify({ variables: { token } }).then(({ data }) => {
        if (data?.verifyEmail) {
          navigate(routes.login(), { replace: true })
        }
      })
    }
  }, [verify])

  return (
    <>
      <Metadata title="Verify Email - Route93" />
      <div className="max-w-lg mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">Verifying your email…</h1>
        <p className="text-gray-600">If you are not redirected, please return to the login page.</p>
      </div>
    </>
  )
}

export default VerifyEmailPage


