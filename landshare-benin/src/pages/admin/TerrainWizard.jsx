// ═══════════════════════════════════════════════════════════════════
// TerrainWizard.jsx — Formulaire multi-étapes ajout terrain
// ✅ Fix : Step components définis HORS du composant principal
//          pour éviter le re-montage à chaque frappe (bug focus)
// ═══════════════════════════════════════════════════════════════════
import { useState, useRef } from 'react'
import { landsApi } from '../../services/landshareApi'

const C = {
  green:  '#1E3A2F',
  green2: '#2D5241',
  gold:   '#B8972A',
  cream:  '#F5F0E8',
  text:   '#1A1A1A',
  muted:  '#8C8278',
  border: 'rgba(30,58,47,0.12)',
  red:    '#C0392B',
}

// ─── Styles ────────────────────────────────────────────────────────
const baseInput = {
  width: '100%', padding: '10px 12px', borderRadius: 9,
  border: '1.5px solid rgba(30,58,47,0.15)',
  background: '#FAFAF7',
  fontSize: '0.82rem', color: '#1A1A1A', outline: 'none',
  fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
}
const errInput  = { ...baseInput, borderColor: C.red }
const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#4A3F35', marginBottom: 5 }
const grid2      = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }
const fieldWrap  = { marginBottom: 14 }

// ─── Zone upload ────────────────────────────────────────────────────
function UploadZone({ label, accept, file, onFile, icon = '📄', multiple = false }) {
  const ref = useRef()
  return (
    <div onClick={() => ref.current.click()} style={{
      border: `2px dashed ${file ? C.green : 'rgba(30,58,47,0.2)'}`,
      borderRadius: 10, padding: '18px 16px', textAlign: 'center',
      cursor: 'pointer', background: file ? 'rgba(30,58,47,0.03)' : 'rgba(245,240,232,0.4)',
    }}>
      <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 6 }}>
        {file ? '✅' : icon}
      </span>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: file ? C.green : C.muted, margin: '0 0 3px' }}>
        {file ? (multiple ? `${file.length} fichier(s)` : file.name) : label}
      </p>
      <p style={{ fontSize: '0.62rem', color: C.muted, margin: 0 }}>
        {accept.includes('pdf') ? 'PDF · Max 10 Mo' : 'JPG, PNG · Max 5 Mo'}
      </p>
      <input ref={ref} type="file" accept={accept} multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => onFile(multiple ? e.target.files : e.target.files[0])} />
    </div>
  )
}

// ─── Stepper ────────────────────────────────────────────────────────
function Stepper({ current, steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i < current ? C.green : i === current ? 'linear-gradient(135deg,#1E3A2F,#2D5241)' : 'rgba(30,58,47,0.08)',
              border: i <= current ? 'none' : '2px solid rgba(30,58,47,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700,
              color: i <= current ? '#F5F0E8' : C.muted,
              boxShadow: i === current ? '0 4px 14px rgba(30,58,47,0.25)' : 'none',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: i === current ? 700 : 500, color: i === current ? C.green : i < current ? C.green2 : C.muted, whiteSpace: 'nowrap', maxWidth: 70, textAlign: 'center' }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, margin: '0 6px', marginBottom: 22, background: i < current ? C.green : 'rgba(30,58,47,0.1)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// ÉTAPES — définies HORS du composant principal ✅
// Elles reçoivent form + set en props → pas de re-montage au frappe
// ═══════════════════════════════════════════════════════════════════

// ── Étape 1 : Informations générales ─────────────────────────────
function Step1({ form, set, errors }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Informations générales</h3>
        <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Décrivez le terrain pour les investisseurs.</p>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Nom du terrain <span style={{ color: C.red }}>*</span></label>
        <input style={errors.title ? errInput : baseInput} value={form.title}
          placeholder="Ex: Calavi Nord — Lot 15"
          onChange={e => set('title', e.target.value)} />
        {errors.title && <p style={{ fontSize: '0.65rem', color: C.red, margin: '3px 0 0' }}>⚠ {errors.title}</p>}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Sous-titre <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.subtitle}
          placeholder="Ex: Zone Résidentielle Premium"
          onChange={e => set('subtitle', e.target.value)} />
      </div>

      <div style={grid2}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Ville <span style={{ color: C.red }}>*</span></label>
          <input style={errors.city ? errInput : baseInput} value={form.city}
            placeholder="Ex: Abomey-Calavi"
            onChange={e => set('city', e.target.value)} />
          {errors.city && <p style={{ fontSize: '0.65rem', color: C.red, margin: '3px 0 0' }}>⚠ {errors.city}</p>}
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Quartier / district <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
          <input style={baseInput} value={form.district}
            placeholder="Ex: Agla, Fidjrossè..."
            onChange={e => set('district', e.target.value)} />
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Localisation complète <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.location}
          placeholder="Ex: Abomey-Calavi, Département de l'Atlantique, Bénin"
          onChange={e => set('location', e.target.value)} />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Description détaillée <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <textarea value={form.description}
          placeholder="Décrivez le terrain : accès, environnement, potentiel, atouts..."
          rows={4} onChange={e => set('description', e.target.value)}
          style={{ ...baseInput, resize: 'vertical', minHeight: 90, lineHeight: 1.6 }} />
      </div>
    </div>
  )
}

// ── Étape 2 : Données foncières ───────────────────────────────────
function Step2({ form, set, errors }) {
  const valeurTotale = form.total_sqm && form.price_per_sqm
    ? (parseInt(form.total_sqm || 0) * parseFloat(form.price_per_sqm || 0)).toLocaleString('fr-FR')
    : null

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Données foncières & financières</h3>
        <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Superficie, prix et rendement estimé.</p>
      </div>

      <div style={grid2}>
        <div style={fieldWrap}>
          <label style={labelStyle}>Superficie totale (m²) <span style={{ color: C.red }}>*</span></label>
          <input style={errors.total_sqm ? errInput : baseInput} value={form.total_sqm}
            type="number" min="1" placeholder="Ex: 1000"
            onChange={e => set('total_sqm', e.target.value)} />
          {errors.total_sqm && <p style={{ fontSize: '0.65rem', color: C.red, margin: '3px 0 0' }}>⚠ {errors.total_sqm}</p>}
        </div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Prix par m² (FCFA) <span style={{ color: C.red }}>*</span></label>
          <input style={errors.price_per_sqm ? errInput : baseInput} value={form.price_per_sqm}
            type="number" min="0" placeholder="Ex: 15000"
            onChange={e => set('price_per_sqm', e.target.value)} />
          {errors.price_per_sqm && <p style={{ fontSize: '0.65rem', color: C.red, margin: '3px 0 0' }}>⚠ {errors.price_per_sqm}</p>}
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Rendement estimé (%/an) <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.rendement}
          type="number" min="0" max="100" step="0.1" placeholder="Ex: 12.5"
          onChange={e => set('rendement', e.target.value)} />
      </div>

      {/* Aperçu calcul */}
      {valeurTotale && (
        <div style={{ background: 'rgba(30,58,47,0.05)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(30,58,47,0.1)', marginBottom: 14, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.62rem', color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valeur totale</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: C.green, margin: 0 }}>{valeurTotale} FCFA</p>
          </div>
          {form.rendement && (
            <div>
              <p style={{ fontSize: '0.62rem', color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rendement /an</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: C.gold, margin: 0 }}>{form.rendement}%</p>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, margin: '0 0 10px' }}>
          📍 Géolocalisation <span style={{ fontWeight: 400, color: C.muted, fontSize: '0.68rem' }}>(optionnel)</span>
        </p>
        <div style={grid2}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Latitude</label>
            <input style={baseInput} value={form.latitude}
              type="number" step="any" placeholder="Ex: 6.3654"
              onChange={e => set('latitude', e.target.value)} />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Longitude</label>
            <input style={baseInput} value={form.longitude}
              type="number" step="any" placeholder="Ex: 2.4183"
              onChange={e => set('longitude', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Étape 3 : Informations notariales ────────────────────────────
function Step3({ form, set }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Informations notariales</h3>
        <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Ces informations renforcent la crédibilité auprès des investisseurs.</p>
      </div>

      <div style={{ background: 'rgba(184,151,42,0.08)', border: '1px solid rgba(184,151,42,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8 }}>
        <span>💡</span>
        <p style={{ fontSize: '0.72rem', color: '#8B6E1A', margin: 0, lineHeight: 1.5 }}>
          Le notaire valide juridiquement le titre foncier. Ces informations apparaîtront sur les attestations des investisseurs.
        </p>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Nom du notaire <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.notary_name}
          placeholder="Ex: Me Kofi Akobi"
          onChange={e => set('notary_name', e.target.value)} />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Cabinet notarial <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.notary_cabinet}
          placeholder="Ex: Cabinet Akobi & Associés, Cotonou"
          onChange={e => set('notary_cabinet', e.target.value)} />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Date de vérification notariale <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
        <input style={baseInput} value={form.notary_verified_at}
          type="date" onChange={e => set('notary_verified_at', e.target.value)} />
      </div>

      {/* Aperçu badge notaire */}
      {form.notary_name && (
        <div style={{ background: 'rgba(30,58,47,0.04)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(30,58,47,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(30,58,47,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏅</div>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Vérifié par {form.notary_name}</p>
            {form.notary_cabinet && <p style={{ fontSize: '0.68rem', color: C.muted, margin: 0 }}>{form.notary_cabinet}</p>}
          </div>
          <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 20, background: 'rgba(30,58,47,0.08)', color: C.green, fontSize: '0.65rem', fontWeight: 600 }}>✓ Notarié</span>
        </div>
      )}
    </div>
  )
}

// ── Étape 4 : Documents & médias ──────────────────────────────────
function Step4({ form, set }) {
  const rows = [
    { label: 'Nom',          value: form.title         || '—' },
    { label: 'Ville',         value: form.city          || '—' },
    { label: 'Superficie',    value: form.total_sqm     ? `${parseInt(form.total_sqm).toLocaleString()} m²` : '—' },
    { label: 'Prix/m²',       value: form.price_per_sqm ? `${parseFloat(form.price_per_sqm).toLocaleString()} FCFA` : '—' },
    { label: 'Rendement',     value: form.rendement     ? `${form.rendement}%/an` : '—' },
    { label: 'Notaire',       value: form.notary_name   || '—' },
    { label: 'Titre foncier', value: form.title_deed?.name || '—' },
    { label: 'Photo',         value: form.main_photo?.name  || '—' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Documents légaux & médias</h3>
        <p style={{ fontSize: '0.72rem', color: C.muted, margin: 0 }}>Le titre foncier est fortement recommandé pour rassurer les investisseurs.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, margin: '0 0 12px' }}>📋 Documents légaux</p>
        <div style={grid2}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Titre foncier <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(PDF recommandé)</span></label>
            <UploadZone label="Cliquer pour uploader" accept=".pdf,.jpg,.jpeg,.png" icon="📜"
              file={form.title_deed} onFile={f => set('title_deed', f)} />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Plan de bornage <span style={{ fontSize: '0.63rem', fontWeight: 400, color: C.muted }}>(optionnel)</span></label>
            <UploadZone label="Cliquer pour uploader" accept=".pdf,.jpg,.jpeg,.png" icon="📐"
              file={form.survey_plan} onFile={f => set('survey_plan', f)} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, margin: '0 0 12px' }}>🖼 Photos du terrain</p>
        <div style={grid2}>
          <div style={fieldWrap}>
            <label style={labelStyle}>Photo principale</label>
            <UploadZone label="Photo principale" accept=".jpg,.jpeg,.png,.webp" icon="🏡"
              file={form.main_photo} onFile={f => set('main_photo', f)} />
          </div>
          <div style={fieldWrap}>
            <label style={labelStyle}>Photos supplémentaires</label>
            <UploadZone label="Ajouter des photos" accept=".jpg,.jpeg,.png,.webp" icon="📸"
              file={form.extra_photos} onFile={f => set('extra_photos', f)} multiple />
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div style={{ background: 'rgba(30,58,47,0.04)', border: '1px solid rgba(30,58,47,0.08)', borderRadius: 12, padding: '14px 16px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📋 Résumé</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
          {rows.map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.72rem', borderBottom: '1px solid rgba(30,58,47,0.05)' }}>
              <span style={{ color: C.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: C.text, textAlign: 'right', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function TerrainWizard({ onClose, onCreated }) {
  const [step,     setStep]     = useState(0)
  const [creating, setCreating] = useState(false)
  const [errors,   setErrors]   = useState({})

  const [form, setForm] = useState({
    title: '', subtitle: '', city: '', district: '', location: '', description: '',
    total_sqm: '', price_per_sqm: '', rendement: '', latitude: '', longitude: '',
    notary_name: '', notary_cabinet: '', notary_verified_at: '',
    title_deed: null, survey_plan: null, main_photo: null, extra_photos: null,
  })

  // ✅ set() ne recrée pas le composant — il modifie juste le state
  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
    setErrors(p => ({ ...p, [key]: null }))
  }

  const STEPS = ['Informations', 'Données foncières', 'Notaire', 'Documents']

  const validate = () => {
    const errs = {}
    if (step === 0) {
      if (!form.title.trim()) errs.title = 'Champ requis'
      if (!form.city.trim())  errs.city  = 'Champ requis'
    }
    if (step === 1) {
      if (!form.total_sqm)     errs.total_sqm     = 'Champ requis'
      if (!form.price_per_sqm) errs.price_per_sqm = 'Champ requis'
      if (form.total_sqm     && parseInt(form.total_sqm)     <= 0) errs.total_sqm     = 'Doit être > 0'
      if (form.price_per_sqm && parseFloat(form.price_per_sqm) <= 0) errs.price_per_sqm = 'Doit être > 0'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const prev = () => setStep(s => s - 1)

  const handleCreate = async () => {
    if (!validate()) return
    setCreating(true)
    try {
      const formData = new FormData()
      const fields = [
        'title','subtitle','city','district','location','description',
        'total_sqm','price_per_sqm','rendement','latitude','longitude',
        'notary_name','notary_cabinet','notary_verified_at',
      ]
      fields.forEach(k => { if (form[k]) formData.append(k, form[k]) })
      if (form.title_deed)   formData.append('title_deed',   form.title_deed)
      if (form.survey_plan)  formData.append('survey_plan',  form.survey_plan)
      if (form.main_photo)   formData.append('main_photo',   form.main_photo)
      if (form.extra_photos) Array.from(form.extra_photos).forEach(f => formData.append('extra_photos[]', f))

      const { data } = await landsApi.create(formData)
      onCreated(data.land)
      onClose()
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || 'Erreur lors de la création.'))
    } finally {
      setCreating(false)
    }
  }

  // ✅ Les composants Step reçoivent form + set en props
  // Ils sont définis en dehors → React ne les recrée pas à chaque render
  const stepContent = [
    <Step1 key="s1" form={form} set={set} errors={errors} />,
    <Step2 key="s2" form={form} set={set} errors={errors} />,
    <Step3 key="s3" form={form} set={set} />,
    <Step4 key="s4" form={form} set={set} />,
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 580, maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.22)', animation: 'wizardIn 0.25s cubic-bezier(.4,0,.2,1)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(30,58,47,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Nouveau terrain</h2>
            <p style={{ fontSize: '0.7rem', color: C.muted, margin: 0 }}>Étape {step + 1} sur {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(30,58,47,0.06)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, fontSize: '1rem' }}>✕</button>
        </div>

        {/* Stepper */}
        <div style={{ padding: '18px 24px 0', flexShrink: 0 }}>
          <Stepper current={step} steps={STEPS} />
        </div>

        {/* Contenu scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px' }}>
          {stepContent[step]}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(30,58,47,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: '#FAFAF7', borderRadius: '0 0 18px 18px' }}>
          <button onClick={step === 0 ? onClose : prev} style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid rgba(30,58,47,0.18)', background: 'transparent', color: C.text, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            {step === 0 ? 'Annuler' : '← Précédent'}
          </button>

          {/* Indicateurs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 16 : 6, height: 6, borderRadius: 3, background: i === step ? C.green : i < step ? C.green2 : 'rgba(30,58,47,0.15)', transition: 'all 0.3s' }} />
            ))}
          </div>

          {step < STEPS.length - 1 ? (
            <button onClick={next} style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #1E3A2F, #2D5241)', color: '#F5F0E8', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 14px rgba(30,58,47,0.2)' }}>
              Suivant →
            </button>
          ) : (
            <button onClick={handleCreate} disabled={creating} style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: creating ? 'rgba(30,58,47,0.4)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)', color: '#F5F0E8', fontSize: '0.78rem', fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: creating ? 'none' : '0 4px 14px rgba(30,58,47,0.2)', display: 'flex', alignItems: 'center', gap: 7 }}>
              {creating
                ? <><div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />Création...</>
                : '✓ Créer le terrain'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wizardIn { from { opacity:0; transform:scale(0.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}