// ═══════════════════════════════════════════════════════════════════
// NotificationsSection.jsx — Interface professionnelle avec icônes SVG
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react'
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
function IconCheckCircle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
function IconAward({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
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
function IconMap({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
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
function IconSettings({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  )
}
function IconBell({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  )
}
function IconBellOff({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
      <path d="M18.63 13A17.89 17.89 0 0118 8"/>
      <path d="M6.26 6.26A5.86 5.86 0 006 8c0 7-3 9-3 9h14"/>
      <path d="M18 8a6 6 0 00-9.33-5"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
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
function IconCheckAll({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 12 5 16 13 8"/>
      <polyline points="8 12 12 16 21 7"/>
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
function IconTrash({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
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
function IconMapPin({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconPartyPopper({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.8 11.3L2 22l10.7-3.79"/>
      <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.24 2.24M14.7 14.7L22 22"/>
      <path d="M10 9l-6.35 6.35a2 2 0 002.83 2.83L12.83 12 10 9z"/>
      <path d="M10 9l2.83 2.83 4.24-4.24a2 2 0 00-2.83-2.83L10 9z"/>
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
function IconChevronRight({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

// ─── Config types notifications ───────────────────────────────────
const NOTIF_CFG = {
  paiement:    { Icon: IconCheckCircle, bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: 'Paiement'    },
  attestation: { Icon: IconAward,       bg: 'rgba(184,151,42,0.1)',   color: '#8B6D14', label: 'Attestation' },
  kyc:         { Icon: IconShield,      bg: 'rgba(61,107,83,0.1)',    color: '#3D6B53', label: 'KYC'         },
  terrain:     { Icon: IconMap,         bg: 'rgba(30,58,47,0.08)',    color: '#1E3A2F', label: 'Terrain'     },
  alerte:      { Icon: IconAlertTriangle, bg: 'rgba(192,57,43,0.08)', color: '#C0392B', label: 'Alerte'      },
  info:        { Icon: IconInfo,        bg: 'rgba(100,116,139,0.08)', color: '#64748B', label: 'Info'        },
  systeme:     { Icon: IconSettings,    bg: 'rgba(100,116,139,0.08)', color: '#64748B', label: 'Système'     },
}

const FALLBACK_NOTIFS = [
  { id: 1, type: 'paiement', read: false, titre: 'Paiement confirmé — LS-054', message: 'Votre transaction de 77 250 FCFA pour 5 m² sur Calavi Nord a été confirmée avec succès.', date: "Aujourd'hui", time: '14:32', action: { label: 'Voir la transaction', href: '#' }, terrain: 'Calavi Nord — Zone Résidentielle' },
  { id: 2, type: 'attestation', read: false, titre: 'Attestation disponible', message: 'Votre attestation ATT-2025-LS-00247 est prête. Téléchargez-la depuis la section Documents.', date: "Aujourd'hui", time: '14:33', action: { label: "Voir l'attestation", href: '#' }, terrain: 'Calavi Nord — Zone Résidentielle' },
  { id: 3, type: 'terrain', read: false, titre: 'Fidjrossè Balnéaire — Presque complet !', message: 'Le terrain Fidjrossè est financé à 91%. Il ne reste que 45 m² disponibles.', date: 'Hier', time: '09:15', action: { label: 'Investir maintenant', href: '#' }, terrain: 'Fidjrossè Balnéaire' },
  { id: 4, type: 'kyc', read: true, titre: 'KYC validé avec succès', message: 'Votre identité a été vérifiée et validée. Vous pouvez désormais investir librement sur LandShare Bénin.', date: '20 Sep 2025', time: '11:00', action: null, terrain: null },
  { id: 5, type: 'paiement', read: true, titre: 'Paiement confirmé — LS-047', message: 'Votre transaction de 154 500 FCFA pour 10 m² sur Fidjrossè a été confirmée.', date: '15 Oct 2025', time: '11:22', action: { label: 'Voir la transaction', href: '#' }, terrain: 'Fidjrossè Balnéaire' },
  { id: 6, type: 'alerte', read: true, titre: 'Tentative de paiement échouée', message: "Votre paiement LS-035 de 77 250 FCFA via Paystack a échoué. Aucun débit n'a été effectué.", date: '28 Sep 2025', time: '08:06', action: { label: 'Réessayer', href: '#' }, terrain: 'Fidjrossè Balnéaire' },
  { id: 7, type: 'terrain', read: true, titre: 'Nouveau terrain — Porto-Novo Est', message: 'Un nouveau terrain est disponible à Porto-Novo. À partir de 8 500 FCFA/m². Rendement estimé : 7,8%.', date: '20 Sep 2025', time: '10:00', action: { label: 'Découvrir', href: '#' }, terrain: 'Porto-Novo Est' },
  { id: 8, type: 'systeme', read: true, titre: 'Bienvenue sur LandShare Bénin', message: 'Votre compte a été créé. Commencez par compléter votre KYC pour pouvoir investir.', date: '18 Sep 2025', time: '08:00', action: { label: 'Compléter mon profil', href: '#' }, terrain: null },
]

function adaptNotif(n) {
  return {
    id:      n.id,
    type:    n.type || 'info',
    read:    !!n.read_at,
    titre:   n.title  || n.titre   || 'Notification',
    message: n.message || n.body   || '',
    date:    n.date || (n.created_at ? new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
    time:    n.time || (n.created_at ? new Date(n.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''),
    action:  n.action || (n.link ? { label: 'Voir', href: n.link } : null),
    terrain: n.terrain || n.land_name || null,
  }
}

// ─── Carte notification ───────────────────────────────────────────
function NotifCard({ notif, onRead, onDelete, isMobile, loading }) {
  const [hovered, setHovered] = useState(false)
  const cfg = NOTIF_CFG[notif.type] || NOTIF_CFG.info
  const { Icon: NotifIcon } = cfg

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   notif.read ? C.surface : 'rgba(30,58,47,0.03)',
        borderRadius: 12,
        border:       `1.5px solid ${!notif.read ? 'rgba(30,58,47,0.14)' : C.border}`,
        padding:      isMobile ? '12px' : '14px 16px',
        transition:   'all 0.2s',
        boxShadow:    hovered ? '0 4px 16px rgba(30,58,47,0.08)' : notif.read ? 'none' : '0 2px 10px rgba(30,58,47,0.06)',
        position:     'relative', overflow: 'hidden',
        opacity:      loading ? 0.5 : 1,
      }}
    >
      {/* Barre gauche non-lu */}
      {!notif.read && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, #1E3A2F, #2D5241)', borderRadius: '12px 0 0 12px' }}/>
      )}

      <div style={{ display: 'flex', gap: 12, paddingLeft: !notif.read ? 6 : 0 }}>
        {/* Icône type */}
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NotifIcon size={18} color={cfg.color}/>
        </div>

        {/* Contenu */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: notif.read ? 500 : 700, color: notif.read ? C.subtle : C.text, margin: 0 }}>
                {notif.titre}
              </p>
              {!notif.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, flexShrink: 0 }}/>}
            </div>

            {/* Boutons actions (hover desktop / toujours mobile) */}
            {(hovered || isMobile) && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {!notif.read && (
                  <button
                    onClick={() => onRead(notif.id)}
                    title="Marquer comme lu"
                    style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'rgba(30,58,47,0.07)', color: C.green, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <IconCheck size={13} color={C.green}/>
                  </button>
                )}
                <button
                  onClick={() => onDelete(notif.id)}
                  title="Supprimer"
                  style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'rgba(192,57,43,0.07)', color: '#C0392B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <IconX size={13} color="#C0392B"/>
                </button>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.72rem', color: notif.read ? C.muted : C.subtle, margin: '0 0 8px', lineHeight: 1.55 }}>
            {notif.message}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem', fontWeight: 600, background: cfg.bg, color: cfg.color }}>
                <NotifIcon size={9} color={cfg.color}/> {cfg.label}
              </span>
              {notif.terrain && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.62rem', color: C.muted }}>
                  <IconMapPin size={9} color={C.muted}/> {notif.terrain}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.62rem', color: C.muted }}>{notif.date}{notif.time ? ` · ${notif.time}` : ''}</span>
              {notif.action && (
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, border: 'none', background: notif.read ? 'rgba(30,58,47,0.07)' : C.green, color: notif.read ? C.green : '#F5F0E8', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>
                  {notif.action.label} <IconChevronRight size={10} color="currentColor"/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────
function NotifSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1,2,3,4].map(i => (
        <div key={i} style={{ background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px', display: 'flex', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(30,58,47,0.06)', flexShrink: 0, animation: 'pulse 1.4s ease infinite' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, background: 'rgba(30,58,47,0.06)', borderRadius: 6, width: '60%', marginBottom: 8, animation: 'pulse 1.4s ease infinite' }}/>
            <div style={{ height: 10, background: 'rgba(30,58,47,0.04)', borderRadius: 6, width: '90%', marginBottom: 6, animation: 'pulse 1.4s ease infinite' }}/>
            <div style={{ height: 10, background: 'rgba(30,58,47,0.04)', borderRadius: 6, width: '70%', animation: 'pulse 1.4s ease infinite' }}/>
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function NotificationsSection({ isMobile }) {
  const [visible,       setVisible]     = useState(false)
  const [notifs,        setNotifs]      = useState([])
  const [loading,       setLoading]     = useState(true)
  const [actionLoad,    setActionLoad]  = useState(null)
  const [error,         setError]       = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [filter,        setFilter]      = useState('all')
  const [typeFilter,    setTypeFilter]  = useState('all')

  const loadNotifications = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { data } = await api.get('/notifications')
      const raw = Array.isArray(data) ? data : (data.notifications || data.data || [])
      setNotifs(raw.map(adaptNotif))
      setUsingFallback(false)
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 405) {
        setNotifs(FALLBACK_NOTIFS)
        setUsingFallback(true)
      } else {
        setError('Impossible de charger les notifications.')
        setNotifs(FALLBACK_NOTIFS)
        setUsingFallback(true)
      }
    } finally {
      setLoading(false)
      setTimeout(() => setVisible(true), 80)
    }
  }, [])

  useEffect(() => { loadNotifications() }, [loadNotifications])

  const markRead = async (id) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n))
    if (usingFallback) return
    setActionLoad(id)
    try { await api.put(`/notifications/${id}/read`) }
    catch { setNotifs(p => p.map(n => n.id === id ? { ...n, read: false } : n)) }
    finally { setActionLoad(null) }
  }

  const markAllRead = async () => {
    setNotifs(p => p.map(n => ({ ...n, read: true })))
    if (usingFallback) return
    try { await api.put('/notifications/read-all') }
    catch { loadNotifications() }
  }

  const deleteNotif = async (id) => {
    setNotifs(p => p.filter(n => n.id !== id))
    if (usingFallback) return
    setActionLoad(id)
    try { await api.delete(`/notifications/${id}`) }
    catch { loadNotifications() }
    finally { setActionLoad(null) }
  }

  const deleteAll = async () => {
    setNotifs([])
    if (usingFallback) return
    try { await api.delete('/notifications') }
    catch { loadNotifications() }
  }

  const nonLues = notifs.filter(n => !n.read).length
  const filtered = notifs.filter(n => {
    const matchRead = filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'read' && n.read)
    const matchType = typeFilter === 'all' || n.type === typeFilter
    return matchRead && matchType
  })

  const stats = [
    { IconComp: IconBell,          iconColor: C.green,   label: 'Total',      value: notifs.length,                                       sub: 'Toutes notifications' },
    { IconComp: IconInfo,          iconColor: '#C0392B', label: 'Non lues',   value: nonLues,                                             sub: nonLues > 0 ? 'À consulter' : 'Tout lu !' },
    { IconComp: IconCheckCircle,   iconColor: '#27AE60', label: 'Paiements',  value: notifs.filter(n => n.type === 'paiement').length,    sub: 'Confirmations' },
    { IconComp: IconAlertTriangle, iconColor: '#C0392B', label: 'Alertes',    value: notifs.filter(n => n.type === 'alerte').length,      sub: 'À traiter' },
  ]

  const TYPE_FILTRES = [
    { id: 'all',         label: 'Toutes'       },
    { id: 'paiement',    label: 'Paiements'    },
    { id: 'attestation', label: 'Attestations' },
    { id: 'terrain',     label: 'Terrains'     },
    { id: 'alerte',      label: 'Alertes'      },
    { id: 'kyc',         label: 'KYC'          },
    { id: 'systeme',     label: 'Système'      },
  ]

  return (
    <div style={{ opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(10px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>

      {/* Bandeau titre */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #3D6B53 100%)', borderRadius: 16, padding: isMobile?'18px 16px':'20px 24px', marginBottom: 18, boxShadow: '0 4px 20px rgba(30,58,47,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Centre de notifications</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile?'1.15rem':'1.3rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
              Notifications
              {nonLues > 0 && (
                <span style={{ padding: '2px 10px', borderRadius: 20, background: 'rgba(220,53,69,0.85)', color: '#fff', fontSize: '0.72rem', fontWeight: 700 }}>{nonLues}</span>
              )}
            </h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              {loading ? 'Chargement...' : nonLues > 0
                ? `${nonLues} non lue(s) · ${notifs.length} au total`
                : `Tout est à jour · ${notifs.length} notifications`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={loadNotifications}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: 'rgba(245,240,232,0.1)', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, cursor: loading?'not-allowed':'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              <span style={{ display: 'flex', animation: loading?'spin 0.8s linear infinite':'none' }}>
                <IconRefresh size={13} color="#F5F0E8"/>
              </span>
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
            {!isMobile && nonLues > 0 && (
              <button
                onClick={markAllRead}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'rgba(245,240,232,0.12)', color: '#F5F0E8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,240,232,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,240,232,0.12)'}
              >
                <IconCheckAll size={13} color="#F5F0E8"/> Tout marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bannière fallback */}
      {usingFallback && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <IconAlertTriangle size={15} color="#8B6E1A"/>
          <p style={{ fontSize: '0.72rem', color: '#8B6E1A', margin: 0 }}>Les notifications en temps réel ne sont pas encore disponibles. Affichage des données de démonstration.</p>
        </div>
      )}

      {/* Erreur */}
      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
          <IconAlertTriangle size={15} color="#C0392B"/>
          <p style={{ fontSize: '0.72rem', color: '#C0392B', margin: 0, flex: 1 }}>{error}</p>
          <button onClick={loadNotifications} style={{ padding: '4px 10px', borderRadius: 7, border: 'none', background: 'rgba(192,57,43,0.1)', color: '#C0392B', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', boxShadow: '0 2px 10px rgba(30,58,47,0.05)', opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(12px)', transition: `opacity 0.4s ease ${i*0.08}s, transform 0.4s ease ${i*0.08}s` }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <s.IconComp size={17} color={s.iconColor}/>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: i===1 && nonLues>0 ? '#C0392B' : C.green, margin: '0 0 3px' }}>
              {loading ? '—' : s.value}
            </p>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: C.text, margin: '0 0 2px' }}>{s.label}</p>
            <p style={{ fontSize: '0.6rem', color: C.muted, margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 16px', marginBottom: 14, boxShadow: '0 1px 6px rgba(30,58,47,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          {/* Tabs lu/non-lu */}
          <div style={{ display: 'flex', background: 'rgba(30,58,47,0.05)', borderRadius: 10, padding: 3, gap: 2 }}>
            {[
              { id: 'all',    label: `Toutes (${notifs.length})` },
              { id: 'unread', label: `Non lues (${nonLues})` },
              { id: 'read',   label: 'Lues' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: filter===tab.id ? C.green : 'transparent', color: filter===tab.id ? '#F5F0E8' : C.muted, fontSize: '0.7rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            {isMobile && nonLues > 0 && (
              <button
                onClick={markAllRead}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(30,58,47,0.07)', color: C.green, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                <IconCheckAll size={12} color={C.green}/> Tout lire
              </button>
            )}
            {notifs.length > 0 && (
              <button
                onClick={deleteAll}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: 'rgba(192,57,43,0.07)', color: '#C0392B', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                <IconTrash size={12} color="#C0392B"/> Tout effacer
              </button>
            )}
          </div>
        </div>

        {/* Filtres par type */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TYPE_FILTRES.map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              style={{ padding: '4px 11px', borderRadius: 20, border: `1px solid ${typeFilter===f.id ? C.green : 'rgba(30,58,47,0.15)'}`, background: typeFilter===f.id ? C.green : 'transparent', color: typeFilter===f.id ? '#F5F0E8' : C.subtle, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <NotifSkeleton/>
      ) : filtered.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '60px 20px' }}>
          {filter === 'unread'
            ? <IconPartyPopper size={40} color="rgba(30,58,47,0.2)"/>
            : <IconBellOff size={40} color="rgba(30,58,47,0.2)"/>
          }
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 6px' }}>
              {filter === 'unread' ? 'Tout est à jour !' : 'Aucune notification'}
            </p>
            <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
              {filter === 'unread'
                ? 'Vous avez lu toutes vos notifications.'
                : 'Aucune notification ne correspond à ce filtre.'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(notif => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onRead={markRead}
              onDelete={deleteNotif}
              isMobile={isMobile}
              loading={actionLoad === notif.id}
            />
          ))}
        </div>
      )}

      {/* Note bas de page */}
      {!loading && (
        <div style={{ marginTop: 18, padding: '10px 14px', background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconBell size={14} color={C.subtle}/>
          <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
            Les notifications de paiement et d'attestation sont envoyées automatiquement après chaque transaction confirmée.
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