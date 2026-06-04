/**
 * AddCountryForm.jsx
 * Form to add or edit a country entry.
 */

import { useState } from 'react'
import { slugify, CONTINENTS } from '../../utils/helpers'

const EMPTY = {
  id: '', name: '', code: '', continent: 'Europe',
  firstVisited: '', lastVisited: '', timesVisited: 1,
  coverPhoto: '', notes: '', tags: '',
}

export default function AddCountryForm({ existing = null, onSave, onCancel }) {
  const [form, setForm] = useState(
    existing
      ? { ...existing, tags: (existing.tags || []).join(', ') }
      : EMPTY
  )

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = {
      ...form,
      id:           form.id || slugify(form.name),
      timesVisited: parseInt(form.timesVisited) || 1,
      tags:         form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    onSave(entry)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Country name *</label>
          <input className="form-input" value={form.name} onChange={set('name')} required placeholder="Netherlands" />
        </div>
        <div>
          <label className="form-label">ISO code (2-letter) *</label>
          <input className="form-input" value={form.code} onChange={set('code')} required placeholder="NL" maxLength={2} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Continent</label>
          <select className="form-input" value={form.continent} onChange={set('continent')}>
            {CONTINENTS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Times visited</label>
          <input className="form-input" type="number" min={1} value={form.timesVisited} onChange={set('timesVisited')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First visited</label>
          <input className="form-input" type="date" value={form.firstVisited} onChange={set('firstVisited')} />
        </div>
        <div>
          <label className="form-label">Last visited</label>
          <input className="form-input" type="date" value={form.lastVisited} onChange={set('lastVisited')} />
        </div>
      </div>

      <div>
        <label className="form-label">Notes</label>
        <textarea className="form-input" rows={3} value={form.notes} onChange={set('notes')} placeholder="Personal impressions..." />
      </div>

      <div>
        <label className="form-label">Tags (comma-separated)</label>
        <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="museums, cycling, canals" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {existing ? 'Save changes' : 'Add country'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
