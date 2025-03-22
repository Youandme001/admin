/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from 'react'
import { Navigate } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('tokenadmin')

  if (!token) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
