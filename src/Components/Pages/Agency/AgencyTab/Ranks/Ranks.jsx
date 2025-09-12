import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import { base64ToString, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import RankAddUp from './RankAddUp';
import { RequiredField } from '../../AgencyValidation/validators';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { useSelector } from 'react-redux';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Ranks = ({ aId, }) => {

    const [clickedRow, setClickedRow] = useState(null);

    const { get_CountList, } = useContext(AgencyContext);

    // Hooks Initialization
    const [rankList, setRankList] = useState([])
    const [rankEditData, setRankEditData] = useState([])
    const [status, setStatus] = useState(false)
    const [rankId, setRankId] = useState('');
    const [delRankId, setDelRankId] = useState('');

    const [openModal, setOpenModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0);
    const [pinID, setPinID] = useState('');

    const [permissionForAddRank, setPermissionForAddRank] = useState(false);
    const [permissionForEditRank, setPermissionForEditRank] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'AgencyId': aId, 'RankCode': '', 'RankDescription': '', 'CreatedByUserFK': pinID, 'ModifiedByUserFK': '',
    })

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
            dispatch(get_ScreenPermissions_Data("A021", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
        }
    }, [localStoreData]);

    // Onload Function
    useEffect(() => {
        if (aId) { get_Rank(aId) }
    }, [aId])

    useEffect(() => {
        if (pinID) {
            setValue({
                ...value,
                'AgencyId': aId, 'RankCode': '', 'RankDescription': '', 'CreatedByUserFK': pinID, 'ModifiedByUserFK': '',
            });
        }
    }, [pinID]);


    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAddRank(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEditRank(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setPermissionForAddRank(false);
            setPermissionForEditRank(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'RankCode': '', 'RankDescription': '', 'ModifiedByUserFK': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'RankCodeError': '', 'RankDescriptionError': '',
    })

    useEffect(() => {
        if (rankEditData?.RankID) {
            setValue({
                ...value,
                'RankID': rankEditData?.RankID,
                'AgencyId': aId,
                'RankCode': rankEditData?.RankCode,
                'RankDescription': rankEditData?.RankDescription,
                'ModifiedByUserFK': pinID,
            });
        } else {
            setValue({ ...value, 'AgencyId': aId, 'RankCode': '', 'CreatedByUserFK': pinID, 'RankDescription': '', 'ModifiedByUserFK': '' });
        }
    }, [rankEditData, updateStatus])


    // Get Effective Field Permission
    const get_Field_Permision_Rank = (aId, pinID) => {
        fieldPermision(aId, 'A021', pinID).then(res => {
            if (res) {
                const RankCodeFilter = res?.filter(item => item.Description === "Agency-RankCode");
                const RankDescriptionFilter = res?.filter(item => item.Description === "Agency-RankDescription");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['RankCode']: RankCodeFilter || prevValues['RankCode'],
                        ['RankDescription']: RankDescriptionFilter || prevValues['RankDescription'],
                    }
                });
            }
        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault();
        const RankCodeErr = RequiredField(value.RankCode);
        const RankDescriptionErr = RequiredField(value.RankDescription);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['RankCodeError']: RankCodeErr || prevValues['RankCodeError'],
                ['RankDescriptionError']: RankDescriptionErr || prevValues['RankDescriptionError'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { RankDescriptionError, RankCodeError } = errors

    useEffect(() => {
        if (RankCodeError === 'true' && RankDescriptionError === 'true') {
            if (status) { rank_Update() }
            else { rank_add() }
        }
    }, [RankDescriptionError, RankCodeError])

    // New Rank Create
    const rank_add = async (e) => {
        const result = rankList?.find(item => item.RankCode.toLowerCase() === value.RankCode.toLowerCase());
        const result1 = rankList?.find(item => item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
        );
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertRank', value).then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    get_Rank(aId);
                    get_CountList(aId);
                    reset_value();
                    setOpenModal(false);
                    setErrors({ ...errors, ['RankCodeError']: '' });
                } else { toastifyError("Rank can not be saved !!") }
            })
        }
    }

    // Rank Update Method
    const rank_Update = (e) => {
        const result = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankCode.toLowerCase() === value.RankCode.toLowerCase()) {
                    return item.RankCode.toLowerCase() === value.RankCode.toLowerCase()
                } else return item.RankCode.toLowerCase() === value.RankCode.toLowerCase()
            }
            return false
        });
        const result1 = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()) {
                    return item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
                } else return item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
            }
            return false
        });
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateRank', value).then(res => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_Rank(aId);
                    setStatusFalse();
                    setErrors({ ...errors, ['RankCodeError']: '' });
                } else {
                    toastifyError(res.data.Message)
                }
            }).catch(error => {
                console.error('There was an error!', error);
            });
        }
    }

    const closeModalReset = () => {
        setErrors({ ...errors, 'RankCodeError': '', 'RankDescriptionError': '' }); reset_value()
    }

    // Get Rank List 
    const get_Rank = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('MasterPersonnel/GetData_Rank', value).then(res => {
            if (res) {
                setRankList(res)
            } else {
                setRankList([])
            }
        })
    }

    // Edit value Set in hooks
    const set_Edit_Value = (row) => {
        setRankId(row.RankID)
        setStatus(true);
        setRankEditData(row);
        setOpenModal(true); setUpdateStatus(updateStatus + 1);
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setRankEditData(); closeModalReset(); setRankId('')
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Rank Code',
            selector: (row) => row.RankCode,
            sortable: true
        },
        {
            name: 'Rank Description',
            selector: (row) => row.RankDescription,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => setDelRankId(row.RankID)} data-toggle="modal" data-target="#DeleteModal"
                                className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i></Link>
                            : <></>
                            : <></>
                    }
                </div>
        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row?.RankID === rankId,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const set_Status = () => {
        setStatus(false); setOpenModal(true); setRankEditData();
    }

    // Delete Rank Function
    const delete_Rank = async (e) => {
        e.preventDefault()
        const value = { RankID: delRankId, DeletedByUserFK: pinID, }
        AddDeleteUpadate('MasterPersonnel/DeleteRank', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message);
                get_Rank(aId);
                get_CountList(aId);
                setDelRankId('')
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const reset_value = () => {
        setValue({ ...value, 'RankCode': '', 'RankDescription': '', 'ModifiedByUserFK': '', }); setRankId('')
    }

    const handleInput = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value, });
    };

    return (
        <>
            <div className="col-12 ">
                <div className="row ">
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Rank Code
                            {errors.RankCodeError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankCodeError}</span>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-2 text-field">
                        <input
                            type="text"
                            name='RankCode'
                            value={value.RankCode}
                            className={'requiredColor'}
                            onChange={handleInput}
                            required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Rank Description
                            {errors.RankDescriptionError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankDescriptionError}</span>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-6 mt-2 text-field">
                        <textarea
                            type="text" name='RankDescription' value={value.RankDescription}
                            className={'requiredColor'}
                            onChange={handleInput}
                            required cols="30" rows="1" />
                    </div>
                    <div className="col-12">
                        <div className="btn-box text-right mt-1 mr-1">
                            <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>
                            {
                                status ?
                                    permissionForEditRank ? <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button> : <></>
                                    :
                                    permissionForAddRank ? <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mt-1">
                <DataTable
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? rankList : '' : ''}
                    dense
                    paginationRowsPerPageOptions={[10, 15]}
                    highlightOnHover
                    noContextMenu
                    pagination
                    responsive
                    showHeader={true}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        set_Edit_Value(row); setClickedRow(row);
                    }}
                    fixedHeader
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>

            <DeletePopUpModal func={delete_Rank} />
            <IdentifyFieldColor />

        </>
    )
}

export default Ranks