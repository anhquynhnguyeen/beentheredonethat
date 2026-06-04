/**
 * Layout.jsx
 * Shell that wraps every page: Navigation + main content area + footer.
 */

import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col bg-parchment-100">
      <Navigation />

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-parchment-200 py-6 mt-12">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-serif text-sm text-ink-400">beentheredonethat</span>
          <span className="text-2xs font-sans tracking-wider uppercase text-ink-400">
            A personal travel archive
          </span>
        </div>
      </footer>
    </div>
  )
}
