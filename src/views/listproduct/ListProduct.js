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
  CImage,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import './ListProduct.css'; // optional if you want to enhance styles

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    price: '',
    volume: '',
    propertiesCosmetics: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/produit`);
        const { message, data } = res.data;
        if (message === 'Success') {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      product.price.toString().includes(filters.price) &&
      product.volume.toString().toLowerCase().includes(filters.volume.toLowerCase()) &&
      (product.propertiesCosmetics || '').toLowerCase().includes(filters.propertiesCosmetics.toLowerCase())
    );
  });

  return (
    <CContainer className="mt-4">
  {/* Filters (Always Visible) */}
  <div className="row g-2 mb-4">
    <div className="col-12 col-md-3">
      <input
        type="text"
        placeholder="Filtrer par nom"
        className="form-control"
        value={filters.name}
        onChange={(e) => handleFilterChange('name', e.target.value)}
      />
    </div>
    <div className="col-12 col-md-3">
      <input
        type="text"
        placeholder="Filtrer par prix"
        className="form-control"
        value={filters.price}
        onChange={(e) => handleFilterChange('price', e.target.value)}
      />
    </div>
    <div className="col-12 col-md-3">
      <input
        type="text"
        placeholder="Filtrer par volume"
        className="form-control"
        value={filters.volume}
        onChange={(e) => handleFilterChange('volume', e.target.value)}
      />
    </div>
    <div className="col-12 col-md-3">
      <input
        type="text"
        placeholder="Filtrer par propriétés"
        className="form-control"
        value={filters.propertiesCosmetics}
        onChange={(e) => handleFilterChange('propertiesCosmetics', e.target.value)}
      />
    </div>
  </div>

  {/* Desktop Table */}
  <div className="d-none d-md-block">
    <CTable responsive hover borderless>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Nom</CTableHeaderCell>
          <CTableHeaderCell>Prix</CTableHeaderCell>
          <CTableHeaderCell>Volume</CTableHeaderCell>
          <CTableHeaderCell>Propriétés</CTableHeaderCell>
          <CTableHeaderCell>Image</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {filteredProducts.map((product) => (
          <CTableRow key={product.id}>
            <CTableDataCell>{product.name}</CTableDataCell>
            <CTableDataCell>{product.price}</CTableDataCell>
            <CTableDataCell>{product.volume}</CTableDataCell>
            <CTableDataCell>{product.propertiesCosmetics}</CTableDataCell>
            <CTableDataCell>
              {product.images?.length > 0 && (
                <CImage src={product.images[0].filepath} height={50} />
              )}
            </CTableDataCell>
            <CTableDataCell>
              <CButton
                variant="outline"
                color="info"
                onClick={() => handleUpdate(product.id)}
              >
                Modifier
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  </div>

  {/* Mobile Card List */}
  <div className="d-md-none">
    {filteredProducts.map((product) => (
      <div key={product.id} className="card mb-3 p-3 shadow-sm">
        <h5>{product.name}</h5>
        <p><strong>Prix:</strong> {product.price} DT</p>
        <p><strong>Volume:</strong> {product.volume}</p>
        <p><strong>Propriétés:</strong> {product.propertiesCosmetics}</p>
        {product.images?.length > 0 && (
          <img
            src={product.images[0].filepath}
            alt={product.name}
            className="img-fluid mb-2"
            style={{ maxHeight: '120px' }}
          />
        )}
        <CButton
          variant="outline"
          color="info"
          onClick={() => handleUpdate(product.id)}
        >
          Modifier
        </CButton>
      </div>
    ))}
  </div>
    </CContainer>
  );
};

export default ListProduct;
