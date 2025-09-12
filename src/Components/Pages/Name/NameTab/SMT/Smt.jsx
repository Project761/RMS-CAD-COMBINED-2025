import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDelete_Img, AddDeleteUpadate } from '../../../../hooks/Api';
import { Aes256Encrypt, Decrypt_Id_Name, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Carousel } from 'react-responsive-carousel';
import Select from "react-select";
import { RequiredFieldIncident, Space_Not_AllowSmt } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import defualtImage from '../../../../../img/uploadImage.png'
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import ImageModel from '../../../ImageModel/ImageModel';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Smt = (props) => {

    const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N050", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    const { get_Name_Count, localStoreArray, get_LocalStorage, setChangesStatus } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');
    const [clickedRow, setClickedRow] = useState(null);

    const [smtData, setSmtData] = useState();
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [smtId, setSmtId] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [smtLocation, setSmtLocation] = useState([]);
    const [smtType, setSmtType] = useState([]);
    const [editval, setEditval] = useState();
    const [modalStatus, setModalStatus] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    //---------------------Images------------------------------------------------
    const [arrestMultiImg, setArrestMultiImg] = useState([]);
    const [imageID, setImageID] = useState();

    const [value, setValue] = useState({
        'SMTID': '',
        'SMTTypeID': null,
        'SMTLocationID': null,
        'SMT_Description': '',
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
        'AgencyID': '',
        'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
    })


    const [imgData, setImgData] = useState({
        "PictureTypeID": '',
        "ImageViewID": '',
        "ImgDtTm": '',
        "OfficerID": '',
        "Comments": '',
        "DocumentID": ''
    })
    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", MasterNameID: '', NameID: '', Agency_Name: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);


    useEffect(() => {
        if (DecNameID || DecMasterNameID) {
            setValue(pre => {
                return {
                    ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID, 'AgencyID': loginAgencyID
                }
            });
        }

    }, [DecNameID, DecMasterNameID, loginPinID]);

    const [errors, setErrors] = useState({
        'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
    })

    useEffect(() => {
        if (DecNameID || DecMasterNameID)
            setValue(pre => { return { ...pre, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
        get_Smt_Data(DecNameID, DecMasterNameID);
    }, [DecNameID, DecMasterNameID]);

    useEffect(() => {
        if (smtId) { setSmtId(smtId); }
    }, [smtId]);

    const GetSingleData = (smtId) => {
        const val = { 'SMTID': smtId }
        fetchPostData('NameSMT/GetSingleData_NameSMT', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval() }
            })
    }

    useEffect(() => {
        if (smtId) {
            setValue({
                ...value,
                'SMTID': smtId,
                'SMTTypeID': editval[0]?.SMTTypeID,
                'SMTLocationID': editval[0]?.SMTLocationID,
                'SMT_Description': editval[0]?.SMT_Description?.trim(),
                'ModifiedByUserFK': loginPinID,
            })
            get_Arrest_MultiImage(smtId)
            get_SMTLocationID(editval[0]?.SMTTypeID)
        }
        else {
            setValue({
                ...value,
                'SMTTypeID': null, 'SMTLocationID': null, 'SMT_Description': null,
            })
        }
    }, [editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.SMTLocationID)) {
            setErrors(prevValues => { return { ...prevValues, ['SMTLocationIDErrors']: value?.SMTTypeID === 39 ? 'true' : RequiredFieldIncident(value.SMTLocationID) } })
        }
        if (RequiredFieldIncident(value.SMTTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['SMTTypeIDErrors']: RequiredFieldIncident(value.SMTTypeID) } })
        }
        if (Space_Not_AllowSmt(value.SMT_Description)) {
            setErrors(prevValues => { return { ...prevValues, ['SMT_DescriptionErrors']: Space_Not_AllowSmt(value.SMT_Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors } = errors

    useEffect(() => {
        if (SMTTypeIDErrors === 'true' && SMTLocationIDErrors === 'true' && SMT_DescriptionErrors === 'true') {
            if (smtId) updateSmt()
            else Add_Type()
        }
    }, [SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors])

    const reset = () => {
        setValue({
            ...value,
            'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
        });
        setErrors({
            ...errors,
            'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': ''
        });
        setArrestMultiImg([]); setSmtId(''); get_SMTLocationID(''); setStatesChangeStatus(false); setuploadImgFiles('');
    }

    useEffect(() => {
        if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));
        if (openPage || loginAgencyID) {
            get_SMTTypeID(loginAgencyID);
        }
    }, [openPage, loginAgencyID])

    const get_SMTLocationID = (id) => {
        const val = {
            AgencyID: loginAgencyID,
            SMTTypeID: id
        }
        fetchPostData('SMTLocations/GetDataDropDown_SMTLocations', val).then((data) => {
            if (data) {
                setSmtLocation(Comman_changeArrayFormat(data, 'SMTLocationID', 'Description'))
            } else {
                setSmtLocation([]);
            }
        })
    }

    const get_SMTTypeID = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
            if (data) {
                setSmtType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
            } else {
                setSmtType([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        if (e) {
            if (name === 'SMTTypeID') {
                get_SMTLocationID(e.value)
                setValue({ ...value, ['SMTTypeID']: e.value, ['SMTLocationID']: '' })
                !addUpdatePermission && setChangesStatus(true)
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
                !addUpdatePermission && setChangesStatus(true)
            }
        } else {
            if (name === 'SMTTypeID') {
                setValue({ ...value, ['SMTLocationID']: '', ['SMTTypeID']: '' });
                !addUpdatePermission && setChangesStatus(true)
                setSmtLocation([]);
                return;
            }
            setValue({
                ...value,
                [name]: null
            })

        }
    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true)
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
        !addUpdatePermission && setChangesStatus(true)
    }

    const handleKeyDown = (e) => {
        const cursorPosition = e.target.selectionStart;
        if (e.key === " " && cursorPosition === 0) {
            e.preventDefault();
        }
        if (e.key === "Enter" && cursorPosition === 0) {
            e.preventDefault();
        }
    };



    const Add_Type = (e) => {
        const result = smtData?.find(item => {
            if (item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID) {
                return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
            } else return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
        });
        if (result) {

            toastifyError('SMT Type And Location Already Exists')
            setErrors({ ...errors, ['SMTTypeIDErrors']: '' })
        } else {
            AddDeleteUpadate('NameSMT/Insert_NameSMT', value)
                .then((res) => {
                    setChangesStatus(false);
                    toastifySuccess(res.Message);
                    get_Smt_Data(DecNameID, DecMasterNameID);
                    get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                    setStatesChangeStatus(false)
                    if (uploadImgFiles?.length > 0) {
                        upload_Image_File(res?.SMTID);
                        setuploadImgFiles('');
                    }
                    setArrestMultiImg('');
                    reset();
                    setErrors({ ...errors, "SMTTypeIDErrors": '', })
                })
        }
    }

    const updateSmt = () => {
        const result = smtData?.find(item => {

            if (item?.SMTID != value['SMTID']) {
                if (item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID) {
                    return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
                } else return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
            }
        });
        if (result && value?.SMTTypeID !== 39) {
            toastifyError('SMT Type And Location Already Exists')
            setErrors({ ...errors, ['SMTTypeIDErrors']: '' })
        }
        else {
            AddDeleteUpadate('NameSMT/Update_NameSMT', value).then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                }

                setChangesStatus(false);
                get_Smt_Data(DecNameID, DecMasterNameID);
                setStatesChangeStatus(false);
                setErrors({ ...errors, 'SMTTypeIDErrors': '', });
                if (uploadImgFiles?.length > 0) {
                    upload_Image_File();
                    setuploadImgFiles('');
                }
                setArrestMultiImg('');
                reset();
                setStatus(false);
            })
        }
    }



    //---------------------------------------- Image ------------------------------------------------
    const get_Arrest_MultiImage = (smtId) => {
        fetchPostData('NameSMT/GetData_NameSMTPhoto', { 'SMTID': smtId })
            .then((res) => {
                if (res) {
                    setArrestMultiImg(res);
                }
                else { setArrestMultiImg(); }
            })
    }

    // to update image data
    const update_SMT_MultiImage = () => {
        const val = { "ModifiedByUserFK": loginPinID, "AgencyID": loginAgencyID, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                !addUpdatePermission && setStatesChangeStatus(true)

            }
            else {
                toastifyError(res?.Message);
            }
        })

    }


    const upload_Image_File = async (smtID) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newData = [];
        const EncDocs = [];
        for (let i = 0; i < uploadImgFiles.length; i++) {
            const { file, imgData } = uploadImgFiles[i];
            const val = {
                'SMTID': smtId ? smtId : smtID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'PictureTypeID': imgData?.PictureTypeID,
                'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID, 'Comments': imgData?.Comments
            }

            const values = JSON.stringify(val);
            newData.push(values);

            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
            EncDocs.push(EncPostData);

            formdata.append("file", file);
            EncFormdata.append("file", file);
        }

        formdata.append("Data", JSON.stringify(newData));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img('NameSMT/InsertNameSMT_Photo', formdata, EncFormdata).then((res) => {
            if (res.success) {

                setuploadImgFiles('')
                !addUpdatePermission && setStatesChangeStatus(true)
            }
        }).catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e?.preventDefault()
        const value = {
            'ID': imageID,
            'DeletedByUserFK': loginPinID
        }
        AddDeleteUpadate('NameSMT/Delete_NameSMTPhoto', value).then((data) => {
            if (data.success) {

                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Arrest_MultiImage(smtId)
                setModalStatus(false);
                setImageID('');
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    const notReqStyle = {
        control: (styles) => ({
            ...styles, backgroundColor: "",
            height: 20,
            minHeight: 35,
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

    const get_Smt_Data = (DecNameID, DecMasterNameID) => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }

        fetchPostData('NameSMT/GetData_NameSMT', MstPage ? val2 : val).then((res) => {
            if (res) {
                setSmtData(res)
            } else {
                setSmtData([]);
            }
        })
    }

    const columns = [
        {
            name: 'SMT Type',
            selector: (row) => row?.SMTType_Description,
            sortable: true
        },
        {
            name: 'SMT Location',
            selector: (row) => row?.SMTLocation_Description,
            sortable: true
        },
        {
            name: 'Description',

            selector: (row) => row?.SMT_Description || '',
            format: (row) => (
                <>{row?.SMT_Description ? row?.SMT_Description.substring(0, 70) : ''}{row?.SMT_Description?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>



                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setSmtId(row.SMTID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={() => { setSmtId(row.SMTID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>

        }
    ]

    const set_Edit_Value = (row) => {
        reset(); setStatus(true);
        setUpdateStatus(updateStatus + 1);
        setSmtId(row.SMTID); GetSingleData(row.SMTID)
        setuploadImgFiles('')
    }

    const DeleteCourtDisposition = () => {
        const val = { 'SMTID': smtId, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameSMT/Delete_NameSMT', val).then((res) => {
            if (res) {

                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);

                get_Smt_Data(DecNameID, DecMasterNameID); setSmtId('');
                reset();
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); reset();
        setStatus(false); setSmtId();
        setStatesChangeStatus(false);
    }

    return (
        <>
            <NameListing  {...{ ListData }} />
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-10">
                        <div className="row">
                            <div className="col-3 col-md-3 col-lg-2 mt-3">

                                <span data-toggle="modal" onClick={() => {
                                    setOpenPage('SMT Type')
                                }} data-target="#ListModel" className='new-link'>
                                    SMT Type{errors.SMTTypeIDErrors !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTTypeIDErrors}</p>
                                    ) : null}
                                </span>
                                <label htmlFor="" className='label-name '></label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-4  mt-2" >
                                <Select
                                    name='SMTTypeID'
                                    styles={Requiredcolour}
                                    value={smtType?.filter((obj) => obj.value === value?.SMTTypeID)}
                                    isClearable
                                    options={smtType}
                                    onChange={(e) => ChangeDropDown(e, 'SMTTypeID')}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-3">

                                <span data-toggle="modal" onClick={() => {
                                    setOpenPage('SMT Location')
                                }} data-target="#ListModel" className='new-link'>
                                    SMT Location {errors.SMTLocationIDErrors !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTLocationIDErrors}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-3 col-md-3 col-lg-4  mt-2" >
                                <Select
                                    name='SMTLocationID'
                                    styles={value?.SMTTypeID === 39 ? notReqStyle : Requiredcolour}
                                    value={smtLocation?.filter((obj) => obj.value === value?.SMTLocationID)}
                                    isClearable
                                    options={smtLocation}
                                    onChange={(e) => ChangeDropDown(e, 'SMTLocationID')}
                                    placeholder="Select..."
                                    isDisabled={!value?.SMTTypeID || value.SMTTypeID === 39}

                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-3">
                                <label htmlFor="" className='label-name '>Description{errors.SMT_DescriptionErrors !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMT_DescriptionErrors}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-9 col-md-9 col-lg-10 text-field mt-2" >
                                <textarea name="SMT_Description" className='' onKeyDown={handleKeyDown} onChange={handleChange} id="SMT_Description" value={value.SMT_Description} cols="30" rows="4" required style={{ resize: 'none' }}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 col-md-4 col-lg-2 pt-2">
                        <div className="img-box" >
                            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    arrestMultiImg.length > 0 ?
                                        arrestMultiImg?.map((item) => (
                                            <div key={item?.PhotoID ? item?.PhotoID : item?.imgID} onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel" className='model-img'>
                                                <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '180px' }} />
                                            </div>
                                        ))
                                        :
                                        <div onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel">
                                            <img src={defualtImage} />
                                        </div>
                                }
                            </Carousel>
                        </div>
                    </div>
                </div>
            </div>
            {!isViewEventDetails &&
                <div className="btn-box text-right  mr-1 mb-2 mt-2">

                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); }}>New</button>


                    {
                        smtId && status ?
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                            :
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                    }


                </div>
            }
            {
                modalStatus &&
                <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="box text-center py-5">
                                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={delete_Image_File} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                    <button type="button" onClick={() => { setModalStatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className='modal-table'>
                <DataTable
                    dense
                    columns={columns}

                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? smtData : [] : smtData}
                    pagination
                    highlightOnHover

                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        set_Edit_Value(row);
                    }}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='120px'
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 20, 500]}
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteCourtDisposition} />
            {/* <IdentifyFieldColor /> */}
            <ListModal {...{ openPage, setOpenPage }} />
            <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
            <ImageModel multiImage={arrestMultiImg} setStatesChangeStatus={setStatesChangeStatus} pinID={loginPinID} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setArrestMultiImg} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageID} setImageId={setImageID} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_SMT_MultiImage} agencyID={loginAgencyID} />

        </>
    )
}

export default Smt