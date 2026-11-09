import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilImage } from '@coreui/icons'
import { toast } from 'react-toastify'
import { categoriesApi, productsApi } from '../api'
import { errorMessage } from '../api/client'
import { Loading, PageHeader } from '../components/ui'

const EMPTY = { name: '', designation: '', description: '', propertiesCosmetics: '', price: '', volume: '', categoryId: '' }

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [currentImages, setCurrentImages] = useState([])
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const jobs = [categoriesApi.list().then(setCategories)]
    if (editing) {
      jobs.push(
        productsApi.get(id).then((p) => {
          setForm({
            name: p.name || '',
            designation: p.designation || '',
            description: p.description || '',
            propertiesCosmetics: p.propertiesCosmetics || '',
            price: p.price ?? '',
            volume: p.volume ?? '',
            categoryId: p.categoryId ?? '',
          })
          setCurrentImages(p.images || [])
        }),
      )
    }
    Promise.all(jobs)
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, editing])

  // Local previews of the files picked
  const [previews, setPreviews] = useState([])
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => data.append(k, v))
    files.forEach((f) => data.append('images', f))
    setSaving(true)
    try {
      if (editing) await productsApi.update(id, data)
      else await productsApi.create(data)
      toast.success(editing ? 'Produit mis à jour' : 'Produit ajouté')
      navigate('/produits')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  const shown = previews.length > 0 ? previews : currentImages.map((i) => i.filepath)

  return (
    <>
      <PageHeader
        title={editing ? 'Modifier le produit' : 'Nouveau produit'}
        subtitle={
          <Link to="/produits" className="back-link">
            <CIcon icon={cilArrowLeft} /> Retour aux produits
          </Link>
        }
      />
      <CForm onSubmit={onSubmit}>
        <CRow className="g-3">
          <CCol lg={8}>
            <CCard className="mb-3">
              <CCardHeader>Informations</CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <CFormLabel htmlFor="name">Nom du produit *</CFormLabel>
                  <CFormInput id="name" required value={form.name} onChange={set('name')} placeholder="Ex. Gloss Rosy" />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="designation">Désignation courte</CFormLabel>
                  <CFormInput
                    id="designation"
                    value={form.designation}
                    onChange={set('designation')}
                    placeholder="Ex. Gloss rose transparent"
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="description">Description</CFormLabel>
                  <CFormTextarea id="description" rows={4} value={form.description} onChange={set('description')} />
                </div>
                <div>
                  <CFormLabel htmlFor="props">Propriétés cosmétiques</CFormLabel>
                  <CFormInput
                    id="props"
                    value={form.propertiesCosmetics}
                    onChange={set('propertiesCosmetics')}
                    placeholder="Ex. Hydratant, non collant"
                  />
                </div>
              </CCardBody>
            </CCard>
            <CCard>
              <CCardHeader>Photos</CCardHeader>
              <CCardBody>
                <div className="image-grid">
                  {shown.map((src) => (
                    <img key={src} src={src} alt="" />
                  ))}
                  <label className="image-drop">
                    <CIcon icon={cilImage} size="xl" />
                    <span>{shown.length ? 'Remplacer les photos' : 'Ajouter des photos'}</span>
                    <small>JPEG, PNG ou WEBP · 5 Mo max · 6 photos</small>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      hidden
                      onChange={(e) => setFiles([...e.target.files].slice(0, 6))}
                    />
                  </label>
                </div>
                {editing && previews.length > 0 && (
                  <p className="small text-body-secondary mt-2 mb-0">
                    Les nouvelles photos remplaceront les anciennes à l&apos;enregistrement.
                  </p>
                )}
              </CCardBody>
            </CCard>
          </CCol>
          <CCol lg={4}>
            <CCard className="sticky-card">
              <CCardHeader>Vente</CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <CFormLabel htmlFor="price">Prix *</CFormLabel>
                  <CInputGroup>
                    <CFormInput id="price" type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} />
                    <CInputGroupText>DT</CInputGroupText>
                  </CInputGroup>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="volume">Stock</CFormLabel>
                  <CInputGroup>
                    <CFormInput id="volume" type="number" min="0" step="1" value={form.volume} onChange={set('volume')} />
                    <CInputGroupText>unités</CInputGroupText>
                  </CInputGroup>
                </div>
                <div className="mb-4">
                  <CFormLabel htmlFor="category">Catégorie</CFormLabel>
                  <CFormSelect id="category" value={form.categoryId} onChange={set('categoryId')}>
                    <option value="">Sans catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <CButton type="submit" color="primary" className="w-100" disabled={saving}>
                  {saving && <CSpinner size="sm" className="me-2" />}
                  {editing ? 'Enregistrer' : 'Ajouter le produit'}
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}
