import { MetaTags } from '@redwoodjs/web'
import DashboardAnalyticsCell from 'src/components/DashboardAnalyticsCell/DashboardAnalyticsCell'

const AdminDashboardPage = () => {
  return (
    <>
      <MetaTags title="Admin Dashboard" description="Route93 Admin Dashboard" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive overview of your business performance and analytics
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardAnalyticsCell />
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage
