import { memo, useEffect, useState } from 'react'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { GetDropDown_Alert } from '../../../redux/actions/DropDownsData';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';

const AlertMasterModel = (props) => {

    const { masterID, modelName, loginPinID, agencyID, getAlertData, setStatesChangeVich, AlertType } = props;

    const dispatch = useDispatch();
    const alertNameDrpData = useSelector((state) => state.DropDown.alertDrpData);

    const [alertID, setAlertID] = useState();
    const [status, setStatus] = useState();
    const [alertData, setAlertData] = useState();
    const [alertSingleData, setAlertSingleData] = useState();
    const [modalStatus, setModalStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [updCount, setUpdCount] = useState(0)

    const [value, setValue] = useState({
        "AlertTypeId": "", "AlertFromId": "", "AlertFrom": "", "CreatedByUserFK": "", "CreatedDtTm": "", "AlertDateFrom": "", "AlertDateTo": "", "StartNote": "", "EndNote": "", "Priority": "", 'AlertID': '',
    })

    const [errors, setErrors] = useState({
        "AlertNameError": '', "AlertDateFromError": ''
    })

    useEffect(() => {
        Get_Alerts_Data(masterID, modelName)
    }, [masterID, modelName])

    useEffect(() => {
        if (agencyID) {
            dispatch(GetDropDown_Alert(agencyID, AlertType));
        }
        setValue({
            ...value,
            "AlertFromId": masterID, "AlertFrom": modelName, "CreatedByUserFK": loginPinID,
        });
        if (masterID && modelName) {
            Get_Alerts_Data()
        } else {
            reset()
        }
    }, [agencyID, masterID])
    //---------old----------------
    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true);
        if (e) {
            if (name === 'AlertaName') {
                setValue({ ...value, ['AlertTypeId']: e?.value, ['Priority']: e?.priorityDescription ? e?.priorityDescription : '' });
                setErrors({ ...errors, 'AlertNameError': '' });
            }
        } else {
            if (name === 'AlertaName') {
                setValue({ ...value, ['AlertTypeId']: null, ['Priority']: null });
            }
        }
    }

    const handleChange = (e) => {
        setStatesChangeStatus(true);

        if (e.target.name === 'StartNote') {
            const val = e.target.value;
            const val1 = val?.split('')
            if (val?.length <= 1 || val1[0] === ' ') {
                setValue({ ...value, ['StartNote']: val?.trim() });
            } else {
                setValue({ ...value, ['StartNote']: val });
            }

        } else if (e.target.name === 'EndNote') {
            const val = e.target.value;
            const val1 = val?.split('')
            if (val?.length <= 1 || val1[0] === ' ') {
                setValue({ ...value, ['EndNote']: val?.trim() });
            } else {
                setValue({ ...value, ['EndNote']: val });
            }
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.AlertTypeId)) {
            setErrors(prevValues => { return { ...prevValues, ['AlertNameError']: RequiredFieldIncident(value.AlertTypeId) } })
        }
        if (RequiredFieldIncident(value.AlertDateFrom)) {
            setErrors(prevValues => { return { ...prevValues, ['AlertDateFromError']: RequiredFieldIncident(value.AlertDateFrom) } })
        }
    }

    const { AlertNameError, AlertDateFromError } = errors

    useEffect(() => {
        if (AlertNameError === 'true' && AlertDateFromError === 'true') {
            if (alertID && status) { update_Alert_Data() }
            else {
                insert_Alert_Data();
            }
        }

    }, [AlertNameError, AlertDateFromError])

    useEffect(() => {
        if (alertSingleData) {
            setValue({
                ...value,
                AlertID: alertID,
                "AlertTypeId": alertSingleData[0]?.AlertTypeId,
                "AlertFromId": alertSingleData[0]?.AlertFromId,
                "AlertFrom": alertSingleData[0]?.AlertFrom,
                "AlertDateFrom": alertSingleData[0]?.AlertDateFrom,
                "AlertDateTo": alertSingleData[0]?.AlertDateTo ? alertSingleData[0]?.AlertDateTo : '',
                "StartNote": alertSingleData[0]?.StartNote ? alertSingleData[0]?.StartNote : '',
                "EndNote": alertSingleData[0]?.EndNote ? alertSingleData[0]?.EndNote : '',
                "Priority": alertSingleData[0]?.Priority,
            });
        }
    }, [alertSingleData])

    useEffect(() => {
        if (alertID && status) {
            GetSingleData(alertID);
        }
    }, [alertID, updCount]);

    const GetSingleData = (ID) => {
        const val = { 'AlertId': ID }
        fetchPostData('Alerts/GetSingleData_Alerts', val)
            .then((res) => {
                if (res.length > 0) {
                    setAlertSingleData(res);
                } else {
                    setAlertSingleData([])
                }
            })
    }

    const Get_Alerts_Data = () => {
        const val = { 'AlertFromId': masterID, 'AlertFrom': modelName }
        fetchPostData('Alerts/GetData_Alerts', val)
            .then((res) => {
                if (res.length > 0) {
                    setAlertData(res);
                    getAlertData(res);
                } else { setAlertData([]); getAlertData([]) }
            })

    }

    const insert_Alert_Data = () => {
        const result = alertData?.find(item => {
            if (item.AlertTypeId) {
                if (item.AlertTypeId === value.AlertTypeId) {
                    return item.AlertTypeId === value.AlertTypeId
                } else return item.AlertTypeId === value.AlertTypeId
            }
        });
        if (result) {
            toastifyError('Alert Name Already Exists')
            setErrors({ ...errors, ['AlertNameError']: '', })
        }
        else {
            const { AlertTypeId, AlertDateFrom, AlertDateTo, StartNote, EndNote, Priority } = value;
            const val = {
                "AlertTypeId": AlertTypeId, "AlertFromId": masterID, "AlertFrom": modelName, "CreatedByUserFK": loginPinID, "CreatedDtTm": new Date(), "AlertDateFrom": AlertDateFrom, "AlertDateTo": AlertDateTo, "StartNote": StartNote, "EndNote": EndNote, 'Priority': Priority
            }
            setStatesChangeStatus(false);
            AddDeleteUpadate('Alerts/InsertAlerts', val).then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); Get_Alerts_Data(); setStatusFalse()
                    setErrors({ ...errors, ['AlertNameError']: '' });
                }
            })
        }
    }

    const update_Alert_Data = () => {
        const result = alertData?.find(item => {
            if (item.AlertTypeId) {
                if (item.AlertID != value.AlertID) {
                    if (item.AlertTypeId === value.AlertTypeId) {
                        return item.AlertTypeId === value.AlertTypeId
                    } else return item.AlertTypeId === value.AlertTypeId
                }
            }
        });
        if (result) {
            toastifyError('Alert Name Already Exists');
            setErrors({ ...errors, ['AlertNameError']: '' })
        } else {
            const { AlertTypeId, AlertDateFrom, AlertDateTo, StartNote, EndNote, Priority } = value;
            const val = {
                "AlertTypeId": AlertTypeId, "AlertFromId": masterID, "AlertFrom": modelName, "ModifiedByUserFK": loginPinID, "ModifiedDtTm": new Date(), "AlertDateFrom": AlertDateFrom, "AlertDateTo": AlertDateTo, "StartNote": StartNote, "EndNote": EndNote, "Priority": Priority, "AlertId": alertID
            }
            AddDeleteUpadate('Alerts/UpdateAlerts', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setStatesChangeVich(true)
                setStatesChangeStatus(false); Get_Alerts_Data(); setStatusFalse();
                setErrors({ ...errors, ['AlertNameError']: '' })
            })
        }
    }

    const delete_Alert_Data = () => {
        const val = { 'AlertId': alertID, 'DeletedByUserFK': loginPinID, 'DeletedDtTm': new Date(), 'IsActive': true }
        AddDeleteUpadate('Alerts/DeleteAlerts', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                Get_Alerts_Data(); setStatusFalse()
            } else console.log("Somthing Wrong");
        })
    }

    const reset = () => {
        setValue({
            ...value,
            "AlertTypeId": "", "AlertFromId": "", "AlertFrom": "", "CreatedByUserFK": "", "CreatedDtTm": "", "AlertDateFrom": "", "AlertDateTo": "", "StartNote": "", "EndNote": "", 'Priority': ''
        });
        setErrors({
            ...errors, 'AlertNameError': '', 'AlertDateFromError': ''
        });
        setAlertSingleData(''); setStatesChangeStatus(false);
    }

    const setEditValue = (row) => {
        reset(); setStatus(true); setAlertID(row.AlertID); setUpdCount(updCount + 1); setErrors({});
    }

    const setStatusFalse = () => {
        setAlertID(''); reset(); setStatus(false); setModalStatus(false); setStatesChangeStatus(false);
    }

    const columns = [
        {
            name: 'Alert Name', selector: (row) => row.AlertType, sortable: true
        },
        {
            name: 'Start Date', selector: (row) => row.AlertDateFrom ? getShowingWithOutTime(row.AlertDateFrom) : " ", sortable: true,
        },

        {
            name: 'Start Notes', selector: (row) => row?.StartNote || '',
            format: (row) => (
                <>{row?.StartNote ? row?.StartNote.substring(0, 70) : ''}{row?.StartNote?.length > 40 ? '  . . .' : null} </>
            ), sortable: true
        },
        {
            name: 'End Date', selector: (row) => row.AlertDateTo ? getShowingWithOutTime(row.AlertDateTo) : " ", sortable: true
        },
        {
            name: 'End Notes', selector: (row) => row?.EndNote || '',
            format: (row) => (<>{row?.EndNote ? row?.EndNote.substring(0, 70) : ''}{row?.EndNote?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setAlertID(row?.AlertID); setModalStatus(true); }} >
                        <i className="fa fa-trash"></i>
                    </span>
                </div >
        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row.AlertID === alertID && status,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };

    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MasterAlert" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog   modal-xl">
                    <div class="modal-content">
                        <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} onClick={() => { setStatusFalse() }}><b>X</b>
                        </button>
                        <div class="modal-body ">
                            <div className="col-12 col-md-12 col-lg-12 " style={{ marginTop: '-15px' }}>
                                <fieldset >
                                    <legend>Add Alert</legend>
                                    <div className="row " >
                                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Alert Name {errors.AlertNameError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AlertNameError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <Select
                                                name='AlertTypeId'
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                                value={alertNameDrpData?.filter((obj) => obj.value == value?.AlertTypeId)}
                                                options={alertNameDrpData}
                                                onChange={(e) => {
                                                    ChangeDropDown(e, 'AlertaName');
                                                    if (!e) { setValue(prevValue => ({ ...prevValue, Priority: "" })); }
                                                }}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-3  mt-2">
                                            <label htmlFor="" className='new-label'>Priority</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3  text-field mt-1">
                                            <input type="text" className='' autoComplete='off' name='Priority' value={value?.Priority} disabled readOnly style={{ backgroundColor: "#e0e3e8" }} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Start Date {errors.AlertDateFromError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AlertDateFromError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <DatePicker
                                                name='AlertDateFrom'
                                                id='AlertDateFrom'
                                                dateFormat="MM/dd/yyyy"
                                               
                                                onChange={(date) => {
                                                    if (date) {
                                                        setStatesChangeStatus(true);
                                                        setValue({ ...value, ['AlertDateFrom']: date ? getShowingMonthDateYear(date) : null, ['AlertDateTo']: '', })
                                                        setErrors({ ...errors, 'AlertDateFromError': '' });
                                                    }

                                                    else {
                                                        setValue({ ...value, ['AlertDateFrom']: date ? getShowingMonthDateYear(date) : null, ['AlertDateTo']: '', })
                                                    }
                                                }}
                                                selected={value?.AlertDateFrom ? new Date(value?.AlertDateFrom) : null}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                                className='requiredColor'
                                                isClearable={value?.AlertDateFrom ? true : false}
                                            />

                                        </div>
                                        <div className="col-2 col-md-2 col-lg-3  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>End Date</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <DatePicker
                                                name='AlertDateTo'
                                                id='AlertDateTo'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => {
                                                    setStatesChangeStatus(true);
                                                    setValue({ ...value, ['AlertDateTo']: date ? getShowingMonthDateYear(date) : null });
                                                }}
                                                selected={value?.AlertDateTo ? new Date(value?.AlertDateTo) : null}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={!value?.AlertDateFrom}
                                                className={!value?.AlertDateFrom ? 'readonlyColor' : ''}
                                                minDate={value?.AlertDateFrom && new Date(value?.AlertDateFrom)}
                                                placeholderText='Select...'

                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                                            <label htmlFor="" className='label-name '>Start Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-3 text-field mt-2" >
                                            <textarea id="StartNotes" cols="30" rows='2' className="form-control pt-2 pb-2 " value={value?.StartNote} name='StartNote' onChange={handleChange} style={{ resize: 'none' }}></textarea>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-3 mt-3">
                                            <label htmlFor="" className='label-name '>End Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-3 text-field mt-2" >
                                            <textarea id="EndNotes" cols="30" rows='2' className="form-control pt-2 pb-2 " name='EndNote' value={value?.EndNote} onChange={handleChange} style={{ resize: 'none' }}></textarea>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-12 mt-3">
                                <DataTable
                                    dense
                                    columns={columns}
                                    data={alertData}
                                    pagination
                                    highlightOnHover
                                    fixedHeaderScrollHeight='200px'
                                    paginationPerPage={'100'}
                                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                    fixedHeader
                                    conditionalRowStyles={conditionalRowStyles}
                                    onRowClicked={(row) => {
                                        setEditValue(row);
                                    }}
                                    persistTableHead={true}
                                    customStyles={tableCustomStyles}
                                />
                            </div>
                            <div class="modal-footer mb-0">
                                <button type="button" class="btn btn-success" onClick={() => { setStatusFalse() }}>New</button>
                                {
                                    alertID && status ?
                                        <>
                                            <button type="button" className="btn  btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }} >  Update</button>
                                        </>
                                        :
                                        <button type="button" className="btn  btn-success mr-1" onClick={() => { check_Validation_Error(); }} >  Save</button>
                                }
                                <button type="button" class="btn btn-success" data-dismiss="modal" onClick={() => { setStatusFalse() }}>Close</button>
                            </div>
                            {
                                (modalStatus && alertID) &&
                                <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }} data-backdrop="false">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="box text-center py-5">
                                                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                <div className="btn-box mt-3">
                                                    <button type="button" onClick={() => { delete_Alert_Data(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                                    <button type="button" onClick={() => { setModalStatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default memo(AlertMasterModel)