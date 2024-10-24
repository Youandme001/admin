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
import { collection, addDoc, getDocs, serverTimestamp  } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addmission = () => {
  const [type, setType] = useState('');
  const [equipement, setEquipement] = useState('');
  const [sn, setSN] = useState('');
  const [ affectation, setAffectation] = useState('');
  const [mission, setMission] = useState('');
  const [employeeFields, setEmployeeFields] = useState([
    {
      id: Date.now(),
      selectedEmployee: '',
    },
  ]);
  const [duree, setDuree] = useState('');
  const [deadline, setDeadline] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([{ userId: '', userData: null }]);
  const [qte, setQte] = useState('');
  const [tempsTotMinutes, setTempsTotMinutes] = useState('');
  const [temps, setTemps] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(fire, 'users1');
      const usersSnapshot = await getDocs(usersCollection);

      const names = [];
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName}  `;
        names.push({
          id: userDoc.id,
          name: fullName,
          data: userData,
        });
      });

      setUserNames(names);
    };

    fetchUsers();
  }, []);

  const handleQteChange = (e) => {
    setQte(e.target.value);
    calculateTemps(e.target.value, tempsTotMinutes);
  };

  const handleMissionChange = (event) => {
    setMission(event.target.value);
    calculateTemps(qte, tempsTotMinutes, event.target.value);
  };

  const handleUserChange = async (event, index) => {
    const userId = event.target.value;
    const updatedFields = [...employeeFields];

    // Fetch user data based on userId
    const userData = userNames.find((user) => user.id === userId);

    updatedFields[index] = {
      id: updatedFields[index].id,
      selectedEmployee: userId,
    };

    setEmployeeFields(updatedFields);

    const updatedUsers = [...selectedUsers];
    updatedUsers[index] = {
      userId: userId,
      userData: userData ? userData.data : null,
    };
    setSelectedUsers(updatedUsers);
  };

  const addEmployeeField = () => {
    setEmployeeFields((prevFields) => [
      ...prevFields,
      {
        id: Date.now(),
        selectedEmployee: userNames.length > 0 ? userNames[0].id : '',
      },
    ]);
  };

  const removeEmployeeField = (fieldId) => {
    setEmployeeFields(employeeFields.filter((field) => field.id !== fieldId));
  };

  const handleAddUser = () => {
    setSelectedUsers([...selectedUsers, { userId: '', userData: null }]);
  };

  const calculateTemps = (qteValue, totMinutes, selectedMission) => {
    if (qteValue && selectedMission) {
      let multiplier = 10;

      if (
        selectedMission === 'AIDE VISUEL CONTRÔLE VISUELLE' ||
        selectedMission === "Instructions d'outils (machine/pinces, etc.)" ||
        selectedMission === "Aide visuel production (CONNECTEUR SPECIFIQUE +PIASTRA)" ||
        selectedMission === "Aide visuel test electrique+FINITION" ||
        selectedMission === "Aide visuel bochonnage"
      ) {
        multiplier = 20;
      } else if(
        selectedMission === 'AIDE VISUEL SOUDURE ULTRASON' ||
        selectedMission === "Aide visuel twistati"
      ){
        multiplier = 5;
      }

      const calculatedTemps = qteValue * multiplier;

      const hours = Math.floor(calculatedTemps / 60);
      const minutes = calculatedTemps % 60;

      setTemps(`${hours} hours ${minutes} minutes`);
    } else {
      setTemps('');
    }
  };

  const handleSubmit = async () => {
    console.log('Type:', type);
    console.log('Equipement:', equipement);
    console.log('SN:', sn);
    console.log('Affectation:', affectation);
    console.log('Mission:', mission);
    console.log('Employees:', employeeFields.map((field) => field.selectedEmployee));
   
    const missionsCollection = collection(fire, 'maintenance1');
    const newMission = {
      type: type,
      equipement: equipement,
      sn: sn,
      mission: mission,
      employees: employeeFields.map((field) => field.selectedEmployee),
      timestamp: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(missionsCollection, newMission);
      console.log('Document written with ID: ', docRef.id);
      toast.success('Mission submitted successfully.');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Error submitting mission: ' + error.message);
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
            <CForm>
              <CRow className="mb-3">
                <CCol>
                  <h4>Dossier Technique</h4>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Type</CInputGroupText>
                    <CFormSelect value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Type</option>
                      <option value="trefilage">trefilage</option>
                      <option value="cablerie">cablerie</option>
                      <option value="bobinage">bobinage</option>
                      <option value="ressort ">ressort </option>
                      <option value="scat1">scat1</option>
                      <option value="grillage">grillage</option>
                      <option value="élingue">élingue</option>
                      <option value="lingena">lingena</option>
                      <option value="Extruction">Extruction</option>
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol md="12">
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Equipement</CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Equipement"
                      name="equipement"
                      value={equipement}
                      onChange={(e) => setEquipement(e.target.value)}
                      required
                    />
                    
                  </CInputGroup>
                </CCol>
                <CCol md="12">
                <CInputGroup className="mb-3">
                <CInputGroupText>Magasinier</CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Magasinier"
                      name="Magasinier"
                      value={sn}
                      onChange={(e) => setSN(e.target.value)}
                      required
                    />
                 </CInputGroup> 
                
                </CCol>
              </CRow>
              {employeeFields.map((field, index) => (
                <CRow key={field.id}>
                  <CCol>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>Technicien</CInputGroupText>
                      <CFormSelect
                        value={field.selectedEmployee}
                        onChange={(event) => handleUserChange(event, index)}
                      >
                         <option value="">Select Employee</option>
                        {userNames.map((user) => (
                          
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </CFormSelect>
                      <CButton color="danger" onClick={() =>removeEmployeeField(field.id)}>
                        Remove
                      </CButton>
                    </CInputGroup>
                  </CCol>
                </CRow>
              ))}

              <CRow>
                <CCol>
                  <CButton color="primary" className="mb-3" onClick={addEmployeeField}>
                    Add Employee
                  </CButton>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CButton color="primary" onClick={handleSubmit}>
                    ADD Mission
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
};

export default Addmission;
