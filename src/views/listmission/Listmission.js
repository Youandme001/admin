/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import {
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import { collection, onSnapshot, deleteDoc, doc,getDocs } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ListMission = () => {
    const [missions, setMissions] = useState([]);
    const [userNames, setUserNames] = useState([]);
    const navigate = useNavigate();
  
    const fetchData = async () => {
      // Fetch user names once at the beginning
      const usersRef = collection(fire, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const names = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: `${doc.data().firstName} ${doc.data().lastName}`,
      }));
      setUserNames(names);
  
      // Fetch mission data
      const missionsRef = collection(fire, 'missions');
      onSnapshot(missionsRef, (snapshot) => {
        const missionArray = [];
        snapshot.forEach((doc) => {
          const missionData = doc.data();
          missionData.id = doc.id; // Unique identifier
          missionArray.push(missionData);
        });
        setMissions(missionArray);
      });
    };
  
    useEffect(() => {
      fetchData();
    }, []);

  const handleDelete = async (id) => {
    try {
      const missionRef = doc(fire, 'missions', id);
      await deleteDoc(missionRef);
      // Refresh the mission list after successful deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting mission:', error.message);
    }
  };

  const handleUpdate = (missionId) => {
    const missionToUpdate = missions.find((mission) => mission.id === missionId);

    if (missionToUpdate) {
      // Update your navigation logic if needed
      // navigate(`/updatemission/${missionId}`);
      console.log(`Navigate to update mission: ${missionId}`);
    } else {
      // Handle the case where the mission is not found
      console.log('Mission not found');
    }
  };

  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Mission</CTableHeaderCell>
            <CTableHeaderCell>Employees</CTableHeaderCell>
            <CTableHeaderCell>Duree</CTableHeaderCell>
            <CTableHeaderCell>Deadline</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {missions.map((mission) => (
            <CTableRow key={mission.id}>
              <CTableDataCell>{mission.id}</CTableDataCell>
              <CTableDataCell>{mission.mission}</CTableDataCell>
              <CTableDataCell>
                {mission.employees.map((employeeId, index) => (
                  <span key={employeeId}>
                    {index > 0 && ', '} {/* Add comma and space for multiple names */}
                    {userNames.find((user) => user.id === employeeId)?.name || 'Unknown'}
                  </span>
                ))}
              </CTableDataCell>
              <CTableDataCell>{mission.duree}</CTableDataCell>
              <CTableDataCell>{mission.deadline}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  // Update your Link to the update mission page if needed
                  component={Link}
                  to={`/updatemission/${mission.id}`}
                  variant="outline"
                  color="primary"
                >
                  Update
                </CButton>
                <CButton
                  variant="outline"
                  color="danger"
                  onClick={() => handleDelete(mission.id)}
                >
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
};

export default ListMission;
