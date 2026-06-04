/**
 * GalleryPage.jsx
 * All photos across all places, in a masonry grid.
 * Filterable by country.
 */

import { useState } from 'react'
import { getAllPhotos, getCountries } from '../utils/dataLoader'
import PhotoGallery from '../components/PhotoGallery'
import { sortByDateDesc } from '../utils/helpers'

export default function GalleryPage() {
  const countries  = getCountries()
  const allPhotos  = sortByDateDesc(getAllPhotos(), 'dateVisited')
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? allPhotos
    : allPhotos.filter(p => p.countryId === filter)

  return (
    <div className="page-container py-12 fade-in">
      <p className="eyebrow">Archive</p>
      <h1 className="mb-2">Gallery</h1>
      <p className="text-ink-500 mb-8">
        {allPhotos.length} {allPhotos.length === 1 ? 'photo' : 'photos'} across all destinations.
      </p>

      {/* Country filter */}
      {countries.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-sans font-medium tracking-wider uppercase px-3 py-1.5 rounded-sm border transition-colors ${
              filter === 'all'
                ? 'bg-ink-900 text-parchment-100 border-ink-900'
                : 'bg-transparent text-ink-500 border-parchment-300 hover:border-ink-400'
            }`}
          >
            All
          </button>
          {countries.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`text-xs font-sans font-medium tracking-wider uppercase px-3 py-1.5 rounded-sm border transition-colors ${
                filter === c.id
                  ? 'bg-ink-900 text-parchment-100 border-ink-900'
                  : 'bg-transparent text-ink-500 border-parchment-300 hover:border-ink-400'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <PhotoGallery photos={filtered} showEmpty={true} />
    </div>
  )
}
