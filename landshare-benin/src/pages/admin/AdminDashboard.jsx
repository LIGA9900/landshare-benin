import StatsPage      from './StatsPage'
import TerrainWizard  from './TerrainWizard'
import ValuationModal from './ValuationModal'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate }    from 'react-router-dom'
import api                             from '../../api/axios'
import { landsApi, kycApi, investmentsApi, userApi } from '../../services/landshareApi'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

// ✅ Fonction utilitaire : formater un montant FCFA intelligemment
function formatRevenu(v) {
  if (!v || v === 0) return '0 F'
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M F`
  if (v >= 100_000)   return `${(v / 1_000).toFixed(0)}K F`
  return `${Math.round(v).toLocaleString('fr-FR')} F`
}

// ═══════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════
function useFonts() {
  useEffect(() => {
    const l = document.createElement('link')
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap'
    l.rel  = 'stylesheet'
    document.head.appendChild(l)
  }, [])
}

function useCountUp(target, duration = 1600, trigger = true) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!trigger) return
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

function useMediaQuery(q) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const h  = e => setM(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [q])
  return m
}

// ═══════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════
const C = {
  bg:'#F5F0E8', surface:'#FFFFFF', sidebar:'#111810',
  green:'#1E3A2F', green2:'#2D5241', gold:'#B8972A', goldText:'#D4AD3A',
  cream:'#F5F0E8', text:'#1A1A1A', muted:'#8C8278',
  border:'rgba(30,58,47,0.09)', red:'#DC3545', redBg:'rgba(220,53,69,0.07)',
  pending:'#8B6D14', pendBg:'rgba(184,151,42,0.10)',
}

// ═══════════════════════════════════════════════
// ICÔNES SVG
// ═══════════════════════════════════════════════
const IcoGrid     = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IcoUsers    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IcoMap      = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
const IcoCredit   = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoShield   = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IcoBar      = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IcoBell     = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const IcoCheck    = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoX        = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoEye      = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcoPlus     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoLogout   = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcoMenu     = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const IcoSearch   = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoDownload = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IcoEdit     = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoPublish  = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoTrend    = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IcoCoin     = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
const IcoChart    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IcoClock    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcoHome     = ({size=22}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcoPin      = ({size=13}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IcoId       = ({size=28}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h3"/></svg>
const IcoWarning  = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoInfo     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
const IcoSuccess  = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const IcoReject   = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
const IcoArrowR   = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const IcoArrowL   = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const IcoFilter   = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
const IcoValidate = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoBlockchain = ({size=13}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="2" y="7" width="6" height="6" rx="1"/><rect x="9" y="7" width="6" height="6" rx="1"/><rect x="16" y="7" width="6" height="6" rx="1"/><line x1="5" y1="13" x2="5" y2="17"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="19" y1="13" x2="19" y2="17"/><line x1="2" y1="17" x2="22" y2="17"/></svg>
const IcoCalendar = ({size=13}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IcoAlert    = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoSuspend  = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
const IcoActivate = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const IcoTerrain  = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/><path d="M7 17h10"/></svg>
const IcoBack     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
const IcoClose    = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const NAV_ITEMS_BASE = [
  { id:'dashboard',    label:'Tableau de bord', Icon:IcoGrid   },
  { id:'users',        label:'Utilisateurs',    Icon:IcoUsers  },
  { id:'terrains',     label:'Terrains',         Icon:IcoMap    },
  { id:'transactions', label:'Transactions',     Icon:IcoCredit },
  { id:'kyc',          label:'KYC',              Icon:IcoShield },
  { id:'stats',        label:'Statistiques',     Icon:IcoBar    },
]

// ═══════════════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════════════
function Avatar({ name, size=32 }) {
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
  const hue = (name.charCodeAt(0)*47 + name.charCodeAt(1)*13) % 360
  return <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, background:`hsl(${hue},28%,86%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.35, fontWeight:600, color:C.green }}>{initials}</div>
}

const statusMap = {
  confirmed:  { label:'Confirmé',   bg:'rgba(30,58,47,0.09)',   color:C.green   },
  pending:    { label:'En attente', bg:C.pendBg,                color:C.pending },
  failed:     { label:'Échoué',     bg:C.redBg,                 color:'#B02A37' },
  disponible: { label:'Disponible', bg:'rgba(30,58,47,0.09)',   color:C.green   },
  en_cours:   { label:'En cours',   bg:C.pendBg,                color:C.pending },
  brouillon:  { label:'Brouillon',  bg:'rgba(140,130,120,0.1)', color:'#6B5B4E' },
  complet:    { label:'Complet',    bg:'rgba(45,82,65,0.13)',   color:C.green   },
  valide:     { label:'Validé',     bg:'rgba(30,58,47,0.09)',   color:C.green   },
  en_attente: { label:'En attente', bg:C.pendBg,                color:C.pending },
  rejete:     { label:'Rejeté',     bg:C.redBg,                 color:'#B02A37' },
}
function Badge({ status }) {
  const s = statusMap[status] || { label:status, bg:'rgba(0,0,0,0.06)', color:'#555' }
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:20, background:s.bg, color:s.color, fontSize:'0.7rem', fontWeight:600, whiteSpace:'nowrap' }}><span style={{ width:5, height:5, borderRadius:'50%', background:s.color }}/>{s.label}</span>
}
function Card({ children, style }) {
  return <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden', ...style }}>{children}</div>
}
function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
      <div>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les titres de card */}
        <p style={{ margin:0, fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:C.text }}>{title}</p>
        {subtitle && <p style={{ margin:'2px 0 0', fontSize:'0.72rem', color:C.muted }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
function Btn({ children, variant='ghost', onClick, style }) {
  const v = { primary:{ background:C.green, color:C.cream, border:'none' }, ghost:{ background:'rgba(30,58,47,0.05)', color:C.text, border:`1px solid ${C.border}` }, gold:{ background:'rgba(184,151,42,0.1)', color:C.pending, border:`1px solid rgba(184,151,42,0.22)` }, danger:{ background:C.redBg, color:'#B02A37', border:`1px solid rgba(220,53,69,0.2)` } }[variant]
  return <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:8, ...v, fontFamily:"'DM Sans',sans-serif", fontSize:'0.76rem', fontWeight:600, cursor:'pointer', transition:'all 0.18s', ...style }}>{children}</button>
}
function AdminKpi({ label, value, color }) {
  return (
    <div style={{ background:'#fff', borderRadius:12, padding:'14px 16px', boxShadow:'0 1px 6px rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.05)', borderTop:`3px solid ${color}` }}>
      <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les valeurs KPI admin */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.3rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{value}</p>
    </div>
  )
}
function IcoBtn({ icon, color='#1E3A2F', bg='rgba(30,58,47,0.07)', title, onClick }) {
  return <button title={title} onClick={onClick} style={{ width:28, height:28, borderRadius:7, background:bg, border:`1px solid ${bg}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color, transition:'all 0.15s', flexShrink:0 }} onMouseEnter={e=>e.currentTarget.style.opacity='0.75'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>{icon}</button>
}

// ═══════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════
function Sidebar({ active, setActive, collapsed, setCollapsed, badges = {} }) {
  const btnStyle = (isActive) => ({ width:'100%', display:'flex', alignItems:'center', gap:collapsed?0:10, justifyContent:collapsed?'center':'flex-start', padding:collapsed?'11px 0':'10px 12px', borderRadius:10, border:'none', cursor:'pointer', borderLeft:`3px solid ${isActive?C.gold:'transparent'}`, background:isActive?'rgba(184,151,42,0.13)':'transparent', color:isActive?C.goldText:'rgba(245,240,232,0.52)', fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:isActive?600:400, transition:'all 0.2s', marginBottom:2, overflow:'hidden', whiteSpace:'nowrap' })
  return (
    <aside style={{ width:collapsed?68:236, background:C.sidebar, display:'flex', flexDirection:'column', flexShrink:0, overflow:'hidden', transition:'width 0.3s cubic-bezier(.4,0,.2,1)', zIndex:10 }}>
      <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'space-between', gap:8 }}>
        {!collapsed && <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30, height:30, background:C.green, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <div style={{ width:12, height:12, background:C.gold, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }}/>
          </div>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur le logo sidebar */}
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:'#F5F0E8', whiteSpace:'nowrap' }}>
            Land<span style={{ color:C.gold }}>Share</span>
            <span style={{ color:'rgba(245,240,232,0.35)', fontSize:'0.62rem', fontWeight:400, marginLeft:5 }}>ADMIN</span>
          </span>
        </div>}
        {collapsed && <div style={{ width:30, height:30, background:C.green, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:12, height:12, background:C.gold, clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)' }}/></div>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:'rgba(245,240,232,0.06)', border:'1px solid rgba(245,240,232,0.1)', borderRadius:7, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(245,240,232,0.45)', flexShrink:0, fontSize:'0.7rem' }}>{collapsed?<IcoArrowR size={12}/>:<IcoArrowL size={12}/>}</button>
      </div>
      {!collapsed && <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(245,240,232,0.04)' }}><span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(184,151,42,0.12)', border:'1px solid rgba(184,151,42,0.2)', borderRadius:20, padding:'2px 10px', fontSize:'0.62rem', fontWeight:700, color:C.goldText, letterSpacing:'0.06em', textTransform:'uppercase' }}><span style={{ width:5, height:5, borderRadius:'50%', background:C.gold }}/>Administrateur</span></div>}
      <nav style={{ flex:1, padding:'10px 8px', overflow:'hidden' }}>
        {!collapsed && <p style={{ fontSize:'0.62rem', color:'rgba(245,240,232,0.22)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 12px 8px', fontWeight:600 }}>Navigation</p>}
        {NAV_ITEMS_BASE.map(({ id, label, Icon }) => {
          const isActive = active === id
          const badge = badges[id]
          return (
            <button key={id} onClick={() => setActive(id)} title={collapsed?label:''} style={btnStyle(isActive)}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(245,240,232,0.05)'; e.currentTarget.style.color='#F5F0E8' }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(245,240,232,0.52)' }}}>
              <span style={{ flexShrink:0 }}><Icon size={17}/></span>
              {!collapsed && <span style={{ flex:1, textAlign:'left' }}>{label}</span>}
              {!collapsed && badge > 0 && <span style={{ background:isActive?C.gold:'rgba(220,53,69,0.75)', color:isActive?C.sidebar:'#fff', fontSize:'0.62rem', fontWeight:700, padding:'1px 7px', borderRadius:10 }}>{badge}</span>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:'14px 14px', borderTop:'1px solid rgba(245,240,232,0.06)' }}>
        {!collapsed ? (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#1E3A2F,#2D5241)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700, color:C.gold, border:'2px solid rgba(184,151,42,0.28)' }}>AD</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontSize:'0.8rem', fontWeight:600, color:'#F5F0E8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Admin Principal</p>
              <p style={{ margin:0, fontSize:'0.68rem', color:'rgba(245,240,232,0.33)' }}>admin@landshare.bj</p>
            </div>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/connexion' }} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,240,232,0.28)', padding:4 }} onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color='rgba(245,240,232,0.28)'}><IcoLogout size={16}/></button>
          </div>
        ) : (
          <div style={{ display:'flex', justifyContent:'center' }}><div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#1E3A2F,#2D5241)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700, color:C.gold }}>AD</div></div>
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════
function Topbar({ active, isMobile, onMenuOpen, notifOpen, setNotifOpen, badges = {} }) {
  const titles = { dashboard:'Tableau de bord', users:'Utilisateurs', terrains:'Terrains', transactions:'Transactions', kyc:'Validation KYC', stats:'Statistiques' }
  const pendingKyc = badges.kyc || 0
  const hasAlert = pendingKyc > 0

  const dynamicAlerts = []
  if (pendingKyc > 0)
    dynamicAlerts.push({ id:1, type:'warning', msg:`${pendingKyc} dossier${pendingKyc>1?'s':''} KYC en attente de validation` })
  if (!hasAlert)
    dynamicAlerts.push({ id:2, type:'success', msg:'Aucune alerte active — tout est en ordre' })

  return (
    <header style={{ height:60, background:'#FDFAF5', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {isMobile && <button onClick={onMenuOpen} style={{ background:'none', border:'none', cursor:'pointer', color:C.text, display:'flex' }}><IcoMenu/></button>}
        <div>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur le titre topbar */}
          <p style={{ margin:0, fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:C.text }}>{titles[active]}</p>
          {!isMobile && <p style={{ margin:0, fontSize:'0.68rem', color:C.muted }}>LandShare Bénin · Administration</p>}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {!isMobile && <div style={{ position:'relative' }}><input placeholder="Rechercher…" style={{ background:'rgba(30,58,47,0.05)', border:`1px solid ${C.border}`, borderRadius:20, padding:'7px 14px 7px 34px', fontSize:'0.78rem', color:C.text, outline:'none', fontFamily:"'DM Sans',sans-serif", width:180 }}/><span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.muted, display:'flex', alignItems:'center' }}><IcoSearch size={14}/></span></div>}
        <div style={{ position:'relative' }}>
          <button onClick={e => { e.stopPropagation(); setNotifOpen(!notifOpen) }} style={{ width:36, height:36, borderRadius:9, background:notifOpen?'rgba(184,151,42,0.1)':'rgba(30,58,47,0.05)', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:C.text, position:'relative' }}>
            <IcoBell size={17}/>
            {hasAlert && <span style={{ position:'absolute', top:7, right:7, width:7, height:7, borderRadius:'50%', background:C.red, border:'1.5px solid #FDFAF5' }}/>}
          </button>
          {notifOpen && (
            <div style={{ position:'absolute', top:44, right:0, zIndex:300, background:C.surface, borderRadius:12, width:310, boxShadow:'0 8px 32px rgba(30,58,47,0.14)', border:`1px solid ${C.border}` }}>
              <div style={{ padding:'12px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur "Alertes" */}
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:'0.9rem' }}>Alertes</span>
              </div>
              {dynamicAlerts.map(a => {
                const cfg = { warning:{ bg:C.pendBg, color:C.pending }, error:{ bg:C.redBg, color:'#B02A37' }, info:{ bg:'rgba(30,90,138,0.07)', color:'#18568A' }, success:{ bg:'rgba(30,58,47,0.08)', color:C.green } }
                const s = cfg[a.type]
                const IconAlert = a.type==='warning' ? IcoWarning : a.type==='success' ? IcoSuccess : IcoInfo
                return <div key={a.id} style={{ padding:'11px 16px', background:s.bg, borderBottom:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'flex-start' }}><span style={{ flexShrink:0, color:s.color, marginTop:1 }}><IconAlert size={15}/></span><p style={{ margin:0, fontSize:'0.76rem', color:s.color, lineHeight:1.45 }}>{a.msg}</p></div>
              })}
            </div>
          )}
        </div>
        {!isMobile && <Btn variant="primary" style={{ borderRadius:20, padding:'8px 16px' }}><IcoPlus size={14}/> Nouveau terrain</Btn>}
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════
// BOTTOM NAV & MOBILE DRAWER
// ═══════════════════════════════════════════════
function BottomNav({ active, setActive, badges = {} }) {
  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, background:C.sidebar, display:'flex', borderTop:'1px solid rgba(245,240,232,0.08)', paddingBottom:'env(safe-area-inset-bottom)' }}>
      {NAV_ITEMS_BASE.slice(0,5).map(({ id, label, Icon }) => {
        const isActive = active === id
        const badge = badges[id]
        return <button key={id} onClick={() => setActive(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'10px 4px', background:'none', border:'none', cursor:'pointer', color:isActive?C.goldText:'rgba(245,240,232,0.42)', fontFamily:"'DM Sans',sans-serif", fontSize:'0.62rem', fontWeight:isActive?600:400, borderTop:`2px solid ${isActive?C.gold:'transparent'}`, transition:'all 0.2s' }}><div style={{ position:'relative' }}><Icon size={19}/>{badge>0&&<span style={{ position:'absolute', top:-3, right:-5, background:C.red, color:'#fff', fontSize:'0.5rem', fontWeight:800, padding:'1px 4px', borderRadius:6 }}>{badge}</span>}</div>{label.split(' ')[0]}</button>
      })}
    </div>
  )
}

function MobileDrawer({ open, onClose, active, setActive, badges = {} }) {
  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(0,0,0,0.5)' }}/>
      <aside style={{ position:'fixed', top:0, left:0, bottom:0, zIndex:500, width:260, background:C.sidebar, display:'flex', flexDirection:'column', animation:'slideIn .25s ease' }}>
        <style>{`@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
        <div style={{ padding:'20px 16px', borderBottom:'1px solid rgba(245,240,232,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans logo mobile drawer */}
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:'#F5F0E8' }}>Land<span style={{ color:C.gold }}>Share</span></span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(245,240,232,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><IcoClose size={16}/></button>
        </div>
        <nav style={{ flex:1, padding:'12px 10px' }}>
          {NAV_ITEMS_BASE.map(({ id, label, Icon }) => {
            const isActive = active === id
            const badge = badges[id]
            return <button key={id} onClick={() => { setActive(id); onClose() }} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'11px 12px', borderRadius:10, border:'none', cursor:'pointer', borderLeft:`3px solid ${isActive?C.gold:'transparent'}`, background:isActive?'rgba(184,151,42,0.13)':'transparent', color:isActive?C.goldText:'rgba(245,240,232,0.52)', fontFamily:"'DM Sans',sans-serif", fontSize:'0.87rem', fontWeight:isActive?600:400, marginBottom:2 }}><Icon size={18}/><span style={{ flex:1, textAlign:'left' }}>{label}</span>{badge>0&&<span style={{ background:isActive?C.gold:'rgba(220,53,69,0.75)', color:isActive?C.sidebar:'#fff', fontSize:'0.62rem', fontWeight:700, padding:'1px 7px', borderRadius:10 }}>{badge}</span>}</button>
          })}
        </nav>
      </aside>
    </>
  )
}

// ═══════════════════════════════════════════════
// KPI CARD
// ═══════════════════════════════════════════════
function KpiCard({ label, value, sub, icon, delta, color, bgColor, index }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:'18px 20px', opacity:inView?1:0, transform:inView?'none':'translateY(12px)', transition:`opacity .45s ${index*0.08}s, transform .45s ${index*0.08}s` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <p style={{ margin:0, fontSize:'0.7rem', color:C.muted, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
        <div style={{ width:32, height:32, background:bgColor, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
      </div>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les valeurs KPI card */}
      <p style={{ margin:'0 0 4px', fontFamily:"'DM Sans',sans-serif", fontSize:'1.6rem', fontWeight:700, color, lineHeight:1 }}>{value}</p>
      <p style={{ margin:0, fontSize:'0.7rem', color:C.muted }}>{sub}</p>
      {delta!=null && <p style={{ margin:'8px 0 0', fontSize:'0.72rem', fontWeight:600, color:delta>=0?C.green:C.red }}>{delta>=0?'↑':'↓'} {Math.abs(delta)}% <span style={{ color:C.muted, fontWeight:400 }}>vs mois dernier</span></p>}
    </div>
  )
}

// ═══════════════════════════════════════════════
// DASHBOARD WIDGETS
// ═══════════════════════════════════════════════
function RevenueChart({ data = [], loading }) {
  const [ref, inView] = useInView()
  const Tip = ({ active, payload, label }) => {
    if (!active||!payload?.length) return null
    return <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'10px 14px' }}>
      <p style={{ margin:'0 0 3px', fontSize:'0.7rem', color:C.muted, fontWeight:600 }}>{label}</p>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans dans le tooltip */}
      <p style={{ margin:'0 0 2px', fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', fontWeight:700, color:C.green }}>{(payload[0]?.value||0).toLocaleString('fr-FR')} F</p>
      {payload[1] && <p style={{ margin:0, fontSize:'0.7rem', color:C.gold, fontWeight:600 }}>{payload[1]?.value} transactions</p>}
    </div>
  }
  return (
    <Card style={{ opacity:inView?1:0, transform:inView?'none':'translateY(12px)', transition:'opacity .5s .15s, transform .5s .15s' }}>
      <div ref={ref}/>
      <CardHeader title="Revenus & Transactions" subtitle="Données réelles · mois par mois" action={<div style={{ display:'flex', gap:12 }}>{[['#1E3A2F','Revenus'],['#B8972A','Transactions']].map(([c,l]) => <div key={l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.7rem', color:C.muted }}><span style={{ width:10, height:3, background:c, borderRadius:2 }}/>{l}</div>)}</div>}/>
      <div style={{ padding:'16px 12px 12px' }}>
        {loading ? (
          <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:C.green, animation:'spin .8s linear infinite' }}/></div>
        ) : data.length === 0 ? (
          <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
            <span style={{ color:C.muted }}><IcoBar size={32}/></span>
            <p style={{ fontSize:'0.78rem', color:C.muted, margin:0 }}>Aucune donnée de revenus pour le moment</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top:4, right:4, left:-22, bottom:0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1E3A2F" stopOpacity={0.14}/><stop offset="95%" stopColor="#1E3A2F" stopOpacity={0}/></linearGradient>
                <linearGradient id="gTx"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#B8972A" stopOpacity={0.14}/><stop offset="95%" stopColor="#B8972A" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,47,0.06)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fontSize:10, fill:'#B0A99F' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:'#B0A99F' }} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Area type="monotone" dataKey="revenue" stroke="#1E3A2F" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r:4, fill:'#1E3A2F' }}/>
              <Area type="monotone" dataKey="transactions" stroke="#B8972A" strokeWidth={1.5} fill="url(#gTx)" dot={false} activeDot={{ r:4, fill:'#B8972A' }} yAxisId="r"/>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}

function KycQueue({ items = [], loading, onValidate, onReject }) {
  return (
    <Card>
      <CardHeader title="File KYC en attente" subtitle={loading ? '...' : `${items.length} dossier${items.length!==1?'s':''} à traiter`} action={<Btn variant="gold">Voir tout <IcoArrowR size={12}/></Btn>}/>
      {loading ? (
        <div style={{ padding:'20px', textAlign:'center' }}><div style={{ width:24, height:24, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:C.green, animation:'spin .8s linear infinite', margin:'0 auto' }}/></div>
      ) : items.length === 0 ? (
        <div style={{ padding:32, textAlign:'center' }}>
          <div style={{ margin:'0 auto 8px', width:40, height:40, borderRadius:'50%', background:'rgba(30,58,47,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:C.green }}><IcoSuccess size={22}/></div>
          {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, margin:0, color:C.text }}>File vide !</p>
          <p style={{ fontSize:'0.72rem', color:C.muted, margin:'4px 0 0' }}>Aucun KYC en attente</p>
        </div>
      ) : items.map((k,i) => (
        <div key={k.id} style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', flexWrap:'wrap' }}>
          <Avatar name={k.user?.name || 'Inconnu'} size={34}/>
          <div style={{ flex:1, minWidth:120 }}>
            <p style={{ margin:'0 0 1px', fontSize:'0.83rem', fontWeight:600, color:C.text }}>{k.user?.name || 'Inconnu'}</p>
            <p style={{ margin:0, fontSize:'0.7rem', color:C.muted }}>KYC-{String(k.id).padStart(3,'0')} · {k.document_label || k.document_type} · {k.created_at ? new Date(k.created_at).toLocaleDateString('fr-FR') : ''}</p>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ width:30, height:30, borderRadius:8, background:'rgba(30,58,47,0.05)', border:`1px solid ${C.border}`, cursor:'pointer', color:C.text, display:'flex', alignItems:'center', justifyContent:'center' }}><IcoEye/></button>
            <button onClick={() => onValidate(k.id)} style={{ width:30, height:30, borderRadius:8, background:'rgba(30,58,47,0.06)', border:`1px solid rgba(30,58,47,0.14)`, cursor:'pointer', color:C.green, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s' }} onMouseEnter={e=>{ e.currentTarget.style.background=C.green; e.currentTarget.style.color=C.cream }} onMouseLeave={e=>{ e.currentTarget.style.background='rgba(30,58,47,0.06)'; e.currentTarget.style.color=C.green }}><IcoCheck/></button>
            <button onClick={() => onReject(k.id)} style={{ width:30, height:30, borderRadius:8, background:C.redBg, border:`1px solid rgba(220,53,69,0.18)`, cursor:'pointer', color:'#B02A37', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s' }} onMouseEnter={e=>{ e.currentTarget.style.background=C.red; e.currentTarget.style.color='#fff' }} onMouseLeave={e=>{ e.currentTarget.style.background=C.redBg; e.currentTarget.style.color='#B02A37' }}><IcoX/></button>
          </div>
        </div>
      ))}
    </Card>
  )
}

function TransactionsTable({ isMobile, items = [], loading }) {
  return (
    <Card>
      <CardHeader title="Transactions récentes" subtitle="6 dernières opérations" action={<Btn variant="ghost" style={{ fontSize:'0.72rem', padding:'6px 10px' }}><IcoFilter size={12}/> Filtrer</Btn>}/>
      {loading ? (
        <div style={{ padding:'20px', textAlign:'center' }}><div style={{ width:24, height:24, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:C.green, animation:'spin .8s linear infinite', margin:'0 auto' }}/></div>
      ) : items.length === 0 ? (
        <div style={{ padding:'32px', textAlign:'center' }}>
          <div style={{ margin:'0 auto 8px', width:40, height:40, borderRadius:'50%', background:'rgba(30,58,47,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><IcoCredit size={22}/></div>
          <p style={{ fontSize:'0.78rem', color:C.muted, margin:0 }}>Aucune transaction pour le moment</p>
        </div>
      ) : isMobile ? (
        <div>{items.map((t,i) => (
          <div key={t.id} style={{ padding:'14px 18px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar name={t.user} size={32}/><div><p style={{ margin:0, fontSize:'0.83rem', fontWeight:600, color:C.text }}>{t.user}</p><p style={{ margin:0, fontSize:'0.7rem', color:C.muted }}>{t.terrain} · {t.sqm} m²</p></div></div>
              <Badge status={t.status}/>
            </div>
            {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les montants mobile */}
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:C.green }}>{t.amount.toLocaleString('fr-FR')} F</span><span style={{ fontSize:'0.68rem', color:C.muted }}>{t.method} · {t.date}</span></div>
          </div>
        ))}</div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:680 }}>
            <thead><tr>{['ID','Investisseur','Terrain','Surface','Montant','Méthode','Date','Statut'].map(h => <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'0.67rem', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em', background:'rgba(30,58,47,0.025)', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{items.map((t,i) => (
              <tr key={t.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(30,58,47,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'} style={{ transition:'background .15s' }}>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', fontFamily:'monospace', fontSize:'0.72rem', color:C.muted }}>{t.ref}</td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={t.user} size={26}/><span style={{ fontSize:'0.82rem', fontWeight:500 }}>{t.user}</span></div></td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', fontSize:'0.78rem', color:'#4A4033' }}>{t.terrain}</td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', fontSize:'0.82rem', fontWeight:600 }}>{t.sqm} m²</td>
                {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les montants tableau */}
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:C.green, whiteSpace:'nowrap' }}>{t.amount.toLocaleString('fr-FR')} F</td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}><span style={{ fontSize:'0.7rem', background:'rgba(30,58,47,0.05)', borderRadius:6, padding:'2px 8px', color:'#4A4033', whiteSpace:'nowrap' }}>{t.method}</span></td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', fontSize:'0.75rem', color:C.muted, whiteSpace:'nowrap' }}>{t.date}</td>
                <td style={{ padding:'12px 14px', borderBottom:i<items.length-1?`1px solid ${C.border}`:'none' }}><Badge status={t.status}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function TerrainsOverview({ items = [], loading }) {
  return (
    <Card>
      <CardHeader title="Terrains" subtitle={loading ? '...' : `${items.length} terrain${items.length!==1?'s':''} · vue globale`} action={<Btn variant="primary" style={{ borderRadius:8, padding:'7px 12px', fontSize:'0.75rem' }}><IcoPlus size={13}/> Ajouter</Btn>}/>
      {loading ? (
        <div style={{ padding:'20px', textAlign:'center' }}><div style={{ width:24, height:24, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:C.green, animation:'spin .8s linear infinite', margin:'0 auto' }}/></div>
      ) : items.length === 0 ? (
        <div style={{ padding:'32px', textAlign:'center' }}>
          <div style={{ margin:'0 auto 8px', width:40, height:40, borderRadius:'50%', background:'rgba(30,58,47,0.07)', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><IcoMap size={22}/></div>
          <p style={{ fontSize:'0.78rem', color:C.muted, margin:0 }}>Aucun terrain créé pour le moment</p>
        </div>
      ) : items.map((t,i) => (
        <div key={t.id} style={{ padding:'13px 20px', display:'flex', alignItems:'center', gap:14, borderBottom:i<items.length-1?`1px solid ${C.border}`:'none', cursor:'pointer', transition:'background .15s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(30,58,47,0.02)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:t.status==='full'?'linear-gradient(135deg,#1E3A2F,#2D5241)':t.status==='draft'?'linear-gradient(135deg,#9A8880,#B0A99F)':'linear-gradient(135deg,#2D5241,#B8972A)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{t.status==='full'?<IcoCheck size={16}/>:t.status==='draft'?<IcoEdit size={14}/>:<IcoMap size={16}/>}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5, flexWrap:'wrap', gap:4 }}><p style={{ margin:0, fontSize:'0.82rem', fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{t.name}</p><Badge status={t.status}/></div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ flex:1, height:5, background:'rgba(30,58,47,0.08)', borderRadius:3, overflow:'hidden' }}><div style={{ height:'100%', width:`${t.progress}%`, background:t.progress===100?C.green:t.progress>60?`linear-gradient(90deg,${C.green},${C.gold})`:C.gold, borderRadius:3 }}/></div><span style={{ fontSize:'0.7rem', color:C.muted, whiteSpace:'nowrap', minWidth:70 }}>{t.sold}/{t.total} m²</span></div>
          </div>
        </div>
      ))}
    </Card>
  )
}

function AlertsPanel({ stats = null, loading }) {
  const cfg = {
    warning: { bg:C.pendBg, color:C.pending, border:'rgba(184,151,42,0.22)', Icon:IcoWarning },
    error:   { bg:C.redBg,  color:'#B02A37', border:'rgba(220,53,69,0.2)',   Icon:IcoReject  },
    info:    { bg:'rgba(30,90,138,0.07)', color:'#18568A', border:'rgba(30,90,138,0.18)', Icon:IcoInfo },
    success: { bg:'rgba(30,58,47,0.07)', color:C.green,   border:'rgba(30,58,47,0.18)', Icon:IcoSuccess },
  }
  const alerts = []
  if (!loading && stats) {
    if (stats.pending_kyc > 0)        alerts.push({ id:1, type:'warning', msg:`${stats.pending_kyc} dossier${stats.pending_kyc>1?'s':''} KYC en attente` })
    if (stats.total_investments === 0) alerts.push({ id:2, type:'info',    msg:'Aucune transaction enregistrée pour le moment' })
    if (stats.total_users === 0)       alerts.push({ id:3, type:'info',    msg:'Aucun investisseur inscrit pour le moment' })
    if (alerts.length === 0)           alerts.push({ id:4, type:'success', msg:'Tout est en ordre — aucune alerte active' })
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur "Alertes actives" */}
      <p style={{ margin:'0 0 4px', fontFamily:"'DM Sans',sans-serif", fontSize:'0.9rem', fontWeight:700, color:C.text }}>Alertes actives</p>
      {loading ? (
        <div style={{ padding:'20px', textAlign:'center' }}><div style={{ width:22, height:22, borderRadius:'50%', border:'3px solid rgba(30,58,47,0.15)', borderTopColor:C.green, animation:'spin .8s linear infinite', margin:'0 auto' }}/></div>
      ) : alerts.map(a => {
        const s = cfg[a.type]
        return <div key={a.id} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'11px 14px', background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, cursor:'pointer', transition:'transform .15s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateX(3px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}><span style={{ color:s.color, flexShrink:0, marginTop:1 }}><s.Icon size={15}/></span><p style={{ margin:0, fontSize:'0.78rem', color:s.color, lineHeight:1.45, flex:1 }}>{a.msg}</p><span style={{ color:s.color, opacity:0.6, flexShrink:0 }}><IcoArrowR size={12}/></span></div>
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════
function DashboardPage({ isMobile }) {
  const [loading,  setLoading]  = useState(true)
  const [stats,    setStats]    = useState(null)
  const [revenue,  setRevenue]  = useState([])
  const [kycItems, setKycItems] = useState([])
  const [txItems,  setTxItems]  = useState([])
  const [lands,    setLands]    = useState([])

  const METHOD = { mtn_momo:'MTN MoMo', moov_money:'Moov Money', stripe:'Stripe', paystack:'Paystack', simulation:'Simulation' }

  useEffect(() => {
    Promise.allSettled([
      api.get('/admin/statistics'),
      api.get('/admin/statistics/revenue'),
      api.get('/admin/kyc?status=pending'),
      api.get('/admin/investments'),
      api.get('/admin/lands'),
    ]).then(([statsR, revR, kycR, txR, landsR]) => {
      if (statsR.status === 'fulfilled') setStats(statsR.value.data)
      if (revR.status   === 'fulfilled') setRevenue(revR.value.data?.revenue || [])
      if (kycR.status   === 'fulfilled') setKycItems(kycR.value.data?.kycs || [])
      if (txR.status    === 'fulfilled') {
        setTxItems((txR.value.data?.investments || []).slice(0,6).map(inv => ({
          id:inv.id, ref:inv.reference,
          user:inv.investor ? `${inv.investor.first_name} ${inv.investor.last_name}` : 'N/A',
          terrain:inv.land?.title || 'N/A', sqm:inv.sqm_bought,
          amount:parseFloat(inv.total_paid),
          method:METHOD[inv.payment_method] || METHOD[inv.payments?.[0]?.method] || 'N/A',
          status:inv.status,
          date:inv.confirmed_at ? new Date(inv.confirmed_at).toLocaleDateString('fr-FR') : 'N/A',
        })))
      }
      if (landsR.status === 'fulfilled') {
        setLands((landsR.value.data?.lands || []).slice(0,5).map(t => ({
          id:t.id, name:t.title, city:t.city, status:t.status,
          progress:t.funding_progress||0, total:t.total_sqm,
          sold:t.total_sqm - t.available_sqm,
        })))
      }
      setLoading(false)
    })
  }, [])

  const handleValidate = async (id) => {
    try { await kycApi.adminValidate(id); setKycItems(p => p.filter(x => x.id !== id)) }
    catch { alert('Erreur validation.') }
  }
  const handleReject = async (id) => {
    try { await kycApi.adminReject(id, ''); setKycItems(p => p.filter(x => x.id !== id)) }
    catch { alert('Erreur rejet.') }
  }

  const totalRevenu = stats?.total_revenue     || 0
  const totalUsers  = stats?.total_users       || 0
  const pendingKyc  = stats?.pending_kyc       || 0
  const totalInv    = stats?.total_investments || 0

  return (
    <div style={{ display:'flex', gap:20, alignItems:'flex-start', flexDirection:isMobile?'column':'row' }}>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ background:'linear-gradient(135deg,#1E3A2F 0%,#2D5241 60%,#3D6B53 100%)', borderRadius:16, padding:isMobile?'20px 18px':'22px 28px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap', boxShadow:'0 4px 20px rgba(30,58,47,0.18)' }}>
          <div>
            <p style={{ margin:'0 0 4px', fontSize:'0.7rem', color:'rgba(245,240,232,0.55)', letterSpacing:'0.05em', textTransform:'uppercase' }}>Administration</p>
            {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur "Bonjour, Admin" */}
            <h2 style={{ margin:'0 0 4px', fontFamily:"'DM Sans',sans-serif", fontSize:isMobile?'1.2rem':'1.35rem', fontWeight:700, color:'#F5F0E8' }}>Bonjour, Admin</h2>
            <p style={{ margin:0, fontSize:'0.78rem', color:'rgba(245,240,232,0.58)' }}>
              {loading ? '...' : pendingKyc > 0 ? `${pendingKyc} dossier${pendingKyc>1?'s':''} KYC en attente` : 'Aucune alerte active'}
            </p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ background:'rgba(245,240,232,0.08)', border:'1px solid rgba(245,240,232,0.12)', borderRadius:12, padding:'10px 16px', textAlign:'center' }}>
              <p style={{ margin:'0 0 2px', fontSize:'0.62rem', color:'rgba(245,240,232,0.45)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Revenus totaux</p>
              {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les revenus du bandeau */}
              <p style={{ margin:0, fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:C.goldText }}>{loading ? '...' : formatRevenu(totalRevenu)}</p>
            </div>
            {!isMobile && <div style={{ background:'rgba(184,151,42,0.15)', border:'1px solid rgba(184,151,42,0.25)', borderRadius:12, padding:'10px 16px', textAlign:'center' }}>
              <p style={{ margin:'0 0 2px', fontSize:'0.62rem', color:'rgba(245,240,232,0.45)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Investisseurs</p>
              {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
              <p style={{ margin:0, fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#F5F0E8' }}>{loading ? '...' : totalUsers}</p>
            </div>}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:14 }}>
          <KpiCard index={0} label="Revenus totaux" value={loading?'...':formatRevenu(totalRevenu)} sub="Depuis lancement" icon={<IcoCoin size={16}/>}  color={C.green}  bgColor="rgba(30,58,47,0.08)"  delta={null}/>
          <KpiCard index={1} label="Investisseurs"  value={loading?'...':totalUsers}  sub="Comptes actifs"  icon={<IcoUsers size={16}/>} color={C.gold}   bgColor="rgba(184,151,42,0.1)" delta={null}/>
          <KpiCard index={2} label="Transactions"   value={loading?'...':totalInv}    sub="Confirmées"     icon={<IcoChart size={16}/>} color={C.green2} bgColor="rgba(45,82,65,0.1)"   delta={null}/>
          <KpiCard index={3} label="KYC en attente" value={loading?'...':pendingKyc}  sub="À traiter"      icon={<IcoClock size={16}/>} color={pendingKyc>0?"#B02A37":C.green} bgColor={pendingKyc>0?C.redBg:"rgba(30,58,47,0.08)"} delta={null}/>
        </div>
        <RevenueChart data={revenue} loading={loading}/>
        <TransactionsTable isMobile={isMobile} items={txItems} loading={loading}/>
        {isMobile && <TerrainsOverview items={lands} loading={loading}/>}
        {isMobile && <KycQueue items={kycItems} loading={loading} onValidate={handleValidate} onReject={handleReject}/>}
      </div>
      {!isMobile && <div style={{ width:296, flexShrink:0, display:'flex', flexDirection:'column', gap:20 }}>
        <AlertsPanel stats={stats} loading={loading}/>
        <KycQueue items={kycItems} loading={loading} onValidate={handleValidate} onReject={handleReject}/>
        <TerrainsOverview items={lands} loading={loading}/>
      </div>}
    </div>
  )
}

// ═══════════════════════════════════════════════
// CONFIGS STATUTS
// ═══════════════════════════════════════════════
const KYC_STYLE   = { validated:{ bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'Validé'     }, pending:{ bg:'rgba(184,151,42,0.1)', color:'#8B6E1A', label:'En attente' }, rejected:{ bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'Rejeté'     } }
const USER_STATUS = { active:{ bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'Actif'    }, suspended:{ bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'Suspendu' } }
const TX_STATUS   = { confirmed:{ bg:'rgba(30,58,47,0.08)',  color:'#1E3A2F', label:'Confirmé'   }, pending:{ bg:'rgba(184,151,42,0.1)', color:'#8B6E1A', label:'En attente' }, failed:{ bg:'rgba(192,57,43,0.08)', color:'#C0392B', label:'Échoué'     }, refunded:{ bg:'rgba(100,116,139,0.08)', color:'#64748B', label:'Remboursé'  } }
const TX_METHOD   = { 'MTN MoMo':{ bg:'#FFCC00', color:'#1A1A1A' }, 'Moov Money':{ bg:'#0056A2', color:'#fff' }, 'Stripe':{ bg:'#635BFF', color:'#fff' }, 'Paystack':{ bg:'#00C3F7', color:'#fff' } }
const TERRAIN_STATUS = { published:{ bg:'rgba(30,58,47,0.08)', color:'#1E3A2F', label:'Publié' }, draft:{ bg:'rgba(184,151,42,0.1)', color:'#8B6E1A', label:'Brouillon' }, full:{ bg:'rgba(30,58,47,0.15)', color:'#1E3A2F', label:'Complet' }, archived:{ bg:'rgba(100,116,139,0.08)', color:'#64748B', label:'Archivé' } }

// ═══════════════════════════════════════════════
// USERS PAGE
// ═══════════════════════════════════════════════
function UsersPage() {
  const [search, setSearch]         = useState('')
  const [filterKyc, setFilterKyc]   = useState('all')
  const [filterStat, setFilterStat] = useState('all')
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await userApi.adminGetAll()
        setUsers(data.users.map(u => ({ id:u.id, ref:`USR-${String(u.id).padStart(3,'0')}`, name:u.full_name||`${u.first_name} ${u.last_name}`, email:u.email, country:u.country||'—', sqm:u.total_sqm||0, invested:u.total_invested||0, kyc:u.kyc_status||'none', status:u.status||'active', joined:u.created_at?new Date(u.created_at).toLocaleDateString('fr-FR'):'N/A' })))
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)||u.ref.toLowerCase().includes(q))
      && (filterKyc==='all'||u.kyc===filterKyc)
      && (filterStat==='all'||u.status===filterStat)
  })
  const toggleSuspend = id => setUsers(prev => prev.map(u => u.id===id?{...u, status:u.status==='active'?'suspended':'active'}:u))
  const iS = { border:'none', background:'transparent', fontSize:'0.78rem', color:'#4A3F35', outline:'none', width:'100%', fontFamily:"'DM Sans',sans-serif" }
  const sS = { padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)', background:'#fff', fontSize:'0.75rem', color:'#4A3F35', cursor:'pointer', outline:'none', fontFamily:"'DM Sans',sans-serif" }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur titres de pages */}
        <div><h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>Gestion des Utilisateurs</h2><p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{users.length} comptes enregistrés</p></div>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, background:'#1E3A2F', color:'#F5F0E8', border:'none', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}><IcoDownload size={14}/> Exporter CSV</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Total"       value={users.length}                                color="#1E3A2F"/>
        <AdminKpi label="KYC validés" value={users.filter(u=>u.kyc==='validated').length} color="#1E3A2F"/>
        <AdminKpi label="En attente"  value={users.filter(u=>u.kyc==='pending').length}   color="#8B6E1A"/>
        <AdminKpi label="Suspendus"   value={users.filter(u=>u.status==='suspended').length} color="#C0392B"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#fff', border:'1px solid rgba(30,58,47,0.12)', borderRadius:8, padding:'7px 12px', flex:1, minWidth:200 }}><span style={{ color:'#8C8278', display:'flex' }}><IcoSearch size={14}/></span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." style={iS}/></div>
        <select value={filterKyc} onChange={e=>setFilterKyc(e.target.value)} style={sS}><option value="all">Tous les KYC</option><option value="validated">KYC Validé</option><option value="pending">KYC En attente</option><option value="rejected">KYC Rejeté</option></select>
        <select value={filterStat} onChange={e=>setFilterStat(e.target.value)} style={sS}><option value="all">Tous les statuts</option><option value="active">Actif</option><option value="suspended">Suspendu</option></select>
      </div>
      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 10px rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.06)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#FAFAF7' }}>{['Réf.','Utilisateur','Pays','m²','Investi','KYC','Statut','Inscrit','Actions'].map(h => <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'0.62rem', fontWeight:700, color:'#8C8278', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(user => {
                const kyc  = KYC_STYLE[user.kyc]     || KYC_STYLE.pending
                const stat = USER_STATUS[user.status] || USER_STATUS.active
                return (
                  <tr key={user.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(245,240,232,0.5)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'} style={{ transition:'background 0.15s' }}>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#1E3A2F', fontWeight:600 }}>{user.ref}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:30, height:30, borderRadius:'50%', background:`hsl(${(user.id*47)%360},40%,35%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700, color:'#F5F0E8', flexShrink:0 }}>{user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><div><p style={{ fontSize:'0.78rem', fontWeight:600, color:'#1A1A1A', margin:'0 0 1px' }}>{user.name}</p><p style={{ fontSize:'0.65rem', color:'#8C8278', margin:0 }}>{user.email}</p></div></div></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.75rem', color:'#4A3F35' }}>{user.country}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A' }}>{user.sqm} m²</td>
                    {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les montants investis */}
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', fontWeight:700, color:'#1E3A2F' }}>{user.invested.toLocaleString('fr-FR')} F</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ padding:'3px 9px', borderRadius:20, background:kyc.bg, color:kyc.color, fontSize:'0.65rem', fontWeight:600, whiteSpace:'nowrap' }}>{kyc.label}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ padding:'3px 9px', borderRadius:20, background:stat.bg, color:stat.color, fontSize:'0.65rem', fontWeight:600 }}>{stat.label}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.7rem', color:'#8C8278', whiteSpace:'nowrap' }}>{user.joined}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><div style={{ display:'flex', gap:5 }}><IcoBtn icon={<IcoEye size={13}/>} title="Voir"/><IcoBtn icon={user.status==='active'?<IcoSuspend size={13}/>:<IcoActivate size={13}/>} title={user.status==='active'?'Suspendre':'Réactiver'} color={user.status==='active'?'#C0392B':'#1E3A2F'} bg={user.status==='active'?'rgba(192,57,43,0.08)':'rgba(30,58,47,0.08)'} onClick={() => toggleSuspend(user.id)}/></div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(30,58,47,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{filtered.length} sur {users.length} utilisateur(s)</p>
          <div style={{ display:'flex', gap:6 }}>{[{l:<IcoArrowL size={11}/>,v:'←'},{l:'1',v:'1'},{l:'2',v:'2'},{l:'3',v:'3'},{l:<IcoArrowR size={11}/>,v:'→'}].map((p,i) => <button key={i} style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(30,58,47,0.12)', background:p.v==='1'?'#1E3A2F':'#fff', color:p.v==='1'?'#F5F0E8':'#4A3F35', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center' }}>{p.l}</button>)}</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// TERRAINS PAGE
// ═══════════════════════════════════════════════
function TerrainsPage() {
  const [search,           setSearch]           = useState('')
  const [filter,           setFilter]           = useState('all')
  const [terrainsList,     setTerrainsList]     = useState([])
  const [showForm,         setShowForm]         = useState(false)
  const [loading,          setLoading]          = useState(true)
  const [valuationTerrain, setValuationTerrain] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await landsApi.adminGetAll()
        setTerrainsList(data.lands.map(t => ({
          id:        t.id,
          ref:       `TRN-${String(t.id).padStart(3,'0')}`,
          name:      t.title,
          city:      t.city,
          totalSqm:  t.total_sqm,
          soldSqm:   t.total_sqm - t.available_sqm,
          price:     parseFloat(t.price_per_sqm),
          status:    t.status,
          investors: t.investors_count || 0,
          revenue:   (t.total_sqm - t.available_sqm) * parseFloat(t.price_per_sqm),
          created:   t.created_at ? new Date(t.created_at).toLocaleDateString('fr-FR') : 'N/A',
        })))
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handlePublish = async (id) => {
    try {
      await landsApi.publish(id)
      setTerrainsList(prev => prev.map(t => t.id===id?{...t, status:'published'}:t))
    } catch { alert('Erreur publication.') }
  }

  const filtered = terrainsList.filter(t => {
    const q = search.toLowerCase()
    return (t.name.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || (t.ref||'').toLowerCase().includes(q))
      && (filter==='all' || t.status===filter)
  })

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <div><h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>Gestion des Terrains</h2><p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{terrainsList.length} terrains enregistrés</p></div>
        <button onClick={() => setShowForm(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, background:'#1E3A2F', color:'#F5F0E8', border:'none', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}><IcoPlus size={14}/> Nouveau terrain</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Total terrains"  value={terrainsList.length}                                   color="#1E3A2F"/>
        <AdminKpi label="Publiés"          value={terrainsList.filter(t=>t.status==='published').length} color="#1E3A2F"/>
        <AdminKpi label="m² total gérés"  value={terrainsList.reduce((s,t)=>s+t.totalSqm,0).toLocaleString()} color="#B8972A"/>
        <AdminKpi label="Revenus générés" value={formatRevenu(terrainsList.reduce((s,t)=>s+t.revenue,0))} color="#1E3A2F"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#fff', border:'1px solid rgba(30,58,47,0.12)', borderRadius:8, padding:'7px 12px', flex:1, minWidth:200 }}>
          <span style={{ color:'#8C8278', display:'flex' }}><IcoSearch size={14}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un terrain..." style={{ border:'none', background:'transparent', fontSize:'0.78rem', color:'#4A3F35', outline:'none', width:'100%', fontFamily:"'DM Sans',sans-serif" }}/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)', background:'#fff', fontSize:'0.75rem', color:'#4A3F35', cursor:'pointer', outline:'none', fontFamily:"'DM Sans',sans-serif" }}>
          <option value="all">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="full">Complets</option>
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px,1fr))', gap:14 }}>
        {filtered.map(terrain => {
          const progress = Math.round((terrain.soldSqm / terrain.totalSqm) * 100)
          const cfg = TERRAIN_STATUS[terrain.status] || TERRAIN_STATUS.draft
          return (
            <div key={terrain.id} style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 10px rgba(30,58,47,0.06)', border:'1px solid rgba(30,58,47,0.06)', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow='0 6px 24px rgba(30,58,47,0.12)'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow='0 2px 10px rgba(30,58,47,0.06)'; e.currentTarget.style.transform='translateY(0)' }}>
              <div style={{ height:90, background:'linear-gradient(135deg,#1E3A2F,#2D5241,#B8972A)', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'rgba(255,255,255,0.3)' }}><IcoTerrain size={42}/></span>
                <span style={{ position:'absolute', top:8, right:8, padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600, background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
                <span style={{ position:'absolute', bottom:8, left:8, padding:'2px 8px', borderRadius:20, fontSize:'0.6rem', fontWeight:700, background:'rgba(0,0,0,0.4)', color:'#F5F0E8' }}>
                  {terrain.price.toLocaleString('fr-FR')} F/m²
                </span>
              </div>
              <div style={{ padding:'14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontFamily:'monospace', fontSize:'0.65rem', color:'#8C8278', fontWeight:600 }}>{terrain.ref}</span>
                  <span style={{ fontSize:'0.65rem', color:'#8C8278', display:'flex', alignItems:'center', gap:3 }}><IcoPin size={11}/> {terrain.city}</span>
                </div>
                {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur le nom du terrain */}
                <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.88rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 10px' }}>{terrain.name}</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5, marginBottom:10 }}>
                  {[['m² total', terrain.totalSqm.toLocaleString()], ['Investisseurs', terrain.investors], ['Vendus', `${terrain.soldSqm} m²`]].map(([label, value]) => (
                    <div key={label} style={{ background:'#F5F0E8', borderRadius:7, padding:'5px 7px', textAlign:'center' }}>
                      <p style={{ fontSize:'0.56rem', color:'#8C8278', margin:'0 0 1px' }}>{label}</p>
                      <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.62rem', color:'#8C8278', marginBottom:4 }}>
                    <span>{terrain.soldSqm.toLocaleString()} m² vendus</span>
                    <span style={{ fontWeight:600, color:'#1E3A2F' }}>{progress}%</span>
                  </div>
                  <div style={{ height:5, background:'#EDE6D6', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:3, width:`${progress}%`, background:progress>=100?'linear-gradient(90deg,#B8972A,#D4AD3A)':'linear-gradient(90deg,#1E3A2F,#3D6B53)' }}/>
                  </div>
                </div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  <button onClick={() => navigate(`/terrains/${terrain.id}`)} style={{ flex:1, padding:'6px', borderRadius:8, border:'none', background:'rgba(30,58,47,0.07)', color:'#1E3A2F', fontSize:'0.7rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><IcoEye size={13}/> Voir</button>
                  <button style={{ flex:1, padding:'6px', borderRadius:8, border:'none', background:'rgba(30,58,47,0.07)', color:'#1E3A2F', fontSize:'0.7rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><IcoEdit size={13}/> Éditer</button>
                  {terrain.status === 'draft' && (
                    <button onClick={() => handlePublish(terrain.id)} style={{ flex:1, padding:'6px', borderRadius:8, border:'none', background:'#1E3A2F', color:'#F5F0E8', fontSize:'0.7rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><IcoPublish size={13}/> Publier</button>
                  )}
                  {(terrain.status === 'published' || terrain.status === 'full') && (
                    <button onClick={() => setValuationTerrain(terrain)} style={{ flex:'1 1 100%', padding:'7px', borderRadius:8, border:'1.5px solid rgba(184,151,42,0.3)', background:'rgba(184,151,42,0.08)', color:'#8B6E1A', fontSize:'0.7rem', fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                      <IcoTrend size={13}/> Nouvelle valorisation
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {showForm && (
        <TerrainWizard
          onClose={() => setShowForm(false)}
          onCreated={t => {
            setTerrainsList(prev => [{ id:t.id, ref:`TRN-${String(t.id).padStart(3,'0')}`, name:t.title, city:t.city, totalSqm:t.total_sqm, soldSqm:0, price:parseFloat(t.price_per_sqm), status:t.status, investors:0, revenue:0, created:new Date().toLocaleDateString('fr-FR') }, ...prev])
            setShowForm(false)
          }}
        />
      )}
      {valuationTerrain && (
        <ValuationModal
          terrain={valuationTerrain}
          onClose={() => setValuationTerrain(null)}
          onSuccess={data => {
            setTerrainsList(prev => prev.map(t =>
              t.id === valuationTerrain.id
                ? { ...t, price: parseFloat(data.valuation.estimated_value_per_sqm) }
                : t
            ))
            setValuationTerrain(null)
          }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// TRANSACTIONS PAGE
// ═══════════════════════════════════════════════
function TransactionsPage() {
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMethod, setFilterMethod] = useState('all')
  const [txList, setTxList]             = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await investmentsApi.adminGetAll()
        const METHOD = { mtn_momo:'MTN MoMo', moov_money:'Moov Money', stripe:'Stripe', paystack:'Paystack', simulation:'Simulation' }
        setTxList(data.investments.map(inv => ({ id:inv.id, ref:inv.reference, user:inv.investor?`${inv.investor.first_name} ${inv.investor.last_name}`:'N/A', terrain:inv.land?.title||'N/A', sqm:inv.sqm_bought, amount:parseFloat(inv.total_paid), method:METHOD[inv.payment_method]||METHOD[inv.payments?.[0]?.method]||'N/A', status:inv.status, date:inv.confirmed_at?new Date(inv.confirmed_at).toLocaleDateString('fr-FR'):'N/A', time:inv.confirmed_at?new Date(inv.confirmed_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'' })))
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = txList.filter(tx => {
    const q = search.toLowerCase()
    return (tx.ref.toLowerCase().includes(q)||tx.user.toLowerCase().includes(q)||tx.terrain.toLowerCase().includes(q))
      && (filterStatus==='all'||tx.status===filterStatus)
      && (filterMethod==='all'||tx.method===filterMethod)
  })
  const totalRevenue = txList.filter(tx=>tx.status==='confirmed').reduce((s,tx)=>s+tx.amount,0)
  const sS = { padding:'7px 12px', borderRadius:8, border:'1px solid rgba(30,58,47,0.12)', background:'#fff', fontSize:'0.75rem', color:'#4A3F35', cursor:'pointer', outline:'none', fontFamily:"'DM Sans',sans-serif" }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <div><h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>Gestion des Transactions</h2>
        <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{loading ? '...' : `${txList.length} transactions enregistrées`}</p></div>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:8, background:'#1E3A2F', color:'#F5F0E8', border:'none', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}><IcoDownload size={14}/> Exporter CSV</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="Revenus confirmés"  value={loading?'...':formatRevenu(totalRevenue)} color="#1E3A2F"/>
        <AdminKpi label="Total transactions" value={loading?'...':txList.length}              color="#1E3A2F"/>
        <AdminKpi label="En attente"         value={loading?'...':txList.filter(t=>t.status==='pending').length} color="#8B6E1A"/>
        <AdminKpi label="Échouées"           value={loading?'...':txList.filter(t=>t.status==='failed').length}  color="#C0392B"/>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'#fff', border:'1px solid rgba(30,58,47,0.12)', borderRadius:8, padding:'7px 12px', flex:1, minWidth:200 }}><span style={{ color:'#8C8278', display:'flex' }}><IcoSearch size={14}/></span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Réf., utilisateur, terrain..." style={{ border:'none', background:'transparent', fontSize:'0.78rem', color:'#4A3F35', outline:'none', width:'100%', fontFamily:"'DM Sans',sans-serif" }}/></div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={sS}><option value="all">Tous les statuts</option><option value="confirmed">Confirmé</option><option value="pending">En attente</option><option value="failed">Échoué</option><option value="refunded">Remboursé</option></select>
        <select value={filterMethod} onChange={e=>setFilterMethod(e.target.value)} style={sS}><option value="all">Tous les modes</option><option value="MTN MoMo">MTN MoMo</option><option value="Moov Money">Moov Money</option><option value="Stripe">Stripe</option><option value="Paystack">Paystack</option></select>
      </div>
      <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 10px rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.06)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#FAFAF7' }}>{['Réf.','Investisseur','Terrain','m²','Montant','Mode','Statut','Date','Actions'].map(h => <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:'0.62rem', fontWeight:700, color:'#8C8278', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid rgba(30,58,47,0.06)', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(tx => {
                const sc = TX_STATUS[tx.status] || TX_STATUS.pending
                const mc = TX_METHOD[tx.method] || { bg:'#E2E8F0', color:'#4A3F35' }
                return (
                  <tr key={tx.id} onMouseEnter={e=>e.currentTarget.style.background='rgba(245,240,232,0.5)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'} style={{ transition:'background 0.15s', cursor:'pointer' }}>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'#1E3A2F', fontWeight:600 }}>{tx.ref}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><div style={{ display:'flex', alignItems:'center', gap:7 }}><div style={{ width:28, height:28, borderRadius:'50%', background:`hsl(${(tx.id*53)%360},40%,35%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.58rem', fontWeight:700, color:'#F5F0E8', flexShrink:0 }}>{tx.user.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><span style={{ fontSize:'0.78rem', fontWeight:600, color:'#1A1A1A' }}>{tx.user}</span></div></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.75rem', color:'#4A3F35' }}>{tx.terrain}</td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)', fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A' }}>{tx.sqm} m²</td>
                    {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur les montants transactions */}
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.82rem', fontWeight:700, color:'#1E3A2F' }}>{tx.amount.toLocaleString('fr-FR')} F</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ padding:'3px 9px', borderRadius:5, fontSize:'0.62rem', fontWeight:800, background:mc.bg, color:mc.color }}>{tx.method}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.65rem', fontWeight:600, background:sc.bg, color:sc.color, whiteSpace:'nowrap' }}>{sc.label}</span></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><p style={{ fontSize:'0.7rem', color:'#4A3F35', margin:0, whiteSpace:'nowrap' }}>{tx.date}</p><p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>{tx.time}</p></td>
                    <td style={{ padding:'11px 14px', borderBottom:'1px solid rgba(30,58,47,0.04)' }}><div style={{ display:'flex', gap:5 }}><IcoBtn icon={<IcoEye size={13}/>} title="Voir détails"/>{tx.status==='pending'&&<IcoBtn icon={<IcoValidate size={13}/>} title="Valider"/>}{tx.status==='failed'&&<IcoBtn icon={<IcoAlert size={13}/>} title="Intervenir" color="#C0392B" bg="rgba(192,57,43,0.08)"/>}</div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(30,58,47,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{filtered.length} sur {txList.length} transaction(s)</p>
          <div style={{ display:'flex', gap:6 }}>{[{l:<IcoArrowL size={11}/>,v:'←'},{l:'1',v:'1'},{l:'2',v:'2'},{l:<IcoArrowR size={11}/>,v:'→'}].map((p,i) => <button key={i} style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(30,58,47,0.12)', background:p.v==='1'?'#1E3A2F':'#fff', color:p.v==='1'?'#F5F0E8':'#4A3F35', fontSize:'0.7rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center' }}>{p.l}</button>)}</div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// KYC PAGE
// ═══════════════════════════════════════════════
function KycPage() {
  const [filter, setFilter]           = useState('pending')
  const [dossiers, setDossiers]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [processing, setProcessing]   = useState(null)
  const [selected, setSelected]       = useState(null)
  const [rejectNote, setRejectNote]   = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [p,v,r] = await Promise.allSettled([kycApi.adminGetAll('pending'), kycApi.adminGetAll('validated'), kycApi.adminGetAll('rejected')])
        const all = [...(p.value?.data?.kycs||[]), ...(v.value?.data?.kycs||[]), ...(r.value?.data?.kycs||[])]
        setDossiers(all.map(d => ({ id:d.id, ref:`KYC-${String(d.id).padStart(3,'0')}`, name:d.user?.name||'Inconnu', email:d.user?.email||'—', country:d.user?.country||'—', type:d.document_label||d.document_type, submitted:d.created_at?new Date(d.created_at).toLocaleDateString('fr-FR'):'N/A', status:d.status, file_url:d.file_url })))
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const pending   = dossiers.filter(d=>d.status==='pending').length
  const validated = dossiers.filter(d=>d.status==='validated').length
  const rejected  = dossiers.filter(d=>d.status==='rejected').length
  const filtered  = filter==='all' ? dossiers : dossiers.filter(d=>d.status===filter)

  const handleValidate = async (id) => {
    setProcessing(id)
    try {
      await kycApi.adminValidate(id)
      setDossiers(p => p.map(d => d.id===id?{...d, status:'validated'}:d))
      if (selected?.id===id) setSelected(s => ({...s, status:'validated'}))
    } catch { alert('Erreur validation.') }
    finally { setProcessing(null) }
  }

  const handleReject = async (id) => {
    setProcessing(id)
    try {
      await kycApi.adminReject(id, rejectNote)
      setDossiers(p => p.map(d => d.id===id?{...d, status:'rejected'}:d))
      if (selected?.id===id) setSelected(s => ({...s, status:'rejected'}))
      setRejectNote('')
    } catch { alert('Erreur rejet.') }
    finally { setProcessing(null) }
  }

  return (
    <div>
      <div style={{ marginBottom:18 }}>
        {/* ✅ MODIFIÉ : Playfair Display → DM Sans */}
        <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>Gestion KYC</h2>
        <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{pending} dossier(s) en attente de validation</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        <AdminKpi label="En attente" value={pending}   color="#8B6E1A"/>
        <AdminKpi label="Validés"    value={validated} color="#1E3A2F"/>
        <AdminKpi label="Rejetés"    value={rejected}  color="#C0392B"/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>
        <div>
          <div style={{ display:'flex', background:'#fff', borderRadius:10, padding:4, gap:3, marginBottom:14, width:'fit-content', border:'1px solid rgba(30,58,47,0.08)' }}>
            {[{id:'pending',label:`En attente (${pending})`},{id:'validated',label:`Validés (${validated})`},{id:'rejected',label:`Rejetés (${rejected})`},{id:'all',label:'Tous'}].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{ padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', background:filter===tab.id?'#1E3A2F':'transparent', color:filter===tab.id?'#F5F0E8':'#8C8278', fontSize:'0.72rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s' }}>{tab.label}</button>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map(d => (
              <div key={d.id} onClick={() => setSelected(d)} style={{ background:selected?.id===d.id?'rgba(30,58,47,0.04)':'#fff', borderRadius:12, padding:'14px 16px', border:`1.5px solid ${selected?.id===d.id?'#1E3A2F':'rgba(30,58,47,0.07)'}`, cursor:'pointer', transition:'all 0.18s', display:'flex', alignItems:'center', gap:12 }}
                onMouseEnter={e=>{ if(selected?.id!==d.id) e.currentTarget.style.borderColor='rgba(30,58,47,0.2)' }}
                onMouseLeave={e=>{ if(selected?.id!==d.id) e.currentTarget.style.borderColor='rgba(30,58,47,0.07)' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background:`hsl(${(d.id*67)%360},40%,35%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:700, color:'#F5F0E8' }}>{d.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}><p style={{ fontSize:'0.8rem', fontWeight:600, color:'#1A1A1A', margin:0 }}>{d.name}</p><span style={{ fontFamily:'monospace', fontSize:'0.62rem', color:'#8C8278' }}>{d.ref}</span></div>
                  <p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{d.country} · {d.type} · {d.submitted}</p>
                </div>
                <span style={{ padding:'3px 9px', borderRadius:20, fontSize:'0.62rem', fontWeight:600, whiteSpace:'nowrap', background:d.status==='pending'?'rgba(184,151,42,0.1)':d.status==='validated'?'rgba(30,58,47,0.08)':'rgba(192,57,43,0.08)', color:d.status==='pending'?'#8B6E1A':d.status==='validated'?'#1E3A2F':'#C0392B', display:'flex', alignItems:'center', gap:4 }}>
                  {d.status==='pending' ? <><IcoClock size={10}/> Attente</> : d.status==='validated' ? <><IcoCheck size={10}/> Validé</> : <><IcoX size={10}/> Rejeté</>}
                </span>
              </div>
            ))}
          </div>
        </div>
        {selected ? (
          <div style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 4px 20px rgba(30,58,47,0.08)', border:'1px solid rgba(30,58,47,0.08)' }}>
            <div style={{ background:'linear-gradient(135deg,#1E3A2F,#2D5241)', padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <p style={{ fontSize:'0.6rem', color:'rgba(245,240,232,0.5)', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 3px' }}>Dossier KYC · {selected.ref}</p>
                {/* ✅ MODIFIÉ : Playfair Display → DM Sans sur le nom dans le panneau KYC */}
                <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'1rem', fontWeight:700, color:'#F5F0E8', margin:0 }}>{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'rgba(245,240,232,0.1)', border:'1px solid rgba(245,240,232,0.15)', borderRadius:7, width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(245,240,232,0.7)' }}><IcoClose size={13}/></button>
            </div>
            <div style={{ padding:16 }}>
              {[{label:'Email',value:selected.email},{label:'Pays',value:selected.country},{label:'Document',value:selected.type},{label:'Soumis',value:selected.submitted}].map(({label,value}) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', fontSize:'0.75rem', borderBottom:'1px solid rgba(30,58,47,0.05)' }}><span style={{ color:'#8C8278' }}>{label}</span><span style={{ fontWeight:600, color:'#1A1A1A', textAlign:'right', maxWidth:'60%' }}>{value}</span></div>
              ))}
              <div style={{ marginTop:14, background:'#F5F0E8', borderRadius:10, padding:20, textAlign:'center', border:'2px dashed rgba(30,58,47,0.15)' }}>
                <div style={{ margin:'0 auto 8px', width:48, height:48, borderRadius:12, background:'rgba(30,58,47,0.08)', display:'flex', alignItems:'center', justifyContent:'center', color:C.green }}><IcoId size={28}/></div>
                <p style={{ fontSize:'0.72rem', fontWeight:600, color:'#1E3A2F', margin:'0 0 2px' }}>{selected.type}</p>
                <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 12px' }}>Document uploadé</p>
                <button style={{ padding:'6px 14px', borderRadius:7, border:'none', background:'#1E3A2F', color:'#F5F0E8', fontSize:'0.7rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'inline-flex', alignItems:'center', gap:5 }}><IcoEye size={13}/> Voir le document</button>
              </div>
              {selected.status === 'pending' && (
                <div style={{ marginTop:14 }}>
                  <textarea value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Note de rejet (optionnel)..." rows={2} style={{ width:'100%', padding:'9px 12px', borderRadius:9, border:'1.5px solid rgba(30,58,47,0.15)', fontSize:'0.75rem', color:'#4A3F35', outline:'none', resize:'none', marginBottom:10, fontFamily:"'DM Sans',sans-serif", background:'rgba(245,240,232,0.4)', boxSizing:'border-box' }}/>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleReject(selected.id)} style={{ flex:1, padding:'9px', borderRadius:9, background:'rgba(192,57,43,0.08)', border:'1.5px solid rgba(192,57,43,0.2)', color:'#C0392B', fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><IcoX size={13}/> Rejeter</button>
                    <button onClick={() => handleValidate(selected.id)} style={{ flex:1, padding:'9px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#1E3A2F,#2D5241)', color:'#F5F0E8', fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><IcoCheck size={13}/> Valider</button>
                  </div>
                </div>
              )}
              {selected.status==='validated' && <div style={{ marginTop:14, background:'rgba(30,58,47,0.05)', border:'1px solid rgba(30,58,47,0.1)', borderRadius:10, padding:12, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><IcoSuccess size={15} style={{color:C.green}}/><p style={{ fontSize:'0.78rem', fontWeight:600, color:'#1E3A2F', margin:0 }}>KYC validé — Compte actif</p></div>}
              {selected.status==='rejected'  && <div style={{ marginTop:14, background:'rgba(192,57,43,0.05)', border:'1px solid rgba(192,57,43,0.12)', borderRadius:10, padding:12, textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><IcoReject size={15}/><p style={{ fontSize:'0.78rem', fontWeight:600, color:'#C0392B', margin:0 }}>KYC rejeté</p></div>}
            </div>
          </div>
        ) : (
          <div style={{ background:'#fff', borderRadius:14, padding:32, textAlign:'center', border:'1px solid rgba(30,58,47,0.06)' }}>
            <div style={{ margin:'0 auto 12px', width:48, height:48, borderRadius:'50%', background:'rgba(30,58,47,0.05)', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}><IcoBack size={22}/></div>
            <p style={{ fontSize:'0.8rem', color:'#8C8278', margin:0 }}>Sélectionnez un dossier pour voir les détails</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════
export default function AdminDashboard() {
  useFonts()
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveFromPath = (path) => {
    if (path==='/admin'||path==='/admin/') return 'dashboard'
    if (path.includes('/admin/utilisateurs')) return 'users'
    if (path.includes('/admin/terrains'))     return 'terrains'
    if (path.includes('/admin/transactions')) return 'transactions'
    if (path.includes('/admin/kyc'))          return 'kyc'
    if (path.includes('/admin/statistiques')) return 'stats'
    return 'dashboard'
  }

  const [active,     setActive]     = useState(() => getActiveFromPath(location.pathname))
  const [collapsed,  setCollapsed]  = useState(false)
  const [notifOpen,  setNotifOpen]  = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [badges, setBadges] = useState({})
  useEffect(() => {
    api.get('/admin/statistics').then(r => {
        const d = r.data
        setBadges({
          users:        d.total_users       || 0,
          kyc:          d.pending_kyc       || 0,
          transactions: d.total_investments || 0,
          terrains:     0,
        })
      })
      .catch(() => {})
  }, [])

  useEffect(() => { setActive(getActiveFromPath(location.pathname)) }, [location.pathname])

  const handleSetActive = (id) => {
    setActive(id)
    const paths = { dashboard:'/admin', users:'/admin/utilisateurs', terrains:'/admin/terrains', transactions:'/admin/transactions', kyc:'/admin/kyc', stats:'/admin/statistiques' }
    navigate(paths[id]||'/admin')
  }

  useEffect(() => {
    const close = () => setNotifOpen(false)
    if (notifOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [notifOpen])

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'DM Sans',sans-serif", background:C.bg }}>
      {!isMobile && <Sidebar active={active} setActive={handleSetActive} collapsed={collapsed} setCollapsed={setCollapsed} badges={badges}/>}
      {isMobile  && <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} active={active} setActive={handleSetActive} badges={badges}/>}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Topbar active={active} isMobile={isMobile} onMenuOpen={() => setDrawerOpen(true)} notifOpen={notifOpen} setNotifOpen={v => { if (v && typeof event!=='undefined') event.stopPropagation(); setNotifOpen(v) }} badges={badges}/>
        <main style={{ flex:1, overflow:'auto', padding:isMobile?'16px 14px 80px':'20px', background:C.bg }}>
          {active==='dashboard'    && <DashboardPage isMobile={isMobile}/>}
          {active==='users'        && <UsersPage/>}
          {active==='terrains'     && <TerrainsPage/>}
          {active==='transactions' && <TransactionsPage/>}
          {active==='kyc'          && <KycPage/>}
          {active==='stats'        && <StatsPage isMobile={isMobile}/>}
          {active==='statistiques' && <StatsPage isMobile={isMobile}/>}
        </main>
      </div>
      {isMobile && <BottomNav active={active} setActive={handleSetActive} badges={badges}/>}
      {/* ✅ SUPPRIMÉ : DevBar retirée — plus de barre de navigation dev en bas */}
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { width:5px; height:5px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(30,58,47,0.15); border-radius:3px; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
