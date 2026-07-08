// ═══════════════════════════════════════════════════════════════════
// Dashboard.jsx — Interface professionnelle avec icônes SVG
// ═══════════════════════════════════════════════════════════════════
import TerrainsSection      from './TerrainsSection'
import NotificationsSection from './NotificationsSection'
import DocumentsSection     from './DocumentsSection'
import HistoriqueSection    from './HistoriqueSection'
import PortefeuilleSection  from './PortefeuilleSection'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../api/axios'

// ─── Hooks ────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])
}

function useCountUp(target, duration = 1800, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger || !target) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, trigger])
  return val
}

function useInView(threshold = 0.1) {
  const ref  = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Skeleton({ w = '100%', h = 16, radius = 6, mb = 0 }) {
  return <div style={{ width: w, height: h, borderRadius: radius, background: 'rgba(30,58,47,0.07)', marginBottom: mb, animation: 'pulse 1.4s ease infinite' }} />
}

// ─── Icônes SVG ───────────────────────────────────────────────────
function IconGrid({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}
function IconMap({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}
function IconWallet({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4a2 2 0 01-2-2V6a2 2 0 012-2h16v4" />
      <path d="M20 12a2 2 0 000 4h4v-4z" />
    </svg>
  )
}
function IconClock({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconFile({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
function IconBell({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}
function IconUser({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function IconLogout({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
function IconTrendingUp({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
function IconDollar({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  )
}
function IconLayers({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
function IconHome({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
function IconMapPin({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function IconCheckCircle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function IconAlertTriangle({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
function IconShield({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconDownload({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
function IconSearch({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
function IconKey({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  )
}
function IconMenu({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
function IconX({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconLink({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  )
}
function IconSave({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}
function IconUpload({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PROFIL SECTION
// ═══════════════════════════════════════════════════════════════════
function ProfilSection({ user, setUser, isMobile }) {
  const [tab, setTab]             = useState('infos')
  const [form, setForm]           = useState({ first_name: user?.first_name||'', last_name: user?.last_name||'', phone: user?.phone||'', country: user?.country||'' })
  const [savingInfo, setSavingInfo]   = useState(false)
  const [successInfo, setSuccessInfo] = useState(false)
  const [errorInfo, setErrorInfo]     = useState(null)
  const [pwd, setPwd]             = useState({ current:'', newPwd:'', confirm:'' })
  const [showPwd, setShowPwd]     = useState({ current:false, newPwd:false, confirm:false })
  const [savingPwd, setSavingPwd]     = useState(false)
  const [successPwd, setSuccessPwd]   = useState(false)
  const [errorPwd, setErrorPwd]       = useState(null)
  const countries = ['France','Belgique','Canada','Suisse','Allemagne','Italie','Espagne','États-Unis','Bénin',"Côte d'Ivoire",'Sénégal','Togo','Cameroun','Autre']

  const handleSaveInfo = async () => {
    setSavingInfo(true); setErrorInfo(null); setSuccessInfo(false)
    try {
      const { data } = await api.put('/profile', form)
      const updated = data.user || { ...user, ...form }
      setUser(updated); localStorage.setItem('user', JSON.stringify(updated))
      setSuccessInfo(true); setTimeout(() => setSuccessInfo(false), 3000)
    } catch (err) { setErrorInfo(err.response?.data?.message || 'Erreur.') }
    finally { setSavingInfo(false) }
  }

  const handleChangePwd = async () => {
    if (!pwd.current)              { setErrorPwd('Mot de passe actuel requis.'); return }
    if (pwd.newPwd.length < 8)     { setErrorPwd('Minimum 8 caractères.'); return }
    if (pwd.newPwd !== pwd.confirm) { setErrorPwd('Les mots de passe ne correspondent pas.'); return }
    setSavingPwd(true); setErrorPwd(null); setSuccessPwd(false)
    try {
      await api.put('/auth/change-password', { current_password: pwd.current, password: pwd.newPwd, password_confirmation: pwd.confirm })
      setSuccessPwd(true); setPwd({ current:'', newPwd:'', confirm:'' })
      setTimeout(() => setSuccessPwd(false), 3000)
    } catch (err) { setErrorPwd(err.response?.data?.message || 'Mot de passe actuel incorrect.') }
    finally { setSavingPwd(false) }
  }

  const card  = { background:'#FFFFFF', borderRadius:14, boxShadow:'0 2px 12px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', padding:isMobile?'16px':'22px 24px', marginBottom:16 }
  const lbl   = { display:'block', fontSize:'0.72rem', fontWeight:600, color:'#4A3F35', marginBottom:5 }
  const input = { width:'100%', padding:'11px 12px', borderRadius:9, fontSize:'0.85rem', color:'#1A1A1A', outline:'none', fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s', boxSizing:'border-box', border:'1.5px solid rgba(30,58,47,0.15)', background:'#FAFAF7' }

  const kyc = user?.kyc_status || 'none'
  const kycBadge = {
    none:      { bg:'rgba(184,151,42,0.08)', border:'rgba(184,151,42,0.2)',  color:'#8B6E1A', label:'Non soumis' },
    pending:   { bg:'rgba(99,91,255,0.08)',  border:'rgba(99,91,255,0.2)',   color:'#635BFF', label:'En attente' },
    validated: { bg:'rgba(30,58,47,0.06)',   border:'rgba(30,58,47,0.15)',   color:'#1E3A2F', label:'Validé' },
    rejected:  { bg:'rgba(192,57,43,0.06)',  border:'rgba(192,57,43,0.2)',   color:'#C0392B', label:'Rejeté' },
  }[kyc]

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>
      <div style={{ ...card, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#1E3A2F,#B8972A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:700, color:'#F5F0E8' }}>
          {user?.first_name?.[0]?.toUpperCase()||'?'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
          <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 3px' }}>{user?.first_name} {user?.last_name}</h2>
          <p style={{ fontSize:'0.75rem', color:'#8C8278', margin:'0 0 8px' }}>{user?.email}</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:kycBadge.bg, border:`1px solid ${kycBadge.border}`, color:kycBadge.color }}>
              <IconShield size={11} color={kycBadge.color}/> KYC {kycBadge.label}
            </span>
            {user?.country && (
              <span style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:'rgba(184,151,42,0.06)', border:'1px solid rgba(184,151,42,0.15)', color:'#8B6E1A' }}>
                <IconMapPin size={10} color="#8B6E1A"/> {user.country}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', background:'#FFFFFF', borderRadius:10, padding:4, gap:3, marginBottom:16, width:'fit-content', border:'1px solid rgba(30,58,47,0.08)' }}>
        {[{id:'infos',label:'Informations',icon:<IconUser size={13}/>},{id:'securite',label:'Sécurité',icon:<IconKey size={13}/>}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', borderRadius:8, border:'none', cursor:'pointer', background:tab===t.id?'#1E3A2F':'transparent', color:tab===t.id?'#F5F0E8':'#8C8278', fontSize:'0.78rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'infos' && (
        <div style={card}>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
          <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 18px' }}>Informations personnelles</h3>
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:'0 16px' }}>
            {[['Prénom *','first_name','Kouamé'],['Nom *','last_name','Ligali']].map(([l,k,p]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={lbl}>{l}</label>
                <input value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} placeholder={p} style={input}/>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Email <span style={{ color:'#8C8278', fontWeight:400, fontSize:'0.63rem' }}>(non modifiable)</span></label>
            <div style={{ padding:'11px 12px', borderRadius:9, border:'1.5px solid rgba(30,58,47,0.1)', background:'rgba(30,58,47,0.03)', fontSize:'0.85rem', color:'#8C8278' }}>{user?.email||'—'}</div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Téléphone</label>
            <input value={form.phone} onChange={e => setForm(f => ({...f,phone:e.target.value}))} placeholder="+229 XX XX XX XX" style={input}/>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>Pays</label>
            <select value={form.country} onChange={e => setForm(f => ({...f,country:e.target.value}))} style={{ ...input, cursor:'pointer' }}>
              <option value="">— Sélectionner —</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {errorInfo && (
            <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:9, padding:'10px 13px', marginBottom:12 }}>
              <IconAlertTriangle size={14} color="#C0392B"/>
              <p style={{ fontSize:'0.75rem', color:'#C0392B', margin:0 }}>{errorInfo}</p>
            </div>
          )}
          {successInfo && (
            <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(30,58,47,0.07)', border:'1px solid rgba(30,58,47,0.15)', borderRadius:9, padding:'10px 13px', marginBottom:12 }}>
              <IconCheckCircle size={14} color="#1E3A2F"/>
              <p style={{ fontSize:'0.75rem', color:'#1E3A2F', fontWeight:600, margin:0 }}>Profil mis à jour avec succès.</p>
            </div>
          )}
          <button onClick={handleSaveInfo} disabled={savingInfo} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:savingInfo?'rgba(30,58,47,0.4)':'linear-gradient(135deg,#1E3A2F,#2D5241)', color:'#F5F0E8', fontSize:'0.88rem', fontWeight:700, cursor:savingInfo?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8, minHeight:48 }}>
            {savingInfo
              ? <><div style={{ width:15,height:15,borderRadius:'50%',border:'2px solid rgba(245,240,232,0.3)',borderTopColor:'#F5F0E8',animation:'spin 0.7s linear infinite' }}/>Sauvegarde...</>
              : <><IconSave size={16} color="#F5F0E8"/> Sauvegarder</>
            }
          </button>
        </div>
      )}

      {tab === 'securite' && (
        <>
          <div style={card}>
            {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 18px' }}>Changer le mot de passe</h3>
            {[['current','Actuel *'],['newPwd','Nouveau *'],['confirm','Confirmer *']].map(([k,l]) => (
              <div key={k} style={{ marginBottom:14 }}>
                <label style={lbl}>{l}</label>
                <div style={{ position:'relative' }}>
                  <input type={showPwd[k]?'text':'password'} value={pwd[k]} onChange={e => setPwd(p => ({...p,[k]:e.target.value}))} style={{ ...input, paddingRight:56 }}/>
                  <button type="button" onClick={() => setShowPwd(s => ({...s,[k]:!s[k]}))} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8C8278', fontSize:'0.68rem', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
                    {showPwd[k] ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
              </div>
            ))}
            {errorPwd && (
              <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:9, padding:'10px 13px', marginBottom:12 }}>
                <IconAlertTriangle size={14} color="#C0392B"/>
                <p style={{ fontSize:'0.75rem', color:'#C0392B', margin:0 }}>{errorPwd}</p>
              </div>
            )}
            {successPwd && (
              <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(30,58,47,0.07)', border:'1px solid rgba(30,58,47,0.15)', borderRadius:9, padding:'10px 13px', marginBottom:12 }}>
                <IconCheckCircle size={14} color="#1E3A2F"/>
                <p style={{ fontSize:'0.75rem', color:'#1E3A2F', fontWeight:600, margin:0 }}>Mot de passe modifié avec succès.</p>
              </div>
            )}
            <button onClick={handleChangePwd} disabled={savingPwd} style={{ width:'100%', padding:'13px', borderRadius:11, border:'none', background:savingPwd?'rgba(30,58,47,0.4)':'linear-gradient(135deg,#1E3A2F,#2D5241)', color:'#F5F0E8', fontSize:'0.88rem', fontWeight:700, cursor:savingPwd?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8, minHeight:48 }}>
              {savingPwd
                ? <><div style={{ width:15,height:15,borderRadius:'50%',border:'2px solid rgba(245,240,232,0.3)',borderTopColor:'#F5F0E8',animation:'spin 0.7s linear infinite' }}/>Modification...</>
                : <><IconKey size={16} color="#F5F0E8"/> Modifier le mot de passe</>
              }
            </button>
          </div>
          <div style={{ ...card, border:'1px solid rgba(192,57,43,0.15)', background:'rgba(192,57,43,0.02)' }}>
            {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:'#C0392B', margin:'0 0 10px' }}>Zone de danger</h3>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/connexion' }} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px', borderRadius:11, border:'1.5px solid rgba(192,57,43,0.3)', background:'rgba(192,57,43,0.06)', color:'#C0392B', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", minHeight:46 }}>
              <IconLogout size={16} color="#C0392B"/> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════
function Sidebar({ active, setActive, collapsed, setCollapsed, user, unreadCount }) {
  const nav = [
    { id:'dashboard',    label:'Tableau de bord', Icon: IconGrid },
    { id:'terrains',     label:'Terrains',         Icon: IconMap },
    { id:'portefeuille', label:'Portefeuille',      Icon: IconWallet },
    { id:'historique',   label:'Historique',        Icon: IconClock },
    { id:'documents',    label:'Documents',         Icon: IconFile },
    { id:'notifications',label:'Notifications',    Icon: IconBell },
    { id:'profil',       label:'Mon profil',        Icon: IconUser },
  ]
  const kyc = user?.kyc_status || 'none'
  const kycCfg = {
    none:      { bg:'rgba(184,151,42,0.15)', border:'rgba(184,151,42,0.3)', title:'KYC requis',          sub:'Vérifiez votre identité.',       btn:'Soumettre mon KYC', color:'#D4AD3A' },
    pending:   { bg:'rgba(99,91,255,0.12)',  border:'rgba(99,91,255,0.25)', title:'KYC en vérification', sub:'Validation sous 24-48h.',        btn:null,                color:'#8B87F5' },
    rejected:  { bg:'rgba(192,57,43,0.12)', border:'rgba(192,57,43,0.25)', title:'KYC rejeté',           sub:'Soumettez un nouveau document.', btn:'Resoumettre',       color:'#E74C3C' },
    validated: { bg:'rgba(30,58,47,0.25)',  border:'rgba(184,151,42,0.2)', title:'KYC Vérifié',          sub:'Vous pouvez investir librement.',btn:null,                color:'#D4AD3A' },
  }[kyc] || {}

  return (
    <aside style={{ width:collapsed?64:240, background:'#111810', display:'flex', flexDirection:'column', transition:'width 0.3s cubic-bezier(.4,0,.2,1)', flexShrink:0, overflow:'hidden' }}>
      <div style={{ padding:collapsed?'20px 0':'24px 20px', borderBottom:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', gap:10 }}>
        {!collapsed && (
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
            <div style={{ width:32, height:32, background:'#1E3A2F', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:13, height:13, background:'#B8972A', clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }}/>
            </div>
            {/* ✅ MODIFIÉ : Playfair Display → DM Sans (logo sidebar) */}
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.05rem', fontWeight:700, color:'#F5F0E8' }}>Land<span style={{ color:'#B8972A' }}>Share</span></span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:'rgba(245,240,232,0.06)', border:'1px solid rgba(245,240,232,0.1)', borderRadius:8, width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(245,240,232,0.5)', flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {collapsed
              ? <><polyline points="9 18 15 12 9 6"/></>
              : <><polyline points="15 18 9 12 15 6"/></>
            }
          </svg>
        </button>
      </div>

      <nav style={{ flex:1, padding:'12px 8px', overflow:'hidden' }}>
        {nav.map(({ id, label, Icon }) => {
          const a = active === id
          return (
            <button key={id} onClick={() => setActive(id)} title={collapsed ? label : ''} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'11px 0':'10px 12px', justifyContent:collapsed?'center':'flex-start', borderRadius:10, border:'none', cursor:'pointer', background:a?'rgba(184,151,42,0.12)':'transparent', borderLeft:`2px solid ${a?'#B8972A':'transparent'}`, color:a?'#D4AD3A':'rgba(245,240,232,0.5)', transition:'all 0.2s', marginBottom:2, fontFamily:"'DM Sans',sans-serif" }}>
              <Icon size={18} color="currentColor"/>
              {!collapsed && <span style={{ fontSize:'0.875rem', fontWeight:a?600:400, whiteSpace:'nowrap' }}>{label}</span>}
              {id==='notifications' && !collapsed && unreadCount>0 && (
                <span style={{ marginLeft:'auto', background:'#B8972A', color:'#111810', fontSize:'0.6rem', fontWeight:700, borderRadius:20, padding:'1px 7px' }}>{unreadCount}</span>
              )}
            </button>
          )
        })}
      </nav>

      {!collapsed && (
        <div style={{ margin:'0 8px 12px', background:kycCfg.bg, borderRadius:12, padding:'12px 14px', border:`1px solid ${kycCfg.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <IconShield size={12} color={kycCfg.color}/>
            <p style={{ fontSize:'0.7rem', color:kycCfg.color, fontWeight:700, margin:0, textTransform:'uppercase', letterSpacing:'0.05em' }}>{kycCfg.title}</p>
          </div>
          <p style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.6)', margin:kycCfg.btn?'0 0 10px':0, lineHeight:1.4 }}>{kycCfg.sub}</p>
          {kycCfg.btn && (
            <button onClick={() => setActive('kyc')} style={{ width:'100%', padding:'7px', borderRadius:8, border:'none', background:kycCfg.color, color:'#111810', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              {kycCfg.btn}
            </button>
          )}
        </div>
      )}

      <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', gap:10, justifyContent:collapsed?'center':'flex-start' }}>
        <div onClick={() => setActive('profil')} style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A2F,#B8972A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#F5F0E8', flexShrink:0, cursor:'pointer' }}>
          {user?.first_name?.[0]?.toUpperCase()||'?'}
        </div>
        {!collapsed && (
          <>
            <div style={{ flex:1, overflow:'hidden', cursor:'pointer' }} onClick={() => setActive('profil')}>
              <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#F5F0E8', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user?.first_name ? `${user.first_name} ${user.last_name||''}`.trim() : 'Investisseur'}
              </p>
              <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.4)', margin:0 }}>{user?.country||''}</p>
            </div>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/connexion' }} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,240,232,0.4)', padding:4 }}>
              <IconLogout size={16} color="currentColor"/>
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MOBILE DRAWER
// ═══════════════════════════════════════════════════════════════════
function MobileDrawer({ open, onClose, active, setActive, user, unreadCount }) {
  const nav = [
    { id:'dashboard',    label:'Tableau de bord', Icon: IconGrid },
    { id:'terrains',     label:'Terrains',         Icon: IconMap },
    { id:'portefeuille', label:'Portefeuille',      Icon: IconWallet },
    { id:'historique',   label:'Historique',        Icon: IconClock },
    { id:'documents',    label:'Documents',         Icon: IconFile },
    { id:'notifications',label:'Notifications',    Icon: IconBell },
    { id:'kyc',          label:'Mon KYC',           Icon: IconShield },
    { id:'profil',       label:'Mon profil',        Icon: IconUser },
  ]
  const kyc = user?.kyc_status || 'none'
  return (
    <>
      {open && <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:40, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)' }}/>}
      <div style={{ position:'fixed', top:0, left:0, bottom:0, width:280, zIndex:50, background:'#111810', transform:open?'translateX(0)':'translateX(-100%)', transition:'transform 0.3s cubic-bezier(.4,0,.2,1)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans (logo mobile drawer) */}
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:'#F5F0E8' }}>Land<span style={{ color:'#B8972A' }}>Share</span></span>
          <button onClick={onClose} style={{ background:'rgba(245,240,232,0.08)', border:'none', borderRadius:8, width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(245,240,232,0.7)' }}>
            <IconX size={16} color="currentColor"/>
          </button>
        </div>
        <div onClick={() => { setActive('profil'); onClose() }} style={{ padding:'14px 16px', borderBottom:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A2F,#B8972A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:700, color:'#F5F0E8', flexShrink:0 }}>
            {user?.first_name?.[0]?.toUpperCase()||'?'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:'0.88rem', fontWeight:600, color:'#F5F0E8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {user?.first_name ? `${user.first_name} ${user.last_name||''}`.trim() : 'Investisseur'}
            </p>
            <span style={{ fontSize:'0.62rem', fontWeight:600, padding:'1px 7px', borderRadius:10, background:kyc==='validated'?'rgba(30,58,47,0.3)':kyc==='pending'?'rgba(99,91,255,0.2)':'rgba(184,151,42,0.2)', color:kyc==='validated'?'#7DCEA0':kyc==='pending'?'#8B87F5':'#D4AD3A' }}>
              {kyc==='validated' ? 'KYC validé' : kyc==='pending' ? 'KYC en attente' : 'KYC requis'}
            </span>
          </div>
        </div>
        <nav style={{ flex:1, padding:'10px', overflowY:'auto' }}>
          {nav.map(({ id, label, Icon }) => {
            const a = active === id
            return (
              <button key={id} onClick={() => { setActive(id); onClose() }} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:10, border:'none', cursor:'pointer', background:a?'rgba(184,151,42,0.12)':'transparent', borderLeft:`3px solid ${a?'#B8972A':'transparent'}`, color:a?'#D4AD3A':'rgba(245,240,232,0.6)', marginBottom:3, fontFamily:"'DM Sans',sans-serif", textAlign:'left', minHeight:46 }}>
                <Icon size={17} color="currentColor"/>
                <span style={{ fontSize:'0.9rem', fontWeight:a?600:400 }}>{label}</span>
                {id==='notifications' && unreadCount>0 && (
                  <span style={{ marginLeft:'auto', background:'#B8972A', color:'#111810', fontSize:'0.62rem', fontWeight:700, borderRadius:10, padding:'1px 7px' }}>{unreadCount}</span>
                )}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(245,240,232,0.06)' }}>
          <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/connexion' }} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:10, border:'none', cursor:'pointer', background:'rgba(192,57,43,0.08)', color:'#E74C3C', fontFamily:"'DM Sans',sans-serif", fontSize:'0.88rem', fontWeight:600, minHeight:46 }}>
            <IconLogout size={17} color="#E74C3C"/> Se déconnecter
          </button>
        </div>
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════
// BOTTOM NAV — Icônes SVG professionnelles
// ═══════════════════════════════════════════════════════════════════
function BottomNav({ active, setActive, unreadCount }) {
  const items = [
    { id:'dashboard',    label:'Accueil',      Icon: IconGrid },
    { id:'terrains',     label:'Terrains',     Icon: IconMap },
    { id:'portefeuille', label:'Portefeuille', Icon: IconWallet },
    { id:'historique',   label:'Historique',  Icon: IconClock },
    { id:'profil',       label:'Profil',       Icon: IconUser },
  ]
  return (
    <nav style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:30, background:'#111810', borderTop:'1px solid rgba(245,240,232,0.08)', display:'flex', alignItems:'center', paddingBottom:'env(safe-area-inset-bottom)' }}>
      {items.map(({ id, label, Icon }) => {
        const a = active === id
        return (
          <button key={id} onClick={() => setActive(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'10px 4px', border:'none', cursor:'pointer', background:'transparent', color:a?'#D4AD3A':'rgba(245,240,232,0.4)', position:'relative', minHeight:56 }}>
            <Icon size={19} color="currentColor"/>
            <span style={{ fontSize:'0.58rem', fontWeight:a?700:400, whiteSpace:'nowrap' }}>{label}</span>
            {a && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:2, borderRadius:1, background:'#B8972A' }}/>}
          </button>
        )
      })}
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════
function Topbar({ active, isMobile, onMenuOpen, user, setActive, unreadCount, recentNotifs, loadingNotifs }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t) }, [])
  const titles = { dashboard:'Tableau de bord', terrains:'Terrains disponibles', portefeuille:'Mon portefeuille', historique:'Historique', documents:'Mes documents', notifications:'Notifications', kyc:'Vérification KYC', profil:'Mon profil' }

  const notifTypeIcon = (type) => {
    if (type === 'investment') return <IconDollar size={14} color="#B8972A"/>
    if (type === 'payment')    return <IconCheckCircle size={14} color="#27AE60"/>
    if (type === 'kyc')        return <IconShield size={14} color="#635BFF"/>
    return <IconBell size={14} color="#8C8278"/>
  }

  return (
    <header style={{ height:isMobile?56:64, background:'#FAFAF7', borderBottom:'1px solid rgba(30,58,47,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:isMobile?'0 14px':'0 28px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {isMobile && (
          <button onClick={onMenuOpen} style={{ background:'none', border:'none', cursor:'pointer', color:'#1E3A2F', padding:4 }}>
            <IconMenu size={22} color="#1E3A2F"/>
          </button>
        )}
        <div>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
          <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:isMobile?'0.95rem':'1.2rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{titles[active]||'Dashboard'}</h1>
          {!isMobile && <p style={{ fontSize:'0.72rem', color:'#8C8278', margin:0 }}>{time.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:isMobile?6:10 }}>
        {!isMobile && (
          <Link to="/terrains" style={{ padding:'8px 18px', borderRadius:8, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontSize:'0.82rem', fontWeight:600 }}>
            + Investir
          </Link>
        )}
        <div style={{ position:'relative' }}>
          <button onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen) }} style={{ width:isMobile?34:38, height:isMobile?34:38, borderRadius:10, background:notifOpen?'rgba(30,58,47,0.08)':'transparent', border:'1.5px solid rgba(30,58,47,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#4A3F35' }}>
            <IconBell size={isMobile?16:18} color="currentColor"/>
          </button>
          {unreadCount > 0 && (
            <div style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:'50%', background:'#C0392B', border:'2px solid #FAFAF7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.58rem', fontWeight:700, color:'#fff' }}>
              {unreadCount>9?'9+':unreadCount}
            </div>
          )}
          {notifOpen && (
            <div style={{ position:'absolute', top:'100%', right:0, marginTop:8, width:isMobile?'calc(100vw - 28px)':320, maxWidth:340, background:'#fff', borderRadius:16, boxShadow:'0 16px 48px rgba(0,0,0,0.12)', border:'1px solid rgba(30,58,47,0.08)', zIndex:100, overflow:'hidden' }}>
              <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(30,58,47,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <p style={{ fontSize:'0.875rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Notifications</p>
                <span onClick={() => setActive('notifications')} style={{ fontSize:'0.72rem', color:'#B8972A', fontWeight:600, cursor:'pointer' }}>Voir tout</span>
              </div>
              {loadingNotifs
                ? <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:8 }}>{[1,2,3].map(i => <Skeleton key={i} h={40} radius={8}/>)}</div>
                : recentNotifs.length===0
                  ? <div style={{ padding:'24px', textAlign:'center' }}><p style={{ fontSize:'0.78rem', color:'#8C8278', margin:0 }}>Aucune notification</p></div>
                  : recentNotifs.slice(0,5).map(n => (
                    <div key={n.id} style={{ padding:'12px 16px', background:n.is_read?'transparent':'rgba(184,151,42,0.04)', borderBottom:'1px solid rgba(30,58,47,0.05)', display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ marginTop:2, flexShrink:0 }}>{notifTypeIcon(n.type)}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:'0.78rem', color:'#1A1A1A', margin:'0 0 2px', fontWeight:n.is_read?400:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title||n.message}</p>
                        <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{n.created_at?new Date(n.created_at).toLocaleDateString('fr-FR'):''}</p>
                      </div>
                      {!n.is_read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#B8972A', flexShrink:0, marginTop:4 }}/>}
                    </div>
                  ))
              }
            </div>
          )}
        </div>
        <div onClick={() => setActive('profil')} style={{ width:isMobile?34:38, height:isMobile?34:38, borderRadius:10, background:'linear-gradient(135deg,#1E3A2F,#B8972A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#F5F0E8', cursor:'pointer' }}>
          {user?.first_name?.[0]?.toUpperCase()||'?'}
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════
// KPI WIDGET
// ═══════════════════════════════════════════════════════════════════
function KpiWidget({ label, value, suffix, sub, IconComp, color, bg, index, loading, delta, deltaLabel }) {
  const [ref, inView] = useInView(0.2)
  const count = useCountUp(value||0, 1600+index*100, inView&&!loading)
  return (
    <div ref={ref} style={{ background:'#FFFFFF', borderRadius:16, padding:'16px 18px', boxShadow:'0 2px 12px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', borderTop:`3px solid ${color}`, opacity:inView?1:0, transform:inView?'translateY(0)':'translateY(16px)', transition:`all 0.4s ease ${index*0.08}s` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <p style={{ fontSize:'0.68rem', fontWeight:600, color:'#8C8278', textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>{label}</p>
        <div style={{ width:32, height:32, borderRadius:9, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {IconComp && <IconComp size={15} color={color}/>}
        </div>
      </div>
      {loading ? <Skeleton h={32} w="70%" radius={6} mb={8}/> : (
        /* ✅ MODIFIÉ : Playfair Display → DM Sans (valeurs KPI dashboard investisseur) */
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 4px', lineHeight:1 }}>
          {count.toLocaleString('fr-FR')}<span style={{ fontSize:'0.82rem', color:'#8C8278', marginLeft:4, fontFamily:"'DM Sans',sans-serif" }}>{suffix}</span>
        </p>
      )}
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        {delta !== null && delta !== undefined && !loading && (
          <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'2px 6px', borderRadius:20, background:delta>=0?'rgba(30,58,47,0.08)':'rgba(192,57,43,0.08)', color:delta>=0?'#1E3A2F':'#C0392B' }}>
            {delta>=0?'↑':'↓'} {Math.abs(delta)}%
          </span>
        )}
        <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{deltaLabel || sub}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO CHART
// ═══════════════════════════════════════════════════════════════════
function PortfolioChart({ isMobile, chartData, totalInvesti, currentValue, plusValuePct, loading }) {
  const [ref, inView] = useInView(0.1)
  const [period, setPeriod] = useState('12m')
  const hasPlusValue = plusValuePct !== null && plusValuePct !== undefined && plusValuePct !== 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active||!payload?.length) return null
    const point = payload[0].payload
    return (
      <div style={{ background:'#1E3A2F', borderRadius:10, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
        <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.6)', margin:'0 0 4px' }}>{label}</p>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans (tooltip du graphique) */}
        <p style={{ fontSize:'1rem', fontWeight:700, color:'#D4AD3A', margin:'0 0 2px', fontFamily:"'DM Sans',sans-serif" }}>{payload[0].value?.toLocaleString('fr-FR')} FCFA</p>
        {point.type === 'valuation' && (
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <IconTrendingUp size={11} color="rgba(184,151,42,0.9)"/>
            <p style={{ fontSize:'0.65rem', color:'rgba(184,151,42,0.9)', margin:0 }}>Réévaluation foncière</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} style={{ background:'#FFFFFF', borderRadius:16, padding:isMobile?'16px':'22px 24px', boxShadow:'0 2px 12px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', opacity:inView?1:0, transform:inView?'translateY(0)':'translateY(20px)', transition:'all 0.6s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>Évolution du portefeuille</p>
          {loading ? <Skeleton h={28} w={180} radius={6} mb={8}/> : (
            <div>
              {/* ✅ MODIFIÉ : Playfair Display → DM Sans (valeur principale du graphique) */}
              <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:isMobile?'1.3rem':'1.6rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 4px' }}>
                {(currentValue||totalInvesti||0).toLocaleString('fr-FR')} FCFA
              </h3>
              {hasPlusValue && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, padding:'3px 8px', borderRadius:20, background:plusValuePct>=0?'rgba(30,58,47,0.08)':'rgba(192,57,43,0.08)', color:plusValuePct>=0?'#1E3A2F':'#C0392B' }}>
                  <IconTrendingUp size={12} color="currentColor"/>
                  {plusValuePct>=0?'+':''}{Math.abs(plusValuePct)}% vs prix d'achat
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ display:'flex', background:'#F5F0E8', borderRadius:10, padding:3, gap:2 }}>
          {['3m','6m','12m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', background:period===p?'#1E3A2F':'transparent', color:period===p?'#F5F0E8':'#8C8278', fontSize:'0.75rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{p}</button>
          ))}
        </div>
      </div>

      {loading ? <Skeleton h={isMobile?160:200} radius={8}/> : chartData&&chartData.length>0 ? (
        <ResponsiveContainer width="100%" height={isMobile?160:200}>
          <AreaChart data={chartData} margin={{top:5,right:5,bottom:0,left:0}}>
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1E3A2F" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,47,0.06)" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:10,fill:'#8C8278'}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="value" stroke="#1E3A2F" strokeWidth={2.5} fill="url(#pg)" dot={false} activeDot={{ r:5, fill:'#1E3A2F', stroke:'#F5F0E8', strokeWidth:2 }}/>
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height:isMobile?160:200, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
          <IconTrendingUp size={36} color="rgba(30,58,47,0.15)"/>
          <p style={{ fontSize:'0.78rem', color:'#8C8278', margin:0 }}>Aucune donnée disponible</p>
          <p style={{ fontSize:'0.7rem', color:'#8C8278', margin:0 }}>Effectuez votre premier investissement</p>
        </div>
      )}

      {chartData && chartData.some(p => p.type === 'valuation') && (
        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#B8972A' }}/>
          <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:0 }}>Les pics correspondent à des réévaluations foncières</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// INVESTMENT CARDS
// ═══════════════════════════════════════════════════════════════════
function InvestmentCards({ investments, loading }) {
  const [ref, inView] = useInView(0.1)
  const gradients = ['linear-gradient(135deg,#1E3A2F,#2D5241)','linear-gradient(135deg,#2D5241,#B8972A)','linear-gradient(135deg,#3D6B53,#1E3A2F)']

  return (
    <div ref={ref}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Mes terrains</h2>
        <button style={{ padding:'5px 12px', borderRadius:8, border:'1.5px solid rgba(30,58,47,0.15)', background:'transparent', color:'#1E3A2F', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Voir tout →</button>
      </div>
      {loading
        ? <div style={{ display:'flex', flexDirection:'column', gap:10 }}>{[1,2,3].map(i => <Skeleton key={i} h={72} radius={14}/>)}</div>
        : investments.length===0
          ? (
            <div style={{ background:'#FFFFFF', borderRadius:14, padding:'32px 24px', textAlign:'center', border:'1px solid rgba(30,58,47,0.06)' }}>
              <IconHome size={36} color="rgba(30,58,47,0.15)"/>
              <p style={{ fontSize:'0.82rem', color:'#8C8278', margin:'12px 0' }}>Aucun investissement pour l'instant</p>
              <Link to="/terrains" style={{ padding:'9px 18px', borderRadius:8, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontSize:'0.78rem', fontWeight:600 }}>Commencer à investir →</Link>
            </div>
          )
          : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {investments.slice(0,5).map((inv, i) => {
                const currentVal = inv.current_value || inv.total_paid
                const plusVal    = inv.plus_value    || 0
                const plusValPct = inv.plus_value_pct || 0
                const hasPV      = plusVal !== 0
                return (
                  <div key={inv.id} style={{ background:'#FFFFFF', borderRadius:14, padding:'14px 16px', border:'1px solid rgba(30,58,47,0.06)', boxShadow:'0 2px 8px rgba(30,58,47,0.04)', display:'flex', alignItems:'center', gap:12, opacity:inView?1:0, transform:inView?'translateX(0)':'translateX(-16px)', transition:`all 0.5s ease ${i*0.08}s` }}>
                    <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, background:gradients[i%gradients.length], display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <IconHome size={18} color="rgba(245,240,232,0.8)"/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
                        <div style={{ minWidth:0, flex:1 }}>
                          <p style={{ fontSize:'0.82rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 1px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inv.land?.title||'Terrain'}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <IconMapPin size={10} color="#8C8278"/>
                            <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{inv.land?.city||'—'} · {inv.sqm_bought} m²</p>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0, marginLeft:8 }}>
                          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
                          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>{currentVal.toLocaleString('fr-FR')} F</p>
                          {hasPV ? (
                            <span style={{ fontSize:'0.65rem', fontWeight:600, padding:'1px 6px', borderRadius:10, background:plusVal>=0?'rgba(30,58,47,0.08)':'rgba(192,57,43,0.08)', color:plusVal>=0?'#1E3A2F':'#C0392B' }}>
                              {plusVal>=0?'↑':'↓'} {Math.abs(plusValPct)}%
                            </span>
                          ) : (
                            <span style={{ fontSize:'0.65rem', fontWeight:600, padding:'1px 6px', borderRadius:10, background:'rgba(30,58,47,0.08)', color:'#1E3A2F' }}>Confirmé</span>
                          )}
                        </div>
                      </div>
                      <div style={{ height:3, background:'#EDE6D6', borderRadius:2 }}>
                        <div style={{ height:'100%', borderRadius:2, width:'50%', background:'linear-gradient(90deg,#1E3A2F,#3D6B53)' }}/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
      }
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TRANSACTIONS TABLE
// ═══════════════════════════════════════════════════════════════════
function TransactionsTable({ isMobile, investments, loading }) {
  const [ref, inView] = useInView(0.1)
  const ss = s => ({
    confirmed: { bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'Confirmé' },
    pending:   { bg:'rgba(184,151,42,0.12)',color:'#8B6E1A', label:'En attente' },
    cancelled: { bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'Annulé' },
  }[s] || { bg:'rgba(30,58,47,0.06)', color:'#6B6459', label:s })

  return (
    <div ref={ref} style={{ background:'#FFFFFF', borderRadius:16, boxShadow:'0 2px 12px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', overflow:'hidden', opacity:inView?1:0, transform:inView?'translateY(0)':'translateY(20px)', transition:'all 0.6s ease 0.2s' }}>
      <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(30,58,47,0.06)' }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Transactions récentes</h3>
      </div>
      {loading
        ? <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:8 }}>{[1,2,3,4].map(i => <Skeleton key={i} h={48} radius={8}/>)}</div>
        : investments.length===0
          ? (
            <div style={{ padding:'40px', textAlign:'center' }}>
              <IconFile size={32} color="rgba(30,58,47,0.15)"/>
              <p style={{ fontSize:'0.78rem', color:'#8C8278', margin:'12px 0 0' }}>Aucune transaction</p>
            </div>
          )
          : isMobile
            ? (
              <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                {investments.slice(0,8).map(inv => {
                  const s = ss(inv.status)
                  return (
                    <div key={inv.id} style={{ background:'#FAFAF7', borderRadius:10, padding:'12px 14px', border:'1px solid rgba(30,58,47,0.05)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                        <div>
                          <span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#1E3A2F', fontWeight:600 }}>{inv.reference}</span>
                          <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#1A1A1A', margin:'2px 0 0' }}>{inv.land?.title||'—'}</p>
                        </div>
                        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', fontWeight:700, color:'#1A1A1A' }}>{(inv.total_paid||0).toLocaleString('fr-FR')} F</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:'0.68rem', color:'#8C8278' }}>{inv.sqm_bought} m² · {inv.confirmed_at?new Date(inv.confirmed_at).toLocaleDateString('fr-FR'):'—'}</span>
                        <span style={{ padding:'2px 8px', borderRadius:20, background:s.bg, color:s.color, fontSize:'0.65rem', fontWeight:600 }}>{s.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
            : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#FAFAF7' }}>
                      {['Référence','Terrain','Parts','Payé','Valeur actuelle','Date','Statut'].map(h => (
                        <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'0.68rem', fontWeight:700, color:'#8C8278', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {investments.slice(0,10).map((inv, i) => {
                      const s = ss(inv.status)
                      const plusVal = inv.plus_value || 0
                      const hasPV   = plusVal !== 0
                      return (
                        <tr key={inv.id} style={{ opacity:inView?1:0, transition:`opacity 0.4s ease ${0.3+i*0.06}s` }}>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'#1E3A2F', fontWeight:600 }}>{inv.reference}</span></td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><p style={{ fontSize:'0.82rem', fontWeight:600, color:'#1A1A1A', margin:0 }}>{inv.land?.title||'—'}</p></td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontSize:'0.82rem', color:'#4A3F35' }}>{inv.sqm_bought} m²</span></td>
                          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:700, color:'#8C8278' }}>{(inv.total_paid||0).toLocaleString('fr-FR')} F</span></td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}>
                            {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
                            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:700, color:'#1A1A1A' }}>{(inv.current_value||inv.total_paid||0).toLocaleString('fr-FR')} F</span>
                            {hasPV && <span style={{ display:'block', fontSize:'0.65rem', fontWeight:600, color:plusVal>=0?'#1E3A2F':'#C0392B' }}>{plusVal>=0?'+':''}{plusVal.toLocaleString('fr-FR')} F</span>}
                          </td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontSize:'0.75rem', color:'#8C8278' }}>{inv.confirmed_at?new Date(inv.confirmed_at).toLocaleDateString('fr-FR'):'—'}</span></td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ padding:'3px 9px', borderRadius:20, background:s.bg, color:s.color, fontSize:'0.7rem', fontWeight:600 }}>{s.label}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
      }
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// AVAILABLE TERRAIN
// ═══════════════════════════════════════════════════════════════════
function AvailableTerrain({ land, loading }) {
  const [ref, inView] = useInView(0.1)
  if (loading) return <Skeleton h={300} radius={16}/>
  if (!land) return null
  const pct = Math.round(((land.total_sqm-land.available_sqm)/land.total_sqm)*100)
  return (
    <div ref={ref} style={{ background:'#FFFFFF', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', opacity:inView?1:0, transform:inView?'translateY(0)':'translateY(20px)', transition:'all 0.5s ease 0.1s' }}>
      <div style={{ height:90, background:'linear-gradient(135deg,#1E3A2F,#2D5241,#B8972A)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.1, backgroundImage:`linear-gradient(rgba(245,240,232,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(245,240,232,.5) 1px,transparent 1px)`, backgroundSize:'20px 20px' }}/>
        <IconMapPin size={28} color="#B8972A"/>
        <span style={{ position:'absolute', top:8, right:8, padding:'3px 9px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:'rgba(30,58,47,0.7)', color:'#F5F0E8' }}>Disponible</span>
      </div>
      <div style={{ padding:'14px' }}>
        <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 3px', display:'flex', alignItems:'center', gap:4 }}>
          <IconMapPin size={10} color="#8C8278"/> {land.city}
        </p>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 10px' }}>{land.title}</h4>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
          {[['Prix / m²',`${(land.price_per_sqm||0).toLocaleString('fr-FR')} F`],['Disponible',`${land.available_sqm} m²`]].map(([l,v]) => (
            <div key={l} style={{ background:'#F5F0E8', borderRadius:7, padding:'7px 9px' }}>
              <p style={{ fontSize:'0.58rem', color:'#8C8278', margin:'0 0 1px' }}>{l}</p>
              <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'#8C8278', marginBottom:4 }}>
            <span>Financement</span><span>{pct}%</span>
          </div>
          <div style={{ height:4, background:'#EDE6D6', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:inView?`${pct}%`:'0%', borderRadius:2, background:'linear-gradient(90deg,#1E3A2F,#3D6B53)', transition:'width 1.2s ease 0.5s' }}/>
          </div>
        </div>
        <Link to={`/terrains/${land.id}`} style={{ display:'block', width:'100%', padding:'11px', borderRadius:10, textAlign:'center', background:'linear-gradient(135deg,#1E3A2F,#2D5241)', color:'#F5F0E8', textDecoration:'none', fontWeight:600, fontSize:'0.82rem', boxShadow:'0 3px 12px rgba(30,58,47,0.25)' }}>
          Investir maintenant →
        </Link>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// KYC SECTION
// ═══════════════════════════════════════════════════════════════════
function KycSection({ user, setUser }) {
  const [step, setStep]       = useState(() => user?.kyc_status==='pending'?'pending':user?.kyc_status==='validated'?'validated':'form')
  const [docType, setDocType] = useState('national_id')
  const [file, setFile]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleSubmit = async () => {
    if (!file) { setError('Veuillez sélectionner un fichier.'); return }
    setLoading(true); setError(null)
    try {
      const fd = new FormData(); fd.append('document_type',docType); fd.append('file',file)
      await api.post('/kyc/submit', fd, { headers:{'Content-Type':'multipart/form-data'} })
      setStep('pending')
      const r = await api.get('/dashboard')
      if (r.data.user) { setUser(r.data.user); localStorage.setItem('user',JSON.stringify(r.data.user)) }
    } catch (err) { setError(err.response?.data?.message||'Erreur lors de la soumission.') }
    finally { setLoading(false) }
  }

  if (step==='validated') return (
    <div style={{ maxWidth:500, margin:'0 auto', textAlign:'center', padding:'60px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(39,174,96,0.1)', border:'2px solid #27AE60', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <IconCheckCircle size={30} color="#27AE60"/>
      </div>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
      <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.2rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 8px' }}>Identité vérifiée</h2>
      <p style={{ fontSize:'0.82rem', color:'#8C8278', margin:0 }}>KYC validé. Vous pouvez investir librement.</p>
    </div>
  )

  if (step==='pending') return (
    <div style={{ maxWidth:500, margin:'0 auto', textAlign:'center', padding:'60px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(99,91,255,0.1)', border:'2px solid #635BFF', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <div style={{ width:24, height:24, borderRadius:'50%', border:'3px solid rgba(99,91,255,0.3)', borderTopColor:'#635BFF', animation:'spin 0.8s linear infinite' }}/>
      </div>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
      <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.2rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 8px' }}>Vérification en cours</h2>
      <p style={{ fontSize:'0.82rem', color:'#8C8278', margin:0 }}>Délai : 24-48h.</p>
    </div>
  )

  return (
    <div style={{ maxWidth:560, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <IconShield size={22} color="#1E3A2F"/>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.2rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Vérification d'identité</h2>
      </div>
      {error && (
        <div style={{ display:'flex', gap:8, alignItems:'center', background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px 14px', marginBottom:16 }}>
          <IconAlertTriangle size={16} color="#C0392B"/>
          <p style={{ fontSize:'0.75rem', color:'#C0392B', margin:0 }}>{error}</p>
        </div>
      )}
      <div style={{ background:'#fff', borderRadius:14, padding:'20px', marginBottom:16, border:'1px solid rgba(30,58,47,0.08)' }}>
        <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#4A3F35', marginBottom:10 }}>Type de document *</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[['national_id','CNI'],['passport','Passeport'],['residence_permit','Titre de séjour'],['driving_license','Permis']].map(([v,l]) => (
            <button key={v} onClick={() => setDocType(v)} style={{ padding:'10px 12px', borderRadius:10, cursor:'pointer', border:`1.5px solid ${docType===v?'#1E3A2F':'rgba(30,58,47,0.12)'}`, background:docType===v?'rgba(30,58,47,0.05)':'transparent', fontSize:'0.72rem', fontWeight:docType===v?600:400, color:docType===v?'#1E3A2F':'#6B6459', textAlign:'left', fontFamily:"'DM Sans',sans-serif" }}>
              {docType===v ? '✓ ' : ''}{l}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:'#fff', borderRadius:14, padding:'20px', marginBottom:16, border:'1px solid rgba(30,58,47,0.08)' }}>
        <label style={{ display:'block', fontSize:'0.72rem', fontWeight:600, color:'#4A3F35', marginBottom:10 }}>Document *</label>
        <div onClick={() => document.getElementById('kyc-file').click()} style={{ border:`2px dashed ${file?'#1E3A2F':'rgba(30,58,47,0.2)'}`, borderRadius:12, padding:'28px 20px', textAlign:'center', cursor:'pointer' }}>
          <IconUpload size={28} color={file?'#1E3A2F':'rgba(30,58,47,0.25)'}/>
          <p style={{ fontSize:'0.78rem', fontWeight:600, color:file?'#1E3A2F':'#8C8278', margin:'8px 0 4px' }}>{file ? file.name : 'Cliquez pour uploader'}</p>
          <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:0 }}>JPG, PNG ou PDF · Max 5 Mo</p>
          <input id="kyc-file" type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display:'none' }} onChange={e => setFile(e.target.files[0])}/>
        </div>
      </div>
      <button onClick={handleSubmit} disabled={loading||!file} style={{ width:'100%', padding:'14px', borderRadius:12, border:'none', background:loading||!file?'rgba(30,58,47,0.35)':'linear-gradient(135deg,#1E3A2F,#2D5241)', color:'#F5F0E8', fontSize:'0.9rem', fontWeight:700, cursor:loading||!file?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        {loading
          ? <><div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(245,240,232,0.3)',borderTopColor:'#F5F0E8',animation:'spin 0.7s linear infinite' }}/>Envoi en cours...</>
          : <><IconShield size={16} color="#F5F0E8"/> Soumettre mon dossier KYC</>
        }
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN CONTENT
// ═══════════════════════════════════════════════════════════════════
function MainContent({ active, isMobile, user, setUser, dashData, investments, loadingInv, availableLand, loadingLand, chartData }) {
  if (active==='terrains')      return <TerrainsSection isMobile={isMobile}/>
  if (active==='portefeuille')  return <PortefeuilleSection isMobile={isMobile}/>
  if (active==='historique')    return <HistoriqueSection isMobile={isMobile}/>
  if (active==='documents')     return <DocumentsSection isMobile={isMobile}/>
  if (active==='notifications') return <NotificationsSection isMobile={isMobile}/>
  if (active==='kyc')           return <KycSection user={user} setUser={setUser}/>
  if (active==='profil')        return <ProfilSection user={user} setUser={setUser} isMobile={isMobile}/>

  if (active==='dashboard') {
    const portfolio    = dashData?.portfolio || {}
    const totalInvesti = portfolio.total_invested    || 0
    const totalSqm     = portfolio.total_sqm         || 0
    const nbInv        = portfolio.investments_count || 0
    const currentVal   = portfolio.current_value     || totalInvesti
    const plusVal      = portfolio.plus_value        || 0
    const plusValPct   = portfolio.plus_value_pct    || 0
    const userName     = user?.first_name || 'Investisseur'
    const loadingDash  = !dashData
    const hasPV        = plusVal !== 0

    return (
      <div style={{ display:'flex', flexDirection:isMobile?'column':'row', gap:20 }}>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:18 }}>

          {/* Bannière de bienvenue */}
          <div style={{ background:'linear-gradient(135deg,#1E3A2F,#2D5241)', borderRadius:16, padding:isMobile?'14px 16px':'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 4px 16px rgba(30,58,47,0.2)', flexWrap:'wrap', gap:10 }}>
            <div>
              <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.6)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>Tableau de bord</p>
              {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
              <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:isMobile?'0.95rem':'1.1rem', fontWeight:700, color:'#F5F0E8', margin:0 }}>Bonjour, {userName}</h2>
              {hasPV && !loadingDash && (
                <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4 }}>
                  <IconTrendingUp size={13} color={plusVal>=0?'rgba(184,151,42,0.9)':'rgba(192,57,43,0.9)'}/>
                  <p style={{ fontSize:'0.72rem', color:plusVal>=0?'rgba(184,151,42,0.9)':'rgba(192,57,43,0.9)', margin:0, fontWeight:600 }}>
                    Plus-value : {plusVal>=0?'+':''}{plusVal.toLocaleString('fr-FR')} FCFA ({plusVal>=0?'+':''}{plusValPct}%)
                  </p>
                </div>
              )}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              {totalInvesti > 0 && (
                <div style={{ background:'rgba(184,151,42,0.15)', border:'1px solid rgba(184,151,42,0.3)', borderRadius:12, padding:'8px 14px', flexShrink:0, textAlign:'right' }}>
                  <p style={{ fontSize:'0.62rem', color:'#D4AD3A', margin:'0 0 1px', fontWeight:600 }}>Valeur actuelle</p>
                  {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#D4AD3A', margin:0 }}>{currentVal.toLocaleString('fr-FR')} F</p>
                  {hasPV && <p style={{ fontSize:'0.62rem', color:'rgba(212,173,58,0.7)', margin:0 }}>Payé : {totalInvesti.toLocaleString('fr-FR')} F</p>}
                </div>
              )}
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:12 }}>
            <KpiWidget index={0} loading={loadingDash} label="Total investi"   value={totalInvesti} suffix="F"  sub="Montant payé"         IconComp={IconDollar}     color="#1E3A2F" bg="rgba(30,58,47,0.08)"   delta={null}/>
            <KpiWidget index={1} loading={loadingDash} label="Parts détenues"  value={totalSqm}     suffix="m²" sub={`${nbInv} terrain${nbInv>1?'s':''}`} IconComp={IconLayers} color="#B8972A" bg="rgba(184,151,42,0.1)"  delta={null}/>
            <KpiWidget index={2} loading={loadingDash} label="Valeur actuelle" value={currentVal}   suffix="F"  sub="Au prix du marché"    IconComp={IconTrendingUp} color="#2D5241" bg="rgba(45,82,65,0.1)"   delta={hasPV?plusValPct:null}/>
            <KpiWidget index={3} loading={loadingDash} label="Plus-value"      value={Math.abs(plusVal)} suffix="F" sub={hasPV?(plusVal>=0?"Gain réalisé":"Perte latente"):"Aucune réévaluation"} IconComp={IconTrendingUp} color={hasPV&&plusVal<0?"#C0392B":"#3D6B53"} bg={hasPV&&plusVal<0?"rgba(192,57,43,0.08)":"rgba(61,107,83,0.1)"} delta={null}/>
          </div>

          <PortfolioChart isMobile={isMobile} chartData={chartData ?? []} totalInvesti={totalInvesti} currentValue={currentVal} plusValuePct={hasPV?plusValPct:null} loading={loadingDash}/>
          <TransactionsTable isMobile={isMobile} investments={investments} loading={loadingInv}/>
        </div>

        {!isMobile && <div style={{ width:270, flexShrink:0, display:'flex', flexDirection:'column', gap:16 }}><InvestmentCards investments={investments} loading={loadingInv}/><AvailableTerrain land={availableLand} loading={loadingLand}/></div>}
        {isMobile  && <div style={{ display:'flex', flexDirection:'column', gap:14 }}><InvestmentCards investments={investments} loading={loadingInv}/><AvailableTerrain land={availableLand} loading={loadingLand}/></div>}
      </div>
    )
  }
  return null
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Dashboard() {
  useFonts()
  const navigate = useNavigate()

  const [active,        setActive]       = useState('dashboard')
  const [isMobile,      setIsMobile]     = useState(window.innerWidth <= 768)
  const [collapsed,     setCollapsed]    = useState(false)
  const [drawerOpen,    setDrawerOpen]   = useState(false)
  const [user,          setUser]         = useState(null)
  const [dashData,      setDashData]     = useState(null)
  const [loadingDash,   setLoadingDash]  = useState(true)
  const [investments,   setInvestments]  = useState([])
  const [loadingInv,    setLoadingInv]   = useState(true)
  const [availableLand, setAvailableLand]= useState(null)
  const [loadingLand,   setLoadingLand]  = useState(true)
  const [unreadCount,   setUnreadCount]  = useState(0)
  const [recentNotifs,  setRecentNotifs] = useState([])
  const [loadingNotifs, setLoadingNotifs]= useState(true)
  const [chartData,     setChartData]    = useState([])

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/connexion'); return }
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))

    const loadAll = async () => {
      try {
        const r = await api.get('/dashboard')
        setDashData(r.data)
        if (r.data.user) { setUser(r.data.user); localStorage.setItem('user', JSON.stringify(r.data.user)) }
        if (r.data.chart_data?.length > 0) setChartData(r.data.chart_data)
      } catch (e) {
        if (e.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/connexion') }
      } finally { setLoadingDash(false) }

      try {
        const inv = await api.get('/investments')
        const raw = Array.isArray(inv.data) ? inv.data : (inv.data?.investments || inv.data?.data || [])
        setInvestments(raw.filter(i => i.status === 'confirmed'))
      } catch { setInvestments([]) }
      finally { setLoadingInv(false) }

      try {
        const lands = await api.get('/lands')
        const raw = Array.isArray(lands.data) ? lands.data : (lands.data?.lands || lands.data?.data || [])
        setAvailableLand(raw.find(l => l.status === 'published' && l.available_sqm > 0) || null)
      } catch { setAvailableLand(null) }
      finally { setLoadingLand(false) }

      try {
        const [countRes, notifsRes] = await Promise.all([api.get('/notifications/unread-count'), api.get('/notifications')])
        setUnreadCount(countRes.data?.count || countRes.data?.unread_count || 0)
        const raw = Array.isArray(notifsRes.data) ? notifsRes.data : (notifsRes.data?.notifications || notifsRes.data?.data || [])
        setRecentNotifs(raw.slice(0, 5))
      } catch { setUnreadCount(0); setRecentNotifs([]) }
      finally { setLoadingNotifs(false) }
    }

    loadAll()
  }, [])

  if (loadingDash) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F5F0E8', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:'#1E3A2F', animation:'spin 0.8s linear infinite' }}/>
      <p style={{ fontSize:'0.85rem', color:'#8C8278', fontFamily:"'DM Sans',sans-serif" }}>Chargement...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'DM Sans',sans-serif", background:'#F5F0E8' }}>
      {!isMobile && <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} user={user} unreadCount={unreadCount}/>}
      {isMobile  && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={active} setActive={setActive} user={user} unreadCount={unreadCount}/>}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Topbar active={active} isMobile={isMobile} onMenuOpen={() => setDrawerOpen(true)} user={user} setActive={setActive} unreadCount={unreadCount} recentNotifs={recentNotifs} loadingNotifs={loadingNotifs}/>
        <main style={{ flex:1, overflow:'auto', padding:isMobile?'16px 14px 80px':'20px', background:'#F5F0E8' }}>
          <MainContent active={active} isMobile={isMobile} user={user} setUser={setUser} dashData={dashData} investments={investments} loadingInv={loadingInv} availableLand={availableLand} loadingLand={loadingLand} chartData={chartData}/>
        </main>
      </div>
      {isMobile && <BottomNav active={active} setActive={setActive} unreadCount={unreadCount}/>}
      {/* ✅ SUPPRIMÉ : DevBar retirée — plus de barre de navigation dev en bas de page */}
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(30,58,47,0.15); border-radius:3px; }
      `}</style>
    </div>
  )
}