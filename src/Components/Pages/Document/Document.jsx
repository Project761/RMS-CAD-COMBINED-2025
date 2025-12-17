import React, { useCallback, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom'
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import { Aes256Encrypt, Decrypt_Id_Name, base64ToString, tableCustomStyles, getShowingDateText,  filterPassedTimeZonesProperty } from '../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, AddDelete_Img } from '../../hooks/Api';
import { AgencyContext } from '../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../Common/ChangeArrayFormat';
import Tab from '../../Utility/Tab/Tab';
import IdentifyFieldColor from '../../Common/IdentifyFieldColor';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../redux/actions/Agency';
import NameListing from '../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import ChangesModal from '../../Common/ChangesModal';
import ListModal from '../Utility/ListManagementModel/ListModal';
import DatePicker from "react-datepicker";
import SelectBox from '../../Common/SelectBox';
import Select, { components } from "react-select";
import { get_AgencyOfficer_Data } from '../../../redux/actions/DropDownsData';

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const Document = () => {
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return { get: (param) => params.get(param) };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const { get_Incident_Count, setChangesStatus, datezone } = useContext(AgencyContext);
    const [clickedRow, setClickedRow] = useState(null);
    const [DocumentID, setDocumentID] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [documentdata, setDocumentdata] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [openPage, setOpenPage] = useState('');
    const [selectedOption, setSelectedOption] = useState("Individual");

    const [value, setValue] = useState({
        'AgencyID': '', 'DocumentID': '', 'DocumentName': '', 'DocumentNotes': '', 'File': '', 'IsActive': '1', 'DocumentTypeID': '', 'CreatedByUserFK': '', 'IncidentId': '', 'ModifiedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(parseInt(localStoreData?.PINID)); get_DocumentDropDwn(localStoreData?.AgencyID)
            dispatch(get_ScreenPermissions_Data('I035', localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            get_Documentdata(IncID); setMainIncidentID(IncID); dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
            setValue({ ...value, 'IncidentId': IncID })
        }
    }, [IncID]);

    const check_Validation_Error = (e) => {
        const DocumentNameErr = RequiredFieldIncident(value.DocumentName);
        const DocumentTypeIDErr = RequiredFieldIncident(value.DocumentTypeID);
        const File_Not_SelectedErr = validate_fileupload(selectedFileName);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DocFileNameError']: DocumentNameErr || prevValues['DocFileNameError'],
                ['DocumentTypeIDError']: DocumentTypeIDErr || prevValues['DocumentTypeIDError'],
                ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'],
            }
        })
    }
    const { DocFileNameError, DocumentTypeIDError, File_Not_Selected } = errors

    useEffect(() => {
        if (DocFileNameError === 'true' && DocumentTypeIDError === 'true' && File_Not_Selected === 'true') {
            Add_Documents();
        }
    }, [DocFileNameError, DocumentTypeIDError, File_Not_Selected])

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) { nameArray?.push(name?.name) }
        setSelectedFileName(nameArray);
    };

    const get_DocumentDropDwn = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            if (data) { setDocumentDrpVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description')); }
            else { setDocumentDrpVal([]) }
        })
    };

    const Add_Documents = async (id) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newDoc = []; const EncDocs = [];
        // multiple file upload <----
        for (let i = 0; i < selectedFile.length; i++) { formdata.append("File", selectedFile[i]); EncFormdata.append("File", selectedFile[i]) }
        const { DocumentID, DocumentName, DocumentNotes, File, DocumentTypeID } = value
        const val = {
            'IncidentId': IncID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'DocumentID': DocumentID, 'DocumentName': DocumentName, 'DocumentNotes': DocumentNotes, 'File': File, 'IsActive': '1', 'DocumentTypeID': DocumentTypeID, 'ModifiedByUserFK': '',
        }
        const values = JSON.stringify(val); const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
        EncDocs.push(EncPostData); newDoc.push(values); formdata.append("Data", JSON.stringify(newDoc)); EncFormdata.append("Data", EncDocs);
        AddDelete_Img('IncidentDocumentManagement/Insert_IncidentDocManagement', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_Documentdata(mainIncidentID); setChangesStatus(false);
                    get_Incident_Count(mainIncidentID); reset(); setSelectedFileName([]); setSelectedFile([])
                    setErrors({ ...errors, 'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '', })
                }
                else { console.log("something Wrong"); }
            }).catch(err => console.log(err))
    }

    const get_Documentdata = (mainIncidentID) => {
        const val = { 'IncidentId': mainIncidentID }
        fetchPostData('IncidentDocumentManagement/GetData_IncidentDocManagement', val).then((res) => {
            if (res) { setDocumentdata(res); }
            else { setDocumentdata([]); }
        })
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    <span onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                        <i className="fa fa-eye"></i>
                    </span>
                </div>
        },
        {
            name: 'Document Name', selector: (row) => row.DocumentName, sortable: true
        },
        {
            name: 'Notes', selector: (row) => row.DocumentNotes, format: (row) => (<>{row?.DocumentNotes ? row?.DocumentNotes.substring(0, 70) : ''}{row?.DocumentNotes?.length > 40 ? '  . . .' : null} </>), sortable: true
        },
        {
            name: 'Document Type', selector: (row) => row.DocumentType_Description, sortable: true
        },

        {
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
        }
    ]

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': DocumentID, 'IsActive': '0', 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('IncidentDocumentManagement/Delete_IncidentDocManagement', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); reset(); get_Incident_Count(mainIncidentID); get_Documentdata(mainIncidentID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = () => {
        setClickedRow(null); reset(); setSelectedFileName([]); setSelectedFile([]); setUpdateStatus(updateStatus + 1); setChangesStatus(false);
    }

    const handleChange = (e) => {
        setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.value })
    }

    const ChangeDropDown = (e, name) => {
        setChangesStatus(true);
        if (e) { setValue({ ...value, [name]: e.value }) }
        else { setValue({ ...value, [name]: null }) }
    }

    const reset = () => {
        setValue({ ...value, 'DocumentName': '', 'File': '', 'DocumentTypeID': '', 'DocumentNotes': '', 'PrimaryOfficerID': '' });
        document.querySelector("input[type='file']").value = "";
        setErrors({ ...errors, 'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIDError': '', }); setSelectedFileName(''); setChangesStatus(false);
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
            when: row => row === clickedRow, style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    // Custom Style
    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: "#fce9bf", height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0, }),
    };

    const setToReset = () => {
    }

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.target.id === 'ReportedDate') { e.preventDefault(); }
        else if (e.keyCode === 9 || e.which === 9) { startRef.current.setOpen(false); }
    };

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.id);
    };

    return (
        <>
            <NameListing />
            <div className="section-body view_page_design pt-1 p-1 bt">
                <div className="div">
                    <div className="col-12  inc__tabs">
                        <Tab />
                    </div>
                    <div className="dark-row" >

                        <div className="col-12 col-sm-12">
                            <div className="card Agency incident-card ">
                                <div className="card-body" >
                                    <div className="col-md-12">
                                        <div className="row" style={{ marginTop: '-18px', marginLeft: '-18px' }}>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Document Name{errors.DocFileNameError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocFileNameError}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                                                <input type="text" className='requiredColor' name='DocumentName' value={value.DocumentName} onChange={handleChange} required autoComplete='off' />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <span data-toggle="modal" onClick={() => {
                                                    setOpenPage('Document Type')
                                                }} data-target="#ListModel" className='new-link'>
                                                    Document Type
                                                    {errors.DocumentTypeIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIDError}</p>
                                                    ) : null}
                                                </span>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4  mt-2" >
                                                <Select
                                                    name='DocumentTypeID'
                                                    styles={colourStyles}
                                                    value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeID)}
                                                    isClearable
                                                    options={documentDrpVal}
                                                    onChange={(e) => ChangeDropDown(e, 'DocumentTypeID')}
                                                    placeholder="Select.."
                                                />
                                            </div>

                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Reported/Date</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4  mt-2 ">
                                                <DatePicker
                                                    id='reportedDtTm'
                                                    name='reportedDtTm'
                                                    ref={startRef}
                                                    onKeyDown={(e) => {
                                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                            e.preventDefault();
                                                        } else {
                                                            onKeyDown(e);
                                                        }
                                                    }}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeFormat="HH:mm "
                                                    is24Hour
                                                    isClearable={false}
                                                    selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                    autoComplete="Off"
                                                    onChange={(date) => {
                                                        setChangesStatus(true);
                                                        if (date >= new Date()) {
                                                            setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date()) : null })
                                                        } else if (date <= new Date(incReportedDate)) {
                                                            setValue({ ...value, ['ReportedDtTm']: incReportedDate ? getShowingDateText(incReportedDate) : null })
                                                        } else {
                                                            setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                                                        }
                                                    }}
                                                    timeInputLabel
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    minDate={new Date(incReportedDate)}
                                                    maxDate={new Date(datezone)}
                                                    showDisabledMonthNavigation
                                                    filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                                    className='requiredColor'
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Primary Officer</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4  mt-2" >
                                                <Select
                                                    name='PrimaryOfficerID'
                                                    menuPlacement='top'
                                                    styles={colourStyles}
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                                    isClearable
                                                    options={agencyOfficerDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <span htmlFor="" className='label-name '>File Attachment{errors.File_Not_Selected !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                                                ) : null}</span>
                                            </div>
                                            <div className="col-10 col-md-10 col-lg-10 text-field mt-2 mb-0">
                                                <input type="file" className='requiredColor' name='File' onChange={changeHandler} required />
                                                {selectedFileName?.length > 0 &&
                                                    <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} onClick={() => { setSelectedFileName(''); document.querySelector("input[type='file']").value = "" }}></i>}
                                               
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Notes</label>
                                            </div>
                                            <div className="col-10 col-md-10 col-lg-10 mb-0 mt-1" >
                                                <textarea name='DocumentNotes' onChange={handleChange} id="Comments" value={value.DocumentNotes} cols="30" rows='2' className="form-control " ></textarea>
                                            </div>
                                        </div>

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
                                                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                        <label htmlFor="" className="label-name">
                                                            User Name
                                                        </label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 text-field mt-2">
                                                        <input
                                                            type="text"
                                                            name="UserName"
                                                            value={value.UserName}
                                                            onChange={handleChange}
                                                            required
                                                            autoComplete="off"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                        <label htmlFor="" className="label-name">
                                                            Group
                                                        </label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-1 mb-1">
                                                        <SelectBox
                                                            styles={colourStyles}
                                                            menuPlacement="bottom"
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            hideSelectedOptions={true}
                                                            isClearable={false}
                                                            allowSelectAll={false}
                                                            components={{ MultiValue }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="btn-box text-right mr-1 mb-2 mt-2">
                                            <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                                            <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                                        
                                        </div>
                                        <DataTable
                                            dense
                                            columns={columns}
                                            pagination
                                            highlightOnHover
                                            customStyles={tableCustomStyles}
                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : [] : documentdata}
                                          
                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                            fixedHeader
                                            persistTableHead={true}
                                            fixedHeaderScrollHeight='300px'
                                            paginationPerPage={'100'}
                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                            conditionalRowStyles={conditionalRowStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <DeletePopUpModal func={DeleteDocumentManagement} />
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
            <ListModal {...{ openPage, setOpenPage }} />
            {/* <IdentifyFieldColor /> */}
        </>
    )
}

export default Document

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}