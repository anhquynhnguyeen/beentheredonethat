/**
 * CountriesPage.jsx
 * Grid of all visited countries.
 */

import { getCountries } from '../utils/dataLoader'
import CountryCard from '../components/CountryCard'

export default function CountriesPage() {
  const countries = getCountries()

  return (
    <div className="page-container py-12 fade-in">
      <p className="eyebrow">Archive</p>
      <h1 className="mb-2">Countries</h1>
      <p className="text-ink-500 mb-10">
        {countries.length} {countries.length === 1 ? 'country' : 'countries'} visited.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map(country => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>

      {countries.length === 0 && (
        <div className="border border-dashed border-parchment-300 rounded-sm p-16 text-center">
          <p className="text-ink-400 text-sm">No countries added yet. Use Admin to add your first entry.</p>
        </div>
      )}
    </div>
  )
}
