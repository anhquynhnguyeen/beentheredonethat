/**
 * PhotoUpload.jsx
 *
 * Upload one or more photos to public/images/ in the GitHub repo.
 * Returns the image paths for inserting into a place's photos array.
 */

import { useState, useRef } from 'react'
import { getCities, getCountryById } from '../../utils/dataLoader'
import { uploadPhoto } from '../../utils/github'

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_')
}

export default function PhotoUpload({ onUploaded }) {
  const cities   = getCities()
  const [cityId, setCityId]   = useState(cities[0]?.id || '')
  const [files,  setFiles]    = useState([])
  const [status, setStatus]   = useState([]) // per-file: null | 'uploading' | 'done' | 'error'
  const [paths,  setPaths]    = useState([]) // uploaded paths
  const inputRef = useRef(null)

  const selectedCity    = cities.find(c => c.id === cityId)
  const selectedCountry = selectedCity ? getCountryById(selectedCity.countryId) : null

  function handleFiles(e) {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setStatus(selected.map(() => null))
    setPaths([])
  }

  async function handleUpload() {
    if (!files.length || !cityId) return

    const countryCode = selectedCountry?.code?.toLowerCase() || 'unknown'
    const newStatus   = files.map(() => 'uploading')
    setStatus([...newStatus])

    const uploadedPaths = []

    for (let i = 0; i < files.length; i++) {
      const file     = files[i]
      const safeName = slugify(file.name.replace(/\.[^.]+$/, '')) + '.' + file.name.split('.').pop()
      const destPath = `public/images/${countryCode}/${cityId}/${safeName}`

      try {
        const path = await uploadPhoto(file, destPath)
        uploadedPaths.push(path)
        newStatus[i] = 'done'
        setStatus([...newStatus])
      } catch (err) {
        newStatus[i] = `error: ${err.message}`
        setStatus([...newStatus])
      }
    }

    setPaths(uploadedPaths)
    onUploaded?.(uploadedPaths)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">City (determines folder location)</label>
        <select className="form-input" value={cityId} onChange={e => setCityId(e.target.value)}>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {selectedCountry && (
          <p className="text-2xs text-ink-400 mt-1 font-sans font-mono">
            Will upload to: public/images/{selectedCountry.code.toLowerCase()}/{cityId}/
          </p>
        )}
      </div>

      <div>
        <label className="form-label">Select photos</label>
        <div
          className="border-2 border-dashed border-parchment-300 rounded-sm p-8 text-center cursor-pointer hover:border-parchment-400 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <p className="text-sm text-ink-500">Click to select photos</p>
          <p className="text-xs text-ink-400 mt-1">JPG, PNG, WebP — multiple files allowed</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFiles}
          />
        </div>
      </div>

      {/* File list with status */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-3 py-2 bg-parchment-100 rounded-sm border border-parchment-200">
              <span className="font-sans text-ink-700 truncate">{file.name}</span>
              <span className={`ml-3 text-xs font-sans shrink-0 ${
                status[i] === 'done'        ? 'text-ink-500' :
                status[i] === 'uploading'   ? 'text-ink-400' :
                typeof status[i] === 'string' && status[i].startsWith('error') ? 'text-red-600' :
                'text-ink-400'
              }`}>
                {status[i] === 'done'      ? 'Uploaded' :
                 status[i] === 'uploading' ? 'Uploading...' :
                 typeof status[i] === 'string' && status[i].startsWith('error') ? status[i] :
                 'Ready'}
              </span>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          className="btn-primary"
          onClick={handleUpload}
          disabled={status.some(s => s === 'uploading')}
        >
          {status.some(s => s === 'uploading') ? 'Uploading...' : `Upload ${files.length} photo${files.length > 1 ? 's' : ''} to GitHub`}
        </button>
      )}

      {/* Show uploaded paths for copy-pasting into place notes */}
      {paths.length > 0 && (
        <div className="border border-parchment-300 rounded-sm p-4 bg-parchment-50">
          <p className="text-xs font-semibold tracking-wider uppercase text-ink-400 mb-2">
            Uploaded — add these paths to a place's photos:
          </p>
          <pre className="text-xs font-mono text-ink-700 whitespace-pre-wrap break-all">
            {JSON.stringify(paths, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
