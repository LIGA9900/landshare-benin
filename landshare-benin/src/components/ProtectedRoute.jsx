// ═══════════════════════════════════════════════════════════════════
// ProtectedRoute.jsx — Protection des routes
// ═══════════════════════════════════════════════════════════════════
import { Navigate } from 'react-router-dom'

// ─── Route investisseur — admin redirigé vers /admin ──────────────
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token)                   return <Navigate to="/connexion" replace />
  if (user?.role === 'admin')   return <Navigate to="/admin"     replace />
  return children
}

// ─── Route admin — investisseur redirigé vers /dashboard ──────────
export function AdminRoute({ children }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token)                   return <Navigate to="/connexion" replace />
  if (user?.role !== 'admin')   return <Navigate to="/dashboard" replace />
  return children
}

// ─── Route publique — redirige si déjà connecté ───────────────────
export function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')

  if (token) {
    if (user?.role === 'admin') return <Navigate to="/admin"     replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}