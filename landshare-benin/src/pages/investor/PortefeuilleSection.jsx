// ═══════════════════════════════════════════════════════════════════
// PortefeuilleSection.jsx — Interface professionnelle avec icônes SVG
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { userApi, investmentsApi } from '../../services/landshareApi'

const C = {
  bg: '#F5F0E8', surface: '#FFFFFF',
  green: '#1E3A2F', green2: '#2D5241',
  gold: '#B8972A', goldTxt: '#D4AD3A',
  text: '#1A1A1A', muted: '#8C8278', subtle: '#6B6459',
  border: 'rgba(30,58,47,0.09)',
  red: '#C0392B', redBg: 'rgba(192,57,43,0.08)',
}
const GRADIENTS = [
  'linear-gradient(135deg, #1E3A2F, #2D5241)',
  'linear-gradient(135deg, #2D5241, #B8972A)',
  'linear-gradient(135deg, #3D6B53, #1E3A2F)',
  'linear-gradient(135deg, #B8972A, #8B6D14)',
  'linear-gradient(135deg, #1E3A2F, #3D6B53)',
]
const PIE_COLORS = ['#1E3A2F', '#B8972A', '#3D6B53', '#2D5241', '#8B6D14']

// ─── Icônes SVG ───────────────────────────────────────────────────
function IconHome({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function IconMapPin({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconTrendingUp({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}
function IconTrendingDown({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  )
}
function IconDollar({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  )
}
function IconPercent({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"/>
      <circle cx="6.5" cy="6.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  )
}
function IconDownload({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}
function IconExternalLink({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}
function IconCopy({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  )
}
function IconCheck({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function IconLink({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  )
}
function IconAlertCircle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}
function IconInfo({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  )
}
function IconChevronRight({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}
function IconLayers({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  )
}
function IconShield({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}
function IconClock({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

// ─── Fonctions utilitaires ────────────────────────────────────────
function adaptInvestment(inv, index) {
  const subtotal   = parseFloat(inv.subtotal || inv.total_paid)
  const commission = parseFloat(inv.commission || 0)
  const totalPaid  = parseFloat(inv.total_paid)
  const unitPrice  = parseFloat(inv.unit_price || (subtotal / inv.sqm_bought))
  const currentVal = parseFloat(inv.current_value || subtotal)
  const plusVal    = parseFloat(inv.plus_value || 0)
  const plusValPct = parseFloat(inv.plus_value_pct || 0)

  return {
    id:                 inv.id,
    land_id:            inv.land_id || inv.land?.id,
    reference:          inv.reference,
    nom:                inv.land?.title || 'Terrain LandShare',
    location:           inv.land?.location || inv.land?.city || 'Bénin',
    city:               inv.land?.city || 'Bénin',
    sqm:                inv.sqm_bought,
    unitPrice, subtotal, commission, totalPaid,
    currentValue:       currentVal,
    plusValue:          plusVal,
    plusValuePct:       plusValPct,
    currentPricePerSqm: inv.land?.price_per_sqm || unitPrice,
    dateAchat:          inv.confirmed_at
      ? new Date(inv.confirmed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'N/A',
    certificate_url:    inv.certificate_url,
    tx_hash:            inv.tx_hash || null,
    gradient:           GRADIENTS[index % GRADIENTS.length],
    tag:                inv.land?.city || 'Terrain',
    attestation:        `ATT-${new Date().getFullYear()}-LS-${String(inv.id).padStart(5, '0')}`,
  }
}

function useCountUp(target, duration = 1600, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger || !target) return
    let s = null
    const step = ts => {
      if (!s) s = ts
      const p = Math.min((ts - s) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, trigger])
  return val
}

function useInView() {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: 0.1 })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, v]
}

function Sk({ h = 16, r = 6 }) {
  return <div style={{ height: h, borderRadius: r, background: 'rgba(30,58,47,0.07)', animation: 'pulse 1.4s ease infinite' }} />
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const pt = payload[0].payload
  return (
    <div style={{ background: '#1E3A2F', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
      <p style={{ margin: '0 0 2px', fontSize: '0.65rem', color: 'rgba(245,240,232,0.55)' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#D4AD3A', fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>
        {payload[0].value?.toLocaleString('fr-FR')} FCFA
      </p>
      {pt?.type === 'valuation' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <IconTrendingUp size={10} color="rgba(184,151,42,0.9)"/>
          <p style={{ margin: 0, fontSize: '0.6rem', color: 'rgba(184,151,42,0.9)' }}>Réévaluation foncière</p>
        </div>
      )}
    </div>
  )
}

// ─── Badge Blockchain ─────────────────────────────────────────────
function BlockchainBadge({ txHash, small = false }) {
  const [copied, setCopied] = useState(false)
  if (!txHash) return null

  const shortHash = txHash.slice(0, 10) + '...' + txHash.slice(-6)

  if (small) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'rgba(39,174,96,0.08)',
        border: '1px solid rgba(39,174,96,0.25)',
        borderRadius: 20, padding: '2px 8px',
        fontSize: '0.58rem', fontWeight: 700, color: '#27AE60',
      }}>
        <IconShield size={9} color="#27AE60"/>
        Certifié blockchain
      </span>
    )
  }

  return (
    <div style={{
      background: 'rgba(39,174,96,0.06)',
      border: '1px solid rgba(39,174,96,0.2)',
      borderRadius: 10, padding: '10px 12px',
      marginTop: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <IconShield size={13} color="#27AE60"/>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#27AE60' }}>Certifié blockchain</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: '0.55rem', background: 'rgba(39,174,96,0.15)',
          color: '#27AE60', padding: '1px 6px', borderRadius: 10,
          fontWeight: 600, marginLeft: 'auto',
        }}>
          <IconCheck size={9} color="#27AE60"/> Ancré
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <code style={{
          flex: 1, fontSize: '0.62rem', color: '#1E3A2F',
          fontFamily: 'monospace',
          background: 'rgba(30,58,47,0.06)',
          padding: '4px 8px', borderRadius: 6,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {shortHash}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(txHash)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: copied ? '#27AE60' : 'rgba(39,174,96,0.1)',
            border: 'none', borderRadius: 6,
            padding: '4px 8px', cursor: 'pointer',
            fontSize: '0.6rem', fontWeight: 600,
            color: copied ? '#fff' : '#27AE60',
            flexShrink: 0, transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {copied
            ? <><IconCheck size={10} color="#fff"/> Copié</>
            : <><IconCopy size={10} color="#27AE60"/> Copier</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────
function KpiCard({ label, value, suffix, sub, IconComp, color, bgColor, delta, index }) {
  const [ref, inView] = useInView()
  const animated = useCountUp(Math.abs(value || 0), 1600, inView)
  return (
    <div ref={ref} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', boxShadow: '0 2px 10px rgba(30,58,47,0.05)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transition: `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {IconComp && <IconComp size={16} color={color}/>}
        </div>
        {delta !== null && delta !== undefined && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.65rem', fontWeight: 700, color: delta >= 0 ? '#27AE60' : '#E74C3C', background: delta >= 0 ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)', padding: '2px 7px', borderRadius: 20 }}>
            {delta >= 0
              ? <IconTrendingUp size={10} color="#27AE60"/>
              : <IconTrendingDown size={10} color="#E74C3C"/>
            }
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.3rem', fontWeight: 700, color, margin: '0 0 3px' }}>
        {value < 0 ? '-' : ''}{animated.toLocaleString('fr-FR')}{suffix}
      </p>
      <p style={{ fontSize: '0.65rem', color: C.muted, margin: '0 0 2px', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: '0.6rem', color: 'rgba(140,130,120,0.7)', margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Carte investissement ─────────────────────────────────────────
function InvestCard({ inv, onSelect, isSelected }) {
  const hasPV  = inv.plusValue !== 0
  const isGain = inv.plusValue >= 0

  return (
    <div onClick={() => onSelect(inv)} style={{ background: C.surface, borderRadius: 14, border: `1.5px solid ${isSelected ? C.green : C.border}`, boxShadow: isSelected ? '0 4px 20px rgba(30,58,47,0.14)' : '0 2px 10px rgba(30,58,47,0.05)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.22s', transform: isSelected ? 'translateY(-2px)' : 'translateY(0)' }}>

      <div style={{ background: inv.gradient, padding: '14px 16px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,240,232,0.15)', border: '1px solid rgba(245,240,232,0.2)', borderRadius: 6, padding: '2px 7px', fontSize: '0.58rem', fontWeight: 700, color: 'rgba(245,240,232,0.85)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{inv.tag}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconHome size={18} color="rgba(245,240,232,0.8)"/>
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.85rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 2px', lineHeight: 1.3 }}>{inv.nom}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IconMapPin size={10} color="rgba(245,240,232,0.5)"/>
              <p style={{ fontSize: '0.6rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>{inv.location}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 8, padding: '6px 8px' }}>
            <p style={{ margin: '0 0 1px', fontSize: '0.52rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prix foncier</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.88rem', fontWeight: 700, color: C.goldTxt, margin: 0 }}>{inv.subtotal.toLocaleString('fr-FR')} F</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 8, padding: '6px 8px' }}>
            <p style={{ margin: '0 0 1px', fontSize: '0.52rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total déboursé</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.88rem', fontWeight: 700, color: 'rgba(245,240,232,0.75)', margin: 0 }}>{inv.totalPaid.toLocaleString('fr-FR')} F</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { label: 'Parts',      value: `${inv.sqm} m²` },
            { label: 'Prix/m²',    value: `${inv.unitPrice.toLocaleString('fr-FR')} F` },
            { label: 'Commission', value: `${inv.commission.toLocaleString('fr-FR')} F` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(30,58,47,0.04)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 1px', fontSize: '0.52rem', color: C.muted }}>{label}</p>
              <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: C.green }}>{value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: hasPV ? (isGain ? 'rgba(30,58,47,0.04)' : 'rgba(192,57,43,0.04)') : 'rgba(30,58,47,0.04)', border: `1px solid ${hasPV ? (isGain ? 'rgba(30,58,47,0.1)' : 'rgba(192,57,43,0.12)') : 'rgba(30,58,47,0.08)'}`, borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 1px', fontSize: '0.55rem', color: C.muted }}>Valeur actuelle</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700, color: C.text, margin: 0 }}>{inv.currentValue.toLocaleString('fr-FR')} F</p>
          </div>
          {hasPV && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginBottom: 1 }}>
                {isGain
                  ? <IconTrendingUp size={11} color="#27AE60"/>
                  : <IconTrendingDown size={11} color={C.red}/>
                }
                <p style={{ margin: 0, fontSize: '0.55rem', color: C.muted }}>Plus-value</p>
              </div>
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: isGain ? '#27AE60' : C.red, margin: 0 }}>
                {isGain ? '+' : ''}{inv.plusValue.toLocaleString('fr-FR')} F
              </p>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, color: isGain ? '#27AE60' : C.red }}>
                ({isGain ? '+' : ''}{inv.plusValuePct}%)
              </span>
            </div>
          )}
        </div>

        {inv.tx_hash && (
          <div style={{ marginTop: 8 }}>
            <BlockchainBadge txHash={inv.tx_hash} small={true} />
          </div>
        )}

        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconClock size={10} color={C.muted}/>
            <span style={{ fontSize: '0.6rem', color: C.muted }}>{inv.dateAchat}</span>
          </div>
          <span style={{ fontSize: '0.6rem', color: C.gold, fontFamily: 'monospace', background: 'rgba(184,151,42,0.08)', padding: '2px 6px', borderRadius: 5, border: '1px solid rgba(184,151,42,0.15)' }}>{inv.attestation}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Panneau détail ───────────────────────────────────────────────
function DetailPanel({ inv, onDownload }) {
  const navigate = useNavigate()

  if (!inv) return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <IconChevronRight size={32} color="rgba(30,58,47,0.15)"/>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>Sélectionnez un investissement pour voir les détails</p>
    </div>
  )

  const isGain = inv.plusValue >= 0
  const hasPV  = inv.plusValue !== 0

  const rows = [
    { label: 'Référence',          value: inv.reference },
    { label: 'Parts détenues',     value: `${inv.sqm} m²` },
    { label: "Prix/m² à l'achat",  value: `${inv.unitPrice.toLocaleString('fr-FR')} FCFA` },
    { label: 'Prix foncier pur',   value: `${inv.subtotal.toLocaleString('fr-FR')} FCFA`, bold: true },
    { label: 'Commission (3%)',    value: `${inv.commission.toLocaleString('fr-FR')} FCFA`, color: '#8B6E1A' },
    { label: 'Total déboursé',     value: `${inv.totalPaid.toLocaleString('fr-FR')} FCFA`, bold: true },
    { label: 'sep1', value: '', separator: true },
    { label: 'Prix/m² actuel',     value: `${(inv.currentPricePerSqm || inv.unitPrice).toLocaleString('fr-FR')} FCFA` },
    { label: 'Valeur actuelle',    value: `${inv.currentValue.toLocaleString('fr-FR')} FCFA`, bold: true, color: C.green },
    { label: 'Plus-value',         value: hasPV ? `${isGain ? '+' : ''}${inv.plusValue.toLocaleString('fr-FR')} FCFA (${isGain ? '+' : ''}${inv.plusValuePct}%)` : 'Aucune réévaluation', bold: hasPV, color: hasPV ? (isGain ? '#27AE60' : C.red) : C.muted },
    { label: 'sep2', value: '', separator: true },
    { label: "Date d'achat",       value: inv.dateAchat },
    { label: 'Attestation',        value: inv.attestation },
  ]

  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,58,47,0.08)' }}>
      <div style={{ background: inv.gradient, padding: '16px 18px' }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Détail · {inv.reference}</p>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 3px' }}>{inv.nom}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconMapPin size={10} color="rgba(245,240,232,0.5)"/>
          <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>{inv.location}</p>
        </div>

        {hasPV && (
          <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {isGain
                ? <IconTrendingUp size={12} color="rgba(245,240,232,0.6)"/>
                : <IconTrendingDown size={12} color="rgba(245,240,232,0.6)"/>
              }
              <span style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.6)' }}>Plus-value latente</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isGain ? '#7DCEA0' : '#E74C3C', fontFamily: "'Playfair Display',serif" }}>
              {isGain ? '+' : ''}{inv.plusValue.toLocaleString('fr-FR')} F ({isGain ? '+' : ''}{inv.plusValuePct}%)
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        {rows.map(({ label, value, bold, color, separator }) => {
          if (separator) return <div key={label} style={{ height: 1, background: 'rgba(30,58,47,0.06)', margin: '6px 0' }} />
          if (!value) return null
          return (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: '0.72rem', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
              <span style={{ color: C.muted, flexShrink: 0 }}>{label}</span>
              <span style={{ fontWeight: bold ? 700 : 500, color: color || C.text, textAlign: 'right', maxWidth: '58%', fontSize: '0.7rem' }}>{value}</span>
            </div>
          )
        })}

        <BlockchainBadge txHash={inv.tx_hash} small={false} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          <button onClick={() => onDownload(inv.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 3px 12px rgba(30,58,47,0.22)' }}>
            <IconDownload size={14} color="#F5F0E8"/> Télécharger l'attestation
          </button>
          <button onClick={() => navigate(`/terrains/${inv.land_id}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 10, border: `1px solid rgba(30,58,47,0.15)`, background: 'transparent', color: C.green, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            Investir davantage <IconChevronRight size={14} color={C.green}/>
          </button>
          {inv.tx_hash && (
            <a
              href={`/verifier/${inv.reference}`}
              target="_blank"
              rel="noreferrer"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', borderRadius: 10, border: '1px solid rgba(39,174,96,0.25)', background: 'rgba(39,174,96,0.05)', color: '#27AE60', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", textDecoration: 'none', textAlign: 'center' }}
            >
              <IconExternalLink size={14} color="#27AE60"/> Vérifier l'authenticité
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Graphiques portefeuille ──────────────────────────────────────
function PortfolioCharts({ investments, chartData, isMobile }) {
  const pieData  = (investments ?? []).map(inv => ({ name: inv.tag, value: inv.subtotal }))
  const totalVal = investments.reduce((s, i) => s + i.subtotal, 0)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 220px', gap: 16 }}>
      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '16px 18px', boxShadow: '0 2px 10px rgba(30,58,47,0.05)' }}>
        <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700, color: C.text }}>Évolution du portefeuille</p>
        <p style={{ margin: '0 0 12px', fontSize: '0.62rem', color: C.muted }}>Valeur foncière dans le temps</p>
        <div style={{ height: 160 }}>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradGlobal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1E3A2F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="value" stroke="#1E3A2F" strokeWidth={2.5} fill="url(#gradGlobal)" dot={false} activeDot={{ r: 4, fill: '#1E3A2F' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
              <IconTrendingUp size={32} color="rgba(30,58,47,0.15)"/>
              <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Aucune donnée d'évolution</p>
            </div>
          )}
        </div>
        {chartData?.some(p => p.type === 'valuation') && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B8972A' }} />
            <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>Les pics correspondent à des réévaluations foncières</p>
          </div>
        )}
      </div>

      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '16px 18px', boxShadow: '0 2px 10px rgba(30,58,47,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ margin: '0 0 2px', fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700, color: C.text, alignSelf: 'flex-start' }}>Répartition</p>
        <p style={{ margin: '0 0 10px', fontSize: '0.62rem', color: C.muted, alignSelf: 'flex-start' }}>Par terrain (prix foncier)</p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width={120} height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`${v.toLocaleString('fr-FR')} F`, 'Foncier']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: '100%', marginTop: 8 }}>
          {investments.map((inv, i) => (
            <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: '0.62rem', color: C.subtle, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.tag}</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: C.green }}>{totalVal > 0 ? ((inv.subtotal / totalVal) * 100).toFixed(0) : 0}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Composant principal ──────────────────────────────────────────
export default function PortefeuilleSection({ isMobile }) {
  const navigate = useNavigate()
  const [investments, setInvestments] = useState([])
  const [summary,     setSummary]     = useState(null)
  const [chartData,   setChartData]   = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [selected,    setSelected]    = useState(null)
  const [visible,     setVisible]     = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const { data } = await userApi.getPortfolio()
        const adapted  = (data.portfolio || []).map((inv, i) => adaptInvestment(inv, i))
        setInvestments(adapted)
        setSummary(data.summary || null)
        try {
          const { default: api } = await import('../../api/axios')
          const dash = await api.get('/dashboard')
          if (dash.data.chart_data?.length > 0) setChartData(dash.data.chart_data)
        } catch { }
      } catch {
        setError('Impossible de charger le portefeuille.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDownload = async (investmentId) => {
    try {
      const response = await investmentsApi.downloadAttestation(investmentId)
      const url  = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href  = url
      link.download = `Attestation_LandShare_${investmentId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors du téléchargement. Réessayez.')
    }
  }

  const totalSubtotal   = summary?.total_subtotal  || investments.reduce((s, i) => s + i.subtotal, 0)
  const totalCommission = summary?.total_commission || investments.reduce((s, i) => s + i.commission, 0)
  const totalSqm        = summary?.total_sqm        || investments.reduce((s, i) => s + i.sqm, 0)
  const currentValue    = summary?.current_value    || investments.reduce((s, i) => s + i.currentValue, 0)
  const plusValue       = summary?.plus_value       || (currentValue - totalSubtotal)
  const plusValuePct    = summary?.plus_value_pct   || (totalSubtotal > 0 ? +((plusValue / totalSubtotal) * 100).toFixed(1) : 0)
  const hasPV        = plusValue !== 0
  const isGain       = plusValue >= 0
  const nbBlockchain = investments.filter(i => i.tx_hash).length

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>

      {/* Bandeau supérieur */}
      <div style={{ background: 'linear-gradient(135deg,#1E3A2F 0%,#2D5241 60%,#3D6B53 100%)', borderRadius: 16, padding: isMobile ? '18px 16px' : '20px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(30,58,47,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Mon portefeuille foncier</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px' }}>
              {loading ? '...' : `${currentValue.toLocaleString('fr-FR')} FCFA`}
            </h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: '0 0 6px' }}>
              {loading ? '...' : `${investments.length} investissement${investments.length > 1 ? 's' : ''} · ${totalSqm} m² · Valeur actuelle`}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {!loading && hasPV && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: isGain ? '#7DCEA0' : '#E74C3C', background: isGain ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.15)', border: `1px solid ${isGain ? 'rgba(39,174,96,0.25)' : 'rgba(231,76,60,0.25)'}`, padding: '3px 10px', borderRadius: 20 }}>
                  {isGain
                    ? <IconTrendingUp size={12} color="#7DCEA0"/>
                    : <IconTrendingDown size={12} color="#E74C3C"/>
                  }
                  {isGain ? '+' : ''}{plusValue.toLocaleString('fr-FR')} F ({isGain ? '+' : ''}{plusValuePct}%)
                </span>
              )}
              {!loading && nbBlockchain > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', fontWeight: 700, color: '#7DCEA0', background: 'rgba(39,174,96,0.15)', border: '1px solid rgba(39,174,96,0.25)', padding: '3px 10px', borderRadius: 20 }}>
                  <IconShield size={12} color="#7DCEA0"/>
                  {nbBlockchain} certifié{nbBlockchain > 1 ? 's' : ''} blockchain
                </span>
              )}
            </div>
          </div>

          {!isMobile && !loading && investments.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.25)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 1px', fontSize: '0.56rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prix foncier</p>
                <p style={{ margin: 0, fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: '#D4AD3A' }}>{totalSubtotal.toLocaleString('fr-FR')} F</p>
              </div>
              <div style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 1px', fontSize: '0.56rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commission</p>
                <p style={{ margin: 0, fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: '#E8A090' }}>{totalCommission.toLocaleString('fr-FR')} F</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
            {[1,2,3,4].map(i => <Sk key={i} h={90} r={14} />)}
          </div>
          <Sk h={200} r={14} />
          <Sk h={180} r={14} />
        </div>
      ) : error ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '40px 20px', background: C.surface, borderRadius: 14, border: '1px solid rgba(192,57,43,0.15)' }}>
          <IconAlertCircle size={32} color="#C0392B"/>
          <p style={{ fontSize: '0.82rem', color: '#C0392B', fontWeight: 600, margin: 0 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.green, color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Réessayer</button>
        </div>
      ) : investments.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '60px 20px', background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
          <IconLayers size={40} color="rgba(30,58,47,0.15)"/>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Aucun investissement confirmé</p>
            <p style={{ fontSize: '0.75rem', color: C.muted, margin: '0 0 20px' }}>Explorez les terrains disponibles et réalisez votre premier investissement.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', color: '#F5F0E8', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            <IconMapPin size={15} color="#F5F0E8"/> Explorer les terrains
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            <KpiCard index={0} label="Valeur actuelle"   value={currentValue}        suffix=" F" sub="Au prix du marché"  IconComp={IconTrendingUp} color={C.green}  bgColor="rgba(30,58,47,0.08)"   delta={hasPV ? plusValuePct : null} />
            <KpiCard index={1} label="Prix foncier payé" value={totalSubtotal}        suffix=" F" sub="Sans commission"    IconComp={IconDollar}     color={C.gold}   bgColor="rgba(184,151,42,0.1)"  delta={null} />
            <KpiCard index={2} label="Commission totale" value={totalCommission}      suffix=" F" sub="Frais LandShare"    IconComp={IconPercent}    color="#8B6E1A"  bgColor="rgba(184,151,42,0.08)" delta={null} />
            <KpiCard index={3} label="Plus-value"        value={Math.abs(plusValue)} suffix=" F" sub={hasPV ? (isGain ? `+${plusValuePct}% gain` : `${plusValuePct}% perte`) : "Aucune rééval."} IconComp={hasPV && isGain ? IconTrendingUp : IconTrendingDown} color={hasPV ? (isGain ? "#27AE60" : C.red) : C.green2} bgColor={hasPV ? (isGain ? "rgba(39,174,96,0.08)" : C.redBg) : "rgba(45,82,65,0.1)"} delta={null} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <PortfolioCharts investments={investments} chartData={chartData} isMobile={isMobile} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.95rem', fontWeight: 700, color: C.text, margin: 0 }}>Mes investissements</p>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', color: '#F5F0E8', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              + Nouvel investissement
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {investments.map(inv => (
                <InvestCard key={inv.id} inv={inv} onSelect={setSelected} isSelected={selected?.id === inv.id} />
              ))}
            </div>
            {isMobile ? (
              selected && <DetailPanel inv={selected} onDownload={handleDownload} />
            ) : (
              <div style={{ position: 'sticky', top: 70 }}>
                <DetailPanel inv={selected} onDownload={handleDownload} />
              </div>
            )}
          </div>
        </>
      )}

      {!loading && !error && investments.length > 0 && (
        <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <IconInfo size={14} color={C.subtle}/>
          <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
            <strong>Prix foncier</strong> = montant hors commission &middot; <strong>Commission</strong> = frais LandShare (3%) &middot; <strong>Valeur actuelle</strong> = m² &times; prix actuel &middot; <strong>Plus-value</strong> = valeur actuelle &minus; prix foncier payé &middot; <strong>Blockchain</strong> = investissement ancré sur le réseau.
          </p>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}