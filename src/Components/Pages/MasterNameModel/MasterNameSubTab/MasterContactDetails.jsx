import React, { useContext, useEffect, useState } from 'react'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name, Requiredcolour, tableCustomStyles } from '../../../Common/Utility';
import { useSelector } from 'react-redux';
import { get_Contact_Type_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { Email_Field, PhoneFieldNotReq } from '../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import MasterChangesModal from '../MasterChangeModel';
import ListModal from '../../Utility/ListManagementModel/ListModal';

const MasterContactDetails = (props) => {

    const { possessionID, ownerOfID, mstPossessionID, complainNameID, type, loginAgencyID, loginPinID } = props
    const { get_Name_Count, localStoreArray, get_LocalStorage, setChangesStatus, get_MasterName_Count } = useContext(AgencyContext)

    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const contactTypeDrpData = useSelector((state) => state.DropDown.contactTypeDrpData);

    const [status, setStatus] = useState(false);
    const [contactTypeCode, setContactTypeCode] = useState('');
    const [nameContactID, setNameContactID] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [contactDetailsData, setContactDetailsData] = useState([]);
    const [editval, setEditval] = useState([]);
    const [deletemodel, setdeletemodel] = useState(false)
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [openPage, setOpenPage] = useState('');

    const [value, setValue,] = useState({
        'ContactTypeID': null, 'VerifyID': null, 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": "",
        'NameID': '', 'MasterNameID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'IsMaster': false, 'nameContactID': ''
    });

    const [errors, setErrors] = useState({
        'ContactTypeIDErrors': "", 'Phone_EmailErrors': ""
    })

    useEffect(() => {
        if (loginAgencyID) {
            if (contactTypeDrpData?.length === 0) { dispatch(get_Contact_Type_Drp_Data(loginAgencyID, '1', '1')) }
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (possessionID || mstPossessionID || complainNameID) { Get_ContactDetailsData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID) }
    }, [possessionID, mstPossessionID, ownerOfID]);


    const Get_ContactDetailsData = (possessionID, mstPossessionID) => {
        const val = { 'NameID': possessionID, 'MasterNameID': mstPossessionID, 'IsMaster': false, }
        fetchPostData('NameContactDetails/GetData_NameContactDetails', val).then((res) => {
            if (res) {

                setContactDetailsData(res)
            } else {
                setContactDetailsData();
            }
        })
    }

    const check_Validation_Error = () => {
        const ContactTypeErr = RequiredFieldIncident(value.ContactTypeID);
        const PhoneEmailErr = contactTypeCode === "E" ? Email_Field(value.Phone_Email) : PhoneFieldNotReq(value.Phone_Email);
        setErrors(pre => {
            return {
                ...pre,
                ['ContactTypeIDErrors']: ContactTypeErr || pre['ContactTypeIDErrors'],
                ['Phone_EmailErrors']: PhoneEmailErr || pre['Phone_EmailErrors'],
            }
        })
    }

    const { ContactTypeIDErrors, Phone_EmailErrors, } = errors

    useEffect(() => {
        if (ContactTypeIDErrors === 'true' && Phone_EmailErrors === 'true') {
            if (status) { update_ContactDetails(); return; }
            else { Add_ContactDetails() }
        }
    }, [ContactTypeIDErrors, Phone_EmailErrors])

    const Add_ContactDetails = () => {
        const { ContactTypeID, VerifyID, Phone_Email, IsInListedPh, IsCurrentPh, NameID, MasterNameID, CreatedByUserFK, ModifiedByUserFK, IsMaster } = value
        const val = {
            'ContactTypeID': ContactTypeID, 'VerifyID': VerifyID, 'Phone_Email': Phone_Email, 'IsInListedPh': IsInListedPh, 'IsCurrentPh': IsCurrentPh,
            'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'MasterNameID': mstPossessionID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'IsMaster': IsMaster
        }
        AddDeleteUpadate('NameContactDetails/Insert_NameContactDetails', val).then((res) => {
            setStatesChangeStatus(false);
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            reset(); setContactTypeCode(''); toastifySuccess(message); get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID); Get_ContactDetailsData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
            setChangesStatus(false);
        })
    }

    const update_ContactDetails = () => {
        const { ContactTypeID, VerifyID, Phone_Email, NameContactID, IsInListedPh, IsCurrentPh, NameID, MasterNameID, CreatedByUserFK, ModifiedByUserFK, IsMaster } = value
        const val = {
            'ContactTypeID': ContactTypeID, 'NameContactID': NameContactID, 'VerifyID': VerifyID, 'Phone_Email': Phone_Email, 'IsInListedPh': IsInListedPh, 'IsCurrentPh': IsCurrentPh,
            'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'MasterNameID': mstPossessionID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'IsMaster': IsMaster
        }
        AddDeleteUpadate('NameContactDetails/Update_NameContactDetails', val).then((res) => {
            setStatesChangeStatus(false);
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            Get_ContactDetailsData(possessionID || ownerOfID || complainNameID, mstPossessionID);
            setContactTypeCode('')
            reset();
            setStatus(false);
            setErrors({ ...errors, ['Phone_EmailErrors']: '', });
            setChangesStatus(false)
        })
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e) {
            if (name === 'ContactTypeID') {
                setContactTypeCode(e.id)
                setValue({ ...value, ['ContactTypeID']: e.value, ['Phone_Email']: '', ['IsInListedPh']: '', ['IsCurrentPh']: '' });
                setErrors({ ...errors, ['Phone_EmailErrors']: '', });
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else {
            setValue({ ...value, [name]: null, ['Phone_Email']: '' });
            setContactTypeCode('')
        }
    }

    const handleChange = (e) => {
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e.target.name === 'IsInListedPh' || e.target.name === 'IsCurrentPh') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else if (e.target.name === 'Phone_Email') {
            if (contactTypeCode !== "E") {
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
        }
    }

    const reset = () => {
        setValue({ ...value, 'ContactTypeID': '', 'VerifyID': '', 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": '', });
        setErrors({ ...errors, 'ContactTypeIDErrors': "", 'Phone_EmailErrors': "" });
        setStatesChangeStatus(false); setChangesStatus(false)
        setStatus('');
    }

    const columns = [
        {
            name: 'Phone/Email',
            selector: (row) => row.Phone_Email,
            sortable: true
        },
        {
            name: 'Contact Type',
            selector: (row) => row.ContactType_Description,
            sortable: true
        },
        {
            name: 'Current Phone',
            selector: (row) => <input type="checkbox" name="" id="" checked={row.IsCurrentPh} />,
            sortable: true
        },
        {
            name: 'Unlisted Phone',
            selector: (row) => <input type="checkbox" name="" id="" checked={row.IsInListedPh} />,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    <span onClick={() => { setNameContactID(row.NameContactID); setdeletemodel(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-trash"></i>
                    </span>

                </div>
        }
    ]

    const DeleteContactDetail = () => {
        const val = {
            'NameContactID': nameContactID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameContactDetails/Delete_MainMasterNameContactDetails' : 'NameContactDetails/Delete_NameContactDetails', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                reset();
                setdeletemodel(false)
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                if (MstPage === 'mastername') { Get_ContactDetailsData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID); reset(); }
                else { Get_ContactDetailsData(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID); reset(); }
            } else console.log("Somthing Wrong");
        })
    }

    const set_Edit_Value = (row) => {
        reset();
        setStatus(true);
        setUpdateStatus(updateStatus + 1);
        setNameContactID(row.NameContactID); GetSingleData(row.NameContactID)
    }

    const GetSingleData = (nameContactID) => {
        const val = { 'NameContactID': nameContactID }
        fetchPostData('NameContactDetails/GetSingleData_NameContactDetails', val)
            .then((res) => {
                if (res) { setEditval(res); } else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'NameContactID': nameContactID, 'ContactTypeID': editval[0]?.ContactTypeID,
                'VerifyID': editval[0]?.VerifyID, 'Phone_Email': editval[0]?.Phone_Email,
                'ModifiedByUserFK': loginPinID, 'IsInListedPh': editval[0]?.IsInListedPh, "IsCurrentPh": editval[0]?.IsCurrentPh,
            })
            setContactTypeCode(Get_Property_Code(editval, contactTypeDrpData))
        } else {
            setValue({
                ...value,
                'ContactTypeID': null, 'VerifyID': null, 'Phone_Email': '', 'IsInListedPh': '', "IsCurrentPh": false,
            })
            setContactTypeCode('')
        }
    }, [editval])

    const setStatusFalse = (e) => {
        setStatus(false); reset(); setUpdateStatus(updateStatus + 1); setClickedRow(null); setStatesChangeStatus(false);
    }




    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
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
                    <div className="col-2 col-md-2 col-lg-2 mt-3 px-0">

                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Contact Phone Type')
                        }} data-target="#ListModel" className='new-link'>
                            Contact Type {errors.ContactTypeIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeIDErrors}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3  mt-2" >
                        <Select
                            name='ContactTypeID'
                            styles={Requiredcolour}
                            value={contactTypeDrpData?.filter((obj) => obj.value === value?.ContactTypeID)}
                            isClearable
                            options={contactTypeDrpData}
                            onChange={(e) => ChangeDropDown(e, 'ContactTypeID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Phone/Email  </label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
                        {
                            contactTypeCode === "E" ?
                                <input type="text" className='requiredColor' name='Phone_Email' onChange={handleChange} value={value.Phone_Email} required autoComplete='off' />
                                :
                                <input type="text" className='requiredColor' maxLength={10} onChange={handleChange} name='Phone_Email' value={value.Phone_Email} required autoComplete='off' />
                        }
                        {errors.Phone_EmailErrors !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px', }}>{errors.Phone_EmailErrors}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-12">
                    {
                        contactTypeCode === "E" ?
                            <>
                            </>
                            :
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2"></div>
                                    <div className="col-10 col-md-10 col-lg-10 mt-2 " >
                                        <div className="form-check "  >
                                            <input className="form-check-input" type="checkbox" id="IsCurrentPh" name='IsCurrentPh'
                                                onChange={handleChange} value={value.IsCurrentPh} checked={value.IsCurrentPh}
                                            />
                                            <label className="form-check-label" htmlFor="IsCurrentPh"> Current Phone
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2"></div>
                                    <div className="col-10 col-md-10 col-lg-10 mt-2" >
                                        <div className="form-check " >
                                            <input className="form-check-input" type="checkbox" name="IsInListedPh" id="IsInListedPh"
                                                onChange={handleChange} checked={value.IsInListedPh} value={value.IsInListedPh}
                                            />
                                            <label className="form-check-label" htmlFor="IsInListedPh">Unlisted Phone</label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    deletemodel &&
                                    <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="box text-center py-5">
                                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                    <div className="btn-box mt-3">
                                                        <button type="button" onClick={() => { DeleteContactDetail(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                                        <button type="button" onClick={() => { (setdeletemodel(false)); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                    }
                </div>
                <div className="btn-box text-right mr-1 mb-2">
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={setStatusFalse}>New</button>
                    {
                        status ?
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus}>Update</button>
                            :
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                    }
                </div>
                <div className="col-12 mt-3">
                    <DataTable
                        dense
                        columns={columns}
                        data={contactDetailsData}
                        pagination
                        highlightOnHover
                        noDataComponent={"There are no data to display"}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            setClickedRow(row);
                            set_Edit_Value(row);
                        }}
                        fixedHeader
                        persistTableHead={true}
                        fixedHeaderScrollHeight='150px'
                        paginationPerPage={'10'}
                        paginationRowsPerPageOptions={[10, 15, 20, 50]}
                        conditionalRowStyles={conditionalRowStyles}
                    />
                </div>
            </div >
            <MasterChangesModal func={check_Validation_Error} />
            <ListModal {...{ openPage, setOpenPage }} />

        </div>
    )
}

export default MasterContactDetails

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.ContactTypeID))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}