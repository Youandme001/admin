/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CInputGroup,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from 'src/config';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [token, setToken] = useState();

  useEffect(() => {
    const token = localStorage.getItem('tokenadmin');
    setToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/categories/create`,
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setName('');
        setDescription('');
        toast.success('Catégorie ajoutée avec succès !');
      } else {
        throw new Error('Échec de la création de la catégorie');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie : ", error);
      toast.error(`Erreur lors de l'ajout de la catégorie : ${error.message}`);
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
            <h4>Ajouter une nouvelle catégorie</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Nom de la catégorie"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CButton
                color="primary"
                type="submit"
                style={{
                  marginTop: '20px',
                  backgroundColor: 'green',
                  color: 'white',
                }}
              >
                Ajouter la catégorie
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default CategoryForm;
