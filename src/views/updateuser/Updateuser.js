/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateUserPage = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    const userRef = doc(fire, 'users1', userId);

    const fetchUserData = async () => {
      try {
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.data();
          setFormData(userData);
        } else {
          toast.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(fire, 'users', userId);

    try {
      await updateDoc(userRef, formData);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error.message);
      toast.error('Error updating user: ' + error.message);
    }
  };

  return (
    <CContainer className="mt-4">
      <ToastContainer
        position="top-right"
        autoClose={3002}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <h4>Update User</h4>
      <CForm onSubmit={handleSubmit}>
        <CRow>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>First Name</CInputGroupText>
              <CFormInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Last Name</CInputGroupText>
              <CFormInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Email</CInputGroupText>
              <CFormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
        </CRow>
        <CButton
          type="submit"
          color="primary"
          style={{
            marginTop: '20px',
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          Update User
        </CButton>
      </CForm>
    </CContainer>
  );
};

export default UpdateUserPage;
