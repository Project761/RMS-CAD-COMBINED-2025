import { useState, } from 'react';
import DataTable from 'react-data-table-component';
import { RequiredFieldIncident } from '../../../../Utility/Personnel/Validation';
import { tableCustomStyles } from '../../../../../Common/Utility';
import { useSelector } from 'react-redux';

const CitationOffense = () => {

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [ownerIdDrp, setOwnerIdDrp] = useState([]);
    const [filterData, setFilterData] = useState()

    const [value, setValue] = useState({
        'ChargeID': '',
        'labal': '',
        'IncidentID': '',
        'OffenseID': null,
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'OwnerIDError': '',
    });


    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OffenseID)) {
            setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
        }
    }
    const { OwnerIDError } = errors


    const columns1 = [
        {
            name: 'Offense Name',
            selector: (row) => row.Offense_Description,
            sortable: true
        },
        {
            name: 'Attempt/Complete',
            selector: (row) => row.AttemptComplete,
            sortable: true
        },
    ]

    const notebookEntryHandler = row => {
        setValue(pre => {
            return {
                ...pre,
                ['OffenseID']: row.CrimeID, ['ChargeOffenseID']: row?.ChargeOffenseID, ['labal']: row.Offense_Description
            }
        });
        document.getElementById('customSelectBox').style.display = 'none'
    }

    return (
        <>
            <div className='row'>


                <div className="col-3 col-md-2 col-lg-1 mt-3">
                    <label htmlFor="" className='label-name pt-1'>Offense  {errors.OwnerIDError !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
                    ) : null}
                    </label>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-3 text-field" style={{ zIndex: '1', }} >
                    <input
                        type="text"
                        name='NoofHoles'
                        id='NoofHoles'
                        value={value.labal}
                        required
                        placeholder='Search By Offense .....'
                        autoComplete='off'
                        onChange={(e) => {
                            setValue({ ...value, labal: e.target.value })
                            const result = ownerIdDrp?.filter((item) => {
                                return (item.label.toLowerCase().includes(e.target.value.toLowerCase()))
                            })
                            setFilterData(result)
                        }}
                        onClick={() => {
                            document.getElementById('customSelectBox').style.display = 'block'
                        }}
                    />
                    <span to={''} className='offense-select' onClick={() => {
                        document.getElementById('customSelectBox').style.display = 'none';
                        setValue(pre => { return { ...pre, ['OffenseID']: '', ['ChargeOffenseID']: '', ['labal']: '' } });
                    }}>
                        <span className='select-cancel'>
                            <i className='fa fa-times'></i>
                        </span>
                    </span>
                    <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', width: '700px' }}>
                        <DataTable
                            dense
                            fixedHeader
                            fixedHeaderScrollHeight="250px"
                            customStyles={tableCustomStyles}
                            columns={columns1}
                            data={filterData}
                            onRowClicked={notebookEntryHandler}
                            selectableRowsHighlight
                            highlightOnHover
                            className='new-table'
                        />
                    </div>
                </div>
                <div className="col-1 col-md-4 col-lg-1 mt-3 mb-1">
                    <div className="col-1 col-md-4 col-lg-1 mb-1">
                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                        }

                    </div>
                </div>
            </div>
            <div className="col-12" >
                <div className="new-offensetable" >
                    {
                        <DataTable

                            dense
                            pagination
                            className='new-offensetable'
                            selectableRowsHighlight
                            highlightOnHover
                            fixedHeader
                            persistTableHead={true}
                            customStyles={tableCustomStyles}
                        />
                    }
                </div>
            </div>

        </>
    )
}

export default CitationOffense