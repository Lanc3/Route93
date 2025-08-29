import { Link, routes } from '@redwoodjs/router'
import { useEffect, useRef } from 'react'

const EnhancedHero = () => {
  const heroRef = useRef(null)
  const parallaxRefs = useRef([])

  useEffect(() => {
    const handleParallax = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5
      
      parallaxRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = (index + 1) * 0.1
          const yPos = rate * speed
          ref.style.transform = `translateY(${yPos}px)`
        }
      })
    }

    // Add initial call to set up parallax
    handleParallax()
    
    window.addEventListener('scroll', handleParallax)
    return () => window.removeEventListener('scroll', handleParallax)
  }, [])

  const addParallaxRef = (el) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el)
    }
  }

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700"
    >
      {/* Parallax Background Layers */}
      <div className="absolute inset-0">
        {/* Layer 1: Floating Geometric Shapes */}
        <div 
          ref={addParallaxRef}
          className="parallax-layer parallax-layer-1"
        >
          {/* Large floating circle */}
          <div className="floating-element floating-circle w-96 h-96 top-20 left-10 animate-float">
            <div className="w-full h-full bg-gradient-to-br from-purple-400/20 to-green-400/20 rounded-full animate-pulse-glow"></div>
          </div>
          
          {/* Medium floating square */}
          <div className="floating-element floating-square w-64 h-64 top-40 right-20 animate-float delay-300">
            <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-purple-400/20 animate-rotate-slow"></div>
          </div>
          
          {/* Small floating circle */}
          <div className="floating-element floating-circle w-32 h-32 bottom-40 left-1/4 animate-float delay-500">
            <div className="w-full h-full bg-gradient-to-br from-purple-400/30 to-green-400/30 rounded-full animate-scale-bounce"></div>
          </div>
        </div>

        {/* Layer 2: Gradient Overlays */}
        <div 
          ref={addParallaxRef}
          className="parallax-layer parallax-layer-2"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/30 via-transparent to-green-600/30"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Layer 3: Particle Effects */}
        <div 
          ref={addParallaxRef}
          className="parallax-layer parallax-layer-3"
        >
          {/* Animated dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title with Staggered Animation */}
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white animate-fade-in-up">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300 animate-fade-in-up delay-200">
              Route93
            </span>
          </h1>
          
          {/* Subtitle with Animation */}
          <p className="hero-subtitle text-xl md:text-2xl lg:text-3xl mb-8 text-purple-100 animate-fade-in-up delay-300">
            Your premium destination for quality products and exceptional service
          </p>
          
          {/* Enhanced CTA Buttons with Staggered Animation */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-400">
            <Link 
              to={routes.products()} 
              className="btn-hero-primary group"
            >
              <span className="flex items-center justify-center">
                Shop Now
                <svg 
                  className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link 
              to={routes.collections()} 
              className="btn-hero-secondary group"
            >
              <span className="flex items-center justify-center">
                Browse Collections
                <svg 
                  className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </Link>
          </div>
          
          {/* Additional Features with Animation */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-600">
            {[
              { icon: '🚚', text: 'Free Shipping' },
              { icon: '⭐', text: 'Premium Quality' },
              { icon: '🛡️', text: 'Secure Shopping' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glassmorphism rounded-2xl p-4 text-white animate-fade-in-up"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold">{feature.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Wave SVG */}
      

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in-up delay-1000">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnhancedHero
