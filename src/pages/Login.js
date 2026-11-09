import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CAlert, CButton, CForm, CFormInput, CFormLabel, CSpinner } from '@coreui/react'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../api/client'
import logoLight from '../assets/logo-light.png'
import logoDark from '../assets/logo-dark.png'

export default function Login() {
  const { admin, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (admin) return <Navigate to="/dashboard" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(form.email.trim(), form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(errorMessage(err, 'Connexion impossible'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <aside className="login-brand">
        <img src={logoLight} alt="Glowy" />
        <p>Gérez la boutique : commandes, produits, stock et clientes, au même endroit.</p>
      </aside>
      <section className="login-form">
        <CForm onSubmit={onSubmit} className="login-card">
          <img src={logoDark} alt="Glowy" className="login-logo-mobile" />
          <h1>Connexion</h1>
          <p className="text-body-secondary mb-4">Espace réservé à l&apos;administration de la boutique.</p>
          {error && <CAlert color="danger">{error}</CAlert>}
          <div className="mb-3">
            <CFormLabel htmlFor="email">Adresse e-mail</CFormLabel>
            <CFormInput
              id="email"
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <CFormLabel htmlFor="password">Mot de passe</CFormLabel>
            <CFormInput
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <CButton type="submit" color="primary" className="w-100 py-2" disabled={busy}>
            {busy && <CSpinner size="sm" className="me-2" />}
            Se connecter
          </CButton>
        </CForm>
      </section>
    </div>
  )
}
