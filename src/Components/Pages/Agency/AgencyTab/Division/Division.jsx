
import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { base64ToString, Decrypt_Id_Name, getShowingYearMonthDate, tableCustomStyles } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import Select from "react-select";
import { RequiredField } from '../../AgencyValidation/validators';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Division = ({ aId }) => {

    const { get_CountList, } = useContext(AgencyContext);

    const [divisionList, setDivisionList] = useState([]);
    const [divisionEditValue, setDivisionEditValue] = useState([]);
    const [status, setStatus] = useState(false);

    const [divisionID, setDivisionID] = useState('');
    const [delDivisionId, setDelDivisionId] = useState('');
    const [updCount, setUpdCount] = useState(0);
    const [pinID, setPinID] = useState('');
    const [clickedRow, setClickedRow] = useState(null);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [parentList, setParentList] = useState([]);
    const [permissionForAddDivision, setPermissionForAddDivision] = useState(false);
    const [permissionForEditDivision, setPermissionForEditDivision] = useState(false);
    const [permissionForDeleteDivision, setPermissionForDeleteDivision] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();


    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
            dispatch(get_ScreenPermissions_Data("A004", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (aId) {
            get_Division(aId);
        }
    }, [aId]);

    const [value, setValue] = useState({
        'AgencyId': aId, 'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ModifiedByUserFK': '', 'DivisionID': '', "ParentDivisionId": '',
        "ParentDivisionName": '', "HeadOfAgencyName": '', 'CreatedByUserFK': pinID,
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': ''
    })

    const [errors, setErrors] = useState({
        'DivisionCodeError': '', 'NameError': '', 'HeadOfAgencyIDError': ''
    })

    useEffect(() => {
        if (divisionEditValue?.DivisionID) {
            get_parent_Division(divisionEditValue?.DivisionID)
            setValue({
                ...value,
                'DivisionCode': divisionEditValue?.DivisionCode,
                'Name': divisionEditValue?.Name,
                'HeadOfAgencyID': divisionEditValue?.PINID,
                'DivisionID': divisionEditValue?.DivisionID,
                "ParentDivisionId": divisionEditValue?.ParentDivisionId,
                'ParentDivisionName': changeArrayFormat_WithFilter([divisionEditValue], 'group'), 'HeadOfAgencyName': changeArrayFormat_WithFilter([divisionEditValue], 'head'),
                'ModifiedByUserFK': pinID,
            });
        } else {
            get_parent_Division('');
            setValue({
                ...value,
                'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'DivisionID': '', "ParentDivisionId": '', 'ModifiedByUserFK': '', 'ParentDivisionName': '', 'HeadOfAgencyName': ''
            })
        }
    }, [divisionEditValue, updCount]);

    useEffect(() => {
        // console.log("🚀 ~ Division ~ effectiveScreenPermission:", effectiveScreenPermission)
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAddDivision(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEditDivision(effectiveScreenPermission[0]?.Changeok);
            setPermissionForDeleteDivision(effectiveScreenPermission[0]?.DeleteOK);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setPermissionForAddDivision(false);
            setPermissionForEditDivision(false);
            setPermissionForDeleteDivision(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        }
    }, [effectiveScreenPermission]);

    // Onload Call function
    useEffect(() => {
        get_parent_Division();
    }, [aId]);

    const get_parent_Division = (id) => {
        const val = { AgencyID: aId, DivisionID: id }
        fetchPostData('Division/GetData_ParentDivision', val).then(res => {
            if (res) {

            } else { setParentList([]) }
        })
    };


    const get_Field_Permision_Division = (aId, pinID) => {
        fieldPermision(aId, 'A004', pinID).then(res => {
            if (res) {
                const divisionCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-DivisionCode");
                const nameFilter = Agency_Field_Permistion_Filter(res, "Agency-Name");
                const headOfAgencyFilter = Agency_Field_Permistion_Filter(res, "Agency-HeadOfAgency");
                const classificationFilter = Agency_Field_Permistion_Filter(res, "Agency-Classification");
                const parentDivisionIdFilter = Agency_Field_Permistion_Filter(res, "Agency-ParentDivisionID");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['DivisionCode']: divisionCodeFilter || prevValues['DivisionCode'],
                        ['Name']: nameFilter || prevValues['Name'],
                        ['HeadOfAgencyID']: headOfAgencyFilter || prevValues['HeadOfAgencyID'],
                        ['ClassificationID']: classificationFilter || prevValues['ClassificationID'],
                        ['ParentDivisionId']: parentDivisionIdFilter || prevValues['ParentDivisionId']
                    }
                });
            }
        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        const DivisionCodeErr = RequiredField(value.DivisionCode);
        const NameErr = RequiredField(value.Name);
        const HeadOfAgencyIDErr = RequiredField(value.HeadOfAgencyID);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DivisionCodeError']: DivisionCodeErr || prevValues['DivisionCodeError'],
                ['NameError']: NameErr || prevValues['NameError'],
                ['HeadOfAgencyIDError']: HeadOfAgencyIDErr || prevValues['HeadOfAgencyIDError'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { NameError, DivisionCodeError, HeadOfAgencyIDError } = errors

    useEffect(() => {
        if (NameError === 'true' && DivisionCodeError === 'true' && HeadOfAgencyIDError === 'true') {
            if (status) { update_Division() }
            else { add_Division() }
        }
    }, [NameError, DivisionCodeError, HeadOfAgencyIDError])

    const add_Division = () => {
        const result = divisionList?.find(item => item.DivisionCode === value.DivisionCode);
        const result1 = divisionList?.find(item => item.Name === value.Name);
        if (result || result1) {
            if (result) {
                toastifyError('Division Code Already Exists')
                setErrors({ ...errors, ['DivisionCodeError']: '' })
            }
            if (result1) {
                toastifyError('Division Name Already Exists')
                setErrors({ ...errors, ['DivisionCodeError']: '' })
            }
        } else {
            const {
                AgencyId, DivisionCode, Name, HeadOfAgencyID, ModifiedByUserFK, DivisionID, ParentDivisionId,
                ParentDivisionName, HeadOfAgencyName, CreatedByUserFK,
            } = value
            const val = {
                'AgencyId': aId, 'DivisionCode': DivisionCode, 'Name': Name, 'HeadOfAgencyID': HeadOfAgencyID, 'ModifiedByUserFK': ModifiedByUserFK, 'DivisionID': DivisionID, "ParentDivisionId": ParentDivisionId,
                "ParentDivisionName": ParentDivisionName, "HeadOfAgencyName": HeadOfAgencyName, 'CreatedByUserFK': pinID,
            }
            console.log(val);
            AddDeleteUpadate('Division/DivisionInsert', val).then(res => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_parent_Division();
                    setErrors({ ...errors, ['DivisionCodeError']: '' });
                    get_Division(aId);
                    get_CountList(aId);
                    rest_Field_Value();
                }
            }).catch(err => console.log(err))
        }
    }

    // Update Division List
    const update_Division = () => {
        const result = divisionList?.find(item => {
            if (item.DivisionID != value.DivisionID) {
                if (item.DivisionCode === value.DivisionCode) {
                    return item.DivisionCode === value.DivisionCode
                } else return item.DivisionCode === value.DivisionCode
            }
            return false
        }
        );
        const result1 = divisionList?.find(item => {
            if (item.DivisionID != value.DivisionID) {
                if (item.Name === value.Name) {
                    return item.Name === value.Name
                } else return item.Name === value.Name
            }
            return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Division Code Already Exists')
                setErrors({ ...errors, ['DivisionCodeError']: '' })
            }
            if (result1) {
                toastifyError('Division Name Already Exists')
                setErrors({ ...errors, ['DivisionCodeError']: '' })
            }
        } else {
            const {
                AgencyId, DivisionCode, Name, HeadOfAgencyID, ModifiedByUserFK, DivisionID, ParentDivisionId,
                ParentDivisionName, HeadOfAgencyName, CreatedByUserFK,
            } = value
            const val = {
                'AgencyId': aId, 'DivisionCode': DivisionCode, 'Name': Name, 'HeadOfAgencyID': HeadOfAgencyID, 'ModifiedByUserFK': ModifiedByUserFK, 'DivisionID': DivisionID, "ParentDivisionId": ParentDivisionId,
                "ParentDivisionName": ParentDivisionName, "HeadOfAgencyName": HeadOfAgencyName, 'CreatedByUserFK': pinID,
            }
            AddDeleteUpadate('Division/DivisionUpdate', val).then(res => {
                if (res.success) {
                    toastifySuccess(res.Message)
                    setErrors({ ...errors, ['DivisionCodeError']: '' })
                    rest_Field_Value()
                    get_Division(aId)
                    setStatusFalse();
                }
            }).catch(err => console.log(err))
        }
    }

    // Get Division List 
    const get_Division = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('Division/GetData_Division', value).then(res => {
            if (res) {

                setDivisionList(res);
            } else {
                setDivisionList([]);
            }
        })
    }

    // Edit value Set in hooks
    const set_Edit_Value = (row) => {
        setStatus(true); setDivisionID(row?.DivisionID); setDivisionEditValue(row); setUpdCount(updCount + 1);
    }

    const columns = [

        {
            name: 'Division Code',
            selector: (row) => row.DivisionCode,
            sortable: true
        },
        {
            name: 'Division Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            name: 'Head of division',
            selector: (row) => row.PINName,
            sortable: true
        },
        {
            name: 'Parent division',
            selector: (row) => row.ParentDivisionname,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={(e) => setDelDivisionId(row.DivisionID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>

                            :
                            <></>
                    }
                </div>
        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row.DivisionID == divisionID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const setStatusFalse = (e) => {
        setClickedRow(null); setDivisionID(''); setStatus(false); setDivisionEditValue([]); rest_Field_Value();
    }

    const set_Status = () => {
        setStatus(false); setDivisionEditValue([]);
    }

    // Delete Division Function
    const delete_Division = async (e, id) => {
        e.preventDefault()
        const value = {
            IsActive: 0,
            DeletedDtTm: getShowingYearMonthDate(new Date()),
            DivisionID: delDivisionId,
            DeletedByUserFK: pinID
        }
        AddDeleteUpadate('Division/DivisionDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Division(aId)
                get_CountList(aId)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const parentChanges = (e) => {
        if (e) {
            setValue({ ...value, ['ParentDivisionId']: e.value })
        } else {
            setValue({ ...value, ['ParentDivisionId']: '' })
        }
    }

    const handlChanges = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const head_Of_AgencyChange = (e) => {
        if (e) {
            setValue({ ...value, ['HeadOfAgencyID']: e.value })
        } else {
            setValue({ ...value, ['HeadOfAgencyID']: null })
        }
    }

    const rest_Field_Value = () => {
        setValue({
            ...value, 'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': '', 'DivisionID': '', 'ModifiedByUserFK': '', 'ParentDivisionName': '', 'HeadOfAgencyName': ''
        })
        setErrors({ ...errors, 'DivisionCodeError': '', 'NameError': '', 'HeadOfAgencyIDError': '' });
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="row ">
                <div className="col-12 ">
                    <div className="row ">
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>
                                Division Code
                                {errors.DivisionCodeError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionCodeError}</span>
                                ) : null}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 text-field">
                            <input type="text" maxLength={10}
                                className={'requiredColor'}
                                onChange={handlChanges}
                                name='DivisionCode' value={value.DivisionCode} required />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>
                                Name
                                {errors.NameError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameError}</span>
                                ) : null}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 text-field">
                            <input
                                type="text"
                                className={'requiredColor'}
                                onChange={handlChanges}
                                name='Name' value={value.Name} required />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>
                                Head Of Division
                                {errors.HeadOfAgencyIDError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HeadOfAgencyIDError}</span>
                                ) : null}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                            <Select
                                value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.HeadOfAgencyID)}
                                styles={colourStyles}
                                isClearable
                                onChange={head_Of_AgencyChange}
                                isDisabled={false}
                                name='HeadOfAgencyID'
                                options={agencyOfficerDrpData}
                                placeholder={'Select...'}
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Parent Division</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2">
                            <Select
                                styles={customStylesWithOutColor}
                                className="basic-single"
                                value={parentList?.filter((obj) => obj.value === value?.ParentDivisionId)}
                                classNamePrefix="select"
                                name="ParentDivisionId"
                                options={parentList}
                                isClearable
                                onChange={parentChanges}
                                isDisabled={false}
                            />
                        </div>
                    </div>
                    <div className="btn-box text-right mr-1 mt-2">
                        <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>
                        {
                            status ?
                                permissionForEditDivision && <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                :
                                permissionForAddDivision && <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                        }
                    </div>
                    <div className="col-12 mt-1">
                        <DataTable
                            columns={columns}
                            dense
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? divisionList : [] : divisionList}
                            // data={divisionList}
                            paginationRowsPerPageOptions={[10, 15]}
                            highlightOnHover
                            showHeader={true}
                            persistTableHead={true}
                            conditionalRowStyles={conditionalRowStyles}
                            customStyles={tableCustomStyles}
                            onRowClicked={(row) => {
                                set_Edit_Value(row);
                            }}
                            fixedHeader
                            noContextMenu
                            pagination
                            responsive
                            subHeaderAlign="right"
                            subHeaderWrap
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        />
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={delete_Division} />
            <IdentifyFieldColor />
        </>
    )
}

export default Division


export const changeArrayFormat = (data, type) => {
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.DivisionCode, })
        )
        return result
    }

    if (type === 'head') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PINID, label: sponsor.HeadOfAgency })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'group') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ParentDivisionId, label: sponsor.ParentDivisionname })
        )
        return result[0]
    }
    if (type === 'head') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.PINID, label: sponsor.PINName })
        )
        return result[0]
    }
}
