/**
 * HomePage.jsx
 *
 * The landing page. An interactive world map fills most of the viewport.
 * Stats banner sits below. Visited countries are highlighted;
 * clicking one navigates to its country page.
 */

import WorldMap   from '../components/maps/WorldMap'
import StatsBanner from '../components/StatsBanner'

export default function HomePage() {
  return (
    <div className="fade-in">
      {/* Hero map — tall on desktop, shorter on mobile */}
      <div className="w-full" style={{ height: 'calc(100dvh - 56px - 1px)' }}>
        <WorldMap height="100%" />
      </div>

      {/* Stats + intro — visible on scroll */}
      <section className="page-container py-12">
        <div className="max-w-lg">
          <p className="eyebrow">A personal travel archive</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-900 mb-4 leading-tight">
            beentheredonethat
          </h1>
          <p className="text-ink-500 leading-relaxed mb-8">
            Countries visited. Cities walked. Places remembered.
            Click any highlighted country on the map to explore.
          </p>
        </div>

        <StatsBanner />
      </section>
    </div>
  )
}
