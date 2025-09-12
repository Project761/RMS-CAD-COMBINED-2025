import React, { useEffect, useState } from 'react'
import { RequiredFieldIncident } from '../Utility/Personnel/Validation'

const IncNumModal = (props) => {

    const { setIncidentNumber, incidentNumber, validate } = props

    const [errors, setErrors] = useState({ 'IncidentNoError': '' })

    const check_Validation_Error = (e) => {
        if (!incidentNumber || incidentNumber?.length < 0 || incidentNumber?.length == "") {
            setErrors(prevValues => { return { ...prevValues, ['IncidentNoError']: RequiredFieldIncident(incidentNumber) } })
        } else if (incidentNumber?.length > 0) {
            setErrors(prevValues => { return { ...prevValues, ['IncidentNoError']: incidentNumber?.length < 9 ? "Invalid Incident Number" : "true" } })
        }
    }

    const { IncidentNoError } = errors

    useEffect(() => {
        if (IncidentNoError === 'true') {
            validate();
        }
    }, [IncidentNoError])


    const handleChange = (e) => {
        if (e) {
            var ele = e.target.value?.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            setErrors({ ...errors, ['IncidentNoError']: '' });
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    setIncidentNumber((match[1] + '-' + match[2]).trim())
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setIncidentNumber(ele?.trim())
            }
        } else {
            setIncidentNumber('')
        }
    }

    return (
        <div className="" id="myModal2" data-backdrop="false">
            <div className="modal-dialog">
                <div className="modal-content" style={{ marginTop: "15rem" }}>
                    <div className="box text-center py-5">
                        <div className='flex'>
                            <label className='pr-2' style={{ verticalAlign: "top" }}>
                                Incident Number :
                                {errors.IncidentNoError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IncidentNoError}</p>
                                ) : null}
                            </label>
                            <input type="text" className='requiredColor' name='IncidentNumber' value={incidentNumber} onChange={handleChange} maxLength={9} />
                        </div>
                        <div className="btn-box mt-3">
                            <button type="button" onClick={() => { check_Validation_Error() }} className="btn btn-primary" style={{ marginLeft: "8rem" }}>Show Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IncNumModal
