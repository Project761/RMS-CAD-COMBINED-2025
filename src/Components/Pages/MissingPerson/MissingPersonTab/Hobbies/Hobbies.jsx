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
import NameListing from '../../../ShowAllList/NameListing';

export const Hobbies = (props) => {

    const { DecMissPerID, ListData } = props;
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
    const [lastSeenID, setLastSeenID] = useState();

    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const initialValue = {
        // Last Seen Info
        MentalStatus: '',
        LocationLastSeen_City: '',
        LocationLastSeen_State: '',
        LocationLastSeen_Country: '',
        LocationLastSeen_Zip: '',
        DateTimeLastSeen: "",
        PossibleDestination: '',
        LastSeenWearing: '',
        HobbiesAndInterests: '',
        AssociationsAndHangouts: '',
        MissingPersonID: "",
        CreatedByUserFK: ''
    }
    const [value, setValue] = useState(initialValue);


    const reset = () => {
        setValue(initialValue);

        setStatesChangeStatus(false);
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
                ...value,
                'MissingPersonID': Editval[0]?.MissingPersonID,
                'ModifiedByUserFK:': loginPinID,
                'MissingPersonHobbiesID:': Editval[0]?.MissingPersonHobbiesID,
                'MentalStatus': Editval[0]?.MentalStatus,
                'LocationLastSeen_City': Editval[0]?.LocationLastSeen_City,
                'LocationLastSeen_State': Editval[0]?.LocationLastSeen_State,
                'LocationLastSeen_Country': Editval[0]?.LocationLastSeen_Country,
                'LocationLastSeen_Zip': Editval[0]?.LocationLastSeen_Zip,
                'DateTimeLastSeen': Editval[0]?.DateTimeLastSeen ? new Date(Editval[0]?.DateTimeLastSeen) : "",
                'PossibleDestination': Editval[0]?.PossibleDestination,
                'LastSeenWearing': Editval[0]?.LastSeenWearing,
                'HobbiesAndInterests': Editval[0]?.HobbiesAndInterests,
                'AssociationsAndHangouts': Editval[0]?.AssociationsAndHangouts,
            });
            setHobbiesDtTm(Editval[0]?.HobbiesDtTm ? new Date(Editval[0]?.HobbiesDtTm) : '');

        } else {
            setValue({ ...value, 'HobbiesDtTm': '', 'Description': '', });
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.HobbiesDtTm)) {
        }
        if (RequiredFieldIncident(value.Description)) {
        }
    }
    // Check All Field Format is True Then Submit 

    // useEffect(() => {
    //     if (HobbiesDtTmError === 'true' && DescriptionError === 'true') {
    //         if (hobbiesId && (MissPerSta === true || MissPerSta || 'true')) { update_MissingPerson_Hobbies() }
    //         else { insert_Hobbies_Data(); }
    //     }
    // }, [HobbiesDtTmError, DescriptionError])



    // function to get single person data

    // function to get single person data
    const Get_MissingPersonHobbies_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('MissingPersonLastScreen/GetData_MissingPersonLastScreen', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                    setLastSeenID(res[0]?.LastSeenID || null);
                } else { setEditval([]); setLastSeenID(null); }
            })
    }

    const insert_Hobbies_Data = () => {
        const val = { ...value, 'MissingPersonID': DecMissPerID, 'CreatedByUserFK': loginPinID, AgencyID: loginAgencyID }
        AddDeleteUpadate('MissingPersonLastScreen/Insert_MissingPersonLastScreen', val).then((res) => {
            if (res.success) {
                const message = res.Message;
                toastifySuccess(message);
                Get_MissingPersonHobbies_Data()
                setStatusFalse();
                get_MissingPerson_Count(DecMissPerID, loginPinID)
                setStatesChangeStatus(false);
                setChangesStatus(false)
            }
        })
    }

    const update_MissingPerson_Hobbies = () => {
        const val = { ...value, 'MissingPersonID': DecMissPerID, 'ModifiedByUserFK': loginPinID, AgencyID: loginAgencyID, LastSeenID: lastSeenID }
        AddDeleteUpadate('MissingPersonLastScreen/Update_MissingPersonLastScreen', val).then((res) => {
            // const parsedData = JSON.parse(res.data);
            // const message = parsedData.Table[0].Message;
            toastifySuccess(res?.Message); setChangesStatus(false); Get_MissingPersonHobbies_Data()
            setStatusFalse(); setStatesChangeStatus(false);
        })
    }

    const setStatusFalse = () => {
        reset(); setChangesStatus(false)
    }

    const handleInputChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        const { name, value, type, checked } = e.target;
        setValue(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDateChange = (date, name) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        setValue(prev => ({ ...prev, [name]: date ? new Date(date) : null }));
    };

    return (
        <>
            <NameListing {...{ ListData }} />
            {/* Last Seen Info Section */}
            <fieldset className='mt-2'>
                <legend>Last Seen Info</legend>
                <div className="col-12 mt-1">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Mental State</label>
                                <input type='text' name='MentalStatus' value={value.MentalStatus} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-6 col-md-6 col-lg-4">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Location Last Seen: City</label>
                                <input type='text' name='LocationLastSeen_City' value={value.LocationLastSeen_City} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-3">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>State</label>
                                <input type='text' name='LocationLastSeen_State' value={value.LocationLastSeen_State} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-3">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Country</label>
                                <input type='text' name='LocationLastSeen_Country' value={value.LocationLastSeen_Country} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-2">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Zip</label>
                                <input type='text' name='LocationLastSeen_Zip' value={value.LocationLastSeen_Zip} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>



                    <div className="row mt-1">
                        <div className="col-4 col-md-4 col-lg-4">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Date/Time Last Seen</label>

                                <DatePicker
                                    name="DateTimeLastSeen"
                                    id="DateTimeLastSeen"
                                    className="form-control"
                                    onChange={(date) => handleDateChange(date, 'DateTimeLastSeen')}
                                    selected={value.DateTimeLastSeen ? value.DateTimeLastSeen && new Date(value.DateTimeLastSeen) : null}
                                    timeFormat="HH:mm"
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    isClearable={!!value.DateTimeLastSeen}
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    autoComplete="off"
                                    placeholderText="Select..."
                                    minDate={new Date(datezone)}
                                />
                            </div>
                        </div>
                        <div className="col-8 col-md-8 col-lg-8">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Possible Destination (City, State)</label>
                                <input type='text' name='PossibleDestination' value={value.PossibleDestination} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Last Seen Wearing</label>
                                <input type='text' name='LastSeenWearing' value={value.LastSeenWearing} onChange={handleInputChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Hobbies & Interests Section */}
            <fieldset className='mt-2'>
                <legend>Hobbies & Interests</legend>
                <div className='col-12 mt-2'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className="d-flex align-items-start">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Hobbies & Interests</label>
                                <textarea
                                    name='HobbiesAndInterests'
                                    value={value.HobbiesAndInterests}
                                    onChange={handleInputChange}
                                    className='form-control'
                                    rows='4'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Associations & Hangouts Section */}
            <fieldset className='mt-2'>
                <legend>Associations & Hangouts</legend>
                <div className='col-12 mt-2'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className="d-flex align-items-start">
                                <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '145px', flexShrink: 0 }}>Associations & Hangouts</label>
                                <textarea
                                    name='AssociationsAndHangouts'
                                    value={value.AssociationsAndHangouts}
                                    onChange={handleInputChange}
                                    className='form-control'
                                    rows='4'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>



            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}  >New</button>
                {
                    lastSeenID ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { update_MissingPerson_Hobbies(); }}  > Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { update_MissingPerson_Hobbies(); }}  > Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { insert_Hobbies_Data(); }}  >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { insert_Hobbies_Data(); }}  >Save</button>
                }
            </div>


            <ChangesModal func={lastSeenID ? update_MissingPerson_Hobbies : insert_Hobbies_Data} setToReset={reset} />

        </>
    )
}
