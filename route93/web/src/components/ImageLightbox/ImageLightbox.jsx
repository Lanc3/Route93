import { useEffect } from 'react'

const ImageLightbox = ({ isOpen, imageUrl, alt = 'Preview image', onClose }) => {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl">
          <button
            className="absolute top-3 right-3 z-10 rounded-full bg-black/60 text-white p-2 hover:bg-black/80"
            onClick={onClose}
            aria-label="Close image preview"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="h-[85vh] flex items-center justify-center bg-black">
            <img src={imageUrl} alt={alt} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageLightbox


