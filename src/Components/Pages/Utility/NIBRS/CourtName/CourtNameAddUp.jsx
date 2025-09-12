import  { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'
import { PhoneField } from '../../../PersonnelCom/Validation/PersonnelValidation'

const CourtNameAddUp = (props) => {

    const { loginAgencyID, loginPinID, isSuperadmin, courtID, status, get_data_CourtName, courtNameData, modal, setModal, courtNameStatus, getZipCode, getCity, zipList, cityList, setZipList, setCityList } = props

    const [agencyData, setAgencyData] = useState([])
    const [courtNameEditVal, setCourtNameEditVal] = useState();
    const [stateList, setStateList] = useState([])
    const [value, setValue] = useState({
        'CourtNameCode': '',
        'Description': '',
        'AgencyCode': '',
        'AgencyID': '',
        'IsEditable': 1,
        'CourtID': '',
        'IsActive': '1',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'IsNjeTicket': '',
        'IsSpinalResearch': '',
        'IsJointCourt': '',
        'IsCitation': '',
        'IsDefault': '',
        'Hours': '',
        'Administrator': '',
        'Judge': '',
        'Municipality': '',
        'Phone2': '',
        'CountryCode': '',
        'PhoneNumber': '',
        'Address': '',
        'ZipId': '',
        'CityId': '',
        'StateId': '', 'ZipName': '', 'StateName': '', 'CityName': '',
    });

    const reset = () => {
        setValue({
            ...value,
            'CourtNameCode': '', 'ZipName': '', 'CityName': '', 'StateName': '',
            'PropRectype': '', 'IsEditable': 0,
            'Description': '',
            'AgencyID': '',
            'CourtID': '',
            'ModifiedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'IsDefault': '',
            'IsCitation': '',
            'IsSpinalResearch': '',
            'IsNjeTicket': '',
            'IsJointCourt': '',
            'AgencyCode': '',
            'Hours': '',
            'Administrator': '',
            'Judge': '',
            'Municipality': '',
            'Phone2': '',
            'CountryCode': '',
            'PhoneNumber': '',
            'Address': '',
            'ZipId': '',
            'CityId': '',
            'StateId': '',
        })
        setErrors({
            ...errors,
            'CourtNameCodeError': '',
            'DescriptionError': '',
            'Phone2Error': '',
        })
    }

    const [errors, setErrors] = useState({
        'CourtNameCodeError': '',
        'DescriptionError': '',
        'PhoneNumberError': '',
        'Phone2Error': '',
    })


    useEffect(() => {
        if (agencyData?.length === 0 && modal) {
            if (loginPinID && loginAgencyID) {
                getAgency(loginAgencyID, loginPinID);
                setValue({ ...value, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, })
            }
        }
    }, [modal, loginAgencyID])

    useEffect(() => {
        if (courtID) {
            GetSingledataCourtName()
        }
        getStateList()
    }, [courtID, courtNameStatus])

    const GetSingledataCourtName = () => {
        const val = { 'CourtID': courtID }
        fetchPostData('CourtName/GetSingleData_CourtName', val)
            .then((res) => {
                if (res) {
               
                    setCourtNameEditVal(res)
                }
                else setCourtNameEditVal()
            })
    }

    useEffect(async () => {
        if (status) {
            setValue({
                ...value,
                "CourtNameCode": courtNameEditVal[0]?.CourtNameCode,
                'AgencyID': courtNameEditVal[0]?.AgencyID,
                'StateId': courtNameEditVal[0]?.StateId,
                'CityId': courtNameEditVal[0]?.CityId,
                'ZipId': courtNameEditVal[0]?.ZipId,
                'AgencyCode': courtNameEditVal[0]?.AgencyCode,
                "Description": courtNameEditVal[0]?.Description,
                'CourtID': courtNameEditVal[0]?.courtID,
                'IsActive': courtNameEditVal[0]?.IsActive,
                'MultiAgency_Name': courtNameEditVal[0]?.MultiAgency_Name,
                'IsNjeTicket': courtNameEditVal[0]?.IsNjeTicket,
                'IsSpinalResearch': courtNameEditVal[0]?.IsSpinalResearch,
                'IsJointCourt': courtNameEditVal[0]?.IsJointCourt,
                'IsCitation': courtNameEditVal[0]?.IsCitation,
                'IsEditable': courtNameEditVal[0]?.IsEditable === '0' ? false : true,
                'IsDefault': courtNameEditVal[0]?.IsDefault,
                'Address': courtNameEditVal[0]?.Address, 'PhoneNumber': courtNameEditVal[0]?.PhoneNumber, 'CountryCode': courtNameEditVal[0]?.CountryCode, 'Phone2': courtNameEditVal[0]?.Phone2,
                'Municipality': courtNameEditVal[0]?.Municipality, 'Judge': courtNameEditVal[0]?.Judge, 'Administrator': courtNameEditVal[0]?.Administrator, 'Hours': courtNameEditVal[0]?.Hours,
                'AgencyName': courtNameEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(courtNameEditVal[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': loginPinID,
                'ZipName': changeArrayFormat_WithFilter(courtNameEditVal, 'zip', zipList), 'StateName': changeArrayFormat_WithFilter(courtNameEditVal, 'state', stateList), 'CityName': changeArrayFormat_WithFilter(courtNameEditVal, 'city', cityList),
            })
        }
        else {
            reset()
            setValue({
                ...value,
                "CourtNameCode": '', 'ZipName': '', 'CityName': '', 'StateName': '',
                "Description": '',
                'AgencyID': '', 'IsEditable': 1,
                'ModifiedByUserFK': '',
                'MultiAgency_Name': '',
                'IsJointCourt': '',
                'IsDefault': '',
                'IsCitation': '',
                'IsSpinalResearch': '',
                'IsNjeTicket': '',
                'PropRectype': '',
                'AgencyCode': '',
                'Hours': '',
                'Administrator': '',
                'Judge': '',
                'Municipality': '',
                'Phone2': '',
                'CountryCode': '',
                'PhoneNumber': '',
                'Address': '',
                'ZipId': '',
                'CityId': '',
                'StateId': '',

            })
        }
    }, [courtNameEditVal])

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    // onChange Hooks Function
    function stateChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['StateId']: e.value
            });
            getCity(e.value)
        } else {
            setValue({
                ...value,
                ['StateId']: null, ['ZipName']: '',
            })

            setCityList()
            setZipList()
        }
    }

    function cityChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['CityId']: e.value,
                ['ZipName']: '',
            });
            getZipCode(e.value)
        } else {
            setValue({
                ...value,
                ['CityId']: null, ['ZipName']: '', ['Agency_ZipId']: ''
            });
            setZipList()
        }
    }

    function zipChanges(e) {
        if (e) {
            setValue({
                ...value,
                ['ZipId']: e.value, ['ZipName']: { value: e.value, label: e.label }
            });
        } else {
            setValue({
                ...value,
                ['ZipId']: null
            });
        }

    }

    const handlChanges = (e) => {
        if (e.target.name === 'IsEditable' || e.target.name === 'IsNjeTicket' || e.target.name === 'IsSpinalResearch' || e.target.name === 'IsJointCourt' || e.target.name === 'IsCitation' || e.target.name === 'IsDefault') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        }

        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }

    const Agencychange = (e) => {
        const id = []
        const name = []
        if (e) {
            e.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(changeArrayFormat(data, 'state'))
            } else {
                setStateList();
            }
        })
    }


    const getAgency = async (loginAgencyID, loginPinID) => {
        const value = {
            AgencyID: loginAgencyID,
            PINID: loginPinID,
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_CourtName = (e) => {
        const result = courtNameData?.find(item => {
            if (item.CourtNameCode === value.CourtNameCode) {
                return item.CourtNameCode === value.CourtNameCode
            } else return item.CourtNameCode === value.CourtNameCode
        });
        const result1 = courtNameData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtNameCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CourtName/InsertCourtName', value).then((res) => {
     
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtNameCodeError']: '' })
                setModal(false)
                get_data_CourtName(loginAgencyID, loginPinID, isSuperadmin);
                reset();
            })

        }
    }

    const Update_CourtName = () => {
        const result = courtNameData?.find(item => {
            if (item.courtID != courtID) {
                if (item.CourtNameCode === value.CourtNameCode) {
                    return item.CourtNameCode === value.CourtNameCode
                } else return item.CourtNameCode === value.CourtNameCode
            }
        });
        const result1 = courtNameData?.find(item => {
            if (item.CourtID != value.CourtID) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CourtNameCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('CourtName/UpdateCourtName', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CourtNameCodeError']: '' })
                get_data_CourtName(loginAgencyID, loginPinID, isSuperadmin);
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.CourtNameCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CourtNameCodeError']: RequiredField(value.CourtNameCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
        if (PhoneField(value.PhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['PhoneNumberError']: PhoneField(value.PhoneNumber) } })
        }
        if (PhoneField(value.Phone2)) {
            setErrors(prevValues => { return { ...prevValues, ['Phone2Error']: PhoneField(value.Phone2) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CourtNameCodeError, Phone2Error, PhoneNumberError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CourtNameCodeError === 'true' && Phone2Error === 'true' && PhoneNumberError === 'true') {
            if (status) Update_CourtName()
            else Add_CourtName()
        }
    }, [DescriptionError, CourtNameCodeError, Phone2Error, PhoneNumberError])



    const handleInput = (e) => {
        if (e.target.name === 'PhoneNumber' || e.target.name === 'Phone2') {
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

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CourtNameCodes" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Court Name</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='CourtNameCode' maxLength={10} onChange={handlChanges} value={value?.CourtNameCode}
                                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false}
                                                            className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CourtNameCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtNameCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                    <div className="text-field">
                                                        <textarea className='requiredColor' name='Description'
                                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false}
                                                            onChange={handlChanges} value={value?.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='Address' onChange={handlChanges} value={value.Address} />
                                                        <label>Address</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='Municipality' onChange={handlChanges} value={value.Municipality} />
                                                        <label>Municipality</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='Judge' onChange={handlChanges} value={value.Judge} />
                                                        <label>Judge</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='Administrator' onChange={handlChanges} value={value.Administrator} />
                                                        <label>Administrator</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="number" name='Hours' onChange={handlChanges} value={value.Hours} />
                                                        <label>Hours</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name="PhoneNumber" value={value.PhoneNumber} onChange={handleInput}
                                                            required />
                                                        <label>Phone No</label>
                                                        {errors.PhoneNumberError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PhoneNumberError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name="Phone2" value={value.Phone2} onChange={handleInput}
                                                            required />
                                                        <label>Phone2</label>
                                                        {errors.Phone2Error !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone2Error}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='CountryCode' onChange={handlChanges} value={value.CountryCode} />
                                                        <label>Country Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-5 pt-1 dropdown__box_req">
                                                    {
                                                        value?.StateName ?
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_StateId' menuPlacement="top"
                                                                options={stateList}
                                                                defaultValue={value.StateName}
                                                                isClearable
                                                                onChange={stateChanges}
                                                            /> :
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_StateId' menuPlacement="top"
                                                                options={stateList}
                                                                isClearable
                                                                onChange={stateChanges}
                                                            />
                                                    }
                                                    <label htmlFor="" className='pt-1'>State</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-5 pt-1 dropdown__box_req" >
                                                    {
                                                        value.CityName ?
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_CityId' menuPlacement="top"
                                                                options={cityList}
                                                                defaultValue={value.CityName}
                                                                isClearable
                                                                onChange={cityChanges}
                                                            />
                                                            :
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_CityId' menuPlacement="top"
                                                                options={cityList}
                                                                isClearable
                                                                onChange={cityChanges}
                                                            />

                                                    }

                                                    <label htmlFor="" className='pt-1'>City</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-5 pt-1 dropdown__box">
                                                    {
                                                        value.ZipName ?
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_ZipId' menuPlacement="top"
                                                                options={value?.Agency_CityId ? zipList : ''}
                                                                defaultValue={value.ZipName}
                                                                isClearable
                                                                onChange={zipChanges}
                                                            />
                                                            :
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                name='Agency_ZipId' menuPlacement="top"
                                                                options={zipList}
                                                                isClearable
                                                                onChange={zipChanges}
                                                            />
                                                    }

                                                    <label htmlFor="" className='pt-1'>Zip</label>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row pt-2">
                                                        <div className="col-12 col-md-12 col-lg-12  mt-2 dropdown__box">
                                                            {
                                                                value?.AgencyName ?
                                                                    <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        defaultValue={value?.AgencyName}
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    /> : <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    />

                                                            }
                                                            <label>Agency</label>
                                                        </div>
                                                        {/* //---------------------dd--------------------------// */}
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsDefault" checked={value.IsDefault} value={value.IsDefault}
                                                                onChange={handlChanges}
                                                                id="IsDefault" />
                                                            <label className='ml-2' htmlFor="IsDefault">Is Default</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsCitation" checked={value.IsCitation} value={value.IsCitation}
                                                                onChange={handlChanges}
                                                                id="IsCitation" />
                                                            <label className='ml-2' htmlFor="IsCitation">Is Citation</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsJointCourt" checked={value.IsJointCourt} value={value.IsJointCourt}
                                                                onChange={handlChanges}
                                                                id="IsJointCourt" />
                                                            <label className='ml-2' htmlFor="IsJointCourt">Is Joint Court</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsSpinalResearch" checked={value.IsSpinalResearch} value={value.IsSpinalResearch}
                                                                onChange={handlChanges}
                                                                id="IsSpinalResearch" />
                                                            <label className='ml-2' htmlFor="IsSpinalResearch">Is Spinal Research</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsNjeTicket" checked={value.IsNjeTicket} value={value.IsNjeTicket}
                                                                onChange={handlChanges}
                                                                id="IsNjeTicket" />
                                                            <label className='ml-2' htmlFor="IsNjeTicket">Is Nje Ticket</label>
                                                        </div>
                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                                                onChange={handlChanges}
                                                                id="IsEditable" />
                                                            <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button>
                                                :
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Save</button>
                                        }
                                        <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => {
                                            setErrors({
                                                'DescriptionError': '', 'CourtNameCodeError': '', 'PhoneNumberError': '', 'phone2': '',
                                            }); reset()
                                        }}

                                        >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <> </>
            }
        </>
    )
}

export default CourtNameAddUp


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
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }

}

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {

    if (type === 'state') {
        const result = data?.map((sponsor) =>
            (sponsor.StateId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            (sponsor.CityId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            (sponsor.ZipId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }
} 