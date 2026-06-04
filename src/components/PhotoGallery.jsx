/**
 * PhotoGallery.jsx
 *
 * Masonry-style photo gallery with lightbox support.
 *
 * Props:
 *   photos — array of { src, caption } or plain string paths
 *   showEmpty — render a placeholder message if no photos
 */

import { useState } from 'react'
import Lightbox from './Lightbox'
import { photoUrl, placeholderImage } from '../utils/helpers'

function normalisePhoto(photo) {
  if (typeof photo === 'string') return { src: photoUrl(photo), caption: '' }
  return { src: photoUrl(photo.src), caption: photo.caption || '' }
}

export default function PhotoGallery({ photos = [], showEmpty = true }) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const normalised = photos.map(normalisePhoto)

  if (normalised.length === 0) {
    if (!showEmpty) return null
    return (
      <div className="border border-dashed border-parchment-300 rounded-sm p-12 text-center">
        <p className="text-sm text-ink-400 font-sans">No photos yet.</p>
        <p className="text-xs text-ink-400 font-sans mt-1">
          Add images to <code className="font-mono">public/images/</code> and reference them in your JSON data.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="masonry-grid">
        {normalised.map((photo, i) => (
          <div
            key={i}
            className="masonry-item cursor-pointer"
            onClick={() => setLightboxIndex(i)}
          >
            <div className="overflow-hidden rounded-sm bg-parchment-200 group">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-auto object-cover transition-opacity duration-200 group-hover:opacity-90"
                loading="lazy"
                onError={e => { e.target.src = placeholderImage(400, 300) }}
              />
              {photo.caption && (
                <p className="px-2 py-1.5 text-2xs font-sans text-ink-400 leading-tight">
                  {photo.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={normalised}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </>
  )
}
