import React, { useContext, useState, useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { customStylesWithOutColor, getShowingWithOutTime, Requiredcolour, tableCustomStyles } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../hooks/Api';
import { RequiredFieldIncident, Space_Not_Allow } from '../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name } from '../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../Common/AlertMsg';
import MasterChangesModal from '../MasterChangeModel';
import ListModal from '../../Utility/ListManagementModel/ListModal';

const MasterIdentificationNumber = (props) => {

    const { possessionID, mstPossessionID, ownerOfID, type, complainNameID, loginAgencyID, loginPinID } = props

    console.log(possessionID, complainNameID)

    const { get_Name_Count, setChangesStatus, get_MasterName_Count } = useContext(AgencyContext)
    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');

    const [status, setStatus] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [identificationData, setIdentificationData] = useState();
    const [updateStatus, setUpdateStatus] = useState(0)
    const [identificationNumberID, setIdentificationNumberID] = useState('');
    const [identification, setIdentification] = useState([]);
    const [editval, setEditval] = useState();
    const [identificationDate, setIdentificationDate] = useState();
    const [stateList, setStateList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [selected, setSelected] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isTypeOne, setIsTypeOne] = useState(false);
    const [openPage, setOpenPage] = useState('');

    const [value, setValue] = useState({
        'IdentificationTypeID': null, 'StateID': null, 'CountryID': null, 'IdentificationNumber': '', 'IsCurrent': "", 'ExpiryDate': "", 'IdentificationNumberID': '',
        'NameID': '', 'MasterNameID': '', 'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '', 'StateIDErrors': '', 'CountryIDErrors': '',
    })

    useEffect(() => {

        if (possessionID || ownerOfID || complainNameID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': mstPossessionID, 'NameID': possessionID || ownerOfID } });
            Get_IdentificationData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
        }

    }, [possessionID, mstPossessionID, ownerOfID, loginPinID]);

    // function to reset form and values
    const reset = () => {
        setValue({
            ...value,
            'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "",
        });
        setIdentificationDate(''); setStatesChangeStatus(false); setChangesStatus(false);

        setErrors({
            'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
        })
        setIsTypeOne(false);
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'IdentificationNumberID': identificationNumberID, 'IdentificationTypeID': editval[0]?.IdentificationTypeID, 'IsCurrent': editval[0]?.IsCurrent,
                'ExpiryDate': editval[0]?.ExpiryDate ? getShowingWithOutTime(editval[0]?.ExpiryDate) : '', "IdentificationNumber": editval[0]?.IdentificationNumber,
                'StateID': editval[0]?.StateID,
                'CountryID': editval[0]?.CountryID ? editval[0]?.CountryID : editval[0]?.StateID || editval[0]?.StateID == '' ? 20001 : null,

                'ModifiedByUserFK': loginPinID,
            })
            if (editval[0]?.IdentificationTypeID === 2) {
                if (editval[0]?.StateID || editval[0]?.StateID == '' ? 20001 : null) {
                    setIsTypeOne(true)
                }
                else {
                    setIsTypeOne(false);
                }
            }
        }
        else {
            setValue({
                ...value,
                'IdentificationTypeID': null, 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': null, 'CountryID': null, 'ExpiryDate': "", 'ModifiedByUserFK': '',
            })
        }
    }, [editval])


    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const ChangeDropDown = (newValue, name) => {
        setStatesChangeStatus(true);
        if (newValue) {
            setChangesStatus(true);
            if (name === 'IdentificationTypeID') {
                if (newValue.value == '2') {
                    setIsTypeOne(true)
                }
                else { setIsTypeOne(false) }
                setValue({
                    ...value,
                    [name]: newValue.value,
                });
                setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '', })
            } else {
                setValue({ ...value, [name]: newValue.value });
            }
        } else {
            if (name === 'IdentificationTypeID') {

                setValue({
                    ...value, [name]: null,
                });
                setSelected(false);
                setIsTypeOne(false);
            } else {
                setValue({ ...value, [name]: null });
                if (name === 'CountryID') {
                    setValue({ ...value, [name]: null, 'StateID': null });
                }
            }
            setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '' });
        }
    };



    const check_Validation_Error = () => {
        const IdentificationNumberErr = Space_Not_Allow(value.IdentificationNumber)
        const IdentificationTypeIDErr = RequiredFieldIncident(value.IdentificationTypeID)
        const CountryIDErrors = isTypeOne ? RequiredFieldIncident(value.CountryID) : 'true'
        const StateIDErr = isTypeOne && value?.CountryID ? RequiredFieldIncident(value.StateID) : 'true'

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['IdentificationNumberErrors']: IdentificationNumberErr || prevValues['IdentificationNumberErrors'],
                ['IdentificationTypeIDErrors']: IdentificationTypeIDErr || prevValues['IdentificationTypeIDErrors'],
                ['CountryIDErrors']: CountryIDErrors || prevValues['CountryIDErrors'],
                ['StateIDErrors']: StateIDErr || prevValues['StateIDErrors'],
            }
        })

    }




    const { IdentificationNumberErrors, IdentificationTypeIDErrors, CountryIDErrors, StateIDErrors } = errors

    useEffect(() => {

        if (IdentificationNumberErrors === 'true' && IdentificationTypeIDErrors === 'true' && StateIDErrors === 'true' && CountryIDErrors === 'true') {
            if (status) { update_Identification(); }
            else { Add_Type(); }
        }



    }, [IdentificationNumberErrors, IdentificationTypeIDErrors, StateIDErrors, CountryIDErrors, status]);

    useEffect(() => {
        get_Identification(loginAgencyID);
        getCountryID();
        getStateList();
    }, [loginAgencyID])

    const get_Identification = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('IDTypes/GetDataDropDown_IDTypes', val).then((data) => {
            if (data) {
                setIdentification(Comman_changeArrayFormat(data, 'IDTypeID', 'Description'))
            } else { setIdentification([]); }
        })
    }

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
            } else { setStateList([]); }
        });
    };

    const getCountryID = async () => {
        const val = { 'IsUSCitizen': true, };
        fetchPostData("State_City_ZipCode/GetData_Country", val).then((data) => {
            if (data) {
                setCountryList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "CountryID"));
            } else { setCountryList([]); }
        });
    };

    // function to add identification data
    const Add_Type = () => {
        const { IdentificationTypeID, StateID, CountryID, IdentificationNumber, IsCurrent, ExpiryDate, IdentificationNumberID } = value
        const val = {
            'IdentificationTypeID': IdentificationTypeID, 'StateID': StateID, 'CountryID': CountryID, 'IdentificationNumber': IdentificationNumber, 'IsCurrent': IsCurrent, 'ExpiryDate': ExpiryDate, 'IdentificationNumberID': IdentificationNumberID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'CreatedByUserFK': loginPinID,
        }
        AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameIdentificationNumber/Insert_MainMasterNameIdentificationNumber' : 'NameIdentificationNumber/Insert_NameIdentificationNumber', val)
            .then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                Get_IdentificationData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                setStatesChangeStatus(false);
                reset(); setErrors({ ...errors, 'IdentificationTypeIDErrors': '', }); setChangesStatus(false);
            })
    }

    // function to update identification data
    const update_Identification = () => {
        const { IdentificationTypeID, StateID, CountryID, IdentificationNumber, IsCurrent, ExpiryDate, IdentificationNumberID } = value
        const val = {
            'IdentificationTypeID': IdentificationTypeID, 'StateID': StateID, 'CountryID': CountryID, 'IdentificationNumber': IdentificationNumber, 'IsCurrent': IsCurrent, 'ExpiryDate': ExpiryDate, 'IdentificationNumberID': IdentificationNumberID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'ModifiedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameIdentificationNumber/Update_NameIdentificationNumber', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            Get_IdentificationData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
            setErrors({ ...errors, 'IdentificationTypeIDErrors': '', })
            reset();
            setStatesChangeStatus(false);
            setStatus(false);
            setChangesStatus(false);
        })
    }

    // set value on edit data
    const set_Edit_Value = (row) => {
        reset();
        setStatus(true);
        GetSingleData(row.IdentificationNumberID)
        setUpdateStatus(updateStatus + 1);
        setIdentificationNumberID(row.IdentificationNumberID);
    }

    const selectHandleChange = (newValue, name) => {
        setStatesChangeStatus(true);
        if (name === 'StateID') { setErrors(prevErrors => ({ ...prevErrors, StateIDErrors: '' })); }
        if (newValue) {
            setValue({ ...value, [name]: newValue.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const handleChange = (e) => {
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e.target.name === "IsCurrent") {
            setValue({ ...value, [e.target.name]: e.target.checked, });
        } else {
            setValue({ ...value, [e.target.name]: e.target.value, });
        }
    };

    useEffect(() => {
        if (clickedRow?.IdentificationNumberID) {
            GetSingleData(clickedRow?.IdentificationNumberID)
        }
    }, [updateStatus, clickedRow])

    // function to get single data
    const GetSingleData = (identificationNumberID) => {
        const val = { 'IdentificationNumberID': identificationNumberID }
        fetchPostData('NameIdentificationNumber/GetSingleData_NameIdentificationNumber', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval() }
            })
    }

    // function to get identification data
    const Get_IdentificationData = (DecNameID, DecMasterNameID) => {
        const val = {
            'NameID': DecNameID,
        }
        const req = {
            'MasterNameID': DecMasterNameID,
        }
        fetchPostData(MstPage === 'mastername' ? 'MainMasterNameIdentificationNumber/GetData_MainMasterNameIdentificationNumber' : 'NameIdentificationNumber/GetData_NameIdentificationNumber', MstPage === 'mastername' ? req : val).then((res) => {
            if (res) {
                setIdentificationData(res)
            } else {
                setIdentificationData([]);
            }
        })
    }

    const columns = [
        {
            width: '250px',
            name: 'Identification Type',
            selector: (row) => row.IdType_Description,
            sortable: true
        },
        {
            name: 'Identification Number',

            selector: (row) => row.IdentificationNumber || row.DLIdentificationNumber,
            sortable: true
        },
        {
            name: 'Expiry Date',
            selector: (row) => row.ExpiryDate ? getShowingWithOutTime(row.ExpiryDate) : '',
            sortable: true
        },
        {
            name: 'Country',
            selector: (row) => row.CountryName,
            sortable: true
        },
        {
            name: 'State',
            selector: (row) => row.StateName,
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>

                    <span onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); setDeleteModal(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-trash"></i>
                    </span>

                </div>

        }
    ]

    const setStatusFalse = (e) => {
        setClickedRow(null); reset();
        setStatus(false)
        setSelected(false);
        setStatesChangeStatus(false);
        setUpdateStatus(updateStatus + 1);

    }

    // function to delete id data
    const DeleteIdentification = () => {
        const val = {
            'IdentificationNumberID': identificationNumberID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameIdentificationNumber/Delete_NameIdentificationNumber', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setDeleteModal(false)
                Get_IdentificationData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                setStatus(false);
                reset();

            } else console.log("Somthing Wrong");
        })
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

    return (
        <div>
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-2 mt-3">

                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('ID Types')
                        }} data-target="#ListModel" className='new-link'>
                            Identification Type {errors.IdentificationTypeIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationTypeIDErrors}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3  mt-2" >
                        <Select
                            name='IdentificationTypeID'
                            styles={Requiredcolour}
                            value={identification?.filter((obj) => obj.value === value?.IdentificationTypeID)}
                            isClearable
                            options={identification}
                            onChange={(e) => {
                                ChangeDropDown(e, 'IdentificationTypeID');
                            }}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Identification Number{errors.IdentificationNumberErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationNumberErrors}</p>
                        ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 text-field mt-2" >
                        <input type="text" value={value.IdentificationNumber} maxLength={15} onChange={handleChange} className='requiredColor' name='IdentificationNumber' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>ID Expiry</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 " >
                        <DatePicker
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            id='ExpiryDate'
                            name='ExpiryDate'
                            dateFormat="MM/dd/yyyy"
                            onChange={(date) => {
                                setIdentificationDate(date); setStatesChangeStatus(true);
                                setValue({ ...value, ['ExpiryDate']: date ? getShowingWithOutTime(date) : null })
                            }}
                            showMonthDropdown
                            isClearable={value?.ExpiryDate ? true : false}
                            autoComplete="off"
                            showDisabledMonthNavigation
                            dropdownMode="select"
                            showYearDropdown
                            placeholderText={value?.ExpiryDate ? value?.ExpiryDate : 'Select...'}
                            selected={identificationDate}

                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Country{errors.CountryIDErrors !== 'true' && errors.CountryIDErrors ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CountryIDErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3  mt-2" >
                        <Select
                            name="CountryID"
                            value={countryList?.filter((obj) => obj.value === value?.CountryID)}
                            isClearable
                            options={countryList}
                            onChange={(newValue) => {
                                selectHandleChange(newValue, 'CountryID');
                                ChangeDropDown(newValue, 'CountryID');
                            }}
                            placeholder="Select..."
                            styles={isTypeOne ? Requiredcolour : customStylesWithOutColor}
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>State{errors.StateIDErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateIDErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name="StateID"
                            value={value.StateID ? stateList.find(obj => obj.value === value.StateID) : null}
                            isClearable
                            options={stateList}
                            onChange={(newValue) => {
                                selectHandleChange(newValue, 'StateID');
                                ChangeDropDown(newValue, 'StateID');
                            }}
                            placeholder="Select..."
                            styles={isTypeOne && value?.CountryID ? Requiredcolour : customStylesWithOutColor}
                            isDisabled={value?.CountryID ? false : true}
                        />
                    </div>
                </div>
                {
                    deleteModal &&
                    <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={() => { DeleteIdentification(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { setDeleteModal(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="btn-box text-right mt-3 mr-1 mb-2">
                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                    {
                        status ?
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
                            :
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                    }
                </div>
                <DataTable
                    dense
                    columns={columns}
                    data={identificationData}
                    highlightOnHover
                    noDataComponent={"There are no data to display"}
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        set_Edit_Value(row);
                    }}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='170px'
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    conditionalRowStyles={conditionalRowStyles}
                />
            </div>
            <MasterChangesModal func={check_Validation_Error} />
            <ListModal {...{ openPage, setOpenPage }} />

        </div>
    )
}

export default MasterIdentificationNumber