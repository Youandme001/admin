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
  CAvatar,
} from '@coreui/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Listuser = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState();
    
    const fetchUser = async () => {
      const token =localStorage.getItem('token');
      setToken(token);
      try {
        const response = await axios.get('http://localhost:4000/user', {
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
        });
        if (response.data && response.data.message === 'Success') {
          setUsers(response.data.data);
        } else if (response.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`);
        }
      } catch (error) {
        console.error('Error fetching commandes:', error);
      }
    };
   

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      const userRef = doc(fire, 'users1', id);
      await deleteDoc(userRef);
      // Refresh the user list after successful deletion
      fetchUser();
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
        
          <CTableHeaderCell>Image</CTableHeaderCell>
          <CTableHeaderCell>Nom</CTableHeaderCell>
          <CTableHeaderCell>Prénom</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Calcification</CTableHeaderCell>
          <CTableHeaderCell>point fort</CTableHeaderCell>
          <CTableHeaderCell>Specialité</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {users.map((user) => (
          <CTableRow key={user.id}>
            
            <CTableDataCell>
              {/* Display the user's image */}
              <img
                  src={user.imageUrl}
                  alt={`Image of ${user.firstName} ${user.lastName}`}
                  style={{
                    maxWidth: '50px',
                    maxHeight: '50px',
                    borderRadius: '50%',
                  }}
                />
            </CTableDataCell>
            <CTableDataCell>{user.lastName}</CTableDataCell>
            <CTableDataCell>{user.firstName}</CTableDataCell>
            <CTableDataCell>{user.email}</CTableDataCell>
            <CTableDataCell>{user.calcification}</CTableDataCell>
            <CTableDataCell>{user.pointfort}</CTableDataCell>
            <CTableDataCell>{user.specialite}</CTableDataCell>
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
