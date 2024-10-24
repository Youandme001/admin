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
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    price: '',
    volume: '',
    propertiesCosmetics: '',
  });

  const navigate = useNavigate();

  // const fetchData = async () => {
  //   const productsRef = collection(fire, 'products');
  //   onSnapshot(productsRef, (snapshot) => {
  //     const productArray = [];
  //     snapshot.forEach((doc) => {
  //       const productData = doc.data();
  //       productData.id = doc.id;
  //       productArray.push(productData);
  //     });
  //     setProducts(productArray);
  //   });
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios.get('http://localhost:4000/produit')
        .then(res => {
          const { message , data } = res.data;
          if (message==="Success") {
            setProducts(data);
          }
          });
        
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // const handleDelete = async (id) => {
  //   try {
  //     const productRef = doc(fire, 'products', id);
  //     await deleteDoc(productRef);
  //   } catch (error) {
  //     console.error('Erreur lors de la suppression du produit:', error.message);
  //   }
  // };

  const handleUpdate = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
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
      <CTable responsive="sm" hover borderless>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filtrer par nom"
                className="form-control"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filtrer par prix"
                className="form-control"
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filtrer par volume"
                className="form-control"
                value={filters.volume}
                onChange={(e) => handleFilterChange('volume', e.target.value)}
              />
            </CTableHeaderCell>
            <CTableHeaderCell>
              <input
                type="text"
                placeholder="Filtrer par propriétés cosmétiques"
                className="form-control"
                value={filters.propertiesCosmetics}
                onChange={(e) => handleFilterChange('propertiesCosmetics', e.target.value)}
              />
            </CTableHeaderCell>
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
                {product.images && product.images.length > 0 && (
                  <CImage src={product.images[0].filepath} height={50} />
                )}
              </CTableDataCell>
              <CTableDataCell>
                <CButton
                  variant="outline"
                  color="info"
                  onClick={() => handleUpdate(product.id)}
                  className="me-2"
                >
                  Modifier
                </CButton>
                {/* <CButton
                  variant="outline"
                  color="danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Supprimer
                </CButton> */}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </CContainer>
  );
};

export default ListProduct;

