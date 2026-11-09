import React, { useCallback, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLayers, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import { toast } from 'react-toastify'
import { categoriesApi, productsApi } from '../api'
import { errorMessage } from '../api/client'
import { ConfirmModal, EmptyState, Loading, PageHeader } from '../components/ui'

export default function Categories() {
  const [categories, setCategories] = useState(null)
  const [counts, setCounts] = useState({})
  const [editing, setEditing] = useState(null) // {} = new, {id,...} = edit
  const [toDelete, setToDelete] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(
    () =>
      Promise.all([categoriesApi.list(), productsApi.list()])
        .then(([c, p]) => {
          setCategories(c)
          const n = {}
          p.forEach((x) => (n[x.categoryId] = (n[x.categoryId] || 0) + 1))
          setCounts(n)
        })
        .catch((err) => toast.error(errorMessage(err))),
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const body = { name: editing.name, description: editing.description }
      if (editing.id) await categoriesApi.update(editing.id, body)
      else await categoriesApi.create(body)
      toast.success(editing.id ? 'Catégorie mise à jour' : 'Catégorie ajoutée')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await categoriesApi.remove(toDelete.id)
      toast.success('Catégorie supprimée')
      setToDelete(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (!categories) return <Loading />

  return (
    <>
      <PageHeader
        title="Catégories"
        subtitle="Les catégories servent de filtres dans la boutique."
        actions={
          <CButton color="primary" onClick={() => setEditing({ name: '', description: '' })}>
            <CIcon icon={cilPlus} className="me-1" /> Nouvelle catégorie
          </CButton>
        }
      />
      <CCard>
        {categories.length === 0 ? (
          <EmptyState icon={cilLayers} title="Aucune catégorie" />
        ) : (
          <CTable hover responsive className="mb-0 align-middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-md-table-cell">Description</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Produits</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {categories.map((c) => (
                <CTableRow key={c.id}>
                  <CTableDataCell className="fw-semibold">{c.name}</CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell text-body-secondary">{c.description || '—'}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <span className="chip">{counts[c.id] || 0}</span>
                  </CTableDataCell>
                  <CTableDataCell className="text-end text-nowrap">
                    <CButton
                      color="secondary"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing({ ...c, description: c.description || '' })}
                      aria-label="Modifier"
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" variant="ghost" size="sm" onClick={() => setToDelete(c)} aria-label="Supprimer">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCard>

      <CModal visible={Boolean(editing)} onClose={() => setEditing(null)} alignment="center">
        <CForm onSubmit={save}>
          <CModalHeader>
            <CModalTitle>{editing?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel htmlFor="cat-name">Nom *</CFormLabel>
              <CFormInput
                id="cat-name"
                required
                value={editing?.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <CFormLabel htmlFor="cat-desc">Description</CFormLabel>
            <CFormTextarea
              id="cat-desc"
              rows={3}
              value={editing?.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant="ghost" onClick={() => setEditing(null)}>
              Annuler
            </CButton>
            <CButton type="submit" color="primary" disabled={busy}>
              {busy && <CSpinner size="sm" className="me-2" />}
              Enregistrer
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <ConfirmModal
        visible={Boolean(toDelete)}
        title="Supprimer cette catégorie ?"
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        busy={busy}
      >
        Les {counts[toDelete?.id] || 0} produit(s) de « {toDelete?.name} » restent en vente, sans catégorie.
      </ConfirmModal>
    </>
  )
}
