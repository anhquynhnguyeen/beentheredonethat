/**
 * WorldMap.jsx
 *
 * Displays a world map using react-leaflet with GeoJSON country polygons.
 * Visited countries are filled with a warm accent colour.
 * Clicking a country navigates to its country page.
 *
 * GeoJSON source: Natural Earth via https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson
 * Loaded at runtime from a public URL to keep the bundle small.
 */

import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { getVisitedCountryCodes, getCountries } from '../../utils/dataLoader'

// Map countries ISO-A2 codes to our country IDs
// (GeoJSON uses ISO_A2 property)
function getCountryIdByCode(countries, code) {
  return countries.find(c => c.code.toUpperCase() === code.toUpperCase())?.id
}

export default function WorldMap({ height = '100%' }) {
  const navigate = useNavigate()
  const [geoData, setGeoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const visitedCodes = getVisitedCountryCodes()
  const countries = getCountries()
  const geojsonRef = useRef(null)

  useEffect(() => {
    // Fetch world GeoJSON — cached by the browser after first load
    fetch(
      'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
    )
      .then(r => {
        if (!r.ok) throw new Error('Failed to load map data')
        return r.json()
      })
      .then(data => {
        setGeoData(data)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  // Style each country feature
  const featureStyle = (feature) => {
    const code = feature.properties.ISO_A2
    const visited = visitedCodes.includes(code?.toUpperCase())
    return {
      fillColor:   visited ? '#8b6f4e' : '#d4ccb8',
      fillOpacity: visited ? 0.65       : 0.4,
      color:       '#b8ae98',
      weight:      0.5,
      opacity:     1,
    }
  }

  // Interaction handlers for each feature
  const onEachFeature = (feature, layer) => {
    const code      = feature.properties.ISO_A2
    const name      = feature.properties.ADMIN || feature.properties.NAME
    const visited   = visitedCodes.includes(code?.toUpperCase())
    const countryId = getCountryIdByCode(countries, code)

    layer.on({
      mouseover(e) {
        e.target.setStyle({
          fillOpacity: visited ? 0.85 : 0.55,
          weight:      visited ? 1.5  : 0.5,
          color:       visited ? '#5a5248' : '#b8ae98',
        })
        layer.bindTooltip(
          `<span style="font-family:Inter,sans-serif;font-size:12px;color:#1e1c18">
            ${name}${visited ? ' &mdash; visited' : ''}
           </span>`,
          { sticky: true, className: 'btdt-tooltip', direction: 'top', offset: [0, -6] }
        ).openTooltip()
      },
      mouseout(e) {
        if (geojsonRef.current) {
          geojsonRef.current.resetStyle(e.target)
        }
      },
      click() {
        if (visited && countryId) {
          navigate(`/countries/${countryId}`)
        }
      },
    })

    if (visited) {
      layer.getElement?.()?.classList?.add('cursor-pointer')
    }
  }

  return (
    <div className="map-wrapper" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-parchment-100 z-10">
          <p className="text-ink-400 text-sm font-sans tracking-wide">Loading map data...</p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-parchment-100 z-10">
          <p className="text-ink-400 text-sm font-sans">Could not load map. Check your connection.</p>
        </div>
      )}

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        style={{ height: '100%', width: '100%', background: '#f0ece0' }}
        scrollWheelZoom={true}
        worldCopyJump={true}
        zoomControl={true}
      >
        {/* Tile layer — CartoDB Positron: neutral, elegant */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {geoData && (
          <GeoJSON
            ref={geojsonRef}
            data={geoData}
            style={featureStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  )
}
