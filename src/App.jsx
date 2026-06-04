/**
 * App.jsx
 *
 * Root component. Sets up React Router with all routes.
 *
 * Route structure:
 *   /                     → HomePage      (world map + stats)
 *   /countries            → CountriesPage (grid of all countries)
 *   /countries/:id        → CountryPage   (country detail + map + cities)
 *   /cities               → CitiesPage    (all cities grouped by country)
 *   /cities/:id           → CityPage      (city detail + map + places)
 *   /places               → PlacesPage    (all places with filter)
 *   /places/:id           → PlacePage     (place detail + gallery)
 *   /gallery              → GalleryPage   (all photos, masonry)
 *   /admin                → AdminPage     (add/edit/delete entries)
 *   *                     → NotFoundPage
 */

import { Routes, Route } from 'react-router-dom'
import Layout         from './components/Layout'
import HomePage       from './pages/HomePage'
import CountriesPage  from './pages/CountriesPage'
import CountryPage    from './pages/CountryPage'
import CitiesPage     from './pages/CitiesPage'
import CityPage       from './pages/CityPage'
import PlacesPage     from './pages/PlacesPage'
import PlacePage      from './pages/PlacePage'
import GalleryPage    from './pages/GalleryPage'
import AdminPage      from './pages/AdminPage'
import NotFoundPage   from './pages/NotFoundPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                 element={<HomePage />}      />
        <Route path="/countries"        element={<CountriesPage />} />
        <Route path="/countries/:id"    element={<CountryPage />}   />
        <Route path="/cities"           element={<CitiesPage />}    />
        <Route path="/cities/:id"       element={<CityPage />}      />
        <Route path="/places"           element={<PlacesPage />}    />
        <Route path="/places/:id"       element={<PlacePage />}     />
        <Route path="/gallery"          element={<GalleryPage />}   />
        <Route path="/admin"            element={<AdminPage />}     />
        <Route path="*"                 element={<NotFoundPage />}  />
      </Routes>
    </Layout>
  )
}
