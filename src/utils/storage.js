/**
 * storage.js
 *
 * Admin Mode persistence layer.
 *
 * Since this is a static site with no server, edits made through the Admin UI
 * are stored in localStorage under a single "btdt_data" key. On each page
 * load, the app merges localStorage overrides on top of the bundled JSON files.
 *
 * When you're happy with your changes:
 *   1. Open Admin → Export JSON
 *   2. Replace the files in src/data/ with the downloaded files
 *   3. Commit & push → GitHub Pages re-deploys automatically
 *
 * Future enhancement: replace this module with a GitHub API write call.
 */

const STORAGE_KEY = 'btdt_data'

/**
 * Load the persisted data object, or return defaults.
 * @returns {{ countries: [], cities: [], places: [], trips: [] }}
 */
export function loadStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('beentheredonethat: failed to read localStorage', e)
  }
  return { countries: null, cities: null, places: null, trips: null }
}

/**
 * Persist a full data snapshot to localStorage.
 * @param {{ countries, cities, places, trips }} data
 */
export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('beentheredonethat: failed to write localStorage', e)
  }
}

/**
 * Clear all localStorage overrides — reverts to bundled JSON files.
 */
export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Check whether the user has any unsaved local edits.
 */
export function hasLocalChanges() {
  return localStorage.getItem(STORAGE_KEY) !== null
}
