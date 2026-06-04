/**
 * CitiesPage.jsx
 * Grid of all visited cities, grouped by country.
 */

import { getCities, getCountries } from '../utils/dataLoader'
import CityCard from '../components/CityCard'

export default function CitiesPage() {
  const cities    = getCities()
  const countries = getCountries()

  // Group cities by countryId
  const grouped = countries
    .map(country => ({
      country,
      cities: cities.filter(c => c.countryId === country.id),
    }))
    .filter(g => g.cities.length > 0)

  return (
    <div className="page-container py-12 fade-in">
      <p className="eyebrow">Archive</p>
      <h1 className="mb-2">Cities</h1>
      <p className="text-ink-500 mb-10">
        {cities.length} {cities.length === 1 ? 'city' : 'cities'} across {grouped.length} {grouped.length === 1 ? 'country' : 'countries'}.
      </p>

      <div className="flex flex-col gap-12">
        {grouped.map(({ country, cities: countryCities }) => (
          <section key={country.id}>
            <div className="flex items-baseline gap-3 mb-5">
              <h2 className="font-serif text-xl text-ink-800">{country.name}</h2>
              <span className="text-xs text-ink-400 font-sans">
                {countryCities.length} {countryCities.length === 1 ? 'city' : 'cities'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {countryCities.map(city => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="border border-dashed border-parchment-300 rounded-sm p-16 text-center">
          <p className="text-ink-400 text-sm">No cities added yet.</p>
        </div>
      )}
    </div>
  )
}
