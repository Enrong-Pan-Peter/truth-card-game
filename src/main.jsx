import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { inject } from '@vercel/analytics'
import App from './App.jsx'
import AdminPage from './components/AdminPage.jsx'
import './index.css'

if (import.meta.env.PROD) inject()

// Tiny hash router: /#/admin → question-bank admin, everything else → the game.
function Root() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return hash.startsWith('#/admin') ? <AdminPage /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
