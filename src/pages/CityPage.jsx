/**
 * CityPage.jsx
 * Detail page for a single city.
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import {
  getCityById,
  getCountryById,
  getPlacesByCity,
  getTripsByCity,
} from '../utils/dataLoader'
import CityMap     from '../components/maps/CityMap'
import PlaceCard   from '../components/PlaceCard'
import PhotoGallery from '../components/PhotoGallery'
import { formatDate } from '../utils/helpers'

export default function CityPage() {
  const { id } = useParams()
  const city    = getCityById(id)
  if (!city) return <Navigate to="/cities" replace />

  const country = getCountryById(city.countryId)
  const places  = getPlacesByCity(id)
  const trips   = getTripsByCity(id)
  const allPhotos = places.flatMap(p => p.photos || [])

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="page-container pt-10 pb-6">
        <nav className="text-xs text-ink-400 font-sans mb-4 flex gap-2">
          <Link to="/countries" className="hover:text-ink-700 no-underline">Countries</Link>
          <span>/</span>
          {country && (
            <>
              <Link to={`/countries/${country.id}`} className="hover:text-ink-700 no-underline">
                {country.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink-600">{city.name}</span>
        </nav>

        {country && <p className="eyebrow">{country.name}</p>}
        <h1 className="mb-3">{city.name}</h1>

        {city.notes && (
          <p className="text-ink-500 max-w-2xl leading-relaxed mb-4">{city.notes}</p>
        )}

        <div className="flex flex-wrap gap-6 text-sm text-ink-400 font-sans mb-4">
          {city.firstVisited && (
            <span>First visited: <strong className="text-ink-700">{formatDate(city.firstVisited)}</strong></span>
          )}
          {city.timesVisited > 1 && (
            <span>{city.timesVisited} visits</span>
          )}
        </div>

        {city.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {city.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </section>

      {/* Map */}
      <section className="page-container pb-8">
        <CityMap city={city} height="380px" />
      </section>

      {/* Places */}
      {places.length > 0 && (
        <section className="page-container pb-10">
          <div className="divider" />
          <h4 className="mb-5">Places visited</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {places.map(place => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>
      )}

      {/* Photos */}
      <section className="page-container pb-12">
        <div className="divider" />
        <h4 className="mb-5">Photos</h4>
        <PhotoGallery photos={allPhotos} />
      </section>
    </div>
  )
}
