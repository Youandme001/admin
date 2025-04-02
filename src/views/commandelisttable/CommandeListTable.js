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
  CFormInput,
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
  const [filters, setFilters] = useState({ date: '', totalPrice: '', state: '', client: '', produits: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('tokenadmin');
    setToken(token);
    const fetchCommandes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/commande`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data?.message === 'Success') {
          setCommandes(response.data.data);
        } else if (response.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`);
        }
      } catch (error) {
        console.error('Error fetching commandes:', error);
        toast.error('Erreur : ' + error.message);
      }
    };
    fetchCommandes();
  }, []);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const renderSortButton = (key, label) => (
    <CButton
      color="link"
      className="p-0 fw-semibold text-dark d-flex align-items-center gap-1"
      onClick={() => handleSort(key)}
      style={{ textDecoration: 'none' }}
    >
      {label}
      {sortConfig.key === key ? (
        <span>{sortConfig.direction === 'asc' ? '🔼' : '🔽'}</span>
      ) : (
        <span style={{ opacity: 0.3 }}>⬍</span>
      )}
    </CButton>
  );

  const filteredSortedCommandes = [...commandes]
    .filter((commande) => commande.state !== 'pending')
    .filter((commande) => {
      return (
        new Date(commande.commandeDate).toLocaleDateString().includes(filters.date) &&
        commande.totalPrice.toString().includes(filters.totalPrice) &&
        commande.state.toLowerCase().includes(filters.state.toLowerCase()) &&
        `${commande.user?.firstName || ''} ${commande.user?.lastName || ''}`.toLowerCase().includes(filters.client.toLowerCase()) &&
        commande.products.some((p) => p.name.toLowerCase().includes(filters.produits.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const aVal = sortConfig.key === 'client'
        ? `${a.user?.firstName || ''} ${a.user?.lastName || ''}`
        : a[sortConfig.key];
      const bVal = sortConfig.key === 'client'
        ? `${b.user?.firstName || ''} ${b.user?.lastName || ''}`
        : b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <CContainer className="mt-4">
      <CTable responsive bordered hover>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell>{renderSortButton('commandeDate', 'Date')}</CTableHeaderCell>
            <CTableHeaderCell>{renderSortButton('totalPrice', 'Total (DT)')}</CTableHeaderCell>
            <CTableHeaderCell>{renderSortButton('state', 'Statut')}</CTableHeaderCell>
            <CTableHeaderCell>{renderSortButton('client', 'Client')}</CTableHeaderCell>
            <CTableHeaderCell>Produits</CTableHeaderCell>
            <CTableHeaderCell>Détails</CTableHeaderCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell>
              <CFormInput size="sm" placeholder="Filtrer..." onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput size="sm" placeholder="Filtrer..." onChange={(e) => setFilters({ ...filters, totalPrice: e.target.value })} />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput size="sm" placeholder="Filtrer..." onChange={(e) => setFilters({ ...filters, state: e.target.value })} />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput size="sm" placeholder="Filtrer..." onChange={(e) => setFilters({ ...filters, client: e.target.value })} />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput size="sm" placeholder="Filtrer..." onChange={(e) => setFilters({ ...filters, produits: e.target.value })} />
            </CTableHeaderCell>
            <CTableHeaderCell />
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredSortedCommandes.map((commande) => (
            <CTableRow key={commande.id}>
              <CTableDataCell>{commande.commandeDate ? new Date(commande.commandeDate).toLocaleDateString() : 'N/A'}</CTableDataCell>
              <CTableDataCell>{commande.totalPrice} DT</CTableDataCell>
              <CTableDataCell>{commande.state || 'Pending'}</CTableDataCell>
              <CTableDataCell>{commande.user ? `${commande.user.firstName} ${commande.user.lastName}` : 'N/A'}</CTableDataCell>
              <CTableDataCell>
                {commande.products.map((product, index) => (
                  <div key={index}>{product.name} ({product.quantity})</div>
                ))}
              </CTableDataCell>
              <CTableDataCell>
                <CButton size="sm" color="info" onClick={() => {
                  setSelectedCommande(commande);
                  setVisible(true);
                }}>
                  Voir
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal */}
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
                  <li key={i}>{p.name} — {p.quantity} unité(s)</li>
                ))}
              </ul>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Fermer</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CommandeListTable;
