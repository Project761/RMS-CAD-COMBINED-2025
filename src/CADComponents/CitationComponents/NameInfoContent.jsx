import React from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import { compareStrings } from '../../CADUtils/functions/common';
import { getShowingWithOutTime, subTableCustomStyles, tableCustomStyles } from '../../Components/Common/Utility';

function NameInfoContent(props) {
    const { citationState } = props;

    const identificationData = [
        {
            IdentificationType: 'Driver License',
            IdentificationNumber: '1234567890',
            IdExpiry: '2025-01-01',
            state: 'CA',
            country: 'USA'
        }
    ]

    const columns = [
        {
            name: 'Identification Type',
            selector: row => row.IdentificationType,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IdentificationType, rowB.IdentificationType),
            style: {
                position: "static",
            },
        },
        {
            name: 'Identification Number',
            selector: row => row.IdentificationNumber,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IdentificationNumber, rowB.IdentificationNumber),
            style: {
                position: "static",
            },
        },
        {
            name: 'Id Expiry',
            selector: row => row.IdExpiry,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IdExpiry, rowB.IdExpiry),
            style: {
                position: "static",
            },
        },
        {
            name: 'State',
            selector: row => row.state,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.state, rowB.state),
            style: {
                position: "static",
            },
        },
        {
            name: 'Country',
            selector: row => row.country,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.country, rowB.country),
            style: {
                position: "static",
            },
        },
    ]

    const nameColumns = [
        {
            name: 'MNI',
            selector: (row) => row.NameIDNumber,
            sortable: true
        },
        {
            name: 'Name',
            selector: (row) => row.FullName,
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => row.Gender,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",
            sortable: true
        },
        // {
        //   name: 'Race',
        //   selector: (row) => row.Description_Race,
        //   sortable: true
        // },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            width: '100px',
            name: 'View',
            // sortable: true,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 30 }}>
                    <span
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                    >
                        <i className="fa fa-eye"></i>
                    </span>
                </div>
        },
        {
            name: 'Reason Code',
            selector: (row) => row?.NameReasonCode || '',
            format: (row) => (
                <>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>
            ),
            // selector: (row) => <>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    return (
        <>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Last Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.lastName}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>First Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.firstName}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Middle Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.middleName}
                        disabled
                    />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>DOB</label>
                </div>
                <div className="col-1 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.dateOfBirth}
                        disabled
                    />
                </div>
                <div className="col-1 d-flex align-items-center justify-content-center mt-2">
                    <input
                        type="checkbox"
                        checked={citationState.juvenile}
                        disabled
                    />
                    <label htmlFor="" className='new-label ml-3 mt-2'>Juvenile</label>
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Age</label>
                </div>
                <div className="col-1 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.age}
                        disabled
                    />
                </div>
                <div className="col-1 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.age}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Gender</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.gender}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Race</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.race}
                        disabled
                    />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Ethnicity</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.ethnicity}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Resident</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.resident}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Weight(LBS)</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.weightLbs}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Height(FT)</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.heightFt}
                        disabled
                    />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Eye Color</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.eyeColor}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Hair Color</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.hairColor}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>State/DL#</label>
                </div>
                <div className="col-1 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.stateDL}
                        disabled
                    />
                </div>
                <div className="col-2 text-field">
                    <input
                        type="text"
                        className="form-control"
                        value={citationState.stateDL}
                        disabled
                    />
                </div>
            </div>
            <fieldset className='mt-2'>
                <legend style={{ fontSize: '14px', fontWeight: 'bold', color: '#121e26bf' }}>Identification Info.</legend>
                <div className="d-flex align-items-center">
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Identification Type</label>
                    </div>
                    <div className="col-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.identificationType}
                            disabled
                        />
                    </div>
                    <div className="col-2 mt-2">
                        <label htmlFor="" className='new-label'>Identification Number</label>
                    </div>
                    <div className="col-2 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.identificationNumber}
                            disabled
                        />
                    </div>
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Id Expiry</label>
                    </div>
                    <div className="col-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.idExpiry}
                            disabled
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className='col-md-9'>
                        <div className="d-flex align-items-center">
                            <div className="col-1 mt-2">
                                <label htmlFor="" className='new-label'>Country</label>
                            </div>
                            <div className="col-3 text-field">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={citationState.country}
                                    disabled
                                />
                            </div>
                            <div className="col-1 mt-2">
                                <label htmlFor="" className='new-label'>State</label>
                            </div>
                            <div className="col-3 text-field">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={citationState.state}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="table-responsive mt-2">
                            <DataTable
                                dense
                                columns={columns}
                                data={identificationData}
                                customStyles={subTableCustomStyles}
                                pagination
                                responsive
                                striped
                                persistTableHead={true}
                                highlightOnHover
                                fixedHeader
                                showPaginationBottom={false}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <div className="text-center">
                                <i className="fa fa-image fa-3x text-muted"></i>
                                <p className="text-muted mt-2">Image Placeholder</p>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
            <fieldset className='mt-2'>
                <legend style={{ fontSize: '14px', fontWeight: 'bold', color: '#121e26bf' }}>Address/Contact Info.</legend>
                <div className="d-flex align-items-center">
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Address</label>
                    </div>
                    <div className="col-8 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.address}
                            disabled
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Contact Type</label>
                    </div>
                    <div className="col-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.contactType}
                            disabled
                        />
                    </div>
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Contact #</label>
                    </div>
                    <div className="col-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={citationState.contactNumber}
                            disabled
                        />
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-center mt-2">
                        <input
                            type="checkbox"
                            checked={citationState.unlisted}
                            disabled
                        />
                        <label htmlFor="" className='new-label ml-3 mt-2'>Unlisted</label>
                    </div>
                </div>
            </fieldset>
            <div className="table-responsive mt-2">
                <DataTable
                    dense
                    columns={nameColumns}
                    data={[]}
                    customStyles={tableCustomStyles}
                    pagination
                    responsive
                    striped
                    persistTableHead={true}
                    highlightOnHover
                    fixedHeader
                    showPaginationBottom={false}
                />
            </div>
        </>
    )
}

export default NameInfoContent

// PropTypes definition
NameInfoContent.propTypes = {
  citationState: PropTypes.object.isRequired
};

// Default props
NameInfoContent.defaultProps = {
  citationState: {}
};