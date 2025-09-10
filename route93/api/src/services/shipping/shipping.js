export const shippingEstimate = async ({ country, method }) => {
  const base = method === 'overnight' ? { min: 1, max: 1 } : method === 'express' ? { min: 2, max: 3 } : { min: 5, max: 7 }
  const isIE = (country || 'IE') === 'IE'
  const extra = isIE ? 0 : 3
  const minDays = base.min + extra
  const maxDays = base.max + extra
  return {
    minDays,
    maxDays,
    commitment: `${minDays}-${maxDays} business days`
  }
}


