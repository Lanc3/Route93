import AnalyticsChart from 'src/components/AnalyticsChart/AnalyticsChart'

const AnalyticsChartGrid = ({ charts = [], className = '' }) => {
  const defaultCharts = [
    {
      title: 'Revenue Trend',
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12000, 19000, 15000, 25000, 22000, 30000],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          }
        ]
      },
      height: 300
    },
    {
      title: 'Orders by Category',
      type: 'doughnut',
      data: {
        labels: ['Electronics', 'Clothing', 'Books', 'Home'],
        datasets: [
          {
            data: [300, 150, 100, 200],
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444'
            ]
          }
        ]
      },
      height: 300
    }
  ]

  const displayCharts = charts.length > 0 ? charts : defaultCharts

  return (
    <div className={`space-y-6 ${className}`}>
      {displayCharts.map((chart, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{chart.title}</h3>
          <AnalyticsChart
            type={chart.type}
            data={chart.data}
            options={chart.options}
            height={chart.height}
          />
        </div>
      ))}
    </div>
  )
}

export default AnalyticsChartGrid
