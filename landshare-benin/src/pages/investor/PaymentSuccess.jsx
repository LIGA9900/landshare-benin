// ═══════════════════════════════════════════════════════════════════
// PaymentSuccess.jsx — ✅ Connecté API + Responsive Mobile
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const C = {
  bg: '#F5F0E8', surface: '#FFFFFF', green: '#1E3A2F', green2: '#2D5241',
  gold: '#B8972A', goldTxt: '#D4AD3A', text: '#1A1A1A', muted: '#8C8278', subtle: '#6B6459',
}

function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    link.rel  = 'stylesheet'
    document.head.appendChild(link)
  }, [])
}

function useIsMobile() {
  const [v, set] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => set(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

function Stepper({ isMobile }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? 16 : 28 }}>
      {['Sélection', 'Paiement', 'Confirmation'].map((step, i, arr) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: '50%', background: C.green, border: `2px solid ${C.green}`, color: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
            <span style={{ fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 500, color: C.green, whiteSpace: 'nowrap' }}>{step}</span>
          </div>
          {i < arr.length - 1 && <div style={{ flex: 1, height: 1.5, margin: '0 6px', marginBottom: 18, background: C.green }} />}
        </div>
      ))}
    </div>
  )
}

function SuccessIcon({ size }) {
  const [anim, setAnim] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnim(true), 100); return () => clearTimeout(t) }, [])
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 28px rgba(30,58,47,0.3)', transform: anim ? 'scale(1)' : 'scale(0.4)', opacity: anim ? 1 : 0, transition: 'transform 0.5s cubic-bezier(.175,.885,.32,1.275), opacity 0.4s ease', flexShrink: 0 }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 34 34" fill="none">
        <path d="M8 17L14 23L26 11" stroke="#F5F0E8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 30, strokeDashoffset: anim ? 0 : 30, transition: 'stroke-dashoffset 0.5s ease 0.35s' }} />
      </svg>
    </div>
  )
}

function ConfirmationBanner({ data, isMobile }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t) }, [])
  return (
    <div style={{ background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)', borderRadius: 16, padding: isMobile ? '16px 14px' : '22px 28px', boxShadow: '0 4px 20px rgba(30,58,47,0.2)', transform: show ? 'translateY(0)' : 'translateY(-12px)', opacity: show ? 1 : 0, transition: 'all 0.45s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 11 : 14, marginBottom: 12 }}>
        <SuccessIcon size={isMobile ? 50 : 72} />
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'rgba(245,240,232,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Paiement confirmé</p>
          <h2 style={{ margin: '0 0 3px', fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1rem' : '1.3rem', fontWeight: 700, color: '#F5F0E8' }}>Investissement réussi 🎉</h2>
          <p style={{ margin: 0, fontSize: '0.63rem', color: 'rgba(245,240,232,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ID : <strong style={{ color: C.goldTxt, fontFamily: 'monospace' }}>{data.investissement.transactionId}</strong>
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[['📐', `${data.investissement.sqm} m²`], ['💰', `${data.investissement.total.toLocaleString('fr-FR')} F`], ['📲', data.investissement.methode], ['📅', data.generatedAt]].map(([e, v]) => (
          <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,240,232,0.08)', border: '1px solid rgba(245,240,232,0.12)', borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ fontSize: '0.75rem' }}>{e}</span>
            <span style={{ fontSize: '0.63rem', color: 'rgba(245,240,232,0.8)', fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttestationCard({ data, isMobile }) {
  const [copied, setCopied] = useState(false)
  const rows = [
    ['Investisseur', data.investisseur.nom], ['Email', data.investisseur.email], ['Pays', data.investisseur.pays],
    ['Terrain', data.terrain.nom], ['Localisation', data.terrain.localisation], ['Référence', data.terrain.reference],
    ['Parts acquises', `${data.investissement.sqm} m²`, true],
    ['Montant payé', `${data.investissement.total.toLocaleString('fr-FR')} FCFA`, true],
    ['Méthode', data.investissement.methode], ['Confirmé le', data.investissement.confirmedAt], ['Notaire', data.terrain.notaire],
  ]
  return (
    <div style={{ background: C.surface, borderRadius: 14, boxShadow: '0 2px 14px rgba(30,58,47,0.08)', border: '1px solid rgba(30,58,47,0.07)', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: isMobile ? '13px 14px' : '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '0.56rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Certificat de propriété fractionnée</p>
          <h3 style={{ margin: '0 0 4px', fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 700, color: '#F5F0E8' }}>LandShare Bénin</h3>
          <span style={{ background: 'rgba(184,151,42,0.25)', border: '1px solid rgba(184,151,42,0.4)', borderRadius: 6, padding: '2px 8px', fontSize: '0.58rem', fontWeight: 700, color: C.goldTxt, fontFamily: 'monospace' }}>{data.numero}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.3)', borderRadius: 10, padding: '7px 11px' }}>
          <span style={{ fontSize: '1.2rem' }}>🏅</span>
          <span style={{ fontSize: '0.53rem', fontWeight: 700, color: C.goldTxt, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Certifié</span>
        </div>
      </div>
      <div style={{ padding: isMobile ? '11px 14px' : '14px 18px' }}>
        {rows.map(([l, v, h]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
            <span style={{ fontSize: '0.67rem', color: C.subtle, flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: '0.68rem', fontWeight: h ? 700 : 500, color: h ? C.green : '#4A3F35', fontFamily: h ? "'Playfair Display', serif" : 'inherit', textAlign: 'right', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10 }}>
          <p style={{ margin: '0 0 5px', fontSize: '0.58rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔐 Hash SHA-256</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <code style={{ fontSize: '0.58rem', color: C.green, fontFamily: 'monospace', background: 'rgba(30,58,47,0.06)', padding: '3px 7px', borderRadius: 5, flex: 1, minWidth: 0, wordBreak: 'break-all', border: '1px solid rgba(30,58,47,0.1)' }}>{data.hash}</code>
            <button onClick={() => { navigator.clipboard.writeText(data.hash); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: copied ? C.green : 'rgba(30,58,47,0.08)', color: copied ? '#F5F0E8' : C.green, fontSize: '0.6rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
              {copied ? '✓ Copié' : 'Copier'}
            </button>
          </div>
        </div>
        <p style={{ marginTop: 10, fontSize: '0.6rem', color: C.muted, lineHeight: 1.55, textAlign: 'center' }}>
          Certificat vérifiable hors-ligne par son hash SHA-256.
        </p>
      </div>
    </div>
  )
}

function ActionButtons({ isMobile, investmentId }) {
  const navigate  = useNavigate()
  const [dl, setDl] = useState(false)
  const download  = async () => {
    if (!investmentId) return
    setDl(true)
    try {
      const res  = await api.get(`/investments/${investmentId}/attestation`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([res.data]))
      const a    = document.createElement('a')
      a.href     = url; a.download = `Attestation_LandShare_${investmentId}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
      window.URL.revokeObjectURL(url)
    } catch { alert('Erreur téléchargement.') }
    finally { setDl(false) }
  }
  const base = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: isMobile ? '14px' : '12px 18px', borderRadius: 11, border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', minHeight: isMobile ? 50 : 'auto' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <button onClick={download} disabled={dl} style={{ ...base, width: '100%', background: dl ? 'rgba(30,58,47,0.45)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)', color: '#F5F0E8', boxShadow: dl ? 'none' : '0 4px 16px rgba(30,58,47,0.28)' }}>
        {dl ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />Génération...</> : '📄 Télécharger mon attestation PDF'}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => navigate('/dashboard')} style={{ ...base, background: 'rgba(30,58,47,0.07)', color: C.green, border: '1px solid rgba(30,58,47,0.12)' }}>📊 {isMobile ? 'Dashboard' : 'Mon tableau de bord'}</button>
        <button onClick={() => navigate('/dashboard')} style={{ ...base, background: 'rgba(184,151,42,0.1)', color: '#8B6D14', border: '1px solid rgba(184,151,42,0.22)' }}>🗺️ {isMobile ? 'Terrains' : 'Explorer les terrains'}</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 12, borderTop: '1px solid rgba(30,58,47,0.08)' }}>
        <span style={{ fontSize: '0.62rem', color: C.muted }}>Partager :</span>
        {[['📧','Email',() => window.location.href='mailto:?subject=Attestation LandShare'], ['💬','WhatsApp',() => window.open("https://wa.me/?text=J'ai investi sur LandShare !")], ['🔗','Copier',() => navigator.clipboard.writeText(window.location.href)]].map(([e,l,fn]) => (
          <button key={l} onClick={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', minHeight: isMobile ? 44 : 'auto' }}>
            <span style={{ fontSize: '1rem' }}>{e}</span>
            <span style={{ fontSize: '0.58rem', color: C.muted }}>{l}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RightPanel({ data, isMobile }) {
  const steps = [
    { icon: '✅', title: 'Paiement confirmé',      sub: 'Transaction traitée avec succès',   done: true  },
    { icon: '📄', title: 'Attestation générée',     sub: 'PDF disponible au téléchargement', done: true  },
    { icon: '🔍', title: 'Enregistrement foncier',  sub: "Traitement par l'opérateur (48h)", done: false },
    { icon: '📬', title: 'Email de confirmation',   sub: `Envoyé à ${data.investisseur.email}`, done: true },
    { icon: '💼', title: 'Portefeuille mis à jour', sub: 'Visible dans votre dashboard',     done: true  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Récap */}
      <div style={{ background: C.surface, borderRadius: 14, boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: '12px 16px' }}>
          <p style={{ margin: '0 0 2px', fontSize: '0.6rem', color: 'rgba(245,240,232,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Récapitulatif</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: '#F5F0E8', margin: 0 }}>{data.terrain.nom}</h3>
          <p style={{ fontSize: '0.63rem', color: 'rgba(245,240,232,0.5)', margin: '2px 0 0' }}>📍 {data.terrain.localisation}</p>
        </div>
        <div style={{ padding: '12px 16px' }}>
          {[['Parts acquises',`${data.investissement.sqm} m²`],['Prix/m²',`${data.investissement.pricePerSqm.toLocaleString('fr-FR')} F`],['Sous-total',`${data.investissement.subtotal.toLocaleString('fr-FR')} F`],['Commission (3%)',`${data.investissement.commission.toLocaleString('fr-FR')} F`]].map(([l,v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0', color: C.subtle, borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
              <span>{l}</span><span style={{ fontFamily: 'monospace', color: '#4A3F35' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0 0', borderTop: '1.5px solid rgba(30,58,47,0.1)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text }}>TOTAL TTC</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.green }}>{data.investissement.total.toLocaleString('fr-FR')} F</span>
          </div>
        </div>
      </div>
      {/* Étapes */}
      <div style={{ background: C.surface, borderRadius: 14, boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', padding: '14px 16px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '0.68rem', fontWeight: 600, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prochaines étapes</p>
        {steps.map(({ icon, title, sub, done }, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < arr.length - 1 ? 10 : 0, opacity: done ? 1 : 0.55 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: done ? 'rgba(30,58,47,0.09)' : 'rgba(140,130,120,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem' }}>{icon}</div>
            <div>
              <p style={{ margin: '0 0 1px', fontSize: '0.7rem', fontWeight: 600, color: done ? C.text : C.muted }}>{title}</p>
              <p style={{ margin: 0, fontSize: '0.62rem', color: C.muted, lineHeight: 1.4 }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 7 }}>
        <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>🏅</span>
        <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>Terrain certifié par <strong style={{ color: C.green }}>{data.terrain.notaire}</strong>, Notaire à Cotonou.</p>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  useFonts()
  const isMobile        = useIsMobile()
  const [att, setAtt]   = useState(null)
  const [loading, setL] = useState(true)
  const [error, setE]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const id = sessionStorage.getItem('investment_id')
        if (!id) { setE('Aucun investissement trouvé.'); setL(false); return }
        const { data } = await api.get(`/investments/${id}`)
        const inv = data.investment
        setAtt({
          numero:      `ATT-${new Date().getFullYear()}-LS-${String(inv.id).padStart(5,'0')}`,
          hash:        inv.certificate_url || 'hash-en-attente',
          generatedAt: inv.confirmed_at ? new Date(inv.confirmed_at).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}) : "Aujourd'hui",
          investisseur: { nom: inv.investor?.name || 'Investisseur', email: inv.investor?.email || '', pays: '🌍 Afrique' },
          terrain: { nom: inv.land?.title || 'Terrain LandShare', localisation: inv.land?.location || inv.land?.city || 'Bénin', reference: `TRN-${String(inv.land?.id||0).padStart(3,'0')}`, notaire: inv.land?.notary_name || 'Notaire certifié' },
          investissement: { id: inv.id, sqm: inv.sqm_bought, pricePerSqm: parseFloat(inv.unit_price), subtotal: parseFloat(inv.subtotal), commission: parseFloat(inv.commission), total: parseFloat(inv.total_paid), methode: inv.payments?.[0]?.method || 'N/A', transactionId: inv.reference, confirmedAt: inv.confirmed_at ? new Date(inv.confirmed_at).toLocaleString('fr-FR') : 'N/A' },
        })
      } catch { setE("Impossible de charger les données.") }
      finally { setL(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', border: '3px solid rgba(30,58,47,0.15)', borderTopColor: C.green, animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: C.muted, fontSize: '0.85rem' }}>Chargement de votre attestation...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error || !att) return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: 14 }}>⚠️</span>
        <p style={{ color: '#DC3545', fontWeight: 600, marginBottom: 14 }}>{error || 'Données introuvables'}</p>
        <Link to="/dashboard" style={{ padding: '10px 20px', background: C.green, color: '#F5F0E8', borderRadius: 10, textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</Link>
      </div>
    </div>
  )

  const investmentId = sessionStorage.getItem('investment_id')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,240,232,0.94)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(30,58,47,0.08)', padding: isMobile ? '10px 16px' : '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.72rem' }}>🌿</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '0.88rem' : '0.95rem', fontWeight: 700, color: C.green }}>LandShare</span>
        </Link>
        <div style={{ background: 'rgba(30,58,47,0.07)', border: '1px solid rgba(30,58,47,0.1)', borderRadius: 8, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#27AE60' }} />
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: C.green }}>Paiement sécurisé</span>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: isMobile ? '16px 14px 40px' : '28px 20px 60px' }}>
        <Stepper isMobile={isMobile} />
        <div style={{ marginBottom: isMobile ? 13 : 20 }}>
          <ConfirmationBanner data={att} isMobile={isMobile} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 288px', gap: isMobile ? 13 : 20, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <AttestationCard data={att} isMobile={isMobile} />
            <div style={{ background: C.surface, borderRadius: 14, boxShadow: '0 2px 12px rgba(30,58,47,0.06)', border: '1px solid rgba(30,58,47,0.06)', padding: isMobile ? '14px' : '16px 18px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '0.68rem', fontWeight: 600, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</p>
              <ActionButtons isMobile={isMobile} investmentId={investmentId} />
            </div>
          </div>
          {isMobile
            ? <RightPanel data={att} isMobile={true} />
            : <div style={{ position: 'sticky', top: 70 }}><RightPanel data={att} isMobile={false} /></div>
          }
        </div>
      </main>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(30,58,47,0.15); border-radius: 3px; }
      `}</style>
    </div>
  )
}