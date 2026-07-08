import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute'

// Pages investisseur
import Landing        from './pages/Landing'
import Login          from './pages/auth/Login'
import Register       from './pages/auth/Register'
import Dashboard      from './pages/investor/Dashboard'
import TerrainDetail  from './pages/investor/TerrainDetail'
import Payment        from './pages/investor/Payment'
import PaymentSuccess from './pages/investor/PaymentSuccess'
import VerifierPage   from './pages/VerifierPage'

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard'
import StatsPage      from './pages/admin/StatsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Pages publiques ── */}
        <Route path="/" element={<Landing />} />

        {/* ── Auth — redirige si déjà connecté ── */}
        <Route path="/connexion"   element={<PublicRoute><Login /></PublicRoute>}    />
        <Route path="/inscription" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ── Routes investisseur — connexion requise ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/terrains/:id" element={
          <ProtectedRoute><TerrainDetail /></ProtectedRoute>
        } />
        <Route path="/paiement" element={
          <ProtectedRoute><Payment /></ProtectedRoute>
        } />
        <Route path="/paiement/succes" element={
          <ProtectedRoute><PaymentSuccess /></ProtectedRoute>
        } />

        {/* ── Routes admin — admin requis ── */}
        <Route path="/admin"              element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/utilisateurs" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/terrains"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/kyc"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/statistiques" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* ── Vérification publique ── */}
        <Route path="/verifier"        element={<VerifierPage />} />
        <Route path="/verifier/:query" element={<VerifierPage />} />

        {/* ── 404 ── */}
        <Route path="*" element={
          <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#F5F0E8',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(30,58,47,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1E3A2F" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                  <line x1="12" y1="2" x2="12" y2="2"/>
                </svg>
              </div>
              <h1 style={{
                color: '#1E3A2F', fontFamily: 'Playfair Display, serif',
                fontSize: '2rem', fontWeight: 700, margin: '0 0 8px',
              }}>
                Page introuvable
              </h1>
              <p style={{ color: '#8C8278', fontSize: '0.85rem', margin: '0 0 24px' }}>
                La page que vous cherchez n'existe pas ou a été déplacée.
              </p>
              <Link to="/" style={{
                padding: '10px 24px', borderRadius: 12,
                background: '#B8972A', color: '#F5F0E8',
                textDecoration: 'none', fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
              }}>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App