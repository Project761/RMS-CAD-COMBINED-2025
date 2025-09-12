import React from 'react'
import PropTypes from 'prop-types';

function ChargeContent(props) {
    const { citationState } = props;
    return (
        <>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2 text-nowrap">
                    <label htmlFor="" className='new-label'>Offence Code/Name</label>
                </div>
                <div className="col-6 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.offenceCode}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>NIBRS Code</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.nibrCode}
                        disabled
                    />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Charge DT/TM</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.chargeDTTM}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Court DT/TM</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.courtDTTM}
                        disabled
                    />
                </div>
            </div>
        </>
    )
}

export default ChargeContent

// PropTypes definition
ChargeContent.propTypes = {
  citationState: PropTypes.object.isRequired
};

// Default props
ChargeContent.defaultProps = {
  citationState: {}
};