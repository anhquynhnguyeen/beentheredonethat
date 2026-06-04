/**
 * main.jsx
 * Application entry point.
 *
 * Uses HashRouter so GitHub Pages works without server configuration.
 * URLs appear as /#/countries, /#/cities, etc.
 *
 * To switch to clean URLs (/countries, /cities) when deploying to
 * Netlify/Vercel/Cloudflare Pages: replace HashRouter with BrowserRouter.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

// Fix Leaflet's default marker icon paths — broken by Vite's asset pipeline.
// Must be imported before any Leaflet component renders.
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

import App           from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
