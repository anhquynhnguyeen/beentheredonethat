/**
 * CountryCard.jsx
 * Compact card linking to a country page.
 */

import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { getCitiesByCountry } from '../utils/dataLoader'

export default function CountryCard({ country }) {
  const cities = getCitiesByCountry(country.id)

  return (
    <Link
      to={`/countries/${country.id}`}
      className="card block p-5 no-underline group fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="eyebrow">{country.continent}</p>
          <h3 className="font-serif text-xl text-ink-900 group-hover:text-accent transition-colors">
            {country.name}
          </h3>
        </div>
        <span className="text-2xs font-sans text-ink-400 mt-1">{country.code}</span>
      </div>

      {country.notes && (
        <p className="text-sm text-ink-500 leading-relaxed line-clamp-2 mb-3">
          {country.notes}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-400 font-sans">
          {cities.length} {cities.length === 1 ? 'city' : 'cities'}
        </span>
        {country.firstVisited && (
          <span className="text-xs text-ink-400 font-sans">
            {formatDate(country.firstVisited, 'short')}
          </span>
        )}
      </div>

      {country.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {country.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
