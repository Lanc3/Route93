import { Link, routes, navigate } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useAuth } from 'src/auth'
import AdminStatsCell from 'src/components/AdminStatsCell'
import AdminOrderManagementStatsCell from 'src/components/AdminOrderManagementStatsCell/AdminOrderManagementStatsCell'

const AdminPage = () => {
  const { currentUser, loading, logOut } = useAuth()

  const handleLogout = async () => {
    await logOut()
    navigate(routes.home())
  }



  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Metadata title="Admin Dashboard - Route93" description="Route93 admin dashboard for managing products, orders, and users" />

      <div className="bg-gray-50 min-h-screen">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to={routes.home()}
                  className="btn-outline"
                >
                  View Store
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-primary"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <AdminStatsCell />

          {/* Management Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Enhanced Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">Interactive analytics with beautiful charts and KPIs</p>
              <div className="space-y-2">
                <Link to={routes.adminDashboard()} className="w-full btn-primary text-center block">
                  View Dashboard
                </Link>
                <Link to={routes.adminAnalytics()} className="w-full btn-outline text-left block">Legacy Analytics</Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Product Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage products, categories, and inventory</p>
              <div className="space-y-2">
                <Link to={routes.adminProducts()} className="w-full btn-primary text-center block">
                  Manage Products
                </Link>
                <Link to={routes.adminProductAdd()} className="w-full btn-outline text-left block">Add New Product</Link>
                <Link to={routes.adminCategories()} className="w-full btn-outline text-left block">Manage Categories</Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Inventory Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Monitor stock levels and inventory alerts</p>
              <div className="space-y-2">
                <Link to={routes.adminInventory()} className="w-full btn-primary text-center block">
                  Manage Inventory
                </Link>
                <button className="w-full btn-outline text-left">Low Stock Alerts</button>
                <button className="w-full btn-outline text-left">Stock Reports</button>
              </div>
            </div>

            <AdminOrderManagementStatsCell />

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">User Management</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage customer accounts and admin users</p>
              <div className="space-y-2">
                <Link to={routes.adminUsers()} className="w-full btn-primary text-center block">
                  Manage Users
                </Link>
                <button className="w-full btn-outline text-left">Admin Users</button>
                <button className="w-full btn-outline text-left">Customer Support</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Collections</h3>
              </div>
              <p className="text-gray-600 mb-4">Manage product collections and featured items</p>
              <div className="space-y-2">
                <Link to={routes.adminCollections()} className="w-full btn-primary text-center block">
                  Manage Collections
                </Link>
                <Link to={routes.adminCollectionAdd()} className="w-full btn-outline text-left block">Create Collection</Link>
                <button className="w-full btn-outline text-left">Featured Products</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Discount Codes</h3>
              </div>
              <p className="text-gray-600 mb-4">Create and manage discount codes and promotions</p>
              <div className="space-y-2">
                <Link to={routes.adminDiscountCodes()} className="w-full btn-primary text-center block">
                  Manage Discounts
                </Link>
                <Link to={routes.adminDiscountCodeAdd()} className="w-full btn-outline text-left block">Create Discount</Link>
                <Link to={routes.adminDiscountReports()} className="w-full btn-outline text-left block">Discount Reports</Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Analytics & Reports</h3>
              </div>
              <p className="text-gray-600 mb-4">View insights and performance metrics</p>
              <div className="space-y-2">
                <Link to={routes.adminAnalytics()} className="w-full btn-primary text-center block">
                  View Analytics
                </Link>
                <button className="w-full btn-outline text-left">Sales Reports</button>
                <button className="w-full btn-outline text-left">Customer Insights</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Settings</h3>
              </div>
              <p className="text-gray-600 mb-4">Configure store settings and preferences</p>
              <div className="space-y-2">
                <button className="w-full btn-outline text-left">Store Settings</button>
                <button className="w-full btn-outline text-left">Payment Settings</button>
                <button className="w-full btn-outline text-left">Shipping Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPage
