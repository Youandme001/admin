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
} from '@coreui/react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

const UpdateMissionPage = () => {
  const { missionId } = useParams();
  const [formData, setFormData] = useState({
    mission: '',
    employees: [],
    duree: '',
    deadline: '',
  });

  useEffect(() => {
    const missionRef = doc(fire, 'missions', missionId);

    const fetchMissionData = async () => {
      try {
        const snapshot = await getDoc(missionRef);
        if (snapshot.exists()) {
          const missionData = snapshot.data();
          setFormData(missionData);
        } else {
          toast.error('Mission not found');
        }
      } catch (error) {
        console.error('Error fetching mission data:', error);
        toast.error('Error fetching mission data');
      }
    };

    fetchMissionData();
  }, [missionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missionRef = doc(fire, 'missions', missionId);

    try {
      await updateDoc(missionRef, formData);
      toast.success('Mission updated successfully');
    } catch (error) {
      console.error('Error updating mission:', error.message);
      toast.error('Error updating mission: ' + error.message);
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
      <h4>Update Mission</h4>
      <CForm onSubmit={handleSubmit}>
        <CRow>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Mission</CInputGroupText>
              <CFormInput
                type="text"
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Employees</CInputGroupText>
              <CFormInput
                type="text"
                name="employees"
                value={formData.employees.join(', ')}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Duree</CInputGroupText>
              <CFormInput
                type="text"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <CInputGroup className="mb-3">
              <CInputGroupText>Deadline</CInputGroupText>
              <CFormInput
                type="text"
                name="deadline"
                value={formData.deadline}
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
          Update Mission
        </CButton>
      </CForm>
    </CContainer>
  );
};

export default UpdateMissionPage;
