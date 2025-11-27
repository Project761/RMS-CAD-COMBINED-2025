import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useLocation } from 'react-router-dom';
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, isLockOrRestrictModule, LockFildscolour, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import NameListing from '../../../ShowAllList/NameListing';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { filterPassedDateTime1 } from '../CourtInformation/CourtInformation';
import ArresList from '../../../ShowAllList/ArrestList';

const FingerPrint = (props) => {

    const { ListData, DecIncID, isViewEventDetails = false, DecArrestId, get_List, isLocked, setIsLocked } = props

    const { get_Name_Count, setChangesStatus, GetDataTimeZone, datezone, get_Arrest_Count, NameId } = useContext(AgencyContext)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const [status, setStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [FingerPrintData, setFingerPrintData] = useState([])
    const [FingerPrintDtTm, setFingerPrintDtTm] = useState(false);
    const [editval, setEditval] = useState([]);
    const [openPage, setOpenPage] = useState('');

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [FingerPrintsID, setFingerPrintsID] = useState('');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const [value, setValue] = useState({
        'ArrestID': '', 'TRN': '', 'FingerPrintDtTm': '', 'PrintedByID': '', 'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        // 'TRNErrors': '', 
        // 'PrintedByIDErrors': '',
    })

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N135", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (NameId) {
            get_List(NameId);
        }
    }, [NameId])

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecIncID))
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (DecArrestId) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, } });
            FingerPrint_GetData(DecArrestId); get_Arrest_Count(DecArrestId);
        }
    }, [DecArrestId, loginPinID]);

    const FingerPrint_GetData = (ArrestID) => {
        const val = { ArrestID: ArrestID, TRN: 'TRN' }
        fetchPostData('FingerPrints/GetData_FingerPrints', val).then((data) => {
            if (data) {
                setFingerPrintData(data)
            } else {
                setFingerPrintData([]);
            }
        })
    }

    const GetSingleData = (FingerPrintsID) => {
        const val = { FingerPrintsID: FingerPrintsID, TRN: 'TRN' }
        fetchPostData('FingerPrints/GetSingleData_FingerPrints', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value, 'FingerPrintsID': FingerPrintsID, 'FingerPrintDtTm': editval[0]?.FingerPrintDtTm ? getShowingDateText(editval[0]?.FingerPrintDtTm) : null,
                'TRN': editval[0]?.TRN, 'PrintedByID': editval[0]?.PrintedByID, 'ModifiedByUserFK': loginPinID,
            }); setFingerPrintDtTm(editval[0]?.FingerPrintDtTm ? new Date(editval[0]?.FingerPrintDtTm) : null);
        } else { setValue({ ...value, 'TRN': '', 'FingerPrintDtTm': '', 'PrintedByID': '', 'CreatedByUserFK': '', }) }
    }, [editval])

    const Add_Type = () => {
        const {
            ArrestID, TRN, FingerPrintDtTm, PrintedByID, CreatedByUserFK,
        } = value;
        const val = {
            ArrestID: DecArrestId, TRN: TRN, FingerPrintDtTm: FingerPrintDtTm, PrintedByID: PrintedByID, CreatedByUserFK: loginPinID,
        };
        AddDeleteUpadate('FingerPrints/Insert_FingerPrints', val).then((res) => {
            FingerPrint_GetData(DecArrestId); setChangesStatus(false);
            setStatesChangeStatus(false);
            const parseData = JSON.parse(res.data); get_Arrest_Count(DecArrestId);
            toastifySuccess(parseData?.Table[0].Message); reset();
            // setErrors({ ...errors, 'PrintedByIDErrors': '', })
        })
    }

    const update_Activity = () => {
        const {
            ArrestID, TRN, FingerPrintDtTm, PrintedByID, CreatedByUserFK,
        } = value;
        const val = {
            ArrestID: DecArrestId, TRN: TRN, FingerPrintDtTm: FingerPrintDtTm, PrintedByID: PrintedByID, ModifiedByUserFK: loginPinID,
        };
        AddDeleteUpadate('FingerPrints/Update_FingerPrints', value).then((res) => {
            const parseData = JSON.parse(res.data);
            setChangesStatus(false); setStatesChangeStatus(false); FingerPrint_GetData(DecArrestId);
            // setErrors({ ...errors, 'PrintedByIDErrors': '', }); 
            reset(); setStatus(false); get_Arrest_Count(DecArrestId);
        })
    }

    const DeleteFingerPrints = () => {
        const val = { 'FingerPrintsID': FingerPrintsID, 'DeletedByUserFK': loginPinID, TRN: 'TRN' }
        AddDeleteUpadate('FingerPrints/Delete_FingerPrints', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res?.data);
                toastifySuccess(parseData?.Table[0]?.Message); setChangesStatus(false);
                FingerPrint_GetData(DecArrestId); setStatus(false); reset(); get_Arrest_Count(DecArrestId);
            } else { console.log("Somthing Wrong"); }
        })
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    const columns = [
        {
            name: 'TRN', selector: (row) => row.TRN, sortable: true
        },
        {
            name: 'Printed By', selector: (row) => row.PrintedBy, sortable: true
        },
        {
            name: 'Date Of FingerPrint', selector: (row) => row.FingerPrintDtTm ? getShowingDateText(row.FingerPrintDtTm) : " ", sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", FingerPrintData, isLocked, true) ?
                                <span onClick={() => { setFingerPrintsID(row.FingerPrintsID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            !isLockOrRestrictModule("Lock", FingerPrintData, isLocked, true) &&
                            <span onClick={() => { setFingerPrintsID(row.FingerPrintsID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>

        }
    ]

    const set_Edit_Value = (row) => {
        reset(); setStatus(true); setUpdateStatus(updateStatus + 1);
        setFingerPrintsID(row?.FingerPrintsID); GetSingleData(row?.FingerPrintsID); setStatesChangeStatus(false); setChangesStatus(false);
    }

    const setStatusFalse = (e) => {
        reset(); setStatesChangeStatus(false); setChangesStatus(false); setStatus(false); reset();
        setUpdateStatus(updateStatus + 1); setClickedRow(null);
    }

    const reset = () => {
        setValue({
            ...value, 'ArrestID': '', 'TRN': '', 'FingerPrintDtTm': '', 'PrintedByID': '', 'CreatedByUserFK': '',
        });
        setFingerPrintDtTm(''); setFingerPrintDtTm(''); setEditval([])
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];


    return (
        <>
            <ArresList {...{ ListData }} />

            <div className="col-md-12 mt-1">
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-1 mt-2">
                        <label htmlFor="" className='label-name '>TRN
                            {/* {errors.TRNErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.TRNErrors}</p>
                        ) : null} */}
                        </label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field mt-1">
                        <input
                            type="text"
                            className={isLockOrRestrictModule("Lock", editval[0]?.TRN, isLocked) ? 'LockFildsColor' : ''}
                            disabled={isLockOrRestrictModule("Lock", editval[0]?.TRN, isLocked)}
                            maxLength={10}
                            value={value?.TRN}
                            onChange={handleChange}
                            name='TRN'
                            required
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                        <lable className='label-name'>Date Of Fingerprint</lable>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1" >
                        <DatePicker
                            id='FingerPrintDtTm'
                            name='FingerPrintDtTm'
                            // className=''
                            className={isLockOrRestrictModule("Lock", editval[0]?.FingerPrintDtTm, isLocked) ? 'LockFildsColor' : ''}
                            disabled={isLockOrRestrictModule("Lock", editval[0]?.FingerPrintDtTm, isLocked)}

                            dateFormat="MM/dd/yyyy HH:mm"
                            timeFormat="HH:mm"
                            is24Hour
                            onChange={(date) => {
                                setFingerPrintDtTm(date);
                                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                                setValue({ ...value, ['FingerPrintDtTm']: date ? getShowingMonthDateYear(date) : null });
                            }}
                            selected={FingerPrintDtTm}
                            filterTime={(time) => filterPassedDateTime1(time, FingerPrintDtTm)}
                            timeInputLabel
                            isClearable={value?.FingerPrintDtTm ? true : false}
                            placeholderText={'Select...'}
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        // minDate={new Date(incReportedDate)}
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1 mt-2">
                        <lable className='label-name'>Printed By
                            {/* {errors.PrintedByIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PrintedByIDErrors}</p>
                            ) : null} */}
                        </lable>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-1" >
                        <Select
                            name='PrintedByID'
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrintedByID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'PrintedByID')}
                            placeholder="Select..."
                            // styles={customStylesWithOutColor}
                            styles={isLockOrRestrictModule("Lock", editval[0]?.PrintedByID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.PrintedByID, isLocked)}
                        />
                    </div>
                </div>
                {!isViewEventDetails &&
                    <div className="btn-box text-right mr-1 mb-2 mt-3">
                        <button type="button" data-dismiss="modal" onClick={() => {
                            setStatusFalse();
                        }} className="btn btn-sm btn-success mr-1" >New</button>

                        {
                            status ?
                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { update_Activity(); }}>Update</button>
                                :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { Add_Type(); }}>Save</button>
                        }

                    </div>
                }

            </div >
            <div className="col-12 mt-3 modal-table">
                <DataTable
                    dense
                    columns={columns}
                    data={FingerPrintData}
                    pagination
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='200px'
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteFingerPrints} />
            <ChangesModal func={Add_Type} />
            <ListModal {...{ openPage, setOpenPage }} />

        </>
    )
}

export default FingerPrint
