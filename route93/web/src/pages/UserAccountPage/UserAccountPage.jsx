import { MetaTags } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import { navigate, routes, Link } from '@redwoodjs/router'
import { useEffect } from 'react'
import UserProfileCell from 'src/components/UserProfileCell'
import AccountSettingsTabs from 'src/components/AccountSettingsTabs'

const UserAccountPage = () => {
  const { isAuthenticated, currentUser } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(routes.login())
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading user data...</h3>
            <p className="text-gray-500">Please wait while we load your account information.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <MetaTags title="Account Settings" description="Manage your account settings and view order history" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-2 text-gray-600">
                  Manage your profile, view order history, and track current orders
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.trackOrder()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Track Order
                </Link>
              </div>
            </div>
          </div>

          {/* User Profile Data */}
          <UserProfileCell />
        </div>
      </div>
    </>
  )
}

export default UserAccountPage
