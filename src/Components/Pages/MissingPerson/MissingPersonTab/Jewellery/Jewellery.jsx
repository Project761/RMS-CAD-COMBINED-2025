import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, Requiredcolour, base64ToString, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Select from 'react-select';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { get_Jwellery_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Jewellery = (props) => {

    const { DecMissPerID } = props;
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecIncID = 0;
    let DecJewID = 0;
    const query = useQuery();
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var JewID = query?.get("JewID");
    var JewSta = query?.get("JewSta");
    let MstPage = query?.get('page');

    if (!IncID) { DecIncID = 0; }
    else { DecIncID = parseInt(base64ToString(IncID)); }

    if (!JewID) { DecJewID = 0; }
    else { DecJewID = parseInt(base64ToString(JewID)); }

    const dispatch = useDispatch();
    const jwelleryTypeDrpData = useSelector((state) => state.DropDown.JwelleryDrpData);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus, get_MissingPerson_Count } = useContext(AgencyContext);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const navigate = useNavigate();

    const [JewelleryTypeID, setJewelleryTypeID] = useState()
    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState();
    const [missingPersonJewelleryData, setMissingPersonJewelleryData] = useState()
    const [JewelleryId, setJewelleryId] = useState();
    const [status, setStatus] = useState()
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'MissingPersonID': '', 'JewelleryTypeID': '', 'Description': '', 'CreatedByUserFK': ''
    });

    const [errors, setErrors] = useState({
        'JewelleryTypeIDError': '', 'DescriptionError': ''
    })

    const reset = () => {
        setValue({
            ...value, 'Description': '', 'JewelleryTypeID': ''
        });
        setErrors({
            ...errors, 'JewelleryTypeIDError': '', 'DescriptionError': ''
        });
        setJewelleryTypeID(''); setStatesChangeStatus(false);
    }

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("M124", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
            if (jwelleryTypeDrpData?.length === 0) { dispatch(get_Jwellery_Drp_Data(localStoreData?.AgencyID)) }
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
            setValue({
                ...value, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID
            });
        }
        Get_MissingPersonJewellery_Data()

    }, [loginAgencyID]);

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value, 'MissingPersonID': Editval[0]?.MissingPersonID, 'JewelleryTypeID': Editval[0]?.JewelleryTypeID, 'Description': Editval[0]?.Description, 'ModifiedByUserFK:': loginPinID, 'MissingPersonJewelleryID:': Editval[0]?.MissingPersonJewelleryID
            });
            setJewelleryTypeID(Editval[0]?.JewelleryTypeID ? (Editval[0]?.JewelleryTypeID) : '');

        } else {
            setValue({ ...value, 'JewelleryTypeID': '', 'Description': '', });
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.JewelleryTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['JewelleryTypeIDError']: RequiredFieldIncident(value.JewelleryTypeID) } })
        }
        if (RequiredFieldIncident(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredFieldIncident(value.Description) } })
        }
    }

    const { JewelleryTypeIDError, DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && JewelleryTypeIDError === "true") {
            if (JewelleryId && (MissPerSta === true || MissPerSta || 'true')) { update_MissingPerson_Jewellery() }
            else {
                insert_Jewellery_Data();
            }
        }
    }, [JewelleryTypeIDError, DescriptionError])

    useEffect(() => {
        if (clickedRow?.MissingPersonJewelleryID && status) {
            GetSingleData(clickedRow?.MissingPersonJewelleryID);
        }

    }, [clickedRow, status]);

    const GetSingleData = (ID) => {
        const val = { 'MissingPersonJewelleryID': ID }
        fetchPostData('MissingPersonJewellery/GetSingleData_MissingPersonJewellery', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }

    const Get_MissingPersonJewellery_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('MissingPersonJewellery/GetData_MissingPersonJewellery', val)
            .then((res) => {
                if (res.length > 0) {
                    setMissingPersonJewelleryData(res);
                } else { setMissingPersonJewelleryData([]) }
            })
    }

    const insert_Jewellery_Data = () => {
        AddDeleteUpadate('MissingPersonJewellery/Insert_MissingPersonJewellery', value).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); Get_MissingPersonJewellery_Data(); setStatusFalse()
                get_MissingPerson_Count(DecMissPerID, loginPinID); setStatesChangeStatus(false); setErrors({ ...errors, ['DescriptionError']: '' });
            }
        })
    }

    const update_MissingPerson_Jewellery = () => {
        const { JewelleryTypeID, Description } = value;
        const val = {
            'MissingPersonID': DecMissPerID, 'JewelleryTypeID': JewelleryTypeID, 'Description': Description, 'ModifiedByUserFK': loginPinID, 'MissingPersonJewelleryID': JewelleryId
        }
        AddDeleteUpadate('MissingPersonJewellery/Update_MissingPersonJewellery', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); Get_MissingPersonJewellery_Data(); setStatusFalse()
            setStatesChangeStatus(false); setErrors({ ...errors, ['DescriptionError']: '' })
        })
    }

    const Delete_MissingPerson_Jewellery = () => {
        const val = { 'MissingPersonJewelleryID': JewelleryId, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPersonJewellery/Delete_MissingPersonJewellery', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_MissingPerson_Count(DecMissPerID, loginPinID); Get_MissingPersonJewellery_Data(); setStatusFalse()
            } else console.log("Somthing Wrong");
        })
    }


    const HandleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            const val = e.target.value;
            const val1 = val.split('')
            setStatesChangeStatus(true);
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

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const set_Edit_Value = (row) => {
        if (row) {
            setStatus(true); setErrors(''); setJewelleryId(row?.MissingPersonJewelleryID);
        }
    }

    const setStatusFalse = () => {

        setJewelleryId(''); reset(); setClickedRow(null); setStatus(false); setChangesStatus(false)
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'MissingPersonID') {
                setValue({ ...value, [name]: e.value })
            } else if (name === 'JewelleryTypeID') {
                setValue({ ...value, [name]: e.value })
                setErrors({ ...errors, ['JewelleryTypeIDError']: '' })
            } else if (name === 'Description') {
                setValue({ ...value, [name]: e.value })
            }
        } else {
            setValue({ ...value, [name]: null })
        }
    }


    const columns = [
        {
            name: 'Jewellery Type', selector: (row) => row.JewelleryType_Des ? row.JewelleryType_Des : '', sortable: true
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
                            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setJewelleryId(row?.MissingPersonJewelleryID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setJewelleryId(row?.MissingPersonJewelleryID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    return (
        <>
            <fieldset className='mt-2'>
                <legend>Jewellery</legend>
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">

                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Jewellery') }}>
                                Jewellery&nbsp;Type{errors.JewelleryTypeIDError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.JewelleryTypeIDError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  mt-1">
                            <Select
                                styles={Requiredcolour}
                                name="JewelleryTypeID"
                                options={jwelleryTypeDrpData}
                                value={jwelleryTypeDrpData?.filter((obj) => obj.value === value?.JewelleryTypeID)}
                                onChange={(e) => { ChangeDropDown(e, 'JewelleryTypeID') }}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>

                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Description {errors.DescriptionError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-6  ">
                            <textarea name='Description' id="Description" maxLength={1000} cols="30" rows='2' value={value?.Description} onChange={HandleChange} className="form-control pt-2 pb-2 requiredColor" ></textarea>
                        </div>
                    </div>
                </div>
            </fieldset>
            <div className="col-12 text-right mt-2 p-0">


                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}  >New</button>
                {
                    JewelleryId && status === true ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  >Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}  >Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}  >Save</button>
                }
            </div>

            <div className="col-12 mt-2">
                <DataTable
                    dense
                    columns={columns}

                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? missingPersonJewelleryData : [] : missingPersonJewelleryData}
                    selectableRowsHighlight
                    highlightOnHover
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={(row) => { set_Edit_Value(row); setClickedRow(row); setStatesChangeStatus(false); }}
                    responsive
                    fixedHeader
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    fixedHeaderScrollHeight='300px'
                />
            </div>
            <DeletePopUpModal func={Delete_MissingPerson_Jewellery} />
            <ListModal {...{ openPage, setOpenPage }} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}
export default Jewellery;