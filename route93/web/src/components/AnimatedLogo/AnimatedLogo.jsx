import { Link, routes } from '@redwoodjs/router'

const AnimatedLogo = ({ className = "", size = "default" }) => {
  // Size variants for different contexts
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12",
    xlarge: "w-16 h-16"
  }

  return (
    <div className={`logo-container flex-shrink-0 ${className}`}>
      <Link to={routes.home()} className="flex items-center group">
        <div className="relative">
          <img 
            src="/images/logo.png" 
            alt="Route93 Logo" 
            className={`logo-image ${sizeClasses[size]} object-contain transition-transform duration-300 ease-in-out animate-bop group-hover:scale-105`}
          />
          {/* Optional: Add a subtle glow effect on hover */}
          <div className="absolute inset-0 bg-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
        </div>
        
        {/* Logo text - only show on larger screens to save space */}
        <span className="ml-3 text-xl font-bold text-purple-600 hidden sm:block group-hover:text-purple-700 transition-colors duration-300">
          Route93
        </span>
      </Link>
    </div>
  )
}

export default AnimatedLogo
