// ═══════════════════════════════════════════════════════════════════
// Register.jsx — ✅ Responsive Mobile
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

// ─── Force mot de passe ────────────────────────────────────────────
function PasswordStrength({ password }) {
  const getStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8)           score++
    if (/[A-Z]/.test(pwd))         score++
    if (/[0-9]/.test(pwd))         score++
    if (/[^A-Za-z0-9]/.test(pwd))  score++
    return score
  }
  const strength = getStrength(password)
  const labels   = ['', 'Faible', 'Moyen', 'Fort', 'Très fort']
  const colors   = ['', '#C0392B', '#E07B00', '#B8972A', '#1E3A2F']
  if (!password) return null
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(level => (
          <div key={level} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: strength >= level ? colors[strength] : 'rgba(30,58,47,0.12)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <p style={{ fontSize: '0.7rem', margin: 0, color: colors[strength], fontWeight: 500 }}>
        {strength > 0 && `Mot de passe ${labels[strength]}`}
      </p>
    </div>
  )
}

// ─── Champ input ───────────────────────────────────────────────────
function InputField({ label, type='text', placeholder, value, onChange,
                      icon, rightElement, error, children }) {
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
      {error && <p style={{ fontSize: '0.7rem', color: '#C0392B', margin: '4px 0 0' }}>⚠ {error}</p>}
      {children}
    </div>
  )
}

// ─── Stepper ───────────────────────────────────────────────────────
function Stepper({ current, steps, isMobile }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: isMobile ? 24 : 32 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: isMobile ? 28 : 32, height: isMobile ? 28 : 32,
              borderRadius: '50%',
              background: i <= current ? '#1E3A2F' : 'transparent',
              border: `2px solid ${i <= current ? '#1E3A2F' : 'rgba(30,58,47,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s', color: i <= current ? '#F5F0E8' : '#8C8278',
              fontSize: '0.7rem', fontWeight: 700,
            }}>
              {i < current ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span style={{
              fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 500,
              whiteSpace: 'nowrap', color: i <= current ? '#1E3A2F' : '#8C8278',
            }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 1.5, margin: '0 6px', marginBottom: 18,
              background: i < current ? '#1E3A2F' : 'rgba(30,58,47,0.15)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Composant principal ───────────────────────────────────────────
export default function Register() {
  const [step,        setStep]       = useState(0)
  const [mounted,     setMounted]    = useState(false)
  const [showPwd,     setShowPwd]    = useState(false)
  const [showConfirm, setShowConfirm]= useState(false)
  const [loading,     setLoading]    = useState(false)
  const [errors,      setErrors]     = useState({})
  const [apiError,    setApiError]   = useState('')

  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    country: 'France', password: '', confirmPwd: '', cgu: false,
  })

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
    setTimeout(() => setMounted(true), 50)
  }, [])

  const validateStep = () => {
    const errs = {}
    if (step === 0) {
      if (!form.firstName.trim())               errs.firstName = 'Prénom requis'
      if (!form.lastName.trim())                errs.lastName  = 'Nom requis'
      if (!form.email)                          errs.email     = 'Email requis'
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email   = 'Email invalide'
    }
    if (step === 1) {
      if (!form.phone.trim()) errs.phone   = 'Téléphone requis'
      if (!form.country)      errs.country = 'Pays requis'
    }
    if (step === 2) {
      if (!form.password)                errs.password    = 'Mot de passe requis'
      else if (form.password.length < 8)  errs.password   = 'Minimum 8 caractères'
      if (form.password !== form.confirmPwd) errs.confirmPwd = 'Les mots de passe ne correspondent pas'
      if (!form.cgu) errs.cgu = 'Vous devez accepter les CGU'
    }
    return errs
  }

  const handleNext = () => {
    const errs = validateStep()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/register', {
        first_name:            form.firstName,
        last_name:             form.lastName,
        email:                 form.email,
        phone:                 form.phone,
        country:               form.country,
        password:              form.password,
        password_confirmation: form.confirmPwd,
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/dashboard')
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response
        if (status === 422) {
          const e = data.errors || {}
          const mapped = {}
          if (e.first_name) mapped.firstName  = e.first_name[0]
          if (e.last_name)  mapped.lastName   = e.last_name[0]
          if (e.email)      mapped.email      = e.email[0]
          if (e.phone)      mapped.phone      = e.phone[0]
          if (e.password)   mapped.password   = e.password[0]
          if (mapped.firstName || mapped.lastName || mapped.email) setStep(0)
          else if (mapped.phone) setStep(1)
          else if (mapped.password) setStep(2)
          setErrors(mapped)
        } else {
          setApiError(data.message || 'Une erreur est survenue. Réessayez.')
        }
      } else {
        setApiError('Impossible de contacter le serveur.')
      }
    } finally {
      setLoading(false)
    }
  }

  const countries = [
    'France', 'Belgique', 'Canada', 'Suisse', 'Allemagne',
    'Italie', 'Espagne', 'États-Unis', 'Bénin', "Côte d'Ivoire", 'Sénégal', 'Autre',
  ]
  const steps = ['Compte', 'Identité', 'Sécurité']

  const IconEmail = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  const IconUser  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  const IconPhone = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
  const IconLock  = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#8C8278', display: 'flex' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {show
          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        }
      </svg>
    </button>
  )

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
        // MOBILE — Bandeau compact
        <div style={{
          background: 'linear-gradient(160deg, #0D2318 0%, #1E3A2F 60%, #2D5241 100%)',
          padding: '28px 24px 24px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(184,151,42,0.15) 0%, transparent 60%)' }} />
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 2, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(245,240,232,0.12)', borderRadius: 8, border: '1px solid rgba(245,240,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 13, height: 13, background: '#B8972A', clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: '#F5F0E8' }}>
              Land<span style={{ color: '#D4AD3A' }}>Share</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 6px', position: 'relative', zIndex: 2 }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.6)', margin: 0, position: 'relative', zIndex: 2 }}>
            Rejoignez 1 200+ investisseurs · Inscription gratuite
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, position: 'relative', zIndex: 2 }}>
            {['✓ Gratuit', '✓ Mobile Money', '✓ Attestation PDF'].map(item => (
              <span key={item} style={{
                background: 'rgba(184,151,42,0.15)', border: '1px solid rgba(184,151,42,0.25)',
                borderRadius: 20, padding: '3px 10px',
                fontSize: '0.62rem', fontWeight: 600, color: '#D4AD3A',
              }}>
                {item}
              </span>
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
          padding: '48px 52px', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 80% 60% at 20% 80%, rgba(184,151,42,0.18) 0%, transparent 60%)` }} />
          <div style={{ position: 'absolute', bottom: -80, right: -80, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(184,151,42,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(184,151,42,0.18)', pointerEvents: 'none' }} />

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 2, opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
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
              Inscription gratuite · 2 minutes
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 3.2vw, 3.6rem)', fontWeight: 700, color: '#F5F0E8', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Votre premier m²<br />
              <span style={{ color: '#D4AD3A' }}>commence ici</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(245,240,232,0.65)', lineHeight: 1.7, maxWidth: 380, marginBottom: 36, fontWeight: 300 }}>
              Rejoignez plus de 1 200 investisseurs qui font grandir leur patrimoine foncier au Bénin depuis le monde entier.
            </p>
            {['Inscription 100% gratuite', 'Paiement Mobile Money accepté', 'Attestation numérique immédiate', 'Terrain vérifié par notaire'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: '0.85rem', color: 'rgba(245,240,232,0.75)' }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(184,151,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#D4AD3A', flexShrink: 0 }}>✓</div>
                {item}
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 12, opacity: mounted ? 1 : 0, transition: 'opacity 0.7s ease 0.35s' }}>
            {[{ icon: '🔒', label: 'SSL Sécurisé' }, { icon: '🏅', label: 'Certifié OHADA' }, { icon: '📄', label: 'Titre foncier' }].map(({ icon, label }) => (
              <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', margin: '0 0 4px' }}>{icon}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.6)', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Formulaire ── */}
      <div style={{
        background: '#F5F0E8',
        display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '28px 20px 48px' : '48px 32px',
        position: 'relative', overflow: 'hidden',
        minHeight: isMobile ? 'auto' : '100vh',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,151,42,0.06), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          width: '100%', maxWidth: isMobile ? '100%' : 460,
          position: 'relative', zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(30px)',
          transition: 'all 0.7s ease 0.2s',
        }}>

          {/* En-tête */}
          <div style={{ marginBottom: isMobile ? 20 : 28 }}>
            {!isMobile && (
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
                Créer un compte
              </h2>
            )}
            <p style={{ fontSize: '0.88rem', color: '#6B6459', margin: 0 }}>
              Déjà inscrit ?{' '}
              <Link to="/connexion" style={{ color: '#1E3A2F', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(30,58,47,0.3)' }}>
                Se connecter →
              </Link>
            </p>
          </div>

          {/* Erreur API */}
          {apiError && (
            <div style={{ background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span>
              <p style={{ fontSize: '0.82rem', color: '#C0392B', margin: 0 }}>{apiError}</p>
            </div>
          )}

          {/* Stepper */}
          <Stepper current={step} steps={steps} isMobile={isMobile} />

          {/* Formulaire */}
          <form onSubmit={step < 2 ? (e) => { e.preventDefault(); handleNext() } : handleSubmit} noValidate>

            {/* Étape 0 — Compte */}
            {step === 0 && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 12,
                }}>
                  <InputField label="Prénom *" placeholder="Kouamé"
                    value={form.firstName} onChange={update('firstName')}
                    error={errors.firstName} icon={IconUser} />
                  <InputField label="Nom *" placeholder="Ligali"
                    value={form.lastName} onChange={update('lastName')}
                    error={errors.lastName} icon={IconUser} />
                </div>
                <InputField label="Adresse email *" type="email" placeholder="vous@exemple.com"
                  value={form.email} onChange={update('email')}
                  error={errors.email} icon={IconEmail} />
              </div>
            )}

            {/* Étape 1 — Identité */}
            {step === 1 && (
              <div>
                <InputField label="Numéro de téléphone *" placeholder="+33 6 12 34 56 78"
                  value={form.phone} onChange={update('phone')}
                  error={errors.phone} icon={IconPhone} />
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4A3F35', marginBottom: 6 }}>
                    Pays de résidence *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8C8278' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                      </svg>
                    </div>
                    <select value={form.country} onChange={update('country')}
                            style={{ width: '100%', padding: '13px 14px 13px 44px', borderRadius: 10, border: '1.5px solid rgba(30,58,47,0.15)', background: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', color: '#1A1A1A', outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", appearance: 'none', boxSizing: 'border-box' }}>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8C8278' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                </div>
                <div style={{ background: 'rgba(30,58,47,0.05)', border: '1px solid rgba(30,58,47,0.12)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
                  <p style={{ fontSize: '0.75rem', color: '#4A3F35', margin: 0, lineHeight: 1.6 }}>
                    Vous devrez fournir une pièce d'identité (KYC) après l'inscription pour accéder aux investissements.
                  </p>
                </div>
              </div>
            )}

            {/* Étape 2 — Sécurité */}
            {step === 2 && (
              <div>
                <InputField label="Mot de passe *" type={showPwd ? 'text' : 'password'}
                  placeholder="Minimum 8 caractères"
                  value={form.password} onChange={update('password')}
                  error={errors.password} icon={IconLock}
                  rightElement={<EyeBtn show={showPwd} toggle={() => setShowPwd(!showPwd)} />}>
                  <PasswordStrength password={form.password} />
                </InputField>

                <InputField label="Confirmer le mot de passe *"
                  type={showConfirm ? 'text' : 'password'} placeholder="Répétez votre mot de passe"
                  value={form.confirmPwd} onChange={update('confirmPwd')}
                  error={errors.confirmPwd} icon={IconLock}
                  rightElement={<EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />} />

                {/* CGU */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 8 }}>
                  <div onClick={() => setForm(f => ({ ...f, cgu: !f.cgu }))}
                       style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 2, border: `1.5px solid ${form.cgu ? '#1E3A2F' : 'rgba(30,58,47,0.25)'}`, background: form.cgu ? '#1E3A2F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
                    {form.cgu && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6B6459', lineHeight: 1.5 }}>
                    J'accepte les{' '}
                    <a href="#" style={{ color: '#1E3A2F', fontWeight: 600, textDecoration: 'none' }}>Conditions d'utilisation</a>{' '}
                    et la{' '}
                    <a href="#" style={{ color: '#1E3A2F', fontWeight: 600, textDecoration: 'none' }}>Politique de confidentialité</a>
                  </span>
                </label>
                {errors.cgu && <p style={{ fontSize: '0.7rem', color: '#C0392B', margin: '0 0 12px' }}>⚠ {errors.cgu}</p>}
              </div>
            )}

            {/* Boutons navigation */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                        style={{ padding: '13px 18px', borderRadius: 10, border: '1.5px solid rgba(30,58,47,0.2)', background: 'transparent', color: '#1E3A2F', fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', minHeight: 50 }}>
                  ← Retour
                </button>
              )}
              <button type="submit" disabled={loading}
                      style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: loading ? 'rgba(30,58,47,0.5)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)', color: '#F5F0E8', fontSize: isMobile ? '1rem' : '0.92rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(30,58,47,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif", minHeight: 50 }}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />
                    Création du compte...
                  </>
                ) : step < 2
                  ? `Continuer → (${step + 1}/${steps.length})`
                  : 'Créer mon compte →'
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}