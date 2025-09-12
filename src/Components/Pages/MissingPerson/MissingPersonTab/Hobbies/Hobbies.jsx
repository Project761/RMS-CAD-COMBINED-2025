import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, base64ToString, filterPassedTime, getShowingDateText, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useSelector } from 'react-redux';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

export const Hobbies = (props) => {

    const { DecMissPerID } = props;
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecIncID = 0;
    let DecHobID = 0;
    const query = useQuery();
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var HobID = query?.get("HobID");
    var HobSta = query?.get("HobSta");
    let MstPage = query?.get('page');
    var MissVehID = query?.get("MissVehID");

    if (!IncID) { DecIncID = 0; }
    else { DecIncID = parseInt(base64ToString(IncID)); }

    if (!HobID) { DecHobID = 0; }
    else { DecHobID = parseInt(base64ToString(HobID)); }

    if (!MissVehID) MissVehID = 0;
    else MissVehID = MissVehID;

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus, get_MissingPerson_Count, GetDataTimeZone, datezone } = useContext(AgencyContext);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const navigate = useNavigate();

    const [hobbiesDtTm, setHobbiesDtTm] = useState()
    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState();
    const [missingPersonHobbiesData, setMissingPersonHobbiesData] = useState()
    const [hobbiesId, setHobbiesId] = useState();
    const [status, setStatus] = useState()
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'MissingPersonID': '', 'HobbiesDtTm': '', 'Description': '', 'CreatedByUserFK': ''
    });

    const [errors, setErrors] = useState({ 'HobbiesDtTmError': '', 'DescriptionError': '' })

    const reset = () => {
        setValue({ ...value, 'HobbiesDtTm': '', 'Description': '', });
        setErrors({ ...errors, 'HobbiesDtTmError': '', 'DescriptionError': '' });
        setHobbiesId(''); setHobbiesDtTm(''); setStatesChangeStatus(false);
    }

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID); dispatch(get_ScreenPermissions_Data("M123", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID)
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

    useEffect(() => {
        if (loginAgencyID) {
            setValue({ ...value, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID });
        }
        Get_MissingPersonHobbies_Data()
    }, [loginAgencyID]);

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value, 'MissingPersonID': Editval[0]?.MissingPersonID, 'HobbiesDtTm': Editval[0]?.HobbiesDtTm, 'Description': Editval[0]?.Description, 'ModifiedByUserFK:': loginPinID, 'MissingPersonHobbiesID:': Editval[0]?.MissingPersonHobbiesID
            });
            setHobbiesDtTm(Editval[0]?.HobbiesDtTm ? new Date(Editval[0]?.HobbiesDtTm) : '');

        } else {
            setValue({ ...value, 'HobbiesDtTm': '', 'Description': '', });
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.HobbiesDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['HobbiesDtTmError']: RequiredFieldIncident(value.HobbiesDtTm) } })
        }
        if (RequiredFieldIncident(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredFieldIncident(value.Description) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { HobbiesDtTmError, DescriptionError } = errors

    useEffect(() => {
        if (HobbiesDtTmError === 'true' && DescriptionError === 'true') {
            if (hobbiesId && (MissPerSta === true || MissPerSta || 'true')) { update_MissingPerson_Hobbies() }
            else { insert_Hobbies_Data(); }
        }
    }, [HobbiesDtTmError, DescriptionError])

    useEffect(() => {
        if (hobbiesId && status) {
            GetSingleData(hobbiesId);
        }
    }, [hobbiesId, status]);

    // function to get single person data
    const GetSingleData = (ID) => {
        const val = { 'MissingPersonHobbiesID': ID }
        fetchPostData('MissingPersonHobbies/GetSingleData_MissingPersonHobbies', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }
    // function to get single person data
    const Get_MissingPersonHobbies_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('MissingPersonHobbies/GetData_MissingPersonHobbies', val)
            .then((res) => {
                if (res.length > 0) {
                    setMissingPersonHobbiesData(res);
                } else { setMissingPersonHobbiesData([]) }
            })
    }

    const insert_Hobbies_Data = () => {
        const { MissingPersonID, HobbiesDtTm, Description, CreatedByUserFK } = value;
        const val = { 'MissingPersonID': DecMissPerID, 'HobbiesDtTm': HobbiesDtTm, 'Description': Description, 'CreatedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPersonHobbies/Insert_MissingPersonHobbies', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); Get_MissingPersonHobbies_Data()
                setStatusFalse(); get_MissingPerson_Count(DecMissPerID, loginPinID)
                setErrors({ ...errors, ['DescriptionError']: '' }); setStatesChangeStatus(false); setChangesStatus(false)
            }
        })
    }

    const update_MissingPerson_Hobbies = () => {
        const { HobbiesDtTm, Description } = value;
        const val = {
            'HobbiesDtTm': HobbiesDtTm, 'Description': Description, 'ModifiedByUserFK': loginPinID, 'MissingPersonHobbiesID': hobbiesId
        }
        AddDeleteUpadate('MissingPersonHobbies/Update_MissingPersonHobbies', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setChangesStatus(false); Get_MissingPersonHobbies_Data()
            setStatusFalse(); setStatesChangeStatus(false); setErrors({ ...errors, ['DescriptionError']: '' })
        })
    }

    const Delete_MissingPerson_Hobbies = () => {
        const val = { 'MissingPersonHobbiesID': hobbiesId, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPersonHobbies/Delete_MissingPersonHobbies', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); Get_MissingPersonHobbies_Data(); setStatesChangeStatus(false);
                get_MissingPerson_Count(DecMissPerID, loginPinID); setStatusFalse()

            } else console.log("Somthing Wrong");
        })
    }

    const HandleChange = (e) => {
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
        else {
            setValue({ ...value, [e.target.name]: null });
        }
    };

    const set_Edit_Value = (row) => {
        if (row) {
            setStatesChangeStatus(false); setStatus(true); setErrors(''); setHobbiesId(row?.MissingPersonHobbiesID);

        }
    }

    const setStatusFalse = () => {
        setHobbiesId(''); reset(); setStatus(false); setChangesStatus(false)

    }

    const conditionalRowStyles = [
        {
            when: row => row.MissingPersonHobbiesID === hobbiesId && status,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const columns = [
        {
            name: 'Date/Time', selector: (row) => row.HobbiesDtTm ? getShowingDateText(row.HobbiesDtTm) : '', sortable: true
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
                            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setHobbiesId(row?.MissingPersonHobbiesID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setHobbiesId(row?.MissingPersonHobbiesID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const filterTimeForDateZone = (time, datezone) => {
        const zoneDate = new Date(datezone);
        const zoneHours = zoneDate.getHours();
        const zoneMinutes = zoneDate.getMinutes();
        const timeHours = time.getHours();
        const timeMinutes = time.getMinutes();
        if (timeHours > zoneHours || (timeHours === zoneHours && timeMinutes > zoneMinutes)) {
            return false;
        }
        return true;
    };


    return (
        <>
            <fieldset className='mt-2'>
                <legend>Hobbies</legend>
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Date/Time {errors.HobbiesDtTmError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HobbiesDtTmError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  ">
                            <DatePicker
                                id="HobbiesDtTm"
                                name='HobbiesDtTm'
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeFormat="HH:mm "
                                is24Hour
                                maxDate={new Date(datezone)}
                                className='requiredColor'
                                onChange={(date) => {
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                    setHobbiesDtTm(date);
                                    setValue({ ...value, ['HobbiesDtTm']: date ? getShowingMonthDateYear(date) : null });
                                    setErrors({ ...errors, ['HobbiesDtTmError']: '' })
                                }}
                                selected={hobbiesDtTm}
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
                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e?.preventDefault();
                                    }
                                }}
                                isClearable={hobbiesDtTm ? true : false}

                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Hobbies Description {errors.DescriptionError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-6  ">
                            <textarea name='Description' id="Description" maxLength={1000} cols="30" rows='2' value={value?.Description} onChange={HandleChange} className="form-control pt-2 pb-2 requiredColor" style={{ resize: 'none' }}></textarea>
                        </div>
                    </div>
                </div>
            </fieldset>


            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}  >New</button>
                {
                    hobbiesId && status === true ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  > Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  > Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                }
            </div>

            <div className="col-12 mt-2">
                <DataTable
                    dense
                    columns={columns}

                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? missingPersonHobbiesData : [] : missingPersonHobbiesData}
                    selectableRowsHighlight
                    highlightOnHover
                    onRowClicked={(row) => { set_Edit_Value(row); }}
                    responsive
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    pagination
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    fixedHeaderScrollHeight='300px'
                />
            </div>
            <DeletePopUpModal func={Delete_MissingPerson_Hobbies} />
            <ChangesModal func={check_Validation_Error} />

        </>
    )
}
