import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { authApi } from '../api'
import { tokenStore } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(Boolean(tokenStore.get()))

  // Validate a stored token against the API instead of trusting it
  useEffect(() => {
    if (!tokenStore.get()) return
    authApi
      .me()
      .then(setAdmin)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, admin: profile } = await authApi.login(email, password)
    tokenStore.set(token)
    setAdmin(profile)
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setAdmin(null)
  }, [])

  const value = useMemo(() => ({ admin, loading, login, logout }), [admin, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = { children: PropTypes.node }

export const useAuth = () => useContext(AuthContext)
