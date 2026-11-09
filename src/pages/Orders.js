import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBasket, cilLocationPin, cilPhone, cilEnvelopeClosed, cilPrint, cilSearch, cilTrash } from '@coreui/icons'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import { ordersApi } from '../api'
import { errorMessage } from '../api/client'
import { ConfirmModal, EmptyState, Loading, PageHeader, StatusBadge, Thumb } from '../components/ui'
import { formatDate, formatPrice, fullName, itemsCount, NEXT_STATES, ORDER_STATES } from '../utils/format'
import logoDark from '../assets/logo-dark.png'

const FILTERS = [{ key: 'all', label: 'Toutes' }, ...Object.entries(ORDER_STATES).map(([key, s]) => ({ key, label: s.label }))]

const ACTION_LABEL = {
  Confirmed: 'Confirmer',
  Delivered: 'Marquer livrée',
  Rejected: 'Rejeter',
  pending: 'Remettre en attente',
}

function OrderDetail({ order, onClose, onChanged }) {
  const printRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const print = useReactToPrint({ content: () => printRef.current, documentTitle: `Commande-${order?.id}` })

  if (!order) return null
  const subtotal = order.products.reduce((s, p) => s + Number(p.price) * p.quantity, 0)

  const changeState = async (state) => {
    setBusy(true)
    try {
      await ordersApi.setState(order.id, state)
      toast.success(`Commande #${order.id} : ${ORDER_STATES[state].label.toLowerCase()}`)
      onChanged()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await ordersApi.remove(order.id)
      toast.success('Commande supprimée')
      setConfirmDelete(false)
      onClose()
      onChanged()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <COffcanvas placement="end" visible onHide={onClose} className="order-panel">
        <COffcanvasHeader>
          <COffcanvasTitle>
            Commande #{order.id} <StatusBadge state={order.state} />
          </COffcanvasTitle>
          <CCloseButton className="text-reset" onClick={onClose} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div ref={printRef} className="print-area">
            <div className="print-only print-head">
              <img src={logoDark} alt="Glowy" />
              <div>
                <strong>Bon de livraison — commande #{order.id}</strong>
                <div>{formatDate(order.createdAt, true)}</div>
              </div>
            </div>
            <p className="text-body-secondary small mb-3 no-print">Passée le {formatDate(order.createdAt, true)}</p>

            <section className="panel-block">
              <h6>Cliente</h6>
              <div className="fw-semibold">{fullName(order.user)}</div>
              {order.user && (
                <ul className="contact-list">
                  <li>
                    <CIcon icon={cilPhone} /> {order.user.phone}
                  </li>
                  {order.user.email && (
                    <li>
                      <CIcon icon={cilEnvelopeClosed} /> {order.user.email}
                    </li>
                  )}
                  <li>
                    <CIcon icon={cilLocationPin} /> {order.user.address}, {order.user.postalCode} {order.user.city},{' '}
                    {order.user.gouvernorat}
                  </li>
                </ul>
              )}
            </section>

            <section className="panel-block">
              <h6>Articles ({itemsCount(order)})</h6>
              {order.products.map((p, i) => (
                <div key={`${p.id}-${i}`} className="line-item">
                  <Thumb src={p.image} alt={p.name} size={48} />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{p.name}</div>
                    <div className="small text-body-secondary">
                      {p.quantity} × {formatPrice(p.price)}
                    </div>
                  </div>
                  <div className="fw-semibold">{formatPrice(Number(p.price) * p.quantity)}</div>
                </div>
              ))}
              <div className="totals">
                <div>
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div>
                  <span>Livraison</span>
                  <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="grand">
                  <span>Total à encaisser</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="panel-actions">
            {NEXT_STATES[order.state].map((s) => (
              <CButton
                key={s}
                color={ORDER_STATES[s].color}
                variant={s === 'Rejected' || s === 'pending' ? 'outline' : undefined}
                className={s === 'Rejected' || s === 'pending' ? '' : 'text-white'}
                disabled={busy}
                onClick={() => changeState(s)}
              >
                {ACTION_LABEL[s]}
              </CButton>
            ))}
            <CButton color="secondary" variant="outline" onClick={print}>
              <CIcon icon={cilPrint} className="me-1" /> Bon de livraison
            </CButton>
            <CButton color="danger" variant="ghost" onClick={() => setConfirmDelete(true)}>
              <CIcon icon={cilTrash} />
            </CButton>
          </div>
        </COffcanvasBody>
      </COffcanvas>
      <ConfirmModal
        visible={confirmDelete}
        title={`Supprimer la commande #${order.id} ?`}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        busy={busy}
      >
        Cette action est définitive. Pour annuler une commande, préférez « Rejeter ».
      </ConfirmModal>
    </>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const load = useCallback(
    () =>
      ordersApi
        .list()
        .then(setOrders)
        .catch((err) => toast.error(errorMessage(err))),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const c = { all: orders?.length || 0 }
    orders?.forEach((o) => (c[o.state] = (c[o.state] || 0) + 1))
    return c
  }, [orders])

  const visible = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    return orders.filter(
      (o) =>
        (filter === 'all' || o.state === filter) &&
        (!q || `#${o.id} ${fullName(o.user)} ${o.user?.phone || ''} ${o.user?.city || ''}`.toLowerCase().includes(q)),
    )
  }, [orders, filter, search])

  if (!orders) return <Loading />
  const selected = orders.find((o) => o.id === selectedId)

  return (
    <>
      <PageHeader title="Commandes" subtitle={`${counts.pending || 0} commande(s) en attente de traitement`} />

      <div className="toolbar">
        <CButtonGroup className="filter-group" role="group">
          {FILTERS.map((f) => (
            <CButton key={f.key} color="primary" variant={filter === f.key ? undefined : 'outline'} onClick={() => setFilter(f.key)}>
              {f.label} <span className="filter-count">{counts[f.key] || 0}</span>
            </CButton>
          ))}
        </CButtonGroup>
        <CInputGroup className="search-box">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput placeholder="N°, nom, téléphone, ville…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </CInputGroup>
      </div>

      <CCard>
        {visible.length === 0 ? (
          <EmptyState icon={cilBasket} title="Aucune commande">
            Aucune commande ne correspond à ce filtre.
          </EmptyState>
        ) : (
          <CTable hover responsive className="mb-0 align-middle clickable-rows">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>N°</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-md-table-cell">Ville</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Articles</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                <CTableHeaderCell>Statut</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {visible.map((o) => (
                <CTableRow key={o.id} onClick={() => setSelectedId(o.id)}>
                  <CTableDataCell className="text-body-secondary">#{o.id}</CTableDataCell>
                  <CTableDataCell>{formatDate(o.createdAt, true)}</CTableDataCell>
                  <CTableDataCell>
                    <div className="fw-semibold">{fullName(o.user)}</div>
                    <div className="small text-body-secondary">{o.user?.phone}</div>
                  </CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell">
                    {o.user ? `${o.user.city}, ${o.user.gouvernorat}` : '—'}
                  </CTableDataCell>
                  <CTableDataCell className="text-center">{itemsCount(o)}</CTableDataCell>
                  <CTableDataCell className="text-end fw-semibold">{formatPrice(o.totalPrice)}</CTableDataCell>
                  <CTableDataCell>
                    <StatusBadge state={o.state} />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCard>

      {selected && <OrderDetail order={selected} onClose={() => setSelectedId(null)} onChanged={load} />}
    </>
  )
}
