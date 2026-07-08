// ═══════════════════════════════════════════════════════════════════
// VerifierPage.jsx — Page de vérification publique
// Route : /verifier  (accessible sans connexion)
// LandShare Bénin · Design System identique
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

// ─── Palette ───────────────────────────────────────────────────────
const C = {
  bg:     '#F5F0E8',
  green:  '#1E3A2F',
  green2: '#2D5241',
  gold:   '#B8972A',
  goldT:  '#D4AD3A',
  text:   '#1A1A1A',
  muted:  '#8C8278',
  subtle: '#6B6459',
  border: 'rgba(30,58,47,0.1)',
  red:    '#C0392B',
  redBg:  'rgba(192,57,43,0.06)',
  white:  '#FFFFFF',
}

// ─── Icônes SVG ────────────────────────────────────────────────────
const IcoShield    = ({size=18,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IcoCheck     = ({size=18,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoX         = ({size=18,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoSearch    = ({size=18,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoLock      = ({size=18,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const IcoCopy      = ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
const IcoShare     = ({size=15,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const IcoArrowR    = ({size=14,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IcoInfo      = ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
const IcoWarning   = ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoLogin     = ({size=15,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
const IcoDoc       = ({size=28,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const IcoHashTag   = ({size=28,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
const IcoZap       = ({size=28,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IcoLeaf      = ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 22c1.25-1.25 2.5-2.5 3.5-4 2-3 3-6 3-9 0-3.87 3.13-7 7-7 3.87 0 7 3.13 7 7 0 3-1 6-3 9-1 1.5-2.25 2.75-3.5 4"/><path d="M12 22v-7"/></svg>
const IcoClose     = ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoLightbulb = ({size=16,color='currentColor'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 1.97 1.5 3.5.75.76 1.23 1.52 1.41 2.5"/></svg>

// ─── Hook fonts ────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const l = document.createElement('link')
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    l.rel  = 'stylesheet'
    document.head.appendChild(l)
  }, [])
}

// ─── Masquer le nom ────────────────────────────────────────────────
function maskName(fullName) {
  if (!fullName) return '—'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0][0] + '.'
  return parts[0][0] + '. ' + parts.slice(1).join(' ')
}

// ─── Spinner ────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(30,58,47,0.15)', borderTopColor: C.green, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Carte résultat ─────────────────────────────────────────────────
function ResultCard({ result }) {
  const [copied, setCopied] = useState(false)
  const isValid = result.status === 'confirmed' || result.status === 'verified'

  const rows = [
    { label: 'Référence',      value: result.reference,         mono: true  },
    { label: 'Terrain',        value: result.terrain            },
    { label: 'Ville',          value: result.city               },
    { label: 'Parts acquises', value: `${result.sqm} m²`       },
    { label: 'Montant investi',value: `${result.amount?.toLocaleString('fr-FR')} FCFA` },
    { label: 'Investisseur',   value: maskName(result.investor) },
    { label: "Date d'achat",   value: result.date               },
    {
      label: 'Statut',
      value: isValid ? 'Investissement authentique' : 'Statut inconnu',
      highlight: !isValid,
      icon: isValid ? <IcoCheck size={13} color={C.green}/> : <IcoWarning size={13} color={C.red}/>,
    },
  ].filter(r => r.value && r.value !== 'undefined FCFA')

  return (
    <div style={{
      background: C.white, borderRadius: 18,
      boxShadow: '0 8px 40px rgba(30,58,47,0.12)',
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      animation: 'fadeUp 0.4s ease',
    }}>
      {/* Header résultat */}
      <div style={{
        background: isValid
          ? 'linear-gradient(135deg, #1E3A2F, #2D5241)'
          : 'linear-gradient(135deg, #7f1d1d, #991b1b)',
        padding: '24px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: isValid ? 'rgba(212,173,58,0.25)' : 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {isValid
              ? <IcoCheck size={26} color={C.goldT}/>
              : <IcoX size={26} color="#fff"/>
            }
          </div>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.65rem', color: 'rgba(245,240,232,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Résultat de vérification
            </p>
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: '#F5F0E8' }}>
              {isValid ? 'Investissement authentique' : 'Introuvable ou invalide'}
            </h2>
          </div>
        </div>
        {isValid && (
          <div style={{
            background: 'rgba(212,173,58,0.15)', border: '1px solid rgba(212,173,58,0.3)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{ flexShrink: 0, marginTop: 2, color: C.goldT }}><IcoLock size={15} color={C.goldT}/></span>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(245,240,232,0.8)', lineHeight: 1.5 }}>
              Cet investissement est enregistré dans la base de données LandShare Bénin et son authenticité est vérifiée.
            </p>
          </div>
        )}
      </div>

      {/* Détails */}
      <div style={{ padding: '20px 28px' }}>
        {rows.map(({ label, value, mono, highlight, icon }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '9px 0', borderBottom: `1px solid rgba(30,58,47,0.05)`,
            fontSize: '0.8rem',
          }}>
            <span style={{ color: C.muted, fontWeight: 500, flexShrink: 0 }}>{label}</span>
            <span style={{
              fontWeight: 600,
              color: highlight ? C.red : mono ? C.green : C.text,
              fontFamily: mono ? 'monospace' : 'inherit',
              fontSize: mono ? '0.72rem' : '0.78rem',
              textAlign: 'right', maxWidth: '60%',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {icon && icon}
              {value}
            </span>
          </div>
        ))}

        {/* Hash SHA-256 */}
        {result.hash && (
          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: 'rgba(30,58,47,0.04)',
            border: '1px solid rgba(30,58,47,0.09)',
            borderRadius: 12,
          }}>
            <p style={{ margin: '0 0 6px', fontSize: '0.65rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IcoLock size={12} color={C.muted}/> Empreinte numérique SHA-256
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{
                flex: 1, fontSize: '0.65rem', color: C.green,
                fontFamily: 'monospace', wordBreak: 'break-all',
                background: 'rgba(30,58,47,0.06)', padding: '5px 9px',
                borderRadius: 7, border: '1px solid rgba(30,58,47,0.1)',
                lineHeight: 1.6,
              }}>
                {result.hash}
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText(result.hash); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none', flexShrink: 0,
                  background: copied ? C.green : 'rgba(30,58,47,0.08)',
                  color: copied ? '#F5F0E8' : C.green,
                  fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                {copied
                  ? <><IcoCheck size={12} color="#F5F0E8"/> Copié</>
                  : <><IcoCopy size={12} color={C.green}/> Copier</>
                }
              </button>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '0.62rem', color: C.muted }}>
              Ce hash permet de vérifier l'intégrité de l'attestation PDF associée.
            </p>
          </div>
        )}

        {/* Boutons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !') }}
            style={{
              flex: 1, padding: '11px', borderRadius: 10,
              border: `1px solid rgba(30,58,47,0.15)`,
              background: 'transparent', color: C.green,
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}>
            <IcoShare size={14} color={C.green}/> Partager ce résultat
          </button>
          {isValid && (
            <a href="https://landshare.bj" target="_blank" rel="noreferrer" style={{
              flex: 1, padding: '11px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8', fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(30,58,47,0.2)',
            }}>
              <IcoLeaf size={14} color="#F5F0E8"/> Investir sur LandShare
            </a>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}

// ─── Carte "introuvable" ────────────────────────────────────────────
function NotFoundCard({ query }) {
  return (
    <div style={{
      background: C.white, borderRadius: 18,
      boxShadow: '0 8px 40px rgba(30,58,47,0.1)',
      border: `1px solid ${C.border}`,
      overflow: 'hidden', animation: 'fadeUp 0.4s ease',
    }}>
      <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #991b1b)', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IcoX size={26} color="#fff"/>
          </div>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.65rem', color: 'rgba(245,240,232,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Résultat</p>
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#F5F0E8' }}>Aucun résultat trouvé</h2>
          </div>
        </div>
      </div>
      <div style={{ padding: '24px 28px' }}>
        <div style={{ background: C.redBg, border: '1px solid rgba(192,57,43,0.15)', borderRadius: 10, padding: '14px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}><IcoWarning size={15} color={C.red}/></span>
          <p style={{ margin: 0, fontSize: '0.78rem', color: C.red, lineHeight: 1.6 }}>
            Aucun investissement trouvé pour <strong style={{ fontFamily: 'monospace' }}>"{query}"</strong>.<br />
            Vérifie que la référence ou le hash est correct.
          </p>
        </div>
        <div style={{ background: 'rgba(30,58,47,0.04)', borderRadius: 10, padding: '14px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 7 }}>
            <IcoLightbulb size={14} color={C.green}/> Comment vérifier ?
          </p>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.72rem', color: C.muted, lineHeight: 2 }}>
            <li>Référence : format <code style={{ fontFamily: 'monospace', background: 'rgba(30,58,47,0.06)', padding: '1px 5px', borderRadius: 4 }}>LS-0042</code> ou <code style={{ fontFamily: 'monospace', background: 'rgba(30,58,47,0.06)', padding: '1px 5px', borderRadius: 4 }}>ATT-2025-LS-00247</code></li>
            <li>Hash SHA-256 : 64 caractères hexadécimaux</li>
            <li>Les deux champs se trouvent sur votre attestation PDF</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function VerifierPage() {
  useFonts()
  const { query: paramQuery } = useParams()
  const navigate = useNavigate()

  const [input,    setInput]    = useState(paramQuery || '')
  const [loading,  setLoading]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [searched, setSearched] = useState('')

  useEffect(() => {
    if (paramQuery && paramQuery.trim()) {
      handleSearch(paramQuery.trim())
    }
  }, [paramQuery])

  const handleSearch = async (query = input) => {
    const q = query.trim()
    if (!q) return
    setLoading(true); setResult(null); setNotFound(false); setSearched(q)
    navigate(`/verifier/${encodeURIComponent(q)}`, { replace: true })
    try {
      const { data } = await api.get(`/verify/${encodeURIComponent(q)}`)
      setResult(data)
    } catch (err) {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setInput(''); setResult(null); setNotFound(false); setSearched('')
    navigate('/verifier', { replace: true })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  // Infos cards état initial
  const infoCards = [
    {
      icon: <IcoDoc size={28} color={C.green}/>,
      title: "Référence d'investissement",
      desc: 'Format LS-0042 ou ATT-2025-LS-00247, visible sur votre attestation PDF.',
    },
    {
      icon: <IcoHashTag size={28} color={C.green}/>,
      title: 'Hash SHA-256',
      desc: "64 caractères hexadécimaux qui garantissent l'intégrité de votre document.",
    },
    {
      icon: <IcoZap size={28} color={C.green}/>,
      title: 'Vérification instantanée',
      desc: 'Résultat en temps réel depuis notre base de données sécurisée.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar minimale ── */}
      <nav style={{
        background: '#111810', padding: '0 24px', height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: C.green, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 11, height: 11, background: C.gold, clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }} />
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#F5F0E8' }}>
            Land<span style={{ color: C.gold }}>Share</span>
          </span>
        </Link>
        <Link to="/connexion" style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', textDecoration: 'none', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(245,240,232,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <IcoLogin size={13} color="rgba(245,240,232,0.5)"/> Se connecter
        </Link>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 55%, #3D6B53 100%)',
        padding: '52px 24px 48px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.3)', borderRadius: 20, padding: '4px 14px', marginBottom: 18 }}>
          <IcoShield size={13} color={C.goldT}/>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.goldT, letterSpacing: '0.05em' }}>VÉRIFICATION D'INVESTISSEMENT</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: '#F5F0E8', margin: '0 0 12px' }}>
          Vérifiez l'authenticité<br />d'un investissement
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'rgba(245,240,232,0.6)', margin: '0 0 32px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Entrez une référence d'investissement ou un hash SHA-256 pour vérifier instantanément son authenticité dans notre base de données.
        </p>

        {/* Champ de recherche */}
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: '#fff', borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '0 14px', color: C.muted, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <IcoSearch size={16} color={C.muted}/>
            </div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Référence (ex: LS-0042) ou hash SHA-256..."
              style={{
                flex: 1, border: 'none', outline: 'none', padding: '16px 8px',
                fontSize: '0.85rem', color: C.text, fontFamily: "'DM Sans', sans-serif",
                background: 'transparent',
              }}
            />
            {input && (
              <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: '0 10px', display: 'flex', alignItems: 'center' }}>
                <IcoClose size={14} color={C.muted}/>
              </button>
            )}
            <button
              onClick={() => handleSearch()}
              disabled={!input.trim() || loading}
              style={{
                padding: '0 24px', height: 54, border: 'none', flexShrink: 0,
                background: input.trim() && !loading ? 'linear-gradient(135deg,#1E3A2F,#2D5241)' : 'rgba(30,58,47,0.3)',
                color: '#F5F0E8', fontSize: '0.82rem', fontWeight: 700,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
              }}>
              {loading ? (
                <>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />
                  Vérification...
                </>
              ) : (
                <>Vérifier <IcoArrowR size={13} color="#F5F0E8"/></>
              )}
            </button>
          </div>

          {/* Exemples cliquables */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.45)' }}>Exemples :</span>
            {['LS-0042', 'ATT-2025-LS-00247'].map(ex => (
              <button key={ex} onClick={() => { setInput(ex); handleSearch(ex) }}
                style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(245,240,232,0.15)', background: 'rgba(245,240,232,0.07)', color: 'rgba(245,240,232,0.6)', fontSize: '0.68rem', cursor: 'pointer', fontFamily: 'monospace' }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu résultat ── */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spinner />
            <p style={{ fontSize: '0.8rem', color: C.muted, marginTop: 12 }}>Vérification en cours...</p>
          </div>
        )}

        {/* Résultat trouvé */}
        {!loading && result && <ResultCard result={result} />}

        {/* Pas trouvé */}
        {!loading && notFound && <NotFoundCard query={searched} />}

        {/* État initial */}
        {!loading && !result && !notFound && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {infoCards.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: C.white, borderRadius: 14, padding: '18px 16px', border: `1px solid ${C.border}`, boxShadow: '0 2px 10px rgba(30,58,47,0.05)' }}>
                <div style={{ marginBottom: 10 }}>{icon}</div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.82rem', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>{title}</p>
                <p style={{ fontSize: '0.7rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Note bas de page */}
        <div style={{ marginTop: 32, padding: '12px 16px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}><IcoInfo size={14} color={C.subtle}/></span>
          <p style={{ fontSize: '0.68rem', color: C.subtle, margin: 0, lineHeight: 1.6 }}>
            Cette page vérifie l'authenticité des investissements enregistrés dans la base LandShare Bénin.
            Un token = une preuve d'investissement. Il ne constitue pas un titre de propriété foncière légal au sens du droit OHADA.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}