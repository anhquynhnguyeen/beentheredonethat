/**
 * CityMap.jsx
 *
 * Displays a map centred on a city with markers for each visited place.
 * Clicking a marker navigates to the place page.
 */

import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { getPlacesByCity } from '../../utils/dataLoader'
import { useEffect } from 'react'

// Category → colour mapping (all warm tones)
const CATEGORY_COLORS = {
  'Museum':        '#8b6f4e',
  'Historical Site': '#7a6040',
  'Landmark':      '#9a7a5a',
  'Nature':        '#6a7a50',
  'Architecture':  '#8b6f4e',
  'Restaurant':    '#a07050',
  'Gallery':       '#806050',
  'Market':        '#908060',
  'Park':          '#6a7a50',
  'Beach':         '#909070',
  'Other':         '#a8a49a',
}

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
}

// Auto-fit map to show all place markers
function FitBounds({ places }) {
  const map = useMap()
  useEffect(() => {
    if (places.length === 0) return
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 14)
      return
    }
    const lats = places.map(p => p.lat)
    const lngs = places.map(p => p.lng)
    map.fitBounds(
      [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]],
      { padding: [40, 40] }
    )
  }, [places, map])
  return null
}

export default function CityMap({ city, height = '380px' }) {
  const navigate = useNavigate()
  const places = getPlacesByCity(city.id)

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer
        center={[city.lat, city.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', background: '#f0ece0' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {places.length > 0 && <FitBounds places={places} />}

        {places.map(place => (
          <CircleMarker
            key={place.id}
            center={[place.lat, place.lng]}
            radius={9}
            pathOptions={{
              fillColor:   getCategoryColor(place.category),
              fillOpacity: 0.9,
              color:       '#3a3430',
              weight:      1,
            }}
            eventHandlers={{
              click: () => navigate(`/places/${place.id}`),
            }}
          >
            <Popup>
              <div>
                <p className="font-semibold text-ink-900">{place.name}</p>
                <p className="text-xs text-ink-400 mt-0.5">{place.category}</p>
                {place.dateVisited && (
                  <p className="text-xs text-ink-400">{place.dateVisited}</p>
                )}
                <button
                  className="mt-1 text-xs text-accent underline block"
                  onClick={() => navigate(`/places/${place.id}`)}
                >
                  View place
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
