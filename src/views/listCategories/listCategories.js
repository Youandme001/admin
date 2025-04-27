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
import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        if (response.data.message === 'Success') {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <CContainer className="mt-4">
      <div className="mb-3">
        <CFormInput
          type="text"
          placeholder="Filtrer par nom"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      <CTable hover responsive borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>ID</CTableHeaderCell>
            <CTableHeaderCell>Nom</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCategories.map((cat) => (
            <CTableRow key={cat.id}>
              <CTableDataCell>{cat.id}</CTableDataCell>
              <CTableDataCell>{cat.name}</CTableDataCell>
              <CTableDataCell>{cat.description}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
};

export default ListCategory;
