import './index.css';
import PropTypes from 'prop-types';

const TitleSection = ({ title }) => {
  return (
    <div className="title-section">
      <hr className="line" />
      <h1 className="title">{title}</h1>
      <hr className="line flex-grow" />
    </div>
  );
};

export default TitleSection;

// PropTypes definition
TitleSection.propTypes = {
  title: PropTypes.string.isRequired
};

// Default props
TitleSection.defaultProps = {
  title: ""
};
