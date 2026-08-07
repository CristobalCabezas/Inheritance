import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

interface ApiStatus {
  status: string
  message: string
  backend: string
  database: string
}

function App() {
  const [apiData, setApiData] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    fetch(`${apiUrl}/health/`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setApiData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [apiUrl])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <img src={viteLogo} className="logo vite" alt="Vite logo" style={{ height: '4em' }} />
        <img src={reactLogo} className="logo react" alt="React logo" style={{ height: '4em' }} />
        <h1 style={{ fontSize: '2.5rem', margin: 0, color: '#38bdf8' }}>Django + React App</h1>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '1.5rem', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ marginTop: 0, color: '#94a3b8' }}>⚡ Estado del Entorno de Desarrollo</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#334155', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Frontend</span>
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: '#4ade80' }}>React + Vite + TS (Listo)</p>
          </div>

          <div style={{ background: '#334155', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Backend API</span>
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: loading ? '#facc15' : error ? '#f87171' : '#4ade80' }}>
              {loading ? 'Conectando...' : error ? 'Esperando inicio de Django...' : `${apiData?.backend} (DRF)`}
            </p>
          </div>

          <div style={{ background: '#334155', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Base de Datos</span>
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', color: loading ? '#facc15' : error ? '#94a3b8' : '#4ade80' }}>
              {loading ? 'Verificando...' : error ? 'PostgreSQL (Dev Container)' : apiData?.database}
            </p>
          </div>
        </div>

        {apiData && (
          <div style={{ marginTop: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
              <strong>Mensaje del servidor:</strong> {apiData.message}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        <p>Para levantar todo con Dev Container: abre VS Code y ejecuta <code>Reopen in Container</code> o usa <code>docker compose -f .devcontainer/docker-compose.yml up</code></p>
      </div>
    </div>
  )
}

export default App

