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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { doc, getDoc, updateDoc, collection, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { useParams } from 'react-router-dom';

const UpdateCoupe = () => {
  const { coupeId } = useParams();
  const [coupe, setCoupe] = useState({
    ns: '',
    frequence: '',
    taches: '',
    etat: '',
    action: '',
    remarque: '',
  });
  const [missions, setMissions] = useState([]);
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const fetchCoupeData = async () => {
      const coupeRef = doc(fire, 'coupe', coupeId);
      const coupeDoc = await getDoc(coupeRef);
      if (coupeDoc.exists()) {
        setCoupe(coupeDoc.data());
      } else {
        console.log('No such document!');
      }
    };

    const fetchMissions = async () => {
      const usersRef = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const names = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
      }));
      setUserNames(names);

      const missionsRef = collection(fire, 'maintenance');
      onSnapshot(missionsRef, (snapshot) => {
        const missionArray = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMissions(missionArray);
      });
    };

    fetchCoupeData();
    fetchMissions();
  }, [coupeId]);

  const handleInputChange = (field, value) => {
    setCoupe((prevCoupe) => ({
      ...prevCoupe,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const coupeRef = doc(fire, 'coupe', coupeId);

    try {
      await updateDoc(coupeRef, {
        ...coupe,
      });
      console.log('Document successfully updated!');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDeleteMission = async (id) => {
    try {
      const missionRef = doc(fire, 'maintenance', id);
      await deleteDoc(missionRef);
      console.log('Mission successfully deleted!');
    } catch (error) {
      console.error('Error deleting mission:', error.message);
    }
  };

  const filteredMissions = missions.filter(mission => mission.sn === coupe.ns);

  return (
    <CContainer>
      <CCard>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            {/* N/S Input */}
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>N/S</CInputGroupText>
                  <CFormInput
                    value={coupe.ns}
                    onChange={(e) => handleInputChange('ns', e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            {/* ... other Coupe form fields for 'frequence', 'taches', 'etat', 'action', 'remarque' ... */}
           {/* Frequence Select */}
           <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Fréquence</CInputGroupText>
                  <CFormSelect
                    value={coupe.frequence}
                    onChange={(e) => handleInputChange('frequence', e.target.value)}
                  >
                    <option value="Mensuelle">Mensuelle</option>
                    <option value="Semestrielle">Semestrielle</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Taches Input */}
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Tâches</CInputGroupText>
                  <CFormInput
                    value={coupe.taches}
                    onChange={(e) => handleInputChange('taches', e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Etat Select */}
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>État</CInputGroupText>
                  <CFormSelect
                    value={coupe.etat}
                    onChange={(e) => handleInputChange('etat', e.target.value)}
                  >
                    <option value="Bonne">Bonne</option>
                    <option value="Acceptable">Acceptable</option>
                    <option value="Non Acceptable">Non Acceptable</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Action Select */}
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Action</CInputGroupText>
                  <CFormSelect
                    value={coupe.action}
                    onChange={(e) => handleInputChange('action', e.target.value)}
                  >
                    <option value="Réparation">Réparation</option>
                    <option value="Changement">Changement</option>
                    <option value="Nettoyage">Nettoyage</option>
                    <option value="Graissage">Graissage</option>
                  </CFormSelect>
                </CInputGroup>
              </CCol>
            </CRow>

            {/* Remarque Input */}
            <CRow>
              <CCol>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Remarque</CInputGroupText>
                  <CFormInput
                    value={coupe.remarque}
                    onChange={(e) => handleInputChange('remarque', e.target.value)}
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CButton type="submit" color="primary">Update Coupe</CButton>
          </CForm>

          {/* Mission Table */}
          <CTable responsive="sm" hover borderless>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Equipment</CTableHeaderCell>
                <CTableHeaderCell>S/N</CTableHeaderCell>
                <CTableHeaderCell>Technician</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredMissions.map((mission) => (
                <CTableRow key={mission.id}>
                  <CTableDataCell>{mission.id}</CTableDataCell>
                  <CTableDataCell>{mission.type}</CTableDataCell>
                  <CTableDataCell>{mission.equipement}</CTableDataCell>
                  <CTableDataCell>{mission.sn}</CTableDataCell>
                  <CTableDataCell>
                    {mission.employees.map((employeeId, index) => (
                      <span key={employeeId}>
                        {index > 0 && ', '}
                        {userNames.find((user) => user.id === employeeId)?.name || 'Unknown'}
                      </span>
                    ))}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      variant="outline"
                      color="primary"
                      // onClick={() => handleUpdateMission(mission.id)} // if you have update functionality
                    >
                      Update
                    </CButton>
                    <CButton
                      variant="outline"
                      color="danger"
                      onClick={() => handleDeleteMission(mission.id)}
                    >
                      Delete
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default UpdateCoupe;
