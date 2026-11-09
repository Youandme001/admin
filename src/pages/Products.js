import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CFormInput,
  CFormSelect,
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
import { cilPencil, cilPlus, cilSearch, cilTags, cilTrash } from '@coreui/icons'
import { toast } from 'react-toastify'
import { categoriesApi, productsApi } from '../api'
import { errorMessage } from '../api/client'
import { ConfirmModal, EmptyState, Loading, PageHeader, Thumb } from '../components/ui'
import { formatPrice } from '../utils/format'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(
    () =>
      Promise.all([productsApi.list(), categoriesApi.list()])
        .then(([p, c]) => {
          setProducts(p)
          setCategories(c)
        })
        .catch((err) => toast.error(errorMessage(err))),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const visible = useMemo(() => {
    if (!products) return []
    const q = search.trim().toLowerCase()
    return products.filter(
      (p) => (!category || String(p.categoryId) === category) && (!q || `${p.name} ${p.designation || ''}`.toLowerCase().includes(q)),
    )
  }, [products, search, category])

  const remove = async () => {
    setBusy(true)
    try {
      await productsApi.remove(toDelete.id)
      toast.success('Produit supprimé')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (!products) return <Loading />

  return (
    <>
      <PageHeader
        title="Produits"
        subtitle={`${products.length} produit(s) au catalogue`}
        actions={
          <CButton color="primary" onClick={() => navigate('/produits/nouveau')}>
            <CIcon icon={cilPlus} className="me-1" /> Nouveau produit
          </CButton>
        }
      />

      <div className="toolbar">
        <CInputGroup className="search-box">
          <CInputGroupText>
            <CIcon icon={cilSearch} />
          </CInputGroupText>
          <CFormInput placeholder="Rechercher un produit…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </CInputGroup>
        <CFormSelect className="category-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Catégorie">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </CFormSelect>
      </div>

      <CCard>
        {visible.length === 0 ? (
          <EmptyState icon={cilTags} title="Aucun produit">
            Ajoutez un produit ou modifiez la recherche.
          </EmptyState>
        ) : (
          <CTable hover responsive className="mb-0 align-middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Produit</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-md-table-cell">Catégorie</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Prix</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Stock</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {visible.map((p) => (
                <CTableRow key={p.id}>
                  <CTableDataCell>
                    <Link to={`/produits/${p.id}/modifier`} className="product-cell">
                      <Thumb src={p.images?.[0]?.filepath} alt={p.name} size={52} />
                      <span>
                        <span className="fw-semibold d-block">{p.name}</span>
                        <span className="small text-body-secondary">{p.designation}</span>
                      </span>
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell">
                    {p.Category ? <span className="chip">{p.Category.name}</span> : <span className="text-body-secondary">—</span>}
                  </CTableDataCell>
                  <CTableDataCell className="text-end fw-semibold">{formatPrice(p.price)}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span className={`stock-pill ${p.volume === 0 ? 'out' : p.volume <= 5 ? 'low' : 'ok'}`}>{p.volume}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-nowrap">
                    <CButton
                      color="secondary"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/produits/${p.id}/modifier`)}
                      aria-label="Modifier"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" variant="ghost" size="sm" onClick={() => setToDelete(p)} aria-label="Supprimer">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCard>

      <ConfirmModal
        visible={Boolean(toDelete)}
        title="Supprimer ce produit ?"
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        busy={busy}
      >
        « {toDelete?.name} » sera retiré de la boutique avec ses photos. Les commandes passées restent consultables.
      </ConfirmModal>
    </>
  )
}
