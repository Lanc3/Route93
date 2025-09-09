// Irish VAT rates
export const VAT_RATES = {
  STANDARD: 23.0,      // Most goods and services
  REDUCED: 13.5,       // Fuel, electricity, newspapers, construction
  SECOND_REDUCED: 9.0, // Hospitality, tourism, hairdressing
  ZERO: 0.0,          // Books, children's clothing, food, medical equipment
  EXEMPT: 0.0         // Financial services, insurance, education
}

// EU country codes for VAT purposes
export const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 
  'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 
  'SE', 'SI', 'SK'
]

// Import the country utilities
import { isEUCountry as isEUCountryFromList } from './countries'

/**
 * Format price in Euro currency
 * @param {number} price - Price to format
 * @param {string} locale - Locale for formatting (default: 'en-IE')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  }).format(price || 0)
}

/**
 * Determine customer type based on country and VAT number
 * @param {string} country - Customer country code
 * @param {string} vatNumber - Customer VAT number (optional)
 * @returns {string} Customer type
 */
export const determineCustomerType = (country, vatNumber = null) => {
  if (country === 'IE') {
    return vatNumber ? 'B2B_IE' : 'B2C'
  }
  
  if (isEUCountryFromList(country)) {
    return vatNumber ? 'B2B_EU' : 'B2B_EU' // EU B2C is treated as B2B for VAT purposes
  }
  
  return 'B2B_NON_EU'
}

/**
 * Get VAT rate for a product based on its category
 * @param {object} product - Product object with category
 * @returns {number} VAT rate as percentage
 */
export const getVatRateForProduct = (product) => {
  return product?.category?.vatRate || VAT_RATES.STANDARD
}

/**
 * Calculate VAT for a price based on customer type and VAT rate
 * @param {number} price - Net price (excluding VAT)
 * @param {number} vatRate - VAT rate as percentage
 * @param {string} customerType - Customer type
 * @returns {object} VAT calculation result
 */
export const calculateVat = (price, vatRate, customerType) => {
  // For EU B2B with valid VAT number, apply reverse charge (0% VAT)
  if (customerType === 'B2B_EU') {
    return {
      netPrice: price,
      vatAmount: 0,
      grossPrice: price,
      vatRate: 0,
      reverseCharge: true
    }
  }
  
  // For non-EU, no VAT
  if (customerType === 'B2B_NON_EU') {
    return {
      netPrice: price,
      vatAmount: 0,
      grossPrice: price,
      vatRate: 0,
      reverseCharge: false
    }
  }
  
  // Calculate VAT for Irish customers (B2C and B2B_IE)
  const vatAmount = (price * vatRate) / 100
  const grossPrice = price + vatAmount
  
  return {
    netPrice: price,
    vatAmount,
    grossPrice,
    vatRate,
    reverseCharge: false
  }
}

/**
 * Calculate total VAT for cart items
 * @param {Array} items - Cart items array
 * @param {string} customerCountry - Customer country code
 * @param {string} customerVatNumber - Customer VAT number (optional)
 * @returns {object} Total VAT calculation
 */
export const calculateCartVat = (items, customerCountry = 'IE', customerVatNumber = null) => {
  const customerType = determineCustomerType(customerCountry, customerVatNumber)
  
  let totalNetPrice = 0
  let totalVatAmount = 0
  let totalGrossPrice = 0
  let vatBreakdown = {
    standard: { netPrice: 0, vatAmount: 0, grossPrice: 0 },
    reduced: { netPrice: 0, vatAmount: 0, grossPrice: 0 },
    secondReduced: { netPrice: 0, vatAmount: 0, grossPrice: 0 },
    zero: { netPrice: 0, vatAmount: 0, grossPrice: 0 }
  }
  
  items.forEach(item => {
    const basePrice = (item.printableItem && typeof item.printableItem.price === 'number')
      ? item.printableItem.price
      : (item.product.salePrice || item.product.price)
    const itemTotal = (basePrice + (item.printFee || 0)) * item.quantity
    const vatRate = getVatRateForProduct(item.product)
    
    const vatCalc = calculateVat(itemTotal, vatRate, customerType)
    
    totalNetPrice += vatCalc.netPrice
    totalVatAmount += vatCalc.vatAmount
    totalGrossPrice += vatCalc.grossPrice
    
    // Categorize by VAT rate
    if (vatRate === VAT_RATES.STANDARD) {
      vatBreakdown.standard.netPrice += vatCalc.netPrice
      vatBreakdown.standard.vatAmount += vatCalc.vatAmount
      vatBreakdown.standard.grossPrice += vatCalc.grossPrice
    } else if (vatRate === VAT_RATES.REDUCED) {
      vatBreakdown.reduced.netPrice += vatCalc.netPrice
      vatBreakdown.reduced.vatAmount += vatCalc.vatAmount
      vatBreakdown.reduced.grossPrice += vatCalc.grossPrice
    } else if (vatRate === VAT_RATES.SECOND_REDUCED) {
      vatBreakdown.secondReduced.netPrice += vatCalc.netPrice
      vatBreakdown.secondReduced.vatAmount += vatCalc.vatAmount
      vatBreakdown.secondReduced.grossPrice += vatCalc.grossPrice
    } else {
      vatBreakdown.zero.netPrice += vatCalc.netPrice
      vatBreakdown.zero.vatAmount += vatCalc.vatAmount
      vatBreakdown.zero.grossPrice += vatCalc.grossPrice
    }
  })
  
  return {
    customerType,
    totalNetPrice,
    totalVatAmount,
    totalGrossPrice,
    vatBreakdown,
    reverseCharge: customerType === 'B2B_EU'
  }
}

/**
 * Calculate shipping VAT
 * @param {number} shippingCost - Shipping cost (net)
 * @param {string} customerType - Customer type
 * @returns {object} Shipping VAT calculation
 */
export const calculateShippingVat = (shippingCost, customerType) => {
  return calculateVat(shippingCost, VAT_RATES.STANDARD, customerType)
}
