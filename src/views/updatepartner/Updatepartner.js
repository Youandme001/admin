/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CForm,
  CFormGroup,
  CLabel,
  CFormInput,
  CButton,
} from '@coreui/react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';

const UpdatePartner = () => {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    telephone: '',
    address: '',
    pack: '',
  });

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const partnerRef = doc(fire, 'partners', id);
        const partnerSnapshot = await getDoc(partnerRef);

        if (partnerSnapshot.exists()) {
          const partnerData = partnerSnapshot.data();
          setFormData(partnerData);
        } else {
          console.error('Partner not found');
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
      }
    };

    fetchPartnerData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const partnerRef = doc(fire, 'partners', id);
      await updateDoc(partnerRef, formData);

      // Redirect to the list of partners after updating
      history.push('/listpartners');
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  return (
    <CContainer className="mt-4">
      <h4>Update Partner</h4>
      <CForm onSubmit={handleSubmit}>
        <CFormGroup>
          <CLabel>Company Name</CLabel>
          <CFormInput
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel>Email</CLabel>
          <CFormInput
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel>Telephone</CLabel>
          <CFormInput
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel>Address</CLabel>
          <CFormInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </CFormGroup>
        <CFormGroup>
          <CLabel>Pack</CLabel>
          <CFormInput
            type="text"
            name="pack"
            value={formData.pack}
            onChange={handleChange}
            required
          />
        </CFormGroup>
        <CButton type="submit" color="primary">
          Update Partner
        </CButton>
      </CForm>
    </CContainer>
  );
};

export default UpdatePartner;
