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
import { collection, addDoc, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const names = [];
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName}`;
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

  const handleMissionChange = (event) => {
    setMission(event.target.value);
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

    const missionsCollection = collection(fire, 'missions');
    const newMission = {
      mission: mission,
      employees: employeeFields.map((field) => field.selectedEmployee),
      duree: duree,
      deadline: deadline,
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
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCard>
              <CCardBody>
                <CForm>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Mission</CInputGroupText>
                        <CFormSelect value={mission} onChange={handleMissionChange}>
                          <option value="ICEM">ICEM</option>
                          <option value="ACTIA">ACTIA</option>
                          <option value="ASPOCK">ASPOCK</option>
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
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Addmission;
