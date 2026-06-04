/**
 * Lightbox.jsx
 *
 * Full-screen photo viewer.
 * Props:
 *   photos  — array of { src, caption }
 *   index   — currently shown index
 *   onClose — callback to dismiss
 *   onChange — callback(newIndex) when navigating
 */

import { useEffect, useCallback } from 'react'

export default function Lightbox({ photos, index, onClose, onChange }) {
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  const prev = useCallback(() => hasPrev && onChange(index - 1), [index, hasPrev, onChange])
  const next = useCallback(() => hasNext && onChange(index + 1), [index, hasNext, onChange])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!photo) return null

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Inner container — stops click propagation so clicking image doesn't close */}
      <div
        className="relative flex flex-col items-center max-w-5xl w-full px-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-4 text-parchment-300 hover:text-parchment-100 transition-colors text-2xl font-light"
          aria-label="Close lightbox"
        >
          &#x2715;
        </button>

        {/* Image */}
        <img
          src={photo.src}
          alt={photo.caption || ''}
          className="max-h-[80vh] max-w-full object-contain rounded-sm"
          style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.6)' }}
        />

        {/* Caption */}
        {photo.caption && (
          <p className="mt-4 text-sm font-sans text-parchment-400 text-center max-w-lg">
            {photo.caption}
          </p>
        )}

        {/* Counter */}
        <p className="mt-1 text-2xs font-sans tracking-wider uppercase text-parchment-600">
          {index + 1} / {photos.length}
        </p>

        {/* Prev / Next */}
        {hasPrev && (
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-6
                       text-parchment-300 hover:text-parchment-100 transition-colors text-2xl"
            aria-label="Previous photo"
          >
            &#8592;
          </button>
        )}
        {hasNext && (
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-6
                       text-parchment-300 hover:text-parchment-100 transition-colors text-2xl"
            aria-label="Next photo"
          >
            &#8594;
          </button>
        )}
      </div>
    </div>
  )
}
