import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import api from '../../api/axios'

// ─── Icônes SVG ───────────────────────────────────────────────────
const IcoCoin     = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
const IcoChart    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const IcoUsers    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
const IcoRuler    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12l10-10 10 10-10 10z"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
const IcoId       = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h3"/></svg>
const IcoTrend    = ({size=18}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IcoDownload = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const IcoWarning  = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcoBarEmpty = ({size=32}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
const IcoCredit   = ({size=32}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoMap      = ({size=32}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
const IcoIdLg     = ({size=32}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h3"/></svg>
const IcoInfo     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>

// ─── Format montants FCFA ──────────────────────────────────────────
function formatRevenu(v) {
  if (!v || v === 0) return '0 F'
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M F`
  if (v >= 100_000)   return `${(v / 1_000).toFixed(0)}K F`
  return `${Math.round(v).toLocaleString('fr-FR')} F`
}

// ─── Tooltip ──────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1E3A2F', borderRadius:9, padding:'8px 12px', boxShadow:'0 4px 16px rgba(0,0,0,0.2)', zIndex:999 }}>
      <p style={{ margin:'0 0 4px', fontSize:'0.65rem', color:'rgba(245,240,232,0.6)', fontWeight:600 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ margin:'2px 0', fontSize:'0.72rem', color:p.color||'#F5F0E8', fontWeight:600 }}>
          {p.name} : {typeof p.value==='number' && p.value>1000 ? formatRevenu(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── KPI card ──────────────────────────────────────────────────────
function StatKpi({ label, value, sub, icon, color='#1E3A2F', index, visible }) {
  return (
    <div style={{
      background:'#fff', borderRadius:13,
      border:'1px solid rgba(30,58,47,0.06)',
      padding:'14px 16px',
      boxShadow:'0 2px 10px rgba(30,58,47,0.05)',
      borderTop:`3px solid ${color}`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition:`opacity 0.4s ease ${index*0.07}s, transform 0.4s ease ${index*0.07}s`,
      minWidth: 0,
    }}>
      <div style={{ width:34, height:34, borderRadius:9, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, color }}>{icon}</div>
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color, margin:'0 0 3px', wordBreak:'break-word' }}>{value}</p>
      <p style={{ fontSize:'0.65rem', fontWeight:600, color:'#1A1A1A', margin:'0 0 2px' }}>{label}</p>
      <p style={{ fontSize:'0.6rem', color:'#8C8278', margin:0 }}>{sub}</p>
    </div>
  )
}

// ─── Carte graphique ───────────────────────────────────────────────
function ChartCard({ title, sub, children, action }) {
  return (
    <div style={{
      background:'#fff', borderRadius:14,
      border:'1px solid rgba(30,58,47,0.06)',
      padding:'16px 18px',
      boxShadow:'0 2px 10px rgba(30,58,47,0.05)',
      minWidth:0, overflow:'hidden',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:8 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.9rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>{title}</p>
          {sub && <p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>{sub}</p>}
        </div>
        {action && <div style={{ flexShrink:0 }}>{action}</div>}
      </div>
      {children}
    </div>
  )
}

// ─── Empty state ───────────────────────────────────────────────────
function EmptyChart({ height=180, icon, msg='Aucune donnée disponible' }) {
  return (
    <div style={{ height, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
      <span style={{ color:'#8C8278' }}>{icon}</span>
      <p style={{ fontSize:'0.72rem', color:'#8C8278', margin:0, textAlign:'center' }}>{msg}</p>
    </div>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────
function Sk({ h=16, r=8 }) {
  return <div style={{ height:h, borderRadius:r, background:'rgba(30,58,47,0.07)', animation:'pulse 1.4s ease infinite' }} />
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function StatsPage({ isMobile }) {
  const [visible,     setVisible]     = useState(false)
  const [periode,     setPeriode]     = useState('all')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [kpis,        setKpis]        = useState(null)
  const [revenue,     setRevenue]     = useState([])
  const [invStats,    setInvStats]    = useState([])
  const [lands,       setLands]       = useState([])
  const [kycs,        setKycs]        = useState([])
  const [methodsData, setMethodsData] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [kpisRes, revRes, invRes, landsRes] = await Promise.allSettled([
          api.get('/admin/statistics'),
          api.get('/admin/statistics/revenue'),
          api.get('/admin/statistics/investments'),
          api.get('/admin/lands'),
        ])
        if (kpisRes.status === 'fulfilled') setKpis(kpisRes.value.data)
        if (revRes.status  === 'fulfilled') setRevenue(revRes.value.data?.revenue || [])
        if (invRes.status  === 'fulfilled') setInvStats(invRes.value.data?.investments || [])
        if (landsRes.status=== 'fulfilled') setLands(landsRes.value.data?.lands || [])

        const [kp, kv, kr] = await Promise.allSettled([
          api.get('/admin/kyc?status=pending'),
          api.get('/admin/kyc?status=validated'),
          api.get('/admin/kyc?status=rejected'),
        ])
        setKycs([
          ...(kp.value?.data?.kycs||[]).map(k=>({...k,status:'pending'})),
          ...(kv.value?.data?.kycs||[]).map(k=>({...k,status:'validated'})),
          ...(kr.value?.data?.kycs||[]).map(k=>({...k,status:'rejected'})),
        ])
      } catch { setError('Impossible de charger les statistiques.') }
      finally  { setLoading(false); setTimeout(()=>setVisible(true),80) }
    }
    load()
  }, [])

  useEffect(() => {
    const loadMethods = async () => {
      try {
        const { data } = await api.get('/admin/investments')
        const counts = {}
        ;(data.investments||[]).forEach(inv => {
          const m = inv.payment_method || inv.payments?.[0]?.method || null
          if (m) counts[m] = (counts[m]||0) + 1
        })
        const total = Object.values(counts).reduce((s,v)=>s+v,0)
        if (!total) { setMethodsData([]); return }
        const LABELS = { mtn_momo:'MTN MoMo', moov_money:'Moov Money', stripe:'Stripe', paystack:'Paystack', simulation:'Simulation' }
        const COLORS = { mtn_momo:'#FFCC00', moov_money:'#0056A2', stripe:'#635BFF', paystack:'#00C3F7', simulation:'#27AE60' }
        setMethodsData(Object.entries(counts).map(([k,c])=>({ name:LABELS[k]||k, value:Math.round((c/total)*100), color:COLORS[k]||'#8C8278' })))
      } catch { setMethodsData([]) }
    }
    loadMethods()
  }, [])

  // ── Valeurs calculées ────────────────────────────────────────────
  const totalRevenu    = kpis?.total_revenue     || 0
  const totalInv       = kpis?.total_investments || 0
  const totalUsers     = kpis?.total_users       || 0
  const pendingKyc     = kpis?.pending_kyc       || 0
  const kycValides     = kycs.filter(k=>k.status==='validated').length
  const kycTotal       = kycs.length
  const tauxValidation = kycTotal > 0 ? Math.round((kycValides/kycTotal)*100) : 0
  const panierMoyen    = totalInv > 0 ? Math.round(totalRevenu/totalInv) : 0
  const totalSqmVendus = lands.reduce((s,t)=>s+((t.total_sqm||0)-(t.available_sqm||0)),0)
  const filteredRevenue = periode==='3m' ? revenue.slice(-3) : periode==='6m' ? revenue.slice(-6) : revenue
  const terrainsPerf   = lands.map(t=>({
    name:     t.title,
    sqm:      (t.total_sqm||0)-(t.available_sqm||0),
    revenue:  ((t.total_sqm||0)-(t.available_sqm||0))*parseFloat(t.price_per_sqm||0),
    investors: t.investors_count||0,
    progress:  t.funding_progress||0,
  }))

  // ── KPIs avec icônes SVG ─────────────────────────────────────────
  const KPIS = [
    { icon:<IcoCoin  size={17}/>, label:'Revenus totaux', value:formatRevenu(totalRevenu), sub:'Transactions confirmées', color:'#1E3A2F' },
    { icon:<IcoChart size={17}/>, label:'Transactions',   value:totalInv,                  sub:'Investissements validés', color:'#2D5241' },
    { icon:<IcoUsers size={17}/>, label:'Investisseurs',  value:totalUsers,                sub:'Comptes investisseurs',   color:'#1E3A2F' },
    { icon:<IcoRuler size={17}/>, label:'m² vendus',      value:`${totalSqmVendus.toLocaleString('fr-FR')} m²`, sub:`${lands.length} terrain${lands.length>1?'s':''}`, color:'#B8972A' },
    { icon:<IcoId    size={17}/>, label:'KYC validés',    value:kycTotal>0?`${kycValides}/${kycTotal}`:'0/0', sub:`Taux : ${tauxValidation}%`, color:'#3D6B53' },
    { icon:<IcoTrend size={17}/>, label:'Panier moyen',   value:formatRevenu(panierMoyen), sub:'Par transaction',          color:'#1E3A2F' },
  ]

  const H_AREA = isMobile ? 160 : 220
  const H_BAR  = isMobile ? 160 : 190
  const H_HBAR = isMobile ? 160 : 200

  return (
    <div style={{ opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(10px)', transition:'opacity 0.4s ease,transform 0.4s ease', minWidth:0, width:'100%' }}>

      {/* ── Bandeau titre ─────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#1E3A2F 0%,#2D5241 60%,#3D6B53 100%)', borderRadius:16, padding:isMobile?'18px 16px':'20px 24px', marginBottom:20, boxShadow:'0 4px 20px rgba(30,58,47,0.2)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <p style={{ margin:'0 0 3px', fontSize:'0.62rem', color:'rgba(245,240,232,0.5)', letterSpacing:'0.07em', textTransform:'uppercase' }}>Tableau de bord analytique</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:isMobile?'1.1rem':'1.3rem', fontWeight:700, color:'#F5F0E8', margin:'0 0 4px' }}>Statistiques & Rapports</h2>
            <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.55)', margin:0 }}>
              {loading ? 'Chargement...' : `${totalInv} transaction${totalInv>1?'s':''} · ${totalUsers} investisseur${totalUsers>1?'s':''} · LandShare Bénin`}
            </p>
          </div>
          {!isMobile && (
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:10, background:'rgba(245,240,232,0.12)', border:'1px solid rgba(245,240,232,0.18)', color:'#F5F0E8', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              <IcoDownload size={14}/> Exporter le rapport
            </button>
          )}
        </div>
      </div>

      {/* ── Erreur ────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background:'rgba(192,57,43,0.07)', border:'1px solid rgba(192,57,43,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', gap:8, alignItems:'flex-start' }}>
          <span style={{ color:'#C0392B', flexShrink:0, marginTop:1 }}><IcoWarning size={15}/></span>
          <p style={{ fontSize:'0.75rem', color:'#C0392B', margin:0 }}>{error}</p>
        </div>
      )}

      {/* ── KPIs ──────────────────────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:isMobile?10:14, marginBottom:20 }}>
        {loading
          ? [1,2,3,4,5,6].map(i=><Sk key={i} h={110} r={13}/>)
          : KPIS.map((kpi,i)=><StatKpi key={i} {...kpi} index={i} visible={visible}/>)
        }
      </div>

      {/* ── Évolution des revenus ─────────────────────────────────── */}
      <div style={{ marginBottom:16 }}>
        <ChartCard
          title="Évolution des revenus"
          sub="Revenus mensuels confirmés"
          action={revenue.length>0 ? (
            <div style={{ display:'flex', background:'rgba(30,58,47,0.06)', borderRadius:8, padding:3, gap:2 }}>
              {[{id:'3m',label:'3M'},{id:'6m',label:'6M'},{id:'all',label:'Tout'}].map(b=>(
                <button key={b.id} onClick={()=>setPeriode(b.id)} style={{ padding:'4px 8px', borderRadius:6, border:'none', cursor:'pointer', background:periode===b.id?'#1E3A2F':'transparent', color:periode===b.id?'#F5F0E8':'#8C8278', fontSize:'0.65rem', fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{b.label}</button>
              ))}
            </div>
          ) : null}
        >
          {loading ? <Sk h={H_AREA} r={8}/> : filteredRevenue.length===0 ? (
            <EmptyChart height={H_AREA} icon={<IcoBarEmpty size={32}/>} msg="Aucun revenu enregistré pour le moment"/>
          ) : (
            <ResponsiveContainer width="100%" height={H_AREA}>
              <AreaChart data={filteredRevenue} margin={{ top:4, right:4, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1E3A2F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1E3A2F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#8C8278' }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="revenue" name="Revenus" stroke="#1E3A2F" strokeWidth={2.5} fill="url(#gradRevenue)"/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Transactions + Modes paiement ─────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16, marginBottom:16 }}>

        <ChartCard title="Transactions par mois" sub="Nombre d'investissements confirmés">
          {loading ? <Sk h={H_BAR} r={8}/> : invStats.length===0 ? (
            <EmptyChart height={H_BAR} icon={<IcoBarEmpty size={32}/>} msg="Aucune transaction pour le moment"/>
          ) : (
            <ResponsiveContainer width="100%" height={H_BAR}>
              <BarChart data={invStats} margin={{ top:4, right:4, left:0, bottom:0 }}>
                <XAxis dataKey="month" tick={{ fontSize:10, fill:'#8C8278' }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="count" name="Transactions" fill="#1E3A2F" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Modes de paiement" sub="Répartition des transactions">
          {loading ? <Sk h={H_BAR} r={8}/> : methodsData.length===0 ? (
            <EmptyChart height={H_BAR} icon={<IcoCredit size={32}/>} msg="Aucun paiement enregistré"/>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flexShrink:0 }}>
                <ResponsiveContainer width={isMobile?120:160} height={isMobile?120:160}>
                  <PieChart>
                    <Pie data={methodsData} cx="50%" cy="50%" innerRadius={isMobile?28:40} outerRadius={isMobile?48:65} dataKey="value" strokeWidth={0}>
                      {methodsData.map((m,i)=><Cell key={i} fill={m.color}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                {methodsData.map(m=>(
                  <div key={m.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:10, height:10, borderRadius:3, background:m.color, flexShrink:0 }}/>
                      <span style={{ fontSize:'0.68rem', color:'#4A3F35' }}>{m.name}</span>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#1E3A2F' }}>{m.value}%</span>
                      <div style={{ height:4, width:60, background:'rgba(30,58,47,0.08)', borderRadius:99, marginTop:3 }}>
                        <div style={{ height:'100%', width:`${m.value}%`, background:m.color, borderRadius:99 }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* ── Performance terrains + KYC ───────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16, marginBottom:16 }}>

        <ChartCard title="Performance des terrains" sub="Financement & revenus estimés">
          {loading ? <Sk h={200} r={8}/> : terrainsPerf.length===0 ? (
            <EmptyChart height={200} icon={<IcoMap size={32}/>} msg="Aucun terrain créé pour le moment"/>
          ) : terrainsPerf.map((t,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#1A1A1A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%' }}>{t.name}</span>
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:t.progress>=90?'#B8972A':'#1E3A2F' }}>{t.progress}%</span>
              </div>
              <div style={{ height:6, background:'rgba(30,58,47,0.08)', borderRadius:99, overflow:'hidden', marginBottom:5 }}>
                <div style={{ height:'100%', borderRadius:99, width:`${t.progress}%`, background:t.progress>=90?'linear-gradient(90deg,#B8972A,#D4AD3A)':'linear-gradient(90deg,#1E3A2F,#3D6B53)', transition:'width 0.8s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:'0.62rem', color:'#8C8278' }}>{t.sqm.toLocaleString('fr-FR')} m² · {t.investors} invest.</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.72rem', fontWeight:700, color:'#1E3A2F' }}>{formatRevenu(t.revenue)}</span>
              </div>
            </div>
          ))}
        </ChartCard>

        <ChartCard title="Activité KYC" sub="Statuts des dossiers soumis">
          {loading ? <Sk h={200} r={8}/> : kycTotal===0 ? (
            <EmptyChart height={200} icon={<IcoIdLg size={32}/>} msg="Aucun dossier KYC soumis pour le moment"/>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
                {[
                  { label:'En attente', value:pendingKyc,                                   color:'#8B6E1A', bg:'rgba(184,151,42,0.1)' },
                  { label:'Validés',    value:kycs.filter(k=>k.status==='validated').length, color:'#1E3A2F', bg:'rgba(30,58,47,0.08)'  },
                  { label:'Rejetés',    value:kycs.filter(k=>k.status==='rejected').length,  color:'#C0392B', bg:'rgba(192,57,43,0.08)' },
                ].map(({label,value,color,bg})=>(
                  <div key={label} style={{ background:bg, borderRadius:10, padding:'10px', textAlign:'center' }}>
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:700, color, margin:'0 0 2px' }}>{value}</p>
                    <p style={{ fontSize:'0.6rem', color:'#6B6459', margin:0 }}>{label}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding:'10px 12px', background:'rgba(30,58,47,0.04)', border:'1px solid rgba(30,58,47,0.08)', borderRadius:9, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.68rem', color:'#6B6459' }}>Taux de validation global</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.95rem', fontWeight:700, color:'#1E3A2F' }}>{tauxValidation}%</span>
              </div>
            </>
          )}
        </ChartCard>
      </div>

      {/* ── Revenus par terrain ──────────────────────────────────── */}
      <ChartCard title="Revenus estimés par terrain" sub="Comparaison des performances financières">
        {loading ? <Sk h={H_HBAR} r={8}/> : terrainsPerf.length===0 ? (
          <EmptyChart height={H_HBAR} icon={<IcoMap size={32}/>} msg="Aucun terrain créé pour le moment"/>
        ) : (
          <ResponsiveContainer width="100%" height={H_HBAR}>
            <BarChart data={terrainsPerf} layout="vertical" margin={{ top:4, right:16, left:isMobile?50:80, bottom:0 }}>
              <XAxis type="number" hide/>
              <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:'#8C8278' }} axisLine={false} tickLine={false} width={isMobile?48:75}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="revenue" name="Revenus" fill="#1E3A2F" radius={[0,6,6,0]}>
                {terrainsPerf.map((_,i)=><Cell key={i} fill={['#1E3A2F','#B8972A','#3D6B53','#2D5241'][i%4]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* ── Note ─────────────────────────────────────────────────── */}
      <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(30,58,47,0.04)', border:'1px solid rgba(30,58,47,0.08)', borderRadius:10, display:'flex', alignItems:'flex-start', gap:8 }}>
        <span style={{ flexShrink:0, color:'#8C8278', marginTop:1 }}><IcoInfo size={14}/></span>
        <p style={{ fontSize:'0.62rem', color:'#6B6459', margin:0, lineHeight:1.5 }}>
          Toutes les données sont calculées en temps réel depuis la base de données LandShare Bénin.
          Les revenus incluent les commissions (3%) sur chaque transaction confirmée.
        </p>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  )
}