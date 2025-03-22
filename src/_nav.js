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
import { Navigate } from 'react-router-dom';

const _nav = [
  {
    component: CNavItem,
    name: 'charte',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Employee',
  //   icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Add Employee',
  //       to: '/adduser',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'List Employee',
  //       to: '/listuser',
  //     },
  //   ],
  // },
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
        name: 'liste des commandes',
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
    to: '/',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },

]

export default _nav
