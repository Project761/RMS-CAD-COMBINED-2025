import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import { compareStrings } from '../../CADUtils/functions/common';
import { getShowingWithOutTime, subTableCustomStyles, tableCustomStyles } from '../../Components/Common/Utility';

function NameInfoContent(props) {
    const { nameData } = props;
    const [nameState, setNameState] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        juvenile: false,
        age: '',
        gender: '',
        race: '',
        ethnicity: '',
        resident: '',
        weightLbs: '',
        heightFt: '',
        eyeColor: '',
        hairColor: '',
        stateDL: '',
        identificationType: '',
        identificationNumber: '',
        idExpiry: '',
        country: '',
        state: '',
        address: '',
        contactType: '',
        contactNumber: '',
        unlisted: false,
    });

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
        {
            name: 'DL Number',
            selector: (row) => row.DLNumber,
            sortable: true
        },
    ]


    const conditionalRowStyles = [
        {
            when: row => row?.NameIDNumber === nameState?.NameIDNumber,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                },
            },
        }
    ];

    function handelSetEditData(data) {
        setNameState({
            NameID: data?.NameID || "",
            lastName: data?.LastName || "",
            firstName: data?.FirstName || "",
            middleName: data?.MiddleName || "",
            dateOfBirth: data?.DateOfBirth ? getShowingWithOutTime(data?.DateOfBirth) : '' || "",
            juvenile: data?.IsJuvenile || "",
            age: data?.AgeFrom || "",
            gender: data?.Gender || "",
            race: data?.Race || "",
            ethnicity: data?.Ethnicity || "",
            resident: data?.Resident || "",
            weightLbs: data?.WeightFrom || "",
            heightFt: data?.HeightFrom || "",
            eyeColor: data?.EyeColor || "",
            hairColor: data?.HairColor || "",
            stateDL: data?.StateDescription || "",
            identificationType: 'Driver License' || "",
            identificationNumber: data?.DLNumber || "",
            idExpiry: data?.DLExpiryDate || "",
            country: data?.CountryName || "",
            state: data?.StateDescription || "",
            address: data?.Address || "",
            contactType: '' || "",
            contactNumber: data?.Contact || "",
            unlisted: data?.IsUnListedPhNo || "",
        })
    }

    return (
        <>
            <div className="d-flex align-items-center">
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Last Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        className="form-control"
                        value={nameState.lastName}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>First Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        className="form-control"
                        value={nameState.firstName}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Middle Name</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        className="form-control"
                        value={nameState.middleName}
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
                        className="form-control"
                        value={nameState.dateOfBirth}
                        disabled
                    />
                </div>
                <div className="col-1 d-flex align-items-center justify-content-center mt-2">
                    <input
                        type="checkbox"
                        checked={nameState.juvenile}
                        disabled
                    />
                    <label htmlFor="" className='new-label ml-3 mt-2'>Juvenile</label>
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Age</label>
                </div>
                <div className="col-1 text-field">
                    <input
                        className="form-control"
                        value={nameState.age}
                        disabled
                    />
                </div>
                <div className="col-1 text-field">
                    <input
                        className="form-control"
                        value={nameState.age}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Gender</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.gender}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Race</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.race}
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
                        className="form-control"
                        value={nameState.ethnicity}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Resident</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.resident}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Weight(LBS)</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.weightLbs}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Height(FT)</label>
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.heightFt}
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
                        className="form-control"
                        value={nameState.eyeColor}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>Hair Color</label>
                </div>
                <div className="col-3 text-field">
                    <input
                        className="form-control"
                        value={nameState.hairColor}
                        disabled
                    />
                </div>
                <div className="col-1 mt-2">
                    <label htmlFor="" className='new-label'>State/DL#</label>
                </div>
                <div className="col-1 text-field">
                    <input
                        className="form-control"
                        value={nameState.stateDL}
                        disabled
                    />
                </div>
                <div className="col-2 text-field">
                    <input
                        className="form-control"
                        value={nameState.identificationNumber}
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

                            className="form-control"
                            value={nameState.identificationType}
                            disabled
                        />
                    </div>
                    <div className="col-2 mt-2">
                        <label htmlFor="" className='new-label'>Identification Number</label>
                    </div>
                    <div className="col-2 text-field">
                        <input

                            className="form-control"
                            value={nameState.identificationNumber}
                            disabled
                        />
                    </div>
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Id Expiry</label>
                    </div>
                    <div className="col-3 text-field">
                        <input

                            className="form-control"
                            value={nameState.idExpiry}
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

                                    className="form-control"
                                    value={nameState.country}
                                    disabled
                                />
                            </div>
                            <div className="col-1 mt-2">
                                <label htmlFor="" className='new-label'>State</label>
                            </div>
                            <div className="col-3 text-field">
                                <input

                                    className="form-control"
                                    value={nameState.state}
                                    disabled
                                />
                            </div>
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

                            className="form-control"
                            value={nameState.address}
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

                            className="form-control"
                            value={nameState.contactType}
                            disabled
                        />
                    </div>
                    <div className="col-1 mt-2">
                        <label htmlFor="" className='new-label'>Contact #</label>
                    </div>
                    <div className="col-3 text-field">
                        <input

                            className="form-control"
                            value={nameState.contactNumber}
                            disabled
                        />
                    </div>
                    <div className="col-1 d-flex align-items-center justify-content-center mt-2">
                        <input
                            type="checkbox"
                            checked={nameState.unlisted}
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
                    data={nameData}
                    customStyles={tableCustomStyles}
                    pagination
                    responsive
                    striped
                    persistTableHead={true}
                    highlightOnHover
                    fixedHeader
                    conditionalRowStyles={conditionalRowStyles}
                    showPaginationBottom={false}
                    onRowClicked={(row) => {
                        handelSetEditData(row);
                    }}

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