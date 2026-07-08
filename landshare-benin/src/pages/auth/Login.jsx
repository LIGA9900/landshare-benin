// ═══════════════════════════════════════════════════════════════════
// Login.jsx — ✅ Responsive Mobile
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

// ─── Hook responsive ───────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

// ─── Icône œil ─────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
         stroke="#F5F0E8" strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ─── Champ input ───────────────────────────────────────────────────
function InputField({ label, type='text', placeholder, value, onChange,
                      icon, rightElement, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: '0.78rem', fontWeight: 600,
        color: focused ? '#1E3A2F' : '#4A3F35',
        marginBottom: 6, transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
            color: focused ? '#1E3A2F' : '#8C8278', transition: 'color 0.2s',
          }}>
            {icon}
          </div>
        )}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: `13px ${rightElement ? '44px' : '14px'} 13px ${icon ? '44px' : '14px'}`,
            borderRadius: 10,
            border: `1.5px solid ${error ? '#C0392B' : focused ? '#1E3A2F' : 'rgba(30,58,47,0.15)'}`,
            background: focused ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
            fontSize: '0.88rem', color: '#1A1A1A', outline: 'none',
            transition: 'all 0.2s',
            boxShadow: focused ? '0 0 0 4px rgba(30,58,47,0.07)' : 'none',
            fontFamily: "'DM Sans', sans-serif",
            boxSizing: 'border-box',
          }}
        />
        {rightElement && (
          <div style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)', color: '#8C8278',
          }}>
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: '0.7rem', color: '#C0392B', margin: '4px 0 0' }}>
          ⚠ {error}
        </p>
      )}
    </div>
  )
}

// ─── Composant principal ───────────────────────────────────────────
export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [mounted,  setMounted]  = useState(false)

  const navigate = useNavigate()
  const isMobile = useIsMobile()

  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
    setTimeout(() => setMounted(true), 50)
  }, [])

  const validate = () => {
    const errs = {}
    if (!email)                           errs.email    = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = 'Email invalide'
    if (!password)                         errs.password = 'Mot de passe requis'
    else if (password.length < 6)          errs.password = 'Minimum 6 caractères'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user',  JSON.stringify(user))
      if (user.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response
        if (status === 401)      setApiError('Email ou mot de passe incorrect.')
        else if (status === 403) setApiError(data.message || 'Compte suspendu.')
        else if (status === 422) {
          const e = data.errors || {}
          setErrors({ email: e.email?.[0] || '', password: e.password?.[0] || '' })
        } else setApiError('Une erreur est survenue. Réessayez.')
      } else {
        setApiError('Impossible de contacter le serveur.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: isMobile ? 'block' : 'grid',
      gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── Colonne gauche / Header mobile ── */}
      {isMobile ? (
        // MOBILE — Bandeau compact en haut
        <div style={{
          background: 'linear-gradient(160deg, #0D2318 0%, #1E3A2F 60%, #2D5241 100%)',
          padding: '32px 24px 28px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(184,151,42,0.15) 0%, transparent 60%)',
          }} />
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 2, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, background: 'rgba(245,240,232,0.12)', borderRadius: 9, border: '1px solid rgba(245,240,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 14, height: 14, background: '#B8972A', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F5F0E8' }}>
              Land<span style={{ color: '#D4AD3A' }}>Share</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 8px', position: 'relative', zIndex: 2, lineHeight: 1.2 }}>
            Bon retour 
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(245,240,232,0.6)', margin: 0, position: 'relative', zIndex: 2 }}>
            Connectez-vous pour accéder à votre portefeuille
          </p>
          <div style={{ display: 'flex', gap: 20, marginTop: 16, position: 'relative', zIndex: 2 }}>
            {[{ value: '1 200+', label: 'Investisseurs' }, { value: '48', label: 'Terrains' }, { value: '14%', label: 'Rendement' }].map(({ value, label }) => (
              <div key={label}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: '#D4AD3A', margin: '0 0 1px' }}>{value}</p>
                <p style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // DESKTOP — Colonne gauche complète
        <div style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #0D2318 0%, #1E3A2F 40%, #2D5241 70%, #B8972A 130%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 20% 80%, rgba(184,151,42,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 20%, rgba(30,58,47,0.4) 0%, transparent 60%)
            `,
          }} />
          <div style={{ position: 'absolute', bottom: -80, right: -80, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(184,151,42,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(184,151,42,0.18)', pointerEvents: 'none' }} />

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 2, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-10px)', transition: 'all 0.6s ease' }}>
            <div style={{ width: 38, height: 38, background: 'rgba(245,240,232,0.12)', borderRadius: 10, border: '1px solid rgba(245,240,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 16, height: 16, background: '#B8972A', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: '#F5F0E8' }}>
              Land<span style={{ color: '#D4AD3A' }}>Share</span>
            </span>
          </Link>

          <div style={{ position: 'relative', zIndex: 2, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.15s' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.3)', borderRadius: 50, padding: '6px 14px', marginBottom: 24, fontSize: '0.7rem', fontWeight: 600, color: '#D4AD3A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AD3A', animation: 'pulse 2s ease infinite' }} />
              Plateforme certifiée OHADA · Bénin
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem, 3.5vw, 3.8rem)', fontWeight: 700, color: '#F5F0E8', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Votre patrimoine<br />
              <span style={{ color: '#D4AD3A' }}>vous attend</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.7, maxWidth: 380, marginBottom: 40, fontWeight: 300 }}>
              Connectez-vous pour accéder à votre portefeuille foncier, suivre vos investissements et découvrir de nouveaux terrains au Bénin.
            </p>
            <div style={{ display: 'flex', gap: 28 }}>
              {[{ value: '1 200+', label: 'Investisseurs' }, { value: '48', label: 'Terrains actifs' }, { value: '14%', label: 'Rendement moy.' }].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#D4AD3A', margin: '0 0 2px' }}>{value}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.5)', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 16, padding: '20px 22px', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.7s ease 0.3s' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {[1,2,3,4,5].map(s => (<svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#D4AD3A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.8)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14 }}>
              "En moins de 10 minutes, j'ai acheté mes premiers m² depuis Paris. L'attestation m'a été envoyée instantanément."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2D5241', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#F5F0E8', border: '2px solid rgba(245,240,232,0.15)' }}>AK</div>
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F5F0E8', margin: 0 }}>Adeola Kossou</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.45)', margin: 0 }}>Investisseur · Paris, France</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Formulaire ── */}
      <div style={{
        background: '#F5F0E8',
        display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '28px 20px 40px' : '48px 32px',
        position: 'relative', overflow: 'hidden',
        minHeight: isMobile ? 'auto' : '100vh',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,151,42,0.06), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,47,0.05), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          width: '100%', maxWidth: isMobile ? '100%' : 440,
          position: 'relative', zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          {/* En-tête — masqué sur mobile (déjà dans le bandeau) */}
          {!isMobile && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                Bon retour 
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#6B6459', margin: 0 }}>
                Pas encore de compte ?{' '}
                <Link to="/inscription" style={{ color: '#1E3A2F', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(30,58,47,0.3)', paddingBottom: 1 }}>
                  Créer un compte →
                </Link>
              </p>
            </div>
          )}

          {isMobile && (
            <p style={{ fontSize: '0.88rem', color: '#6B6459', margin: '0 0 24px' }}>
              Pas encore de compte ?{' '}
              <Link to="/inscription" style={{ color: '#1E3A2F', fontWeight: 600, textDecoration: 'none' }}>
                Créer un compte →
              </Link>
            </p>
          )}

          {/* Erreur API */}
          {apiError && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <p style={{ fontSize: '0.82rem', color: '#C0392B', margin: 0 }}>{apiError}</p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            />

            <InputField
              label="Mot de passe"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
              rightElement={
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#8C8278', display: 'flex' }}>
                  <EyeIcon open={showPwd} />
                </button>
              }
            />

            {/* Se souvenir + Mot de passe oublié */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: -6, flexWrap: 'wrap', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: '#6B6459' }}>
                <div onClick={() => setRemember(!remember)} style={{
                  width: 18, height: 18, borderRadius: 5,
                  border: `1.5px solid ${remember ? '#1E3A2F' : 'rgba(30,58,47,0.25)'}`,
                  background: remember ? '#1E3A2F' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0,
                }}>
                  {remember && <CheckIcon />}
                </div>
                Se souvenir de moi
              </label>
              <Link to="/reset-password" style={{ fontSize: '0.82rem', color: '#1E3A2F', textDecoration: 'none', fontWeight: 500 }}>
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: isMobile ? '15px' : '14px',
              borderRadius: 12, border: 'none',
              background: loading ? 'rgba(30,58,47,0.5)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8',
              fontSize: isMobile ? '1rem' : '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(30,58,47,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: "'DM Sans', sans-serif",
              minHeight: 50,
            }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />
                  Connexion en cours...
                </>
              ) : 'Se connecter →'}
            </button>
          </form>

          {/* Footer légal */}
          <p style={{ fontSize: '0.72rem', color: '#8C8278', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
            En vous connectant, vous acceptez nos{' '}
            <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 500 }}>CGU</a>{' '}
            et notre{' '}
            <a href="#" style={{ color: '#1E3A2F', textDecoration: 'none', fontWeight: 500 }}>Politique de confidentialité</a>.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.7); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}