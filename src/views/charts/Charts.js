/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react';
import {
  CChartBar,
  CChartDoughnut,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs';
// import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';

const Charts = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  });

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Commandes',
        backgroundColor: '#f87979',
        data: [],
      },
    ],
  });

  const [gouvernoratChartData, setGouvernoratChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Commandes par gouvernorat',
        backgroundColor: '#36A2EB',
        data: [],
      },
    ],
  });
  const [commandes, setCommandes] = useState([]);
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommandes = async () => {
        try {
            // Retrieve token from localStorage
            const storedToken = localStorage.getItem('tokenadmin');
            
            if (!storedToken) {
                // Redirect to login if token is missing
                navigate(`/login`);
                return;
            }

            // Set token state
            setToken(storedToken);

            // Fetch data using Axios
            const response = await axios.get(`${API_BASE_URL}/commande`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`, // Use stored token
                },
            });

            if (response.data && response.data.message === 'Success') {
                // Process commandes data
                const commandesData = response.data.data;
                
                setCommandes(commandesData);

                // Calculate daily sums
                const dailyCounts = {};
                commandesData.forEach(item => {
                  const date = new Date(item.commandeDate).toISOString().split('T')[0];
                  dailyCounts[date] = (dailyCounts[date] || 0) + 1; // Count each commande
                });
        
                // Sort dates and counts
                const sortedDates = Object.keys(dailyCounts).sort();
                const sortedCounts = sortedDates.map(date => dailyCounts[date]);
        
                // Update bar chart data
                setBarChartData({
                  labels: sortedDates,
                  datasets: [{
                    label: 'Number of Commandes',
                    backgroundColor: '#f87979',
                    data: sortedCounts, // Use counts for the data
                  }],
                });
                const productQuantities = {};

                commandesData.forEach(item => {
                  if (item.products && item.products.length > 0) {
                    item.products.forEach(product => {
                      const name = product.name;
                      const quantity = product.quantity;
                      productQuantities[name] = (productQuantities[name] || 0) + quantity;
                    });
                  }
                });

                const productLabels = Object.keys(productQuantities);
                const productData = Object.values(productQuantities);
                const productColors = ['#41B883', '#00D8FF', '#E46651', '#DD1B16', '#FFD700', '#9370DB']; // Add more if needed

                setChartData({
                  labels: productLabels,
                  datasets: [{
                    backgroundColor: productColors.slice(0, productLabels.length),
                    data: productData,
                  }],
                });
                // Count commandes per gouvernorat
              const gouvernoratCounts = {};
              commandesData.forEach(item => {
                const gov = item.user?.gouvernorat || 'Inconnu';
                gouvernoratCounts[gov] = (gouvernoratCounts[gov] || 0) + 1;
              });

              const govLabels = Object.keys(gouvernoratCounts);
              const govData = Object.values(gouvernoratCounts);

              setGouvernoratChartData({
                labels: govLabels,
                datasets: [
                  {
                    label: 'Commandes par gouvernorat',
                    backgroundColor: '#36A2EB',
                    data: govData,
                  },
                ],
              });

            } else if (response.data.message === 'Unauthorized: Access token is required') {
                // Redirect to login if token is unauthorized
                navigate(`/login`);
            }
        } catch (error) {
            console.error('Error fetching commandes:', error);
        }
    };

    // Call fetchCommandes function
    fetchCommandes();
}, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <CRow>
      
      
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Nombre de Commandes par Jour</CCardHeader>
          <CCardBody>
            <CChartBar data={barChartData} labels="days" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
  <CCard className="mb-4">
    <CCardHeader>Nombre de Commandes par Région</CCardHeader>
    <CCardBody>
      <CChartBar data={gouvernoratChartData} labels="gouvernorats" />
    </CCardBody>
  </CCard>
</CCol>

        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardHeader>Produits les plus commandés</CCardHeader>
            <CCardBody>
              <CChartDoughnut data={chartData} />
            </CCardBody>
          </CCard>
        </CCol>

      <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>Répartition des Produits Commandés</CCardHeader>
        <CCardBody>
          <CChartPie data={chartData} />
        </CCardBody>
      </CCard>
    </CCol>
    </CRow>
  )
}

export default Charts
