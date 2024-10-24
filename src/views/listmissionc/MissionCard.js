/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React from 'react';
import PropTypes from 'prop-types';
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardFooter,
  CCol,
  CRow,
  CButton,
} from '@coreui/react';
import img from '../../assets/images/DSC03159.JPG';
import img1 from '../../assets/images/DSC03207.JPG';
import img2 from '../../assets/images/DSC03216.JPG';
import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MissionCard = ({ mission, onDelete, onUpdate, userNames }) => {
  const getEmployeeNames = () => {
    return mission.employees.map((employeeId) => {
      const userName = userNames.find((user) => user.id === employeeId);
      return userName ? userName.fullName : '';
    });
  };
  const navigate = useNavigate();
  const handleInfoClick = (missionId) => {
    // Navigate to the "InfoMission" page with the mission ID
    navigate(`/infomission/${missionId}`);
  };
  // Determine which image to display based on mission.mission
  const missionImage = (mission.mission === 'ASPOCK') ? img : (mission.mission === 'ACTIA') ? img1 : img2;

  return (
    <CRow>
      <CCol>
        <CCard>
          {/* Add your image source to CCardImage */}
          <CCardImage orientation="top" src={missionImage} />
          <CCardBody>
            <CCardTitle>{mission.mission}</CCardTitle>
            <CCardText>
              <strong>Employees:</strong>{' '}
              {mission.employees.map((employeeId, index) => (
                <span key={employeeId}>
                  {userNames[index]}
                  {index !== mission.employees.length - 1 && ', '}
                </span>
              ))}
              <br />
              <strong>Duree:</strong> {mission.duree}
              <br />
              <strong>Deadline:</strong> {mission.deadline}
            </CCardText>
          </CCardBody>
          <CCardFooter>
          <CButton
                  // Update your Link to the update mission page if needed
                  component={Link}
                  to={`/updatemission/${mission.id}`}
                  variant="outline"
                  color="primary"
                >
                  Update
                </CButton>
            <CButton color="danger" onClick={() => onDelete(mission.id)}>
              Delete
            </CButton>
            <CButton
                  // Update your Link to the update mission page if needed
                  component={Link}
                  to={`/infomission/${mission.id}`}
                  variant="outline"
                  color="primary"
                >
                  info
                </CButton>

          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

MissionCard.propTypes = {
  mission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    mission: PropTypes.string.isRequired,
    employees: PropTypes.arrayOf(PropTypes.string).isRequired,
    duree: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  userNames: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MissionCard;
