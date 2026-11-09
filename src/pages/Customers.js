import React, { useEffect, useMemo, useState } from 'react'
import {
  CAvatar,
  CCard,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilSearch } from '@coreui/icons'
import { toast } from 'react-toastify'
import { customersApi, ordersApi } from '../api'
import { errorMessage } from '../api/client'
import { EmptyState, Loading, PageHeader } from '../components/ui'
import { formatDate, formatPrice } from '../utils/format'

export default function Customers() {
  const [customers, setCustomers] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([customersApi.list(), ordersApi.list()])
      .then(([users, orders]) => {
        // Orders and spend per customer (rejected orders excluded from the spend)
        const byUser = {}
        orders.forEach((o) => {
          const s = (byUser[o.user?.id] ||= { count: 0, spent: 0, last: null })
          s.count += 1
          if (o.state !== 'Rejected') s.spent += Number(o.totalPrice)
          if (!s.last || o.createdAt > s.last) s.last = o.createdAt
        })
        setCustomers(
          users.map((u) => ({ ...u, ...(byUser[u.id] || { count: 0, spent: 0, last: null }) })).sort((a, b) => b.spent - a.spent),
        )
      })
      .catch((err) => toast.error(errorMessage(err)))
  }, [])

  const visible = useMemo(() => {
    if (!customers) return []
    const q = search.trim().toLowerCase()
    return customers.filter((c) => !q || `${c.firstName} ${c.lastName} ${c.phone} ${c.email || ''} ${c.city}`.toLowerCase().includes(q))
  }, [customers, search])

  if (!customers) return <Loading />

  return (
    <>
      <PageHeader title="Clientes" subtitle={`${customers.length} cliente(s), avec ou sans compte`} />
      <div className="toolbar">
        <CInputGroup className="search-box">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput placeholder="Nom, téléphone, e-mail, ville…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </CInputGroup>
      </div>
      <CCard>
        {visible.length === 0 ? (
          <EmptyState icon={cilPeople} title="Aucune cliente" />
        ) : (
          <CTable hover responsive className="mb-0 align-middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Contact</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-lg-table-cell">Ville</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Commandes</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total dépensé</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-md-table-cell">Dernière commande</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {visible.map((c) => (
                <CTableRow key={c.id}>
                  <CTableDataCell>
                    <div className="d-flex align-items-center gap-2">
                      <CAvatar color="primary" textColor="white" size="md">
                        {c.firstName[0]}
                        {c.lastName[0]}
                      </CAvatar>
                      <div>
                        <div className="fw-semibold">
                          {c.firstName} {c.lastName}
                        </div>
                        <span className={`chip ${c.email ? '' : 'chip-muted'}`}>{c.email ? 'Compte' : 'Invitée'}</span>
                      </div>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{c.phone}</div>
                    <div className="small text-body-secondary">{c.email || '—'}</div>
                  </CTableDataCell>
                  <CTableDataCell className="d-none d-lg-table-cell">
                    {c.city}, {c.gouvernorat}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{c.count}</CTableDataCell>
                  <CTableDataCell className="text-end fw-semibold">{formatPrice(c.spent)}</CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell">{formatDate(c.last)}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCard>
    </>
  )
}
