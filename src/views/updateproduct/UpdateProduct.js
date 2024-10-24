/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import { fire, storage } from '../../components/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const UpdateProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [token, setToken]= useState();
  useEffect(() => {
    console.log(productId);
    const token = localStorage.getItem('token');
    setToken(token);
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/produit/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          throw new Error('Failed to fetch product');
        }
        setProduct(response.data.data);
        // Set the main image URL to the first image in the images array
        if (response.data.data.images && response.data.data.images.length > 0) {
          setImagePreviews(response.data.data.images.map((image) => image.filepath));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    if (images.length > 0) {
      const newImagePreviews = images.map((image) =>
        URL.createObjectURL(image)
      );
      setImagePreviews(newImagePreviews);
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
    if (images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }
  
    try {
      const response = await axios.put('http://localhost:4000/produit/update',formData,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.message=="Product updated successfully!") {
        toast.success('Produit mis à jour avec succès !');
        navigate('/listproduct'); // Navigate to ListProduct page
      } else if(response.data.message=="Unauthorized: Access token is required") {
        navigate('/login');
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit : ", error);
      toast.error(`Erreur lors de la mise à jour du produit : ${error.message}`);
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
            <h4>Modifier le produit</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="Nom du produit"
                      name="name"
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
                      name="price"
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
                      placeholder="Volume"
                      name="volume"
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
                      name="designation"
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
                      name="propertiesCosmetics"
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
                      name="description"
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
              <CRow>
                <CCol md="12">
                  <div className="image-previews">
                    {imagePreviews.map((imageUrl, index) => (
                      <CImage
                        key={index}
                        src={imageUrl}
                        alt="Product Image"
                        height={100}
                        className="me-2"
                      />
                    ))}
                  </div>
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


