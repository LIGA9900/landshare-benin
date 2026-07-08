// ═══════════════════════════════════════════════════════════════════
// DocumentsSection.jsx — Interface professionnelle avec icônes SVG
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

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

// ─── Icônes SVG ───────────────────────────────────────────────────
function IconAward({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
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
function IconClipboard({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  )
}
function IconScroll({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
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
function IconExternalLink({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}
function IconX({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function IconRefresh({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
    </svg>
  )
}
function IconFolder({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
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
function IconAlertTriangle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}
function IconLock({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
}
function IconHash({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9"/>
      <line x1="4" y1="15" x2="20" y2="15"/>
      <line x1="10" y1="3" x2="8" y2="21"/>
      <line x1="16" y1="3" x2="14" y2="21"/>
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
function IconMapPin({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconGrid({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  )
}
function IconList({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}
function IconArrowRight({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
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

// ─── Config types documents ───────────────────────────────────────
const TYPE_CFG = {
  attestation: { Icon: IconAward,     label: 'Attestation',   bg: 'rgba(184,151,42,0.1)',  color: '#8B6D14' },
  recu:        { Icon: IconFileText,  label: 'Reçu',          bg: 'rgba(30,58,47,0.08)',   color: '#1E3A2F' },
  contrat:     { Icon: IconClipboard, label: 'Contrat',       bg: 'rgba(61,107,83,0.1)',   color: '#3D6B53' },
  titre:       { Icon: IconScroll,    label: 'Titre foncier', bg: 'rgba(100,116,139,0.1)', color: '#475569' },
  kyc:         { Icon: IconShield,    label: 'KYC',           bg: 'rgba(139,110,26,0.1)',  color: '#8B6E1A' },
  national_id: { Icon: IconShield,    label: 'KYC',           bg: 'rgba(139,110,26,0.1)',  color: '#8B6E1A' },
  passport:    { Icon: IconShield,    label: 'KYC',           bg: 'rgba(139,110,26,0.1)',  color: '#8B6E1A' },
}

const FALLBACK_DOCS = [
  { id: 1, nom: 'Attestation_Calavi_Nord_ATT-2025-LS-00247.pdf', label: 'Attestation de propriété', type: 'attestation', category: 'attestation', terrain: 'Calavi Nord — Zone Résidentielle', ref: 'ATT-2025-LS-00247', date: '28 Oct 2025', size: '284 Ko', status: 'valid', hash: 'a3f7c9e2b1d84056cf2e73a1b849d012', sqm: 5,  download_url: '#' },
  { id: 2, nom: 'Attestation_Fidjrosse_ATT-2025-LS-00189.pdf',   label: 'Attestation de propriété', type: 'attestation', category: 'attestation', terrain: 'Fidjrossè Balnéaire',            ref: 'ATT-2025-LS-00189', date: '15 Oct 2025', size: '291 Ko', status: 'valid', hash: 'b2e8d1f5c4a93712e7b1f234d8c056ab', sqm: 10, download_url: '#' },
  { id: 3, nom: 'Attestation_Parakou_ATT-2025-LS-00174.pdf',     label: 'Attestation de propriété', type: 'attestation', category: 'attestation', terrain: 'Parakou Nord — Lot B',           ref: 'ATT-2025-LS-00174', date: '02 Oct 2025', size: '265 Ko', status: 'valid', hash: 'c9d4e7a1b3f2605812fe34a7c891d056', sqm: 3,  download_url: '#' },
  { id: 4, nom: 'KYC_Verification_Ligali_Fouad.pdf',             label: 'Vérification KYC',         type: 'kyc',         category: 'kyc',         terrain: null,                             ref: 'KYC-2025-241',      date: '20 Sep 2025', size: '95 Ko',  status: 'validated', status_label: 'Validé', hash: null, sqm: null, download_url: '#' },
]

function adaptDoc(d) {
  const isAttestation = d.category === 'attestation'
  const type = d.type || (isAttestation ? 'attestation' : 'kyc')
  return {
    id:           d.id,
    category:     d.category     || 'attestation',
    type,
    nom:          d.name         || d.nom   || d.label || 'Document',
    label:        d.name         || d.label || 'Document',
    terrain:      d.terrain      || null,
    ref:          d.reference    || d.ref   || `DOC-${d.id}`,
    date:         d.date         || (d.created_at ? new Date(d.created_at).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'),
    size:         d.size         || 'N/A',
    status:       d.status       || 'verified',
    status_label: d.status_label || null,
    rejection_reason: d.rejection_reason || null,
    hash:         d.hash         || null,
    sqm:          d.sqm          || null,
    amount:       d.amount       || null,
    download_url: d.download_url || '#',
    created_at:   d.created_at   || null,
  }
}

// ─── Skeleton ────────────────────────────────────────────────────
function DocSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px', display: 'flex', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(30,58,47,0.06)', flexShrink: 0, animation: 'pulse 1.4s ease infinite' }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 11, background: 'rgba(30,58,47,0.06)', borderRadius: 6, width: '50%', marginBottom: 7, animation: 'pulse 1.4s ease infinite' }} />
            <div style={{ height: 10, background: 'rgba(30,58,47,0.04)', borderRadius: 6, width: '80%', marginBottom: 5, animation: 'pulse 1.4s ease infinite' }} />
            <div style={{ height: 10, background: 'rgba(30,58,47,0.04)', borderRadius: 6, width: '40%', animation: 'pulse 1.4s ease infinite' }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  )
}

// ─── Carte stat ───────────────────────────────────────────────────
function StatCard({ IconComp, iconColor, label, value, sub, index, visible, loading }) {
  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', boxShadow: '0 2px 10px rgba(30,58,47,0.05)', opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(12px)', transition: `opacity 0.4s ease ${index*0.08}s, transform 0.4s ease ${index*0.08}s` }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <IconComp size={17} color={iconColor}/>
      </div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: C.green, margin: '0 0 3px' }}>{loading ? '—' : value}</p>
      <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{label}</p>
      <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{sub}</p>
    </div>
  )
}

// ─── Carte document ───────────────────────────────────────────────
function DocCard({ doc, onSelect, isSelected, isMobile, onDownload, onDelete, downloading, onVerify }) {
  const tc = TYPE_CFG[doc.type] || TYPE_CFG[doc.category] || TYPE_CFG.recu
  const { Icon: DocIcon } = tc
  const isAttestation = doc.category === 'attestation'
  const isDownloading = downloading === doc.id

  const statusBadge = doc.category === 'kyc' ? {
    validated: { Icon: IconCheckCircle, bg: 'rgba(30,58,47,0.08)',  color: '#1E3A2F', label: 'Validé'     },
    pending:   { Icon: IconRefresh,     bg: 'rgba(99,91,255,0.08)', color: '#635BFF', label: 'En attente' },
    rejected:  { Icon: IconAlertTriangle, bg: 'rgba(192,57,43,0.08)', color: '#C0392B', label: 'Rejeté'   },
  }[doc.status] : null

  return (
    <div
      onClick={() => onSelect(doc)}
      style={{
        background: C.surface, borderRadius: 12,
        border: `1.5px solid ${isSelected ? C.green : C.border}`,
        padding: '14px 16px', cursor: 'pointer',
        boxShadow: isSelected ? '0 4px 16px rgba(30,58,47,0.1)' : '0 1px 6px rgba(30,58,47,0.04)',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12,
        opacity: isDownloading ? 0.7 : 1,
      }}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(30,58,47,0.2)' }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = C.border }}
    >
      {/* Icône type */}
      <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <DocIcon size={20} color={tc.color}/>
      </div>

      {/* Infos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: tc.bg, color: tc.color, whiteSpace: 'nowrap' }}>
            <DocIcon size={9} color={tc.color}/> {tc.label}
          </span>
          {statusBadge && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: statusBadge.bg, color: statusBadge.color }}>
              <statusBadge.Icon size={9} color={statusBadge.color}/> {statusBadge.label}
            </span>
          )}
          {doc.terrain && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.62rem', color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? 110 : 200 }}>
              <IconMapPin size={9} color={C.muted}/> {doc.terrain}
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.label}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.gold, fontWeight: 600 }}>{doc.ref}</span>
          <span style={{ fontSize: '0.62rem', color: C.muted }}>{doc.date}</span>
          <span style={{ fontSize: '0.62rem', color: C.muted }}>{doc.size}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        {/* Vérifier — attestations uniquement */}
        {isAttestation && (
          <button
            onClick={e => { e.stopPropagation(); onVerify(doc) }}
            title="Vérifier l'authenticité"
            style={{
              width: 34, height: 34, borderRadius: 9, border: 'none', flexShrink: 0,
              background: 'rgba(184,151,42,0.12)', color: '#8B6D14',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,151,42,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,151,42,0.12)' }}
          >
            <IconExternalLink size={15} color="#8B6D14"/>
          </button>
        )}

        {/* Télécharger */}
        <button
          onClick={e => { e.stopPropagation(); onDownload(doc) }}
          title="Télécharger"
          style={{
            width: 34, height: 34, borderRadius: 9, border: 'none', flexShrink: 0,
            background: isDownloading ? C.green : 'rgba(30,58,47,0.07)',
            color: isDownloading ? '#F5F0E8' : C.green,
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.25s',
          }}
        >
          {isDownloading
            ? <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }}/>
            : <IconDownload size={15} color="currentColor"/>
          }
        </button>

        {/* Supprimer KYC non validé */}
        {doc.category === 'kyc' && doc.status !== 'validated' && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(doc.id) }}
            title="Supprimer"
            style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: 'rgba(192,57,43,0.07)', color: '#C0392B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          >
            <IconX size={14} color="#C0392B"/>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Panneau détail ───────────────────────────────────────────────
function DetailPanel({ doc, onDownload, downloading, onVerify }) {
  const [copied, setCopied] = useState(false)

  if (!doc) return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <IconChevronRight size={36} color="rgba(30,58,47,0.15)"/>
      <p style={{ fontSize: '0.8rem', color: C.muted, margin: 0 }}>Sélectionnez un document pour voir les détails</p>
    </div>
  )

  const tc = TYPE_CFG[doc.type] || TYPE_CFG[doc.category] || TYPE_CFG.recu
  const { Icon: DocIcon } = tc
  const isAttestation = doc.category === 'attestation'
  const isDownloading = downloading === doc.id

  const rows = [
    { label: 'Type',             value: tc.label, icon: <DocIcon size={12} color={C.muted}/> },
    { label: 'Référence',        value: doc.ref, mono: true },
    { label: 'Date',             value: doc.date },
    { label: 'Taille',           value: doc.size },
    doc.sqm    ? { label: 'Parts concernées', value: `${doc.sqm} m²` } : null,
    doc.amount ? { label: 'Montant',          value: `${doc.amount.toLocaleString('fr-FR')} FCFA` } : null,
    doc.terrain ? { label: 'Terrain', value: doc.terrain } : null,
    doc.rejection_reason ? { label: 'Motif rejet', value: doc.rejection_reason, highlight: true } : null,
  ].filter(Boolean)

  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,58,47,0.08)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', padding: '16px 18px' }}>
        <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Document · {doc.ref}</p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 3px' }}>{doc.label}</h3>
        {doc.terrain && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconMapPin size={10} color="rgba(245,240,232,0.5)"/>
            <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>{doc.terrain}</p>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Preview */}
        <div style={{ background: '#F5F0E8', borderRadius: 10, padding: '24px 20px', textAlign: 'center', border: '2px dashed rgba(30,58,47,0.12)', marginBottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DocIcon size={26} color={tc.color}/>
          </div>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.green, margin: 0, wordBreak: 'break-all' }}>{doc.nom}</p>
          <p style={{ fontSize: '0.65rem', color: C.muted, margin: 0 }}>PDF · {doc.size}</p>
        </div>

        {/* Métadonnées */}
        {rows.map(({ label, value, mono, highlight }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: '0.72rem', borderBottom: '1px solid rgba(30,58,47,0.04)' }}>
            <span style={{ color: C.muted }}>{label}</span>
            <span style={{ fontWeight: 600, color: highlight ? '#C0392B' : C.text, textAlign: 'right', maxWidth: '60%', fontSize: mono ? '0.62rem' : '0.7rem', fontFamily: mono ? 'monospace' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value}
            </span>
          </div>
        ))}

        {/* Hash SHA-256 */}
        {doc.hash && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <IconHash size={12} color={C.muted}/>
              <p style={{ margin: 0, fontSize: '0.62rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hash SHA-256</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{ fontSize: '0.62rem', color: C.green, fontFamily: 'monospace', background: 'rgba(30,58,47,0.06)', padding: '3px 7px', borderRadius: 5, flex: 1, wordBreak: 'break-all', border: '1px solid rgba(30,58,47,0.1)' }}>
                {doc.hash}
              </code>
              <button
                onClick={() => { navigator.clipboard.writeText(doc.hash); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: 'none', background: copied ? C.green : 'rgba(30,58,47,0.08)', color: copied ? '#F5F0E8' : C.green, fontSize: '0.62rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', transition: 'all 0.2s' }}
              >
                {copied ? <><IconCheck size={10} color="#F5F0E8"/> Copié</> : <><IconCopy size={10} color={C.green}/> Copier</>}
              </button>
            </div>
          </div>
        )}

        {/* Boutons actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
          {/* Vérifier l'authenticité */}
          {isAttestation && (
            <button
              onClick={() => onVerify(doc)}
              style={{
                width: '100%', padding: '10px', borderRadius: 10,
                border: '1.5px solid rgba(184,151,42,0.3)',
                background: 'rgba(184,151,42,0.08)',
                color: '#8B6D14', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <IconExternalLink size={14} color="#8B6D14"/> Vérifier l'authenticité
            </button>
          )}

          {/* Télécharger */}
          <button
            onClick={() => onDownload(doc)}
            disabled={isDownloading}
            style={{
              width: '100%', padding: '10px', borderRadius: 10, border: 'none',
              background: isDownloading ? 'rgba(30,58,47,0.4)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8', fontSize: '0.75rem', fontWeight: 700,
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isDownloading ? 'none' : '0 3px 12px rgba(30,58,47,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 40,
            }}
          >
            {isDownloading
              ? <><div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }}/>Téléchargement...</>
              : <><IconDownload size={14} color="#F5F0E8"/> Télécharger le PDF</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function DocumentsSection({ isMobile }) {
  const navigate = useNavigate()

  const [visible,       setVisible]       = useState(false)
  const [docs,          setDocs]          = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [filterType,    setFilterType]    = useState('all')
  const [search,        setSearch]        = useState('')
  const [selected,      setSelected]      = useState(null)
  const [vue,           setVue]           = useState('liste')
  const [downloading,   setDownloading]   = useState(null)

  const loadDocuments = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/documents')
      const raw = Array.isArray(data) ? data : (data.documents || data.data || [])
      setDocs(raw.map(adaptDoc))
      setUsingFallback(false)
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 405) {
        setDocs(FALLBACK_DOCS.map(adaptDoc))
        setUsingFallback(true)
      } else {
        setError('Impossible de charger les documents.')
        setDocs(FALLBACK_DOCS.map(adaptDoc))
        setUsingFallback(true)
      }
    } finally {
      setLoading(false)
      setTimeout(() => setVisible(true), 80)
    }
  }, [])

  useEffect(() => { loadDocuments() }, [loadDocuments])

  const handleVerify = (doc) => {
    const query = doc.investment_ref || doc.ref
    navigate(`/verifier/${encodeURIComponent(query)}`)
  }

  const handleDownload = async (doc) => {
    if (downloading) return
    if (usingFallback || doc.download_url === '#') {
      alert('Téléchargement disponible une fois l\'API connectée.')
      return
    }
    setDownloading(doc.id)
    try {
      const type = doc.category === 'kyc' ? 'kyc' : 'attestation'
      const response = await api.get(`/documents/${doc.id}/download?type=${type}`, { responseType: 'blob' })
      const url  = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url; link.download = `${doc.ref}_LandShare.pdf`
      document.body.appendChild(link); link.click(); link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors du téléchargement. Réessayez.')
    } finally { setDownloading(null) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document KYC ?')) return
    setDocs(p => p.filter(d => d.id !== id))
    if (selected?.id === id) setSelected(null)
    if (usingFallback) return
    try { await api.delete(`/documents/${id}`) }
    catch { loadDocuments() }
  }

  const filtered = docs.filter(doc => {
    const q = search.toLowerCase()
    return (
      (doc.nom.toLowerCase().includes(q) ||
       doc.ref.toLowerCase().includes(q) ||
       (doc.terrain ?? '').toLowerCase().includes(q)) &&
      (filterType === 'all' || doc.type === filterType || doc.category === filterType)
    )
  })

  const stats = [
    { IconComp: IconFolder,      iconColor: C.green,   label: 'Total documents', value: docs.length,                                                           sub: 'Tous types confondus'  },
    { IconComp: IconAward,       iconColor: '#8B6D14', label: 'Attestations',    value: docs.filter(d => d.category==='attestation').length,                   sub: 'Propriétés certifiées' },
    { IconComp: IconShield,      iconColor: '#8B6E1A', label: 'Documents KYC',   value: docs.filter(d => d.category==='kyc').length,                           sub: 'Vérification identité' },
    { IconComp: IconCheckCircle, iconColor: '#27AE60', label: 'Sécurisés',       value: docs.filter(d => d.status==='verified'||d.status==='validated').length, sub: 'Documents valides'     },
  ]

  const TYPE_FILTRES = [
    { id: 'all',         label: 'Tous'         },
    { id: 'attestation', label: 'Attestations' },
    { id: 'kyc',         label: 'KYC'          },
  ]

  return (
    <div style={{ opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(10px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>

      {/* Bandeau titre */}
      <div style={{ background: 'linear-gradient(135deg,#1E3A2F 0%,#2D5241 60%,#3D6B53 100%)', borderRadius: 16, padding: isMobile?'18px 16px':'20px 24px', marginBottom: 20, boxShadow: '0 4px 20px rgba(30,58,47,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Centre de documents</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile?'1.15rem':'1.3rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px' }}>Mes documents</h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              {loading ? 'Chargement...' : `${docs.length} documents disponibles · Attestations, KYC`}
            </p>
          </div>
          <button
            onClick={loadDocuments}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: 'rgba(245,240,232,0.1)', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, cursor: loading?'not-allowed':'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            <span style={{ display: 'flex', animation: loading?'spin 0.8s linear infinite':'none' }}>
              <IconRefresh size={13} color="#F5F0E8"/>
            </span>
            {loading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* Bannière fallback */}
      {usingFallback && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <IconAlertTriangle size={15} color="#8B6E1A"/>
          <p style={{ fontSize: '0.72rem', color: '#8B6E1A', margin: 0 }}>Affichage des documents de démonstration. L'API sera disponible bientôt.</p>
        </div>
      )}

      {/* Erreur */}
      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <IconAlertTriangle size={15} color="#C0392B"/>
          <p style={{ fontSize: '0.72rem', color: '#C0392B', margin: 0, flex: 1 }}>{error}</p>
          <button onClick={loadDocuments} style={{ padding: '4px 10px', borderRadius: 7, border: 'none', background: 'rgba(192,57,43,0.1)', color: '#C0392B', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {stats.map((s, i) => <StatCard key={i} {...s} index={i} visible={visible} loading={loading}/>)}
      </div>

      {/* Filtres + recherche */}
      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', marginBottom: 16, boxShadow: '0 1px 6px rgba(30,58,47,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(30,58,47,0.03)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
          <IconSearch size={14} color={C.muted}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, référence, terrain..."
            style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', color: C.text, outline: 'none', width: '100%', fontFamily: "'DM Sans', sans-serif" }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0, display: 'flex' }}>
              <IconX size={14} color={C.muted}/>
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPE_FILTRES.map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${filterType===f.id ? C.green : 'rgba(30,58,47,0.15)'}`, background: filterType===f.id ? C.green : 'transparent', color: filterType===f.id ? '#F5F0E8' : C.subtle, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
              >
                {f.label}
              </button>
            ))}
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', background: 'rgba(30,58,47,0.06)', borderRadius: 8, padding: 3 }}>
              {[{ id:'liste', Icon: IconList }, { id:'grille', Icon: IconGrid }].map(v => (
                <button
                  key={v.id}
                  onClick={() => setVue(v.id)}
                  style={{ width: 30, height: 28, borderRadius: 6, border: 'none', background: vue===v.id ? C.green : 'transparent', color: vue===v.id ? '#F5F0E8' : C.muted, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <v.Icon size={14} color="currentColor"/>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <DocSkeleton/>
      ) : filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '50px 20px' }}>
          <IconSearch size={36} color="rgba(30,58,47,0.15)"/>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Aucun document trouvé</p>
            <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Essaie un autre filtre ou terme de recherche</p>
          </div>
        </div>
      ) : isMobile ? (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(doc => (
              <DocCard key={doc.id} doc={doc} isMobile={true} onSelect={setSelected} isSelected={selected?.id===doc.id} onDownload={handleDownload} onDelete={handleDelete} downloading={downloading} onVerify={handleVerify}/>
            ))}
          </div>
          {selected && <div style={{ marginTop: 14 }}><DetailPanel doc={selected} onDownload={handleDownload} downloading={downloading} onVerify={handleVerify}/></div>}
        </div>
      ) : vue === 'liste' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(doc => (
              <DocCard key={doc.id} doc={doc} isMobile={false} onSelect={setSelected} isSelected={selected?.id===doc.id} onDownload={handleDownload} onDelete={handleDelete} downloading={downloading} onVerify={handleVerify}/>
            ))}
          </div>
          <div style={{ position: 'sticky', top: 70 }}>
            <DetailPanel doc={selected} onDownload={handleDownload} downloading={downloading} onVerify={handleVerify}/>
          </div>
        </div>
      ) : (
        /* Vue grille */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 14 }}>
          {filtered.map(doc => {
            const tc = TYPE_CFG[doc.type] || TYPE_CFG[doc.category] || TYPE_CFG.recu
            const { Icon: DocIcon } = tc
            const isAttestation = doc.category === 'attestation'
            return (
              <div
                key={doc.id}
                onClick={() => setSelected(doc)}
                style={{ background: C.surface, borderRadius: 12, border: `1.5px solid ${selected?.id===doc.id ? C.green : C.border}`, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 10px rgba(30,58,47,0.05)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(30,58,47,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(30,58,47,0.05)' }}
              >
                <div style={{ background: tc.bg, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DocIcon size={32} color={tc.color}/>
                </div>
                <div style={{ padding: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: tc.bg, color: tc.color, marginBottom: 6 }}>
                    <DocIcon size={9} color={tc.color}/> {tc.label}
                  </span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 4px', lineHeight: 1.3 }}>{doc.label}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: C.gold, margin: '0 0 6px' }}>{doc.ref}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: '0.6rem', color: C.muted }}>{doc.size}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {isAttestation && (
                        <button
                          onClick={e => { e.stopPropagation(); handleVerify(doc) }}
                          title="Vérifier"
                          style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(184,151,42,0.12)', color: '#8B6D14', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <IconExternalLink size={13} color="#8B6D14"/>
                        </button>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); handleDownload(doc) }}
                        title="Télécharger"
                        style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(30,58,47,0.07)', color: C.green, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <IconDownload size={13} color={C.green}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Note bas de page */}
      {!loading && (
        <div style={{ marginTop: 20, padding: '10px 14px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <IconLock size={14} color={C.subtle}/>
          <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
            Tous vos documents sont chiffrés et stockés de façon sécurisée.
            Les attestations sont vérifiables hors-ligne via leur hash SHA-256.{' '}
            <span
              onClick={() => navigate('/verifier')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: C.green, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Accéder à la page de vérification <IconArrowRight size={11} color={C.green}/>
            </span>
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  )
}