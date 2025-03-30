/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CCard,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from 'src/config'
import { toast } from 'react-toastify'

const CommandeListTable = () => {
  const [commandes, setCommandes] = useState([])
  const [token, setToken] = useState()
  const [selectedCommande, setSelectedCommande] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('tokenadmin')
    setToken(token)
    const fetchCommandes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/commande`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.data && response.data.message === 'Success') {
          setCommandes(response.data.data)
        } else if (response.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`)
        }
      } catch (error) {
        console.error('Error fetching commandes:', error)
        toast.error('Error fetching commandes: ' + error.message)
      }
    }
    fetchCommandes()

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const confirmedCommandes = commandes.filter((commande) => commande.state !== 'pending')

  return (
    <CContainer className="mt-4">
      {!isMobile ? (
        <CTable responsive bordered hover>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Total (DT)</CTableHeaderCell>
              <CTableHeaderCell>Statut</CTableHeaderCell>
              <CTableHeaderCell>Client</CTableHeaderCell>
              <CTableHeaderCell>Produits</CTableHeaderCell>
              <CTableHeaderCell>Détails</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {confirmedCommandes.map((commande) => (
              <CTableRow key={commande.id}>
                <CTableDataCell>
                  {commande.commandeDate
                    ? new Date(commande.commandeDate).toLocaleDateString()
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>{commande.totalPrice} DT</CTableDataCell>
                <CTableDataCell>{commande.state || 'Pending'}</CTableDataCell>
                <CTableDataCell>
                  {commande.user
                    ? `${commande.user.firstName} ${commande.user.lastName}`
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {commande.products.map((product, index) => (
                    <div key={index}>
                      {product.name} ({product.quantity})
                    </div>
                  ))}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="info"
                    onClick={() => {
                      setSelectedCommande(commande)
                      setVisible(true)
                    }}
                  >
                    Voir
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        confirmedCommandes.map((commande) => (
          <CCard key={commande.id} className="mb-3">
            <CCardBody>
              <CCardTitle>Date: {commande.commandeDate || 'N/A'}</CCardTitle>
              <p>Total: {commande.totalPrice} DT</p>
              <p>Statut: {commande.state}</p>
              <p>Client: {commande.user?.firstName} {commande.user?.lastName}</p>
              <CListGroup className="mb-2">
                {commande.products.map((product, index) => (
                  <CListGroupItem key={index}>
                    {product.name} ({product.quantity})
                  </CListGroupItem>
                ))}
              </CListGroup>
              <CButton
                size="sm"
                color="info"
                onClick={() => {
                  setSelectedCommande(commande)
                  setVisible(true)
                }}
              >
                Voir les détails
              </CButton>
            </CCardBody>
          </CCard>
        ))
      )}

      {/* Modal for details */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Détails de la commande</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedCommande && (
            <>
              <h6>👤 Client :</h6>
              <p>
                <strong>Nom:</strong> {selectedCommande.user?.firstName} {selectedCommande.user?.lastName}<br />
                <strong>Email:</strong> {selectedCommande.user?.email || 'Non renseigné'}<br />
                <strong>Téléphone:</strong> {selectedCommande.user?.phone}<br />
                <strong>Adresse:</strong> {selectedCommande.user?.address}<br />
                <strong>Ville:</strong> {selectedCommande.user?.city}, {selectedCommande.user?.gouvernorat}<br />
                <strong>Code Postal:</strong> {selectedCommande.user?.postalCode}
              </p>

              <h6>🧾 Produits :</h6>
              <ul>
                {selectedCommande.products.map((p, i) => (
                  <li key={i}>
                    {p.name} — {p.quantity} unité(s)
                  </li>
                ))}
              </ul>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default CommandeListTable
