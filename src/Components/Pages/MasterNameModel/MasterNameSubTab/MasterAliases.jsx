import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../../Common/Utility';
import { NameValidationCharacter, RequiredFieldSpaceNotAllow } from '../../Agency/AgencyValidation/validators';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useLocation } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import MasterChangesModal from '../MasterChangeModel';
import { SSN_Field } from '../../PersonnelCom/Validation/PersonnelValidation';


const MasterAliases = (props) => {

    const { possessionID, mstPossessionID, ownerOfID, complainNameID , type , loginAgencyID, loginPinID } = props

    const { get_Name_Count, setChangesStatus,get_MasterName_Count } = useContext(AgencyContext)
    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');

    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [updateStatus, setUpdateStatus] = useState([]);
    const [openPage, setOpenPage] = useState('');
    const [dob, setDob] = useState();
    const [nameAliasesID, setNameAliasesID] = useState('');
    const [delAliasesID, setDelAliasesID] = useState('');
    const [editval, setEditval] = useState();
    const [status, setStatus] = useState(false);
    const [aliasesData, setAliasesData] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);


    const [value, setValue] = useState({
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SuffixID': null, 'AliasSSN': '', 'DOB': '', 'ModifiedDtTm': "",
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
        "ModifiedByUserFK": ""
    })

    useEffect(() => {
        if (possessionID || mstPossessionID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID } });
        }
        get_Aliases_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
        get_MasterName_Count(possessionID || ownerOfID || complainNameID);

    }, [possessionID, mstPossessionID, loginPinID, ownerOfID, loginAgencyID]);

    const [errors, setErrors] = useState({
        'LastNameErrors': '', 'MiddleNameError': '', 'FirstNameError': '',
    })
    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    useEffect(() => {
        if (clickedRow?.NameAliasesID) {
            GetSingleData(clickedRow?.NameAliasesID)
        }
    }, [clickedRow])

    // function to get single data
    const GetSingleData = (nameAliasesID) => {
        fetchPostData('NameAliases/GetSingleData_NameAliases', { 'NameAliasesID': nameAliasesID }).then((res) => {
            if (res) setEditval(res)
            else setEditval()
        })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'NameAliasesID': nameAliasesID,
                'DOB': editval[0]?.DOB ? getShowingDateText(editval[0]?.DOB) : ' ', "LastName": editval[0]?.LastName ? editval[0]?.LastName?.trim() : editval[0]?.LastName,
                'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName, 'SuffixID': editval[0]?.SuffixID,
                'AliasSSN': editval[0]?.AliasSSN,
                'ModifiedByUserFK': loginPinID,
            });
            setDob(editval[0]?.DOB ? new Date(editval[0]?.DOB) : '');
        } else {
            setValue({
                ...value,
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': null, 'AliasSSN': '', 'ModifiedByUserFK': '',
            })
        }
    }, [editval])

    const check_Validation_Error = (e) => {
        const { LastName, FirstName, MiddleName, AliasSSN } = value;
        const LastNameErrors = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
        const FirstNameError = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
        const MiddleNameError = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
        const AliasSSNError = value.AliasSSN ? SSN_Field(value.AliasSSN) : 'true'

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['LastNameErrors']: LastNameErrors || prevValues['LastNameErrors'],
                ['FirstNameError']: FirstNameError || prevValues['FirstNameError'],
                ['MiddleNameError']: MiddleNameError || prevValues['MiddleNameError'],
                ['AliasSSNError']: AliasSSNError || prevValues['AliasSSNError'],
            }
        })
    }

    const { LastNameErrors, FirstNameError, MiddleNameError, AliasSSNError } = errors

    useEffect(() => {
        if (LastNameErrors === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && AliasSSNError === 'true') {
            if (nameAliasesID && status) { update_Activity() }
            else { Add_Type() }
        }
    }, [LastNameErrors, FirstNameError, MiddleNameError, AliasSSNError,])

    useEffect(() => {
        if (loginAgencyID) {
            GetSuffixIDDrp(loginAgencyID);
        }
    }, [loginAgencyID])

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true)
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    // function to add aliasesData
    const Add_Type = () => {
        const { LastName, FirstName, MiddleName, SuffixID, AliasSSN, DOB, ModifiedDtTm } = value
        const val = {
            'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SuffixID': SuffixID, 'AliasSSN': AliasSSN, 'DOB': DOB, 'ModifiedDtTm': ModifiedDtTm, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'CreatedByUserFK': loginPinID
        }
        AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameAliases/Insert_MainMasterNameAliases' : 'NameAliases/Insert_NameAliases', val).then((res) => {
            setStatesChangeStatus(false);
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            get_Aliases_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
            get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
            setModal(false)
            toastifySuccess(message);
            reset();
            setChangesStatus(false)
        })
    }

    // function to update aliase
    const update_Activity = () => {
        const { LastName, FirstName, MiddleName, SuffixID, AliasSSN, DOB, ModifiedDtTm } = value
        const val = {
            'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SuffixID': SuffixID, 'AliasSSN': AliasSSN, 'DOB': DOB, 'ModifiedDtTm': ModifiedDtTm, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'NameAliasesID': nameAliasesID,
        }
        AddDeleteUpadate('NameAliases/Update_NameAliases', val).then((res) => {
            setStatesChangeStatus(false);
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setModal(false);
            get_Aliases_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
            reset();
            setStatus(false);
            setChangesStatus(false)
        })
    }

    const columns = [

        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            name: 'Suffix',
            selector: (row) => row.Suffix_Des,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.DOB ? getShowingWithOutTime(row.DOB) : '',
            sortable: true
        },
        {
            name: 'Alias SSN',
            selector: (row) => row.AliasSSN,
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10, zIndex: '1' }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>

                    <span onClick={() => { setDelAliasesID(row?.NameAliasesID); setDeleteModal(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-trash"></i>
                    </span>

                </div>

        }
    ]

    // function to get dropdown data
    const GetSuffixIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setSuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            } else {
                setSuffixIdDrp([]);
            }
        })
    }

    // function to reset form
    const reset = () => {
        setValue({
            ...value,
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '',
        });
        setDob(""); setStatesChangeStatus(false); setChangesStatus(false);
        setErrors({
            ...errors,
            'LastNameErrors': '',
            'AliasSSNError': '',
            'FirstNameError': '',
            'MiddleNameError': '',
        })
    }

    useEffect(() => {
        if (!status) { console.log(!status) }
        else { setDob(''); setValue({ ...value, ['DOB']: '', }); }
    }, [])


    const handleChange = (e) => {
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e.target.name === "IsVerify") {
            setValue({ ...value, [e.target.name]: e.target.checked, });
        }
        else if (e.target.name === 'AliasSSN') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
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
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numpadKeys = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

        const numpadSpecialKeys = [106, 107, 109, 110, 111];

        if (!charStr.match(/^[a-zA-Z]+$/) && !controlKeys.includes(charCode)) {
            e.preventDefault();
        }
        if ((charCode >= 48 && charCode <= 57) || numpadKeys.includes(charCode) || numpadSpecialKeys.includes(charCode)) {
            e.preventDefault();
        }
    };

    // set value on clicked row of table
    const set_Edit_Value = (row) => {
        reset();
        GetSingleData(row.NameAliasesID)
        setNameAliasesID(row.NameAliasesID);
        setStatus(true);
        setModal(true)
    }

    // function to get aliase data
    const get_Aliases_Data = (DecNameID, DecMasterNameID) => {
        const val = {
            'NameID': MstPage === 'mastername' ? '' : DecNameID,
        }
        const req = {
            'MasterNameID': DecMasterNameID,
        }
        fetchPostData(MstPage === 'mastername' ? 'MainMasterNameAliases/GetData_MainMasterNameAliases' : 'NameAliases/GetData_NameAliases', MstPage === 'mastername' ? req : val).then((res) => {
            if (res) {

                setAliasesData(res)
            } else {
                setAliasesData([]);
            }
        })
    }

    // function to delete aliase
    const DeleteNameAliases = () => {
        const val = { 'NameAliasesID': delAliasesID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameAliases/Delete_NameAliases', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setDeleteModal(false);
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                get_Aliases_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
                setStatus(false);
                reset()
            } else console.log("Somthing Wrong");
        })
    }

    // function to reset and change update status
    const setStatusFalse = (e) => {
        setStatus(false); reset();
        setUpdateStatus(updateStatus + 1);
        setClickedRow(null);
        setStatesChangeStatus(false);
        setChangesStatus(false)
    }

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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
        <>
            <div>
                <div className="col-md-12 mt-2">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                            <label htmlFor="" className='label-name '>Last Name{errors.LastNameErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
                            <input type="text" maxLength={100} className='requiredColor' name='LastName'  value={value?.LastName} onChange={handleChange} required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                            <label htmlFor="" className='label-name '>First Name{errors.FirstNameError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
                            <input type="text" maxLength={50} name='FirstName' value={value?.FirstName}  onChange={handleChange} required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                            <label htmlFor="" className='label-name '>Middle Name{errors.MiddleNameError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MiddleNameError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
                            <input type="text" maxLength={50} name='MiddleName' value={value?.MiddleName}  onChange={handleChange} required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                            <label htmlFor="" className='label-name '>Alias SSN {errors.AliasSSNError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AliasSSNError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
                            <input type="text" name='AliasSSN' value={value.AliasSSN} maxLength={9} onChange={handleChange} required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                            <span className='new-link' data-toggle="modal" onClick={() => {
                                setOpenPage('Suffix')
                            }} data-target="#ListModel">
                                Suffix
                            </span>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3  mt-1" >
                            <Select
                                name='SuffixID'
                                className='requiredColor'
                                styles={customStylesWithOutColor}
                                value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                isClearable
                                options={suffixIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='label-name '>DOB</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 " >
                            <DatePicker
                                id='DOB'
                                name='DOB'
                                className=''
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setDob(date); setChangesStatus(true); setStatesChangeStatus(true); setValue({ ...value, ['DOB']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={dob ? true : false}
                                selected={dob}
                                showDisabledMonthNavigation
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                maxDate={new Date()}
                                placeholderText={dob ? dob : 'Select...'}

                            />
                        </div>
                    </div>
                    <div className="btn-box text-right  mr-1 mb-2">
                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse();  setUpdateStatus(updateStatus + 1); }}>New</button>
                        {
                            nameAliasesID && status ?
                                <button type="button" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Update</button>
                                :
                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                        }
                    </div>
                    <div className="col-12">
                        <DataTable
                            dense
                            columns={columns}
                            data={aliasesData}
                            highlightOnHover
                            noDataComponent={"There are no data to display"}
                            customStyles={tableCustomStyles}
                            onRowClicked={(row) => {
                                setClickedRow(row);
                                set_Edit_Value(row);
                            }}
                            fixedHeader
                            persistTableHead={true}
                            fixedHeaderScrollHeight='180px'
                            pagination
                            paginationPerPage={'10'}
                            paginationRowsPerPageOptions={[10, 15, 20, 50]}
                            conditionalRowStyles={conditionalRowStyles}
                        />
                    </div>
                </div >
                {
                    deleteModal &&
                    <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={() => { DeleteNameAliases(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { setDeleteModal(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <MasterChangesModal func={check_Validation_Error} />

        </>
    )
}

export default MasterAliases