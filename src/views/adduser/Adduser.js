/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState } from 'react';
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
} from '@coreui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, fire, storage } from '../../components/firebase-config'; // Import Firestore instance (db)
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, addDoc } from 'firebase/firestore';
import CIcon from '@coreui/icons-react';
import { cilCalendar } from '@coreui/icons';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const SignUpForm = () => {
  const [img, setImg] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmpassword: '',
    calcification: '',
    startDate: '',
    pointfort: '',
    specialite: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error('Passwords do not match');
      return;
    }

    const lowercaseEmail = formData.email.toLowerCase();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        lowercaseEmail,
        formData.password
      );

      const user = userCredential.user;

      if (user) {
        const imageRef = ref(storage, `userImages/${user.uid}`);
        await uploadBytes(imageRef, img);

        const imageUrl = await getDownloadURL(imageRef);

        const userCollection = collection(fire, 'users1'); // Use Firestore instance (db)
        const userData = {
          ...formData,
          userId: user.uid,
          email: lowercaseEmail,
          imageUrl,
        };

        try {
          await addDoc(userCollection, userData);
          console.log('User data saved to Firestore');
          toast.success('User data saved to Firestore');
        } catch (error) {
          console.error('Error saving user data to Firestore: ', error);
          toast.error('Error saving user data to Firestore: ' + error.message);
        }
      } else {
        console.error('Error registering user');
        toast.error('Error registering user');
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
      toast.error('Error registering user: ' + error.message);
    }
  };


  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <CContainer>
        <CCard>
          <CCardBody>
            <h4>Add Employee</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    <CInputGroupText>Last Name</CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CFormInput
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <CInputGroupText>Confirm Password</CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmpassword"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CFormInput
                    type="text"
                    placeholder="Classification"
                    name="calcification"
                    value={formData.calcification}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilCalendar} />
                    </CInputGroupText>
                    <CFormInput
                      type="date"
                      placeholder="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                </CCol>
                <CCol md="6">
                  <CFormInput
                    type="text"
                    placeholder="Point Fort"
                    name="pointfort"
                    value={formData.pointfort}
                    onChange={handleChange}
                    required
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md="6">
                  <CFormInput
                    type="text"
                    placeholder="Specialité"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                    required
                  />
                </CCol>
                <CCol md="6">
                  <CFormInput
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
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
                Add Employee
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default SignUpForm;
