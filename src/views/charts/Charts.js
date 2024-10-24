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
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            const storedToken = localStorage.getItem('token');
            
            if (!storedToken) {
                // Redirect to login if token is missing
                navigate(`/login`);
                return;
            }

            // Set token state
            setToken(storedToken);

            // Fetch data using Axios
            const response = await axios.get('http://localhost:4000/commande', {
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
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar data={barChartData} labels="days" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
  <CCard className="mb-4">
    <CCardHeader>Bar Chart - Gouvernorats</CCardHeader>
    <CCardBody>
      <CChartBar data={gouvernoratChartData} labels="gouvernorats" />
    </CCardBody>
  </CCard>
</CCol>

      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
      <CCard className="mb-4">
        <CCardHeader>Pie Chart</CCardHeader>
        <CCardBody>
          <CChartPie data={chartData} />
        </CCardBody>
      </CCard>
    </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Polar Area Chart</CCardHeader>
          <CCardBody>
            <CChartPolarArea
              data={{
                labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
                datasets: [
                  {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Radar Chart</CCardHeader>
          <CCardBody>
            <CChartRadar
              data={{
                labels: [
                  'Eating',
                  'Drinking',
                  'Sleeping',
                  'Designing',
                  'Coding',
                  'Cycling',
                  'Running',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                    data: [65, 59, 90, 81, 56, 55, 40],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                    data: [28, 48, 40, 19, 96, 27, 100],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
