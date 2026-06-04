/**
 * ErrorBoundary.jsx
 *
 * Catches JavaScript errors anywhere in the component tree.
 * Without this, any unhandled error causes a blank white screen.
 * With this, you see the actual error message.
 *
 * Usage: wrap your root <App /> with <ErrorBoundary>
 */

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    console.error('[beentheredonethat] Unhandled error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          maxWidth: '640px',
          margin: '80px auto',
          padding: '0 24px',
        }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9a8f78', marginBottom: '8px' }}>
            Application error
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1e1c18', marginBottom: '16px' }}>
            Something went wrong
          </h2>
          <pre style={{
            background: '#f0ece0',
            border: '1px solid #d4ccb8',
            borderRadius: '2px',
            padding: '16px',
            fontSize: '12px',
            color: '#5c584f',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {this.state.error?.message}
            {this.state.info?.componentStack}
          </pre>
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#7a7060' }}>
            Open your browser DevTools (F12 → Console) for more details.{' '}
            <button
              onClick={() => this.setState({ error: null, info: null })}
              style={{ color: '#8b6f4e', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
            >
              Try again
            </button>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
