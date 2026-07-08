// ═══════════════════════════════════════════════════════════════════
// HistoriqueSection.jsx — Interface professionnelle avec icônes SVG
// GET /api/investments
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { investmentsApi } from '../../services/landshareApi'

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
function IconCheckCircle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
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
function IconXCircle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
}
function IconRefund({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
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
function IconLayers({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  )
}
function IconSearch({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
function IconAlertTriangle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
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
function IconChevronLeft({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}
function IconFilter({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}
function IconFileText({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

// ─── Tokens ───────────────────────────────────────────────────────
const C = {
  bg:      '#F5F0E8',
  surface: '#FFFFFF',
  green:   '#1E3A2F',
  green2:  '#2D5241',
  gold:    '#B8972A',
  goldTxt: '#D4AD3A',
  text:    '#1A1A1A',
  muted:   '#8C8278',
  subtle:  '#6B6459',
  border:  'rgba(30,58,47,0.09)',
}

// ─── Config statuts ───────────────────────────────────────────────
const STATUS_CFG = {
  confirmed: { bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: 'Confirmé',   dot: '#27AE60',  Icon: IconCheckCircle },
  reserved:  { bg: 'rgba(184,151,42,0.10)',  color: '#8B6E1A', label: 'En attente', dot: '#B8972A',  Icon: IconClock       },
  failed:    { bg: 'rgba(192,57,43,0.08)',   color: '#C0392B', label: 'Échoué',     dot: '#C0392B',  Icon: IconXCircle     },
  refunded:  { bg: 'rgba(100,116,139,0.08)', color: '#64748B', label: 'Remboursé',  dot: '#64748B',  Icon: IconRefund      },
  pending:   { bg: 'rgba(184,151,42,0.10)',  color: '#8B6E1A', label: 'En attente', dot: '#B8972A',  Icon: IconClock       },
}

const TYPE_CFG = {
  confirmed: { Icon: IconCheckCircle, label: 'Achat',     color: '#1E3A2F' },
  reserved:  { Icon: IconClock,       label: 'Réservé',   color: '#8B6E1A' },
  failed:    { Icon: IconXCircle,     label: 'Échec',     color: '#C0392B' },
  refunded:  { Icon: IconRefund,      label: 'Remboursé', color: '#64748B' },
}

function getMethodConfig(method) {
  const map = {
    'mtn_momo':   { label: 'MTN MoMo',   bg: '#FFCC00', text: '#1A1A1A' },
    'moov_money': { label: 'Moov Money', bg: '#0056A2', text: '#fff'    },
    'stripe':     { label: 'Stripe',     bg: '#635BFF', text: '#fff'    },
    'paystack':   { label: 'Paystack',   bg: '#00C3F7', text: '#fff'    },
    'simulation': { label: 'Simulation', bg: '#27AE60', text: '#fff'    },
  }
  return map[method] || { label: method || 'N/A', bg: '#8C8278', text: '#fff' }
}

function adaptInvestment(inv) {
  const methodCfg = getMethodConfig(inv.payments?.[0]?.method)
  return {
    id:              inv.id,
    ref:             inv.reference,
    type:            inv.status,
    terrain:         inv.land?.title    || 'Terrain LandShare',
    location:        inv.land?.location || inv.land?.city || 'Bénin',
    sqm:             inv.sqm_bought,
    amount:          parseFloat(inv.total_paid),
    method:          methodCfg.label,
    methodColor:     methodCfg.bg,
    methodTextColor: methodCfg.text,
    status:          inv.status,
    date:            inv.confirmed_at || inv.created_at
      ? new Date(inv.confirmed_at || inv.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'N/A',
    time: inv.confirmed_at || inv.created_at
      ? new Date(inv.confirmed_at || inv.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : '',
    attestation: inv.status === 'confirmed'
      ? `ATT-${new Date().getFullYear()}-LS-${String(inv.id).padStart(5, '0')}`
      : null,
    land_id: inv.land?.id,
  }
}

function buildStats(txs) {
  const confirmed    = txs.filter(t => t.status === 'confirmed')
  const totalDepense = confirmed.reduce((s, t) => s + t.amount, 0)
  const totalSqm     = confirmed.reduce((s, t) => s + t.sqm, 0)
  const terrains     = new Set(confirmed.map(t => t.terrain)).size
  return [
    { Icon: IconDollar,      iconColor: '#1E3A2F', label: 'Total dépensé',   value: `${totalDepense.toLocaleString('fr-FR')} F`, sub: `${confirmed.length} transactions`    },
    { Icon: IconLayers,      iconColor: '#B8972A', label: 'Total m² acquis', value: `${totalSqm} m²`,                            sub: `${terrains} terrains distincts`       },
    { Icon: IconCheckCircle, iconColor: '#27AE60', label: 'Confirmées',       value: confirmed.length,                            sub: `sur ${txs.length} au total`           },
    { Icon: IconClock,       iconColor: '#8B6E1A', label: 'En attente',       value: txs.filter(t => t.status === 'reserved').length, sub: 'Paiement non finalisé'          },
  ]
}

// ─── Carte stat ───────────────────────────────────────────────────
function StatCard({ Icon, iconColor, label, value, sub, index, visible }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '14px 16px',
      boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(12px)',
      transition: `opacity 0.4s ease ${index * 0.08}s, transform 0.4s ease ${index * 0.08}s`,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Icon size={17} color={iconColor}/>
      </div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: C.green, margin: '0 0 3px' }}>
        {value}
      </p>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Ligne transaction (desktop) ──────────────────────────────────
function TxRow({ tx, onSelect, isSelected }) {
  const sc = STATUS_CFG[tx.status] || STATUS_CFG.pending
  const tc = TYPE_CFG[tx.status]   || TYPE_CFG.confirmed

  return (
    <tr
      onClick={() => onSelect(tx)}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(245,240,232,0.6)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
      style={{
        background: isSelected ? 'rgba(30,58,47,0.04)' : 'transparent',
        cursor: 'pointer', transition: 'background 0.15s',
        borderLeft: isSelected ? `3px solid ${C.green}` : '3px solid transparent',
      }}
    >
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: C.green, fontWeight: 600 }}>
          {tx.ref}
        </span>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconHome size={14} color="rgba(245,240,232,0.8)"/>
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, margin: '0 0 1px' }}>{tx.terrain}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <IconMapPin size={9} color={C.muted}/>
              <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>{tx.location}</p>
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <tc.Icon size={13} color={tc.color}/>
          <span style={{ fontSize: '0.72rem', color: tc.color, fontWeight: 600 }}>{tc.label}</span>
        </div>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.85rem', fontWeight: 700, color: C.green, margin: '0 0 1px' }}>
          {tx.amount.toLocaleString('fr-FR')} F
        </p>
        <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>{tx.sqm} m²</p>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <span style={{
          padding: '3px 9px', borderRadius: 5, fontSize: '0.62rem', fontWeight: 800,
          background: tx.methodColor, color: tx.methodTextColor,
        }}>{tx.method}</span>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <sc.Icon size={12} color={sc.color}/>
          <span style={{
            padding: '3px 9px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 600,
            background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
          }}>{sc.label}</span>
        </div>
      </td>
      <td style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: '0.72rem', color: C.text, margin: '0 0 1px' }}>{tx.date}</p>
        <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>{tx.time}</p>
      </td>
    </tr>
  )
}

// ─── Carte transaction (mobile) ───────────────────────────────────
function TxCard({ tx, onSelect, isSelected }) {
  const sc = STATUS_CFG[tx.status] || STATUS_CFG.pending
  const tc = TYPE_CFG[tx.status]   || TYPE_CFG.confirmed

  return (
    <div
      onClick={() => onSelect(tx)}
      style={{
        background: C.surface, borderRadius: 12,
        border: `1.5px solid ${isSelected ? C.green : C.border}`,
        padding: '12px 14px', cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 16px rgba(30,58,47,0.1)' : '0 1px 6px rgba(30,58,47,0.04)',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#1E3A2F,#2D5241)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconHome size={16} color="rgba(245,240,232,0.8)"/>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{tx.terrain}</p>
            <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.muted }}>{tx.ref}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <sc.Icon size={11} color={sc.color}/>
          <span style={{
            padding: '3px 9px', borderRadius: 20, fontSize: '0.62rem', fontWeight: 600,
            background: sc.bg, color: sc.color, whiteSpace: 'nowrap',
          }}>{sc.label}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, color: C.green, margin: '0 0 2px' }}>
            {tx.amount.toLocaleString('fr-FR')} F
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <tc.Icon size={10} color={tc.color}/>
            <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{tx.sqm} m² · {tc.label}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.68rem', color: C.text, margin: '0 0 3px' }}>{tx.date}</p>
          <span style={{
            padding: '2px 7px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700,
            background: tx.methodColor, color: tx.methodTextColor,
          }}>{tx.method}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Panneau détail ───────────────────────────────────────────────
function DetailPanel({ tx, onDownload }) {
  if (!tx) return (
    <div style={{
      background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
      padding: '40px 20px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      <IconChevronLeft size={36} color="rgba(30,58,47,0.15)"/>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>
        Sélectionnez une transaction pour voir les détails
      </p>
    </div>
  )

  const sc = STATUS_CFG[tx.status] || STATUS_CFG.pending

  return (
    <div style={{
      background: C.surface, borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(30,58,47,0.08)',
    }}>
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: '16px 18px' }}>
        <p style={{ margin: '0 0 3px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Reçu · {tx.ref}
        </p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px' }}>
          {tx.terrain}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconMapPin size={10} color="rgba(245,240,232,0.5)"/>
          <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>{tx.location}</p>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Montant central */}
        <div style={{
          textAlign: 'center', padding: '14px',
          background: 'rgba(30,58,47,0.04)',
          borderRadius: 12, marginBottom: 14,
          border: '1px solid rgba(30,58,47,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
            <IconDollar size={13} color={C.muted}/>
            <p style={{ margin: 0, fontSize: '0.6rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Montant</p>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: C.green, margin: '0 0 6px' }}>
            {tx.amount.toLocaleString('fr-FR')} FCFA
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: sc.bg }}>
            <sc.Icon size={11} color={sc.color}/>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: sc.color }}>{sc.label}</span>
          </div>
        </div>

        {/* Détails */}
        {[
          { label: 'Référence',   value: tx.ref,                            mono: true  },
          { label: 'Parts',       value: `${tx.sqm} m²`                                },
          { label: 'Mode',        value: tx.method                                      },
          { label: 'Date',        value: `${tx.date}${tx.time ? ` à ${tx.time}` : ''}`  },
          { label: 'Attestation', value: tx.attestation ?? 'Non disponible', mono: true },
        ].map(({ label, value, mono }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', fontSize: '0.72rem',
            borderBottom: '1px solid rgba(30,58,47,0.04)',
          }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{
              fontWeight: 600, color: C.text, textAlign: 'right',
              maxWidth: '55%', fontSize: mono ? '0.62rem' : '0.7rem',
              fontFamily: mono ? 'monospace' : 'inherit',
            }}>{value}</span>
          </div>
        ))}

        {/* Actions */}
        {tx.status === 'confirmed' && (
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => onDownload(tx.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '10px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
                color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 3px 12px rgba(30,58,47,0.22)',
              }}>
              <IconDownload size={14} color="#F5F0E8"/> Télécharger l'attestation PDF
            </button>
          </div>
        )}
        {tx.status === 'reserved' && (
          <div style={{
            marginTop: 14, background: 'rgba(184,151,42,0.06)',
            border: '1px solid rgba(184,151,42,0.15)',
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <IconClock size={14} color="#8B6E1A"/>
            <p style={{ fontSize: '0.72rem', color: '#8B6E1A', margin: 0, fontWeight: 600 }}>
              En attente de confirmation de paiement
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function HistoriqueSection({ isMobile }) {
  const [transactions,  setTransactions]  = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [visible,       setVisible]       = useState(false)
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterMethod,  setFilterMethod]  = useState('all')
  const [search,        setSearch]        = useState('')
  const [selected,      setSelected]      = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true)
        const { data } = await investmentsApi.getAll()
        const adapted  = data.investments.map(inv => adaptInvestment(inv))
        setTransactions(adapted)
      } catch (err) {
        setError("Impossible de charger l'historique.")
      } finally {
        setLoading(false)
      }
    }
    fetchInvestments()
  }, [])

  const handleDownload = async (investmentId) => {
    try {
      const response = await investmentsApi.downloadAttestation(investmentId)
      const url      = window.URL.createObjectURL(new Blob([response.data]))
      const link     = document.createElement('a')
      link.href      = url
      link.download  = `Attestation_LandShare_${investmentId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors du téléchargement. Réessayez.')
    }
  }

  const filtered = transactions.filter(tx => {
    const q = search.toLowerCase()
    return (
      (tx.ref.toLowerCase().includes(q) || tx.terrain.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || tx.status === filterStatus) &&
      (filterMethod === 'all' || tx.method === filterMethod)
    )
  })

  const stats = buildStats(transactions)

  const selectStyle = {
    padding: '7px 12px', borderRadius: 8,
    border: `1px solid ${C.border}`,
    background: C.surface, fontSize: '0.75rem', color: C.subtle,
    cursor: 'pointer', outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>

      {/* Bandeau titre */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)',
        borderRadius: 16, padding: isMobile ? '18px 16px' : '20px 24px',
        marginBottom: 20, boxShadow: '0 4px 20px rgba(30,58,47,0.18)',
      }}>
        <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          Mes transactions
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px' }}>
          Historique complet
        </h2>
        <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
          {loading ? '...' : `${transactions.filter(t => t.status === 'confirmed').length} transactions confirmées · ${transactions.length} au total`}
        </p>
      </div>

      {/* Chargement */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid rgba(30,58,47,0.15)',
            borderTopColor: C.green,
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 14px',
          }}/>
          <p style={{ fontSize: '0.78rem', color: C.muted, margin: 0 }}>Chargement de l'historique...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

      ) : error ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          padding: '40px 20px', background: C.surface, borderRadius: 14,
          border: '1px solid rgba(192,57,43,0.15)',
        }}>
          <IconAlertTriangle size={32} color="#C0392B"/>
          <p style={{ fontSize: '0.82rem', color: '#C0392B', fontWeight: 600, margin: 0 }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: C.green, color: '#F5F0E8',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Réessayer
          </button>
        </div>

      ) : (
        <>
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: 14, marginBottom: 20,
          }}>
            {stats.map((s, i) => (
              <StatCard key={i} {...s} index={i} visible={visible} />
            ))}
          </div>

          {/* Filtres */}
          <div style={{
            background: C.surface, borderRadius: 14,
            border: `1px solid ${C.border}`,
            padding: '14px 16px', marginBottom: 16,
            boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
          }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Recherche */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(30,58,47,0.03)',
                border: `1px solid ${C.border}`,
                borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180,
              }}>
                <IconSearch size={14} color={C.muted}/>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Réf., terrain..."
                  style={{
                    border: 'none', background: 'transparent',
                    fontSize: '0.75rem', color: C.text, outline: 'none', width: '100%',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconFilter size={13} color={C.muted}/>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmé</option>
                  <option value="reserved">En attente</option>
                  <option value="failed">Échoué</option>
                </select>
              </div>

              <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} style={selectStyle}>
                <option value="all">Tous les modes</option>
                <option value="MTN MoMo">MTN MoMo</option>
                <option value="Moov Money">Moov Money</option>
                <option value="Stripe">Stripe</option>
                <option value="Simulation">Simulation</option>
              </select>

              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: C.green, color: '#F5F0E8',
                fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap',
              }}>
                <IconDownload size={13} color="#F5F0E8"/> Exporter
              </button>
            </div>
          </div>

          {/* Contenu */}
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
              padding: '50px 20px',
            }}>
              <IconSearch size={36} color="rgba(30,58,47,0.15)"/>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
                  Aucune transaction trouvée
                </p>
                <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                  Essaie un autre filtre ou terme de recherche
                </p>
              </div>
            </div>

          ) : isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(tx => (
                <TxCard key={tx.id} tx={tx} onSelect={setSelected} isSelected={selected?.id === tx.id} />
              ))}
              {selected && (
                <div style={{ marginTop: 8 }}>
                  <DetailPanel tx={selected} onDownload={handleDownload} />
                </div>
              )}
            </div>

          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                background: C.surface, borderRadius: 14,
                border: `1px solid ${C.border}`,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(30,58,47,0.05)',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#FAFAF7' }}>
                        {['Réf.', 'Terrain', 'Type', 'Montant', 'Mode', 'Statut', 'Date'].map(h => (
                          <th key={h} style={{
                            padding: '10px 14px', textAlign: 'left',
                            fontSize: '0.62rem', fontWeight: 700, color: C.muted,
                            textTransform: 'uppercase', letterSpacing: '0.06em',
                            borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(tx => (
                        <TxRow key={tx.id} tx={tx} onSelect={setSelected} isSelected={selected?.id === tx.id} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{
                  padding: '10px 16px', borderTop: `1px solid ${C.border}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <p style={{ fontSize: '0.68rem', color: C.muted, margin: 0 }}>
                    {filtered.length} sur {transactions.length} transaction(s)
                  </p>
                </div>
              </div>

              <div style={{ position: 'sticky', top: 70 }}>
                <DetailPanel tx={selected} onDownload={handleDownload} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Note bas de page */}
      {!loading && !error && (
        <div style={{
          marginTop: 20, padding: '10px 14px',
          background: 'rgba(30,58,47,0.04)',
          border: '1px solid rgba(30,58,47,0.08)',
          borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <IconInfo size={14} color={C.subtle}/>
          <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
            Les attestations PDF sont générées automatiquement après confirmation du paiement.
            Conservez-les — elles sont vérifiables hors-ligne par hash SHA-256.
          </p>
        </div>
      )}
    </div>
  )
}