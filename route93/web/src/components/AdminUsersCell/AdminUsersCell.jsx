import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { gql } from '@apollo/client'

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: Int!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      name
      email
      role
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const QUERY = gql`
  query AdminUsersQuery($limit: Int, $offset: Int, $search: String, $role: String, $sortBy: String, $sortOrder: String) {
    users(limit: $limit, offset: $offset, search: $search, role: $role, sortBy: $sortBy, sortOrder: $sortOrder) {
      id
      name
      email
      phone
      role
      createdAt
      updatedAt
      _count {
        orders
        addresses
        cartItems
        reviews
      }
    }
    usersCount: usersCount(search: $search, role: $role)
  }
`

export const Loading = () => (
  <div className="space-y-4">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const Empty = ({ search, role }) => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
      👥
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
    <p className="text-gray-500 mb-4">
      {search || role ? 
        `No users match the current filters` : 
        'No users have been registered yet.'
      }
    </p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading users</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ users, usersCount }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString()
  const formatDateTime = (date) => new Date(date).toLocaleString()

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: (data) => {
      toast.success(`User role updated to ${data.updateUserRole.role}`)
      window.location.reload()
    },
    onError: (error) => {
      toast.error('Error updating user role: ' + error.message)
    }
  })

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      toast.success('User deleted successfully!')
      window.location.reload()
    },
    onError: (error) => {
      toast.error('Error deleting user: ' + error.message)
    }
  })

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserRole({ variables: { id: userId, role: newRole } })
    }
  }

  const handleDelete = (user) => {
    if (user._count.orders > 0) {
      toast.error(`Cannot delete user "${user.name}" because they have ${user._count.orders} orders. Consider deactivating instead.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete "${user.name}"? This action cannot be undone.`)) {
      deleteUser({ variables: { id: user.id } })
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: 'bg-purple-100 text-purple-800',
      CLIENT: 'bg-blue-100 text-blue-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    )
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({usersCount})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(user.name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(user.role)}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="CLIENT">CLIENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                          {user._count.orders} orders
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                          {user._count.reviews} reviews
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                          {user._count.addresses} addresses
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                          {user._count.cartItems} cart items
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last active: {formatDateTime(user.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={routes.adminUserDetails({ id: user.id })}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="View user details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete user"
                        disabled={user._count.orders > 0}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}