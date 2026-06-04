/**
 * CountryMap.jsx
 *
 * Displays a map centred on a specific country.
 * Plots city markers for visited cities.
 * Clicking a city marker navigates to its city page.
 */

import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { getCitiesByCountry } from '../../utils/dataLoader'

// Rough bounding boxes (lat, lng, zoom) per country code.
// This avoids needing a full geocoding API.
const COUNTRY_VIEWS = {
  NL: { center: [52.3, 5.3],    zoom: 7  },
  JP: { center: [36.5, 138.0],  zoom: 5  },
  PT: { center: [39.5, -8.0],   zoom: 6  },
  FR: { center: [46.8, 2.3],    zoom: 5  },
  DE: { center: [51.2, 10.4],   zoom: 5  },
  IT: { center: [42.8, 12.8],   zoom: 5  },
  ES: { center: [40.4, -3.7],   zoom: 5  },
  GB: { center: [54.0, -2.0],   zoom: 5  },
  US: { center: [37.9, -95.7],  zoom: 4  },
  AU: { center: [-25.3, 133.8], zoom: 4  },
  IN: { center: [20.6, 78.9],   zoom: 4  },
  CN: { center: [35.9, 104.2],  zoom: 4  },
  BR: { center: [-14.2, -51.9], zoom: 4  },
  DEFAULT: { center: [0, 0],    zoom: 4  },
}

export default function CountryMap({ country, height = '400px' }) {
  const navigate = useNavigate()
  const cities = getCitiesByCountry(country.id)
  const view = COUNTRY_VIEWS[country.code?.toUpperCase()] || COUNTRY_VIEWS.DEFAULT

  return (
    <div className="map-wrapper" style={{ height }}>
      <MapContainer
        center={view.center}
        zoom={view.zoom}
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

        {cities.map(city => (
          <CircleMarker
            key={city.id}
            center={[city.lat, city.lng]}
            radius={8}
            pathOptions={{
              fillColor:   '#8b6f4e',
              fillOpacity: 0.85,
              color:       '#5a5248',
              weight:      1.5,
            }}
            eventHandlers={{
              click: () => navigate(`/cities/${city.id}`),
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-ink-900 mb-0.5">{city.name}</p>
                {city.timesVisited > 1 && (
                  <p className="text-xs text-ink-400">Visited {city.timesVisited}×</p>
                )}
                <button
                  className="mt-1 text-xs text-accent underline"
                  onClick={() => navigate(`/cities/${city.id}`)}
                >
                  View city
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
