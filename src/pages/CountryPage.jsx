/**
 * CountryPage.jsx
 * Detail page for a single country.
 * Shows: country map, cities, photos, notes, trips.
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import {
  getCountryById,
  getCitiesByCountry,
  getPlacesByCountry,
  getTripsByCountry,
} from '../utils/dataLoader'
import CountryMap  from '../components/maps/CountryMap'
import CityCard    from '../components/CityCard'
import PhotoGallery from '../components/PhotoGallery'
import { formatDate } from '../utils/helpers'

export default function CountryPage() {
  const { id } = useParams()
  const country = getCountryById(id)

  if (!country) return <Navigate to="/countries" replace />

  const cities = getCitiesByCountry(id)
  const places = getPlacesByCountry(id)
  const trips  = getTripsByCountry(id)

  // Gather all photos from all places in this country
  const allPhotos = places.flatMap(p => p.photos || [])

  return (
    <div className="fade-in">
      {/* Hero header */}
      <section className="page-container pt-10 pb-6">
        <nav className="text-xs text-ink-400 font-sans mb-4 flex gap-2">
          <Link to="/countries" className="hover:text-ink-700 no-underline">Countries</Link>
          <span>/</span>
          <span className="text-ink-600">{country.name}</span>
        </nav>

        <p className="eyebrow">{country.continent}</p>
        <h1 className="mb-3">{country.name}</h1>

        {country.notes && (
          <p className="text-ink-500 max-w-2xl leading-relaxed mb-4">{country.notes}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-6 text-sm text-ink-400 font-sans mb-6">
          {country.firstVisited && (
            <span>First visited: <strong className="text-ink-700">{formatDate(country.firstVisited)}</strong></span>
          )}
          {country.lastVisited && country.lastVisited !== country.firstVisited && (
            <span>Last visited: <strong className="text-ink-700">{formatDate(country.lastVisited)}</strong></span>
          )}
          {country.timesVisited > 1 && (
            <span>{country.timesVisited} visits</span>
          )}
        </div>

        {country.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {country.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </section>

      {/* Map */}
      <section className="page-container pb-8">
        <CountryMap country={country} height="420px" />
      </section>

      {/* Cities */}
      {cities.length > 0 && (
        <section className="page-container pb-10">
          <div className="divider" />
          <h4 className="mb-5">Cities visited</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </section>
      )}

      {/* Trips */}
      {trips.length > 0 && (
        <section className="page-container pb-10">
          <div className="divider" />
          <h4 className="mb-5">Trips</h4>
          <div className="flex flex-col gap-3">
            {trips.map(trip => (
              <div key={trip.id} className="card p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans font-medium text-ink-800">{trip.name}</p>
                  {trip.notes && (
                    <p className="text-sm text-ink-500 mt-1">{trip.notes}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-ink-400 font-sans whitespace-nowrap">
                    {formatDate(trip.startDate, 'short')}
                  </p>
                  {trip.startDate !== trip.endDate && (
                    <p className="text-xs text-ink-400 font-sans whitespace-nowrap">
                      — {formatDate(trip.endDate, 'short')}
                    </p>
                  )}
                </div>
              </div>
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
