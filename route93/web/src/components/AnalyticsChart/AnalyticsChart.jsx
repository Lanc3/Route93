import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const AnalyticsChart = ({ 
  type = 'line', // 'line', 'bar', 'doughnut'
  data, 
  options = {}, 
  height = 300,
  className = ''
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          color: '#6B7280',
          callback: function(value) {
            if (type === 'line' && data?.datasets?.[0]?.label?.includes('Revenue')) {
              return new Intl.NumberFormat('en-IE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0
              }).format(value)
            }
            return value
          }
        }
      }
    } : undefined,
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#3B82F6',
        borderColor: 'white',
        borderWidth: 2
      },
      line: {
        tension: 0.4,
        borderWidth: 3
      }
    }
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={mergedOptions} height={height} />
      case 'bar':
        return <Bar data={data} options={mergedOptions} height={height} />
      case 'doughnut':
        return <Doughnut data={data} options={mergedOptions} height={height} />
      default:
        return <Line data={data} options={mergedOptions} height={height} />
    }
  }

  if (!data) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div style={{ height: height }}>
        {renderChart()}
      </div>
    </div>
  )
}

export default AnalyticsChart
