/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { fire, storage } from '../../components/firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios'; // Import axios
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormTextarea,
  CInputGroup,
  CRow,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [volume, setVolume] = useState('');
  const [propertiesCosmetics, setPropertiesCosmetics] = useState('');
  const [designation, setDesignation] = useState('');
  const [token, setToken]= useState();

  useEffect(() => {
    const token =localStorage.getItem('token');
    setToken(token);;
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Veuillez télécharger au moins une image pour le produit');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('volume', volume);
    formData.append('designation', designation);
    formData.append('propertiesCosmetics', propertiesCosmetics);
    images.forEach((image) => formData.append('images', image));
  
    try {
      const response = await axios.post('http://localhost:4000/produit/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        setName('');
        setPrice('');
        setImages([]);
        setDescription('');
        setVolume('');
        setPropertiesCosmetics('');
        setDesignation('');
        toast.success('Produit ajouté avec succès !');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit : ", error);
      toast.error(`Erreur lors de l'ajout du produit : ${error.message}`);
    }
  };
  

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <CContainer>
        <CCard>
          <CCardBody>
            <h4>Ajouter un nouveau produit</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Nom du produit"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="number"
                      placeholder="Prix"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Volume"
                      name="volume"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Désignation"
                      name="designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Propriétés cosmétiques"
                      name="propertiesCosmetics"
                      value={propertiesCosmetics}
                      onChange={(e) => setPropertiesCosmetics(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormTextarea
                      placeholder="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                  <CFormInput
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files))}
                    />

                  </CInputGroup>
                </CCol>
              </CRow>
              <CButton
                color="primary"
                type="submit"
                style={{
                  marginTop: '20px',
                  backgroundColor: 'red',
                  color: 'white',
                }}
              >
                Ajouter le produit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default ProductForm;
