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
import { collection, addDoc, getDocs, serverTimestamp  } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Addmission = () => {
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
      const usersCollection = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const names = [];
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName} ${userData.fonction}`;
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
        selectedEmployee: userNames.length > 0 ? userNames[0].id : '', // Initialize with the first user ID
      },
    ]);
  };
  

  const handleRemoveUser = (index) => {
    if (selectedUsers.length > 1) {
      const updatedUsers = selectedUsers.filter((user, i) => i !== index);
      setSelectedUsers(updatedUsers);
    }
  };
  const calculateTemps = (qteValue, totMinutes, selectedMission) => {
    if (qteValue && selectedMission) {
      const multiplier = selectedMission === 'Reception DOC' ? 20 : 10;
      const calculatedTemps = qteValue * multiplier;

      const hours = Math.floor(calculatedTemps / 60);
      const minutes = calculatedTemps % 60;

      setTemps(`${hours} hours ${minutes} minutes`);
    } else {
      setTemps('');
    }
  };


  const handleDureeChange = (event) => {
    const timeValue = event.target.value.match(/(\d{1,2}:\d{2})/);
    const time = timeValue ? timeValue[0] : '';
    setDuree(time);
  };
  const removeEmployeeField = (fieldId) => {
    setEmployeeFields(employeeFields.filter((field) => field.id !== fieldId));
  };
  const handleAddUser = () => {
    setSelectedUsers([...selectedUsers, { userId: '', userData: null }]);
  };
  const handleSubmit = async () => {
    console.log('Mission:', mission);
    console.log('Employees:', employeeFields.map((field) => field.selectedEmployee));
    console.log('Duree:', duree);
    console.log('Deadline:', deadline);
    console.log('Qte:', qte);
    console.log('Temps:', temps);

    const missionsCollection = collection(fire, 'missions');
    const newMission = {
      mission: mission,
      employees: employeeFields.map((field) => field.selectedEmployee),
      duree: duree,
      deadline: deadline,
      qte: qte,
      temps: temps,
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
                <h4>Communication</h4>
              </CCol>
            </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Mission</CInputGroupText>
                        <CFormSelect value={mission} onChange={handleMissionChange}>
                          <option value="les email">les email</option>
                          <option value="les reclamations client">
                          les reclamations client
                          </option>
                          <option value="reclamations production">
                          reclamations production
                          </option>
                          <option value="rework">rework</option>
                          <option value="SYSTÈME ERP">SYSTÈME ERP</option>
                          <option value="Les réunions">Les réunions</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>CLASSE</CInputGroupText>
                        <CFormSelect value={mission} onChange={handleMissionChange}>
                          <option value="A(1 -27)">CLASSE   A(1 -27)</option>
                          <option value="B(44-110)">
                          CLASSE   B(44-110)
                          </option>
                          <option value="C(115-196)">
                          CLASSE   C(115-196)
                          </option>
                          <option value="D(210-348)">CLASSE   D(210-348)</option>
                          <option value="E(350-576)">CLASSE   E(350-576)</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  {employeeFields.map((field, index) => (
                    <CRow key={field.id}>
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Employee</CInputGroupText>
                          <CFormSelect
                            value={field.selectedEmployee}
                            onChange={(event) => handleUserChange(event, index)}
                          >
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
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Duree</CInputGroupText>
                        <CFormInput type="time" value={duree} onChange={handleDureeChange} />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Deadline</CInputGroupText>
                        <CFormInput
                          type="date"
                          value={deadline}
                          onChange={(event) => setDeadline(event.target.value)}
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
              <CCol>
                <CInputGroup>
                  <CInputGroupText>Qte</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={qte}
                    onChange={handleQteChange}
                    placeholder="Enter Qte"
                  />
                </CInputGroup>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CInputGroup>
                  <CInputGroupText>Temps TOT (minutes)</CInputGroupText>
                  <CFormInput
                    type="text"
                    value={temps}
                    readOnly
                  />
                </CInputGroup>
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
