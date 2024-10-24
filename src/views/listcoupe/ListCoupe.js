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
  CFormInput,
} from '@coreui/react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ListCoupe = () => {
  const [coupes, setCoupes] = useState([]);
  const [filters, setFilters] = useState({
    ns: '',
    frequence: '',
    taches: '',
    etat: '',
    action: '',
    remarque: '',
  });

  const fetchData = async () => {
    const coupesRef = collection(fire, 'coupe');
    onSnapshot(coupesRef, (snapshot) => {
      const coupeArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCoupes(coupeArray);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const coupeRef = doc(fire, 'coupe', id);
      await deleteDoc(coupeRef);
    } catch (error) {
      console.error('Error deleting coupe:', error.message);
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const filteredCoupes = coupes.filter((coupe) => {
    return (
      coupe.ns.toLowerCase().includes(filters.ns.toLowerCase()) &&
      coupe.frequence.toLowerCase().includes(filters.frequence.toLowerCase()) &&
      coupe.taches.toLowerCase().includes(filters.taches.toLowerCase()) &&
      coupe.etat.toLowerCase().includes(filters.etat.toLowerCase()) &&
      coupe.action.toLowerCase().includes(filters.action.toLowerCase()) &&
      coupe.remarque.toLowerCase().includes(filters.remarque.toLowerCase())
    );
  });

  return (
    <CContainer className="mt-4">
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by N/S"
                value={filters.ns}
                onChange={(e) => handleFilterChange('ns', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by Fréquence"
                value={filters.frequence}
                onChange={(e) => handleFilterChange('frequence', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by Tâches"
                value={filters.taches}
                onChange={(e) => handleFilterChange('taches', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by État"
                value={filters.etat}
                onChange={(e) => handleFilterChange('etat', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by Action"
                value={filters.action}
                onChange={(e) => handleFilterChange('action', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <CFormInput
                type="text"
                placeholder="Filter by Remarque"
                value={filters.remarque}
                onChange={(e) => handleFilterChange('remarque', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCoupes.map((coupe) => (
            <CTableRow key={coupe.id}>
              <CTableDataCell>{coupe.ns}</CTableDataCell>
              <CTableDataCell>{coupe.frequence}</CTableDataCell>
              <CTableDataCell>{coupe.taches}</CTableDataCell>
              <CTableDataCell>{coupe.etat}</CTableDataCell>
              <CTableDataCell>{coupe.action}</CTableDataCell>
              <CTableDataCell>{coupe.remarque}</CTableDataCell>
              <CTableDataCell>
              <CButton
                  component={Link}
                  to={`/updatecoupe/${coupe.id}`}
                  variant="outline"
                  color="primary"
                >
                  Update
                </CButton>
                <CButton
                  variant="outline"
                  color="danger"
                  onClick={() => handleDelete(coupe.id)}
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

export default ListCoupe;
