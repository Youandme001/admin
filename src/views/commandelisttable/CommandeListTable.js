/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from 'src/config';
import { toast } from 'react-toastify';

const CommandeListTable = () => {
  const [commandes, setCommandes] = useState([]);
  const [token, setToken] = useState();
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token =localStorage.getItem('tokenadmin');
    setToken(token);
    console.log(token);
    const fetchCommandes = async () => {
      try {
        // Replace 'http://localhost:4000' with your actual backend URL
        const response = await axios.get(`${API_BASE_URL}/commande`, {
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        if (response.data && response.data.message === 'Success') {
          setCommandes(response.data.data);
        } else if (response.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`);
        }
      } catch (error) {
        console.error('Error fetching commandes:', error);
        toast.error('Error fetching commandes: ' + error.message);
      }
    };
    fetchCommandes();
  }, []);

  return (
    <CContainer className="mt-4">
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
          {commandes
            .filter((commande) => commande.state !== 'pending')
            .map((commande) => (
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
                      setSelectedCommande(commande);
                      setVisible(true);
                    }}
                  >
                    Voir
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>

      {/* Modal pour détails */}
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
  );
};

export default CommandeListTable;
