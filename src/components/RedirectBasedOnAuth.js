/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from 'react'
import { Navigate } from 'react-router-dom'

const RedirectBasedOnAuth = () => {
  const token = localStorage.getItem('tokenadmin')

  return token ? <Navigate to="/charts" /> : <Navigate to="/login" />
}

export default RedirectBasedOnAuth
