/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { auth } from 'src/components/firebase-config'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import avatar1 from 'src/assets/images/logo-offciel.png'
import axios from 'axios';

const Login = () => {
  const [accessToken, setAccessToken] = useState(null); // State to store access token
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  
  const handleSignIn = async (e) => {
    e.preventDefault()

    try {

       await axios.post('http://localhost:4000/admin/login', {
        email: formData.email,
        password: formData.password,
      }).then(res => {
        const { token ,message } = res.data;
        if (token) {
          // Login successful
          localStorage.setItem('token', token);
          toast.success('Connexion réussie!');
          navigate('../addmissions') // Redirect to dashboard or any authenticated route
        } else {
          // Login failed
          toast.error(message || 'Erreur de connexion. Veuillez réessayer.');
        }
      });
    
    } catch (error) {
      console.error('Error signing in:', error.message);
      toast.error('Error signing in: ' + error.message);
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Email" autoComplete="email" name="email"
            value={formData.email}
            onChange={handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="password"
                        name="password"
                onChange={handleChange}
                value={formData.password} 
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleSignIn}>
                          Login
                        </CButton>
                      </CCol>
                     {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
  </CCol>*/}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                  <img
        className="logo"
        src={avatar1}
        alt="Statico Logo"
        style={{ width: '300px', height: '200px' }}
      />
                    {/*<h2>Sign up</h2>
                   
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
  </Link>*/}
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      </CContainer>
    </div>
  )
}

export default Login
