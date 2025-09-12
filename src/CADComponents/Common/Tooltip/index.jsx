import { useState } from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({ text, maxLength, tooltipTextLimit, isSmall = false, isRight = false, isSmallFont = false }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Truncate the text for the displayed element (on hover)
    const isTextTruncated = text.length > maxLength;
    const displayText = isTextTruncated ? text.substring(0, maxLength) + '...' : text;

    // Truncate the text for the tooltip
    const isTooltipTextTruncated = text.length > tooltipTextLimit;
    const tooltipText = isTooltipTextTruncated ? text.substring(0, tooltipTextLimit) + '...' : text;

    const tooltipBoxStyles = {
        position: 'absolute',
        top: '100%',
        left: isRight ? '0' : '50%',
        transform: isRight ? 'translateX(0)' : 'translateX(-50%)',
        width: isSmall ? "400px" : 'max-content', // Fixed width for the tooltip
        backgroundColor: '#333',
        color: '#fff',
        padding: '8px',
        borderRadius: '4px',
        textAlign: 'left',
        whiteSpace: 'normal', // Allow text to wrap
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
    };

    const tooltipArrowStyles = {
        content: '""',
        position: 'absolute',
        top: '-5px',
        left: isRight ? '0' : '50%',
        transform: isRight ? 'translateX(0)' : 'translateX(-50%)',
        borderWidth: '5px',
        borderStyle: 'solid',
        borderColor: 'transparent transparent #333 transparent',
    };

    return (
        <div
            style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span style={{ fontSize: isSmallFont ? '10px' : '14px' }}>{displayText}</span>
            {isHovered && isTextTruncated && (
                <div style={tooltipBoxStyles}>
                    <div style={tooltipArrowStyles} />
                    {tooltipText}
                </div>
            )}
        </div>
    );
};

export default Tooltip;

// PropTypes definition
Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
  tooltipTextLimit: PropTypes.number,
  isSmall: PropTypes.bool,
  isRight: PropTypes.bool,
  isSmallFont: PropTypes.bool
};

// Default props
Tooltip.defaultProps = {
  tooltipTextLimit: 100,
  isSmall: false,
  isRight: false,
  isSmallFont: false
};
