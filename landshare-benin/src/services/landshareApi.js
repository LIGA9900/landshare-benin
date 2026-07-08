// ═══════════════════════════════════════════════════════════════════
// landshareApi.js — Tous les appels API LandShare
// Utilise l'instance axios déjà configurée
// ═══════════════════════════════════════════════════════════════════
import api from '../api/axios'

// ══════════════════════════════
// AUTH
// ══════════════════════════════
export const authApi = {

  // Inscription
  register: (data) => api.post('/auth/register', data),

  // Connexion
  login: (data) => api.post('/auth/login', data),

  // Déconnexion
  logout: () => api.post('/auth/logout'),

  // Utilisateur connecté
  me: () => api.get('/auth/me'),

  // Changer mot de passe
  changePassword: (data) => api.put('/auth/change-password', data),
}

// ══════════════════════════════
// TERRAINS
// ══════════════════════════════
export const landsApi = {

  // Liste des terrains publiés
  getAll: (params = {}) => api.get('/lands', { params }),

  // Détail d'un terrain
  getOne: (id) => api.get(`/lands/${id}`),

  // Admin : tous les terrains
  adminGetAll: () => api.get('/admin/lands'),

  // Admin : créer un terrain
  // Admin : créer un terrain (FormData avec fichiers)
  create: (data) => api.post('/admin/lands', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Admin : modifier un terrain
  // Admin : modifier un terrain (FormData avec fichiers optionnels)
  update: (id, data) => api.post(`/admin/lands/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Admin : publier un terrain
  publish: (id) => api.post(`/admin/lands/${id}/publish`),

  // Admin : archiver un terrain
  archive: (id) => api.post(`/admin/lands/${id}/archive`),
}

// ══════════════════════════════
// DASHBOARD INVESTISSEUR
// ══════════════════════════════
export const userApi = {

  // Dashboard principal
  getDashboard: () => api.get('/dashboard'),

  // Portefeuille complet
  getPortfolio: () => api.get('/portfolio'),

  // Mettre à jour le profil
  updateProfile: (data) => api.put('/profile', data),

  // Admin : liste utilisateurs
  adminGetAll: (params = {}) => api.get('/admin/users', { params }),

  // Admin : détail utilisateur
  adminGetOne: (id) => api.get(`/admin/users/${id}`),

  // Admin : suspendre/activer
  adminToggle: (id) => api.put(`/admin/users/${id}/toggle`),
}

// ══════════════════════════════
// RÉSERVATIONS
// ══════════════════════════════
export const reservationsApi = {

  // Créer une réservation (verrou 10 min)
  create: (data) => api.post('/reservations', data),

  // Vérifier statut
  getOne: (id) => api.get(`/reservations/${id}`),

  // Annuler
  cancel: (id) => api.delete(`/reservations/${id}/cancel`),
}

// ══════════════════════════════
// INVESTISSEMENTS
// ══════════════════════════════
export const investmentsApi = {

  // Mes investissements
  getAll: () => api.get('/investments'),

  // Créer un investissement
  create: (data) => api.post('/investments', data),

  // Détail
  getOne: (id) => api.get(`/investments/${id}`),

  // Confirmer
  confirm: (id) => api.post(`/investments/${id}/confirm`),

  // Télécharger attestation PDF
  downloadAttestation: (id) => api.get(
    `/investments/${id}/attestation`,
    { responseType: 'blob' }
  ),

  // Admin : tous les investissements
  adminGetAll: () => api.get('/admin/investments'),
}

// ══════════════════════════════
// PAIEMENTS
// ══════════════════════════════
export const paymentsApi = {

  // Initier un paiement
  initiate: (data) => api.post('/payments/initiate', data),

  // Statut d'un paiement
  getStatus: (id) => api.get(`/payments/${id}/status`),

  // Admin : tous les paiements
  adminGetAll: (params = {}) => api.get('/admin/payments', { params }),
}

// ══════════════════════════════
// KYC
// ══════════════════════════════
export const kycApi = {

  // Mon statut KYC
  getStatus: () => api.get('/kyc/status'),

  // Soumettre un document
  submit: (formData) => api.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Admin : liste KYC
  adminGetAll: (status = 'pending') => api.get('/admin/kyc', {
    params: { status }
  }),

  // Admin : valider
  adminValidate: (id) => api.post(`/admin/kyc/${id}/validate`),

  // Admin : rejeter
  adminReject: (id, reason) => api.post(`/admin/kyc/${id}/reject`, { reason }),
}