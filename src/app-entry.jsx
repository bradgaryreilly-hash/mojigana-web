import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            background: '#0f172a',
            color: '#f8fafc',
            minHeight: '100vh',
            boxSizing: 'border-box',
          }}
        >
          <h1 style={{ fontSize: 18, margin: '0 0 12px' }}>Something went wrong</h1>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 12,
              opacity: 0.9,
              margin: 0,
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root')
}

try {
  const root = createRoot(rootEl)
  root.render(
    <StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  rootEl.innerHTML = `<div style="padding:24px;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;min-height:100vh;box-sizing:border-box"><p style="font-weight:700;margin:0 0 8px">Could not start</p><pre style="white-space:pre-wrap;font-size:12px;margin:0;opacity:.9">${String(e?.message || e)}</pre></div>`
}
