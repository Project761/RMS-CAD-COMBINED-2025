import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import { base64ToString, Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import RejectedReports from '../RejectedReports/RejectedReports';
import ApprovedReports from '../ApprovedReports/ApprovedReports';
import DraftReport from '../DraftReport/DraftReport';
import DashboardAllReports from '../DashboardAllReports/DashboardAllReports';

function AssignedReports() {
    const uniqueId = sessionStorage.getItem('UniqueUserID')
        ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
        : '';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [clickedRow, setClickedRow] = useState(null);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState();
    const [editval] = useState([]);
    const [narrativeID] = useState();
    const [queData, setqueData] = useState();
    const [modelStatus, setModelStatus] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState('Assigned');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            get_Data_Que_Report(localStoreData?.PINID, localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

        }
    }, [localStoreData]);

    useEffect(() => {
        if (modelStatus) {
            get_Data_Que_Report(loginPinID, loginAgencyID);
        }
    }, [modelStatus]);

    const columns = [
        {
            name: 'Review',
            cell: row => (
                <div className="text-start">
                    <button
                        type="button"
                        className="btn btn-sm btn-dark w-100 mb-1"
                        style={{ backgroundColor: "#001f3f", color: "#fff" }}
                        onClick={() => {
                            navigate(`/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeAssignedID)}&tab=Report&Assigned=true`);
                        }}
                    >
                        Edit
                    </button>

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            grow: 0,
            minWidth: '120px',

        },

        {
            name: 'Report Name',
            grow: 1,
            minWidth: '160px',
            selector: row => 'Incident Report',
            sortable: true,

            cell: row => (
                <div
                    title='Incident Report'
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',

                    }}
                >
                    Incident Report
                </div>
            ),
        },


        {
            name: 'Incident# ',
            grow: 1,
            minWidth: '120px', cell: row => {
                return (
                    <span
                        onClick={() => {
                            navigate(
                                `/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=true&IsCadInc=true&narrativeAssignId=${stringToBase64(row?.NarrativeAssignedID)}&tab=Report&Assigned=true`
                            );
                        }}
                        style={{
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                        title="Go to Incident"
                    >
                        {row?.IncidentNumber}
                    </span>
                );
            }, sortable: true,
        },

        {
            name: 'Assigned Date/Time', grow: 1, minWidth: '160px', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true,
        },
        {
            name: 'Assigned To', grow: 1, minWidth: '140px', selector: row => row.AssignedOfficer, sortable: true,
        },


        {
            name: 'Report Type',
            grow: 1,
            minWidth: '170px',
            selector: row => row.NarrativeDescription,
            sortable: true,

            cell: row => {
                const desc = row.NarrativeDescription?.toLowerCase();

                let backgroundColor = 'transparent';
                let color = 'inherit';

                if (desc === 'initial narrative') {
                    backgroundColor = '#fde047'; // yellow-300
                    color = 'inherit';
                } else if (desc === 'public narrative') {
                    backgroundColor = '#86efac'; // green-300
                    color = 'inherit';
                } else if (desc === 'supplementary narrative') {
                    backgroundColor = '#bfdbfe'; // blue-200
                    color = 'inherit';
                }
                else if (desc === 'press release') {
                    backgroundColor = '#f87171'; // red-400
                    color = 'inherit';
                }

                return (
                    <span
                        style={{
                            backgroundColor,
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            whiteSpace: "nowrap"

                        }}
                    >
                        {row.NarrativeDescription}
                    </span>
                );
            },
        },



        {
            name: 'Due Date',
            grow: 1,
            minWidth: '120px',
            selector: row => row.DueDate ? getShowingWithOutTime(row.DueDate) : '',
            sortable: true,
            cell: row => (
                <span style={{ color: 'red' }}>
                    {row.DueDate ? getShowingWithOutTime(row.DueDate) : ''}
                </span>
            ),
        },
        {
            name: 'Elapsed Days',
            grow: 0,
            minWidth: '120px',
            selector: row => row.ElapsedDay,
            sortable: true,
            cell: row => {
                let color = '';
                if (row.ElapsedDay > row.DueStatus) {
                    color = '#FF0000';
                }

                return (
                    <span
                        style={{
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            // fontWeight: 'bold',
                        }}
                    >
                        {row.ElapsedDay}
                    </span>
                );
            }
        }
        // {
        //     name: 'Elapsed Days',
        //     width: "180px",
        //     selector: row => row.ElapsedDay,
        //     sortable: true,

        // },

    ];

    const get_Data_Que_Report = (OfficerID, agencyId) => {
        const val = { 'OfficerID': OfficerID, 'AgencyID': agencyId }
        fetchPostData('IncidentNarrativeAssigned/GetData_IncidentNarrativeAssigned', val).then((res) => {
            if (res) {
                console.log(res)
                setqueData(res);
            } else {
                setqueData([]);
            }
        })
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

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const handleRadioChange = (e) => {
        setSelectedReportType(e.target.value);
    };


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);


    return (
        <>
            <div className="col-12 col-sm-12">
                {/* <div className="text-end mt-3 d-flex mb-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <h5 className="fw-bold ml-3">My Reports</h5>
                    <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={onMasterPropClose}>
                        Close
                    </button>
                </div>
                <div className='row gx-2 gy-2' style={{ margin: '0px 10px' }}>
                    <ul className="list-unstyled d-flex mb-0" style={{ gap: "40px" }}>
                         <li className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Assigned"
                                name="AttemptComplete"
                                id="assigned"
                                checked={selectedReportType === 'All'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="assigned">
                                All Report
                            </label>
                        </li>
                        <li className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Assigned"
                                name="AttemptComplete"
                                id="assigned"
                                checked={selectedReportType === 'Assigned'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="assigned">
                                Assigned Report
                            </label>
                        </li>

                        <li className="form-check ml-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Draft"
                                name="AttemptComplete"
                                id="draft"
                                checked={selectedReportType === 'Draft'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="draft">
                                Not submitted Report (DRAFT)
                            </label>
                        </li>
                        <li className="form-check ml-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Rejected"
                                name="AttemptComplete"
                                id="rejected"
                                checked={selectedReportType === 'Rejected'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="rejected">
                                Need Correction Report (REJECTED)
                            </label>
                        </li>

                        <li className="form-check ml-2">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Approved"
                                name="AttemptComplete"
                                id="approved"
                                checked={selectedReportType === 'Approved'}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="approved">
                                Finalized Report (APPROVED)
                            </label>
                        </li>
                    </ul>
                </div>
                 {selectedReportType === 'All' && <DashboardAllReports />}
                {selectedReportType === 'Draft' && <DraftReport />}
                {selectedReportType === 'Rejected' && <RejectedReports />}
                {selectedReportType === 'Approved' && <ApprovedReports />} */}

                <div className="card-body">
                    <DataTable
                        className='table-responsive_assigned'
                        data={queData}
                        dense
                        columns={columns}
                        pagination
                        highlightOnHover
                        customStyles={tableCustomStyles}
                        noDataComponent={
                            effectiveScreenPermission?.[0]?.DisplayOK ? 'There are no data to display' : 'You don’t have permission to view data'
                        }
                        fixedHeader
                        persistTableHead
                        fixedHeaderScrollHeight="400px"
                        paginationPerPage={100}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        conditionalRowStyles={conditionalRowStyles}
                        onRowClicked={setClickedRow}
                    />
                </div>
            </div>
            <AssignedReportsModal editval={editval} narrativeID={narrativeID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} setModelStatus={setModelStatus} />
        </>
    )
}
export default AssignedReports




const AssignedReportsModal = (props) => {

    const [activeTab, setActiveTab] = useState('ReportReview');
    const { editval, narrativeID, loginAgencyID, loginPinID, setModelStatus, } = props
    const [clickedRow, setClickedRow] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState('Approve');
    const [incidentID, setIncidentID] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [reportedPinActivity, setreportedPinActivity] = useState(false);
    const [narrativeTypeId, setnarrativeTypeId] = useState(false);
    const [AsOfDate, setAsOfDate] = useState('');
    const [filteredData, setfilteredData] = useState(false);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [value, setValue] = useState({
        'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
        'IsApprove': true, 'IsReject': false, 'Comments': '', 'CommentsDoc': '', 'ApprovalComments': ''
    })

    const [errors, setErrors] = useState({
        'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '',
    })


    const rejectColumns = [
        { name: 'Rejected By', selector: row => row.ApprovingOfficer, sortable: true },
        { name: 'Reason For Rejection', selector: row => row.Comments, sortable: true },
        { name: 'Date Of Rejection', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
    ];

    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'IncidentID': editval[0]?.IncidentNumber, 'CADIncidentNumber': editval[0]?.CADIncidentNumber, 'ReportedBy_Description': editval[0]?.ReportedBy_Description, 'ReportName': editval[0]?.ReportName,
                'sequence': editval[0]?.sequence, 'CommentsDoc': editval[0]?.CommentsDoc, 'Comments': editval[0]?.Comments, 'NarrativeReport_Comments': editval[0]?.NarrativeReport_Comments
            })
            setIsSaved(false);
            if (editval[0]?.CommentsDoc?.trim()) {
                setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0]?.CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
            }
            setIncidentID(editval[0]?.IncidentID); setAsOfDate(editval[0]?.AsOfDate ? getShowingDateText(editval[0]?.AsOfDate) : '');
            setnarrativeTypeId(editval[0]?.NarrativeTypeID); setreportedPinActivity(editval[0]?.ReportedByPINActivityID)
        }
        else {
            setValue({
                ...value, 'IncidentID': '', 'CADIncidentNumber': '', 'ReportedBy_Description': '', 'Comments': '', 'sequence': '', 'CommentsDoc': '',
            });
        }
    }, [editval])


    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#cce5ff',
                color: 'black',
            },
        },
    ];

    const tableCustomStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
                backgroundColor: '#00264d',
                color: '#ffffff',
            },
        },
    };

    useEffect(() => {
        get_Data_Narrative(narrativeID)
    }, [narrativeID])

    const get_Data_Narrative = (NarrativeID) => {
        const val = { 'NarrativeID': NarrativeID }
        fetchPostData('IncidentNarrativeReport/GetData_Narrative', val).then((res) => {
            if (res) {
                setfilteredData(res)
            }
        })
    }

    const Add_Type = () => {
        const { IsApprove, IsReject, Comments, CommentsDoc, WrittenForID } = value
        const val = {
            'AgencyID': loginAgencyID, 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsReject,
            'CommentsDoc': CommentsDoc, "ReportedByPINActivityID": reportedPinActivity, "NarrativeTypeID": narrativeTypeId, 'Comments': Comments, 'WrittenForID': WrittenForID,
            'AsOfDate': AsOfDate
        };
        AddDeleteUpadate('Narrative/Update_Narrative', val).then((res) => {
            Add_Type_Comments(); get_Data_Narrative(narrativeID)
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message); setIsSaved(true);
            setModelStatus(true); reset();
        })
    }

    const Add_Type_Comments = () => {
        const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments } = value
        const val = {
            'AgencyID': loginAgencyID, 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsReject, 'Comments': ApprovalComments,
        };
        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
            const parseData = JSON.parse(res.data);
            resets();
        })
    }
    const reset = () => {
        setValue({ ...value, 'CommentsDoc': '' });
    }

    const resets = () => {
        setValue({ ...value, 'ApprovalComments': '' });
    }

    const handleRadioChange = (event) => {
        const selectedOption = event.target.value;
        setApprovalStatus(selectedOption);
        setValue(prevState => ({
            ...prevState, IsApprove: selectedOption === 'Approve',  IsReject: selectedOption === 'Reject', }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (event) {
            setValue((prevState) => ({ ...prevState, [name]: value, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    const handleEditorChange = (state) => {
        setEditorState(state); convertContentToHTML(state);
    }

    const convertContentToHTML = (state) => {
        let currentContentAsHTML = draftToHtml(convertToRaw(state.getCurrentContent()));
        setValue({ ...value, 'CommentsDoc': currentContentAsHTML });

    }

    const getValueNarrative = (e) => {
        let combinedText = '';
        for (let key in e.blocks) {
            if (e.blocks[key]?.text) {
                combinedText += e.blocks[key].text + ' ';
            }
        }
        setValue({ ...value, ['Comments']: combinedText.trim() });
    };

    const check_Validation_ErrorApproval = () => {
        if (RequiredFieldIncident(value.ApprovingSupervisorID)) {
            setErrors(prevValues => { return { ...prevValues, ['ApprovalCommentsError']: RequiredFieldIncident(value.ApprovalComments) } })
            setErrors(prevValues => { return { ...prevValues, ['CommentsDocumentsError']: RequiredFieldIncident(value.Comments?.trim()) } })
        }

    }

    const { ApprovalCommentsError, CommentsDocumentsError } = errors

    useEffect(() => {
        if (ApprovalCommentsError === 'true' && CommentsDocumentsError === 'true') {
            Add_Type()
            resetserror();
        }
    }, [ApprovalCommentsError, CommentsDocumentsError])

    const resetserror = () => {
        setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '' })
    }

    return (
        <div className="modal fade" id="QueueReportsModal" tabIndex="-1" aria-hidden="true" style={{ background: "rgba(0,0,0, 0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '550px' }}>
                    <div className="d-flex justify-content-between">
                        <div className='row mt-1 mb-2'>
                            <div className='col-12'>
                                <nav className='nav nav-tabs'>
                                    <span
                                        className={`nav-link nav-links mr-2 ${activeTab === 'ReportReview' ? 'active' : ''}`}


                                        style={{ color: activeTab === 'ReportReview' ? 'blue' : 'Red' }}
                                        aria-current="page"

                                        onClick={() => setActiveTab('ReportReview')}
                                    >
                                        Report Review
                                    </span>
                                    |
                                    <span
                                        className={`nav-link nav-links ml-2 ${activeTab === 'History' ? 'active' : ''}`}


                                        style={{ color: activeTab === 'History' ? 'blue' : 'Red' }}
                                        aria-current="page"

                                        onClick={() => setActiveTab('History')}
                                    >
                                        History
                                    </span>
                                </nav>
                            </div>
                        </div>
                        <button className="btn-close b-none bg-transparent" onClick={() => setActiveTab('ReportReview')} data-dismiss="modal">X</button>
                    </div>
                    {activeTab === 'History' && (


                        <div className="mb-3 mt-4">

                            <DataTable
                                data={filteredData}
                                columns={rejectColumns}
                                dense
                                highlightOnHover
                                noHeader
                                customStyles={tableCustomStyles}
                                conditionalRowStyles={conditionalRowStyles}
                                onRowClicked={setClickedRow}
                                paginationPerPage={5}
                                pagination
                            />

                        </div>
                    )}


                    {activeTab === 'ReportReview' && (

                        <>
                            {/* Report Info */}
                            <div className="row mt-1 align-items-center gx-2 gy-2">
                                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>
                                    <label className='label-name'>Incident #</label>
                                </div>
                                <div className='col-sm-2 col-12'>
                                    <input type="text" className="form-control" value={value?.IncidentID} readOnly />
                                </div>

                                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '90px' }}>
                                    <label className='label-name'>CAD Event #</label>
                                </div>
                                <div className='col-sm-2 col-12'>
                                    <input type="text" className="form-control" value={value?.CADIncidentNumber} readOnly />
                                </div>

                                <div className="col-auto px-0 text-nowrap" style={{ whiteSpace: 'nowrap', minWidth: '116px' }}>
                                    <label className='label-name'>Submitting Officer</label>
                                </div>
                                <div className='col-sm-2 col-12'>
                                    <input type="text" className="form-control" value={value?.ReportedBy_Description} readOnly />
                                </div>

                                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>
                                    <label className='label-name'>Seq #</label>
                                </div>
                                <div className='col-sm-2 col-12'>
                                    <input type="text" className="form-control" value={value?.sequence} readOnly />
                                </div>
                            </div>

                            <div className="row mt-1">
                                <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">

                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={handleEditorChange}
                                        wrapperClassName="wrapper-class"
                                        editorClassName="editor-class"
                                        toolbarClassName="toolbar-class"
                                        onChange={getValueNarrative}
                                        editorStyle={{ height: '35vh', }}
                                        toolbar={{
                                            options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'history',],
                                            inline: {
                                                inDropdown: false,
                                                className: undefined,
                                                component: undefined,
                                                dropdownClassName: undefined,
                                                options: ['bold', 'italic', 'underline', 'monospace',],
                                            },
                                            list: {
                                                inDropdown: false,
                                                className: undefined,
                                                component: undefined,
                                                dropdownClassName: undefined,
                                                options: ['unordered', 'ordered',],

                                            },
                                            textAlign: {
                                                inDropdown: false,
                                                className: undefined,
                                                component: undefined,
                                                dropdownClassName: undefined,
                                                options: ['left', 'center', 'right', 'justify'],
                                            },
                                            colorPicker: {
                                                icon: 'color',
                                                className: undefined,
                                                component: undefined,
                                                popupClassName: undefined,
                                                colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                                                    'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                                                    'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                                                    'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                                                    'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                                                    'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                                            },
                                        }}
                                    />
                                    {errors.CommentsDocumentsError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsDocumentsError}</p>
                                    ) : null}
                                </div>

                            </div>


                            <div className='row mt-1'>
                                <div className='col-md-2'>


                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            value="Approve"
                                            name="flexRadioDefault"
                                            id="Group"
                                            checked={value.IsApprove}
                                            onChange={handleRadioChange}

                                        />
                                        <label className="form-check-label " htmlFor="Group">
                                            Approve
                                        </label>
                                    </div>


                                </div>
                                <div className='col-md-2'>



                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            value="Reject"
                                            name="flexRadioDefault"
                                            id="Group"
                                            checked={value.IsReject}
                                            onChange={handleRadioChange}

                                        />
                                        <label className="form-check-label " htmlFor="Group">
                                            Reject
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {approvalStatus === 'Approve' && (
                                <>


                                    <div className="row g-3 ">
                                        <div className="col-md-6">
                                            <label className="fw-bold">Previous Approval Comments</label>
                                            <div className="form-control bg-light" style={{ minHeight: '56px' }}>
                                                {value?.NarrativeReport_Comments}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold">Enter Approval Comments Here{errors.ApprovalCommentsError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError}</p>
                                            ) : null}</label>
                                            <textarea
                                                className="form-control"
                                                style={{ minHeight: '50px', background: '#fef6e4' }}
                                                placeholder="Enter Approval Comments"
                                                name="ApprovalComments"
                                                value={value?.ApprovalComments}

                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {approvalStatus === 'Reject' && (
                                <>


                                    <div className="row g-3 ">
                                        <div className="col-md-6">
                                            <label className="fw-bold">Previous Reason for Rejection</label>
                                            <div className="form-control bg-light" style={{ minHeight: '56px' }}>
                                                {clickedRow?.NarrativeReport_Comments}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="fw-bold">Enter Reason for Rejection{errors.ApprovalCommentsError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError}</p>
                                            ) : null}</label>
                                            <textarea
                                                className="form-control"
                                                style={{ minHeight: '50px', background: '#fff3cd' }} // light yellow
                                                placeholder="Enter Reason for Rejection"
                                                name="ApprovalComments"
                                                value={value.ApprovalComments}
                                                onChange={(e) => { handleChange(e) }}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="d-flex justify-content-end mt-4">
                                {!isSaved && (
                                    <button className="btn btn-primary " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={(e) => { check_Validation_ErrorApproval(); }}>Save</button>
                                )}

                            </div>

                        </>
                    )}



                </div>
            </div>

        </div>

    );
};
