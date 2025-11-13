import { useCallback, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useNavigate } from 'react-router-dom'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Aes256Encrypt, Decrypt_Id_Name, base64ToString, tableCustomStyles, changeArrayFormat, changeArrayFormat_WithFilter, stringToBase64, customStylesWithOutColor, Requiredcolour } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, AddDelete_Img } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import ChangesModal from '../../../../Common/ChangesModal';
import SelectBox from '../../../../Common/SelectBox';
import Select from "react-select";
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import DocumentAccess from '../DocumentAccess/DocumentAccess';
import { dropDownDataModel, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { GetData_MissingPerson } from '../../../../../redux/actions/MissingPersonAction';



const Home = ({ setStatus, DecdocumentID, setShowdocumentstatus, isCad = false, isViewEventDetails = false, isCADSearch = false, showPage, showdocumentstatus, status, isCitation = false, isMissingPerson = false, }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const missingPerData = useSelector((state) => state.MissingPerson.MissingPersonAllData);
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return { get: (param) => params.get(param) };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var documentID = query?.get("documentId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var DocSta = query?.get('DocSta');
    var MissPerID = query?.get('MissPerID');
    var MissPerSta = query?.get('MissPerSta');
    var MissVehID = query?.get('MissVehID');
    let DecEIncID = 0, DecMissPerID = 0

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!MissPerID) { DecMissPerID = 0; }
    else { DecMissPerID = parseInt(base64ToString(MissPerID)); }

    const { get_Incident_Count, setChangesStatus, changesStatus,
        nameFilterData,
        propertyData,
        VehicleFilterData,
        arrestFilterData,
        get_Data_Name,
        get_Data_Property,
        get_Data_Vehicle,
        get_Data_Arrest,
        get_MissingPerson_Count,
    } = useContext(AgencyContext);

    const [clickedRow, setClickedRow] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(0)
    const [documentdata, setDocumentdata] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [openPage, setOpenPage] = useState('');
    const [multiSelected, setMultiSelected] = useState({ optionSelected: null })
    const [selectedOption, setSelectedOption] = useState("Individual");
    const [groupList, setGroupList] = useState([])
    const [EditValue, setEditValue] = useState([])
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [DocumentID, setDocumentID] = useState('');
    const [DocumentCode, setDocumentCode] = useState('');
    const [showDocAccess, setShowDocAccess] = useState(false);
    const [permissionForAddDocument, setPermissionForAddDocument] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [nameDropdown, setNameDropdown] = useState();
    const [vehicleDropdown, setVehicleDropdown] = useState();
    const [arrestDropdown, setArrestDropdown] = useState();
    const [propertyDropdown, setPropertyDropdown] = useState();
    const [missingPerDropdown, setMissingPerDropdown] = useState();

    const DocumentTypeDropDown = [
        { value: 1, label: "Incident" },
        { value: 2, label: "Name" },
        { value: 3, label: "Property" },
        { value: 4, label: "Vehicle" },
        { value: 5, label: "Location" },
        { value: 6, label: "Arrest" },
        { value: 7, label: "Warrant" },
        { value: 8, label: "Missing Person" },
    ]
    const [value, setValue] = useState({
        'AgencyID': '', 'DocumentID': '', 'DocumentName': '', 'DocumentNotes': '', 'File': '', 'IsActive': '1', 'PermissionTypeID': '', 'DocumentTypeId': '', 'CreatedByUserFK': '', 'IncidentId': '', 'ModifiedByUserFK': '', 'DocumentAccessID': '', 'DocumentAccess': '', 'DocumentAccess_Name': '', 'SelectDocumentTypeValue': ''
    })

    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
        'DocumentAccessIDError': '', "DocumentTypeError": '', "SelectDocumentTypeValueError": ''
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); get_DocumentDropDwn(localStoreData?.AgencyID)
            setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data('I035', localStoreData?.AgencyID, localStoreData?.PINID));
            if (!isMissingPerson) {
                setDocumentID(DecdocumentID);
                get_Incident_Count(DecEIncID, localStoreData?.PINID);
                get_Documentdata(DecEIncID, localStoreData?.PINID);
            }
        }
    }, [localStoreData, isMissingPerson]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAddDocument(effectiveScreenPermission[0]?.AddOK);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (DecEIncID || loginPinID) {
            setMainIncidentID(DecEIncID); dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecEIncID))
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
            setValue({ ...value, 'IncidentId': DecEIncID });
            get_Data_Name(DecEIncID);
            get_Data_Arrest(DecEIncID, false, loginPinID);
            get_Data_Vehicle(DecEIncID)
            get_Data_Property(DecEIncID);
            dispatch(GetData_MissingPerson(DecEIncID))
        }
    }, [DecEIncID, loginPinID]);

    useEffect(() => {
        setNameDropdown(
            dropDownDataModel(nameFilterData, "NameID", "FullName")
        );
        setPropertyDropdown(
            dropDownDataModel(propertyData, "PropertyID", "PropertyNumber")
        );
        setVehicleDropdown(
            dropDownDataModel(VehicleFilterData, "VehicleID", "VehicleNumber")
        );
        setArrestDropdown(
            dropDownDataModel(arrestFilterData, "ArrestID", "Arrestee_Name")
        );
        setMissingPerDropdown(
            dropDownDataModel(missingPerData, "MissingPersonID", "MissingPersonName")
        )
    }, [nameFilterData, propertyData, VehicleFilterData, arrestFilterData, missingPerData]);

    const check_Validation_Error = (e) => {
        const DocumentNameErr = RequiredFieldIncident(value.DocumentName);
        const DocumentTypeIDErr = RequiredFieldIncident(value.PermissionTypeID);
        const DocumentTypeErr = RequiredFieldIncident(value.DocumentTypeId);
        const File_Not_SelectedErr = validate_fileupload(selectedFileName);
        const SelectDocumentTypeValue = (value.DocumentTypeId && [2, 3, 4, 6, 7].includes(value.DocumentTypeId)) ? RequiredFieldIncident(value.SelectDocumentTypeValue) : 'true';

        const DocumentAccessIDErr = DocumentCode == "RT" ? RequiredFieldIncident(value.DocumentAccessID) : 'true';
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DocFileNameError']: DocumentNameErr || prevValues['DocFileNameError'],
                ['DocumentTypeIDError']: DocumentTypeIDErr || prevValues['DocumentTypeIDError'],
                ['DocumentTypeError']: DocumentTypeErr || prevValues['DocumentTypeError'],
                ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'],
                ['DocumentAccessIDError']: DocumentAccessIDErr || prevValues['DocumentAccessIDError'],
                ['SelectDocumentTypeValueError']: SelectDocumentTypeValue || prevValues['SelectDocumentTypeValueError'],

            }
        })
    }
    const { DocFileNameError, DocumentTypeIDError, DocumentAccessIDError, File_Not_Selected, DocumentTypeError, SelectDocumentTypeValueError } = errors

    useEffect(() => {
        if (DocFileNameError === 'true' && DocumentTypeIDError === 'true' && DocumentAccessIDError === 'true' && File_Not_Selected === 'true' && DocumentTypeError === 'true' && SelectDocumentTypeValueError === 'true') { Add_Documents(); }
    }, [DocFileNameError, DocumentTypeIDError, DocumentAccessIDError, File_Not_Selected, DocumentTypeError, SelectDocumentTypeValueError])

    const changeHandler = (e) => {
        setStatesChangeStatus(true)
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) { nameArray?.push(name?.name) }
        setSelectedFileName(nameArray);
    };

    const Add_Documents = async (id) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newDoc = [];
        const EncDocs = [];
        // multiple file upload
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i]);
            EncFormdata.append("File", selectedFile[i]);
        }
        const { DocumentID, DocumentName, DocumentNotes, File, PermissionTypeID, DocumentTypeId, DocumentAccessID, DocumentAccess, PrimaryOfficerID, ReportedDtTm, SelectDocumentTypeValue } = value;
        const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
        const val = {
            'IncidentId': DecEIncID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'DocumentName': DocumentName, 'DocumentNotes': DocumentNotes, 'File': File, 'IsActive': '1', 'PermissionTypeID': PermissionTypeID, 'DocumentTypeId': DocumentTypeId, 'ModifiedByUserFK': '', 'PrimaryOfficerID': loginPinID, 'ReportedDtTm': ReportedDtTm, 'SelectDocumentTypeValue': SelectDocumentTypeValue, DocumentAccess: documentAccess, DocumentAccessID: DocumentAccessID
        };
        if (isMissingPerson) {
            val.MissingPersonID = DecMissPerID;
            val.PermissionTypeID = DocumentTypeId;
            val.DocumentTypeId = PermissionTypeID;
        } else {
            val.PermissionTypeID = PermissionTypeID;
            val.DocumentTypeId = DocumentTypeId;
        }
        const values = JSON.stringify(val);
        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
        EncDocs.push(EncPostData);
        newDoc.push(values);
        formdata.append("Data", JSON.stringify(newDoc));
        EncFormdata.append("Data", EncDocs);
        AddDelete_Img(isMissingPerson ? 'MissingPersonDocument/Insert_MisisngPersonDoc' : 'IncidentDocumentManagement/Insert_IncidentDocManagement', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); setChangesStatus(false);
                    if (isMissingPerson) {
                        get_MissingPersonDocumentdata(DecMissPerID, loginPinID);
                        get_MissingPerson_Count(DecMissPerID, loginPinID);
                    } else {
                        get_Documentdata(DecEIncID, loginPinID);
                        get_Incident_Count(mainIncidentID, loginPinID);
                    }
                    reset(); setSelectedFileName([]); setSelectedFile([]); setErrors({ ...errors, 'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '', 'DocumentTypeError': '', 'SelectDocumentTypeValueError': '' }); setStatesChangeStatus(false); setSelectedOption("Individual")
                } else {
                    console.warn("something Wrong");
                }
            }).catch(err => console.error(err));
    }

    const get_MissingPersonDocumentdata = (DecMissPerID, loginPinID) => {
        const val = { 'MissingPersonID': DecMissPerID, 'PINID': loginPinID }
        fetchPostData('MissingPersonDocument/GetData_MisisngPersonDoc', val).then((res) => {
            if (res) { setDocumentdata(res); }
            else { setDocumentdata([]); }
        })
    }

    const get_Documentdata = (IncidentID, loginPinID) => {
        const val = { 'IncidentID': IncidentID, 'PINID': loginPinID }
        fetchPostData('IncidentDocumentManagement/GetData_IncidentDocManagement', val).then((res) => {
            if (res) { setDocumentdata(res); }
            else { setDocumentdata([]); }
        })
    }

    const Add_CourtInformation = () => {
        const { ViewDate, } = value;
        const val = {
            'DocumentID': DecdocumentID, 'UserID': loginPinID, 'CreatedByUser': loginPinID, 'ViewDate': ViewDate,
        }
        AddDeleteUpadate('DocumentHistory/InsertDocumentHistory', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
        })
    }

    const columns = [
        {
            width: '120px',
            name: (
                <p className="text-end" style={{ position: 'absolute', top: 8 }}>
                    View Attachment
                </p>
            ),
            cell: row => (
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    <span
                        onClick={() => {
                            if (!isCitation) {
                                window.open(row?.FileAttachment);
                                Add_CourtInformation();
                            }
                        }}
                        className={`btn btn-sm ${isCitation ? 'bg-secondary' : 'bg-green'} text-white px-1 py-0`}
                        style={{ cursor: isCitation ? 'not-allowed' : 'pointer' }}
                    >
                        <i className="fa fa-eye" />
                    </span>
                </div>
            ),
        },
        {
            name: 'Document Name', selector: (row) => row.DocumentName, sortable: true
        },
        {
            name: 'Document Permission', selector: (row) => row.DocumentType_Description, sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => {
                const documentType = DocumentTypeDropDown.find((doc) => doc.value === row.DocumentTypeId);
                return documentType ? documentType.label : '-'; // Return label or fallback if not found
            },
            sortable: true
        },
        {
            name: 'Document Owner', selector: (row) => row.OwnerName, sortable: true
        },

        ...(isCitation ? [] : [{
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 12 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => { setDocumentID(row?.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setDocumentID(row?.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }])
    ]

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': DocumentID, 'IsActive': '0', 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate(isMissingPerson ? "MissingPersonDocument/Delete_MisisngPersonDoc" : 'IncidentDocumentManagement/Delete_IncidentDocManagement', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); reset();
                if (isMissingPerson) {
                    get_MissingPersonDocumentdata(DecMissPerID, loginPinID);
                    get_MissingPerson_Count(DecMissPerID, loginPinID);
                } else {
                    get_Documentdata(DecEIncID, loginPinID);
                    get_Incident_Count(mainIncidentID, loginPinID);
                }
            } else console.warn("Somthing Wrong");
        })
    }

    const setStatusFalse = () => {
        if (isCad) {
            navigate(`/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${false}&documentId=${('')}`)
        } else if (isMissingPerson) {
            navigate(`/Missing-Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerID}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}&documentId=${('')}`)
        } else {
            navigate(`/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${false}&documentId=${('')}`)
        }
        setClickedRow(null); setDocumentID(''); reset(); setSelectedFileName([]); setSelectedFile([]); setUpdateStatus(updateStatus + 1); setChangesStatus(false);
    }
    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const reset = () => {

        if (isCad) {
            navigate(`/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${false}&documentId=${('')}`)
        } else if (isMissingPerson) {
            navigate(`/Missing-Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerID}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}&documentId=${('')}`)
        } else {
            navigate(`/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${false}&documentId=${('')}`)

        }
        if (isMissingPerson) {
            setValue({ ...value, 'DocumentName': '', 'File': '', 'PermissionTypeID': '', 'DocumentTypeId': 8, 'DocumentNotes': '', 'SelectDocumentTypeValue': DecMissPerID })
        } else { setValue({ ...value, 'DocumentName': '', 'File': '', 'PermissionTypeID': '', 'DocumentTypeId': '', 'DocumentNotes': '', 'SelectDocumentTypeValue': "" }); }
        setShowdocumentstatus(false);
        document.querySelector("input[type='file']").value = "";
        setStatesChangeStatus(true); setDocumentID(''); setDocumentCode(''); setErrors({ ...errors, 'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIDError': '', 'DocumentAccessIDError': '', 'DocumentTypeError': '', 'SelectDocumentTypeValueError': '' }); setSelectedFileName(''); setChangesStatus(false); setMultiSelected({ optionSelected: ' ' }); setSelectedOption("Individual"); setStatus(false);
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") { reset(); }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => { document.removeEventListener("keydown", escFunction, false); };
    }, [escFunction]);

    const conditionalRowStyles = [
        {
            when: row => row.DocumentID === DocumentID, style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const setToReset = () => {
    }

    const handleRadioChange = (e) => {
        const selectedValue = e.target.id;
        setSelectedOption(selectedValue);

        if (selectedValue === "Group") {
            setMultiSelected({ optionSelected: [] });
        }
        if (selectedValue === "Individual") {
            setMultiSelected({ optionSelected: [] });
        }
    };


    useEffect(() => {
        if (loginAgencyID && value?.PermissionTypeID === 4) {
            get_Group_List(loginAgencyID);
        }
    }, [loginAgencyID, value?.PermissionTypeID]);

    useEffect(() => {
        if (isMissingPerson) {
            setValue({ ...value, 'DocumentTypeId': 8, SelectDocumentTypeValue: DecMissPerID })
            if (DecMissPerID && localStoreData) {
                get_MissingPersonDocumentdata(DecMissPerID, localStoreData?.PINID);
            }
        }
    }, [isMissingPerson, localStoreData, DecMissPerID])

    const get_Group_List = (loginAgencyID) => {
        const payload = { AgencyId: loginAgencyID }
        fetchPostData("Group/GetData_Group", payload).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) { setValue({ ...value, ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID) }) }
            }
            else { setGroupList() }
        })
    }

    const Agencychange = (multiSelected) => {
        setStatesChangeStatus(true)
        setMultiSelected({ optionSelected: multiSelected });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
            setValue({ ...value, ['DocumentAccessID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
        }
    }

    const set_Edit_Value = (row) => {
        if (row?.DocumentID) {
            setValue({
                ...value, 'DocumentName': row?.DocumentName, 'PermissionTypeID': row?.PermissionTypeID, 'DocumentTypeId': row?.DocumentTypeId, 'SelectDocumentTypeValue': row?.SelectDocumentTypeValue
            })
            if (row?.DocumentType_Description === "Restriction") {
                setShowdocumentstatus(true);
            } else {
                setShowdocumentstatus(false);
            }

            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${true}&documentId=${stringToBase64(row?.DocumentID)}`)
            } else if (isMissingPerson) {
                navigate(`/Missing-Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerID}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}&documentId=${stringToBase64(row?.DocumentID)}`)
            } else {
                navigate(`/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${true}&documentId=${stringToBase64(row?.DocumentID)}`)
            }
            setStatus(true); setStatesChangeStatus(false); setUpdateStatus(updateStatus + 1);
            setDocumentID(row?.DocumentID); GetSingleData(row?.DocumentID); setDocumentCode('');
        }
    }

    const GetSingleData = (DocumentID) => {
        const val = { 'DocumentID': DocumentID }
        fetchPostData('IncidentDocumentManagement/GetSingleData_IncidentDocManagement', val)
            .then((res) => {
                if (res) { setEditValue(res) }
                else { setEditValue() }
            })
    }


    const get_DocumentDropDwn = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            if (data) {
                setDocumentDrpVal(threeColArray(data, 'DocumentTypeID', 'Description', 'DocumentCode',));
            }
            else { setDocumentDrpVal([]) }
        })
    };
    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (name === "PermissionTypeID") {
            if (e.id === 'RT') {
                setShowDocAccess(true)
            } else {
                setShowDocAccess(false)
            }
        }
        setDocumentCode(Get_OffenseType_Code(documentDrpVal))

        if (e) {
            if (e.id === 'RT') {

                setShowdocumentstatus(true)
            }
            if (e.id !== 'RT') {
                setShowdocumentstatus(false)
            }
            setDocumentCode(e.id);

            setValue({ ...value, [name]: e.value });
        }
        else { setValue({ ...value, [name]: null }); }
    }
    const colourStylesUser = {
        control: (styles) =>
        ({
            ...styles, backgroundColor: "#fce9bf",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="col-md-12">
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Document Name{errors.DocFileNameError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocFileNameError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                        <input type="text" className={DocumentID || isCitation ? `readonlyColor` : `requiredColor`} disabled={DocumentID || isCitation} name='DocumentName' value={value.DocumentName} onChange={handleChange} required autoComplete='off' />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Document Type')
                        }} data-target="#ListModel" className='new-link'>
                            Document Permission
                            {errors.DocumentTypeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIDError}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='PermissionTypeID'
                            isDisabled={DocumentID || isCitation}
                            styles={DocumentID || isCitation ? customStylesWithOutColor : Requiredcolour}
                            value={documentDrpVal?.filter((obj) => obj.value === value?.PermissionTypeID)}
                            options={documentDrpVal}
                            onChange={(e) => ChangeDropDown(e, 'PermissionTypeID')}
                            placeholder="Select.."
                        />
                    </div>
                    <div className="col-1 col-md-1 col-lg-2 mt-3">
                        <span htmlFor="" className='label-name '>File Attachment{errors.File_Not_Selected !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                        ) : null}</span>
                    </div>
                    {clickedRow ?
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2 mb-0 d-flex">
                            <input type="file" name='File' disabled={DocumentID || isCitation} onChange={changeHandler} required style={{ display: 'none' }} />
                            <input type="text" className={DocumentID || isCitation ? `readonlyColor` : `requiredColor`} disabled={!DocumentID || isCitation} name='DocumentName' value={clickedRow?.FileName} required autoComplete='off' readOnly />
                        </div> :
                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2 mb-0">
                            <input type="file" className='requiredColor' name='File' disabled={DocumentID || isCitation} onChange={changeHandler} required />
                            {selectedFileName?.length > 0 && !isCitation &&
                                <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} onClick={() => { setSelectedFileName(''); document.querySelector("input[type='file']").value = "" }}></i>}
                        </div>
                    }
                    <div className="col-1 col-md-1 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>Document Type{errors.DocumentTypeError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  mt-2" >
                        <Select
                            name='DocumentTypeId'
                            isDisabled={DocumentID || isCitation || isMissingPerson}
                            styles={DocumentID || isCitation || isMissingPerson ? customStylesWithOutColor : Requiredcolour}
                            value={DocumentTypeDropDown?.filter((obj) => obj.value === value?.DocumentTypeId)}
                            isClearable
                            options={DocumentTypeDropDown}
                            onChange={(e) => ChangeDropDown(e, 'DocumentTypeId')}
                            placeholder="Select.."
                        />

                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                        <Select
                            name="SelectDocumentTypeValue"
                            isDisabled={DocumentID || isCitation || ![2, 3, 4, 6, 7, 8].includes(value?.DocumentTypeId)} // Disable if 
                            styles={DocumentID || isCitation || ![2, 3, 4, 6, 7, 8].includes(value?.DocumentTypeId) ? customStylesWithOutColor : Requiredcolour}
                            value={
                                (value?.DocumentTypeId === 2 ? nameDropdown :
                                    value?.DocumentTypeId === 3 ? propertyDropdown :
                                        value?.DocumentTypeId === 4 ? vehicleDropdown :
                                            value?.DocumentTypeId === 6 ? arrestDropdown :
                                                value?.DocumentTypeId === 7 ? nameDropdown :
                                                    value?.DocumentTypeId === 8 ? missingPerDropdown : [])
                                    ?.find((obj) => obj.value === value?.SelectDocumentTypeValue) ?? null
                            }
                            isClearable
                            options={
                                value?.DocumentTypeId === 2 ? nameDropdown :
                                    value?.DocumentTypeId === 3 ? propertyDropdown :
                                        value?.DocumentTypeId === 4 ? vehicleDropdown :
                                            value?.DocumentTypeId === 6 ? arrestDropdown :
                                                value?.DocumentTypeId === 7 ? nameDropdown :
                                                    value?.DocumentTypeId === 8 ? missingPerDropdown : []
                            }
                            onChange={(e) => ChangeDropDown(e, "SelectDocumentTypeValue")}
                            placeholder="Select.."
                        />

                        {/* Error Message */}
                        {errors.SelectDocumentTypeValueError !== "true" && errors.SelectDocumentTypeValueError && (
                            <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px" }}>
                                {errors.SelectDocumentTypeValueError}
                            </p>
                        )}
                    </div>

                </div>
                {
                    (DocumentCode == "RT" || showDocAccess) && !isCitation && (
                        <div className="row mt-3">
                            <div className="col-12 col-md-12 col-lg-12">
                                <fieldset>
                                    <legend>Document Access</legend>
                                    <div className="row">
                                        <div className="col-1 col-md-1 col-lg-1 mt-2 pt-1"></div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    disabled={DocumentID || isCitation}
                                                    id="Individual"
                                                    checked={selectedOption === "Individual"}
                                                    onChange={handleRadioChange}
                                                />
                                                <label className="form-check-label" htmlFor="Individual">
                                                    Individual
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    disabled={DocumentID || isCitation}
                                                    name="flexRadioDefault"
                                                    id="Group"
                                                    checked={selectedOption === "Group"}
                                                    onChange={handleRadioChange}
                                                />
                                                <label className="form-check-label" htmlFor="Group">
                                                    Group
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            {selectedOption === "Individual" ? (
                                <>
                                    <div className="col-2 col-md-2 col-lg-2 mt-3 pt-1">

                                        <span htmlFor="" className='label-name '>User Name{errors.DocumentAccessIDError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentAccessIDError}</p>
                                        ) : null}</span>
                                    </div>
                                    <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                                        <SelectBox
                                            className="custom-multiselect"
                                            classNamePrefix="custom"
                                            options={agencyOfficerDrpData.filter(item => String(item.value) !== String(loginPinID))}
                                            isMulti
                                            styles={colourStylesUser}
                                            isDisabled={DocumentID || isCitation}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            onChange={Agencychange}
                                            allowSelectAll={true}
                                            value={multiSelected.optionSelected}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-2 col-md-2 col-lg-2 mt-3 pt-1">

                                        <span htmlFor="" className='label-name '> Group{errors.DocumentAccessIDError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentAccessIDError}</p>
                                        ) : null}</span>
                                    </div>
                                    <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                                        <SelectBox
                                            className="custom-multiselect"
                                            classNamePrefix="custom"
                                            options={groupList}
                                            isMulti
                                            styles={colourStylesUser}
                                            isDisabled={DocumentID || isCitation}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            onChange={Agencychange}
                                            allowSelectAll={true}
                                            value={multiSelected.optionSelected}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}


                {clickedRow?.PINID == loginPinID && (showdocumentstatus && status && !changesStatus) && !isCitation && (
                    <>
                        <DocumentAccess
                            {...{
                                DecdocumentID,
                                isCad,
                                isViewEventDetails,
                                isCADSearch,
                                showPage,
                                showdocumentstatus
                            }}
                        />
                    </>

                )}

                {!isCitation && (
                    <div className="btn-box text-right mr-1 mb-2 mt-2">
                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setShowDocAccess(false); setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                        {permissionForAddDocument ? <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus}>Save</button> : <></>}
                    </div>
                )}
                <DataTable
                    dense
                    columns={columns}
                    pagination
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : [] : documentdata}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    fixedHeader
                    onRowClicked={isCitation ? null : (row) => { setStatusFalse(); setShowDocAccess(false); setClickedRow(row); set_Edit_Value(row); }}
                    persistTableHead={true}
                    fixedHeaderScrollHeight='300px'
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    conditionalRowStyles={conditionalRowStyles}
                />
            </div>
            <DeletePopUpModal func={DeleteDocumentManagement} />
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
            <ListModal {...{ openPage, setOpenPage }} />
            {/* <IdentifyFieldColor /> */}
        </>
    )
}

export default Home

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Required *';
    }

}

const Get_OffenseType_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.DocumentTypeId))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2?.filter(function (element) {
        return element !== undefined;
    });
    return val ? val[0]?.id : null;
}