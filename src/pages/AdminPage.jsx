/**
 * AdminPage.jsx
 *
 * Admin Mode — add, edit, delete travel entries and upload photos.
 *
 * HOW IT WORKS:
 * 1. Connect once with a GitHub Personal Access Token (stored in localStorage)
 * 2. Add/edit entries using the forms
 * 3. Click Save — changes commit directly to src/data/*.json in your repo
 * 4. GitHub Pages re-deploys automatically (usually within 60 seconds)
 *
 * You never need to download files, run npm commands, or open a terminal
 * for routine data entry.
 */

import { useState, useCallback } from 'react'
import { getAllData }     from '../utils/dataLoader'
import { isConfigured }  from '../utils/github'
import { saveCollection } from '../utils/github'
import GithubSetup       from '../components/GithubSetup'
import AddCountryForm    from '../components/forms/AddCountryForm'
import AddCityForm       from '../components/forms/AddCityForm'
import AddPlaceForm      from '../components/forms/AddPlaceForm'
import PhotoUpload       from '../components/forms/PhotoUpload'

const TABS = ['Countries', 'Cities', 'Places', 'Photos']

// ─── Inline helpers ──────────────────────────────────────────────────────────

function SectionHeader({ title, onAdd }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h4>{title}</h4>
      <button className="btn-secondary text-xs" onClick={onAdd}>+ Add new</button>
    </div>
  )
}

function StatusBar({ status }) {
  if (!status) return null
  const styles = {
    saving:  'text-ink-600 bg-parchment-100 border-parchment-300',
    success: 'text-ink-700 bg-parchment-200 border-parchment-300',
    error:   'text-red-700 bg-red-50 border-red-100',
  }
  return (
    <div className={`border rounded-sm px-4 py-3 text-sm font-sans mb-6 ${styles[status.type] || styles.success}`}>
      {status.message}
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [connected,    setConnected]  = useState(isConfigured())
  const [activeTab,    setActiveTab]  = useState('Countries')
  const [data,         setData]       = useState(() => getAllData())
  const [modal,        setModal]      = useState(null)
  const [deleteTarget, setDelete]     = useState(null)
  const [status,       setStatus]     = useState(null)

  // ── Save a collection to GitHub ──────────────────────────────────────────

  const save = useCallback(async (collectionName, newArray) => {
    setStatus({ type: 'saving', message: `Saving ${collectionName} to GitHub...` })
    try {
      await saveCollection(collectionName, newArray)
      setStatus({ type: 'success', message: `Saved. GitHub Pages will redeploy in about 60 seconds.` })
      setTimeout(() => setStatus(null), 6000)
    } catch (err) {
      setStatus({ type: 'error', message: `Save failed: ${err.message}` })
    }
  }, [])

  // ── CRUD helpers ─────────────────────────────────────────────────────────

  async function saveCountry(entry) {
    const next = [...data.countries.filter(c => c.id !== entry.id), entry]
      .sort((a, b) => a.name.localeCompare(b.name))
    setData(d => ({ ...d, countries: next }))
    setModal(null)
    await save('countries', next)
  }

  async function saveCity(entry) {
    const next = [...data.cities.filter(c => c.id !== entry.id), entry]
      .sort((a, b) => a.name.localeCompare(b.name))
    setData(d => ({ ...d, cities: next }))
    setModal(null)
    await save('cities', next)
  }

  async function savePlace(entry) {
    const next = [...data.places.filter(p => p.id !== entry.id), entry]
      .sort((a, b) => a.name.localeCompare(b.name))
    setData(d => ({ ...d, places: next }))
    setModal(null)
    await save('places', next)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const { type, id } = deleteTarget
    let next, key
    if (type === 'country') { next = data.countries.filter(c => c.id !== id); key = 'countries' }
    if (type === 'city')    { next = data.cities.filter(c => c.id !== id);    key = 'cities'    }
    if (type === 'place')   { next = data.places.filter(p => p.id !== id);    key = 'places'    }
    setData(d => ({ ...d, [key]: next }))
    setDelete(null)
    await save(key, next)
  }

  // ── If not yet connected, show setup ─────────────────────────────────────

  if (!connected) {
    return (
      <div className="page-container py-12 fade-in">
        <p className="eyebrow">Admin Mode</p>
        <h1 className="mb-3">Connect to GitHub</h1>
        <p className="text-ink-500 mb-8 max-w-xl leading-relaxed">
          Connect once with a Personal Access Token. After that, all edits save
          directly to your repo — no terminal required.
        </p>
        <GithubSetup onConnected={() => setConnected(true)} />
      </div>
    )
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  function CountriesTab() {
    return (
      <>
        <SectionHeader title="Countries" onAdd={() => setModal({ type: 'country' })} />
        {data.countries.length === 0 && (
          <p className="text-sm text-ink-400">No countries yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {data.countries.map(c => (
            <div key={c.id} className="card px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <span className="font-medium text-ink-800">{c.name}</span>
                <span className="ml-2 text-xs text-ink-400">{c.code} · {c.continent}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="btn-secondary text-xs py-1" onClick={() => setModal({ type: 'country', existing: c })}>Edit</button>
                <button className="btn-danger   text-xs py-1" onClick={() => setDelete({ type: 'country', id: c.id })}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  function CitiesTab() {
    return (
      <>
        <SectionHeader title="Cities" onAdd={() => setModal({ type: 'city' })} />
        {data.cities.length === 0 && (
          <p className="text-sm text-ink-400">No cities yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {data.cities.map(c => {
            const country = data.countries.find(co => co.id === c.countryId)
            return (
              <div key={c.id} className="card px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium text-ink-800">{c.name}</span>
                  {country && <span className="ml-2 text-xs text-ink-400">{country.name}</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="btn-secondary text-xs py-1" onClick={() => setModal({ type: 'city', existing: c })}>Edit</button>
                  <button className="btn-danger   text-xs py-1" onClick={() => setDelete({ type: 'city', id: c.id })}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  function PlacesTab() {
    return (
      <>
        <SectionHeader title="Places" onAdd={() => setModal({ type: 'place' })} />
        {data.places.length === 0 && (
          <p className="text-sm text-ink-400">No places yet.</p>
        )}
        <div className="flex flex-col gap-2">
          {data.places.map(p => {
            const city = data.cities.find(c => c.id === p.cityId)
            return (
              <div key={p.id} className="card px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium text-ink-800">{p.name}</span>
                  <span className="ml-2 text-xs text-ink-400">{p.category}</span>
                  {city && <span className="ml-1 text-xs text-ink-400">· {city.name}</span>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="btn-secondary text-xs py-1" onClick={() => setModal({ type: 'place', existing: p })}>Edit</button>
                  <button className="btn-danger   text-xs py-1" onClick={() => setDelete({ type: 'place', id: p.id })}>Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  function PhotosTab() {
    return (
      <>
        <h4 className="mb-2">Upload photos</h4>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Photos are uploaded directly to <code className="font-mono text-xs">public/images/</code> in your GitHub repo.
          After uploading, copy the returned path into a place's photo list using the Places editor.
        </p>
        <PhotoUpload />
      </>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page-container py-12 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Admin Mode</p>
          <h1>Manage your archive</h1>
        </div>
        <button
          className="btn-secondary text-xs"
          onClick={() => { setConnected(false) }}
        >
          GitHub settings
        </button>
      </div>

      <StatusBar status={status} />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="border border-parchment-300 bg-parchment-50 rounded-sm p-4 flex items-center gap-4 text-sm mb-6">
          <p className="flex-1 text-ink-700">Delete this {deleteTarget.type}? This cannot be undone.</p>
          <button className="btn-danger text-xs"    onClick={confirmDelete}>Confirm</button>
          <button className="btn-secondary text-xs" onClick={() => setDelete(null)}>Cancel</button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-parchment-300 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-sans transition-colors ${
              activeTab === tab
                ? 'text-ink-900 border-b-2 border-ink-900 -mb-px'
                : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'Countries' && <CountriesTab />}
        {activeTab === 'Cities'    && <CitiesTab    />}
        {activeTab === 'Places'    && <PlacesTab    />}
        {activeTab === 'Photos'    && <PhotosTab    />}
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
          style={{ background: 'rgba(16,15,12,0.5)' }}
          onClick={() => setModal(null)}
        >
          <div
            className="bg-parchment-50 border border-parchment-300 rounded-sm p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-6">
              {modal.existing ? 'Edit' : 'Add'} {modal.type}
            </h3>
            {modal.type === 'country' && (
              <AddCountryForm existing={modal.existing} onSave={saveCountry} onCancel={() => setModal(null)} />
            )}
            {modal.type === 'city' && (
              <AddCityForm existing={modal.existing} onSave={saveCity} onCancel={() => setModal(null)} />
            )}
            {modal.type === 'place' && (
              <AddPlaceForm existing={modal.existing} onSave={savePlace} onCancel={() => setModal(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
