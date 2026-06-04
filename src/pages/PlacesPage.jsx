/**
 * PlacesPage.jsx
 * Grid of all visited places with category filter.
 */

import { useState } from 'react'
import { getPlaces } from '../utils/dataLoader'
import PlaceCard from '../components/PlaceCard'
import { PLACE_CATEGORIES } from '../utils/helpers'

export default function PlacesPage() {
  const places = getPlaces()
  const [activeCategory, setActiveCategory] = useState('All')

  // Derive categories that actually have entries
  const usedCategories = ['All', ...PLACE_CATEGORIES.filter(
    cat => places.some(p => p.category === cat)
  )]

  const filtered = activeCategory === 'All'
    ? places
    : places.filter(p => p.category === activeCategory)

  return (
    <div className="page-container py-12 fade-in">
      <p className="eyebrow">Archive</p>
      <h1 className="mb-2">Places</h1>
      <p className="text-ink-500 mb-8">
        {places.length} {places.length === 1 ? 'place' : 'places'} recorded.
      </p>

      {/* Category filter */}
      {usedCategories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {usedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-sans font-medium tracking-wider uppercase px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
                activeCategory === cat
                  ? 'bg-ink-900 text-parchment-100 border-ink-900'
                  : 'bg-transparent text-ink-500 border-parchment-300 hover:border-ink-400 hover:text-ink-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(place => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border border-dashed border-parchment-300 rounded-sm p-16 text-center">
          <p className="text-ink-400 text-sm">No places in this category.</p>
        </div>
      )}
    </div>
  )
}
