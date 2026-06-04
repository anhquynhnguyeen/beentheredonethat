/**
 * AddCityForm.jsx
 */

import { useState } from 'react'
import { slugify } from '../../utils/helpers'
import { getCountries } from '../../utils/dataLoader'

const EMPTY = {
  id: '', name: '', countryId: '', lat: '', lng: '',
  firstVisited: '', lastVisited: '', timesVisited: 1,
  coverPhoto: '', notes: '', tags: '',
}

export default function AddCityForm({ existing = null, onSave, onCancel }) {
  const countries = getCountries()
  const [form, setForm] = useState(
    existing
      ? { ...existing, tags: (existing.tags || []).join(', ') }
      : { ...EMPTY, countryId: countries[0]?.id || '' }
  )

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = {
      ...form,
      id:           form.id || slugify(form.name),
      lat:          parseFloat(form.lat),
      lng:          parseFloat(form.lng),
      timesVisited: parseInt(form.timesVisited) || 1,
      tags:         form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    onSave(entry)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">City name *</label>
          <input className="form-input" value={form.name} onChange={set('name')} required placeholder="Amsterdam" />
        </div>
        <div>
          <label className="form-label">Country *</label>
          <select className="form-input" value={form.countryId} onChange={set('countryId')} required>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Latitude *</label>
          <input className="form-input" type="number" step="any" value={form.lat} onChange={set('lat')} required placeholder="52.3676" />
        </div>
        <div>
          <label className="form-label">Longitude *</label>
          <input className="form-input" type="number" step="any" value={form.lng} onChange={set('lng')} required placeholder="4.9041" />
        </div>
      </div>

      <p className="text-xs text-ink-400 font-sans -mt-2">
        Tip: find coordinates at <a href="https://www.latlong.net" target="_blank" rel="noreferrer" className="underline">latlong.net</a>
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First visited</label>
          <input className="form-input" type="date" value={form.firstVisited} onChange={set('firstVisited')} />
        </div>
        <div>
          <label className="form-label">Times visited</label>
          <input className="form-input" type="number" min={1} value={form.timesVisited} onChange={set('timesVisited')} />
        </div>
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea className="form-input" rows={3} value={form.notes} onChange={set('notes')} />
      </div>

      <div>
        <label className="form-label">Tags (comma-separated)</label>
        <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="canals, cycling" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {existing ? 'Save changes' : 'Add city'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
