/**
 * helpers.js
 * Pure utility functions — no side effects, no state.
 */

/**
 * Format a date string (YYYY-MM-DD) to a readable form.
 * @param {string} dateStr
 * @param {'short'|'long'} style
 */
export function formatDate(dateStr, style = 'long') {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00') // avoid TZ shift
  if (style === 'short') {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Return only the year from a date string.
 */
export function formatYear(dateStr) {
  if (!dateStr) return ''
  return dateStr.slice(0, 4)
}

/**
 * Slugify a string for use as an ID.
 * "Anne Frank House" → "anne-frank-house"
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/**
 * Capitalize first letter of each word.
 */
export function titleCase(str) {
  if (!str) return ''
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Group an array of objects by a key.
 * groupBy(places, 'cityId') → { amsterdam: [...], tokyo: [...] }
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}

/**
 * Sort array of objects by a date string key, newest first.
 */
export function sortByDateDesc(arr, key = 'dateVisited') {
  return [...arr].sort((a, b) => {
    if (!a[key]) return 1
    if (!b[key]) return -1
    return b[key].localeCompare(a[key])
  })
}

/**
 * Resolve a photo path to its public URL.
 * Photos live in public/images/, served at /beentheredonethat/images/
 * In dev mode, base is just /images/
 */
export function photoUrl(path) {
  if (!path) return ''
  const base = import.meta.env.BASE_URL || '/'
  // Normalise — path may start with / or not
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}

/**
 * Construct the expected photo path convention.
 * photoPath('nl', 'amsterdam', 'rijksmuseum_01.jpg')
 * → 'images/nl/amsterdam/rijksmuseum_01.jpg'
 */
export function buildPhotoPath(countryCode, cityId, filename) {
  return `images/${countryCode.toLowerCase()}/${cityId}/${filename}`
}

/**
 * Return a placeholder SVG data-URL for missing photos.
 */
export function placeholderImage(width = 400, height = 300) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23e4dece'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23a8a49a'%3ENo photo%3C/text%3E%3C/svg%3E`
}

/**
 * Place categories with display labels.
 */
export const PLACE_CATEGORIES = [
  'Historical Site',
  'Museum',
  'Landmark',
  'Nature',
  'Architecture',
  'Restaurant',
  'Gallery',
  'Market',
  'Park',
  'Beach',
  'Other',
]

/**
 * Continents list for filtering.
 */
export const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica',
]
