import { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import PropTypes from 'prop-types';
import 'react-resizable/css/styles.css'; // Import the necessary CSS for the resizable component
import './index.css'; // Assuming you'll add the new styles here

const ResizableContainer = ({ children, maxHeight, defaultHeight = 0.2 }) => {
  const [height, setHeight] = useState(window.innerHeight * defaultHeight); // Initial height


  const handleResize = (event, { size }) => {
    setHeight(size.height); // Update the height on resize
  };

  return (
    <div>
      <ResizableBox
        style={{
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
        width={Infinity} // Make the width flexible to take full width
        height={height} // Dynamic height based on state
        onResize={handleResize} // Handle resizing event
        minConstraints={[Infinity, 100]} // Minimum height
        maxConstraints={[Infinity, maxHeight]} // Maximum height
      >
        {children}
      </ResizableBox>
    </div>
  );
};

export default ResizableContainer;

// PropTypes definition
ResizableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.number,
  defaultHeight: PropTypes.number
};

// Default props
ResizableContainer.defaultProps = {
  maxHeight: 800,
  defaultHeight: 0.2
};
