// European countries with their ISO codes
export const EUROPEAN_COUNTRIES = [
  { code: 'IE', name: 'Ireland', isEU: true },
  { code: 'AT', name: 'Austria', isEU: true },
  { code: 'BE', name: 'Belgium', isEU: true },
  { code: 'BG', name: 'Bulgaria', isEU: true },
  { code: 'HR', name: 'Croatia', isEU: true },
  { code: 'CY', name: 'Cyprus', isEU: true },
  { code: 'CZ', name: 'Czech Republic', isEU: true },
  { code: 'DK', name: 'Denmark', isEU: true },
  { code: 'EE', name: 'Estonia', isEU: true },
  { code: 'FI', name: 'Finland', isEU: true },
  { code: 'FR', name: 'France', isEU: true },
  { code: 'DE', name: 'Germany', isEU: true },
  { code: 'GR', name: 'Greece', isEU: true },
  { code: 'HU', name: 'Hungary', isEU: true },
  { code: 'IT', name: 'Italy', isEU: true },
  { code: 'LV', name: 'Latvia', isEU: true },
  { code: 'LT', name: 'Lithuania', isEU: true },
  { code: 'LU', name: 'Luxembourg', isEU: true },
  { code: 'MT', name: 'Malta', isEU: true },
  { code: 'NL', name: 'Netherlands', isEU: true },
  { code: 'PL', name: 'Poland', isEU: true },
  { code: 'PT', name: 'Portugal', isEU: true },
  { code: 'RO', name: 'Romania', isEU: true },
  { code: 'SK', name: 'Slovakia', isEU: true },
  { code: 'SI', name: 'Slovenia', isEU: true },
  { code: 'ES', name: 'Spain', isEU: true },
  { code: 'SE', name: 'Sweden', isEU: true },
]

// Non-EU European countries
export const NON_EU_EUROPEAN_COUNTRIES = [
  { code: 'AL', name: 'Albania', isEU: false },
  { code: 'AD', name: 'Andorra', isEU: false },
  { code: 'AM', name: 'Armenia', isEU: false },
  { code: 'AZ', name: 'Azerbaijan', isEU: false },
  { code: 'BY', name: 'Belarus', isEU: false },
  { code: 'BA', name: 'Bosnia and Herzegovina', isEU: false },
  { code: 'GE', name: 'Georgia', isEU: false },
  { code: 'IS', name: 'Iceland', isEU: false },
  { code: 'KZ', name: 'Kazakhstan', isEU: false },
  { code: 'XK', name: 'Kosovo', isEU: false },
  { code: 'LI', name: 'Liechtenstein', isEU: false },
  { code: 'MD', name: 'Moldova', isEU: false },
  { code: 'MC', name: 'Monaco', isEU: false },
  { code: 'ME', name: 'Montenegro', isEU: false },
  { code: 'MK', name: 'North Macedonia', isEU: false },
  { code: 'NO', name: 'Norway', isEU: false },
  { code: 'RU', name: 'Russia', isEU: false },
  { code: 'SM', name: 'San Marino', isEU: false },
  { code: 'RS', name: 'Serbia', isEU: false },
  { code: 'CH', name: 'Switzerland', isEU: false },
  { code: 'TR', name: 'Turkey', isEU: false },
  { code: 'UA', name: 'Ukraine', isEU: false },
  { code: 'GB', name: 'United Kingdom', isEU: false },
  { code: 'VA', name: 'Vatican City', isEU: false },
]

// Common non-European countries for international shipping
export const OTHER_COUNTRIES = [
  { code: 'US', name: 'United States', isEU: false },
  { code: 'CA', name: 'Canada', isEU: false },
  { code: 'AU', name: 'Australia', isEU: false },
  { code: 'NZ', name: 'New Zealand', isEU: false },
  { code: 'JP', name: 'Japan', isEU: false },
  { code: 'CN', name: 'China', isEU: false },
  { code: 'IN', name: 'India', isEU: false },
  { code: 'BR', name: 'Brazil', isEU: false },
  { code: 'MX', name: 'Mexico', isEU: false },
  { code: 'ZA', name: 'South Africa', isEU: false },
]

// All countries combined and sorted
export const ALL_COUNTRIES = [
  ...EUROPEAN_COUNTRIES,
  ...NON_EU_EUROPEAN_COUNTRIES,
  ...OTHER_COUNTRIES
].sort((a, b) => {
  // Ireland first, then alphabetical
  if (a.code === 'IE') return -1
  if (b.code === 'IE') return 1
  return a.name.localeCompare(b.name)
})

// Helper function to check if a country is in the EU
export const isEUCountry = (countryCode) => {
  return EUROPEAN_COUNTRIES.some(country => country.code === countryCode)
}

// Helper function to get country name by code
export const getCountryName = (countryCode) => {
  const country = ALL_COUNTRIES.find(c => c.code === countryCode)
  return country ? country.name : countryCode
}
