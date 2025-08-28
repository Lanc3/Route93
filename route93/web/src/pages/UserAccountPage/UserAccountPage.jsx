import { MetaTags } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import { navigate, routes } from '@redwoodjs/router'
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
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your profile, view order history, and track current orders
            </p>
          </div>

          {/* User Profile Data */}
          <UserProfileCell />
        </div>
      </div>
    </>
  )
}

export default UserAccountPage
