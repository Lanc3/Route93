/**
 * Safely parse product images from various formats
 * @param {string|null} imagesData - The images field from the product
 * @returns {string[]} Array of image URLs
 */
export const parseProductImages = (imagesData) => {
  if (!imagesData) return []
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(imagesData)
    if (Array.isArray(parsed)) {
      return parsed.filter(img => typeof img === 'string' && img.trim())
    }
    // If parsed but not an array, convert to array
    if (typeof parsed === 'string' && parsed.trim()) {
      return [parsed.trim()]
    }
    return []
  } catch (error) {
    // If JSON parsing fails, handle as different formats
    if (typeof imagesData === 'string') {
      const trimmed = imagesData.trim()
      if (!trimmed) return []
      
      // Check if it's a comma-separated list
      if (trimmed.includes(',')) {
        return trimmed.split(',').map(img => img.trim()).filter(Boolean)
      }
      
      // Single URL
      return [trimmed]
    }
    
    return []
  }
}

/**
 * Get the primary image URL from a product
 * @param {object} product - Product object with images field
 * @param {string} fallbackUrl - Fallback image URL if no images found
 * @returns {string} Primary image URL
 */
export const getPrimaryProductImage = (product, fallbackUrl = 'https://via.placeholder.com/400x400?text=No+Image') => {
  const images = parseProductImages(product?.images)
  return images.length > 0 ? images[0] : fallbackUrl
}

/**
 * Safely parse product tags from various formats
 * @param {string|null} tagsData - The tags field from the product
 * @returns {string[]} Array of tag strings
 */
export const parseProductTags = (tagsData) => {
  if (!tagsData) return []
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(tagsData)
    if (Array.isArray(parsed)) {
      return parsed.filter(tag => typeof tag === 'string' && tag.trim())
    }
    // If parsed but not an array, convert to array
    if (typeof parsed === 'string' && parsed.trim()) {
      return [parsed.trim()]
    }
    return []
  } catch (error) {
    // If JSON parsing fails, handle as comma-separated string
    if (typeof tagsData === 'string') {
      const trimmed = tagsData.trim()
      if (!trimmed) return []
      
      return trimmed.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    
    return []
  }
}
