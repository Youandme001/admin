/* eslint-disable prettier/prettier */
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilChartPie,
  cilCursor,
  cilAccountLogout,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'charte',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Mission',
    to: '/mission',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ajouter un produit',
        to: '/addproduct',
      },
      {
        component: CNavItem,
        name: 'liste des produits',
        to: '/listproduct',
      },
      {
        component: CNavItem,
        name: 'Liste des commandes en attentes',
        to: '/listcommande',
      },
      {
        component: CNavItem,
        name: 'liste des commandes',
        to: '/commandelisttable',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    logout: true, // 👈 Custom flag we'll handle manually
  },
]

export default _nav
