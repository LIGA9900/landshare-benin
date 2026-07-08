// ═══════════════════════════════════════════════════════════════════
// Landing.jsx — LandShare Bénin · ✅ Responsive Mobile
// ✅ Section FAQ ajoutée
// ✅ Lien "Vérifier un investissement" dans le footer
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useIsMobile() {
  const [v, set] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const h = () => set(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

// ═══════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:72, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 5vw', background: scrolled?'rgba(245,240,232,0.94)':'transparent', backdropFilter: scrolled?'blur(20px)':'none', borderBottom: scrolled?'1px solid rgba(184,151,42,0.15)':'1px solid transparent', boxShadow: scrolled?'0 4px 32px rgba(30,58,47,0.08)':'none', transition:'all 0.35s cubic-bezier(.4,0,.2,1)' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:38, height:38, background:'#1E3A2F', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(30,58,47,0.3)' }}>
            <div style={{ width:16, height:16, background:'#B8972A', clipPath:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>
          <span style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.2rem', fontWeight:700, color: scrolled?'#1A1A1A':'#1E3A2F', letterSpacing:'-0.02em' }}>
            Land<span style={{ color:'#B8972A' }}>Share</span>
          </span>
        </Link>

        <div style={{ display:'flex', gap:'2.5rem', alignItems:'center' }} className="ls-hidden-m">
          {[['Terrains','#terrains'],['Comment ça marche','#comment'],['Témoignages','#temoignages'],['FAQ','#faq']].map(([l,h]) => (
            <a key={l} href={h} style={{ textDecoration:'none', fontSize:'0.875rem', fontWeight:500, color: scrolled?'#6B6459':'#2D5241', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#1E3A2F'} onMouseLeave={e => e.target.style.color=scrolled?'#6B6459':'#2D5241'}>{l}</a>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center' }} className="ls-hidden-m">
          <Link to="/connexion" style={{ padding:'9px 20px', borderRadius:50, border:'1.5px solid rgba(30,58,47,0.25)', color:'#1E3A2F', textDecoration:'none', fontSize:'0.875rem', fontWeight:500, transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(30,58,47,0.06)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            Connexion
          </Link>
          <Link to="/inscription" style={{ padding:'10px 22px', borderRadius:50, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontSize:'0.875rem', fontWeight:500, boxShadow:'0 4px 14px rgba(30,58,47,0.3)', transition:'all 0.2s', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e => { e.currentTarget.style.background='#2D5241'; e.currentTarget.style.transform='translateY(-1px)' }} onMouseLeave={e => { e.currentTarget.style.background='#1E3A2F'; e.currentTarget.style.transform='translateY(0)' }}>
            Investir maintenant →
          </Link>
        </div>

        <button style={{ background:'none', border:'none', cursor:'pointer', padding:8 }} className="ls-show-m" onClick={() => setMenuOpen(!menuOpen)}>
          <div style={{ width:22, height:2, background:'#1E3A2F', marginBottom:5, transition:'all 0.2s', transform: menuOpen?'rotate(45deg) translate(5px,5px)':'none' }} />
          <div style={{ width:22, height:2, background:'#1E3A2F', marginBottom:5, opacity: menuOpen?0:1, transition:'opacity 0.2s' }} />
          <div style={{ width:22, height:2, background:'#1E3A2F', transition:'all 0.2s', transform: menuOpen?'rotate(-45deg) translate(5px,-5px)':'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(245,240,232,0.97)', backdropFilter:'blur(20px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1.5rem' }}>
          {['Terrains','Comment ça marche','Témoignages','FAQ'].map(l => (
            <a key={l} href="#" onClick={() => setMenuOpen(false)} style={{ fontSize:'1.5rem', fontWeight:600, color:'#1E3A2F', textDecoration:'none', fontFamily:"'Playfair Display', serif" }}>{l}</a>
          ))}
          <div style={{ height:1, width:60, background:'rgba(184,151,42,0.3)', margin:'0.5rem 0' }} />
          <Link to="/connexion" onClick={() => setMenuOpen(false)} style={{ padding:'12px 32px', borderRadius:50, border:'1.5px solid #1E3A2F', color:'#1E3A2F', textDecoration:'none', fontWeight:500, minHeight:50, display:'flex', alignItems:'center' }}>Connexion</Link>
          <Link to="/inscription" onClick={() => setMenuOpen(false)} style={{ padding:'13px 36px', borderRadius:50, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontWeight:600, minHeight:50, display:'flex', alignItems:'center' }}>Investir maintenant →</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .ls-hidden-m { display: none !important; } .ls-show-m { display: block !important; } }
        @media (min-width: 769px) { .ls-show-m { display: none !important; } }
      `}</style>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════
function Hero() {
  const isMobile = useIsMobile()
  const tickers = [
    "🟢 Adeola K. · Paris · 5 m² — Calavi Nord",
    "🟢 Malick F. · Cotonou · 10 m² — Fidjrossè",
    "🟢 Sylvie B. · Montréal · 3 m² — Parakou",
    "🟢 Jean P. · Lyon · 8 m² — Calavi Nord",
    "🟢 Fatima D. · Amsterdam · 2 m² — Fidjrossè",
  ]
  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerFade, setTickerFade] = useState(true)
  useEffect(() => {
    const i = setInterval(() => {
      setTickerFade(false)
      setTimeout(() => { setTickerIdx(n => (n + 1) % tickers.length); setTickerFade(true) }, 300)
    }, 3500)
    return () => clearInterval(i)
  }, [])

  return (
    <section style={{ minHeight:'100vh', background:'linear-gradient(160deg, #F5F0E8 0%, #EDE6D6 40%, #E8EFE9 100%)', position:'relative', overflow:'hidden', display: isMobile?'flex':'grid', flexDirection: isMobile?'column':undefined, gridTemplateColumns: isMobile?undefined:'1fr 1fr', paddingTop:72 }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, backgroundImage:`radial-gradient(ellipse 70% 50% at 80% 40%, rgba(30,58,47,0.06) 0%, transparent 70%)` }} />

      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile?'32px 20px 24px':'clamp(40px,8vh,80px) clamp(24px,5vw,60px) clamp(40px,8vh,80px) clamp(24px,8vw,100px)', position:'relative', zIndex:2 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(184,151,42,0.1)', border:'1px solid rgba(184,151,42,0.28)', borderRadius:50, padding:'7px 16px', fontSize:'0.7rem', fontWeight:500, color:'#8B6E1A', letterSpacing:'0.07em', textTransform:'uppercase', width:'fit-content', marginBottom:'1.5rem', animation:'fadeUp 0.7s ease both' }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#B8972A', animation:'pulse 2s ease infinite' }} />
          Plateforme certifiée OHADA · Bénin
        </div>

        <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'clamp(2rem,7vw,2.8rem)':'clamp(2.6rem,4.5vw,4.2rem)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.03em', color:'#1A1A1A', marginBottom:'1.2rem', animation:'fadeUp 0.7s ease 0.1s both' }}>
          Devenez propriétaire<br />d'un terrain{' '}
          <span style={{ color:'#1E3A2F', position:'relative', display:'inline-block' }}>
            béninois
            <svg style={{ position:'absolute', bottom:-4, left:0, right:0, width:'100%', height:6, overflow:'visible' }} viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0,5 Q25,0 50,4 Q75,8 100,3" stroke="#B8972A" strokeWidth="2.5" fill="none" strokeLinecap="round"
                style={{ strokeDasharray:120, strokeDashoffset:120, animation:'drawLine 0.8s ease 0.9s forwards' }} />
            </svg>
          </span>
          <br />dès 5 000 FCFA
        </h1>

        <p style={{ fontSize: isMobile?'0.9rem':'1.05rem', lineHeight:1.75, color:'#6B6459', fontWeight:300, maxWidth:500, marginBottom:'2rem', animation:'fadeUp 0.7s ease 0.2s both' }}>
          LandShare rend l'investissement foncier accessible à <strong style={{ color:'#1E3A2F', fontWeight:600 }}>tous les Béninois</strong>, en Afrique comme dans la diaspora.
        </p>

        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap', marginBottom:'2rem', animation:'fadeUp 0.7s ease 0.3s both' }}>
          <Link to="/inscription" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontSize: isMobile?'1rem':'0.95rem', fontWeight:500, padding: isMobile?'15px 28px':'14px 30px', borderRadius:50, boxShadow:'0 6px 20px rgba(30,58,47,0.28)', transition:'all 0.2s', minHeight: isMobile?50:'auto' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#2D5241' }} onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#1E3A2F' }}>
            Commencer gratuitement →
          </Link>
          <a href="#terrains" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#1A1A1A', textDecoration:'none', fontSize:'0.95rem', fontWeight:500, padding: isMobile?'14px 22px':'13px 24px', borderRadius:50, border:'1.5px solid rgba(26,26,26,0.18)', transition:'all 0.2s', minHeight: isMobile?50:'auto' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#1E3A2F'; e.currentTarget.style.background='rgba(30,58,47,0.05)' }} onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(26,26,26,0.18)'; e.currentTarget.style.background='transparent' }}>
            Voir les terrains ↓
          </a>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem', animation:'fadeUp 0.7s ease 0.4s both', flexWrap:'wrap' }}>
          <div style={{ display:'flex' }}>
            {['AK','MF','SB','JP','+'].map((ini, i) => (
              <div key={i} style={{ width:34, height:34, borderRadius:'50%', border:'2.5px solid #F5F0E8', marginLeft: i===0?0:-9, background:['#1E3A2F','#2D5241','#3D6B53','#B8972A','#6B6459'][i], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.62rem', fontWeight:700, color:'#F5F0E8', zIndex:5-i }}>{ini}</div>
            ))}
          </div>
          <div>
            <div style={{ display:'flex', gap:2, marginBottom:2 }}>
              {[1,2,3,4,5].map(s => <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#B8972A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
            </div>
            <p style={{ fontSize:'0.75rem', color:'#6B6459', margin:0 }}><strong style={{ color:'#1A1A1A' }}>1 200+</strong> investisseurs font confiance à LandShare</p>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: isMobile?'0 20px 32px':'clamp(40px,8vh,80px) clamp(24px,6vw,80px) clamp(40px,8vh,80px) 0', position:'relative', zIndex:2 }}>
        <div style={{ position:'relative', width:'100%', maxWidth: isMobile?380:440 }}>
          <div style={{ background:'#FFFFFF', borderRadius:24, padding: isMobile?20:28, boxShadow:'0 24px 60px rgba(30,58,47,0.14)', border:'1px solid rgba(184,151,42,0.1)', animation: isMobile?'none':'floatCard 6s ease-in-out infinite' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <p style={{ fontSize:'0.65rem', color:'#8C8278', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:3 }}>Terrain pilote · MVP</p>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'0.92rem':'1.1rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Calavi Nord — Zone Résidentielle</h3>
              </div>
              <span style={{ padding:'3px 10px', borderRadius:50, fontSize:'0.65rem', fontWeight:600, background:'rgba(30,58,47,0.08)', color:'#1E3A2F', border:'1px solid rgba(30,58,47,0.15)', whiteSpace:'nowrap', flexShrink:0, marginLeft:8 }}>🟢 Disponible</span>
            </div>
            <div style={{ width:'100%', height: isMobile?130:160, borderRadius:14, background:'linear-gradient(135deg, #1E3A2F 0%, #2D5241 50%, #3D6B53 100%)', position:'relative', overflow:'hidden', marginBottom:14 }}>
              <div style={{ position:'absolute', inset:0, opacity:0.15, backgroundImage:`linear-gradient(rgba(245,240,232,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,.6) 1px, transparent 1px)`, backgroundSize:'28px 28px' }} />
              <div style={{ position:'absolute', top:'50%', left:'55%', transform:'translate(-50%,-50%)' }}>
                <div style={{ width:32, height:32, borderRadius:'50% 50% 50% 0', background:'#B8972A', transform:'rotate(-45deg)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(184,151,42,0.5)', animation:'mapPulse 2s ease infinite' }}>
                  <div style={{ transform:'rotate(45deg)', fontSize:12 }}>📍</div>
                </div>
              </div>
              <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', background:'rgba(255,255,255,0.95)', padding:'4px 12px', borderRadius:7, fontSize:'0.68rem', fontWeight:600, color:'#1A1A1A', whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
                📍 Abomey-Calavi, Bénin
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
              {[['Prix / m²','15 000','FCFA'],['Disponible','155','m²'],['Rendement','14','%/an']].map(([l,v,u]) => (
                <div key={l} style={{ background:'#F5F0E8', borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
                  <p style={{ fontSize:'0.6rem', color:'#8C8278', marginBottom:1 }}>{l}</p>
                  <p style={{ fontFamily:"'Playfair Display', serif", fontSize:'0.9rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{v}<span style={{ fontSize:'0.6rem', color:'#8C8278', marginLeft:2 }}>{u}</span></p>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'#8C8278', marginBottom:5 }}>
                <span>1 700 m² vendus · 68% financé</span><span style={{ fontWeight:600, color:'#1E3A2F' }}>68%</span>
              </div>
              <div style={{ height:7, background:'#EDE6D6', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:'68%', borderRadius:4, background:'linear-gradient(90deg, #1E3A2F, #3D6B53)' }} />
              </div>
            </div>
            <Link to="/inscription" style={{ display:'block', width:'100%', padding:'12px', borderRadius:50, textAlign:'center', background:'linear-gradient(135deg, #1E3A2F, #2D5241)', color:'#F5F0E8', textDecoration:'none', fontWeight:600, fontSize:'0.88rem', boxShadow:'0 4px 16px rgba(30,58,47,0.25)' }}>
              Investir dans ce terrain →
            </Link>
          </div>
          {!isMobile && <>
            <div style={{ position:'absolute', top:-16, right:-16, background:'#FFFFFF', borderRadius:16, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', border:'1px solid rgba(184,151,42,0.12)', display:'flex', alignItems:'center', gap:8, animation:'floatBadge1 5s ease-in-out infinite' }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(30,58,47,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem' }}>🏅</div>
              <div><p style={{ fontSize:'0.68rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Vérifié</p><p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>Me Akobi · Notaire</p></div>
            </div>
            <div style={{ position:'absolute', bottom:-16, left:-16, background:'#FFFFFF', borderRadius:16, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', border:'1px solid rgba(184,151,42,0.12)', display:'flex', alignItems:'center', gap:8, animation:'floatBadge2 4s ease-in-out 1s infinite' }}>
              <span style={{ fontSize:'1.2rem' }}>📱</span>
              <div><p style={{ fontSize:'0.68rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>MTN MoMo</p><p style={{ fontSize:'0.62rem', color:'#8C8278', margin:0 }}>Paiement accepté ✓</p></div>
            </div>
          </>}
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(30,58,47,0.04)', borderTop:'1px solid rgba(184,151,42,0.12)', padding:'9px 5vw', display:'flex', alignItems:'center', gap:10, zIndex:3, overflow:'hidden' }}>
        <span style={{ fontSize:'0.68rem', fontWeight:700, color:'#1E3A2F', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>🔴 Live</span>
        <div style={{ width:1, height:14, background:'rgba(184,151,42,0.3)', flexShrink:0 }} />
        <p style={{ fontSize:'0.78rem', color:'#6B6459', margin:0, opacity: tickerFade?1:0, transition:'opacity 0.3s ease', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tickers[tickerIdx]}</p>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.7)} }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes floatBadge1 { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-6px) rotate(0)} }
        @keyframes floatBadge2 { 0%,100%{transform:translateY(0) rotate(1deg)} 50%{transform:translateY(-5px) rotate(-1deg)} }
        @keyframes mapPulse { 0%,100%{box-shadow:0 4px 16px rgba(184,151,42,0.5)} 50%{box-shadow:0 4px 28px rgba(184,151,42,0.8)} }
      `}</style>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// STATS BAND
// ═══════════════════════════════════════════════════════════════════
function StatsBand() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.5)
  const c1 = useCountUp(3200, 2200, inView), c2 = useCountUp(48, 1800, inView)
  const c3 = useCountUp(1200, 2500, inView), c4 = useCountUp(100, 1500, inView)
  const stats = [['m²','Superficie totale gérée',c1],['+','Terrains disponibles',c2],['+','Investisseurs actifs',c3],['%','Documents sécurisés',c4]]
  return (
    <div ref={ref} style={{ background:'#1E3A2F', padding:'2.5rem 5vw' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:'1rem' }}>
        {stats.map(([suffix, label, val], i) => (
          <div key={i} style={{ textAlign:'center', padding:'1rem', borderRight: !isMobile&&i<3?'1px solid rgba(245,240,232,0.1)':'none' }}>
            <p style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.6rem':'clamp(1.8rem,2.5vw,2.6rem)', fontWeight:700, color:'#D4AD3A', margin:'0 0 4px' }}>
              {val.toLocaleString()}<span style={{ fontSize:'0.95rem' }}>{suffix}</span>
            </p>
            <p style={{ fontSize: isMobile?'0.7rem':'0.8rem', color:'rgba(245,240,232,0.6)', margin:0 }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TERRAINS
// ═══════════════════════════════════════════════════════════════════
function TerrainsSection() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.1)
  const terrains = [
    { name:'Terrain Calavi Nord', subtitle:'Zone Résidentielle Premium', location:'Abomey-Calavi, Atlantique', price:'15 000', surface:'2 500', rendement:'12.5%', financed:68, status:'available', gradient:'linear-gradient(135deg, #1E3A2F 0%, #2D5241 60%, #B8972A 100%)' },
    { name:'Parcelle Fidjrossè', subtitle:'Front de Mer · Cotonou', location:'Cotonou, Littoral', price:'35 000', surface:'1 200', rendement:'18%', financed:91, status:'filling', gradient:'linear-gradient(135deg, #2D5241 0%, #B8972A 50%, #D4AD3A 100%)' },
    { name:'Zone Agro-Commerciale', subtitle:'Secteur Porteur · Nord Bénin', location:'Parakou, Borgou', price:'8 500', surface:'5 000', rendement:'14%', financed:32, status:'available', gradient:'linear-gradient(135deg, #3D6B53 0%, #1E3A2F 50%, #4E8467 100%)' },
  ]
  return (
    <section id="terrains" ref={ref} style={{ background:'#FAFAF7', padding:'clamp(50px,8vh,100px) 5vw' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#B8972A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Opportunités d'investissement</p>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.6rem':'clamp(1.8rem,3vw,2.8rem)', fontWeight:700, color:'#1A1A1A', letterSpacing:'-0.02em', margin:0 }}>Terrains disponibles</h2>
          </div>
          <a href="#" style={{ padding:'10px 22px', borderRadius:50, border:'1.5px solid rgba(30,58,47,0.2)', color:'#1E3A2F', textDecoration:'none', fontSize:'0.875rem', fontWeight:500, transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background='#1E3A2F'; e.currentTarget.style.color='#F5F0E8' }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#1E3A2F' }}>
            Voir tous →
          </a>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap:'1.5rem' }}>
          {terrains.map((t, i) => (
            <div key={i} style={{ background:'#FFFFFF', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(30,58,47,0.07)', border:'1px solid rgba(184,151,42,0.08)', transition:'all 0.3s ease', opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(24px)', transitionDelay:`${i*0.1}s`, cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(30,58,47,0.14)' }} onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(30,58,47,0.07)' }}>
              <div style={{ height: isMobile?150:180, background:t.gradient, position:'relative', overflow:'hidden' }}>
                <span style={{ position:'absolute', top:12, right:12, padding:'4px 10px', borderRadius:50, fontSize:'0.65rem', fontWeight:600, background: t.status==='available'?'rgba(30,58,47,0.85)':'rgba(184,151,42,0.85)', color:'#F5F0E8' }}>
                  {t.status==='available'?'✓ Disponible':'⏳ En cours'}
                </span>
                <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, padding:'4px 10px' }}>
                  <p style={{ fontSize:'0.65rem', color:'rgba(245,240,232,0.7)', margin:0 }}>Rendement</p>
                  <p style={{ fontSize:'0.95rem', fontWeight:700, color:'#D4AD3A', margin:0 }}>{t.rendement}</p>
                </div>
              </div>
              <div style={{ padding: isMobile?'16px':'20px' }}>
                <p style={{ fontSize:'0.68rem', color:'#8C8278', marginBottom:4 }}>📍 {t.location}</p>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 2px' }}>{t.name}</h3>
                <p style={{ fontSize:'0.75rem', color:'#6B6459', margin:'0 0 14px' }}>{t.subtitle}</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginBottom:12 }}>
                  {[['m² total',t.surface],['Rendement',t.rendement],['Financé',`${t.financed}%`]].map(([k,v]) => (
                    <div key={k} style={{ background:'#F5F0E8', borderRadius:8, padding:'7px 5px', textAlign:'center' }}>
                      <p style={{ fontSize:'0.6rem', color:'#8C8278', margin:'0 0 1px' }}>{k}</p>
                      <p style={{ fontSize:'0.8rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ height:5, background:'#EDE6D6', borderRadius:3, overflow:'hidden', marginBottom:14 }}>
                  <div style={{ height:'100%', borderRadius:3, width: inView?`${t.financed}%`:'0%', background: t.financed>80?'linear-gradient(90deg,#B8972A,#D4AD3A)':'linear-gradient(90deg,#1E3A2F,#3D6B53)', transition:`width 1.2s ease ${0.3+i*0.15}s` }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ fontSize:'0.65rem', color:'#8C8278', margin:'0 0 1px' }}>Prix</p>
                    <p style={{ fontFamily:"'Playfair Display', serif", fontSize:'1rem', fontWeight:700, color:'#1E3A2F', margin:0 }}>{t.price} <span style={{ fontSize:'0.65rem', color:'#8C8278', fontFamily:'DM Sans, sans-serif' }}>FCFA/m²</span></p>
                  </div>
                  <Link to="/inscription" style={{ padding:'9px 18px', borderRadius:50, background:'#1E3A2F', color:'#F5F0E8', textDecoration:'none', fontSize:'0.8rem', fontWeight:500, transition:'all 0.2s', minHeight:40, display:'flex', alignItems:'center' }}>Investir →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════
function HowItWorks() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.1)
  const steps = [
    { num:'01', icon:'👤', title:'Créez votre compte',       desc:"Inscription en 2 min avec votre email. Vérifiez votre identité via KYC sécurisé." },
    { num:'02', icon:'🗺️', title:'Choisissez un terrain',   desc:"Parcourez les fiches : photos, carte interactive, documents juridiques, prix." },
    { num:'03', icon:'💳', title:'Achetez vos parts (m²)',   desc:"Payez via MTN MoMo, Moov Money ou carte bancaire. Réservation immédiate." },
    { num:'04', icon:'📜', title:'Recevez votre attestation', desc:"Certificat PDF généré automatiquement. Suivez votre portefeuille en temps réel." },
  ]
  return (
    <section id="comment" ref={ref} style={{ background:'#FFFFFF', padding:'clamp(50px,8vh,100px) 5vw' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom: isMobile?'2.5rem':'4rem' }}>
          <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#B8972A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Comment ça marche</p>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.6rem':'clamp(1.8rem,3vw,2.8rem)', fontWeight:700, color:'#1A1A1A', letterSpacing:'-0.02em', margin:'0 0 12px' }}>
            Investir dans un terrain<br />n'a jamais été aussi <span style={{ color:'#1E3A2F' }}>simple</span>
          </h2>
          <p style={{ fontSize: isMobile?'0.88rem':'1rem', color:'#6B6459', maxWidth:520, margin:'0 auto' }}>En 4 étapes, devenez copropriétaire depuis votre téléphone.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'repeat(4,1fr)', gap: isMobile?'1rem':'1.5rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background:'#FAFAF7', borderRadius:18, padding: isMobile?'18px 14px':'28px 20px', textAlign:'center', position:'relative', border:'1px solid rgba(184,151,42,0.1)', opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(20px)', transition:`all 0.5s ease ${i*0.12}s` }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'#1E3A2F', color:'#F5F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize: isMobile?'1.1rem':'1.2rem', margin:'0 auto 12px', boxShadow:'0 4px 14px rgba(30,58,47,0.25)' }}>{step.icon}</div>
              <div style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background:'#B8972A', color:'#F5F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700 }}>{step.num}</div>
              <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'0.85rem':'1rem', fontWeight:700, color:'#1A1A1A', margin:'0 0 8px' }}>{step.title}</h3>
              <p style={{ fontSize: isMobile?'0.72rem':'0.82rem', color:'#6B6459', lineHeight:1.6, margin:0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// WHY SECTION
// ═══════════════════════════════════════════════════════════════════
function WhySection() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.1)
  const features = [
    { icon:'🛡️', title:'Sécurité juridique totale',   desc:"Chaque terrain dispose d'un titre foncier authentique, vérifié et publié sur la plateforme." },
    { icon:'⚡', title:'Investissement en 10 min',    desc:"De la création de compte à l'achat — tout depuis votre téléphone en quelques minutes." },
    { icon:'💎', title:'Dès 1 m² seulement',          desc:"Commencez avec le montant qui vous convient. Chaque m² est une part de propriété réelle." },
    { icon:'📈', title:'Portefeuille en temps réel',  desc:"Tableau de bord complet : valeur estimée, évolution, attestations téléchargeables." },
  ]
  return (
    <section id="pourquoi" ref={ref} style={{ background:'#F5F0E8', padding:'clamp(50px,8vh,100px) 5vw' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns: isMobile?'1fr':'1fr 1fr', gap: isMobile?'2.5rem':'5rem', alignItems:'center' }}>
        <div style={{ opacity: inView?1:0, transform: inView?'translateX(0)':'translateX(-30px)', transition:'all 0.7s ease' }}>
          <div style={{ background:'#FFFFFF', borderRadius:22, padding: isMobile?20:28, boxShadow:'0 20px 60px rgba(30,58,47,0.1)', border:'1px solid rgba(184,151,42,0.1)', marginBottom:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'rgba(184,151,42,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>📊</div>
              <div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'0.95rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>Valorisation de votre patrimoine</h3>
                <p style={{ fontSize:'0.72rem', color:'#8C8278', margin:0 }}>Croissance annuelle moyenne</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:7, height:90 }}>
              {[['2020',30],['2021',45],['2022',55],['2023',70],['2024',85],['2025',100,true]].map(([y,h,active]) => (
                <div key={y} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:'100%', height: inView?`${h}%`:'0%', background: active?'linear-gradient(180deg,#B8972A,#D4AD3A)':'linear-gradient(180deg,#1E3A2F,#3D6B53)', borderRadius:'5px 5px 0 0', transition:`height 0.8s ease`, opacity: active?1:0.6 }} />
                  <span style={{ fontSize:'0.58rem', color:'#8C8278' }}>{y}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, padding:'9px 12px', background:'rgba(30,58,47,0.05)', borderRadius:9, display:'flex', alignItems:'center', gap:7 }}>
              <span>📈</span>
              <p style={{ fontSize:'0.75rem', color:'#1E3A2F', fontWeight:500, margin:0 }}>+12 à 18% de croissance annuelle au Bénin</p>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
            {[['✅','KYC Vérifié','Identité sécurisée'],['🔐','Titres fonciers','Documents légaux']].map(([i,t,s]) => (
              <div key={t} style={{ background:'#FFFFFF', borderRadius:12, padding:'13px', border:'1px solid rgba(184,151,42,0.1)', display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:34, height:34, borderRadius:8, background:'rgba(30,58,47,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem' }}>{i}</div>
                <div><p style={{ fontSize:'0.78rem', fontWeight:700, color:'#1A1A1A', margin:0 }}>{t}</p><p style={{ fontSize:'0.68rem', color:'#8C8278', margin:0 }}>{s}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity: inView?1:0, transform: inView?'translateX(0)':'translateX(30px)', transition:'all 0.7s ease 0.2s' }}>
          <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#B8972A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Pourquoi LandShare</p>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.6rem':'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'#1A1A1A', letterSpacing:'-0.02em', margin:'0 0 14px', lineHeight:1.2 }}>
            La propriété foncière accessible à <span style={{ color:'#B8972A' }}>tous les Béninois</span>
          </h2>
          <p style={{ fontSize: isMobile?'0.85rem':'0.95rem', color:'#6B6459', marginBottom:'2rem', lineHeight:1.7 }}>Nous éliminons les barrières : capital élevé, complexité juridique, opacité des transactions.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            {features.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ display:'flex', gap:13, alignItems:'flex-start', opacity: inView?1:0, transform: inView?'translateX(0)':'translateX(20px)', transition:`all 0.5s ease ${0.3+i*0.1}s` }}>
                <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, background:'rgba(30,58,47,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{icon}</div>
                <div>
                  <h4 style={{ fontSize:'0.92rem', fontWeight:600, color:'#1A1A1A', margin:'0 0 3px' }}>{title}</h4>
                  <p style={{ fontSize: isMobile?'0.78rem':'0.82rem', color:'#6B6459', margin:0, lineHeight:1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════
function Testimonials() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.1)
  const testimonials = [
    { initials:'AK', name:'Adeola Kossou',  role:'Ingénieure · Paris',      bg:'#1E3A2F', text:"\"J'ai investi 50 000 FCFA en quelques minutes depuis Paris. L'attestation PDF m'a été envoyée immédiatement. C'est révolutionnaire pour nous les Béninois de la diaspora.\"" },
    { initials:'MF', name:'Malick Fassinou', role:'Entrepreneur · Cotonou',  bg:'#2D5241', text:"\"Enfin une plateforme sérieuse ! J'ai acheté mes premiers m² avec MTN MoMo. Les documents sont clairs, le suivi est parfait. Je recommande à tous mes proches.\"" },
    { initials:'SB', name:'Sylvie Bello',    role:'Médecin · Parakou',       bg:'#B8972A', text:"\"LandShare m'a permis de diversifier mon patrimoine. La transparence des documents et la qualité du service sont au rendez-vous. Une vraie innovation pour notre pays.\"" },
  ]
  return (
    <section id="temoignages" ref={ref} style={{ background:'#FFFFFF', padding:'clamp(50px,8vh,100px) 5vw' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <p style={{ fontSize:'0.7rem', fontWeight:700, color:'#B8972A', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Témoignages</p>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.6rem':'clamp(1.8rem,3vw,2.6rem)', fontWeight:700, color:'#1A1A1A', letterSpacing:'-0.02em', margin:0, lineHeight:1.2 }}>Ce que disent<br />nos investisseurs</h2>
          </div>
          <div style={{ display:'flex', gap:3, alignItems:'center' }}>
            {[1,2,3,4,5].map(s => <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill="#B8972A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
            <span style={{ fontSize:'0.8rem', color:'#6B6459', marginLeft:5 }}>4.9/5 · 200+ avis</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr':'repeat(3,1fr)', gap:'1.5rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background:'#FAFAF7', borderRadius:20, padding: isMobile?'20px':'28px', border:'1px solid rgba(184,151,42,0.08)', opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(20px)', transition:`all 0.5s ease ${i*0.12}s` }}>
              <div style={{ display:'flex', gap:3, marginBottom:14 }}>
                {[1,2,3,4,5].map(j => <svg key={j} width="13" height="13" viewBox="0 0 24 24" fill="#B8972A"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}
              </div>
              <p style={{ fontSize: isMobile?'0.85rem':'0.9rem', color:'#3D3530', lineHeight:1.7, fontStyle:'italic', marginBottom:18 }}>{t.text}</p>
              <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:t.bg, color:'#F5F0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>{t.initials}</div>
                <div>
                  <p style={{ fontSize:'0.85rem', fontWeight:600, color:'#1A1A1A', margin:0 }}>{t.name}</p>
                  <p style={{ fontSize:'0.72rem', color:'#8C8278', margin:0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ✅ FAQ SECTION
// ═══════════════════════════════════════════════════════════════════
function FAQSection() {
  const isMobile = useIsMobile()
  const [ref, inView] = useInView(0.1)
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    {
      q: "Qu'est-ce que LandShare Bénin ?",
      a: "LandShare est une plateforme de land banking participatif qui permet à n'importe qui d'acheter des parts de terrains au Bénin à partir de 5 000 FCFA. Chaque m² acheté vous donne un droit économique sur ce terrain, matérialisé par une attestation PDF sécurisée.",
    },
    {
      q: "Est-ce que c'est juridiquement sécurisé ?",
      a: "Oui. Chaque terrain est adossé à un titre foncier authentique, vérifié par un notaire agréé. Vos investissements sont enregistrés dans notre base de données et chaque attestation dispose d'une empreinte numérique SHA-256 infalsifiable. Nous opérons dans le cadre légal OHADA.",
    },
    {
      q: "Comment vérifier l'authenticité d'une attestation ?",
      a: "Rendez-vous sur landshare.bj/verifier et entrez votre référence d'investissement (ex: LS-0042) ou le hash SHA-256 de votre attestation PDF. Le résultat s'affiche instantanément. Cette page est accessible à tous, sans connexion.",
      hasLink: true,
    },
    {
      q: "Quels modes de paiement sont acceptés ?",
      a: "Nous acceptons MTN Mobile Money, Moov Money, Orange Money, Stripe (carte bancaire internationale) et Paystack. Tous les paiements sont sécurisés et traités en temps réel.",
    },
    {
      q: "Qu'est-ce que le KYC et pourquoi est-il obligatoire ?",
      a: "Le KYC (Know Your Customer) est une vérification d'identité obligatoire pour lutter contre la fraude et le blanchiment d'argent. Vous devez fournir une pièce d'identité valide (CNI, passeport ou titre de séjour). Une fois validé, vous pouvez investir sans restriction.",
    },
    {
      q: "Qu'est-ce que je reçois après mon investissement ?",
      a: "Vous recevez immédiatement une attestation PDF horodatée, signée numériquement, avec votre nom, la superficie achetée, le terrain concerné et un hash SHA-256 unique. Ce document est disponible en téléchargement depuis votre espace \"Mes documents\".",
    },
    {
      q: "Quel est le rendement attendu ?",
      a: "Le rendement varie selon les terrains et la durée d'investissement. Nos terrains affichent des rendements estimés entre 12% et 18% par an, basés sur la valorisation foncière historique du Bénin. Ces estimations ne constituent pas une garantie de performance.",
    },
    {
      q: "Puis-je revendre mes parts de terrain ?",
      a: "Le marché secondaire (revente entre investisseurs) est prévu dans notre roadmap V3. Pour l'instant, vos parts sont conservées jusqu'à la valorisation ou la revente du terrain par LandShare, dont vous percevrez votre quote-part.",
    },
    {
      q: "Comment contacter le support LandShare ?",
      a: "Vous pouvez nous écrire à contact@landshare.bj ou utiliser la section \"Aide\" dans votre tableau de bord. Nous répondons sous 24h ouvrées, du lundi au vendredi.",
    },
  ]

  return (
    <section id="faq" ref={ref} style={{ background: '#FAFAF7', padding: 'clamp(50px,8vh,100px) 5vw' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '4rem', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#B8972A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>FAQ</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Questions fréquentes
          </h2>
          <p style={{ fontSize: isMobile ? '0.88rem' : '1rem', color: '#6B6459', maxWidth: 500, margin: '0 auto' }}>
            Tout ce que vous devez savoir avant d'investir sur LandShare.
          </p>
        </div>

        {/* Accordéon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i}
                style={{
                  background: '#FFFFFF', borderRadius: 14,
                  border: `1.5px solid ${isOpen ? '#1E3A2F' : 'rgba(30,58,47,0.08)'}`,
                  overflow: 'hidden', transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 4px 20px rgba(30,58,47,0.08)' : '0 1px 4px rgba(30,58,47,0.04)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(16px)',
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                {/* Question — bouton */}
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: isMobile ? '16px 18px' : '18px 22px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 12,
                  }}
                >
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '0.9rem' : '0.95rem', fontWeight: 600, color: isOpen ? '#1E3A2F' : '#1A1A1A', flex: 1, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? '#1E3A2F' : 'rgba(30,58,47,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                  }}>
                    <span style={{ color: isOpen ? '#F5F0E8' : '#1E3A2F', fontSize: '1rem', lineHeight: 1, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s', display: 'block' }}>+</span>
                  </div>
                </button>

                {/* Réponse */}
                {isOpen && (
                  <div style={{ padding: isMobile ? '0 18px 16px' : '0 22px 18px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ height: 1, background: 'rgba(30,58,47,0.07)', marginBottom: 14 }} />
                    <p style={{ fontSize: isMobile ? '0.82rem' : '0.88rem', color: '#6B6459', lineHeight: 1.75, margin: 0 }}>
                      {faq.a}
                    </p>
                    {/* Lien vers /verifier pour la question sur la vérification */}
                    {faq.hasLink && (
                      <Link to="/verifier" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 12, padding: '7px 14px', borderRadius: 8, background: 'rgba(30,58,47,0.07)', color: '#1E3A2F', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(30,58,47,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(30,58,47,0.07)'}>
                        🔍 Accéder à la page de vérification →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact */}
        <div style={{ marginTop: 40, textAlign: 'center', opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
          <p style={{ fontSize: '0.88rem', color: '#6B6459', marginBottom: 14 }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <a href="mailto:contact@landshare.bj" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 24px', borderRadius: 50, border: '1.5px solid rgba(30,58,47,0.2)', color: '#1E3A2F', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='#1E3A2F'; e.currentTarget.style.color='#F5F0E8' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#1E3A2F' }}>
            ✉️ Contactez notre équipe
          </a>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CTA FINAL
// ═══════════════════════════════════════════════════════════════════
function CTASection() {
  const isMobile = useIsMobile()
  return (
    <section style={{ background:'linear-gradient(160deg,#1E3A2F 0%,#2D5241 60%,#1E3A2F 100%)', padding:'clamp(50px,10vh,120px) 5vw', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'50%', right:'-5%', transform:'translateY(-50%)', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(184,151,42,0.12), transparent 70%)', pointerEvents:'none' }} />
      <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(184,151,42,0.15)', border:'1px solid rgba(184,151,42,0.3)', borderRadius:50, padding:'6px 16px', fontSize:'0.7rem', fontWeight:500, color:'#D4AD3A', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
          Commencez dès aujourd'hui
        </div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize: isMobile?'1.8rem':'clamp(2rem,4vw,3.2rem)', fontWeight:700, color:'#F5F0E8', letterSpacing:'-0.02em', margin:'0 0 1.2rem', lineHeight:1.15 }}>
          Votre premier m² de<br /><span style={{ color:'#D4AD3A' }}>terre béninoise</span> vous attend
        </h2>
        <p style={{ fontSize: isMobile?'0.88rem':'1rem', color:'rgba(245,240,232,0.7)', marginBottom:'2rem', lineHeight:1.7 }}>
          Rejoignez plus de <strong style={{ color:'#F5F0E8' }}>1 200 investisseurs</strong> qui construisent leur patrimoine foncier avec LandShare.
        </p>
        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'2rem' }}>
          <Link to="/inscription" style={{ padding: isMobile?'15px 28px':'14px 32px', borderRadius:50, background:'#F5F0E8', color:'#1E3A2F', textDecoration:'none', fontSize: isMobile?'1rem':'0.95rem', fontWeight:600, boxShadow:'0 6px 20px rgba(0,0,0,0.2)', transition:'all 0.2s', display:'inline-flex', alignItems:'center', gap:6, minHeight: isMobile?52:'auto' }}>
            Créer mon compte gratuit →
          </Link>
          <a href="#terrains" style={{ padding: isMobile?'14px 24px':'13px 28px', borderRadius:50, border:'1.5px solid rgba(245,240,232,0.3)', color:'#F5F0E8', textDecoration:'none', fontSize:'0.95rem', fontWeight:500, transition:'all 0.2s', display:'inline-flex', alignItems:'center', minHeight: isMobile?52:'auto' }}>
            Voir les terrains
          </a>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.5)' }}>Paiements acceptés :</span>
          {[['#FFCC00','MTN MoMo'],['#0056A2','Moov Money'],['#635BFF','Stripe'],['#00C3F7','Paystack']].map(([c,l]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(245,240,232,0.08)', border:'1px solid rgba(245,240,232,0.12)', borderRadius:50, padding:'4px 11px', fontSize:'0.72rem', color:'rgba(245,240,232,0.7)' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:c }} />{l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// FOOTER ✅ avec lien "Vérifier un investissement"
// ═══════════════════════════════════════════════════════════════════
function Footer() {
  const isMobile = useIsMobile()
  return (
    <footer style={{ background:'#111810' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding: isMobile?'3rem 20px 2rem':'4rem 5vw 2rem' }}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile?'1fr 1fr':'2fr 1fr 1fr 1fr', gap: isMobile?'2rem':'3rem', marginBottom:'2.5rem' }}>
          {/* Brand */}
          <div style={{ gridColumn: isMobile?'1 / -1':'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14 }}>
              <div style={{ width:32, height:32, background:'#1E3A2F', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:13, height:13, background:'#B8972A', clipPath:'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              </div>
              <span style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.05rem', fontWeight:700, color:'#F5F0E8' }}>Land<span style={{ color:'#B8972A' }}>Share</span> Bénin</span>
            </div>
            <p style={{ fontSize:'0.8rem', color:'rgba(245,240,232,0.45)', lineHeight:1.7 }}>
              Plateforme de land banking participatif au Bénin. Démocratisons l'accès à la propriété foncière.
            </p>
            {/* ✅ Bloc vérification dans le footer */}
            <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(184,151,42,0.08)', border:'1px solid rgba(184,151,42,0.15)', borderRadius:10 }}>
              <p style={{ fontSize:'0.68rem', color:'rgba(245,240,232,0.45)', margin:'0 0 6px' }}>Vous avez reçu une attestation ?</p>
              <Link to="/verifier" style={{ display:'inline-flex', alignItems:'center', gap:5, color:'#D4AD3A', textDecoration:'none', fontSize:'0.75rem', fontWeight:600, transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color='#F5F0E8'}
                onMouseLeave={e => e.currentTarget.style.color='#D4AD3A'}>
                🔍 Vérifier son authenticité →
              </Link>
            </div>
          </div>

          {/* ✅ Colonne Plateforme avec lien Vérifier */}
          <div>
            <h5 style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(245,240,232,0.6)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Plateforme</h5>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:7 }}>
              {[
                { label:'Terrains disponibles',          href:'#terrains'  },
                { label:'Comment ça marche',             href:'#comment'   },
                { label:'Tableau de bord',               href:'/dashboard', isLink:true },
                { label:'Mes attestations',              href:'/dashboard', isLink:true },
                { label:'Vérifier un investissement 🔍', href:'/verifier',  isLink:true, highlight:true },
              ].map(({ label, href, isLink, highlight }) => (
                <li key={label}>
                  {isLink ? (
                    <Link to={href} style={{ fontSize:'0.78rem', color: highlight?'#D4AD3A':'rgba(245,240,232,0.45)', textDecoration:'none', transition:'color 0.2s', fontWeight: highlight?600:400 }}
                      onMouseEnter={e => e.target.style.color='#F5F0E8'}
                      onMouseLeave={e => e.target.style.color=highlight?'#D4AD3A':'rgba(245,240,232,0.45)'}>
                      {label}
                    </Link>
                  ) : (
                    <a href={href} style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.45)', textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color='#F5F0E8'}
                      onMouseLeave={e => e.target.style.color='rgba(245,240,232,0.45)'}>
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h5 style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(245,240,232,0.6)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Légal</h5>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:7 }}>
              {["Conditions d'utilisation",'Politique de confidentialité','KYC & Conformité','Mentions légales'].map(l => (
                <li key={l}><a href="#" style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.45)', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e => e.target.style.color='#F5F0E8'} onMouseLeave={e => e.target.style.color='rgba(245,240,232,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontSize:'0.7rem', fontWeight:700, color:'rgba(245,240,232,0.6)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>Contact</h5>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:7 }}>
              {['FAQ & Aide','contact@landshare.bj','+229 XX XX XX XX','Cotonou, Bénin'].map(l => (
                <li key={l}><a href="#" style={{ fontSize:'0.78rem', color:'rgba(245,240,232,0.45)', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e => e.target.style.color='#F5F0E8'} onMouseLeave={e => e.target.style.color='rgba(245,240,232,0.45)'}>{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop:'1px solid rgba(245,240,232,0.07)', paddingTop:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem' }}>
          <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.3)', margin:0 }}>© 2025 LandShare Bénin — LIGALI Fouad & YAHAYA Ahamed.</p>
          <p style={{ fontSize:'0.72rem', color:'rgba(245,240,232,0.3)', margin:0 }}>Plateforme MVP v1.0</p>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Landing() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap"
    link.rel  = "stylesheet"
    document.head.appendChild(link)
  }, [])

  return (
    <div style={{ fontFamily:"'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />
      <Hero />
      <StatsBand />
      <TerrainsSection />
      <HowItWorks />
      <WhySection />
      <Testimonials />
      <FAQSection />   {/* ✅ FAQ ajoutée */}
      <CTASection />
      <Footer />
    </div>
  )
}