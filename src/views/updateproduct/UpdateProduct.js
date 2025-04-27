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
  CFormTextarea,
  CImage,
  CInputGroup,
  CRow,
  CFormSelect,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const UpdateProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [token, setToken] = useState();

  useEffect(() => {
    const token = localStorage.getItem('tokenadmin');
    setToken(token);
    fetchProduct(token);
    fetchCategories(token);
  }, [productId]);

  const fetchProduct = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/produit/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) throw new Error('Failed to fetch product');
      setProduct(response.data.data);
      setCategoryId(response.data.data.categoryId || '');
      if (response.data.data.images && response.data.data.images.length > 0) {
        setImagePreviews(response.data.data.images.map((img) => img.filepath));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchCategories = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.message === 'Success') {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      const previews = images.map((img) => URL.createObjectURL(img));
      setImagePreviews(previews);
    }
  }, [images]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', productId);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('volume', product.volume);
    formData.append('designation', product.designation);
    formData.append('propertiesCosmetics', product.propertiesCosmetics);
    formData.append('categoryId', categoryId);
    if (images.length > 0) {
      images.forEach((img) => formData.append('images', img));
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/produit/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.message === "Product updated successfully!") {
        toast.success('Produit mis à jour avec succès !');
        navigate('/listproduct');
      } else if (response.data.message === "Unauthorized: Access token is required") {
        navigate('/login');
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
      toast.error(`Erreur lors de la mise à jour du produit : ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <CContainer>
        <CCard>
          <CCardBody>
            <h4>Modifier le produit</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Nom du produit"
                      value={product.name || ''}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
                      value={product.price || ''}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Quantité"
                      value={product.volume || ''}
                      onChange={(e) => setProduct({ ...product, volume: e.target.value })}
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
                      value={product.designation || ''}
                      onChange={(e) => setProduct({ ...product, designation: e.target.value })}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Propriétés cosmétiques"
                      value={product.propertiesCosmetics || ''}
                      onChange={(e) => setProduct({ ...product, propertiesCosmetics: e.target.value })}
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
                      value={product.description || ''}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormSelect
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImages(Array.from(e.target.files))}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <div className="image-previews">
                    {imagePreviews.map((url, index) => (
                      <CImage key={index} src={url} alt="Product Image" height={100} className="me-2" />
                    ))}
                  </div>
                </CCol>
              </CRow>
              <CButton color="primary" type="submit" style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
                Modifier le produit
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default UpdateProductForm;
