/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { CRow, CCol, CWidgetStatsA } from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WidgetsDropdown = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalCommands, setTotalCommands] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        setToken(token);

        const [commandesResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:4000/commande', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            }
          }),
          axios.get('http://localhost:4000/user', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            }
          })
        ]);

        if (commandesResponse.data && commandesResponse.data.message === 'Success') {
          const fetchedCommandes = commandesResponse.data.data;
          setTotalCommands(fetchedCommandes.length);

          let totalPrice = 0;
          fetchedCommandes.forEach(commande => {
            totalPrice += parseFloat(commande.totalPrice);
          });

          setTotalSales(totalPrice);
          setAverageOrderValue(totalPrice / fetchedCommandes.length);
        } else if (commandesResponse.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`);
        }

        if (usersResponse.data && usersResponse.data.message === 'Users found') {
          const fetchedUsers = usersResponse.data.data;
          setTotalUsers(fetchedUsers.length);
        } else if (usersResponse.data.message === 'Unauthorized: Access token is required') {
          navigate(`/login`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const userPercentageChange = 0; // Calculate this if needed
  const salesPercentageChange = 0;

  return (
    <CRow>
    <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={`${totalUsers}`}
          title="Users"
          action={
            <span className="fs-6 fw-normal">
              {userPercentageChange.toFixed(1)}%{' '}
              {userPercentageChange >= 0 ? (
                <CIcon icon={cilArrowTop} className="text-success" />
              ) : (
                <CIcon icon={cilArrowBottom} className="text-danger" />
              )}
            </span>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Users',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: 'rgba(255,255,255,.55)',
                    data: [65, 59, 84, 84, 51, 55, 40], // Replace with your data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success"
          value={`$${totalSales}`}
          title="Total Sales"
          action={
            <span className="fs-6 fw-normal">
              {salesPercentageChange.toFixed(1)}%{' '}
              {salesPercentageChange >= 0 ? (
                <CIcon icon={cilArrowTop} className="text-success" />
              ) : (
                <CIcon icon={cilArrowBottom} className="text-danger" />
              )}
            </span>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'Sales',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: 'rgba(255,255,255,.55)',
                    data: [65, 59, 84, 84, 51, 55, 40], // Replace with your sales data
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
  <CWidgetStatsA
    className="mb-4"
    color="warning"
    value={`${totalCommands}`} // Display the total number of commands
    title="Total Commands"
    chart={
      <CChartLine
        className="mt-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Commands',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [78, 81, 80, 45, 34, 12, 40], // Replace with your commands data
              fill: true,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    }
  />
</CCol>


<CCol sm={6} lg={3}>
  <CWidgetStatsA
    className="mb-4"
    color="info"
    value={`$${averageOrderValue.toFixed(2)}`} // Display the average order value
    title="Average Order Value"
    chart={
      <CChartLine
        className="mt-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Average Order Value',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [50, 60, 70, 80, 90, 100, 110], // Replace with your average order value data
              fill: true,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    }
  />
</CCol>

    </CRow>
  )
}

export default WidgetsDropdown
