// ═══════════════════════════════════════════════════════════════════
// TerrainDetail.jsx — ✅ Connecté API + Responsive Mobile
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { landsApi, reservationsApi } from '../../services/landshareApi'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return isMobile
}

function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

// ── Navbar ─────────────────────────────────────────────────────────
function Navbar({ isMobile }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: isMobile ? 56 : 68,
      background: scrolled ? 'rgba(245,240,232,0.97)' : 'rgba(245,240,232,0.90)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(184,151,42,0.15)',
      boxShadow: scrolled ? '0 4px 24px rgba(30,58,47,0.08)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 5vw',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#1E3A2F', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 11, height: 11, background: '#B8972A', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: 700, color: '#1E3A2F' }}>
            Land<span style={{ color: '#B8972A' }}>Share</span>
          </span>
        </Link>
        {!isMobile && <>
          <span style={{ color: 'rgba(30,58,47,0.3)' }}>/</span>
          <span style={{ fontSize: '0.78rem', color: '#8C8278' }}>Terrains</span>
          <span style={{ color: 'rgba(30,58,47,0.3)' }}>/</span>
          <span style={{ fontSize: '0.78rem', color: '#1E3A2F', fontWeight: 600 }}>Détail</span>
        </>}
      </div>
      <Link to="/dashboard" style={{ padding: isMobile ? '7px 12px' : '8px 16px', borderRadius: 8, border: '1.5px solid rgba(30,58,47,0.2)', color: '#1E3A2F', textDecoration: 'none', fontSize: isMobile ? '0.75rem' : '0.82rem', fontWeight: 600 }}>
        ← {isMobile ? 'Retour' : 'Dashboard'}
      </Link>
    </nav>
  )
}

// ── Galerie photos ─────────────────────────────────────────────────
function PhotoGallery({ photos, isMobile }) {
  const [active, setActive] = useState(0)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ width: '100%', height: isMobile ? 220 : 320, borderRadius: isMobile ? 12 : 16, background: photos[active].gradient, position: 'relative', overflow: 'hidden', marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.4s ease' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `linear-gradient(rgba(245,240,232,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,.5) 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <span style={{ fontSize: isMobile ? '3.5rem' : '5rem', opacity: 0.2 }}>🏡</span>
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(30,58,47,0.85)', color: '#F5F0E8', fontSize: '0.63rem', fontWeight: 600 }}>🟢 Disponible</span>
          {!isMobile && <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(184,151,42,0.85)', color: '#1A1A1A', fontSize: '0.63rem', fontWeight: 600 }}>🏅 Certifié</span>}
        </div>
        <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', padding: '3px 10px', borderRadius: 7, fontSize: '0.63rem', color: 'rgba(245,240,232,0.9)' }}>{photos[active].label} · {active + 1}/{photos.length}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {photos.map((photo, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ flex: 1, height: isMobile ? 50 : 68, borderRadius: 8, background: photo.gradient, cursor: 'pointer', border: `2px solid ${i === active ? '#B8972A' : 'transparent'}`, opacity: i === active ? 1 : 0.5, transition: 'all 0.2s' }} />
        ))}
      </div>
    </div>
  )
}

// ── Tabs ───────────────────────────────────────────────────────────
function ContentTabs({ terrain, isMobile }) {
  const [activeTab, setActiveTab] = useState('presentation')
  const tabs = [
    { id: 'presentation', label: isMobile ? '📋' : '📋 Présentation' },
    { id: 'documents',    label: isMobile ? '📄' : '📄 Documents'    },
    { id: 'juridique',    label: isMobile ? '⚖️' : '⚖️ Juridique'   },
    { id: 'carte',        label: isMobile ? '🗺️' : '🗺️ Localisation' },
  ]
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '2px solid rgba(30,58,47,0.08)', marginBottom: 18, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: isMobile ? '9px 14px' : '10px 18px', border: 'none', cursor: 'pointer',
            background: 'transparent', fontFamily: "'DM Sans', sans-serif",
            fontSize: isMobile ? '0.82rem' : '0.875rem',
            fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? '#1E3A2F' : '#8C8278',
            borderBottom: `2px solid ${activeTab === tab.id ? '#1E3A2F' : 'transparent'}`,
            marginBottom: -2, transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'presentation' && (
        <div>
          <p style={{ fontSize: '0.82rem', color: '#4A3F35', lineHeight: 1.8, marginBottom: 14 }}>{terrain.description}</p>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: '#1A1A1A', marginBottom: 10 }}>Caractéristiques</h4>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 7, marginBottom: 14 }}>
            {terrain.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FAFAF7', borderRadius: 9, padding: '9px 12px', border: '1px solid rgba(30,58,47,0.06)' }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: 'rgba(30,58,47,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#1E3A2F', flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: '0.78rem', color: '#4A3F35', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
            {[{ label: 'Notaire', value: terrain.notary, icon: '🏛️' }, { label: 'Vérifié le', value: terrain.verifiedDate, icon: '📅' }, { label: 'Investisseurs', value: `${terrain.investors}`, icon: '👥' }].map(({ label, value, icon }) => (
              <div key={label} style={{ background: '#FAFAF7', borderRadius: 10, padding: '10px 8px', textAlign: 'center', border: '1px solid rgba(30,58,47,0.06)' }}>
                <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: 4 }}>{icon}</span>
                <p style={{ fontSize: '0.58rem', color: '#8C8278', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          {terrain.documents.length === 0 ? (
            <div style={{ background: '#FAFAF7', borderRadius: 12, padding: '24px', textAlign: 'center', border: '1px solid rgba(30,58,47,0.06)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>📄</span>
              <p style={{ fontSize: '0.8rem', color: '#8C8278', margin: 0 }}>Aucun document disponible.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {terrain.documents.map((doc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FAFAF7', borderRadius: 11, padding: '11px 13px', border: '1px solid rgba(30,58,47,0.06)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(192,57,43,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{doc.icon || '📄'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A1A', margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                    <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>{doc.type} · {doc.size}</p>
                  </div>
                  <button style={{ padding: '6px 11px', borderRadius: 7, background: '#1E3A2F', color: '#F5F0E8', border: 'none', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>⬇ PDF</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'juridique' && (
        <div>
          <div style={{ background: 'rgba(30,58,47,0.05)', borderLeft: '4px solid #1E3A2F', borderRadius: '0 10px 10px 0', padding: '12px 14px', marginBottom: 12 }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A2F', margin: '0 0 4px' }}>ℹ️ Nature de vos parts</h4>
            <p style={{ fontSize: '0.78rem', color: '#4A3F35', margin: 0, lineHeight: 1.7 }}>L'achat de parts vous donne un <strong>droit de co-propriété fractionnée</strong> sur le terrain.</p>
          </div>
          {[
            { title: 'Cadre légal',                content: "Conformément au droit OHADA et aux lois béninoises. Chaque transaction est tracée par un avocat partenaire." },
            { title: 'Risques & liquidité',        content: "Investissement de long terme. La revente n'est pas garantie à court terme." },
            { title: 'Protection investisseurs',   content: "Mécanisme d'arbitrage OHADA prévu. Les fonds sont séquestrés jusqu'à l'attribution." },
          ].map(({ title, content }, i) => (
            <div key={i} style={{ background: '#FAFAF7', borderRadius: 10, padding: '11px 13px', marginBottom: 7, border: '1px solid rgba(30,58,47,0.06)' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>{title}</h4>
              <p style={{ fontSize: '0.75rem', color: '#6B6459', margin: 0, lineHeight: 1.65 }}>{content}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'carte' && (
        <div>
          <p style={{ fontSize: '0.8rem', color: '#6B6459', marginBottom: 10 }}>📍 <strong style={{ color: '#1A1A1A' }}>{terrain.location}</strong></p>
          <div style={{ borderRadius: 11, overflow: 'hidden', border: '1px solid rgba(30,58,47,0.1)', marginBottom: 9 }}>
            <MapContainer center={[terrain.lat, terrain.lng]} zoom={15} style={{ height: isMobile ? 240 : 340, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[terrain.lat, terrain.lng]}>
                <Popup>
                  <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <strong style={{ color: '#1E3A2F' }}>{terrain.name}</strong><br />
                    <span style={{ fontSize: '0.75rem', color: '#8C8278' }}>{terrain.location}</span><br />
                    <span style={{ fontSize: '0.75rem', color: '#B8972A', fontWeight: 600 }}>{terrain.pricePerSqm?.toLocaleString('fr-FR')} FCFA / m²</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: '#FAFAF7', borderRadius: 9, padding: '9px 12px', border: '1px solid rgba(30,58,47,0.06)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#8C8278' }}>🛰️ GPS :</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#1E3A2F', fontWeight: 600 }}>{terrain.lat}° N, {terrain.lng}° E</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Barre de progression ───────────────────────────────────────────
function TerrainProgress({ terrain, isMobile }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect() } }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ background: '#FFFFFF', borderRadius: 14, padding: isMobile ? '13px 14px' : '18px 20px', boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', marginBottom: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Financement du terrain</h4>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(30,58,47,0.08)', color: '#1E3A2F' }}>{terrain.financed}% financé</span>
      </div>
      <div style={{ height: 7, background: '#EDE6D6', borderRadius: 4, overflow: 'hidden', marginBottom: 5 }}>
        <div style={{ height: '100%', borderRadius: 4, width: animated ? `${terrain.financed}%` : '0%', background: 'linear-gradient(90deg, #1E3A2F, #3D6B53)', transition: 'width 1.5s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#8C8278', marginBottom: 11 }}>
        <span>{(terrain.totalSqm - terrain.availableSqm).toLocaleString()} m² vendus</span>
        <span>{terrain.availableSqm.toLocaleString()} m² disponibles</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
        {[{ label: 'Total', value: `${terrain.totalSqm.toLocaleString()} m²` }, { label: 'Investisseurs', value: terrain.investors }, { label: 'Transactions', value: terrain.transactions }].map(({ label, value }) => (
          <div key={label} style={{ background: '#F5F0E8', borderRadius: 7, padding: '7px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.58rem', color: '#8C8278', margin: '0 0 2px' }}>{label}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BuyCard ────────────────────────────────────────────────────────
function BuyCard({ terrain, isMobile }) {
  const navigate = useNavigate()
  const [sqm,           setSqm]           = useState(5)
  const [reserved,      setReserved]      = useState(false)
  const [timeLeft,      setTimeLeft]      = useState(600)
  const [loadingReserv, setLoadingReserv] = useState(false)

  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const kycStatus = savedUser?.kyc_status || 'none'
  const kycOk     = kycStatus === 'validated'

  const subtotal   = sqm * terrain.pricePerSqm
  const commission = Math.round(subtotal * 0.03)
  const total      = subtotal + commission

  useEffect(() => {
    if (!reserved) return
    if (timeLeft <= 0) { setReserved(false); setTimeLeft(600); return }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [reserved, timeLeft])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const isUrgent = timeLeft < 120

  const handleBuy = async () => {
    if (!reserved) {
      setLoadingReserv(true)
      try {
        const { data } = await reservationsApi.create({ land_id: terrain.id, sqm_reserved: sqm })
        sessionStorage.setItem('reservation', JSON.stringify({
          reservation_id: data.reservation.id,
          land_title:     data.reservation.land_title,
          sqm:            data.reservation.sqm_reserved,
          pricing:        data.reservation.pricing,
          expires_at:     data.reservation.expires_at,
        }))
        setReserved(true)
      } catch (err) {
        const code = err.response?.data?.code
        if (code === 'KYC_REQUIRED') alert('⚠️ KYC requis avant d\'investir.')
        else alert(err.response?.data?.message || 'Erreur lors de la réservation.')
      } finally {
        setLoadingReserv(false)
      }
      return
    }
    navigate('/paiement')
  }

  const btnStyle = {
    borderRadius: 11, border: 'none',
    background: !kycOk ? 'rgba(30,58,47,0.25)' : reserved ? 'linear-gradient(135deg, #B8972A, #D4AD3A)' : loadingReserv ? 'rgba(30,58,47,0.4)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
    color: '#F5F0E8', fontWeight: 700,
    cursor: loadingReserv ? 'not-allowed' : 'pointer',
    boxShadow: !kycOk ? 'none' : '0 4px 16px rgba(30,58,47,0.28)',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    transition: 'all 0.2s',
  }

  const btnLabel = !kycOk ? '🪪 Vérifier mon identité →'
    : loadingReserv ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} /></>
    : reserved ? `💳 Payer ${total.toLocaleString('fr-FR')} F`
    : `🔒 Réserver ces ${sqm} m²`

  // ── MOBILE : barre fixe en bas ─────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          background: '#FFFFFF', borderTop: '1px solid rgba(30,58,47,0.1)',
          boxShadow: '0 -4px 24px rgba(30,58,47,0.12)',
          padding: '11px 16px',
          paddingBottom: 'calc(11px + env(safe-area-inset-bottom))',
        }}>
          {/* Ligne principale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {/* Prix + infos */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.6rem', color: '#8C8278', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total TTC</p>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1E3A2F' }}>{total.toLocaleString('fr-FR')} F</p>
              <p style={{ margin: 0, fontSize: '0.6rem', color: '#8C8278' }}>{sqm} m² · {terrain.pricePerSqm.toLocaleString('fr-FR')} F/m²</p>
            </div>

            {/* Sélecteur m² compact */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <button onClick={() => setSqm(s => Math.max(1, s - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(30,58,47,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#1E3A2F', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#1E3A2F', minWidth: 24, textAlign: 'center' }}>{sqm}</span>
              <button onClick={() => setSqm(s => Math.min(terrain.availableSqm, s + 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid rgba(30,58,47,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#1E3A2F', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>

            {/* Bouton CTA */}
            <button onClick={kycOk ? handleBuy : () => navigate('/dashboard')} disabled={loadingReserv}
              style={{ ...btnStyle, padding: '12px 14px', fontSize: '0.8rem', minWidth: 90, whiteSpace: 'nowrap' }}>
              {!kycOk ? '🪪 KYC' : loadingReserv ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} /> : reserved ? '💳 Payer' : '🔒 Réserver'}
            </button>
          </div>

          {/* Timer */}
          {reserved && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, background: isUrgent ? 'rgba(192,57,43,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${isUrgent ? 'rgba(192,57,43,0.2)' : 'rgba(184,151,42,0.2)'}` }}>
              <span>{isUrgent ? '🔴' : '⏱️'}</span>
              <p style={{ fontSize: '0.68rem', color: isUrgent ? '#C0392B' : '#8B6E1A', margin: 0 }}>
                Expire dans <strong style={{ fontFamily: 'monospace' }}>{formatTime(timeLeft)}</strong>
              </p>
              <button onClick={() => { setReserved(false); setTimeLeft(600) }} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '0.65rem', color: '#8C8278', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Annuler</button>
            </div>
          )}

          {/* Bannière KYC */}
          {!kycOk && (
            <div style={{ marginTop: 7, background: kycStatus === 'pending' ? 'rgba(99,91,255,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${kycStatus === 'pending' ? 'rgba(99,91,255,0.2)' : 'rgba(184,151,42,0.2)'}`, borderRadius: 8, padding: '7px 11px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: kycStatus === 'pending' ? '#635BFF' : '#8B6E1A', margin: '0 0 1px' }}>{kycStatus === 'pending' ? '⏳ Vérification en cours' : '⚠️ KYC requis'}</p>
              <p style={{ fontSize: '0.62rem', color: '#6B6459', margin: 0 }}>{kycStatus === 'pending' ? 'Disponible sous 24-48h.' : 'Vérifiez votre identité depuis le dashboard.'}</p>
            </div>
          )}
        </div>
        {/* Spacer */}
        <div style={{ height: reserved || !kycOk ? 140 : 85 }} />
      </>
    )
  }

  // ── DESKTOP : card sticky ──────────────────────────────────────
  return (
    <div style={{ position: 'sticky', top: 88, background: '#FFFFFF', borderRadius: 20, boxShadow: '0 8px 40px rgba(30,58,47,0.12)', border: '1px solid rgba(184,151,42,0.12)', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: '18px 20px' }}>
        <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Investir dans ce terrain</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#D4AD3A' }}>{terrain.pricePerSqm.toLocaleString('fr-FR')}</span>
          <span style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)' }}>FCFA / m²</span>
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        {/* Sélecteur */}
        <div style={{ marginBottom: 15 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4A3F35' }}>Nombre de m²</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <button onClick={() => setSqm(s => Math.max(1, s - 1))} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid rgba(30,58,47,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#1E3A2F', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: '#1E3A2F', minWidth: 34, textAlign: 'center' }}>{sqm}</span>
              <button onClick={() => setSqm(s => Math.min(terrain.availableSqm, s + 1))} style={{ width: 28, height: 28, borderRadius: 7, border: '1.5px solid rgba(30,58,47,0.2)', background: 'transparent', cursor: 'pointer', fontSize: '1rem', color: '#1E3A2F', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
          <input type="range" min={1} max={terrain.availableSqm} value={sqm} onChange={e => setSqm(Number(e.target.value))} style={{ width: '100%', accentColor: '#1E3A2F', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#8C8278', marginTop: 3 }}>
            <span>Min : 1 m²</span><span>Max : {terrain.availableSqm} m²</span>
          </div>
        </div>

        {/* Récap */}
        <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '12px', marginBottom: 13 }}>
          {[
            { label: 'Prix unitaire',   value: `${terrain.pricePerSqm.toLocaleString('fr-FR')} F` },
            { label: `× ${sqm} m²`,     value: `${subtotal.toLocaleString('fr-FR')} F`            },
            { label: 'Commission (3%)', value: `${commission.toLocaleString('fr-FR')} F`           },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', padding: '3px 0', color: '#6B6459' }}>
              <span>{label}</span><span style={{ fontFamily: 'monospace' }}>{value}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(30,58,47,0.1)', margin: '7px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1A1A1A' }}>TOTAL TTC</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#1E3A2F' }}>{total.toLocaleString('fr-FR')} F</span>
          </div>
        </div>

        {/* Timer */}
        {reserved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 9, marginBottom: 12, background: isUrgent ? 'rgba(192,57,43,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${isUrgent ? 'rgba(192,57,43,0.25)' : 'rgba(184,151,42,0.2)'}` }}>
            <span>{isUrgent ? '🔴' : '⏱️'}</span>
            <div>
              <p style={{ fontSize: '0.68rem', margin: '0 0 1px', fontWeight: 600, color: isUrgent ? '#C0392B' : '#8B6E1A' }}>{isUrgent ? 'Dépêchez-vous !' : 'Réservation active'}</p>
              <p style={{ margin: 0, fontSize: '0.68rem', color: '#6B6459' }}>Expire dans <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: isUrgent ? '#C0392B' : '#1E3A2F' }}>{formatTime(timeLeft)}</strong></p>
            </div>
          </div>
        )}

        {/* Bannière KYC */}
        {!kycOk && (
          <div style={{ background: kycStatus === 'pending' ? 'rgba(99,91,255,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${kycStatus === 'pending' ? 'rgba(99,91,255,0.2)' : 'rgba(184,151,42,0.2)'}`, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, margin: '0 0 2px', color: kycStatus === 'pending' ? '#635BFF' : '#8B6E1A' }}>{kycStatus === 'pending' ? '⏳ KYC en cours' : '⚠️ KYC requis'}</p>
            <p style={{ fontSize: '0.65rem', color: '#6B6459', margin: 0 }}>{kycStatus === 'pending' ? 'Disponible sous 24-48h.' : 'Vérifiez votre identité.'}</p>
          </div>
        )}

        {/* Bouton CTA */}
        <button onClick={kycOk ? handleBuy : () => navigate('/dashboard')} disabled={loadingReserv} style={{ ...btnStyle, width: '100%', padding: '13px', fontSize: '0.88rem' }}>{btnLabel}</button>

        {reserved && (
          <button onClick={() => { setReserved(false); setTimeLeft(600) }} style={{ width: '100%', marginTop: 7, padding: '8px', background: 'transparent', border: 'none', fontSize: '0.72rem', color: '#8C8278', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Annuler la réservation</button>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(30,58,47,0.08)' }}>
          {[{ icon: '🔒', label: 'SSL' }, { icon: '📱', label: 'MTN MoMo' }, { icon: '💳', label: 'Visa' }].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.62rem', color: '#8C8278' }}><span>{icon}</span><span>{label}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Composant principal ────────────────────────────────────────────
export default function TerrainDetail() {
  useFonts()
  const isMobile          = useIsMobile()
  const { id }            = useParams()
  const [terrain, setT]   = useState(null)
  const [loading, setL]   = useState(true)
  const [error,   setE]   = useState(null)
  const [mounted, setM]   = useState(false)
  const [hasTxHash, setHasTxHash] = useState(false)

useEffect(() => {
    const fetch = async () => {
      try {
        setL(true)
        const { data } = await landsApi.getOne(id)
        setT(data.land)

        // ✅ AJOUT — Vérifier si l'investisseur a un ancrage blockchain
        // sur ce terrain (tx_hash présent dans ses investissements)
        try {
          const { default: api } = await import('../../api/axios')
          const inv = await api.get('/investments')
          const found = (inv.data.investments || []).some(
            i => String(i.land?.id) === String(id) && i.tx_hash
          )
          setHasTxHash(found)
        } catch { /* pas connecté ou pas d'investissements → pas de badge */ }

      } catch { setE('Terrain introuvable ou indisponible.') }
      finally { setL(false) }
    }
    fetch()
    const t = setTimeout(() => setM(true), 100)
    return () => clearTimeout(t)
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', border: '3px solid rgba(30,58,47,0.15)', borderTopColor: '#1E3A2F', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: '#8C8278', fontSize: '0.85rem' }}>Chargement du terrain...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error || !terrain) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: 14 }}>🏚️</span>
        <p style={{ color: '#C0392B', fontWeight: 600 }}>{error || 'Terrain introuvable'}</p>
        <Link to="/dashboard" style={{ display: 'inline-block', marginTop: 14, padding: '10px 20px', background: '#1E3A2F', color: '#F5F0E8', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem' }}>← Retour</Link>
      </div>
    </div>
  )

  const tf = {
    id:           terrain.id,
    name:         terrain.title,
    subtitle:     terrain.subtitle || 'Terrain certifié notaire',
    location:     terrain.location || terrain.city,
    lat:          parseFloat(terrain.latitude)  || 6.3622,
    lng:          parseFloat(terrain.longitude) || 2.3158,
    totalSqm:     terrain.total_sqm,
    availableSqm: terrain.available_sqm,
    pricePerSqm:  parseFloat(terrain.price_per_sqm),
    rendement:    terrain.rendement + '%',
    financed:     terrain.funding_progress || 0,
    notary:       terrain.notary_name || 'Non renseigné',
    verifiedDate: terrain.published_at ? new Date(terrain.published_at).toLocaleDateString('fr-FR') : 'N/A',
    investors:    terrain.investors_count   || 0,
    transactions: terrain.investments_count || 0,
    description:  terrain.description || 'Description non disponible.',
    features:     ['Accès route bitumée', 'Titre foncier authentique', 'Plan cadastral officiel', terrain.notary_name ? `Vérifié par ${terrain.notary_name}` : 'Notaire certifié'],
    documents:    terrain.documents?.map(doc => ({ name: doc.file_name, type: 'PDF', size: doc.file_size_formatted || 'N/A', icon: '📄', verified: doc.is_verified })) || [],
    photos: [
      { gradient: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 50%, #3D6B53 100%)', label: 'Vue principale' },
      { gradient: 'linear-gradient(135deg, #2D5241 0%, #B8972A 60%, #D4AD3A 100%)', label: 'Vue est'        },
      { gradient: 'linear-gradient(135deg, #3D6B53 0%, #1E3A2F 60%, #2D5241 100%)', label: 'Vue nord'       },
      { gradient: 'linear-gradient(135deg, #B8972A 0%, #1E3A2F 50%, #3D6B53 100%)', label: 'Vue drone'      },
    ],
  }

  const navH = isMobile ? 56 : 88

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar isMobile={isMobile} />

      <div style={{ maxWidth: isMobile ? '100%' : 1200, margin: '0 auto', padding: `${navH + 14}px ${isMobile ? '14px' : '5vw'} 40px` }}>

        {/* En-tête */}
        <div style={{ marginBottom: 16, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s ease' }}>
         <div style={{ display: 'flex', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
            {[
              { text: '🟢 Disponible',       bg: 'rgba(30,58,47,0.08)',   color: '#1E3A2F' },
              { text: '🏅 Certifié notaire', bg: 'rgba(184,151,42,0.1)', color: '#8B6E1A' },
              { text: `📍 ${tf.location}`,   bg: 'rgba(30,58,47,0.05)',  color: '#6B6459' },
            ].map(({ text, bg, color }) => (
              <span key={text} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: bg, color }}>{text}</span>
            ))}

            {/* ✅ AJOUT — Badge blockchain si investissement ancré */}
            {hasTxHash && (
              <span style={{
                padding: '3px 10px', borderRadius: 20,
                fontSize: '0.6rem', fontWeight: 600,
                background: 'rgba(39,174,96,0.08)',
                color: '#27AE60',
                border: '1px solid rgba(39,174,96,0.2)',
              }}>
                ⛓️ Certifié blockchain
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.35rem' : 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em', margin: '0 0 3px' }}>{tf.name}</h1>
          <p style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#6B6459', margin: 0 }}>{tf.subtitle}</p>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: isMobile ? 13 : 24, alignItems: 'start' }}>
          {/* Colonne gauche */}
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)', transition: 'all 0.6s ease 0.1s' }}>
            <PhotoGallery photos={tf.photos} isMobile={isMobile} />
            <TerrainProgress terrain={tf} isMobile={isMobile} />
            <div style={{ background: '#FFFFFF', borderRadius: isMobile ? 12 : 16, padding: isMobile ? '14px' : '24px', boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)' }}>
              <ContentTabs terrain={tf} isMobile={isMobile} />
            </div>
          </div>

          {/* Colonne droite desktop */}
          {!isMobile && (
            <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(20px)', transition: 'all 0.6s ease 0.2s' }}>
              <BuyCard terrain={tf} isMobile={false} />
              <div style={{ marginTop: 10, background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 7 }}>
                <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0, lineHeight: 1.6 }}>Investissement à long terme. La revente de parts n'est pas garantie à court terme.</p>
              </div>
            </div>
          )}
        </div>

        {/* BuyCard mobile */}
        {isMobile && <BuyCard terrain={tf} isMobile={true} />}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { -webkit-appearance: none; height: 5px; background: linear-gradient(90deg, #1E3A2F, #3D6B53); border-radius: 3px; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #1E3A2F; cursor: pointer; border: 3px solid #F5F0E8; box-shadow: 0 2px 8px rgba(30,58,47,0.3); }
        .leaflet-container { font-family: 'DM Sans', sans-serif !important; }
      `}</style>
    </div>
  )
}