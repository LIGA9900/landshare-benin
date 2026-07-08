import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// ─── Ajouter le token automatiquement ─────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Si token expiré → déconnecter automatiquement ────────────────
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré → nettoyer et rediriger
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

export default api