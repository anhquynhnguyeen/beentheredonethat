/**
 * StatsBanner.jsx
 * Four-stat strip shown on the homepage above the world map.
 */

import { getStats } from '../utils/dataLoader'

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="font-serif text-3xl text-ink-900">{value}</span>
      <span className="text-2xs font-sans font-semibold tracking-widest uppercase text-ink-400">
        {label}
      </span>
    </div>
  )
}

export default function StatsBanner() {
  const { countries, cities, places, photos } = getStats()

  return (
    <div className="flex flex-wrap justify-center divide-x divide-parchment-300 border border-parchment-300 rounded-sm bg-parchment-50">
      <Stat value={countries} label="Countries" />
      <Stat value={cities}    label="Cities"    />
      <Stat value={places}    label="Places"    />
      <Stat value={photos}    label="Photos"    />
    </div>
  )
}
