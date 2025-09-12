import React from 'react'
import PropTypes from 'prop-types';

function DrivingConditionContent(props) {
    const { citationState } = props;
    return (
        <>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Weather</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        name='Weather'
                        className="form-control"
                        value={citationState.Weather}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Traffic</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        name='Traffic'
                        className="form-control"
                        value={citationState.Traffic}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Road</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        name='Road'
                        className="form-control"
                        value={citationState.Road}
                        disabled
                    />
                </div>
            </div>
        </>
    )
}

export default DrivingConditionContent

// PropTypes definition
DrivingConditionContent.propTypes = {
  citationState: PropTypes.object.isRequired
};

// Default props
DrivingConditionContent.defaultProps = {
  citationState: {}
};