export const QUERY = gql`
  query AdminDesignsQuery(
    $search: String
    $status: String
    $limit: Int
    $offset: Int
  ) {
    designs(search: $search, status: $status, limit: $limit, offset: $offset) {
      id
      name
      description
      imageUrl
      publicId
      status
      createdAt
      updatedAt
    }
  }
`

export const Loading = () => (
  <div className="bg-white rounded-lg shadow-sm border p-8">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
)

export const Empty = () => (
  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No designs found</h3>
    <p className="text-gray-500 mb-6">Get started by uploading your first design image.</p>
  </div>
)

export const Failure = ({ error }) => (
  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
    <div className="w-24 h-24 mx-auto mb-4 text-red-300">
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading designs</h3>
    <p className="text-red-600 mb-4">{error?.message}</p>
    <button
      onClick={() => window.location.reload()}
      className="btn-primary"
    >
      Try Again
    </button>
  </div>
)

export const Success = ({ designs }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Design
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {designs.map((design) => (
              <tr key={design.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={design.imageUrl}
                        alt={design.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMxNy4yNSAyNSAxNSAyMi43NSAxNSAyMEMxNSAxNy4yNSAxNy4yNSAxNSAyMCAxNUMyMi43NSAxNSAyNSAxNy4yNSAyNSAyMEMyNSAyMi43NSAyMi43NSAyNSAyMCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{design.name}</div>
                      <div className="text-sm text-gray-500">{design.publicId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {design.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    design.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {design.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(design.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={`/admin/designs/${design.id}/edit`}
                    className="text-purple-600 hover:text-purple-900 mr-4"
                  >
                    Edit
                  </a>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this design?')) {
                        // TODO: Implement delete functionality
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
