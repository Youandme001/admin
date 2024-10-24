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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Listuser = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();

  const fetchData = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const usersRef = collection(fire, 'users');
        onSnapshot(usersRef, (snapshot) => {
          const userArray = [];
          snapshot.forEach((doc) => {
            const userData = doc.data();
            userData.id = doc.id; // Unique identifier
            userArray.push(userData);
          });
          setUsers(userArray);
        });
      } else {
        setUsers([]);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [auth]);

  const handleDelete = async (id) => {
    try {
      const userRef = doc(fire, 'users', id);
      await deleteDoc(userRef);
      // Refresh the user list after successful deletion
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  const handleUpdate = (userId) => {
    const userToUpdate = users.find((user) => user.id === userId);

    if (userToUpdate) {
      navigate(`/update/${userId}`);
    } else {
      navigate('/listemployee');
    }
  };

  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>First Name</CTableHeaderCell>
            <CTableHeaderCell>Last Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Fonction</CTableHeaderCell>
            <CTableHeaderCell>Matricule</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user.id}>
              <CTableDataCell>{user.id}</CTableDataCell>
              <CTableDataCell>{user.firstName}</CTableDataCell>
              <CTableDataCell>{user.lastName}</CTableDataCell>
              <CTableDataCell>{user.email}</CTableDataCell>
              <CTableDataCell>{user.fonction}</CTableDataCell>
              <CTableDataCell>{user.matricule}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  component={Link}
                  to={`/updateuser/${user.id}`}
                  variant="outline"
                  color="primary"
                >
                  Update
                </CButton>
                <CButton
                  variant="outline"
                  color="danger"
                  onClick={() => handleDelete(user.id)}
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

export default Listuser;
