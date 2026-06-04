/**
 * AddPlaceForm.jsx
 */

import { useState } from 'react'
import { slugify, PLACE_CATEGORIES } from '../../utils/helpers'
import { getCities, getCountries } from '../../utils/dataLoader'

const EMPTY = {
  id: '', name: '', cityId: '', countryId: '',
  category: 'Landmark', lat: '', lng: '',
  dateVisited: '', description: '', notes: '',
  photos: '', rating: '', tags: '',
}

export default function AddPlaceForm({ existing = null, onSave, onCancel }) {
  const cities    = getCities()
  const countries = getCountries()

  const [form, setForm] = useState(
    existing
      ? {
          ...existing,
          photos: (existing.photos || []).join('\n'),
          tags:   (existing.tags   || []).join(', '),
        }
      : {
          ...EMPTY,
          cityId:    cities[0]?.id       || '',
          countryId: countries[0]?.id    || '',
        }
  )

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  // Auto-fill countryId when city changes
  const handleCityChange = (e) => {
    const cityId  = e.target.value
    const city    = cities.find(c => c.id === cityId)
    setForm(f => ({ ...f, cityId, countryId: city?.countryId || f.countryId }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const entry = {
      ...form,
      id:          form.id || slugify(form.name),
      lat:         form.lat    ? parseFloat(form.lat)    : undefined,
      lng:         form.lng    ? parseFloat(form.lng)    : undefined,
      rating:      form.rating ? parseInt(form.rating)   : undefined,
      photos:      form.photos.split('\n').map(s => s.trim()).filter(Boolean),
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    onSave(entry)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Place name *</label>
          <input className="form-input" value={form.name} onChange={set('name')} required placeholder="Rijksmuseum" />
        </div>
        <div>
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={set('category')}>
            {PLACE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">City</label>
          <select className="form-input" value={form.cityId} onChange={handleCityChange}>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Date visited</label>
          <input className="form-input" type="date" value={form.dateVisited} onChange={set('dateVisited')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Latitude</label>
          <input className="form-input" type="number" step="any" value={form.lat} onChange={set('lat')} placeholder="52.36" />
        </div>
        <div>
          <label className="form-label">Longitude</label>
          <input className="form-input" type="number" step="any" value={form.lng} onChange={set('lng')} placeholder="4.885" />
        </div>
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea className="form-input" rows={2} value={form.description} onChange={set('description')} placeholder="What is this place?" />
      </div>

      <div>
        <label className="form-label">Personal notes</label>
        <textarea className="form-input" rows={3} value={form.notes} onChange={set('notes')} placeholder="What you remember..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Rating (1–5)</label>
          <select className="form-input" value={form.rating} onChange={set('rating')}>
            <option value="">—</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label">Tags (comma-separated)</label>
          <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="art, history" />
        </div>
      </div>

      <div>
        <label className="form-label">Photo paths (one per line)</label>
        <textarea
          className="form-input font-mono text-xs"
          rows={3}
          value={form.photos}
          onChange={set('photos')}
          placeholder={`images/nl/amsterdam/rijksmuseum_01.jpg\nimages/nl/amsterdam/rijksmuseum_02.jpg`}
        />
        <p className="text-2xs text-ink-400 font-sans mt-1">
          Place photos in <code>public/images/[country_code]/[city_id]/</code>
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          {existing ? 'Save changes' : 'Add place'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
