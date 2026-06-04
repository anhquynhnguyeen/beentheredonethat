/**
 * github.js
 *
 * Direct GitHub Contents API integration.
 *
 * Reads and writes JSON data files in the GitHub repository
 * using the authenticated user's Personal Access Token.
 *
 * The token is stored in localStorage (client-side only).
 * It is ONLY sent to api.github.com — never to any other server.
 *
 * Required token scopes: repo (or Contents: read+write for fine-grained tokens)
 *
 * API docs: https://docs.github.com/en/rest/repos/contents
 */

const GITHUB_API = 'https://api.github.com'
const CONFIG_KEY = 'btdt_github_config'

// ─── Config persistence ────────────────────────────────────────────────────

export function saveGithubConfig({ owner, repo, token, branch = 'main' }) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ owner, repo, token, branch }))
}

export function loadGithubConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function clearGithubConfig() {
  localStorage.removeItem(CONFIG_KEY)
}

export function isConfigured() {
  const cfg = loadGithubConfig()
  return !!(cfg?.owner && cfg?.repo && cfg?.token)
}

// ─── Core API helpers ──────────────────────────────────────────────────────

function headers(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept':        'application/vnd.github+json',
    'Content-Type':  'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

/**
 * Fetch a file from the repo. Returns { content (parsed JSON), sha }.
 * The SHA is required when updating a file (GitHub needs it for conflict detection).
 */
async function getFile(cfg, path) {
  const url = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`
  const res = await fetch(url, { headers: headers(cfg.token) })

  if (res.status === 404) {
    // File doesn't exist yet — return null sha so we can create it
    return { content: null, sha: null }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`GitHub API error (${res.status}): ${body.message || res.statusText}`)
  }

  const data = await res.json()
  // GitHub returns content as base64
  const decoded = JSON.parse(atob(data.content.replace(/\n/g, '')))
  return { content: decoded, sha: data.sha }
}

/**
 * Write a JSON file to the repo (create or update).
 * Returns the commit URL.
 */
async function putFile(cfg, path, jsonContent, sha) {
  const url     = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${path}`
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(jsonContent, null, 2))))

  const body = {
    message: `btdt: update ${path.split('/').pop()}`,
    content: encoded,
    branch:  cfg.branch,
    ...(sha ? { sha } : {}),
  }

  const res = await fetch(url, {
    method:  'PUT',
    headers: headers(cfg.token),
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(`GitHub write failed (${res.status}): ${errBody.message || res.statusText}`)
  }

  const data = await res.json()
  return data.content?.html_url || ''
}

// ─── Public API ───────────────────────────────────────────────────────────

const DATA_FILES = {
  countries: 'src/data/countries.json',
  cities:    'src/data/cities.json',
  places:    'src/data/places.json',
  trips:     'src/data/trips.json',
}

/**
 * Test that the token and repo are valid.
 * Returns { ok: true } or throws with a human-readable message.
 */
export async function testConnection(cfg) {
  const url = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}`
  const res = await fetch(url, { headers: headers(cfg.token) })

  if (res.status === 401) throw new Error('Invalid token. Check your Personal Access Token.')
  if (res.status === 404) throw new Error(`Repository "${cfg.owner}/${cfg.repo}" not found, or the token has no access to it.`)
  if (!res.ok) throw new Error(`Connection failed (${res.status})`)

  return { ok: true }
}

/**
 * Save a single data collection (countries, cities, places, or trips)
 * back to its JSON file in the repo.
 *
 * @param {'countries'|'cities'|'places'|'trips'} collectionName
 * @param {Array} data  The full updated array
 */
export async function saveCollection(collectionName, data) {
  const cfg = loadGithubConfig()
  if (!cfg) throw new Error('GitHub not configured. Set up your token in Admin settings.')

  const path    = DATA_FILES[collectionName]
  const { sha } = await getFile(cfg, path)
  await putFile(cfg, path, data, sha)
}

/**
 * Save all four collections in parallel.
 * Used after a bulk edit that touches multiple files.
 */
export async function saveAllCollections({ countries, cities, places, trips }) {
  const cfg = loadGithubConfig()
  if (!cfg) throw new Error('GitHub not configured.')

  // Fetch all current SHAs first (needed to update existing files)
  const [cSha, ciSha, pSha, tSha] = await Promise.all([
    getFile(cfg, DATA_FILES.countries).then(f => f.sha),
    getFile(cfg, DATA_FILES.cities).then(f => f.sha),
    getFile(cfg, DATA_FILES.places).then(f => f.sha),
    getFile(cfg, DATA_FILES.trips).then(f => f.sha),
  ])

  await Promise.all([
    putFile(cfg, DATA_FILES.countries, countries, cSha),
    putFile(cfg, DATA_FILES.cities,    cities,    ciSha),
    putFile(cfg, DATA_FILES.places,    places,    pSha),
    putFile(cfg, DATA_FILES.trips,     trips,     tSha),
  ])
}

/**
 * Upload a photo to public/images/ in the repo.
 *
 * @param {File}   file        The File object from a file input
 * @param {string} destPath    e.g. "public/images/nl/amsterdam/rijksmuseum_01.jpg"
 */
export async function uploadPhoto(file, destPath) {
  const cfg = loadGithubConfig()
  if (!cfg) throw new Error('GitHub not configured.')

  // Convert File to base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1]) // strip data:*/*;base64,
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const url  = `${GITHUB_API}/repos/${cfg.owner}/${cfg.repo}/contents/${destPath}`
  const body = {
    message: `btdt: add photo ${file.name}`,
    content: base64,
    branch:  cfg.branch,
  }

  // Check if file already exists (need SHA to overwrite)
  const checkRes = await fetch(`${url}?ref=${cfg.branch}`, { headers: headers(cfg.token) })
  if (checkRes.ok) {
    const existing = await checkRes.json()
    body.sha = existing.sha
  }

  const res = await fetch(url, {
    method:  'PUT',
    headers: headers(cfg.token),
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(`Photo upload failed (${res.status}): ${errBody.message}`)
  }

  // Return the path to use in places.json (relative to public/)
  return destPath.replace('public/', '')
}
