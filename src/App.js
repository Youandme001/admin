import React, { Suspense, lazy } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import { CSpinner } from '@coreui/react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminLayout from './layout/AdminLayout'
import Login from './pages/Login'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Orders = lazy(() => import('./pages/Orders'))
const Products = lazy(() => import('./pages/Products'))
const ProductForm = lazy(() => import('./pages/ProductForm'))
const Categories = lazy(() => import('./pages/Categories'))
const Customers = lazy(() => import('./pages/Customers'))

const Loader = () => (
  <div className="page-loader">
    <CSpinner color="primary" />
  </div>
)

function RequireAdmin({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <Loader />
  return admin ? children : <Navigate to="/login" replace />
}

RequireAdmin.propTypes = { children: PropTypes.node }

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/commandes" element={<Orders />} />
              <Route path="/produits" element={<Products />} />
              <Route path="/produits/nouveau" element={<ProductForm />} />
              <Route path="/produits/:id/modifier" element={<ProductForm />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/clientes" element={<Customers />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar theme="colored" />
    </AuthProvider>
  )
}
