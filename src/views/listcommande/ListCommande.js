/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config'; // Import your Firebase configuration
import {
  CContainer,
  CCard,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CButton,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
const CommandeList = () => {
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
        toast.error('Error fetching commandes: ' + error.message);
      }
    };
    fetchCommandes();
  }, []);

  const updateStatus = async (commandeId, status) => {
    try {
      const response = await axios.put(`http://localhost:4000/commande/update/${commandeId}`, { state: status },{
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      if (response.status === 200) {
        setCommandes(commandes.filter(commande => commande.id !== commandeId)); // Remove the updated commande from the list
        toast.success(`Commande ${status === 'Confirmed' ? 'confirmée' : 'rejetée'} avec succès !`);
      } else {
        throw new Error('Failed to update commande status');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande : ", error);
      toast.error(`Erreur lors de la mise à jour du statut de la commande : ${error.message}`);
    }
  };
  
  
  return (
    <CContainer>
         <ToastContainer />
      <h2>Liste des Commandes</h2>
      {commandes.filter(commande => commande.state === 'pending').map((commande) => (
        <CCard key={commande.id} className="mb-3">
          <CCardBody>
          <CCardTitle>Date: {commande.commandeDate || 'N/A'}</CCardTitle>
            <p>Total: {commande.totalPrice} DT</p>
            <p>Client:</p>
            <ul>
              <li>Nom: {commande.user?.firstName} {commande.user?.lastName}</li>
              <li>Email: {commande.user?.email}</li>
              <li>Téléphone: {commande.user?.phone}</li>
              <li>Adresse: {commande.user?.address}, {commande.user?.city}, {commande.user?.gouvernorat}, {commande.user?.postalCode}</li>
            </ul>
            <p>Produits:</p>
            <CListGroup>
              {commande.products.map((product, index) => (
                <CListGroupItem key={index}>
                  {product.name} - {product.price} DT - {product.quantity}
                </CListGroupItem>
              ))}
            </CListGroup>
            <div className="mt-3">
              <CButton color="success" className="me-2" onClick={() => updateStatus(commande.id, 'Confirmed')}>
                Confirmer
              </CButton>
              <CButton color="danger" onClick={() => updateStatus(commande.id, 'Rejected', )}>
                Rejeter
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </CContainer>
  );

};

export default CommandeList;


