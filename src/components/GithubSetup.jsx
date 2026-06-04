/**
 * GithubSetup.jsx
 *
 * One-time setup panel for the GitHub API connection.
 * Shown in Admin Mode when no token is configured.
 * After saving, the token lives in localStorage and is used
 * for all subsequent saves.
 */

import { useState } from 'react'
import {
  saveGithubConfig,
  loadGithubConfig,
  clearGithubConfig,
  testConnection,
} from '../utils/github'

export default function GithubSetup({ onConnected }) {
  const existing = loadGithubConfig()

  const [form, setForm]     = useState({
    owner:  existing?.owner  || '',
    repo:   existing?.repo   || 'beentheredonethat',
    token:  existing?.token  || '',
    branch: existing?.branch || 'main',
  })
  const [status, setStatus] = useState(null) // null | 'testing' | 'ok' | 'error'
  const [error,  setError]  = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleConnect(e) {
    e.preventDefault()
    setStatus('testing')
    setError('')
    try {
      await testConnection(form)
      saveGithubConfig(form)
      setStatus('ok')
      setTimeout(() => onConnected?.(), 600)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  function handleDisconnect() {
    clearGithubConfig()
    setForm({ owner: '', repo: 'beentheredonethat', token: '', branch: 'main' })
    setStatus(null)
  }

  return (
    <div className="border border-parchment-300 rounded-sm p-6 bg-parchment-50 max-w-lg">
      <h4 className="mb-1">Connect to GitHub</h4>
      <p className="text-sm text-ink-500 mb-5 leading-relaxed">
        Enter your repository details once. All saves will commit directly to your repo —
        no downloading files or running <code className="font-mono text-xs">npm run deploy</code> after each edit.
      </p>

      <form onSubmit={handleConnect} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">GitHub username</label>
            <input
              className="form-input"
              value={form.owner}
              onChange={set('owner')}
              placeholder="your-username"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="form-label">Repository name</label>
            <input
              className="form-input"
              value={form.repo}
              onChange={set('repo')}
              placeholder="beentheredonethat"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label className="form-label">
            Personal Access Token
            <a
              href="https://github.com/settings/tokens/new?description=beentheredonethat&scopes=repo"
              target="_blank"
              rel="noreferrer"
              className="ml-2 font-normal normal-case tracking-normal text-accent no-underline hover:underline"
            >
              Generate one &rarr;
            </a>
          </label>
          <input
            className="form-input font-mono text-sm"
            type="password"
            value={form.token}
            onChange={set('token')}
            placeholder="ghp_xxxxxxxxxxxx"
            required
            autoComplete="new-password"
          />
          <p className="text-2xs text-ink-400 mt-1 font-sans">
            Stored only in your browser's localStorage. Required scopes: <strong>repo</strong> (classic token)
            or <strong>Contents: read &amp; write</strong> (fine-grained token).
          </p>
        </div>

        <div>
          <label className="form-label">Branch</label>
          <input
            className="form-input"
            value={form.branch}
            onChange={set('branch')}
            placeholder="main"
          />
        </div>

        {/* Status feedback */}
        {status === 'error' && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-sm px-3 py-2">
            {error}
          </div>
        )}
        {status === 'ok' && (
          <div className="text-sm text-ink-700 bg-parchment-200 border border-parchment-300 rounded-sm px-3 py-2">
            Connected successfully.
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={status === 'testing'}
            className="btn-primary disabled:opacity-50"
          >
            {status === 'testing' ? 'Testing connection...' : 'Connect'}
          </button>

          {existing?.token && (
            <button type="button" className="btn-danger" onClick={handleDisconnect}>
              Disconnect
            </button>
          )}
        </div>
      </form>

      {/* How to create a token — step by step */}
      <details className="mt-6">
        <summary className="text-xs font-sans font-semibold tracking-wider uppercase text-ink-400 cursor-pointer select-none">
          How to create a token
        </summary>
        <ol className="mt-3 text-sm text-ink-500 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>
            Click the "Generate one" link above, or go to{' '}
            <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-accent">
              github.com/settings/tokens
            </a>
          </li>
          <li>Choose <strong>Generate new token (classic)</strong></li>
          <li>Give it a name: <code className="font-mono text-xs">beentheredonethat</code></li>
          <li>Check the <strong>repo</strong> scope (full control of private repositories)</li>
          <li>Click <strong>Generate token</strong> and copy it</li>
          <li>Paste it in the field above — you only need to do this once</li>
        </ol>
      </details>
    </div>
  )
}
