import AnalyticsKpi from 'src/components/AnalyticsKPI/AnalyticsKPI'

const AnalyticsMetricsGrid = ({ metrics = [], className = '' }) => {
  const defaultMetrics = [
    {
      title: 'Total Revenue',
      value: 0,
      change: 0,
      changeType: 'neutral',
      icon: '💰',
      format: 'currency'
    },
    {
      title: 'Total Orders',
      value: 0,
      change: 0,
      changeType: 'neutral',
      icon: '📦',
      format: 'number'
    },
    {
      title: 'Average Order Value',
      value: 0,
      change: 0,
      changeType: 'neutral',
      icon: '📊',
      format: 'currency'
    },
    {
      title: 'Total Customers',
      value: 0,
      change: 0,
      changeType: 'neutral',
      icon: '👥',
      format: 'number'
    }
  ]

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {displayMetrics.map((metric, index) => (
        <AnalyticsKpi
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          changeType={metric.changeType}
          icon={metric.icon}
          format={metric.format}
          prefix={metric.prefix}
          suffix={metric.suffix}
        />
      ))}
    </div>
  )
}

export default AnalyticsMetricsGrid
