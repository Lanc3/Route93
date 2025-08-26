import { Metadata } from '@redwoodjs/web'
import UserDetailsCell from 'src/components/UserDetailsCell/UserDetailsCell'

const AdminUserDetailsPage = ({ id }) => {
  return (
    <>
      <Metadata title="User Details - Admin" description="View detailed user information and activity" />

      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                <p className="text-gray-600 mt-1">View and manage user information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserDetailsCell id={parseInt(id)} />
        </div>
      </div>
    </>
  )
}

export default AdminUserDetailsPage