import './index.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const TitleCmp = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className='header-Container'>
      <span>{title}</span>
      <button type="button"
        className="btn btn-sm bg-white btn-border"
        onClick={() => {
          navigate('/cad/dashboard-page');
        }}
      >
        <div style={{ display: "grid" }}>
          <span>Close</span>
        </div>
      </button>
    </div>
  );
}

export default TitleCmp;

// PropTypes definition
TitleCmp.propTypes = {
  title: PropTypes.string.isRequired
};

// Default props
TitleCmp.defaultProps = {
  title: ""
};
