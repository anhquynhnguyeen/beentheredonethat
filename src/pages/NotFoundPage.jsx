import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-container py-24 text-center fade-in">
      <p className="eyebrow">404</p>
      <h1 className="mb-4">Page not found</h1>
      <p className="text-ink-500 mb-8">This destination doesn't exist in the archive.</p>
      <Link to="/" className="btn-primary">Return to map</Link>
    </div>
  )
}
