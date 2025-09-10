import { useEffect, useRef } from 'react'

const AddressAutocomplete = ({ value, onAddressSelected, onChange }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['address_components', 'formatted_address']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      const components = place.address_components || []
      const get = (type) => components.find(c => c.types.includes(type))?.long_name || ''
      const addr = {
        address1: `${get('street_number')} ${get('route')}`.trim(),
        city: get('locality') || get('postal_town') || '',
        state: get('administrative_area_level_1') || '',
        zipCode: get('postal_code') || '',
        country: components.find(c => c.types.includes('country'))?.short_name || 'IE'
      }
      onAddressSelected && onAddressSelected(addr)
    })
  }, [onAddressSelected])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      required
      placeholder="Start typing your address"
    />
  )
}

export default AddressAutocomplete


