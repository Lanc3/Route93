import fetch from 'node-fetch'

// An Post API Configuration
const ANPOST_API_BASE = 'https://api.anpost.ie'
const ANPOST_TRACKING_BASE = 'https://www.anpost.com'

// Environment variables
const API_KEY = process.env.ANPOST_API_KEY
const CLIENT_ID = process.env.ANPOST_CLIENT_ID
const CLIENT_SECRET = process.env.ANPOST_CLIENT_SECRET

/**
 * Get authentication token from An Post API
 */
const getAuthToken = async () => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('An Post API credentials not configured')
  }

  try {
    const response = await fetch(`${ANPOST_API_BASE}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'tracking'
      })
    })

    if (!response.ok) {
      throw new Error(`An Post auth failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('An Post authentication error:', error)
    throw new Error('Failed to authenticate with An Post API')
  }
}

/**
 * Track a package using An Post tracking number
 * @param {string} trackingNumber - The An Post tracking number
 * @returns {Object} Tracking information
 */
export const trackPackage = async (trackingNumber) => {
  if (!trackingNumber) {
    throw new Error('Tracking number is required')
  }

  try {
    // An Post provides a public tracking API that doesn't require authentication
    const response = await fetch(`${ANPOST_TRACKING_BASE}/track/${trackingNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Route93-Shipping/1.0'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Package not found',
          trackingNumber,
          events: []
        }
      }
      throw new Error(`An Post API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      trackingNumber,
      status: data.status || 'Unknown',
      carrier: 'An Post',
      estimatedDelivery: data.estimatedDelivery,
      events: parseTrackingEvents(data.events || []),
      rawData: data
    }
  } catch (error) {
    console.error('An Post tracking error:', error)
    throw new Error(`Failed to track package: ${error.message}`)
  }
}

/**
 * Create a shipment with An Post (requires API key)
 * @param {Object} shipmentData - Shipment information
 * @returns {Object} Shipment creation result
 */
export const createShipment = async (shipmentData) => {
  if (!API_KEY) {
    throw new Error('An Post API key not configured')
  }

  const token = await getAuthToken()

  try {
    const response = await fetch(`${ANPOST_API_BASE}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        service: 'registered-post',
        sender: {
          name: 'Route93',
          address: {
            line1: '123 Business Street',
            city: 'Dublin',
            postalCode: 'D01 AB12',
            country: 'IE'
          }
        },
        recipient: {
          name: shipmentData.recipientName,
          address: {
            line1: shipmentData.address1,
            line2: shipmentData.address2,
            city: shipmentData.city,
            postalCode: shipmentData.zipCode,
            country: shipmentData.country || 'IE'
          }
        },
        parcels: [{
          weight: shipmentData.weight || 1000, // grams
          dimensions: {
            length: shipmentData.length || 30,
            width: shipmentData.width || 20,
            height: shipmentData.height || 10
          }
        }],
        reference: shipmentData.orderNumber
      })
    })

    if (!response.ok) {
      throw new Error(`An Post shipment creation failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      success: true,
      trackingNumber: data.trackingNumber,
      shipmentId: data.shipmentId,
      labelUrl: data.labelUrl,
      estimatedDelivery: data.estimatedDelivery,
      rawData: data
    }
  } catch (error) {
    console.error('An Post shipment creation error:', error)
    throw new Error(`Failed to create shipment: ${error.message}`)
  }
}

/**
 * Generate a tracking number format compatible with An Post
 * @param {string} orderId - Order ID to base tracking number on
 * @returns {string} Formatted tracking number
 */
export const generateTrackingNumber = (orderId) => {
  // An Post tracking numbers typically follow formats like:
  // EI123456789IE or similar patterns
  const timestamp = Date.now().toString().slice(-6)
  const orderSuffix = orderId.toString().padStart(4, '0').slice(-4)
  return `EI${timestamp}${orderSuffix}IE`
}

/**
 * Parse tracking events from An Post API response
 * @param {Array} events - Raw events from API
 * @returns {Array} Parsed tracking events
 */
const parseTrackingEvents = (events) => {
  return events.map(event => ({
    date: new Date(event.timestamp || event.date),
    status: event.status || event.description,
    location: event.location || event.facility,
    description: event.description || event.status,
    rawEvent: event
  })).sort((a, b) => b.date - a.date) // Most recent first
}

/**
 * Get shipment label URL
 * @param {string} trackingNumber - Tracking number
 * @returns {string} Label URL
 */
export const getLabelUrl = async (trackingNumber) => {
  if (!API_KEY) {
    throw new Error('An Post API key not configured')
  }

  const token = await getAuthToken()

  try {
    const response = await fetch(`${ANPOST_API_BASE}/shipments/${trackingNumber}/label`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get label: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.labelUrl
  } catch (error) {
    console.error('An Post label retrieval error:', error)
    throw new Error(`Failed to get shipping label: ${error.message}`)
  }
}

/**
 * Cancel a shipment (if supported by An Post API)
 * @param {string} trackingNumber - Tracking number to cancel
 * @returns {Object} Cancellation result
 */
export const cancelShipment = async (trackingNumber) => {
  if (!API_KEY) {
    throw new Error('An Post API key not configured')
  }

  const token = await getAuthToken()

  try {
    const response = await fetch(`${ANPOST_API_BASE}/shipments/${trackingNumber}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to cancel shipment: ${response.status} ${response.statusText}`)
    }

    return {
      success: true,
      message: 'Shipment cancelled successfully'
    }
  } catch (error) {
    console.error('An Post cancellation error:', error)
    throw new Error(`Failed to cancel shipment: ${error.message}`)
  }
}

/**
 * Validate tracking number format
 * @param {string} trackingNumber - Tracking number to validate
 * @returns {boolean} Is valid format
 */
export const validateTrackingNumber = (trackingNumber) => {
  // An Post tracking numbers typically start with country code like EI, GB, etc.
  const anpostRegex = /^[A-Z]{2}\d{9,}[A-Z]{2}$/
  return anpostRegex.test(trackingNumber)
}

/**
 * Get service availability for a postal code
 * @param {string} postalCode - Postal code to check
 * @param {string} country - Country code (default: IE)
 * @returns {Object} Service availability
 */
export const getServiceAvailability = async (postalCode, country = 'IE') => {
  try {
    const response = await fetch(`${ANPOST_API_BASE}/service-availability?postalCode=${postalCode}&country=${country}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Service availability check failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      available: data.available,
      services: data.services || [],
      estimatedDelivery: data.estimatedDelivery,
      restrictions: data.restrictions || []
    }
  } catch (error) {
    console.error('An Post service availability error:', error)
    // Return default availability if API fails
    return {
      available: true,
      services: ['registered-post'],
      estimatedDelivery: null,
      restrictions: []
    }
  }
}

