import React, { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout, cilBasket, cilExternalLink, cilMenu, cilPeople, cilSpeedometer, cilTags, cilLayers } from '@coreui/icons'
import { useAuth } from '../context/AuthContext'
import logoLight from '../assets/logo-light.png'

const NAV = [
  { to: '/dashboard', label: 'Tableau de bord', icon: cilSpeedometer },
  { to: '/commandes', label: 'Commandes', icon: cilBasket },
  { to: '/produits', label: 'Produits', icon: cilTags },
  { to: '/categories', label: 'Catégories', icon: cilLayers },
  { to: '/clientes', label: 'Clientes', icon: cilPeople },
]

const SHOP_URL = process.env.REACT_APP_SHOP_URL || 'http://localhost:3000'

export default function AdminLayout() {
  const [visible, setVisible] = useState(() => window.innerWidth >= 992)
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const current = NAV.find((n) => pathname.startsWith(n.to))

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <CSidebar
        position="fixed"
        visible={visible}
        onVisibleChange={(v) => window.innerWidth < 992 && setVisible(v)}
        className="admin-sidebar"
      >
        <CSidebarBrand className="admin-brand">
          <img src={logoLight} alt="Glowy" />
          <span>Back-office</span>
        </CSidebarBrand>
        <CSidebarNav>
          {NAV.map((item) => (
            <CNavItem key={item.to}>
              <NavLink to={item.to} className="nav-link">
                <CIcon icon={item.icon} customClassName="nav-icon" />
                {item.label}
              </NavLink>
            </CNavItem>
          ))}
          <CNavItem className="mt-auto">
            <a href={SHOP_URL} target="_blank" rel="noreferrer" className="nav-link">
              <CIcon icon={cilExternalLink} customClassName="nav-icon" />
              Voir la boutique
            </a>
          </CNavItem>
        </CSidebarNav>
      </CSidebar>

      <div className={`admin-wrapper d-flex flex-column min-vh-100 ${visible ? 'with-sidebar' : ''}`}>
        <CHeader position="sticky" className="admin-header">
          <div className="d-flex align-items-center gap-3">
            <CHeaderToggler onClick={() => setVisible(!visible)} aria-label="Menu">
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
            <h1 className="admin-title">{current?.label || 'Glowy'}</h1>
          </div>
          <CHeaderNav>
            <CDropdown variant="nav-item" alignment="end">
              <CDropdownToggle caret={false} className="d-flex align-items-center gap-2">
                <CAvatar color="primary" textColor="white" size="md">
                  {admin?.email?.[0]?.toUpperCase()}
                </CAvatar>
                <span className="d-none d-md-inline text-body">{admin?.email}</span>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem as="button" onClick={onLogout}>
                  <CIcon icon={cilAccountLogout} className="me-2" />
                  Se déconnecter
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>
        </CHeader>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
