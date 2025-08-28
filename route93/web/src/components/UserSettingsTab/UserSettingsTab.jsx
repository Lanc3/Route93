import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'
import { toast } from '@redwoodjs/web/toast'

const UPDATE_CURRENT_USER_MUTATION = gql`
  mutation UpdateCurrentUserMutation($input: UpdateCurrentUserInput!) {
    updateCurrentUser(input: $input) {
      id
      name
      phone
      email
    }
  }
`

const UserSettingsTab = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [isEditing, setIsEditing] = useState(false)

  const [updateCurrentUser, { loading }] = useMutation(
    UPDATE_CURRENT_USER_MUTATION,
    {
      onCompleted: () => {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await updateCurrentUser({
        variables: {
          input: formData
        }
      })
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    })
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">👤</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No user data available</h3>
        <p className="text-gray-500">Please log in to view your profile settings.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
        <p className="text-sm text-gray-500">Manage your account information and preferences</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email address cannot be changed. Contact support if you need to update it.
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md ${
                isEditing
                  ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 border rounded-md ${
                isEditing
                  ? 'border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              }`}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Account Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Member since:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 text-gray-900 capitalize">{user.role}</span>
              </div>
              <div>
                <span className="text-gray-500">Total orders:</span>
                <span className="ml-2 text-gray-900">{user._count?.orders || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Total reviews:</span>
                <span className="ml-2 text-gray-900">{user._count?.reviews || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserSettingsTab
