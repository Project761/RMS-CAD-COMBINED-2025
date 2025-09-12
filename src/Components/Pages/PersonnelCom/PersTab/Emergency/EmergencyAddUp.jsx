// Import Component
import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { AddDeleteUpadate, fetchData, fetchPostData } from "../../../../hooks/Api";
import { Email_Field, PhoneField, RequiredField, RequiredFieldSelectBox } from "../../Validation/PersonnelValidation";
import { toastifySuccess } from "../../../../Common/AlertMsg";

const EmergencyAddUp = ({ perId, Aid, pinId, emergencyEditValue, status, get_EmergencyContact, modal, setModal, updCount, permissionForAdd, permissionForEdit }) => {

    // Hooks Initialization
    const [value, setValue] = useState({
        'ZipName': '', 'ModifiedByUserFK': '', 'EmergencyID': '', 'CityName': '', 'StateName': '', 'GenderName': '', 'PINID': perId, 'ContactName': '', 'SexID': '', 'Address': '',
        'StateID': '', 'CityID': '', 'ZipID': '', 'Phone_No': '', 'Fax_No': '', 'Cell_No': '', 'Email': '', 'Notes': '', 'CreatedByUserFK': pinId,
        'AgencyID': Aid,
    });

    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);
    const [sexList, setSexList] = useState([]);

    useEffect(() => {
        getStateList(); getSexList(Aid)
    }, [Aid])

    useEffect(() => {
        if (emergencyEditValue?.EmergencyID) {
            setValue({
                ...value,
                'EmergencyID': emergencyEditValue?.EmergencyID,
                'ContactName': emergencyEditValue?.ContactName, 'SexID': emergencyEditValue?.SexID, 'Address': emergencyEditValue?.Address,
                'StateID': emergencyEditValue?.StateID, 'CityID': emergencyEditValue?.CityID, 'ZipID': emergencyEditValue?.ZipID,
                'Phone_No': emergencyEditValue?.Phone_No, 'Fax_No': emergencyEditValue?.Fax_No, 'Cell_No': emergencyEditValue?.Cell_No,
                'Email': emergencyEditValue?.Email, 'Notes': emergencyEditValue?.Notes,
                'ZipName': changeArrayFormat_WithFilter([emergencyEditValue], 'zip'),
                'CityName': changeArrayFormat_WithFilter([emergencyEditValue], 'city'),
                'StateName': changeArrayFormat_WithFilter([emergencyEditValue], 'state'),
                'GenderName': changeArrayFormat_WithFilter([emergencyEditValue], 'gender'),
                'ModifiedByUserFK': pinId,
            });
        } else {
            reset_Value()
        }
    }, [emergencyEditValue, updCount])

    // onChange Hooks Function
    function stateChanges(e) {
        if (e) {
            getCity(e.value);
            setValue({
                ...value,
                ['StateID']: e.value, ['CityID']: null, ['ZipID']: null,
            })
            setZipList([]); setCityList([]);
        } else {
            setValue({
                ...value,
                ['StateID']: null, ['CityID']: null, ['ZipID']: null,
            })
            setCityList([]); setZipList([])
        }
    }

    function cityChanges(e) {
        if (e) {
            getZipCode(e.value);
            setValue({
                ...value,
                ['CityID']: e.value, ['ZipID']: null
            })
            setZipList([])
        } else {
            setValue({
                ...value,
                ['CityID']: null, ['ZipID']: null
            })
            setZipList([]);
        }
    }

    function zipChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['ZipID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['ZipID']: null
            })
        }

    }

    const sexChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['SexID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['SexID']: null
            })
        }

    }

    // Get data List
    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then(response => {
            if (response) setStateList(changeArrayFormat(response, 'state'))
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    const getCity = async (stateID) => {
        const value = { StateID: stateID }
        fetchPostData("State_City_ZipCode/GetData_City", value).then(response => {
            if (response) setCityList(changeArrayFormat(response, 'city'))
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    const getZipCode = async (cityID) => {
        const value = { CityId: cityID }
        fetchPostData("State_City_ZipCode/GetData_ZipCode", value).then(response => {
            if (response) setZipList(changeArrayFormat(response, 'zip'))
        }).catch(error => {
            console.error('There was an error!', error);
        });

    }

    const getSexList = async (Aid) => {
        const value = { AgencyId: Aid }
        fetchPostData("DropDown/GetData_SexType", value).then(response => {
            if (response) setSexList(changeArrayFormat(response, 'genderId'))
            else setSexList()
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    const reset_Value = () => {
        setValue({
            ...value,
            'ContactName': '', 'SexID': '', 'Address': '', 'StateID': '', 'CityID': '', 'ZipID': '', 'Phone_No': '', 'Fax_No': '', 'Cell_No': '', 'Email': '', 'Notes': '', 'ZipName': '', 'CityName': '', 'StateName': '', 'ModifiedByUserFK': '', 'EmergencyID': '', 'GenderName': ''
        });
        setErrors({
            ...errors,
            'ContactNameError': '', 'GenderError': '', 'StateError': '', 'City': '', 'CellPhoneError': '', 'PhoneNoError': '', 'FaxNo': '', 'EmailError': ''
        });
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        if (e.target.name === 'Fax_No' || e.target.name === 'Phone_No' || e.target.name === 'Cell_No') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    };

    const [errors, setErrors] = useState({
        'ContactNameError': '', 'GenderError': '', 'StateError': '', 'City': '', 'CellPhoneError': '', 'PhoneNoError': '', 'FaxNo': '', 'EmailError': ''
    })

    const { ContactNameError, GenderError, StateError, City, CellPhoneError, PhoneNoError, FaxNo, EmailError } = errors

    useEffect(() => {
        if (ContactNameError === 'true' && GenderError === 'true' && CellPhoneError === 'true' && StateError === 'true' && City === 'true' && PhoneNoError === 'true' && FaxNo === 'true' && EmailError === 'true') {
            if (status) { Emergency_Update() }
            else { Emergency_Add_Save() }
        }
    }, [ContactNameError, GenderError, StateError, City, CellPhoneError, PhoneNoError, FaxNo, EmailError])

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ContactName)) {
            setErrors(prevValues => { return { ...prevValues, ['ContactNameError']: RequiredField(value.ContactName) } })
        }
        if (RequiredFieldSelectBox(value.SexID)) {
            setErrors(prevValues => { return { ...prevValues, ['GenderError']: RequiredFieldSelectBox(value.SexID) } })
        }
        if (RequiredFieldSelectBox(value.StateID)) {
            setErrors(prevValues => { return { ...prevValues, ['StateError']: RequiredFieldSelectBox(value.StateID) } })
        }
        if (RequiredFieldSelectBox(value.CityID)) {
            setErrors(prevValues => { return { ...prevValues, ['City']: RequiredFieldSelectBox(value.CityID) } })
        }
        if (PhoneField(value.Cell_No)) {
            setErrors(prevValues => { return { ...prevValues, ['CellPhoneError']: PhoneField(value.Cell_No) } })
        }
        if (PhoneField(value.Phone_No)) {
            setErrors(prevValues => { return { ...prevValues, ['PhoneNoError']: PhoneField(value.Phone_No) } })
        }
        if (PhoneField(value.Fax_No)) {
            setErrors(prevValues => { return { ...prevValues, ['FaxNo']: PhoneField(value.Fax_No) } })
        }
        if (Email_Field(value.Email)) {
            setErrors(prevValues => { return { ...prevValues, ['EmailError']: Email_Field(value.Email) } })
        }
    }

    // Emergency Submit 
    const Emergency_Add_Save = (e) => {
        AddDeleteUpadate('EmergencyContact/InsertEmergencyContact', value).then((res) => {
            if (res.success === true) {
                toastifySuccess(res.Message); setErrors({ ...errors, ['ContactNameError']: '' });
                setModal(false);
                reset_Value();
                get_EmergencyContact(perId)
            }
        })
    }

    // Emergency Update
    const Emergency_Update = () => {
        AddDeleteUpadate('EmergencyContact/UpdateEmergencyContact', value).then((res) => {
            if (res.success === true) {
                toastifySuccess(res.Message)
                setErrors({ ...errors, ['ContactNameError']: '' })
                get_EmergencyContact(perId)
                setModal(false)
            }
        })
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset_Value();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            {
                modal ?
                    <dialog className="modal" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="EmergencyModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className=" m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Emergency Contact</legend>
                                            <div className="row ">
                                                <div className="col-4 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" name='ContactName' value={value.ContactName} className="requiredColor" onChange={handleInput}
                                                            required />
                                                        <label>Contact Name</label>
                                                        {errors.ContactNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-4 dropdown__box">
                                                    <Select
                                                        styles={colourStyles}
                                                        value={sexList?.filter((obj) => obj.value === value?.SexID)}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='SexID' menuPlacement="top"
                                                        options={sexList}
                                                        isClearable
                                                        onChange={sexChanges}
                                                    />

                                                    <label htmlFor="">Gender</label>
                                                    {errors.GenderError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.GenderError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 ">
                                                    <div className="text-field">
                                                        <input type="text" name='Email' value={value.Email} onChange={handleInput}
                                                            required />
                                                        <label>E-mail </label>
                                                        {errors.EmailError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EmailError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-5 col-lg-9 ">
                                                    <div className="text-field">
                                                        <textarea name="Address" value={value.Address} onChange={handleInput}
                                                            required cols="30" rows="1"></textarea>
                                                        <label>Address</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-4 dropdown__box">
                                                    <Select
                                                        value={stateList?.filter((obj) => obj.value === value?.StateID)}
                                                        styles={colourStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='StateID' menuPlacement="top"
                                                        options={stateList}
                                                        isClearable
                                                        onChange={stateChanges}
                                                    />

                                                    <label htmlFor="">State</label>
                                                    {errors.StateError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-4 dropdown__box">
                                                    <Select
                                                        value={cityList?.filter((obj) => obj.value === value?.CityID)}
                                                        styles={colourStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='CityID' menuPlacement="top"
                                                        options={cityList}
                                                        isClearable
                                                        onChange={cityChanges}
                                                    />

                                                    <label htmlFor="">City</label>
                                                    {errors.City !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.City}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-4 dropdown__box">
                                                    <Select
                                                        value={zipList?.filter((obj) => obj.value === value?.ZipID)}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        styles={customStylesWithOutColor}
                                                        name='ZipID' menuPlacement="top"
                                                        options={zipList}
                                                        isClearable
                                                        onChange={zipChanges}
                                                    />

                                                    <label htmlFor="">Zip</label>
                                                </div>


                                                <div className="col-12 col-md-5 col-lg-9 mt-2">
                                                    <div className="text-field">
                                                        <textarea name="Notes" value={value.Notes} onChange={handleInput}
                                                            required cols="30" rows="1"></textarea>
                                                        <label>Notes</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name="Phone_No" value={value.Phone_No} onChange={handleInput}
                                                            required />
                                                        <label>Phone No</label>
                                                        {errors.PhoneNoError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PhoneNoError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name="Cell_No" value={value.Cell_No} onChange={handleInput}
                                                            required />
                                                        <label>Cell No</label>
                                                        {errors.CellPhoneError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CellPhoneError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name="Fax_No" value={value.Fax_No} onChange={handleInput}
                                                            required />
                                                        <label>Fax No</label>
                                                        {errors.FaxNo !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FaxNo}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                permissionForEdit ? <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button> : <></>
                                                :
                                                permissionForAdd ? <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button> : <></>
                                        }
                                        <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => {
                                            setErrors({
                                                'ContactNameError': '', 'GenderError': '', 'StateError': '', 'City': '', 'CellPhoneError': '', 'PhoneNoError': '', 'FaxNo': '',
                                            }); reset_Value(); setModal(false);
                                        }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <></>
            }
        </>
    );
};
export default EmergencyAddUp;


export const changeArrayFormat = (data, type) => {
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }
    if (type === 'genderId') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SexCodeID, label: sponsor.Description })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'zip') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ZipID, label: sponsor.ZipCode })
        )
        return result[0]
    }
    if (type === 'state') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result[0]
    }
    if (type === 'city') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        )
        return result[0]
    }
    if (type === 'gender') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.SexID, label: sponsor.Gender_Name })
        )
        return result[0]
    }
}
