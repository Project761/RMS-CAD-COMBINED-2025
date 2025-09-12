import React, { useContext, useState, useEffect } from 'react'
import Select from "react-select";
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../img/uploadImage.png'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Aes256Encrypt, Requiredcolour, tableCustomStyles } from '../../../Common/Utility';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../hooks/Api';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import { get_AgencyOfficer_Data } from '../../../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import ImageModel from '../../ImageModel/ImageModel';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import ChangesModal from '../../../Common/ChangesModal';
import MasterChangesModal from '../MasterChangeModel';

const MasterSmt = (props) => {

    const { possessionID, mstPossessionID, complainNameID , type , ownerOfID, loginAgencyID, loginPinID } = props
    const dispatch = useDispatch();
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const { get_Name_Count, setChangesStatus ,get_MasterName_Count } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');
    const [clickedRow, setClickedRow] = useState(null);

    const [smtData, setSmtData] = useState();
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [smtId, setSmtId] = useState();
    const [smtLocation, setSmtLocation] = useState([]);
    const [smtType, setSmtType] = useState([]);
    const [editval, setEditval] = useState();
    const [modalStatus, setModalStatus] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    //---------------------Images------------------------------------------------
    const [arrestMultiImg, setArrestMultiImg] = useState([]);
    const [imageID, setImageID] = useState();

    const [imgData, setImgData] = useState({
        "PictureTypeID": '',
        "ImageViewID": '',
        "ImgDtTm": '',
        "OfficerID": '',
        "Comments": '',
        "DocumentID": ''
    })


    useEffect(() => {
        if (possessionID || ownerOfID || complainNameID) {
            setValue(pre => {
                return {
                    ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'AgencyID': loginAgencyID
                }
            });
        }

    }, [possessionID, mstPossessionID, ownerOfID, loginPinID]);

    const [value, setValue] = useState({
        'SMTID': '',
        'SMTTypeID': null,
        'SMTLocationID': null,
        'SMT_Description': '',
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
        'AgencyID': '',
    })

    const [errors, setErrors] = useState({
        'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID } });
        get_Smt_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
    }, [possessionID, mstPossessionID, ownerOfID]);

    useEffect(() => {
        if (clickedRow?.SMTID && status) {
            GetSingleData(clickedRow?.SMTID)
        }
    }, [clickedRow])

    // function to get single data for update
    const GetSingleData = (id) => {
        const val = { 'SMTID': smtId ? smtId : id }
        fetchPostData('NameSMT/GetSingleData_NameSMT', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (smtId) {
            setValue({
                ...value,
                'SMTID': smtId,
                'SMTTypeID': editval[0]?.SMTTypeID,
                'SMTLocationID': editval[0]?.SMTLocationID,
                'SMT_Description': editval[0]?.SMT_Description,
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
    }

    // Check All Field Format is True Then Submit 
    const { SMTTypeIDErrors, SMTLocationIDErrors } = errors

    useEffect(() => {
        if (SMTTypeIDErrors === 'true' && SMTLocationIDErrors === 'true') {
            if (smtId) updateSmt()
            else Add_Type()
        }
    }, [SMTTypeIDErrors, SMTLocationIDErrors,])

    const reset = () => {
        setValue({
            ...value,
            'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
        });
        setErrors({
            ...errors,
            'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '',
        });
        setStatesChangeStatus(false);
        setArrestMultiImg([]); setSmtId(''); setChangesStatus(false)
    }

    useEffect(() => {
        get_SMTTypeID(loginAgencyID);
        if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));

    }, [loginAgencyID])

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
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e) {
            if (name === 'SMTTypeID') {
                get_SMTLocationID(e.value)
                setValue({ ...value, ['SMTTypeID']: e.value, ['SMTLocationID']: '' })
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'SMTTypeID') {
                setValue({ ...value, ['SMTLocationID']: '', ['SMTTypeID']: '' });
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
        setStatesChangeStatus(true);
        setChangesStatus(true)
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    // function to insert smt data
    const Add_Type = (e) => {

        const result = smtData?.find(item => {
            if (item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID) {
                return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
            } else return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
        });

        const { SMTID, SMTTypeID, SMTLocationID, SMT_Description, AgencyID } = value
        const val = {
            'SMTID': SMTID, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SMT_Description': SMT_Description, 'AgencyID': AgencyID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID , 'CreatedByUserFK': loginPinID,
        }

        if(result){
            toastifyError('SMT Type And Location Already Exists')
            setErrors({ ...errors, ['SMTTypeIDErrors']: '' })
        }
        else{
            AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameSMT/Insert_MainMasterNameSMT' : 'NameSMT/Insert_NameSMT', val)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_Smt_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
                    get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                    setStatesChangeStatus(false);
                    if (uploadImgFiles?.length > 0) {
                        upload_Image_File(res?.SMTID);
                        setuploadImgFiles('');
                    }
                    setArrestMultiImg('');
                    reset();
                    setErrors({ ...errors, "SMTTypeIDErrors": '', })
                }
                setArrestMultiImg('');
                reset();
                setErrors({ ...errors, "SMTTypeIDErrors": '', })
                setChangesStatus(false)
            })
        }
      
    }

    // function to update name smt data
    const updateSmt = () => {
        const result = smtData?.find(item => {

            if (item?.SMTID != value['SMTID']) {
                if (item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID) {
                    return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
                } else return item.SMTTypeID === value.SMTTypeID && item.SMTLocationID === value.SMTLocationID
            }
        });
       
        const { SMTID, SMTTypeID, SMTLocationID, SMT_Description, AgencyID } = value
        const val = {
            'SMTID': SMTID, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SMT_Description': SMT_Description, 'AgencyID': AgencyID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'ModifiedByUserFK': loginPinID,
        }

        if (result && value?.SMTTypeID !== 39) {
            toastifyError('SMT Type And Location Already Exists')
            setErrors({ ...errors, ['SMTTypeIDErrors']: '' })
        } 
        else{
            AddDeleteUpadate('NameSMT/Update_NameSMT', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Smt_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID);
                setErrors({ ...errors, 'SMTTypeIDErrors': '', });
                setStatesChangeStatus(false);
                if (uploadImgFiles?.length > 0) {
                    upload_Image_File();
                    setuploadImgFiles('');
                }
                setArrestMultiImg('');
                reset();
                setStatus(false);
                setChangesStatus(false)
            })
        }
       
    }

    // function to get images of smt
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
                toastifySuccess(res.Message);
              
                setStatesChangeStatus(true);
            }
            else {
                toastifyError(res?.Message);
            }
        })
        
    }

    // function to upload image files for smt data
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
            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
            EncDocs.push(EncPostData);
            newData.push(values);

            formdata.append("file", file)
            EncFormdata.append("file", file)
        }
        formdata.append("Data", JSON.stringify(newData));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img('NameSMT/InsertNameSMT_Photo', formdata, EncFormdata).then((res) => {
            if (res.success) {
             
                setuploadImgFiles('')
                setStatesChangeStatus(true);

            }
        }).catch(err => console.log(err))
    }

    // function to delete smt image file
    const delete_Image_File = (e) => {
        e?.preventDefault()
        const value = {
            'ID': imageID,
            'DeletedByUserFK': loginPinID
        }
        AddDeleteUpadate('NameSMT/Delete_NameSMTPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data?.Message);
                get_Arrest_MultiImage(smtId)
                setModalStatus(false);
                setImageID('');
            } else {
                toastifyError(data?.Message);
            }
        });
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

    // function to get name smt data
    const get_Smt_Data = (DecNameID, DecMasterNameID) => {
        const val = {
            'NameID': DecNameID,
        }
        const req = {
            'MasterNameID': DecMasterNameID,
        }
        fetchPostData(MstPage === 'mastername' ? 'MainMasterNameSMT/GetData_MainMasterNameSMT' : 'NameSMT/GetData_NameSMT', MstPage === 'mastername' ? req : val).then((res) => {
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

                    <span onClick={() => { setSmtId(row.SMTID); setDeleteModal(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-trash"></i>
                    </span>

                </div>

        }
    ]

    const set_Edit_Value = (row) => {
        reset();
        setStatus(true);
        GetSingleData(row?.SMTID);
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setSmtId(row.SMTID);
        setuploadImgFiles('')
    }

    // function to delete name smt data
    const DeleteCourtDisposition = () => {
        const val = {
            'SMTID': smtId,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameSMT/Delete_NameSMT', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setDeleteModal(false)
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                get_Smt_Data(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, mstPossessionID); setSmtId('');
                reset();
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); reset();
        setStatus(false); setSmtId();
        setUpdateStatus(updateStatus + 1);
        setStatesChangeStatus(false);
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


    return (
        <>
            <div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-10">
                            <div className="row">
                                <div className="col-3 col-md-3 col-lg-2 mt-3">
                                    <span data-toggle="modal" className='new-link' onClick={() => {
                                        setOpenPage('SMT Type')
                                    }} data-target="#ListModel">
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
                                    <label htmlFor="" className='label-name '>Description</label>
                                </div>
                                <div className="col-9 col-md-9 col-lg-10 text-field mt-2" >
                                    <textarea name="SMT_Description" onChange={handleChange} className='' id="SMT_Description" value={value.SMT_Description} cols="30" rows="4" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="col-5 col-md-4 col-lg-2 pt-2">
                            <div className="img-box" >
                                <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                    {
                                        arrestMultiImg.length > 0 ?
                                            arrestMultiImg?.map((item) => (
                                                <div key={item?.PhotoID ? item?.PhotoID : item?.imgID} onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel">
                                                    <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '105px' }} />
                                                </div>
                                            ))
                                            :
                                            <div onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel">
                                                <img src={defualtImage} style={{ height: '150px' }} />
                                            </div>
                                    }
                                </Carousel>
                            </div>
                        </div>
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
                                        <button type="button" onClick={() => { DeleteCourtDisposition(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { setDeleteModal(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="btn-box text-right  mr-1 mb-2 mt-5">

                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                    {
                        smtId && status ?
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
                            :
                            <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                    }
                </div>
            </div>
            <DataTable
                dense
                columns={columns}
                data={smtData}
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
                fixedHeaderScrollHeight='80px'
                conditionalRowStyles={conditionalRowStyles}
                paginationPerPage={'10'}
                paginationRowsPerPageOptions={[10, 15, 20, 50]}
            />
            <ListModal {...{ openPage, setOpenPage }} />
            <ImageModel multiImage={arrestMultiImg} setStatesChangeStatus={setStatesChangeStatus} pinID={loginPinID} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setArrestMultiImg} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageID} setImageId={setImageID} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_SMT_MultiImage} agencyID={loginAgencyID} />
            <MasterChangesModal func={check_Validation_Error} />
        </>
    )
}

export default MasterSmt