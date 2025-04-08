/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CCard, CCardBody, CCol, CCardHeader, CRow,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem,
  CWidgetStatsA
} from '@coreui/react';
import {
  CChartBar, CChartDoughnut, CChartLine, CChartPie
} from '@coreui/react-chartjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons';
import { getStyle } from '@coreui/utils';

const Charts = () => {
  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [{ label: 'Total Commandes', backgroundColor: '#f87979', data: [] }] });
  const [gouvernoratChartData, setGouvernoratChartData] = useState({ labels: [], datasets: [{ label: 'Commandes par gouvernorat', backgroundColor: '#36A2EB', data: [] }] });
  const [commandes, setCommandes] = useState([]);
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [dashboardStats, setDashboardStats] = useState({
    confirmedTotal: 0,
    confirmedCount: 0,
    pendingCount: 0,
    todayCount: 0,
    percentChange: '0.00'
  });

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) setTimeout(() => { widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary'); widgetChartRef1.current.update(); });
      if (widgetChartRef2.current) setTimeout(() => { widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info'); widgetChartRef2.current.update(); });
    });

    const fetchDashboardStats = async () => {
      try {
        const storedToken = localStorage.getItem('tokenadmin');
        if (!storedToken) return navigate('/login');
        
        const response = await axios.get(`${API_BASE_URL}/commande/stats`, {
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${storedToken}` 
          },
        });
        
        setDashboardStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    const fetchCommandes = async () => {
      try {
        const storedToken = localStorage.getItem('tokenadmin');
        if (!storedToken) return navigate('/login');
        setToken(storedToken);
        const response = await axios.get(`${API_BASE_URL}/commande`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedToken}` },
        });

        if (response.data?.message === 'Success') {
          const commandesData = response.data.data.filter(c => c.state === 'Confirmed');
          setCommandes(commandesData);

          const dailyCounts = {};
          commandesData.forEach(item => {
            const date = new Date(item.commandeDate).toISOString().split('T')[0];
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          });

          const sortedDates = Object.keys(dailyCounts).sort();
          const sortedCounts = sortedDates.map(date => dailyCounts[date]);

          setBarChartData({ 
            labels: sortedDates, 
            datasets: [{ 
              label: 'Number of Commandes', 
              backgroundColor: '#f87979', 
              data: sortedCounts 
            }] 
          });

          const productQuantities = {};
          commandesData.forEach(item => item.products?.forEach(p => { 
            productQuantities[p.name] = (productQuantities[p.name] || 0) + p.quantity; 
          }));

          const productLabels = Object.keys(productQuantities);
          const productData = Object.values(productQuantities);
          const productColors = ['#41B883', '#00D8FF', '#E46651', '#DD1B16', '#FFD700', '#9370DB'];

          setChartData({ 
            labels: productLabels, 
            datasets: [{ 
              backgroundColor: productColors.slice(0, productLabels.length), 
              data: productData 
            }] 
          });

          const gouvernoratCounts = {};
          commandesData.forEach(item => { 
            const gov = item.user?.gouvernorat || 'Inconnu'; 
            gouvernoratCounts[gov] = (gouvernoratCounts[gov] || 0) + 1; 
          });
          
          setGouvernoratChartData({ 
            labels: Object.keys(gouvernoratCounts), 
            datasets: [{ 
              label: 'Commandes par gouvernorat', 
              backgroundColor: '#36A2EB', 
              data: Object.values(gouvernoratCounts) 
            }] 
          });
        }
      } catch (err) {
        console.error('Error fetching commandes:', err);
      }
    };

    fetchDashboardStats();
    fetchCommandes();
  }, []);

  const getArrowIcon = (percent) => {
    return percent >= 0 ? cilArrowTop : cilArrowBottom;
  };

  const getTrendColor = (percent) => {
    return percent >= 0 ? 'success' : 'danger';
  };

  return (
    <CRow>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {dashboardStats.confirmedCount}{' '}
              <span className={`fs-6 fw-normal text-${getTrendColor(dashboardStats.percentChange)}`}>
                {/* ({dashboardStats.percentChange}% <CIcon icon={getArrowIcon(dashboardStats.percentChange)} />) */}
              </span>
            </>
          }
          title="Commandes confirmées"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                {/* <CIcon icon={cilOptions} /> */}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
                <CDropdownItem>Export Data</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Confirmed Orders',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [30, 45, 27, 56, 38, 62],
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: { display: false },
                    grid: { display: false, drawBorder: false },
                    ticks: { display: false },
                  },
                  y: {
                    min: 0,
                    max: 80,
                    display: false,
                    grid: { display: false },
                    ticks: { display: false },
                  },
                },
                elements: {
                  line: { borderWidth: 1, tension: 0.4 },
                  point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                },
              }}
            />
          }
        />
      </CCol>
      
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {Number(dashboardStats.confirmedTotal || 0).toFixed(2)}{' DNT'}
              
            </>
          }
          title="Revenu"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                {/* <CIcon icon={cilOptions} /> */}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
                <CDropdownItem>Export Data</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Revenue',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1200, 1800, 900, 1700, 3400, 2200],
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: { display: false },
                    grid: { display: false, drawBorder: false },
                    ticks: { display: false },
                  },
                  y: {
                    min: 0,
                    max: 4000,
                    display: false,
                    grid: { display: false },
                    ticks: { display: false },
                  },
                },
                elements: {
                  line: { borderWidth: 1 },
                  point: { radius: 4, hitRadius: 10, hoverRadius: 4 },
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {dashboardStats.pendingCount}{' '}
            </>
          }
          title="Commandes en attente"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                {/* <CIcon icon={cilOptions} /> */}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
                <CDropdownItem>Export Data</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Pending Orders',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [15, 21, 18, 25, 14, 22],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  x: { display: false },
                  y: { display: false },
                },
                elements: {
                  line: { borderWidth: 2, tension: 0.4 },
                  point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
                },
              }}
            />
          }
        />
      </CCol>

      <CCol sm={6} xl={4} xxl={3} className="mb-4">
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {dashboardStats.todayCount}{' '}
              <span className={`fs-6 fw-normal text-${getTrendColor(dashboardStats.percentChange)}`}>
                ({dashboardStats.percentChange}% <CIcon icon={getArrowIcon(dashboardStats.percentChange)} />)
              </span>
            </>
          }
          title="Commandes du jour"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                {/* <CIcon icon={cilOptions} /> */}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
                <CDropdownItem>Export Data</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Weekly Orders',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [12, 15, 8, 14, 18, 10, 6],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    grid: { display: false, drawTicks: false },
                    ticks: { display: false },
                  },
                  y: {
                    border: { display: false },
                    grid: { display: false, drawBorder: false, drawTicks: false },
                    ticks: { display: false },
                  },
                },
              }}
            />
          }
        />
      </CCol>

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
  );
};

export default Charts;