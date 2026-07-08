// ═══════════════════════════════════════════════════════════════════
// Payment.jsx — ✅ Mode simulation ajouté + flux paiement corrigé
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return isMobile
}

function useReservation() {
  const [order, setOrder] = useState(null)
  useEffect(() => {
    const raw = sessionStorage.getItem('reservation')
    if (raw) {
      try {
        const r = JSON.parse(raw)
        const expiresIn = r.expires_at
          ? Math.max(0, Math.floor((new Date(r.expires_at) - new Date()) / 1000))
          : 600
        setOrder({
          terrainName:   r.land_title           || 'Terrain LandShare',
          location:      'Benin',
          sqm:           r.sqm                  || 0,
          pricePerSqm:   r.pricing?.unit_price   || 0,
          subtotal:      r.pricing?.subtotal     || 0,
          commission:    r.pricing?.commission   || 0,
          total:         r.pricing?.total        || 0,
          expiresIn,
          reservationId: r.reservation_id,
        })
      } catch { setOrder(null) }
    }
  }, [])
  return order
}

function Stepper({ current, isMobile }) {
  const steps = ['Selection', 'Paiement', 'Confirmation']
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? 18 : 28 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, background: i <= current ? '#1E3A2F' : 'transparent', border: `2px solid ${i <= current ? '#1E3A2F' : 'rgba(30,58,47,0.2)'}`, color: i <= current ? '#F5F0E8' : '#8C8278' }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 500, color: i <= current ? '#1E3A2F' : '#8C8278', whiteSpace: 'nowrap' }}>{step}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, margin: '0 6px', marginBottom: 18, background: i < current ? '#1E3A2F' : 'rgba(30,58,47,0.15)' }} />}
        </div>
      ))}
    </div>
  )
}

function Timer({ seconds, onExpire, compact }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (left <= 0) { onExpire?.(); return }
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  const urgent  = left < 120
  const display = `${String(Math.floor(left / 60)).padStart(2,'0')}:${String(left % 60).padStart(2,'0')}`
  if (compact) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 8, background: urgent ? 'rgba(192,57,43,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${urgent ? 'rgba(192,57,43,0.2)' : 'rgba(184,151,42,0.2)'}` }}>
      <span style={{ fontSize: '0.75rem' }}>{urgent ? '🔴' : '⏱️'}</span>
      <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: urgent ? '#C0392B' : '#1E3A2F' }}>{display}</strong>
    </div>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 10, background: urgent ? 'rgba(192,57,43,0.08)' : 'rgba(184,151,42,0.08)', border: `1px solid ${urgent ? 'rgba(192,57,43,0.22)' : 'rgba(184,151,42,0.22)'}`, marginBottom: 14 }}>
      <span>{urgent ? '🔴' : '⏱️'}</span>
      <div>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, margin: '0 0 1px', color: urgent ? '#C0392B' : '#8B6E1A' }}>{urgent ? 'Plus que quelques secondes !' : 'Reservation active'}</p>
        <p style={{ fontSize: '0.68rem', color: '#6B6459', margin: 0 }}>Expire dans <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: urgent ? '#C0392B' : '#1E3A2F' }}>{display}</strong></p>
      </div>
    </div>
  )
}

function OrderSummary({ order, showTimer, onExpire, compact }) {
  if (compact) return (
    <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(30,58,47,0.08)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1, marginRight: 10 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.terrainName}</p>
          <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>{order.sqm} m² - {order.location}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1E3A2F', margin: '0 0 1px' }}>{order.total.toLocaleString('fr-FR')} F</p>
          <p style={{ fontSize: '0.6rem', color: '#8C8278', margin: 0 }}>Commission incluse</p>
        </div>
      </div>
      {showTimer && <Timer seconds={order.expiresIn} onExpire={onExpire} compact={false} />}
    </div>
  )
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 14, boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: '14px 16px' }}>
        <p style={{ fontSize: '0.63rem', color: 'rgba(245,240,232,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>Recapitulatif</p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>{order.terrainName}</h3>
        <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.5)', margin: '2px 0 0' }}>{order.location}</p>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ marginBottom: 12 }}>
          {[['Parts achetees', `${order.sqm} m²`], ['Prix unitaire', `${order.pricePerSqm.toLocaleString('fr-FR')} FCFA`], ['Sous-total', `${order.subtotal.toLocaleString('fr-FR')} FCFA`], ['Commission (3%)', `${order.commission.toLocaleString('fr-FR')} FCFA`]].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', padding: '4px 0', color: '#6B6459', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
              <span>{l}</span><span style={{ fontFamily: 'monospace', color: '#4A3F35' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 0', borderTop: '1.5px solid rgba(30,58,47,0.1)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1A1A' }}>TOTAL TTC</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#1E3A2F' }}>{order.total.toLocaleString('fr-FR')} FCFA</span>
        </div>
        {showTimer && <div style={{ marginTop: 12 }}><Timer seconds={order.expiresIn} onExpire={onExpire} compact={false} /></div>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(30,58,47,0.06)' }}>
          {['SSL', 'Certifie', 'Attestation'].map(l => (
            <div key={l} style={{ fontSize: '0.62rem', color: '#8C8278' }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MoMoForm({ provider, color, textColor, onPhoneChange, isMobile }) {
  const [phone, setPhone]     = useState('')
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ background: '#FAFAF7', borderRadius: 12, padding: isMobile ? '14px' : '16px', marginTop: 12, border: '1px solid rgba(30,58,47,0.08)' }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#4A3F35', marginBottom: 5 }}>Numero {provider} Mobile Money *</label>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: '#4A3F35', fontWeight: 600, pointerEvents: 'none' }}>+229</div>
          <input type="tel" value={phone} onChange={e => { setPhone(e.target.value); onPhoneChange?.(e.target.value) }} placeholder="96 XX XX XX" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ width: '100%', padding: `${isMobile ? '13px' : '11px'} 12px ${isMobile ? '13px' : '11px'} 65px`, borderRadius: 9, border: `1.5px solid ${focused ? '#1E3A2F' : 'rgba(30,58,47,0.15)'}`, background: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', color: '#1A1A1A', outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', boxSizing: 'border-box' }} />
        </div>
        <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: '4px 0 0' }}>Format : +229 96/97 XX XX XX</p>
      </div>
      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4A3F35', margin: '0 0 8px' }}>Comment ca se passe :</p>
      {[`Cliquez Payer - demande envoyee a votre ${provider}`, 'Notification sur votre telephone', 'Saisissez votre PIN Mobile Money', 'Attestation PDF recue immediatement'].map((text, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: color, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.58rem', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
          <p style={{ fontSize: '0.7rem', color: '#6B6459', margin: 0, lineHeight: 1.5 }}>{text}</p>
        </div>
      ))}
    </div>
  )
}

function StripeForm({ isMobile }) {
  const [focused, setFocused] = useState(null)
  const inp = field => ({ width: '100%', padding: `${isMobile ? '13px' : '10px'} 12px`, borderRadius: 9, border: `1.5px solid ${focused === field ? '#1E3A2F' : 'rgba(30,58,47,0.15)'}`, background: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', color: '#1A1A1A', outline: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', boxSizing: 'border-box' })
  return (
    <div style={{ background: '#FAFAF7', borderRadius: 12, padding: isMobile ? '14px' : '16px', marginTop: 12, border: '1px solid rgba(30,58,47,0.08)' }}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4A3F35', marginBottom: 4 }}>Numero de carte</label>
        <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} onFocus={() => setFocused('card')} onBlur={() => setFocused(null)} style={inp('card')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 10 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4A3F35', marginBottom: 4 }}>Expiration</label>
          <input type="text" placeholder="MM / AA" maxLength={7} onFocus={() => setFocused('exp')} onBlur={() => setFocused(null)} style={inp('exp')} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4A3F35', marginBottom: 4 }}>CVV</label>
          <input type="text" placeholder="123" maxLength={4} onFocus={() => setFocused('cvv')} onBlur={() => setFocused(null)} style={inp('cvv')} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#4A3F35', marginBottom: 4 }}>Nom sur la carte</label>
        <input type="text" placeholder="FOUAD LIGALI" onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={inp('name')} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)' }}>
        <span>🔒</span>
        <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: 0 }}>Paiement securise via Stripe. Donnees non stockees.</p>
      </div>
    </div>
  )
}

// ─── Formulaire Simulation ─────────────────────────────────────────
function SimulationForm() {
  return (
    <div style={{ background: 'rgba(39,174,96,0.06)', borderRadius: 12, padding: '14px 16px', marginTop: 12, border: '1px solid rgba(39,174,96,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: '1.2rem' }}>🧪</span>
        <div>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E3A2F', margin: 0 }}>Mode test activé</p>
          <p style={{ fontSize: '0.65rem', color: '#6B6459', margin: 0 }}>Le paiement sera confirmé instantanément</p>
        </div>
      </div>
      {['Investissement créé et confirmé instantanément', 'Attestation PDF générée automatiquement', 'Ancrage blockchain déclenché', 'Notifications envoyées'].map((text, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem', color: '#27AE60' }}>✓</span>
          <p style={{ fontSize: '0.7rem', color: '#4A3F35', margin: 0 }}>{text}</p>
        </div>
      ))}
    </div>
  )
}

export default function Payment() {
  useFonts()
  const isMobile = useIsMobile()
  const navigate  = useNavigate()
  const order     = useReservation()
  const [method,  setMethod]  = useState('simulation') // ✅ simulation par défaut
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [expired, setExpired] = useState(false)
  const [phone,   setPhone]   = useState('')
  const [error,   setError]   = useState(null)

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  // ✅ Mode simulation ajouté dans la liste
  const methods = [
    { id: 'mtn',        label: 'MTN Mobile Money',    sub: 'Paiement instantane - MTN Benin',       icon: 'phone', badge: 'MTN',    badgeBg: '#FFCC00', badgeText: '#1A1A1A', popular: true  },
    { id: 'moov',       label: 'Moov Money',           sub: 'Paiement Mobile - Moov Afrique',        icon: 'phone', badge: 'MOOV',   badgeBg: '#0056A2', badgeText: '#FFFFFF', popular: false },
    { id: 'stripe',     label: 'Carte bancaire',       sub: 'Visa - Mastercard - Securise',          icon: 'card',  badge: 'STRIPE', badgeBg: '#635BFF', badgeText: '#FFFFFF', popular: false },
    { id: 'simulation', label: 'Simulation (test)',    sub: 'Confirme instantanement - Tests',       icon: 'test',  badge: 'TEST',   badgeBg: '#27AE60', badgeText: '#FFFFFF', popular: false },
  ]

  // ✅ CORRECTION — Flux paiement simplifié
  // L'ancien code appelait d'abord POST /investments puis POST /investments/{id}/confirm
  // ce qui créait un double traitement et bypassait PaymentController.
  // Le nouveau code appelle uniquement POST /investments — quand method=simulation,
  // PaymentController@initiate détecte la simulation, confirme le paiement,
  // génère l'attestation et déclenche l'ancrage blockchain en une seule étape.
  const handlePay = async () => {
    if (!order) return
    setLoading(true); setError(null)
    try {
      // Mapping méthode frontend → méthode API
      const apiMethod = {
        mtn:        'mtn_momo',
        moov:       'moov_money',
        stripe:     'stripe',
        simulation: 'simulation',
      }[method] || 'simulation'

      // ✅ Un seul appel — PaymentController@initiate gère tout
      const { data } = await api.post('/investments', {
        reservation_id: order.reservationId,
        method:         apiMethod,
        phone_number:   ['mtn', 'moov'].includes(method) ? phone : null,
      })

      const investmentId = data.investment?.id

      sessionStorage.removeItem('reservation')
      sessionStorage.setItem('investment_id', String(investmentId))
      navigate('/paiement/succes')

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du paiement. Reessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: 14 }}>⚠️</span>
        <p style={{ color: '#C0392B', fontWeight: 600, marginBottom: 7, fontSize: '0.88rem' }}>Aucune reservation active.</p>
        <p style={{ color: '#8C8278', fontSize: '0.78rem', marginBottom: 18 }}>Retournez sur un terrain et reservez vos m².</p>
        <Link to="/dashboard" style={{ padding: '10px 20px', background: '#1E3A2F', color: '#F5F0E8', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Dashboard</Link>
      </div>
    </div>
  )

  const PayBtn = (
    <button onClick={handlePay} disabled={loading || expired} style={{ width: '100%', padding: isMobile ? '15px' : '14px', borderRadius: 12, border: 'none', background: loading || expired ? 'rgba(30,58,47,0.4)' : method === 'simulation' ? 'linear-gradient(135deg, #27AE60, #2ECC71)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)', color: '#F5F0E8', fontSize: isMobile ? '1rem' : '0.88rem', fontWeight: 700, cursor: loading || expired ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading || expired ? 'none' : '0 4px 16px rgba(30,58,47,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'DM Sans', sans-serif", minHeight: 50 }}>
      {loading
        ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />Traitement...</>
        : expired
        ? 'Reservation expiree'
        : method === 'simulation'
        ? `🧪 Simuler le paiement — ${order.total.toLocaleString('fr-FR')} FCFA`
        : `Payer ${order.total.toLocaleString('fr-FR')} FCFA`
      }
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', fontFamily: "'DM Sans', sans-serif", fontSize: '13px' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(245,240,232,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(184,151,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 14px' : '0 5vw', height: isMobile ? 54 : 60, boxShadow: '0 2px 12px rgba(30,58,47,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#1E3A2F', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, background: '#B8972A', clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '0.88rem' : '0.95rem', fontWeight: 700, color: '#1E3A2F' }}>Land<span style={{ color: '#B8972A' }}>Share</span></span>
        </Link>
        {isMobile && order && !expired && <Timer seconds={order.expiresIn} onExpire={() => setExpired(true)} compact={true} />}
        {!isMobile && <div style={{ fontSize: '0.7rem', color: '#8C8278' }}>Terrain / <span style={{ color: '#1E3A2F', fontWeight: 600 }}>Paiement</span></div>}
        <Link to="/dashboard" style={{ padding: isMobile ? '6px 10px' : '6px 14px', borderRadius: 7, border: '1.5px solid rgba(30,58,47,0.2)', color: '#1E3A2F', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 600 }}>Retour</Link>
      </nav>

      <div style={{ maxWidth: isMobile ? '100%' : 900, margin: '0 auto', padding: isMobile ? '16px 14px 100px' : '32px 24px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.5s ease' }}>
        <div style={{ marginBottom: isMobile ? 14 : 24 }}>
          <p style={{ fontSize: '0.63rem', fontWeight: 700, color: '#B8972A', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>Etape 2 sur 3</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 14px' }}>Finaliser votre paiement</h1>
          <Stepper current={1} isMobile={isMobile} />
        </div>

        {isMobile && <OrderSummary order={order} showTimer={!expired} onExpire={() => setExpired(true)} compact={true} />}

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 280px', gap: isMobile ? 13 : 20, alignItems: 'start' }}>
          <div>
            {expired && (
              <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 10, padding: '11px 13px', marginBottom: 13, display: 'flex', gap: 8 }}>
                <span>⚠️</span>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C0392B', margin: '0 0 2px' }}>Reservation expiree</p>
                  <p style={{ fontSize: '0.68rem', color: '#6B6459', margin: 0 }}>Votre reservation est expiree. <Link to="/dashboard" style={{ color: '#1E3A2F', fontWeight: 600 }}>Recommencer</Link></p>
                </div>
              </div>
            )}
            {error && (
              <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 10, padding: '11px 13px', marginBottom: 13, display: 'flex', gap: 8 }}>
                <span>❌</span>
                <p style={{ fontSize: '0.78rem', color: '#C0392B', margin: 0 }}>{error}</p>
              </div>
            )}

            <div style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', marginBottom: 13 }}>
              <div style={{ padding: isMobile ? '12px 14px' : '14px 18px', borderBottom: '1px solid rgba(30,58,47,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(30,58,47,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}>💳</div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.92rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Mode de paiement</h2>
                  <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: 0 }}>Choisissez votre methode</p>
                </div>
              </div>
              <div style={{ padding: isMobile ? '12px 14px' : '16px 18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {methods.map(m => (
                    <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? '13px 12px' : '12px 14px', borderRadius: 10, border: `1.5px solid ${method === m.id ? (m.id === 'simulation' ? '#27AE60' : '#1E3A2F') : 'rgba(30,58,47,0.1)'}`, background: method === m.id ? (m.id === 'simulation' ? 'rgba(39,174,96,0.03)' : 'rgba(30,58,47,0.03)') : 'transparent', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', minHeight: 50 }}>
                      {m.popular && <span style={{ position: 'absolute', top: -7, right: 10, background: '#B8972A', color: '#fff', fontSize: '0.52rem', fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>Recommande</span>}
                      <div style={{ width: 17, height: 17, borderRadius: '50%', border: `2px solid ${method === m.id ? (m.id === 'simulation' ? '#27AE60' : '#1E3A2F') : 'rgba(30,58,47,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {method === m.id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.id === 'simulation' ? '#27AE60' : '#1E3A2F' }} />}
                      </div>
                      <div style={{ width: 40, height: 26, borderRadius: 5, background: m.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', fontWeight: 800, color: m.badgeText, flexShrink: 0 }}>{m.badge}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1A1A1A', margin: '0 0 1px' }}>{m.label}</p>
                        <p style={{ fontSize: '0.62rem', color: '#8C8278', margin: 0 }}>{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {method === 'mtn'        && <MoMoForm provider="MTN"  color="#FFCC00" textColor="#1A1A1A" onPhoneChange={setPhone} isMobile={isMobile} />}
                {method === 'moov'       && <MoMoForm provider="Moov" color="#0056A2" textColor="#FFFFFF" onPhoneChange={setPhone} isMobile={isMobile} />}
                {method === 'stripe'     && <StripeForm isMobile={isMobile} />}
                {method === 'simulation' && <SimulationForm />}
              </div>
            </div>

            {PayBtn}
            <p style={{ fontSize: '0.63rem', color: '#8C8278', textAlign: 'center', marginTop: 9, lineHeight: 1.5 }}>
              En cliquant Payer, vous acceptez nos <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 600 }}>CGU</a>.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(30,58,47,0.08)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.6rem', color: '#8C8278' }}>Securise :</span>
              {[['MTN','#FFCC00','#1A1A1A'],['MOOV','#0056A2','#fff'],['STRIPE','#635BFF','#fff'],['VISA','#E2E8F0','#4A3F35']].map(([l,bg,c]) => (
                <div key={l} style={{ padding: '3px 8px', borderRadius: 5, background: bg, color: c, fontSize: '0.52rem', fontWeight: 800 }}>{l}</div>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div style={{ position: 'sticky', top: 76 }}>
              <OrderSummary order={order} showTimer={!expired} onExpire={() => setExpired(true)} compact={false} />
              <div style={{ marginTop: 10, background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 7 }}>
                <p style={{ fontSize: '0.62rem', color: '#6B6459', margin: 0, lineHeight: 1.5 }}>Terrain certifie par <strong style={{ color: '#1E3A2F' }}>Maitre Kofi Akobi</strong>, Notaire a Cotonou.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#FFFFFF', borderTop: '1px solid rgba(30,58,47,0.1)', padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', boxShadow: '0 -4px 20px rgba(30,58,47,0.1)' }}>
          {PayBtn}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}