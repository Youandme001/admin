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
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MissionList = () => {
  const [missions, setMissions] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [filters, setFilters] = useState({
    mission: '',
    employees: '',
    duree: '',
    deadline: '',
    qte: '',
    temps: '',
  });
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
const handleFilterChange = (column, value) => {
  setFilters((prevFilters) => ({
    ...prevFilters,
    [column]: value,
  }));
};

const filteredMissions = missions.filter((mission) => {
  return (
    mission.mission.toLowerCase().includes(filters.mission.toLowerCase()) &&
    mission.employees
      .map((employeeId) => userNames.find((user) => user.id === employeeId)?.name || '')
      .join(', ')
      .toLowerCase()
      .includes(filters.employees.toLowerCase()) &&
    mission.duree.toLowerCase().includes(filters.duree.toLowerCase()) &&
    mission.deadline.toLowerCase().includes(filters.deadline.toLowerCase()) &&
    mission.qte.toLowerCase().includes(filters.qte.toLowerCase()) &&
    mission.temps.toLowerCase().includes(filters.temps.toLowerCase())
  );
});
const countProjectsForFilteredEmployee = () => {
  if (isFilteringByEmployees) {
    const filteredEmployeeId =
      userNames.find(
        (user) =>
          user.name.toLowerCase() === filters.employees.toLowerCase()
      )?.id || '';

    if (filteredEmployeeId) {
      return filteredMissions.filter((mission) =>
        mission.employees.includes(filteredEmployeeId)
      ).length;
    }
  }

  return 0;
};

const isFilteringByEmployees = filters.employees.trim() !== '';
  return (
    <CContainer className="mt-4">
       {isFilteringByEmployees && (
        <div className="mb-3">
          {`${filters.employees}: ${countProjectsForFilteredEmployee()} projects`}
        </div>
      )}
      <CTable responsive="sm" hover borderless>
        <CTableHead>
        <CTableRow>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Mission"
                className="form-control"
                value={filters.mission}
                onChange={(e) => handleFilterChange('mission', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Employees"
                className="form-control"
                value={filters.employees}
                onChange={(e) => handleFilterChange('employees', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Duree"
                className="form-control"
                value={filters.duree}
                onChange={(e) => handleFilterChange('duree', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="date"
                placeholder="Filter by Deadline"
                className="form-control"
                value={filters.deadline}
                onChange={(e) => handleFilterChange('deadline', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Qte"
                className="form-control"
                value={filters.qte}
                onChange={(e) => handleFilterChange('qte', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filter by Temps"
                className="form-control"
                value={filters.temps}
                onChange={(e) => handleFilterChange('temps', e.target.value)}
              />
            </CTableHeaderCell>
          
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
        {filteredMissions.map((mission) => (
            <CTableRow key={mission.id}>
             
              <CTableDataCell>{mission.mission}</CTableDataCell>
              <CTableDataCell>  {mission.employees.map((employeeId, index) => (
                  <span key={employeeId}>
                    {index > 0 && ', '}
                    {userNames.find((user) => user.id === employeeId)?.name || 'Unknown'}
                  </span>
                ))}</CTableDataCell>
              <CTableDataCell>{mission.duree}</CTableDataCell>
              <CTableDataCell>{mission.deadline}</CTableDataCell>
              <CTableDataCell>{mission.qte}</CTableDataCell>
              <CTableDataCell>{mission.temps}</CTableDataCell>
             
              <CTableDataCell>
                <CButton
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

export default MissionList;