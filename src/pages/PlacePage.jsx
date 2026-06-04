/**
 * PlacePage.jsx
 * Detail page for a single place.
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import { getPlaceById, getCityById, getCountryById } from '../utils/dataLoader'
import PhotoGallery from '../components/PhotoGallery'
import { formatDate } from '../utils/helpers'

function Rating({ value }) {
  if (!value) return null
  return (
    <div className="flex gap-1.5 items-center">
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          className={`w-2 h-2 rounded-full ${n <= value ? 'bg-accent' : 'bg-parchment-300'}`}
        />
      ))}
      <span className="ml-1 text-xs text-ink-400 font-sans">{value}/5</span>
    </div>
  )
}

export default function PlacePage() {
  const { id } = useParams()
  const place   = getPlaceById(id)
  if (!place) return <Navigate to="/places" replace />

  const city    = getCityById(place.cityId)
  const country = getCountryById(place.countryId)

  return (
    <div className="fade-in">
      <section className="page-container pt-10 pb-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-400 font-sans mb-4 flex flex-wrap gap-2">
          {country && (
            <>
              <Link to={`/countries/${country.id}`} className="hover:text-ink-700 no-underline">{country.name}</Link>
              <span>/</span>
            </>
          )}
          {city && (
            <>
              <Link to={`/cities/${city.id}`} className="hover:text-ink-700 no-underline">{city.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink-600">{place.name}</span>
        </nav>

        <p className="eyebrow">{place.category}</p>
        <h1 className="mb-3">{place.name}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 mb-5">
          {place.dateVisited && (
            <span className="text-sm text-ink-400 font-sans">
              Visited: <strong className="text-ink-700">{formatDate(place.dateVisited)}</strong>
            </span>
          )}
          <Rating value={place.rating} />
        </div>

        {place.description && (
          <p className="text-ink-600 max-w-2xl leading-relaxed mb-4">
            {place.description}
          </p>
        )}

        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {place.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}

        {/* Personal notes */}
        {place.notes && (
          <blockquote className="border-l-2 border-parchment-400 pl-4 py-1 mt-6">
            <p className="text-ink-500 italic leading-relaxed text-sm">{place.notes}</p>
          </blockquote>
        )}
      </section>

      {/* Photos */}
      <section className="page-container pb-12">
        <div className="divider" />
        <h4 className="mb-5">Photos</h4>
        <PhotoGallery photos={place.photos || []} />
      </section>
    </div>
  )
}
