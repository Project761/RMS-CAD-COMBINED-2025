import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { filterPassedTime, getShowingDateText, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import DatePicker from "react-datepicker";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';

const MedicalInformation = (props) => {
    const dispatch = useDispatch();
    const { DecMissPerID } = props

    const navigate = useNavigate();
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecIncID = 0;
    let DecHobID = 0;
    const query = useQuery();
    var openPage = query?.get('page');
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var HobID = query?.get("HobID");
    var HobSta = query?.get("HobSta");
    let MstPage = query?.get('page');

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { setChangesStatus, get_MissingPerson_Count, GetDataTimeZone, datezone } = useContext(AgencyContext);

    const [Medicaldata, setMedicaldata] = useState([])
    const [loginPinID, setloginPinID,] = useState('');
    const [manimedical, setmanimedical] = useState('')
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [MedicalDtTm, setMedicalDtTm] = useState('')
    const [Medicalid, setMedicalid] = useState('')
    const [status, setStatus] = useState(false)
    const [Editval, setEditval] = useState();
    const [clickedRow, setClickedRow] = useState(null);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'MissingPersonID': '', 'Description': '', 'MedicalInformationDtTm': '', 'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'MedicalInformationDtTmError': '', 'DescriptionError': ''
    })
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("M125", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            const val = e.target.value;
            const val1 = val?.split('')
            if (val?.length <= 1 || val1[0] === ' ') {
                setValue({ ...value, [e.target.name]: val?.trim() });
                setErrors({ ...errors, ['DescriptionError']: '' })
            } else {
                setValue({ ...value, [e.target.name]: val });
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        }
        else { setValue({ ...value, [e.target.name]: null }); }
    };


    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.MedicalInformationDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['MedicalInformationDtTmError']: RequiredFieldIncident(value.MedicalInformationDtTm) } })
        }
        if (RequiredFieldIncident(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredFieldIncident(value.Description) } })
        }
    }

    const { MedicalInformationDtTmError, DescriptionError } = errors

    useEffect(() => {
        if (MedicalInformationDtTmError === 'true' && DescriptionError === 'true') {
            if (Medicalid && (MissPerSta === true || MissPerSta || 'true')) {
                update_medicalInformation_data();
            }
            else {
                insert_MedicalInformation_Data();
            }
        }
    }, [MedicalInformationDtTmError, DescriptionError])


    useEffect(() => {
        if (Editval) {
            setValue({
                ...value, 'MissingPersonID': Editval[0]?.MissingPersonID, 'Description': Editval[0]?.Description, 'MedicalInformationDtTm': Editval[0]?.MedicalInformationDtTm,
                'MedicalInformationID': Editval[0]?.MedicalInformationID, 'ModifiedByUserFK:': '',
            })
            setMedicalDtTm(Editval[0]?.MedicalInformationDtTm ? new Date(Editval[0]?.MedicalInformationDtTm) : '');
        } else {
            setValue({
                ...value, 'MissingPersonID': '', 'Description': '', 'MedicalInformationDtTm': '', 'ModifiedByUserFK:': loginPinID,
            });
        }
    }, [Editval])


    const reset = () => {
        setValue({ ...value, 'MedicalInformationDtTm': '', 'Description': '', });
        setMedicalDtTm(''); setErrors({ ...errors, 'MedicalInformationDtTmError': '', 'DescriptionError': '' });
        setMedicalid(''); setStatesChangeStatus(false);
    }

    useEffect(() => {
        if (localStoreData) { setloginPinID(localStoreData?.PINID); }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({ ...value, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID });
        }
        get_MedicalInformation_Data()
    }, [loginAgencyID]);

    const get_MedicalInformation_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('MedicalInformation/GetData_MedicalInformation', val)
            .then((res) => {
                if (res.length > 0) {
                    setMedicaldata(res);
                }
                else { setMedicaldata([]) }
            })
    }

    const insert_MedicalInformation_Data = () => {
        AddDeleteUpadate('MedicalInformation/Insert_MedicalInformation', value).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_MedicalInformation_Data(); setStatusFalse()
                get_MissingPerson_Count(DecMissPerID, loginPinID); setStatus(true); setStatesChangeStatus(false);
                setChangesStatus(false); setErrors({ ...errors, ['DescriptionError']: '' });
            }
        })
    }

    const Delete_MedicalInformation_Data = () => {
        const val = { 'MedicalInformationID': Medicalid, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('MedicalInformation/Delete_MedicalInformation', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_MissingPerson_Count(DecMissPerID, loginPinID)
                get_MedicalInformation_Data(); setStatusFalse(); setStatesChangeStatus(false);
            } else console.log("Somthing Wrong");
        })
    }

    useEffect(() => {
        if (clickedRow?.MedicalInformationID && status) {
            GetSingleData_MedicalInformation_Data(clickedRow?.MedicalInformationID);
        }
    }, [clickedRow, status]);

    const GetSingleData_MedicalInformation_Data = (ID) => {
        const val = { 'MedicalInformationID': ID }
        fetchPostData('MedicalInformation/GetSingleData_MedicalInformation', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else {
                    setEditval([])
                }
            })
    }

    const update_medicalInformation_data = () => {
        const { MedicalInformationDtTm, Description } = value;
        const val = {
            'MissingPersonID': DecMissPerID, 'MedicalInformationDtTm': MedicalInformationDtTm,
            'Description': Description, 'ModifiedByUserFK': loginPinID, 'MedicalInformationID': Medicalid
        }
        AddDeleteUpadate('MedicalInformation/Update_MedicalInformation', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); get_MedicalInformation_Data(); setStatusFalse()
            setStatesChangeStatus(false); setChangesStatus(false); setErrors({ ...errors, ['DescriptionError']: '' })
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
            },
        },
    ];

    const setStatusFalse = () => {
        setMedicalid(''); reset(); setClickedRow(null); setStatus(false); setChangesStatus(false)
    }

    const set_Edit_Value = (row) => {
        if (row) {

            setStatus(true); setErrors(''); setMedicalid(row?.MedicalInformationID);
        }
    }

    const columns = [
        {
            name: 'Date/Time', selector: (row) => row.MedicalInformationDtTm ? getShowingDateText(row.MedicalInformationDtTm) : '', sortable: true
        },
        {
            name: 'Description', selector: (row) => row.Description ? row.Description : '',
            format: (row) => (<>{row?.Description ? row?.Description.substring(0, 70) : ''}{row?.Description?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>


                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setMedicalid(row?.MedicalInformationID) }} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setMedicalid(row?.MedicalInformationID) }} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]


    const filterTimeForDateZone = (time, datezone) => {
        let currDate = new Date(MedicalDtTm);
        let maxDate = new Date(datezone);
        if (currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) {

            const zoneDate = new Date(datezone);
            const zoneHours = zoneDate.getHours();
            const zoneMinutes = zoneDate.getMinutes();
            const timeHours = time.getHours();
            const timeMinutes = time.getMinutes();
            if (timeHours > zoneHours || (timeHours === zoneHours && timeMinutes > zoneMinutes)) {
                return false;
            }
            return true;
        } else {
            return true;
        }
    };


    return (
        <>
            <fieldset className='mt-2'>
                <legend>Medical Info</legend>
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Date/Time {errors.MedicalInformationDtTmError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MedicalInformationDtTmError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  ">
                            <DatePicker
                                id="MedicalInformationDtTm"
                                name='MedicalInformationDtTm'
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeFormat="HH:mm "
                                is24Hour
                                maxDate={new Date(datezone)}
                                className='requiredColor'
                                timeInputLabel
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete='off'
                                placeholderText='Select...'
                                filterTime={(time) => filterTimeForDateZone(time, datezone)}
                                selected={MedicalDtTm}
                                onChange={(date) => {
                                    let currDate = new Date(date);
                                    let prevDate = new Date(MedicalDtTm);
                                    let maxDate = new Date(datezone)
                                    if (((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())
                                    ) || (currDate.getTime() > maxDate.getTime())) {
                                        setValue({ ...value, ['MedicalInformationDtTm']: maxDate ? getShowingMonthDateYear(maxDate) : null });
                                        setMedicalDtTm(maxDate); setErrors({ ...errors, ['MedicalInformationDtTmError']: '' });
                                    }
                                    else {
                                        setValue({ ...value, ['MedicalInformationDtTm']: date ? getShowingMonthDateYear(date) : null });
                                        setMedicalDtTm(date); setErrors({ ...errors, ['MedicalInformationDtTmError']: '' });
                                    }
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                }}
                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e?.preventDefault();
                                    }
                                }}
                                isClearable={MedicalDtTm ? true : false}
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Medical Description {errors.DescriptionError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-6  ">
                            <textarea name='Description' id="Description" cols="30" maxLength={1000} rows='2' className="form-control pt-2 pb-2 requiredColor" onChange={handleChange} value={value.Description} ></textarea>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}  >New</button>
                {
                    Medicalid && status === true ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  >Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  >Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                }
            </div>
            <div className="col-12 mt-2">
                <DataTable
                    dense
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? Medicaldata : [] : Medicaldata}
                    columns={columns}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    fixedHeader
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={(row) => { set_Edit_Value(row); setClickedRow(row); setStatesChangeStatus(false); }}
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    fixedHeaderScrollHeight='300px'
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={Delete_MedicalInformation_Data} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}

export default MedicalInformation;