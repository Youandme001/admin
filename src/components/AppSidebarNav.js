/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CBadge, CNavItem, CNavLink } from '@coreui/react'

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const navLink = (name, icon, badge) => (
    <>
      {icon && icon}
      {name && <span className="ms-2">{name}</span>}
      {badge && (
        <CBadge color={badge.color} className="ms-auto">
          {badge.text}
        </CBadge>
      )}
    </>
  )

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component

    return (
      <Component
        key={index}
        {...(rest.to && !rest.items && {
          component: NavLink,
        })}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }

  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component

    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((child, childIndex) =>
          child.items ? navGroup(child, childIndex) : navItem(child, childIndex),
        )}
      </Component>
    )
  }

  return (
    <>
      {items?.map((item, index) => {
        if (item.logout) {
          return (
            <CNavItem key={index}>
              <CNavLink
                role="button"
                onClick={() => {
                  localStorage.removeItem('tokenadmin')
                  navigate('/')
                }}
                style={{ cursor: 'pointer' }}
              >
                {item.icon}
                <span className="ms-2">{item.name}</span>
              </CNavLink>
            </CNavItem>
          )
        }
        return item.items ? navGroup(item, index) : navItem(item, index)
      })}
    </>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
