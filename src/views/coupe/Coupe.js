/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Coupe = () => {
    const [ns, setNS] = useState('');
    const [frequence, setFrequence] = useState('');
    const [taches, setTaches] = useState('');
    const [etat, setEtat] = useState('');
    const [action, setAction] = useState('');
    const [remarque, setRemarque] = useState('');
  
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
      };
    
      const handleSubmit = async () => {
        const newCoupeData = {
          ns,
          frequence,
          taches,
          etat,
          action,
          remarque,
          timestamp: serverTimestamp(),
        };
    
        try {
          const coupeCollection = collection(fire, 'coupe');
          const docRef = await addDoc(coupeCollection, newCoupeData);
          console.log('Document written with ID: ', docRef.id);
          toast.success('Coupe data submitted successfully.');
        } catch (error) {
          console.error('Error adding document: ', error);
          toast.error('Error submitting coupe data: ' + error.message);
        }
      };
    
     
    
      return (
        <div className="app-container">
          <ToastContainer />
          <CContainer>
            <CCard>
              <CCardBody>
                <CForm>
                  {/* Existing inputs... */}
                  
                  {/* N/S Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>N/S</CInputGroupText>
                    <CFormInput value={ns} onChange={handleInputChange(setNS)} />
                  </CInputGroup>
    
                  {/* Frequence Select */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Fréquence</CInputGroupText>
                    <CFormSelect value={frequence} onChange={handleInputChange(setFrequence)}>
                      <option value="Mensuelle">Mensuelle</option>
                      <option value="Semestrielle">Semestrielle</option>
                    </CFormSelect>
                  </CInputGroup>
    
                  {/* Taches Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Tâches</CInputGroupText>
                    <CFormInput value={taches} onChange={handleInputChange(setTaches)} />
                  </CInputGroup>
    
                  {/* Etat Select */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>État</CInputGroupText>
                    <CFormSelect value={etat} onChange={handleInputChange(setEtat)}>
                      <option value="Bonne">Bonne</option>
                      <option value="Acceptable">Acceptable</option>
                      <option value="Non Acceptable">Non Acceptable</option>
                    </CFormSelect>
                  </CInputGroup>
    
                  {/* Action Select */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Action</CInputGroupText>
                    <CFormSelect value={action} onChange={handleInputChange(setAction)}>
                      <option value="Réparation">Réparation</option>
                      <option value="Changement">Changement</option>
                      <option value="Nettoyage">Nettoyage</option>
                      <option value="Graissage">Graissage</option>
                    </CFormSelect>
                  </CInputGroup>
    
                  {/* Remarque Input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Remarque</CInputGroupText>
                    <CFormInput value={remarque} onChange={handleInputChange(setRemarque)} />
                  </CInputGroup>
    
                  {/* Submit Button */}
                  <CButton color="primary" onClick={handleSubmit}>
                    ADD Coupe
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CContainer>
        </div>
      );
    };
 
export default Coupe;