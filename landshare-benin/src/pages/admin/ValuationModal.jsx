// ═══════════════════════════════════════════════════════════════════
// ValuationModal.jsx — Modal de nouvelle valorisation
// À importer dans AdminDashboard.jsx
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react'
import api from '../../api/axios'

export default function ValuationModal({ terrain, onClose, onSuccess }) {
  const [form, setForm] = useState({
    estimated_value_per_sqm: '',
    valuation_date:          new Date().toISOString().split('T')[0],
    source:                  '',
    notes:                   '',
  })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [success,  setSuccess]  = useState(null)

  const variation = form.estimated_value_per_sqm && terrain.price
    ? (((parseFloat(form.estimated_value_per_sqm) - terrain.price) / terrain.price) * 100).toFixed(1)
    : null

  const handleSubmit = async () => {
    if (!form.estimated_value_per_sqm) { setError('Le nouveau prix/m² est requis.'); return }
    if (!form.valuation_date)          { setError('La date d\'évaluation est requise.'); return }

    setLoading(true); setError(null)
    try {
      const { data } = await api.post(`/admin/lands/${terrain.id}/valuations`, form)
      setSuccess(data.message)
      setTimeout(() => {
        onSuccess(data)
        onClose()
      }, 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la valorisation.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '11px 12px', borderRadius: 9,
    border: '1.5px solid rgba(30,58,47,0.15)', background: '#FAFAF7',
    fontSize: '0.85rem', color: '#1A1A1A', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.72rem', fontWeight: 600,
    color: '#4A3F35', marginBottom: 5,
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001, width: '100%', maxWidth: 480,
        background: '#FFFFFF', borderRadius: 18,
        boxShadow: '0 24px 64px rgba(30,58,47,0.18)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A2F, #2D5241)',
          padding: '18px 22px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ fontSize: '0.6rem', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>
              Nouvelle valorisation
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#F5F0E8', margin: '0 0 4px' }}>
              {terrain.name}
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'rgba(245,240,232,0.6)', margin: 0 }}>
              Prix actuel : {(terrain.price || 0).toLocaleString('fr-FR')} FCFA/m²
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(245,240,232,0.1)', border: '1px solid rgba(245,240,232,0.15)',
            borderRadius: 8, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(245,240,232,0.7)', fontSize: '0.85rem',
          }}>✕</button>
        </div>

        {/* Corps */}
        <div style={{ padding: '20px 22px' }}>

          {/* Aperçu variation */}
          {variation !== null && (
            <div style={{
              background: parseFloat(variation) >= 0 ? 'rgba(30,58,47,0.06)' : 'rgba(192,57,43,0.06)',
              border: `1px solid ${parseFloat(variation) >= 0 ? 'rgba(30,58,47,0.15)' : 'rgba(192,57,43,0.15)'}`,
              borderRadius: 10, padding: '12px 14px', marginBottom: 16,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ fontSize: '0.68rem', color: '#8C8278', margin: '0 0 2px' }}>Variation estimée</p>
                <p style={{
                  fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700,
                  color: parseFloat(variation) >= 0 ? '#1E3A2F' : '#C0392B', margin: 0,
                }}>
                  {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.68rem', color: '#8C8278', margin: '0 0 2px' }}>Nouveau prix</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                  {parseFloat(form.estimated_value_per_sqm).toLocaleString('fr-FR')} FCFA/m²
                </p>
              </div>
            </div>
          )}

          {/* Champ prix */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Nouveau prix au m² (FCFA) *</label>
            <input
              type="number"
              value={form.estimated_value_per_sqm}
              onChange={e => setForm(f => ({ ...f, estimated_value_per_sqm: e.target.value }))}
              placeholder={`Actuel : ${(terrain.price || 0).toLocaleString('fr-FR')}`}
              style={inputStyle}
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Date d'évaluation *</label>
            <input
              type="date"
              value={form.valuation_date}
              onChange={e => setForm(f => ({ ...f, valuation_date: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {/* Source / expert */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Source / Expert foncier</label>
            <input
              type="text"
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              placeholder="Ex: Cabinet Akobi & Associés"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Notes / Justification</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Ex: Nouvelle route bitumée à 200m, hausse de la demande..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          {/* Feedback */}
          {error && (
            <div style={{ background: 'rgba(192,57,43,0.07)', border: '1px solid rgba(192,57,43,0.2)', borderRadius: 9, padding: '10px 13px', marginBottom: 12 }}>
              <p style={{ fontSize: '0.75rem', color: '#C0392B', margin: 0 }}>❌ {error}</p>
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(30,58,47,0.07)', border: '1px solid rgba(30,58,47,0.15)', borderRadius: 9, padding: '10px 13px', marginBottom: 12 }}>
              <p style={{ fontSize: '0.75rem', color: '#1E3A2F', fontWeight: 600, margin: 0 }}>✅ {success}</p>
            </div>
          )}

          {/* Boutons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px', borderRadius: 10,
              border: '1.5px solid rgba(30,58,47,0.15)',
              background: 'transparent', color: '#4A3F35',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}>Annuler</button>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 2, padding: '12px', borderRadius: 10, border: 'none',
              background: loading ? 'rgba(30,58,47,0.4)' : 'linear-gradient(135deg, #1E3A2F, #2D5241)',
              color: '#F5F0E8', fontSize: '0.85rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading
                ? <><div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid rgba(245,240,232,0.3)', borderTopColor: '#F5F0E8', animation: 'spin 0.7s linear infinite' }} />Enregistrement...</>
                : '📈 Enregistrer la valorisation'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
