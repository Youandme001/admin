import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilBasket, cilCash, cilClock, cilWarning } from '@coreui/icons'
import { toast } from 'react-toastify'
import { ordersApi, productsApi } from '../api'
import { errorMessage } from '../api/client'
import { Loading, PageHeader, StatusBadge, Thumb } from '../components/ui'
import { formatDate, formatMonth, formatPrice, fullName } from '../utils/format'

function StatCard({ icon, label, value, hint, tone }) {
  return (
    <CCard className={`stat-card stat-${tone}`}>
      <CCardBody>
        <span className="stat-icon">
          <CIcon icon={icon} size="lg" />
        </span>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {hint && <div className="stat-hint">{hint}</div>}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [lowStock, setLowStock] = useState([])

  useEffect(() => {
    Promise.all([ordersApi.stats(), ordersApi.list(), productsApi.list()])
      .then(([s, o, p]) => {
        setStats(s)
        setOrders(o.slice(0, 6))
        setLowStock(p.filter((x) => x.volume <= 5).sort((a, b) => a.volume - b.volume))
      })
      .catch((err) => toast.error(errorMessage(err)))
  }, [])

  if (!stats) return <Loading />

  const change = Number(stats.percentChange)
  const css = getComputedStyle(document.documentElement)
  const primary = css.getPropertyValue('--cui-primary').trim() || '#c2185b'

  return (
    <>
      <PageHeader title="Bonjour 👋" subtitle="Voici l'activité de la boutique." />

      <CRow className="g-3 mb-4">
        <CCol sm={6} xl={3}>
          <StatCard
            icon={cilCash}
            tone="rose"
            label="Chiffre d'affaires"
            value={formatPrice(stats.confirmedTotal)}
            hint={`${stats.confirmedCount} commandes confirmées ou livrées`}
          />
        </CCol>
        <CCol sm={6} xl={3}>
          <StatCard icon={cilClock} tone="amber" label="À traiter" value={stats.pendingCount} hint="commandes en attente" />
        </CCol>
        <CCol sm={6} xl={3}>
          <StatCard
            icon={cilBasket}
            tone="violet"
            label="Aujourd'hui"
            value={stats.todayCount}
            hint={
              <span className={change >= 0 ? 'text-success' : 'text-danger'}>
                {change >= 0 ? '+' : ''}
                {change.toFixed(0)} % par rapport à hier
              </span>
            }
          />
        </CCol>
        <CCol sm={6} xl={3}>
          <StatCard icon={cilWarning} tone="slate" label="Stock faible" value={stats.lowStock} hint="produits à 5 unités ou moins" />
        </CCol>
      </CRow>

      <CRow className="g-3 mb-4">
        <CCol lg={8}>
          <CCard className="h-100">
            <CCardHeader>Chiffre d&apos;affaires des 6 derniers mois</CCardHeader>
            <CCardBody>
              <CChart
                type="bar"
                style={{ height: 280 }}
                data={{
                  labels: stats.monthly.map((m) => formatMonth(m.month)),
                  datasets: [
                    {
                      label: 'CA (DT)',
                      data: stats.monthly.map((m) => m.total),
                      backgroundColor: primary,
                      borderRadius: 8,
                      maxBarThickness: 46,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => formatPrice(c.raw) } } },
                  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (v) => `${v} DT` } } },
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="h-100">
            <CCardHeader>Meilleures ventes</CCardHeader>
            <CCardBody>
              {stats.bestSellers.map((b, i) => {
                const max = stats.bestSellers[0].quantity || 1
                return (
                  <div key={b.id} className="best-row">
                    <div className="d-flex justify-content-between">
                      <span>
                        <strong className="me-2 text-body-secondary">{i + 1}</strong>
                        {b.name || 'Produit supprimé'}
                      </span>
                      <span className="fw-semibold">{b.quantity}</span>
                    </div>
                    <div className="best-bar">
                      <span style={{ width: `${(b.quantity / max) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-3">
        <CCol lg={8}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              Dernières commandes
              <Link to="/commandes" className="small">
                Tout voir
              </Link>
            </CCardHeader>
            <CTable hover responsive className="mb-0 align-middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>N°</CTableHeaderCell>
                  <CTableHeaderCell>Cliente</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
                  <CTableHeaderCell>Statut</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((o) => (
                  <CTableRow key={o.id}>
                    <CTableDataCell className="text-body-secondary">#{o.id}</CTableDataCell>
                    <CTableDataCell>{fullName(o.user)}</CTableDataCell>
                    <CTableDataCell>{formatDate(o.createdAt)}</CTableDataCell>
                    <CTableDataCell className="text-end fw-semibold">{formatPrice(o.totalPrice)}</CTableDataCell>
                    <CTableDataCell>
                      <StatusBadge state={o.state} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard>
            <CCardHeader>Stock à surveiller</CCardHeader>
            <CCardBody>
              {lowStock.length === 0 && <p className="text-body-secondary mb-0">Tous les produits sont bien approvisionnés.</p>}
              {lowStock.map((p) => (
                <Link key={p.id} to={`/produits/${p.id}/modifier`} className="stock-row">
                  <Thumb src={p.images?.[0]?.filepath} alt={p.name} size={40} />
                  <span className="flex-grow-1">{p.name}</span>
                  <span className={`stock-pill ${p.volume === 0 ? 'out' : ''}`}>{p.volume} en stock</span>
                </Link>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
