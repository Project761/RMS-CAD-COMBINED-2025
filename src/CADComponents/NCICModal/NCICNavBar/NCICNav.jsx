import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import './NavStyles.css';

const NCICNav = (props) => {
  const { tabState, setTabState } = props;

  return (
    <Nav variant="tabs" className="ncic-nav-tabs">
      <Nav.Item>
        <Nav.Link eventKey="vin-container" active={tabState === 'vin-container'} onClick={() => { setTabState('vin-container'); }}>By VIN</Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link eventKey="name-container" active={tabState === 'name-container'} onClick={() => { setTabState('name-container'); }}>By Name</Nav.Link>
      </Nav.Item> */}
      <Nav.Item>
        <Nav.Link eventKey="wanted-container" active={tabState === 'wanted-container'} onClick={() => { setTabState('wanted-container'); }}>By Wanted Person</Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link eventKey="wantedCheck-container" active={tabState === 'wantedCheck-container'} onClick={() => { setTabState('wantedCheck-container'); }}>By DL With Wanted Check</Nav.Link>
      </Nav.Item> */}
      <Nav.Item>
        <Nav.Link eventKey="stolen-vehicle" active={tabState === 'stolen-vehicle'} onClick={() => { setTabState('stolen-vehicle'); }}>By Query Stolen Vehicle</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="driver-license" active={tabState === 'driver-license'} onClick={() => { setTabState('driver-license'); }}>By Driver License</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};


export default NCICNav;

// PropTypes definition
NCICNav.propTypes = {
  tabState: PropTypes.string.isRequired,
  setTabState: PropTypes.func.isRequired,
};

// Default props
NCICNav.defaultProps = {
  tabState: 'vin-container',
  setTabState: () => { },
};