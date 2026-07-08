// ═══════════════════════════════════════════════════════════════════
// TerrainsSection.jsx — ✅ Connecté à l'API Laravel
// GET /api/lands
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { landsApi } from '../../services/landshareApi'

// ─── Tokens ────────────────────────────────────────────────────────
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

// ─── Gradients par index ────────────────────────────────────────────
const GRADIENTS = [
  'linear-gradient(135deg, #1E3A2F 0%, #2D5241 100%)',
  'linear-gradient(135deg, #2D5241 0%, #B8972A 100%)',
  'linear-gradient(135deg, #3D6B53 0%, #1E3A2F 100%)',
  'linear-gradient(135deg, #4A3F35 0%, #6B5B4E 100%)',
  'linear-gradient(135deg, #B8972A 0%, #8B6D14 100%)',
  'linear-gradient(135deg, #1E3A2F 0%, #3D6B53 100%)',
]
const EMOJIS = ['🏡', '🌊', '🏢', '🏗️', '🏛️', '🎨', '🌿', '🏘️']

// ─── Adapter données API → format composants ───────────────────────
function adaptLand(land, index) {
  const statut = land.status === 'published' && land.available_sqm > 0
    ? 'disponible'
    : land.status === 'full'
      ? 'complet'
      : land.status === 'draft'
        ? 'brouillon'
        : 'en_cours'

  return {
    id:          land.id,
    nom:         land.title,
    location:    land.location || land.city,
    statut,
    prixM2:      parseFloat(land.price_per_sqm),
    superfTotal: land.total_sqm,
    superfDispo: land.available_sqm,
    progress:    land.funding_progress || 0,
    rendement:   parseFloat(land.rendement) || 0,
    notaire:     land.notary_name || 'Notaire certifié',
    certifie:    !!land.notary_name,
    tag:         land.city || 'Bénin',
    emoji:       EMOJIS[index % EMOJIS.length],
    gradient:    GRADIENTS[index % GRADIENTS.length],
  }
}

// ─── Statut badge config ────────────────────────────────────────────
const STATUT = {
  disponible: { label: 'Disponible',      bg: 'rgba(30,58,47,0.09)',   color: '#1E3A2F' },
  en_cours:   { label: 'Presque complet', bg: 'rgba(184,151,42,0.12)', color: '#8B6D14' },
  complet:    { label: 'Complet',         bg: 'rgba(45,82,65,0.13)',   color: '#2D5241' },
  brouillon:  { label: 'Bientôt dispo',   bg: 'rgba(140,130,120,0.1)', color: '#6B5B4E' },
}

// ─── Barre de progression ───────────────────────────────────────────
function ProgressBar({ value }) {
  return (
    <div style={{ height: 5, borderRadius: 99, background: 'rgba(30,58,47,0.08)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        width: `${value}%`,
        background: value >= 90
          ? `linear-gradient(90deg, ${C.gold}, #D4AD3A)`
          : `linear-gradient(90deg, ${C.green}, ${C.green2})`,
        transition: 'width 0.8s ease',
      }} />
    </div>
  )
}

// ─── Badge statut ────────────────────────────────────────────────────
function StatutBadge({ statut }) {
  const s = STATUT[statut] || STATUT.disponible
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      background: s.bg, color: s.color,
      fontSize: '0.62rem', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

// ─── Carte terrain ───────────────────────────────────────────────────
function TerrainCard({ terrain, isMobile, onInvest }) {
  const [hovered, setHovered] = useState(false)
  const isComplet   = terrain.statut === 'complet'
  const isBrouillon = terrain.statut === 'brouillon'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        borderRadius: 14,
        border: `1px solid ${hovered ? 'rgba(30,58,47,0.16)' : 'rgba(30,58,47,0.07)'}`,
        boxShadow: hovered ? '0 6px 28px rgba(30,58,47,0.12)' : '0 2px 10px rgba(30,58,47,0.05)',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        opacity: isBrouillon ? 0.8 : 1,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Vignette */}
      <div style={{ background: terrain.gradient, padding: '16px 16px 14px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(245,240,232,0.15)',
          border: '1px solid rgba(245,240,232,0.2)',
          borderRadius: 6, padding: '2px 7px',
          fontSize: '0.58rem', fontWeight: 700,
          color: 'rgba(245,240,232,0.85)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          {terrain.tag}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{terrain.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.88rem', fontWeight: 700,
              color: '#F5F0E8', margin: '0 0 3px', lineHeight: 1.3,
            }}>
              {terrain.nom}
            </h3>
            <p style={{ fontSize: '0.62rem', color: 'rgba(245,240,232,0.6)', margin: 0 }}>
              📍 {terrain.location}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <p style={{ margin: '0 0 1px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prix / m²</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: C.goldTxt, margin: 0 }}>
              {terrain.prixM2.toLocaleString('fr-FR')} F
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 1px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rendement est.</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#7DCEA0', margin: 0 }}>
              +{terrain.rendement}%
            </p>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <StatutBadge statut={terrain.statut} />
          {terrain.certifie && (
            <span style={{ fontSize: '0.6rem', color: C.gold, display: 'flex', alignItems: 'center', gap: 3 }}>
              🏅 Certifié notaire
            </span>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: '0.62rem', color: C.subtle }}>Financement</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: terrain.progress >= 90 ? C.gold : C.green }}>
              {terrain.progress}%
            </span>
          </div>
          <ProgressBar value={terrain.progress} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.6rem', color: C.muted }}>
              {(terrain.superfTotal - terrain.superfDispo).toLocaleString('fr-FR')} m² vendus
            </span>
            <span style={{ fontSize: '0.6rem', color: C.muted }}>
              {terrain.superfDispo.toLocaleString('fr-FR')} m² restants
            </span>
          </div>
        </div>

        <button
          onClick={() => !isComplet && !isBrouillon && onInvest(terrain.id)}
          disabled={isComplet || isBrouillon}
          style={{
            width: '100%', padding: '10px',
            borderRadius: 10, border: 'none',
            background: isComplet || isBrouillon
              ? 'rgba(30,58,47,0.08)'
              : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
            color: isComplet || isBrouillon ? C.muted : '#F5F0E8',
            fontSize: '0.75rem', fontWeight: 700,
            cursor: isComplet || isBrouillon ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: isComplet || isBrouillon ? 'none' : '0 3px 12px rgba(30,58,47,0.22)',
            marginTop: 'auto',
          }}
        >
          {isComplet ? '✅ Terrain complet' : isBrouillon ? '🔜 Bientôt disponible' : '→ Investir maintenant'}
        </button>
      </div>
    </div>
  )
}

// ─── Filtres ──────────────────────────────────────────────────────────
function FilterBar({ filtre, setFiltre, vue, setVue, isMobile }) {
  const filtres = [
    { id: 'tous',       label: 'Tous'        },
    { id: 'disponible', label: 'Disponibles' },
    { id: 'en_cours',   label: 'En cours'    },
    { id: 'complet',    label: 'Complets'    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {filtres.map(f => (
          <button key={f.id} onClick={() => setFiltre(f.id)} style={{
            padding: '5px 12px', borderRadius: 20,
            border: `1px solid ${filtre === f.id ? C.green : 'rgba(30,58,47,0.15)'}`,
            background: filtre === f.id ? C.green : 'transparent',
            color: filtre === f.id ? '#F5F0E8' : C.subtle,
            fontSize: '0.68rem', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', background: 'rgba(30,58,47,0.06)', borderRadius: 8, padding: 3 }}>
          {[{ id: 'grille', icon: '⊞' }, { id: 'liste', icon: '☰' }].map(v => (
            <button key={v.id} onClick={() => setVue(v.id)} style={{
              padding: '4px 10px', borderRadius: 6, border: 'none',
              background: vue === v.id ? C.green : 'transparent',
              color: vue === v.id ? '#F5F0E8' : C.muted,
              fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {v.icon}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Vue liste ────────────────────────────────────────────────────────
function TerrainRow({ terrain, onInvest }) {
  const [hovered, setHovered] = useState(false)
  const isComplet   = terrain.statut === 'complet'
  const isBrouillon = terrain.statut === 'brouillon'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
        alignItems: 'center', gap: 12,
        padding: '12px 16px',
        background: hovered ? 'rgba(30,58,47,0.03)' : 'transparent',
        borderBottom: '1px solid rgba(30,58,47,0.05)',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: terrain.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>
          {terrain.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: '0 0 2px', fontSize: '0.75rem', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {terrain.nom}
          </p>
          <p style={{ margin: 0, fontSize: '0.62rem', color: C.muted }}>📍 {terrain.location}</p>
        </div>
      </div>

      <div>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: C.green, fontFamily: "'Playfair Display', serif" }}>
          {terrain.prixM2.toLocaleString('fr-FR')} F
        </p>
        <p style={{ margin: 0, fontSize: '0.6rem', color: C.muted }}>par m²</p>
      </div>

      <div style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.6rem', color: C.muted }}>{terrain.progress}%</span>
        </div>
        <ProgressBar value={terrain.progress} />
      </div>

      <StatutBadge statut={terrain.statut} />

      <button
        onClick={() => !isComplet && !isBrouillon && onInvest(terrain.id)}
        disabled={isComplet || isBrouillon}
        style={{
          padding: '6px 12px', borderRadius: 8, border: 'none',
          background: isComplet || isBrouillon ? 'rgba(30,58,47,0.07)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          color: isComplet || isBrouillon ? C.muted : '#F5F0E8',
          fontSize: '0.65rem', fontWeight: 700,
          cursor: isComplet || isBrouillon ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s', whiteSpace: 'nowrap',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {isComplet ? 'Complet' : isBrouillon ? 'Bientôt' : 'Investir →'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL ✅ Connecté à l'API
// ═══════════════════════════════════════════════════════════════════
export default function TerrainsSection({ isMobile }) {
  const navigate = useNavigate()

  const [terrains, setTerrains] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [filtre,   setFiltre]   = useState('tous')
  const [vue,      setVue]      = useState('grille')
  const [search,   setSearch]   = useState('')
  const [visible,  setVisible]  = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  // ─── Charger les terrains depuis l'API ─────────────────────────
  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        setLoading(true)
        const { data } = await landsApi.getAll()
        // Adapter les données API
        const adapted = data.lands.map((land, i) => adaptLand(land, i))
        setTerrains(adapted)
      } catch (err) {
        setError('Impossible de charger les terrains.')
      } finally {
        setLoading(false)
      }
    }
    fetchTerrains()
  }, [])

  const onInvest = (id) => navigate(`/terrains/${id}`)

  // Filtrage local
  const filtered = terrains.filter(t => {
    const matchFiltre = filtre === 'tous' || t.statut === filtre
    const matchSearch = t.nom.toLowerCase().includes(search.toLowerCase()) ||
                        t.location.toLowerCase().includes(search.toLowerCase())
    return matchFiltre && matchSearch
  })

  // Stats calculées depuis les données réelles
  const stats = [
    { emoji: '🗺️', label: 'Terrains disponibles', value: terrains.filter(t => t.statut === 'disponible').length },
    { emoji: '📈', label: 'Rendement moyen',       value: terrains.length > 0 ? (terrains.reduce((s, t) => s + t.rendement, 0) / terrains.length).toFixed(1) + '%' : '—' },
    { emoji: '📐', label: 'm² disponibles',         value: terrains.reduce((s, t) => s + t.superfDispo, 0).toLocaleString('fr-FR') },
    { emoji: '🏅', label: 'Terrains certifiés',     value: terrains.filter(t => t.certifie).length },
  ]

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
        marginBottom: 20,
        boxShadow: '0 4px 20px rgba(30,58,47,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '0.62rem', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Explorer
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? '1.15rem' : '1.3rem',
              fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px',
            }}>
              Terrains disponibles
            </h2>
            <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.55)', margin: 0 }}>
              {loading ? '...' : `${terrains.filter(t => t.statut === 'disponible').length} terrains ouverts à l'investissement · Bénin`}
            </p>
          </div>

          {!isMobile && !loading && (
            <div style={{ display: 'flex', gap: 8 }}>
              {stats.slice(0, 2).map(s => (
                <div key={s.label} style={{
                  background: 'rgba(245,240,232,0.08)',
                  border: '1px solid rgba(245,240,232,0.12)',
                  borderRadius: 12, padding: '8px 14px', textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '0.58rem', color: 'rgba(245,240,232,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                  <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#D4AD3A' }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats mobile */}
      {isMobile && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: C.surface, borderRadius: 12,
              border: `1px solid ${C.border}`,
              padding: '10px 12px',
              boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
            }}>
              <span style={{ fontSize: '1rem' }}>{s.emoji}</span>
              <p style={{ margin: '4px 0 1px', fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.green }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.6rem', color: C.muted }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recherche + filtres */}
      <div style={{
        background: C.surface, borderRadius: 14,
        border: `1px solid ${C.border}`,
        padding: '14px 16px', marginBottom: 16,
        boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
      }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.8rem', color: C.muted, pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un terrain, une ville…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '9px 12px 9px 32px',
              borderRadius: 10, border: `1px solid rgba(30,58,47,0.12)`,
              background: 'rgba(30,58,47,0.03)',
              fontSize: '0.75rem', color: C.text,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(30,58,47,0.3)'}
            onBlur={e  => e.currentTarget.style.borderColor = 'rgba(30,58,47,0.12)'}
          />
        </div>
        <FilterBar filtre={filtre} setFiltre={setFiltre} vue={vue} setVue={setVue} isMobile={isMobile} />
      </div>

      {/* ── États : loading / erreur / résultats ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '3px solid rgba(30,58,47,0.15)',
            borderTopColor: C.green,
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 14px',
          }} />
          <p style={{ fontSize: '0.78rem', color: C.muted }}>Chargement des terrains...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

      ) : error ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          background: C.surface, borderRadius: 14,
          border: `1px solid rgba(192,57,43,0.15)`,
        }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: 10 }}>⚠️</span>
          <p style={{ fontSize: '0.82rem', color: '#C0392B', fontWeight: 600, margin: '0 0 8px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: C.green, color: '#F5F0E8',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Réessayer
          </button>
        </div>

      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: '2.5rem' }}>🔍</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '12px 0 6px' }}>
            Aucun terrain trouvé
          </p>
          <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>
            Essaie un autre filtre ou terme de recherche
          </p>
        </div>

      ) : vue === 'grille' || isMobile ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(t => (
            <TerrainCard key={t.id} terrain={t} isMobile={isMobile} onInvest={onInvest} />
          ))}
        </div>

      ) : (
        <div style={{
          background: C.surface, borderRadius: 14,
          border: `1px solid ${C.border}`,
          boxShadow: '0 1px 6px rgba(30,58,47,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            gap: 12, padding: '10px 16px',
            borderBottom: `1px solid ${C.border}`,
            background: 'rgba(30,58,47,0.03)',
          }}>
            {['Terrain', 'Prix / m²', 'Financement', 'Statut', 'Action'].map(h => (
              <span key={h} style={{ fontSize: '0.6rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {h}
              </span>
            ))}
          </div>
          {filtered.map(t => <TerrainRow key={t.id} terrain={t} onInvest={onInvest} />)}
        </div>
      )}

      {/* Note bas de page */}
      {!loading && !error && (
        <div style={{
          marginTop: 20, padding: '10px 14px',
          background: 'rgba(30,58,47,0.04)',
          border: `1px solid rgba(30,58,47,0.08)`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: '0.78rem', flexShrink: 0 }}>ℹ️</span>
          <p style={{ fontSize: '0.62rem', color: C.subtle, margin: 0, lineHeight: 1.5 }}>
            Les rendements affichés sont des estimations basées sur les données du marché foncier béninois.
            Tout investissement comporte des risques. <strong style={{ color: C.green }}>KYC requis</strong> avant tout achat.
          </p>
        </div>
      )}
    </div>
  )
}
