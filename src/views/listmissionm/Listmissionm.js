/* eslint-disable prettier/prettier */
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
  CForm,
} from '@coreui/react';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ListMission = () => {
  const [missions, setMissions] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [filters, setFilters] = useState({
    id: '',
    type: '',
    equipement: '',
    sn: '',
    technician: '',
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    // Fetch user names once at the beginning
    const usersRef = collection(fire, 'users1');
    const usersSnapshot = await getDocs(usersRef);
    const names = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: `${doc.data().firstName} ${doc.data().lastName}`,
    }));
    setUserNames(names);

    // Fetch mission data
    const missionsRef = collection(fire, 'maintenance1');
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
      const missionRef = doc(fire, 'maintenance1', id);
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
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const filteredMissions = missions.filter((mission) => {
    return (
      mission.id.toLowerCase().includes(filters.id.toLowerCase()) &&
      mission.type.toLowerCase().includes(filters.type.toLowerCase()) &&
      mission.equipement.toLowerCase().includes(filters.equipement.toLowerCase()) &&
      mission.sn.toLowerCase().includes(filters.sn.toLowerCase()) &&
      mission.employees
        .map((employeeId) => userNames.find((user) => user.id === employeeId)?.name || '')
        .join(', ')
        .toLowerCase()
        .includes(filters.technician.toLowerCase())
    );
  });

  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by ID"
                className="form-control"
                value={filters.id}
                onChange={(e) => handleFilterChange('id', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Type"
                className="form-control"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Equipement"
                className="form-control"
                value={filters.equipement}
                onChange={(e) => handleFilterChange('equipement', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Magasinier"
                className="form-control"
                value={filters.sn}
                onChange={(e) => handleFilterChange('sn', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Technician"
                className="form-control"
                value={filters.technician}
                onChange={(e) => handleFilterChange('technician', e.target.value)}
              />
            </CTableHeaderCell>
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
