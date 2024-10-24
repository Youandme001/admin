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
  const [selectedClasse, setSelectedClasse] = useState('');
  const [showClasseSection, setShowClasseSection] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const names = [];
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName} ${userData.fonction} `;
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
    const newQte = e.target.value;
    setQte(newQte);
    calculateTemps(newQte, tempsTotMinutes, mission, selectedClasse);
  };

  const handleMissionChange = (event) => {
    const selectedMission = event.target.value;
    setMission(selectedMission);

    // Check if the selected mission requires displaying the CLASSE section
    const missionsRequiringClasse = [
      'Contrôle distinta',
      'Nomenclature sur NAV',
      'Vérification des moyens de test electrique',
      'Vérification des  moyens de production',
      'Tableau de coupe EXCEL',
      'Model d\'import',
      'ETAT MINI',
      'Preparation planche d\'assemblage',
      'Aide visuel preparation',
    ];

    setShowClasseSection(missionsRequiringClasse.includes(selectedMission));
    calculateTemps(qte, tempsTotMinutes, selectedMission, selectedClasse);
  };

  const handleClasseChange = (event) => {
    setSelectedClasse(event.target.value);
    calculateTemps(qte, tempsTotMinutes, mission, event.target.value);
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
  const calculateTemps = (qteValue, totMinutes, selectedMission, selectedClasse) => {
    if (qteValue && selectedMission) {
      let multiplier = 10;
  
      // Check for specific missions with a multiplier of 20
      if (
        selectedMission === 'AIDE VISUEL CONTRÔLE VISUELLE' ||
        selectedMission === "Instructions d'outils (machine/pinces, etc.)"||
        selectedMission === "Aide visuel production (CONNECTEUR SPECIFIQUE +PIASTRA)"||
        selectedMission === "Aide visuel test electrique+FINITION"||
        selectedMission === "Aide visuel bochonnage"
      ) {
        multiplier = 20;
      } else if(
        selectedMission === 'AIDE VISUEL SOUDURE ULTRASON' ||
        selectedMission === "Aide visuel twistati"
      ){
        multiplier = 5;
      }else if(
        selectedMission === 'Reception DOC'       
      ){
        multiplier = 30;
      } else
  // Check for specific classes and adjust multiplier accordingly
  if (selectedClasse === 'A(1 -27)' ) {
    if (selectedMission === 'Contrôle distinta' ){ multiplier *= 6;}
    else if (selectedMission === 'Nomenclature sur NAV'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des moyens de test electrique'){ multiplier *= 3;}
    else if (selectedMission === 'Vérification des  moyens de production'){ multiplier *= 3;}
    else if (selectedMission === 'Tableau de coupe EXCEL'){ multiplier *= 6;}
    else if (selectedMission === "Model d'import"){ multiplier *= 6;}
    else if (selectedMission === "ETAT MINI"){ multiplier *= 6;}
    else if (selectedMission === "Preparation planche d'assemblage"){ multiplier *= 18;}
    else if (selectedMission === "Aide visuel preparation"){ multiplier *= 6;}
  } else if (selectedClasse === 'B(44-110)' ) {
    if (selectedMission === 'Contrôle distinta' ){ multiplier *= 9;}
    else if (selectedMission === 'Nomenclature sur NAV'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des moyens de test electrique'){ multiplier *= 3;}
        else if (selectedMission === 'Vérification des  moyens de production'){ multiplier *= 3;}
        else if (selectedMission === 'Tableau de coupe EXCEL'){ multiplier *= 9;}
        else if (selectedMission === "Model d'import"){ multiplier *= 9;}
        else if (selectedMission === "ETAT MINI"){ multiplier *= 9;}
        else if (selectedMission === "Preparation planche d'assemblage"){ multiplier *= 48;}
        else if (selectedMission === "Aide visuel preparation"){ multiplier *= 12;}
  } else if (selectedClasse === 'C(115-196)' ) {
    if (selectedMission === 'Contrôle distinta' ){  multiplier *= 15;}
    else if (selectedMission === 'Nomenclature sur NAV'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des moyens de test electrique'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des  moyens de production'){ multiplier *= 6;}
    else if (selectedMission === 'Tableau de coupe EXCEL'){ multiplier *= 12;}
    else if (selectedMission === "Model d'import"){ multiplier *= 12;}
    else if (selectedMission === "ETAT MINI"){ multiplier *= 15;}
    else if (selectedMission === "Preparation planche d'assemblage"){ multiplier *= 96;}
    else if (selectedMission === "Aide visuel preparation"){ multiplier *= 36;}
  } else if (selectedClasse === 'D(210-348)') {
    if (selectedMission === 'Contrôle distinta' ){ multiplier *= 18;}
    else if (selectedMission === 'Nomenclature sur NAV'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des moyens de test electrique'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des  moyens de production'){ multiplier *= 6;}
    else if (selectedMission === 'Tableau de coupe EXCEL'){ multiplier *= 21;}
    else if (selectedMission === "Model d'import"){ multiplier *= 21;}
    else if (selectedMission === "ETAT MINI"){ multiplier *= 18;}
    else if (selectedMission === "Preparation planche d'assemblage"){ multiplier *= 144;}
    else if (selectedMission === "Aide visuel preparation"){ multiplier *= 72;}
  } else if (selectedClasse === 'E(350-576)') {
    if (selectedMission === 'Contrôle distinta' ){ multiplier *= 24;}
    else if (selectedMission === 'Nomenclature sur NAV'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des moyens de test electrique'){ multiplier *= 6;}
    else if (selectedMission === 'Vérification des  moyens de production'){ multiplier *= 6;}
    else if (selectedMission === 'Tableau de coupe EXCEL'){ multiplier *= 48;}
    else if (selectedMission === "Model d'import"){ multiplier *= 48;}
    else if (selectedMission === "ETAT MINI"){ multiplier *= 24;}
    else if (selectedMission === "Preparation planche d'assemblage"){ multiplier *= 32;}
    else if (selectedMission === "Aide visuel preparation"){ multiplier *= 96;}
  }

  const calculatedTemps = qteValue * multiplier;

  const hours = Math.floor(calculatedTemps / 60);
  const minutes = calculatedTemps % 60;

  setTemps(`${hours} hours ${minutes} minutes`);

  // Update tempsTotMinutes here
  setTempsTotMinutes(calculatedTemps);
} else {
  setTemps('');
  setTempsTotMinutes('');
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
                <h4>Dossier Technique</h4>
              </CCol>
            </CRow>
                  <CRow>
                    <CCol>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Mission</CInputGroupText>
                        <CFormSelect value={mission} onChange={handleMissionChange}>
                        <option value="">Select Mission</option>
                          <option value="Reception DOC">Reception DOC</option>
                          <option value="AIDE VISUEL PREPARATION CABLES SPECIAL">
                            AIDE VISUEL PREPARATION CABLES SPECIAL
                          </option>
                          <option value="AIDE VISUEL SOUDURE AVEC SERTISSAGE">
                            AIDE VISUEL SOUDURE AVEC SERTISSAGE
                          </option>
                          <option value="AIDE VISUEL SOUDURE ULTRASON">AIDE VISUEL SOUDURE ULTRASON</option>
                          <option value="AIDE VISUEL COUPE ET SERTISSAGE">AIDE VISUEL COUPE ET SERTISSAGE</option>
                          <option value="Aide visuel GND">Aide visuel GND</option>
                          <option value="Aide visuel pre-isolant">Aide visuel pre-isolant</option>
                          <option value="Aide visuel diode+sechoire">Aide visuel diode+sechoire</option>
                          <option value="Aide visuel etamage">Aide visuel etamage</option>
                          <option value="Aide visuel twistati">Aide visuel twistati</option>
                          <option value="Aide visuel production (CONNECTEUR SPECIFIQUE +PIASTRA)">
                            Aide visuel production (CONNECTEUR SPECIFIQUE +PIASTRA)
                          </option>
                          <option value="Aide visuel test electrique+FINITION">
                            Aide visuel test electrique+FINITION
                          </option>
                          <option value="AIDE VISUEL CONTRÔLE VISUELLE">AIDE VISUEL CONTRÔLE VISUELLE</option>
                          <option value="Instructions d'outils (machine/pinces, etc.)">
                            Instructions doutils (machine/pinces, etc.)
                          </option>
                          <option value="Aide visuel bochonnage">Aide visuel bochonnage</option>
                          <option value="Flux de production">Flux de production</option>
                          <option value="Contrôle distinta">Contrôle distinta</option>
                          <option value="Nomenclature sur NAV">Nomenclature sur NAV</option>
                          <option value="Vérification des moyens de test electrique">Vérification des moyens de test electrique</option>
                          <option value="Vérification des  moyens de production">Vérification des  moyens de production</option>
                          <option value="Tableau de coupe EXCEL">Tableau de coupe EXCEL</option>
                          <option value="Model d'import">Model d import </option>
                          <option value="ETAT MINI">ETAT MINI</option>
                          <option value="Preparation planche d'assemblage">Preparation planche d assemblage</option>
                          <option value="Aide visuel preparation">Aide visuel preparation</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                  </CRow>
                  {showClasseSection && (
                <CRow>
                  <CCol>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>CLASSE</CInputGroupText>
                      <CFormSelect value={selectedClasse} onChange={handleClasseChange}>
                        <option value="">Select CLASSE</option>
                        <option value="A(1 -27)">CLASSE A(1 -27)</option>
                        <option value="B(44-110)">CLASSE B(44-110)</option>
                        <option value="C(115-196)">CLASSE C(115-196)</option>
                        <option value="D(210-348)">CLASSE D(210-348)</option>
                        <option value="E(350-576)">CLASSE E(350-576)</option>
                      </CFormSelect>
                    </CInputGroup>
                  </CCol>
                </CRow>
              )}

                  {employeeFields.map((field, index) => (
                    <CRow key={field.id}>
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Employee</CInputGroupText>
                         
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
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Duree</CInputGroupText>
                        <CFormInput type="time" value={duree} onChange={handleDureeChange} />
                     
                        <CInputGroupText>Deadline</CInputGroupText>
                        <CFormInput
                          type="date"
                          value={deadline}
                          onChange={(event) => setDeadline(event.target.value)}
                        />
                    
                  <CInputGroupText>Qte</CInputGroupText>
                  <CFormInput
                    type="number"
                    value={qte}
                    onChange={handleQteChange}
                    placeholder="Enter Qte"
                  />
               
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
