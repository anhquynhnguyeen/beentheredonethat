/**
 * CityCard.jsx
 * Compact card linking to a city page.
 */

import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { getPlacesByCity, getCountryById } from '../utils/dataLoader'

export default function CityCard({ city }) {
  const places  = getPlacesByCity(city.id)
  const country = getCountryById(city.countryId)

  return (
    <Link
      to={`/cities/${city.id}`}
      className="card block p-5 no-underline group fade-in"
    >
      <div className="mb-3">
        {country && (
          <p className="eyebrow">{country.name}</p>
        )}
        <h3 className="font-serif text-xl text-ink-900 group-hover:text-accent transition-colors">
          {city.name}
        </h3>
      </div>

      {city.notes && (
        <p className="text-sm text-ink-500 leading-relaxed line-clamp-2 mb-3">
          {city.notes}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-400 font-sans">
          {places.length} {places.length === 1 ? 'place' : 'places'}
        </span>
        {city.firstVisited && (
          <span className="text-xs text-ink-400 font-sans">
            {formatDate(city.firstVisited, 'short')}
          </span>
        )}
      </div>

      {city.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {city.tags.slice(0, 4).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
