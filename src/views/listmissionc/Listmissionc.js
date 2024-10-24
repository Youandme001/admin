/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// ListMission.js

import React, { useEffect, useState } from 'react';
import { CContainer, CCol, CRow } from '@coreui/react';
import MissionCard from './MissionCard';
import { collection, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';

const ListMission = () => {
  const [missions, setMissions] = useState([]);
  const [userNames, setUserNames] = useState([]);

  const fetchData = async () => {
    // Fetch missions data
    const missionsRef = collection(fire, 'missions');
    onSnapshot(missionsRef, (snapshot) => {
      const missionArray = [];
      snapshot.forEach((doc) => {
        const missionData = doc.data();
        missionData.id = doc.id; // Unique identifier
        missionArray.push(missionData);
      });
      console.log('Fetched Missions:', missionArray); // Log fetched missions
      setMissions(missionArray);
    });

    // Fetch user names
    const usersCollection = collection(fire, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    const names = [];
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const fullName = `${userData.firstName} ${userData.lastName}`;
      names.push(fullName);
    });

    setUserNames(names);
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
      <CRow>
        {missions.map((mission) => (
          <CCol key={mission.id} md="4">
            {/* Render MissionCard component for each mission */}
            <MissionCard
              mission={mission}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              userNames={userNames}
            />
          </CCol>
        ))}
      </CRow>
    </CContainer>
  );
};

export default ListMission;

