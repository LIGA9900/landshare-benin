// ═══════════════════════════════════════════════════════════════════
// AuthContext.jsx — État global authentification
// ═══════════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/landshareApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Au chargement : récupérer l'utilisateur connecté
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const { data } = await authApi.me()
          setUser(data.user)
        } catch {
          // Token invalide → déconnexion
          logout()
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  // Connexion
  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  // Inscription
  const register = async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin',
      isKycValidated: user?.kyc_status === 'validated',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook pour utiliser le contexte facilement
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être dans AuthProvider')
  return ctx
}