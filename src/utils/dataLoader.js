/**
 * dataLoader.js
 *
 * Central data access layer.
 *
 * Merges bundled JSON (from src/data/) with any localStorage overrides
 * written by Admin Mode. All components import data through this module.
 */

import countriesJson from '../data/countries.json'
import citiesJson    from '../data/cities.json'
import placesJson    from '../data/places.json'
import tripsJson     from '../data/trips.json'
import { loadStorage } from './storage'

/**
 * Return all data, with localStorage overrides applied.
 * Override arrays REPLACE the bundled array entirely (not merged per-item).
 */
export function getAllData() {
  const overrides = loadStorage()
  return {
    countries: overrides.countries ?? countriesJson,
    cities:    overrides.cities    ?? citiesJson,
    places:    overrides.places    ?? placesJson,
    trips:     overrides.trips     ?? tripsJson,
  }
}

// ─── Convenience accessors ────────────────────────────────────────────────────

export function getCountries()  { return getAllData().countries }
export function getCities()     { return getAllData().cities }
export function getPlaces()     { return getAllData().places }
export function getTrips()      { return getAllData().trips }

export function getCountryById(id)   { return getCountries().find(c => c.id === id) }
export function getCityById(id)      { return getCities().find(c => c.id === id) }
export function getPlaceById(id)     { return getPlaces().find(p => p.id === id) }
export function getTripById(id)      { return getTrips().find(t => t.id === id) }

export function getCitiesByCountry(countryId) {
  return getCities().filter(c => c.countryId === countryId)
}

export function getPlacesByCity(cityId) {
  return getPlaces().filter(p => p.cityId === cityId)
}

export function getPlacesByCountry(countryId) {
  return getPlaces().filter(p => p.countryId === countryId)
}

export function getTripsByCountry(countryId) {
  return getTrips().filter(t => t.countryIds.includes(countryId))
}

export function getTripsByCity(cityId) {
  return getTrips().filter(t => t.cityIds.includes(cityId))
}

/**
 * Collect all photos across all places (with context attached).
 * Returns [{ src, caption, cityId, countryId, placeId, placeName, dateVisited }]
 */
export function getAllPhotos() {
  return getPlaces().flatMap(place =>
    (place.photos || []).map(photo => ({
      src: typeof photo === 'string' ? photo : photo.src,
      caption: typeof photo === 'string' ? place.name : (photo.caption || place.name),
      placeId: place.id,
      placeName: place.name,
      cityId: place.cityId,
      countryId: place.countryId,
      dateVisited: place.dateVisited,
    }))
  )
}

/**
 * Statistics summary for the homepage.
 */
export function getStats() {
  const { countries, cities, places } = getAllData()
  const totalPhotos = places.reduce((acc, p) => acc + (p.photos?.length ?? 0), 0)
  return {
    countries: countries.length,
    cities:    cities.length,
    places:    places.length,
    photos:    totalPhotos,
  }
}

/**
 * ISO country codes of visited countries — used to highlight the world map.
 */
export function getVisitedCountryCodes() {
  return getCountries().map(c => c.code?.toUpperCase()).filter(Boolean)
}
