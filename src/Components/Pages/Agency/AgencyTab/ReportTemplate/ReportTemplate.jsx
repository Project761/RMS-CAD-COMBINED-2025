import { useState, useEffect, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api'
import { base64ToString, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data, get_Narrative_Type_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import useObjState from '../../../../../CADHook/useObjState';
import DataTable from 'react-data-table-component';
import ReactQuill from 'react-quill';
import { colorLessStyle_Select, requiredFieldColourStyles } from '../../../../../CADComponents/Utility/CustomStylesForReact'
import { isEmpty } from '../../../../../CADUtils/functions/common'
import DeletePopUpModal from '../../../../Common/DeleteModal'

const ReportTemplate = ({ aId }) => {
    const { GetDataTimeZone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const quillRef2 = useRef(null);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

    const [pinID, setPinID] = useState('');
    const [templateID, setTemplateID] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const [isChange, setIsChange] = useState(false);
    const [reportTemplateData, setReportTemplateData] = useState([])

    const [tags, setTags] = useState([{ value: "OfficerName", label: "Officer Name" },
    { value: "AgencyName", label: "Agency Name" },
    { value: "AgencyAddress", label: "Agency Address" },
    { value: "ORI", label: "ORI" }]);

    const [
        reportTemplateState,
        setReportTemplateState,
        handleReportTemplateState,
        clearReportTemplateState,
    ] = useObjState({
        templateID: "",
        templateName: "",
        narrativeTypeID: "",
        templateContent: "",
    });
    console.log("reportTemplateState", reportTemplateState);
    const [
        errorReportTemplateState,
        _setErrorReportTemplateState,
        handleErrorReportTemplateState,
        clearErrorReportTemplateState,
    ] = useObjState({
        templateName: false,
        narrativeTypeID: false,
        templateContent: false,
    });

    const useQueryLocation = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQueryLocation();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (aId) {
            GetAllReportTemplateData(aId);
        }
    }, [aId])

    const GetAllReportTemplateData = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('ReportTemplate/GetReportTemplate', value).then(res => {
            if (res) {
                setReportTemplateData(res)
            } else {
                setReportTemplateData([])
            }
        })
    }



    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A005", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
            dispatch(get_Narrative_Type_Drp_Data(loginAgencyID))
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);
    console.log("errorReportTemplateState", errorReportTemplateState);

    const validateReportTemplateReportForm = () => {
        console.log(" isEmpty(reportTemplateState[field])", isEmpty(reportTemplateState["templateContent"]));
        let isError = false;
        const keys = Object.keys(errorReportTemplateState);
        keys.map((field) => {
            if (field === "templateName" && isEmpty(reportTemplateState[field])) {
                handleErrorReportTemplateState(field, true);
                isError = true;
            } else if (field === "narrativeTypeID" && isEmpty(reportTemplateState[field])) {
                handleErrorReportTemplateState(field, true);
                isError = true;
            } else if (field === "templateContent" && (reportTemplateState?.templateContent === "" || reportTemplateState?.templateContent === null || reportTemplateState?.templateContent === "<p><br></p>")) {
                handleErrorReportTemplateState(field, true);
                isError = true;
            } else {
                handleErrorReportTemplateState(field, false);
            }
        });
        return !isError;
    };

    const onSave = async () => {
        if (!validateReportTemplateReportForm()) return;

        const isUpdate = !!templateID;
        const endpoint = isUpdate
            ? 'ReportTemplate/UpdateReportTemplate'
            : 'ReportTemplate/InsertReportTemplate';
        console.log("endpoint", endpoint);
        console.log("isUpdate", isUpdate);
        const payload = {
            ...(isUpdate && { templateID: templateID }),
            TemplateName: reportTemplateState?.templateName,
            NarrativeTypeID: reportTemplateState?.narrativeTypeID,
            TemplateContent: reportTemplateState?.templateContent,
            AgencyID: aId,
            IsActive: true,
            ...(isUpdate ? { ModifiedByUserFK: pinID } : { CreatedByUserFK: pinID }),
        };

        AddDeleteUpadate(endpoint, payload)
            .then(res => {
                if (res.success) {
                    toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                    GetAllReportTemplateData(aId);

                    handelCancel();
                } else {
                    toastifyError(res.data.Message);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };


    function handelCancel() {
        clearErrorReportTemplateState()
        clearReportTemplateState();
        setIsChange(false);
        setTemplateID()
    }

    const set_Edit_Value = (row) => {
        console.log("row", row);

        if (row?.templateID) {
            clearReportTemplateState();
            setReportTemplateState(
                {
                    templateID: row?.templateID,
                    templateName: row?.templateName,
                    narrativeTypeID: row?.narrativeTypeID,
                    templateContent: row?.templateContent,
                }

            );
            setTemplateID(row.templateID);
        }


    }

    const columns = [
        {
            name: 'Report Template Name',
            selector: (row) => row.templateName,
            sortable: true
        },
        {
            name: 'Report Type',
            selector: (row) => row.narrativeTypeID ? narrativeTypeDrpData?.find((i) => i?.value === row.narrativeTypeID)?.label : "",
            sortable: true
        },
        {
            name: (
                <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>
                    Delete
                </p>
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, right: 15 }}>
                    {/* {
                        row.IsAllowDelete === 'true' || row.IsAllowDelete === true && (
                            effectiveScreenPermission
                                ? effectiveScreenPermission[0]?.DeleteOK &&
                                <span
                                    onClick={() => setNarrativeID(row.NarrativeID)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <span
                                    onClick={() => setNarrativeID(row.NarrativeID)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                        )
                    } */}
                    {

                        <span
                            onClick={() => setTemplateID(row.templateID)}
                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                            data-toggle="modal"
                            data-target="#DeleteModal"
                        >
                            <i className="fa fa-trash"></i>
                        </span>


                    }
                </div>
            )
        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row?.templateID === templateID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const insertTagTemplate = (tag) => {
        if (quillRef2.current) {
            // Ensure quillRef2 is not null
            const editor = quillRef2.current.getEditor(); // Get the Quill editor instance
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textToInsert = ` {{${tag}}}`;
                editor.insertText(cursorPosition, textToInsert); // Insert the tag at the cursor position
            }
        }
    };

    const DeleteNarratives = () => {
        const val = { 'TemplateID': templateID, 'DeletedByUserFK': pinID, }
        AddDeleteUpadate('ReportTemplate/DeleteReportTemplate', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                handelCancel();
            } else { console.log("Somthing Wrong"); }
            GetAllReportTemplateData(aId);
            // GetData_ReportWorkLevelCheck(loginAgencyID ,narrativeID);
        })
    }
    const handleKeyDownTemplate = (e) => {
        if (e.key === 'Backspace' && quillRef2.current) {
            const editor = quillRef2.current.getEditor();
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textBeforeCursor = editor.getText(0, cursorPosition); // Get text before the cursor
                const lastWord = textBeforeCursor.split(' ').pop(); // Get the last word before the cursor
                console.log(lastWord);
                if (lastWord.startsWith('{{') && lastWord.endsWith('}}')) {
                    // If the last word is a tag in the format {{tag}}, remove it
                    const newText = textBeforeCursor.slice(
                        0,
                        textBeforeCursor.lastIndexOf(lastWord)
                    );
                    editor.setText(newText + editor.getText(cursorPosition));

                    // Keep the cursor at the same position
                    editor.setSelection(cursorPosition - lastWord.length - 1, 0); // Move cursor to correct position

                    e.preventDefault(); // Prevent default backspace behavior
                }
            }
        }
    };

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

    return (
        <div className='mt-2'>
            <div className="col-12">
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-2 mt-0 pt-1 ">
                        <label htmlFor="" className='new-label'>Report Template Name {errorReportTemplateState.templateName && isEmpty(reportTemplateState?.templateName) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Report Template Name"}</p>
                        )}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 mt-0 text-field">

                        <input
                            name="templateName"
                            type="text"
                            className="form-control new-input requiredColor"

                            placeholder="Report Template Name"
                            value={reportTemplateState?.templateName}
                            onChange={(e) => {
                                const value = e.target.value;
                                handleReportTemplateState("templateName", value);
                                setIsChange(true);
                            }}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-0 pt-1 ">
                        <label htmlFor="" className='new-label'>Report Type {errorReportTemplateState.narrativeTypeID && isEmpty(reportTemplateState?.narrativeTypeID) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Report Type"}</p>
                        )}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-5 mt-0 text-field">
                        <Select
                            styles={colourStyles}
                            placeholder="Select"
                            isClearable
                            options={narrativeTypeDrpData}
                            value={reportTemplateState?.narrativeTypeID ? narrativeTypeDrpData?.find((i) => i?.value === reportTemplateState?.narrativeTypeID) : ""}
                            onChange={(e) => {
                                handleReportTemplateState("narrativeTypeID", e?.value);
                                setIsChange(true);
                            }}
                        />

                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-2 pt-1 mt-1">
                    <label htmlFor="" className='new-label'>Report Template Content {errorReportTemplateState.templateContent && (reportTemplateState?.templateContent === "" || reportTemplateState?.templateContent === null || reportTemplateState?.templateContent === "<p><br></p>") && (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Report Template Content"}</p>
                    )}</label>
                </div>

                <div className="col-10  mt-2 react-quill-container">
                    <div>
                        {tags?.map((tag) => (
                            <button
                                key={tag.value}
                                type="button"
                                className="btn btn-primary"
                                onClick={() => insertTagTemplate(tag.value)}
                                style={{ margin: '3px', padding: "4px 8px" }}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>
                    <ReactQuill
                        ref={quillRef2}
                        value={reportTemplateState?.templateContent || ''}
                        onChange={(e) => {
                            handleReportTemplateState("templateContent", e);
                            setIsChange(true);
                        }}
                        theme="snow"
                        modules={{ toolbar: false }}
                        editorProps={{ spellCheck: true }}
                        placeholder="Report Template Content"
                        style={{ height: '160px', marginTop: "5px" }}
                        onKeyDown={handleKeyDownTemplate}
                    />
                </div>
            </div>
            <div className="col-12">
                <div className="btn-box text-right mt-1 mr-1">
                    <button
                        type="button"
                        className="btn btn-sm btn-success mr-1"
                        data-dismiss="modal"
                        onClick={() => handelCancel()}
                    >
                        New
                    </button>
                    <button
                        type="button" className="btn btn-sm btn-success mr-1"
                        disabled={!isChange}
                        onClick={() => {
                            onSave()
                        }}
                    >
                        {!!reportTemplateState?.templateID ? "Update" : "Save"}
                    </button>
                </div>
            </div>
            <div className="col-12 mt-1">
                <DataTable
                    columns={columns}
                    data={reportTemplateData}
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
                        set_Edit_Value(row);
                    }}
                    fixedHeader
                    subHeaderAlign="right"
                    subHeaderWrap
                />
                <DeletePopUpModal func={DeleteNarratives} />
            </div>
        </div>
    )
}

export default ReportTemplate
