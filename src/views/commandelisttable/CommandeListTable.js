/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

const CommandeListTable = () => {
  const [commandes, setCommandes] = useState([]);
  const [token, setToken]= useState();
  const navigate = useNavigate();
  useEffect(() => {
    const token =localStorage.getItem('token');
    setToken(token);
    console.log(token);
    const fetchCommandes = async () => {
      try {
        // Replace 'http://localhost:4000' with your actual backend URL
        const response = await axios.get('http://localhost:4000/commande', {
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
      }
    };
    fetchCommandes();
    console.log(commandes);
  }, []);
  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Date</CTableHeaderCell>
            <CTableHeaderCell>Total Price</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>User ID</CTableHeaderCell>
            <CTableHeaderCell>Products</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
        {commandes.filter(commande => commande.state !== 'pending').map((commande) => (
          <CTableRow key={commande.id}>
            <CTableDataCell>{commande.commandeDate ? new Date(commande.commandeDate).toLocaleDateString() : 'N/A'}</CTableDataCell>
            <CTableDataCell>{commande.totalPrice} DT</CTableDataCell>
            <CTableDataCell>{commande.state || 'Pending'}</CTableDataCell>
            <CTableDataCell>
              {commande.user ? `${commande.user.firstName} ${commande.user.lastName}` : 'N/A'}
            </CTableDataCell>
            <CTableDataCell>
              {commande.products.map((product, index) => (
                <div key={index}>
                  {product.name}
                  {product.quantity}
                </div>
              ))}
            </CTableDataCell>
          </CTableRow>
        ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );

};

export default CommandeListTable;
