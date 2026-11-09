import React from 'react'
import PropTypes from 'prop-types'
import { CBadge, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilImage } from '@coreui/icons'
import { ORDER_STATES } from '../utils/format'

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

PageHeader.propTypes = { title: PropTypes.node, subtitle: PropTypes.node, actions: PropTypes.node }

export function StatusBadge({ state }) {
  const s = ORDER_STATES[state] || { label: state, color: 'secondary' }
  return (
    <CBadge color={s.color} shape="rounded-pill" className={`status-badge status-${s.color}`}>
      {s.label}
    </CBadge>
  )
}

StatusBadge.propTypes = { state: PropTypes.string }

export function Thumb({ src, alt, size = 44 }) {
  return src ? (
    <img src={src} alt={alt} className="thumb" style={{ width: size, height: size }} />
  ) : (
    <span className="thumb thumb-empty" style={{ width: size, height: size }}>
      <CIcon icon={cilImage} />
    </span>
  )
}

Thumb.propTypes = { src: PropTypes.string, alt: PropTypes.string, size: PropTypes.number }

export function Loading() {
  return (
    <div className="page-loader">
      <CSpinner color="primary" />
    </div>
  )
}

export function EmptyState({ icon, title, children }) {
  return (
    <div className="empty-state">
      {icon && <CIcon icon={icon} size="3xl" />}
      <h5>{title}</h5>
      {children && <p>{children}</p>}
    </div>
  )
}

EmptyState.propTypes = { icon: PropTypes.any, title: PropTypes.node, children: PropTypes.node }

export function ConfirmModal({ visible, title, children, confirmLabel = 'Supprimer', onConfirm, onClose, busy }) {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{children}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={onClose}>
          Annuler
        </CButton>
        <CButton color="danger" className="text-white" onClick={onConfirm} disabled={busy}>
          {busy && <CSpinner size="sm" className="me-2" />}
          {confirmLabel}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

ConfirmModal.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.node,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  busy: PropTypes.bool,
}
