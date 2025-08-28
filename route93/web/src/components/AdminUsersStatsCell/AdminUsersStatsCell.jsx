import { gql } from '@apollo/client'

export const QUERY = gql`
  query AdminUsersStatsQuery {
    adminStats {
      usersCount
      clientsCount
      adminsCount
      activeTodayCount
    }
  }
`

export const Loading = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="ml-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

export const Empty = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">📊</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No user statistics available</h3>
    <p className="text-gray-500 mb-4">User statistics will appear here once data is available.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="text-red-800">
      <h3 className="font-semibold">Error loading user statistics</h3>
      <p className="text-sm mt-1">{error?.message}</p>
    </div>
  </div>
)

export const Success = ({ adminStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.146-1.283-.423-1.848M13 16H7m6 0H9m10 0a3 3 0 01-3-3V8a3 3 0 013-3h1a3 3 0 013 3v5a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-lg font-semibold text-gray-900">{adminStats.usersCount}</p>
          </div>
        </div>
      </div>

      {/* Clients */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Clients</p>
            <p className="text-lg font-semibold text-gray-900">{adminStats.clientsCount}</p>
          </div>
        </div>
      </div>

      {/* Admins */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Admins</p>
            <p className="text-lg font-semibold text-gray-900">{adminStats.adminsCount}</p>
          </div>
        </div>
      </div>

      {/* Active Today */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">Active Today</p>
            <p className="text-lg font-semibold text-gray-900">{adminStats.activeTodayCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
