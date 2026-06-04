/**
 * PlaceCard.jsx
 * Card linking to a place detail page.
 */

import { Link } from 'react-router-dom'
import { formatDate, placeholderImage, photoUrl } from '../utils/helpers'

// Star rating dots
function Rating({ value }) {
  if (!value) return null
  return (
    <div className="flex gap-1 items-center" aria-label={`Rating: ${value} of 5`}>
      {[1,2,3,4,5].map(n => (
        <span
          key={n}
          className={`w-1.5 h-1.5 rounded-full ${n <= value ? 'bg-accent' : 'bg-parchment-300'}`}
        />
      ))}
    </div>
  )
}

export default function PlaceCard({ place }) {
  const coverSrc = place.photos?.[0]
    ? photoUrl(typeof place.photos[0] === 'string' ? place.photos[0] : place.photos[0].src)
    : null

  return (
    <Link
      to={`/places/${place.id}`}
      className="card block no-underline group fade-in overflow-hidden"
    >
      {/* Photo or placeholder */}
      <div className="aspect-[4/3] overflow-hidden bg-parchment-200">
        <img
          src={coverSrc || placeholderImage(400, 300)}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <p className="eyebrow">{place.category}</p>
        <h3 className="font-serif text-lg text-ink-900 group-hover:text-accent transition-colors leading-snug">
          {place.name}
        </h3>

        {place.description && (
          <p className="text-sm text-ink-500 leading-relaxed line-clamp-2 mt-1.5">
            {place.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <Rating value={place.rating} />
          {place.dateVisited && (
            <span className="text-xs text-ink-400 font-sans">
              {formatDate(place.dateVisited, 'short')}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
