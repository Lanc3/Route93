import { useEffect, useRef } from 'react'

const ParallaxSeparator = ({ 
  variant = 'medium', 
  text, 
  showContent = false, 
  className = '' 
}) => {
  const separatorRef = useRef(null)
  const layerRefs = useRef([])

  useEffect(() => {
    const handleParallax = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.3

      layerRefs.current.forEach((ref, index) => {
        if (ref) {
          const speed = (index + 1) * 0.2
          const yPos = rate * speed
          ref.style.transform = `translateY(${yPos}px)`
        }
      })
    }

    handleParallax() // Initial call to set up parallax

    window.addEventListener('scroll', handleParallax)
    return () => window.removeEventListener('scroll', handleParallax)
  }, [])

  const addLayerRef = (el) => {
    if (el && !layerRefs.current.includes(el)) {
      layerRefs.current.push(el)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'thin':
        return 'separator-thin'
      case 'thick':
        return 'separator-thick'
      case 'with-content':
        return 'separator-with-content'
      default:
        return 'separator-medium'
    }
  }

  const renderContent = () => {
    if (!showContent) return null

    return (
      <div className="separator-content-grid">
        <div className="separator-content-item">
          <div className="separator-content-icon">🚚</div>
          <div className="separator-content-label">Free Shipping</div>
          <div className="separator-content-value">Over $50</div>
        </div>
        <div className="separator-content-item">
          <div className="separator-content-icon">⭐</div>
          <div className="separator-content-label">Premium Quality</div>
          <div className="separator-content-value">Guaranteed</div>
        </div>
        <div className="separator-content-item">
          <div className="separator-content-icon">🛡️</div>
          <div className="separator-content-label">Secure Shopping</div>
          <div className="separator-content-value">100% Safe</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={separatorRef}
      className={`parallax-separator ${getVariantClasses()} ${className}`}
    >
      {/* Parallax Background Layers */}
      <div 
        ref={addLayerRef}
        className="separator-layer separator-layer-1"
      />
      <div 
        ref={addLayerRef}
        className="separator-layer separator-layer-2"
      />
      <div 
        ref={addLayerRef}
        className="separator-layer separator-layer-3"
      />

      {/* Floating Geometric Elements */}
      <div className="separator-floating separator-floating-primary w-24 h-24 top-6 left-8"></div>
      <div className="separator-floating separator-floating-secondary w-20 h-20 bottom-6 right-8"></div>
      <div className="separator-floating separator-floating-accent w-16 h-16 top-1/2 left-1/4"></div>
      <div className="separator-floating separator-floating-primary w-28 h-28 top-1/3 right-1/4"></div>
      <div className="separator-floating separator-floating-secondary w-12 h-12 bottom-1/3 left-1/3"></div>

      {/* Content Layer */}
      <div className="separator-content">
        {text && (
          <div className="separator-text">
            {text}
          </div>
        )}
        {showContent && renderContent()}
      </div>
    </div>
  )
}

export default ParallaxSeparator
