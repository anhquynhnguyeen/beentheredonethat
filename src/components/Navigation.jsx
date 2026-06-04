/**
 * Navigation.jsx
 * Top navigation bar. Minimal — wordmark left, links right.
 * On mobile, collapses to a hamburger menu.
 */

import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { hasLocalChanges } from '../utils/storage'

const NAV_LINKS = [
  { to: '/',          label: 'Map',       end: true },
  { to: '/countries', label: 'Countries' },
  { to: '/cities',    label: 'Cities'    },
  { to: '/places',    label: 'Places'    },
  { to: '/gallery',   label: 'Gallery'   },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const hasChanges = hasLocalChanges()

  const linkClass = ({ isActive }) =>
    `text-sm font-sans tracking-wide transition-colors duration-150 ${
      isActive
        ? 'text-ink-900 border-b border-ink-900 pb-0.5'
        : 'text-ink-500 hover:text-ink-900'
    }`

  return (
    <header className="sticky top-0 z-40 bg-parchment-100 border-b border-parchment-200">
      <div className="page-container">
        <nav className="flex items-center justify-between h-14">

          {/* Wordmark */}
          <Link
            to="/"
            className="font-serif text-lg text-ink-900 no-underline tracking-tight"
          >
            beentheredonethat
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                {label}
              </NavLink>
            ))}

            {/* Admin link — subtle, with dot indicator if local changes exist */}
            <NavLink to="/admin" className={linkClass}>
              <span className="relative">
                Admin
                {hasChanges && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </span>
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-ink-700 transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-ink-700 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-ink-700 transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 fade-in">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              Admin {hasChanges ? '(unsaved)' : ''}
            </NavLink>
          </div>
        )}
      </div>
    </header>
  )
}
