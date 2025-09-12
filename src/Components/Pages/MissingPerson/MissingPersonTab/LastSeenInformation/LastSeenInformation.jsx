
import Select from "react-select";
import { filterPassedTime, getShowingDateText, getShowingMonthDateYear, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import { AddDeleteUpadate, fetchPostData } from "../../../../hooks/Api";
import { toastifySuccess } from "../../../../Common/AlertMsg";
import { RequiredFieldIncident } from "../../../Utility/Personnel/Validation";
import DeletePopUpModal from "../../../../Common/DeleteModal";
import MasterNameModel from "../../../MasterNameModel/MasterNameModel";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import ChangesModal from "../../../../Common/ChangesModal";
import { get_ScreenPermissions_Data } from "../../../../../redux/actions/IncidentAction";

const LastSeenInformation = (props) => {

    const { DecMissPerID, DecIncID } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    // const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus, get_MissingPerson_Count, GetDataTimeZone, datezone, personNotifyDrp, setpersonNotifyDrp, get_MissingPerson_NotifyDrp } = useContext(AgencyContext);
    const [occuredFromDate, setOccuredFromDate] = useState();
    const [LastSeenInfoID, setLastSeenInfoID] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [lastseenData, setlastseenData] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [dob, setDob] = useState();

    const [editval, setEditval] = useState();
    const [type, setType] = useState("LastSeenInfo");
    const [possessionID, setPossessionID] = useState();
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID); dispatch(get_ScreenPermissions_Data("M126", localStoreData?.AgencyID, localStoreData?.PINID));
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

    const [value, setValue] = useState({
        'AgencyID': '', 'MissingPersonID': '', 'LastSeenByID': '', 'PlaceLastSeen': '', 'LastSeenWearing': '', 'LastSeenDtTm': '', 'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'LastNameErrors': '',
    })

    useEffect(() => {
        if (loginAgencyID) {
            setValue(prevValue => ({
                ...prevValue,
                'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID, 'AgencyID': loginAgencyID,
            }));

        }
        get_Data();
    }, [loginAgencyID, DecMissPerID, loginPinID,]);



    useEffect(() => {
        if (clickedRow?.LastSeenInfoID && status) {
            GetSingleData(clickedRow?.LastSeenInfoID)
        }
    }, [clickedRow])

    //  useEffect(() => {
    //    if (DecIncID) {
    //         if (personNotifyDrp?.length === 0) { (get_MissingPerson_NotifyDrp('', '', DecIncID)) };
    //     }
    // }, [DecIncID, possessionID]);

    useEffect(() => {
        get_MissingPerson_NotifyDrp(DecIncID, DecMissPerID);
    }, [DecIncID, DecMissPerID, possessionID]);


    useEffect(() => {
        if (possessionID) { setValue({ ...value, ['LastSeenByID']: parseInt(possessionID) }) }
    }, [possessionID, personNotifyDrp]);

    const GetSingleData = (LastSeenInfoID) => {
        fetchPostData('LastSeenInformation/GetSingleData_LastSeenInformation', { 'LastSeenInfoID': LastSeenInfoID }).then((res) => {
            if (res) { setEditval(res) }
            else { setEditval() }
        })
    }

    useEffect(() => {
        if (DecMissPerID && status) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID, 'AgencyID': loginAgencyID, } });
            get_Data();
        }

    }, [DecMissPerID, loginPinID]);

    const get_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID, }

        fetchPostData('LastSeenInformation/GetData_LastSeenInformation', val).then((res) => {
            if (res) {
                setlastseenData(res)
            } else {
                setlastseenData([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'LastSeenByID') {
                setValue({ ...value, [name]: e.value }); setPossessionID(e.value); setPossenSinglData([])
            }
        } else {
            if (name === 'LastSeenByID') {
                setValue({ ...value, [name]: null });
                setPossessionID(''); setPossenSinglData([])
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }


    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.LastSeenByID)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameErrors']: RequiredFieldIncident(value.LastSeenByID) } })
        }
    }
    const { LastNameErrors } = errors

    useEffect(() => {
        if (LastNameErrors === 'true') {
            if (LastSeenInfoID) { update_Activity() }
            else { Add_Type() }
        }
    }, [LastNameErrors, LastSeenInfoID])

    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'AgencyID': editval[0]?.AgencyID, 'LastSeenInfoID': LastSeenInfoID,
                'LastSeenDtTm': editval[0]?.LastSeenDtTm ? getShowingDateText(editval[0]?.LastSeenDtTm) : '',
                'PlaceLastSeen': editval[0]?.PlaceLastSeen, 'LastSeenWearing': editval[0]?.LastSeenWearing,
                'ModifiedByUserFK': loginPinID, 'LastSeenByID': editval[0]?.LastSeenByID,
                'MissingPersonID': editval[0]?.MissingPersonID
            });
            setPossessionID(editval[0]?.LastSeenByID);
            setDob(editval[0]?.LastSeenDtTm ? new Date(editval[0]?.LastSeenDtTm) : '');

        } else {
            setValue({
                ...value,
                'LastSeenInfoID': '', 'LastSeenDtTm': '', 'PlaceLastSeen': '', 'LastSeenWearing': '', 'ModifiedByUserFK': '',
            })
        }
    }, [editval])


    const Add_Type = () => {
        const MissingPersonID = DecMissPerID
        const CreatedByUserFK = loginPinID
        const { AgencyID, NameID, LastSeenByID, PlaceLastSeen, LastSeenWearing, LastSeenDtTm } = value
        const val = { AgencyID, MissingPersonID, NameID, LastSeenByID, PlaceLastSeen, LastSeenWearing, LastSeenDtTm, CreatedByUserFK }
        AddDeleteUpadate('LastSeenInformation/Insert_LastSeenInformation', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            reset(); get_Data(); get_MissingPerson_Count(DecMissPerID, loginPinID)
            setStatesChangeStatus(false); setChangesStatus(false)

        })
    }

    const update_Activity = () => {
        const MissingPersonID = DecMissPerID
        const ModifiedByUserFK = loginPinID
        const { AgencyID, NameID, LastSeenByID, PlaceLastSeen, LastSeenWearing, LastSeenDtTm, LastSeenInfoID } = value
        const val = { AgencyID, MissingPersonID, NameID, LastSeenByID, PlaceLastSeen, LastSeenWearing, LastSeenDtTm, ModifiedByUserFK, LastSeenInfoID }
        AddDeleteUpadate('LastSeenInformation/Update_LastSeenInformation', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setChangesStatus(false); get_Data(DecMissPerID);
            setErrors({ ...errors, 'LastNameErrors': '', })
            reset(); setStatus(false); setStatesChangeStatus(false)

        })
    }

    const DeleteLastSeen = () => {
        const val = { 'LastSeenInfoID': LastSeenInfoID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('LastSeenInformation/Delete_LastSeenInformation', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data(DecMissPerID);
                get_MissingPerson_Count(DecMissPerID, loginPinID); reset()

            } else console.log("Somthing Wrong");
        })
    }

    const columns = [
        {
            width: '120px', name: 'Last Seen By',
            selector: (row) => row.Arrestee_Name ? row.Arrestee_Name : '',
            sortable: true
        },
        {
            name: 'Last Seen Date/Time', selector: (row) => row.LastSeenDtTm ? getShowingDateText(row.LastSeenDtTm) : '',
            sortable: true
        },
        {
            name: 'Place Last Seen',
            selector: (row) => row.PlaceLastSeen ? row.PlaceLastSeen : '',
            format: (row) => (
                <>{row?.PlaceLastSeen ? row?.PlaceLastSeen.substring(0, 40) : ''}{row?.PlaceLastSeen?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: 'Last Seen Wearing',
            selector: (row) => row.LastSeenWearing ? row.LastSeenWearing : '',
            format: (row) => (
                <>{row?.LastSeenWearing ? row?.LastSeenWearing.substring(0, 30) : ''}{row?.LastSeenWearing?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>


                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => { setLastSeenInfoID(row.LastSeenInfoID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setLastSeenInfoID(row.LastSeenInfoID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const set_Edit_Value = (row) => {
        reset(); GetSingleData(row.LastSeenInfoID)
        setLastSeenInfoID(row.LastSeenInfoID); setStatus(true);
        setUpdateStatus(updateStatus + 1);
        setErrors({ ...errors, 'LastNameErrors': '', })

    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const setStatusFalse = (e) => {
        setStatus(false); reset(); setUpdateStatus(updateStatus + 1);
        setClickedRow(null); setChangesStatus(false); setLastSeenInfoID('');
    }

    const handleChange = (event) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        const { name, value } = event.target;
        setValue((prevState) => ({ ...prevState, [name]: value, }));
    };

    const reset = () => {
        setValue({
            ...value, 'AgencyID': '', 'MissingPersonID': '', 'LastSeenByID': '', 'NameID': '', 'PlaceLastSeen': '',
            'LastSeenWearing': '', 'LastSeenDtTm': '', 'CreatedByUserFK': '',
        });
        setLastSeenInfoID(''); setPossessionID(''); setPossenSinglData([]);
        setDob(""); setErrors({ ...errors, 'LastNameErrors': '', })
        setStatesChangeStatus(false)
    }


    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                get_MissingPerson_Count(DecMissPerID, loginPinID);
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    const filterTimeForDateZone = (time, datezone) => {

        let currDate = new Date(dob);
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
                <legend>Last Seen Info</legend>
                <div className="col-12">
                    <div className="row">
                        <div className="col-3 col-md-3 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Last&nbsp;Seen&nbsp;By</label>
                        </div>
                        <div className="col-6 col-md-6 col-lg-4  mt-1">
                            <Select
                                name="NameID"
                                styles={Requiredcolour}
                                options={personNotifyDrp}
                                value={personNotifyDrp?.filter((obj) => obj.value === value?.LastSeenByID)}
                                isClearable

                                onChange={(e) => ChangeDropDown(e, 'LastSeenByID')}
                                placeholder="Select..."
                            />
                            {errors.LastNameErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</p>
                            ) : null}
                        </div>
                        <div className="col-3 col-md-3 col-lg-1 pt-1" data-toggle="modal" data-target="#MasterModal"  >
                            <button
                                onClick={() => {
                                    if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                                }}
                                className=" btn btn-sm bg-green text-white py-1"
                            >
                                <i className="fa fa-plus" > </i>
                            </button>
                        </div>

                        <div className="col-2 col-md-3 col-lg-3 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Last Seen Date/Time</label>
                        </div>
                        <div className="col-4 col-md-7 col-lg-3">
                            <DatePicker

                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e?.preventDefault();
                                    }
                                }}
                                name='OccurredFrom'
                                id='OccurredFrom'
                                onChange={(date) => {
                                    let currDate = new Date(date);
                                    let prevDate = new Date(dob);
                                    let maxDate = new Date(datezone)

                                    if (((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())
                                    ) || (currDate.getTime() > maxDate.getTime())) {
                                        setDob(maxDate); setValue({ ...value, ['LastSeenDtTm']: maxDate ? getShowingMonthDateYear(maxDate) : null, });
                                        setOccuredFromDate(maxDate);
                                    } else {
                                        setDob(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });
                                        setOccuredFromDate(date);
                                    }
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                }}
                                isClearable={dob ? true : false}
                                selected={dob}
                                placeholderText={dob ? dob : 'Select...'}
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeFormat="HH:mm "
                                is24Hour

                                filterTime={(time) => filterTimeForDateZone(time, datezone)}
                                timeInputLabel
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete='off'
                                maxDate={new Date(datezone)}
                            />
                        </div>
                        <div className="col-2 col-md-3 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Place&nbsp;Last&nbsp;Seen</label>
                        </div>
                        <div className="col-4 col-md-3 col-lg-4 mt-1 text-field">
                            <input type="text" className='' value={value.PlaceLastSeen}
                                onChange={(e) => { handleChange(e) }} name="PlaceLastSeen" required />
                        </div>
                        <div className="col-2 col-md-3 col-lg-4 mt-2 ">
                            <label htmlFor="" className='new-label'>Last Seen Wearing</label>
                        </div>
                        <div className="col-4 col-md-3 col-lg-3 mt-1 text-field">
                            <input type="text" className='' value={value.LastSeenWearing}
                                onChange={handleChange} name="LastSeenWearing" required />
                        </div>
                    </div>
                </div>
            </fieldset>


            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                {
                    LastSeenInfoID && status ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }} >Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }} >Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }} >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }} >Save</button>
                }
            </div>
            <div className="col-12 mt-2">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? lastseenData : [] : lastseenData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    customStyles={tableCustomStyles}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    fixedHeader
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        set_Edit_Value(row);
                        setStatesChangeStatus(false)
                    }}
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    fixedHeaderScrollHeight='300px'
                />
            </div>
            <DeletePopUpModal func={DeleteLastSeen} clearID={setLastSeenInfoID} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion, }} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}

export default LastSeenInformation