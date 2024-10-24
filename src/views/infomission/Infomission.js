/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CButton, CCard, CCardBody, CCol, CContainer, CRow, CCardHeader } from '@coreui/react';
import { doc, getDoc } from 'firebase/firestore';
import { fire } from '../../components/firebase-config';
import { useParams } from 'react-router-dom';
import {
    CChartDoughnut,
    CChartLine,
} from '@coreui/react-chartjs';
import { useReactToPrint } from 'react-to-print';
import img from '../../assets/images/logo-offciel.png';

const DisplayMissionInfoPage = () => {
    const random = () => Math.round(Math.random() * 100);
    const { missionId } = useParams();
    const [missionData, setMissionData] = useState(null);
    const signatureRef = useRef(null);
    const componentRef = useRef();

    useEffect(() => {
        const missionRef = doc(fire, 'missions', missionId);

        const fetchMissionData = async () => {
            try {
                const snapshot = await getDoc(missionRef);
                if (snapshot.exists()) {
                    const missionInfo = snapshot.data();
                    setMissionData(missionInfo);
                } else {
                    console.error('Mission not found');
                }
            } catch (error) {
                console.error('Error fetching mission data:', error);
            }
        };

        fetchMissionData();
    }, [missionId]);

    const handleSaveSignature = () => {
        const signatureData = signatureRef.current.toDataURL();
        // You can save the signatureData to your database or perform other actions.
        console.log('Signature Data:', signatureData);
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const currentDate = new Date().toLocaleDateString();

    return (
        <CContainer className="mt-4">
            <div ref={componentRef}>
                {/* Header for the PDF */}
                <div className="d-flex justify-content-between mb-4">
                    <img src={img} alt="Logo" width="100" height="100" />
                    <div>
                        <div>Date: {currentDate}</div>
                        {/* Add any additional information or styling here */}
                    </div>
                </div>

                <h4 className="text-center mb-4">Invoice</h4>
                {missionData ? (
                    <div>
                        {/* Display Mission Information */}
                        <CCard>
                            <CCardBody>
                                <CRow>
                                    <CCol md="6">
                                        <strong>Mission:</strong> {missionData.mission}
                                        <br />
                                        <strong>Employees:</strong> {missionData.employees.join(', ')}
                                        <br />
                                        <strong>Duree:</strong> {missionData.duree}
                                        <br />
                                        <strong>Deadline:</strong> {missionData.deadline}<br/>
                                        <strong>Project Status:</strong> Finished
                                    </CCol>
                                </CRow>
                            
                       

                       

                        {/* Display Charts */}
                        
                            {/* Doughnut Chart */}
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
    style={{
        width: '400px', // Adjust the width as needed
        height: '400px', // Adjust the height as needed
        margin: '0 auto', // Center the chart horizontally
        display: 'block', // Ensure it's treated as a block element
    }}
/>
                                    </CCardBody>
                               
                            

                                    <CChartLine
    data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                borderColor: 'rgba(220, 220, 220, 1)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data: [
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                ],
            },
            {
                label: 'My Second dataset',
                backgroundColor: 'rgba(151, 187, 205, 0.2)',
                borderColor: 'rgba(151, 187, 205, 1)',
                pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                pointBorderColor: '#fff',
                data: [
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                    random(),
                ],
            },
        ],
    }}
    style={{
        width: '700px', // Adjust the width as needed
        height: '399px', // Adjust the height as needed
        margin: '0 auto', // Center the chart horizontally
        display: 'block', // Ensure it's treated as a block element
    }}
>
    
</CChartLine>
</CCard>               
                             {/* Signature Component */}
                             <CCard>   
                            <CCardBody>
                                <div className="text-center">
                                    <SignatureCanvas
                                        ref={signatureRef}
                                        canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
                                    />
                                </div>
                                {/* Hide the "Save Signature" button in the printed version */}
                                <CButton color="primary" onClick={handleSaveSignature} className="d-print-none">
                                    Save Signature
                                </CButton>
                            </CCardBody>
                        </CCard>
                        
                    </div>
                ) : (
                    <div>Loading mission information...</div>
                )}
            </div>

            {/* Print Button (Hidden in Print Version) */}
            <CButton
                color="primary"
                onClick={handlePrint}
                className="d-print-none"
            >
                Save PDF
            </CButton>
        </CContainer>
    );
};

export default DisplayMissionInfoPage;

