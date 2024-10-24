/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilAccountLogout,
  cilContact,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Employee',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Employee',
        to: '/adduser',
      },
      {
        component: CNavItem,
        name: 'List Employee',
        to: '/listuser',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Mission',
    to: '/mission',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ajouter produit',
        to: '/addproduct',
       
      },
      {
        component: CNavItem,
        name: 'list produit',
        to: '/listproduct',
       
      },
      {
        component: CNavItem,
        name: 'list commande',
        to: '/listcommande',
       
      },
      {
        component: CNavItem,
        name: 'list commande',
        to: '/commandelisttable',
       
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },

]

export default _nav
