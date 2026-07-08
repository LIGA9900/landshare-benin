// ═══════════════════════════════════════════════════════════════════
// AdminLayout.jsx — ✅ Badges dynamiques depuis l'API
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

// ─── Hook media query ─────────────────────────────────────────────
export function useMediaQuery(q) {
  const [m, setM] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(q).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(q)
    const h = e => setM(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [q])
  return m
}

// ─── Hook polices ─────────────────────────────────────────────────
export function useFonts() {
  useEffect(() => {
    const l = document.createElement('link')
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    l.rel  = 'stylesheet'
    document.head.appendChild(l)
  }, [])
}

// ─── Navigation items — sans badges (injectés dynamiquement) ──────
// ✅ CORRECTION : les badges ne sont plus des valeurs fixes écrites
// en dur dans le code. La liste NAV_ITEMS ne contient plus de badge
// du tout — ils sont calculés depuis l'API dans le composant Sidebar.
export const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Tableau de bord', path: '/admin'                },
  { id: 'utilisateurs', label: 'Utilisateurs',    path: '/admin/utilisateurs'   },
  { id: 'terrains',     label: 'Terrains',        path: '/admin/terrains'       },
  { id: 'transactions', label: 'Transactions',    path: '/admin/transactions'   },
  { id: 'kyc',          label: 'KYC',             path: '/admin/kyc'            },
  { id: 'statistiques', label: 'Statistiques',    path: '/admin/statistiques'   },
]

// ═══════════════════════════════════════════════
// ICÔNES
// ═══════════════════════════════════════════════
export function Icon({ name, size = 18 }) {
  const icons = {
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    utilisateurs: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    terrains: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
    transactions: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    kyc: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    statistiques: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    chevronLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    filter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
  }
  return icons[name] || null
}

// ═══════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════
export function AdminSidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ BADGES DYNAMIQUES — chargés depuis /admin/statistics
  // Structure des badges :
  //   utilisateurs  = total_users       (tous les investisseurs)
  //   transactions  = total_investments (investissements confirmés)
  //   kyc           = pending_kyc       (dossiers en attente — rouge si > 0)
  //   terrains      = total_lands       (nombre de terrains)
  // Le badge n'est affiché que si la valeur est > 0.
  const [badges, setBadges] = useState({
    utilisateurs: null,
    terrains:     null,
    transactions: null,
    kyc:          null,
  })

  useEffect(() => {
    const loadBadges = async () => {
      try {
        // Appel 1 — statistiques globales
        const { data: stats } = await api.get('/admin/statistics')

        // Appel 2 — nombre de terrains (pas dans /statistics)
        let totalLands = null
        try {
          const { data: landsData } = await api.get('/admin/lands?per_page=1')
          // Si l'API retourne une pagination, on prend le total
          totalLands = landsData?.meta?.total
                    ?? landsData?.total
                    ?? landsData?.lands?.length
                    ?? null
        } catch { /* pas grave */ }

        setBadges({
          // Utilisateurs : afficher le total réel
          utilisateurs: stats.total_users > 0 ? stats.total_users : null,

          // Terrains : afficher le nombre total
          terrains: totalLands > 0 ? totalLands : null,

          // Transactions : afficher le nombre total
          transactions: stats.total_investments > 0 ? stats.total_investments : null,

          // KYC : N'afficher le badge QUE s'il y a des dossiers en attente
          // C'est le plus important — c'est une alerte pour l'admin
          kyc: stats.pending_kyc > 0 ? stats.pending_kyc : null,
        })
      } catch {
        // Silencieux — pas de badge si l'API ne répond pas
      }
    }

    loadBadges()

    // Recharger les badges toutes les 60 secondes
    // pour refléter les nouveaux dossiers KYC arrivants
    const interval = setInterval(loadBadges, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside style={{
      width: collapsed ? 68 : 240,
      background: '#111810',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      flexShrink: 0, overflow: 'hidden',
      position: 'relative', zIndex: 10,
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
      }}>
        {!collapsed && (
          <Link to="/" style={{
            display: 'flex', alignItems: 'center',
            gap: 8, textDecoration: 'none',
          }}>
            <div style={{
              width: 30, height: 30, background: '#1E3A2F',
              borderRadius: 7, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: 12, height: 12, background: '#B8972A',
                clipPath: 'polygon(50% 0%,100% 50%,50% 100%,0% 50%)',
              }} />
            </div>
            <div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8',
              }}>
                Land<span style={{ color: '#B8972A' }}>Share</span>
              </span>
              <span style={{
                display: 'block', fontSize: '0.55rem',
                color: '#B8972A', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Admin
              </span>
            </div>
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(245,240,232,0.06)',
            border: '1px solid rgba(245,240,232,0.1)',
            borderRadius: 7, width: 26, height: 26,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            color: 'rgba(245,240,232,0.4)',
            transition: 'all 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245,240,232,0.12)'
            e.currentTarget.style.color = '#F5F0E8'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245,240,232,0.06)'
            e.currentTarget.style.color = 'rgba(245,240,232,0.4)'
          }}
        >
          <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={14} />
        </button>
      </div>

      {/* Badge rôle */}
      {!collapsed && (
        <div style={{ padding: '10px 20px 6px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(184,151,42,0.12)',
            border: '1px solid rgba(184,151,42,0.25)',
            borderRadius: 20, padding: '3px 10px',
            fontSize: '0.6rem', fontWeight: 700,
            color: '#B8972A', letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#B8972A',
              animation: 'pulse 2s ease infinite',
            }} />
            Administrateur
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 10px', overflow: 'hidden' }}>
        {!collapsed && (
          <p style={{
            fontSize: '0.55rem', fontWeight: 700, color: 'rgba(245,240,232,0.25)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            padding: '6px 10px 4px', margin: 0,
          }}>
            Navigation
          </p>
        )}

        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path))

          // ✅ Récupérer le badge dynamique pour cet item
          const badgeValue = badges[item.id] ?? null

          // Le badge KYC est rouge (alerte), les autres sont dorés
          const isAlerte = item.id === 'kyc'

          return (
            <Link
              key={item.id}
              to={item.path}
              title={collapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px 0' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 9, textDecoration: 'none',
                background: isActive
                  ? 'rgba(184,151,42,0.1)'
                  : 'transparent',
                borderLeft: isActive
                  ? '2px solid #B8972A'
                  : '2px solid transparent',
                color: isActive
                  ? '#D4AD3A'
                  : 'rgba(245,240,232,0.5)',
                transition: 'all 0.18s',
                marginBottom: 2,
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(245,240,232,0.05)'
                  e.currentTarget.style.color = '#F5F0E8'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(245,240,232,0.5)'
                }
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Icon name={item.id} size={17} />
                {/* Badge en mode collapsed — petit point ou chiffre */}
                {collapsed && badgeValue && (
                  <div style={{
                    position: 'absolute', top: -5, right: -5,
                    minWidth: 14, height: 14, borderRadius: 7,
                    background: isAlerte ? '#C0392B' : '#B8972A',
                    border: '1.5px solid #111810',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.5rem', fontWeight: 700, color: '#fff',
                    padding: '0 3px',
                  }}>
                    {badgeValue > 99 ? '99+' : badgeValue}
                  </div>
                )}
              </div>

              {!collapsed && (
                <>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 400,
                    flex: 1, whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </span>

                  {/* ✅ Badge dynamique — affiché seulement si > 0 */}
                  {badgeValue && (
                    <span style={{
                      background: isAlerte
                        ? '#C0392B'
                        : 'rgba(184,151,42,0.2)',
                      color: isAlerte ? '#fff' : '#D4AD3A',
                      fontSize: '0.6rem', fontWeight: 700,
                      borderRadius: 20, padding: '1px 7px',
                      minWidth: 20, textAlign: 'center',
                      // Animation légère pour le badge KYC quand il y a des alertes
                      animation: isAlerte ? 'badgePulse 2s ease infinite' : 'none',
                    }}>
                      {badgeValue > 99 ? '99+' : badgeValue}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid rgba(245,240,232,0.06)',
        display: 'flex', alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 700,
          color: '#F5F0E8', flexShrink: 0,
        }}>
          AD
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontSize: '0.75rem', fontWeight: 600,
                color: '#F5F0E8', margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                Admin Principal
              </p>
              <p style={{
                fontSize: '0.62rem',
                color: 'rgba(245,240,232,0.35)',
                margin: 0,
              }}>
                admin@landshare.bj
              </p>
            </div>
            <button
              onClick={() => navigate('/connexion')}
              style={{
                background: 'none', border: 'none',
                cursor: 'pointer',
                color: 'rgba(245,240,232,0.3)',
                padding: 4, transition: 'color 0.2s',
              }}
              title="Déconnexion"
              onMouseEnter={e => e.currentTarget.style.color = '#F5F0E8'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.3)'}
            >
              <Icon name="logout" size={15} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════
export function AdminTopbar({ title, subtitle, actions }) {
  // ✅ Badge cloche dynamique — KYC en attente
  const [pendingKyc, setPendingKyc] = useState(0)

  useEffect(() => {
    api.get('/admin/statistics')
      .then(({ data }) => setPendingKyc(data.pending_kyc || 0))
      .catch(() => {})
  }, [])

  return (
    <header style={{
      height: 58,
      background: '#FAFAF7',
      borderBottom: '1px solid rgba(30,58,47,0.07)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1rem', fontWeight: 700,
          color: '#1A1A1A', margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(30,58,47,0.05)',
          border: '1px solid rgba(30,58,47,0.1)',
          borderRadius: 8, padding: '6px 12px',
        }}>
          <Icon name="search" size={14} />
          <input
            placeholder="Rechercher..."
            style={{
              border: 'none', background: 'transparent',
              fontSize: '0.75rem', color: '#4A3F35',
              outline: 'none', width: 140,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Cloche avec badge KYC dynamique */}
        <div style={{ position: 'relative' }}>
          <button style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'transparent',
            border: '1.5px solid rgba(30,58,47,0.1)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            color: '#4A3F35', transition: 'all 0.2s',
          }}>
            <Icon name="bell" size={16} />
          </button>
          {/* ✅ Badge cloche dynamique — visible seulement si KYC en attente */}
          {pendingKyc > 0 && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              minWidth: 16, height: 16, borderRadius: 8,
              background: '#C0392B',
              border: '2px solid #FAFAF7',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem', fontWeight: 700, color: '#fff',
              padding: '0 3px',
            }}>
              {pendingKyc > 99 ? '99+' : pendingKyc}
            </div>
          )}
        </div>

        {actions}

        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.65rem', fontWeight: 700, color: '#F5F0E8',
          cursor: 'pointer',
        }}>
          AD
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════
// LAYOUT WRAPPER
// ═══════════════════════════════════════════════
export default function AdminLayout({ children, title, subtitle, actions }) {
  useFonts()
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // ✅ Badge KYC pour la topbar mobile
  const [pendingKyc, setPendingKyc] = useState(0)

  useEffect(() => {
    api.get('/admin/statistics')
      .then(({ data }) => setPendingKyc(data.pending_kyc || 0))
      .catch(() => {})
  }, [])

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
      background: '#F5F0E8', fontSize: '13px',
      position: 'relative',
    }}>

      {/* Overlay mobile */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (mobileOpen ? 0 : -280) : 'auto',
        top: 0, bottom: 0, zIndex: 50,
        transition: 'left 0.3s ease',
        width: isMobile ? 240 : (collapsed ? 68 : 240),
      }}>
        <AdminSidebar
          collapsed={isMobile ? false : collapsed}
          setCollapsed={setCollapsed}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          height: 58,
          background: '#FAFAF7',
          borderBottom: '1px solid rgba(30,58,47,0.07)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px', flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#1E3A2F', padding: 4,
                  display: 'flex', alignItems: 'center',
                }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            )}
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 700, color: '#1A1A1A', margin: 0,
              }}>
                {title}
              </h1>
              {subtitle && !isMobile && (
                <p style={{ fontSize: '0.65rem', color: '#8C8278', margin: 0 }}>{subtitle}</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(30,58,47,0.05)',
                border: '1px solid rgba(30,58,47,0.1)',
                borderRadius: 8, padding: '6px 12px',
              }}>
                <Icon name="search" size={14} />
                <input
                  placeholder="Rechercher..."
                  style={{
                    border: 'none', background: 'transparent',
                    fontSize: '0.75rem', color: '#4A3F35',
                    outline: 'none', width: 140,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            )}

            {/* ✅ Cloche avec badge KYC dynamique */}
            <div style={{ position: 'relative' }}>
              <button style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'transparent',
                border: '1.5px solid rgba(30,58,47,0.1)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
                color: '#4A3F35',
              }}>
                <Icon name="bell" size={16} />
              </button>
              {pendingKyc > 0 && (
                <div style={{
                  position: 'absolute', top: -3, right: -3,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#C0392B',
                  border: '2px solid #FAFAF7',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.55rem', fontWeight: 700, color: '#fff',
                  padding: '0 3px',
                }}>
                  {pendingKyc > 99 ? '99+' : pendingKyc}
                </div>
              )}
            </div>

            {actions}

            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'linear-gradient(135deg, #1E3A2F, #B8972A)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: 700, color: '#F5F0E8',
              cursor: 'pointer',
            }}>
              AD
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '16px' : '20px 24px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes pulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(30,58,47,0.15);border-radius:3px}
      `}</style>
    </div>
  )
}