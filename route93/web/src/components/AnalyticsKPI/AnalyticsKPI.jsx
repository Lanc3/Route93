import { useState } from 'react'

const AnalyticsKpi = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon, 
  format = 'number', // 'number', 'currency', 'percentage', 'custom'
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
      }).format(val)
    } else if (format === 'percentage') {
      return `${val.toFixed(1)}%`
    } else if (format === 'custom') {
      return `${prefix}${val}${suffix}`
    }
    return val.toLocaleString()
  }

  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return '↗️'
    } else if (changeType === 'negative') {
      return '↘️'
    }
    return '→'
  }

  const getChangeColor = () => {
    if (changeType === 'positive') {
      return 'text-green-600 bg-green-100'
    } else if (changeType === 'negative') {
      return 'text-red-600 bg-red-100'
    }
    return 'text-gray-600 bg-gray-100'
  }

  const getIconColor = () => {
    if (changeType === 'positive') {
      return 'bg-green-500'
    } else if (changeType === 'negative') {
      return 'bg-red-500'
    }
    return 'bg-blue-500'
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 rounded-lg ${getIconColor()} flex items-center justify-center text-white text-lg`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {change !== undefined && (
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
                  <span className="mr-1">{getChangeIcon()}</span>
                  {change > 0 ? '+' : ''}{change}%
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-3xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
          </div>
        </div>
        
        {/* Animated indicator */}
        <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <div className={`w-16 h-16 rounded-full ${getIconColor()} bg-opacity-10 flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsKpi
