import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import SelectBox from '../../Common/SelectBox';
import { get_Narrative_Type_Drp_Data } from '../../../redux/actions/DropDownsData';


function DraftReport({ isPreview }) {
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
    const [queData, setqueData] = useState();
    const [narrativeReportData, setNarrativeReportData] = useState([]);
    const [useOfForceData, setUseOfForceData] = useState([]);
    const [modelStatus] = useState(false);
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

    useEffect(() => {
        if (loginAgencyID && loginPinID) {
            get_Data_Que_Report(loginPinID, loginAgencyID);
            getUseOfForceReport(loginPinID, loginAgencyID);
        }
    }, [loginPinID, loginAgencyID]);


    const columns = [

        // {
        //     name: 'Action',
        //     selector: row => row.incident,
        //     sortable: true,
        //     minWidth: '25px',
        //     grow: 1,
        //     cell: row => (
        //         <div style={{ position: 'absolute', top: 4, }}>
        //             {
        //                 effectiveScreenPermission ?
        //                     effectiveScreenPermission[0]?.Changeok ?
        //                         <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
        //                             onClick={(e) => { set_IncidentId(row); }}
        //                             className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
        //                             <i className="fa fa-edit"></i>
        //                         </Link>
        //                         : <></>
        //                     : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
        //                         onClick={(e) => { set_IncidentId(row); }}
        //                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
        //                         <i className="fa fa-edit"></i>
        //                     </Link>
        //             }
        //         </div>)
        // },
        {
            name: 'Report Type',
            minWidth: '120px',
            grow: 1, cell: row => {
                return (
                    <span
                        onClick={() => {
                            navigate(
                                `/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`
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
            sortable: true,
            minWidth: '150px',
            grow: 2,
            cell: row => {
                const desc = row?.ReportTypeJson || row.NarrativeDescription?.toLowerCase();

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
                } else if (desc === 'Use Of Force') {
                    backgroundColor = '#007bff'; // red-400
                    color = '#ffff';
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
                        {row?.ReportTypeJson || row.NarrativeDescription}
                    </span>
                );
            },
        },
        { name: 'Submitted Date/Time', minWidth: '120px', grow: 2, selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
        { name: 'Prepared By', minWidth: '120px', grow: 2, selector: row => row.PreparedBy_Description, sortable: true },
        {
            name: 'Status',
            selector: row => row.Status,
            minWidth: '110px',
            grow: 1,
            sortable: true,
            cell: row => {
                const desc = row.Status?.toLowerCase();
                let backgroundColor = 'transparent';
                let color = 'black'; // Default text color

                // Set background color based on status
                if (desc === 'pending review') {
                    backgroundColor = '#007bff'; // Blue for "Pending Review"
                    color = 'white';
                }
                else if (desc === 'approved') {
                    backgroundColor = '#28a745'; // Green color
                    color = 'white';
                }
                else if (desc === 'draft') {
                    backgroundColor = '#ffc107'; // Orange color
                    color = 'white';
                }
                else if (desc === 'rejected') {
                    backgroundColor = '#FF0000'; // Red color
                    color = 'white';
                }

                return (
                    <span
                        style={{
                            backgroundColor,
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                        }}
                    >
                        {row.Status}
                    </span>
                );
            }
        },
        {
            name: 'Elapsed Days',
            selector: row => row.ElapsedDay,
            sortable: true,
            minWidth: '40px',
            grow: 1,
            cell: row => {
                let color = '';
                if (row.ElapsedDay > row.DueStatus) {
                    color = '#FF0000';
                }

                return (
                    <span
                        style={{
                            color,
                            // padding: '2px 6px',
                            // borderRadius: '4px',
                            // display: 'inline-block',
                            // fontWeight: 'bold',
                        }}
                    >
                        {row.ElapsedDay}
                    </span>
                );
            }
        }
        // { name: 'Elapsed Days', selector: row => row.ElapsedDay, sortable: true, grow: 0, maxWidth: '130px', minWidth: '120px', },


    ];

    const set_IncidentId = (row) => {
        if (row.IncidentID) {
        }
    }

    const get_Data_Que_Report = (OfficerID, agencyId) => {
        const val = { 'OfficerID': OfficerID, 'AgencyID': agencyId };
        fetchPostData('/IncidentNarrativeReport/GetData_AllNarrativeReport', val).then((res) => {
            if (res) {
                setNarrativeReportData(res);
            } else {
                setNarrativeReportData([]);
            }
        });
    };


    const getUseOfForceReport = (OfficerID, agencyId) => {
        const val = {
            'ApprovePinID': OfficerID,
            'AgencyID': agencyId
        }
        if (OfficerID && agencyId) {
            fetchPostData('CAD/UseOfForceReport/GetUseOfForceReport', val).then((res) => {
                if (res) {
                    const Data = res?.filter((item) => item?.Status === "Draft")
                    setUseOfForceData(Data);
                } else {
                    setUseOfForceData([]);
                }
            })
        }
    }
    useEffect(() => {
        setqueData([...useOfForceData, ...narrativeReportData]);
    }, [useOfForceData, narrativeReportData]);

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
        <>

            <div className="section-body view_page_design p-0 ">
                <div className="col-12 col-sm-12 p-0">

                    <div className="card Agency incident-cards-draft">


                        <div className="text-end mt-2 d-flex ml-3 " style={{
                            justifyContent: isPreview ? "space-between" : "flex-end",
                            alignItems: "center",
                        }}>
                            {isPreview ? (
                                <>
                                    <div className=' d-flex align-items-center'>
                                        <span className='mr-3'><svg width="40" height="40" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="128" height="128" rx="24" fill="#D6ECFF" />
                                            <path d="M48 36h44v52H52v8h48V36h-8v44H48z" fill="#E30613" />
                                            <rect x="36" y="24" width="56" height="72" rx="4" fill="#0B2F80" />
                                            <rect x="48" y="38" width="32" height="6" rx="3" fill="white" />
                                            <rect x="48" y="50" width="40" height="6" rx="3" fill="white" />
                                            <rect x="48" y="62" width="40" height="6" rx="3" fill="white" />
                                            <rect x="48" y="74" width="24" height="6" rx="3" fill="white" />
                                        </svg>
                                        </span>
                                        <h5 className="fw-bold ">My Reports</h5>
                                    </div>
                                    <div className='d-flex ' style={{ alignItems: "center" }}>
                                        <h5 className="mr-3" style={{ fontSize: "30px", fontWeight: "600" }}>{queData?.length}</h5>
                                        <Link to="/assigned-Reports">
                                            <button className="see-all-btn mr-3 see_all-button">See All</button>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <></>

                            )}
                        </div>



                        <div className="card-body pt-2">
                            <DataTable
                                className='table-responsive_pastdues-draft'
                                data={queData?.filter(item => item.Status === "Draft")}
                                dense
                                columns={columns}
                                pagination
                                highlightOnHover
                                customStyles={tableCustomStyles}
                                noDataComponent={
                                    effectiveScreenPermission?.[0]?.DisplayOK
                                        ? 'There are no data to display'
                                        : 'You don’t have permission to view data'
                                }
                                fixedHeader
                                persistTableHead
                                fixedHeaderScrollHeight='400px'
                                paginationPerPage={100}
                                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                conditionalRowStyles={conditionalRowStyles}
                                onRowClicked={setClickedRow}
                                defaultSortFieldId={4}
                                defaultSortAsc={false}
                            />

                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}

export default DraftReport






const QueueReportsModal = (props) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ReportReview');
    const dispatch = useDispatch();
    const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
    const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

    const { editval, narrativeID, loginAgencyID, loginPinID, setModelStatus, WrittenForID } = props
    const [clickedRow, setClickedRow] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState('Approve');
    const [narrativeData, setnarrativeData] = useState([]);
    const [incidentID, setIncidentID] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [reportedPinActivity, setreportedPinActivity] = useState(false);
    const [narrativeTypeId, setnarrativeTypeId] = useState(false);
    const [AsOfDate, setAsOfDate] = useState('');
    const [filteredData, setfilteredData] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Individual");
    const [groupList, setGroupList] = useState([]);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );



    const [value, setValue] = useState({
        'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
        'IsApprove': true, 'IsReject': false, 'Comments': '', 'CommentsDoc': '', 'ApprovalComments': '', 'IsApprovedForward': '',
        'WrittenID': ''

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
        if (loginAgencyID) {
            dispatch(get_Report_Approve_Officer_Data(loginAgencyID));
            if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
            get_Group_List(loginAgencyID);
        }
    }, [loginAgencyID])

    const get_Group_List = (loginAgencyID) => {
        const value = { AgencyId: loginAgencyID, PINID: loginPinID }
        fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) {
                    setValue({
                        ...value,
                        ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
                        'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
                    });
                }
            }
            else {
                setGroupList();
            }
        })
    }




    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'IncidentID': editval[0]?.IncidentNumber,
                'CADIncidentNumber': editval[0]?.CADIncidentNumber,
                'ReportedBy_Description': editval[0]?.ReportedBy_Description,
                'ReportName': editval[0]?.ReportName,
                'sequence': editval[0]?.sequence,
                'CommentsDoc': editval[0]?.CommentsDoc,
                'Comments': editval[0]?.Comments,
                'NarrativeReport_Comments': editval[0]?.NarrativeReport_Comments,
                'WrittenID': editval[0]?.WrittenForID
            })
            setIsSaved(false);
            if (editval[0]?.CommentsDoc?.trim()) {
                setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0]?.CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
            }
            setIncidentID(editval[0]?.IncidentID)
            setAsOfDate(editval[0]?.AsOfDate ? getShowingDateText(editval[0]?.AsOfDate) : '');
            setnarrativeTypeId(editval[0]?.NarrativeTypeID)
            setreportedPinActivity(editval[0]?.ReportedByPINActivityID)

        }
        else {

            setValue({
                ...value,
                'IncidentID': '',
                'CADIncidentNumber': '',
                'ReportedBy_Description': '',
                'Comments': '',
                'sequence': '',
                'CommentsDoc': '',
                'WrittenID': ''
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


                setnarrativeData(res);
                const approvedData = res.filter(item => item.IsApprove === true);
                const rejectedData = res.filter(item => item.IsReject === true);
                setfilteredData(res)
            } else {
                setnarrativeData([]);
            }
        })
    }


    const Add_Type = () => {
        const { IsApprove, IsReject, Comments, CommentsDoc } = value
        const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
        const val = {
            'AgencyID': loginAgencyID,
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': '', 'IsApprove': value.IsApprove === undefined && value.IsReject === undefined ? true : value.IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject,
            'CommentsDoc': CommentsDoc,
            "ReportedByPINActivityID": reportedPinActivity,
            "NarrativeTypeID": narrativeTypeId, 'WrittenForID': value?.WrittenID,
            'Comments': Comments,
            'AsOfDate': AsOfDate,
            'ModifiedByUserFK': loginPinID,
        };
        AddDeleteUpadate('Narrative/Update_Narrative', val).then((res) => {
            Add_Type_Comments()
            get_Data_Narrative(narrativeID)
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            setIsSaved(true);
            setModelStatus(true);
            reset();
            navigate('/dashboard-page');
        })
    }



    const Add_Type_Comments = () => {
        const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments, ApprovingSupervisorID, IsApprovedForward } = value
        const type = selectedOption === "Individual" ? 'Individual' : 'Group';

        const val = {
            'AgencyID': loginAgencyID,
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': (value.IsApprove === undefined && value.IsReject === undefined) || IsApprovedForward ? true : value.IsApprove, 'CreatedByUserFK': loginPinID, 'IsApprovedForward': IsApprovedForward, 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject, 'Comments': ApprovalComments,
        };
        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
            const parseData = JSON.parse(res.data);
            resets();
        })
    }



    const reset = () => {
        setValue({
            ...value,
            'CommentsDoc': ''
        });
    }

    const resets = () => {
        setValue({
            ...value,
            'ApprovalComments': ''
        });
    }



    const handleRadioChange = (event) => {
        const selectedOptionnew = event.target.value;
        setApprovalStatus(selectedOptionnew);
        setValue(prevState => ({
            ...prevState,
            IsApprove: selectedOptionnew === 'Approve',
            IsReject: selectedOptionnew === 'Reject',
            IsApprovedForward: selectedOptionnew === 'ApproveAndForward',
        }));

        setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
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

        if (value.IsApprovedForward) {
            const ApprovalCommentsErr = RequiredFieldIncident(value?.ApprovalComments);
            const CommentsDocumentsErr = RequiredFieldIncident(value.Comments?.trim());
            const ApprovingOfficerErr = RequiredFieldIncident(value?.ApprovingSupervisorID);
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
                    ['CommentsDocumentsError']: CommentsDocumentsErr || prevValues['CommentsDocumentsError'],
                    ['ApprovingOfficerError']: ApprovingOfficerErr || prevValues['ApprovingOfficerError'],

                }
            })
        }
        else {
            const ApprovalCommentsErr = RequiredFieldIncident(value.ApprovalComments);
            const CommentsDocumentsErr = RequiredFieldIncident(value.Comments?.trim());
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
                    ['CommentsDocumentsError']: CommentsDocumentsErr || prevValues['CommentsDocumentsError'],
                }
            })
        }

    }
    const { ApprovalCommentsError, CommentsDocumentsError, ApprovingOfficerError } = errors

    useEffect(() => {
        if (value.IsApprovedForward) {
            if (ApprovalCommentsError === 'true' && CommentsDocumentsError === 'true' && ApprovingOfficerError === 'true') {
                Add_Type()
                resetserror();
            }
        }
        else {
            if (ApprovalCommentsError === 'true' && CommentsDocumentsError === 'true') {
                Add_Type()
                resetserror();
            }
        }
    }, [ApprovalCommentsError, CommentsDocumentsError, ApprovingOfficerError])

    const resetserror = () => {
        setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
    }

    const handleRadioChangeArrestForward = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
    };

    const Agencychange = (multiSelected) => {
        const id = []
        if (multiSelected) {
            multiSelected.map((item, i) => { id.push(item.value); })
            setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), })
        }
    }

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#d3d3d3' : '#fce9bf',
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
            cursor: isDisabled ? 'not-allowed' : 'default',
        }),
    };


    return (
        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '600px' }}>
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
                        <button className="btn-close b-none bg-transparent" onClick={() => { setActiveTab('ReportReview'); resetserror() }} data-dismiss="modal">X</button>
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

                                <div className='col-md-2'>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            value="ApproveAndForward"
                                            name="flexRadioDefault"
                                            id="Group"
                                            checked={value.IsApprovedForward}
                                            onChange={handleRadioChange}

                                        />
                                        <label className="form-check-label " htmlFor="Group">
                                            Approve and Forward
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {

                            }
                            <div className="row ">
                                <div className="col-12 col-md-12 col-lg-12">
                                    <div className="row ">
                                        {approvalStatus === 'ApproveAndForward' && (
                                            <>
                                                <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            name="approverType"
                                                            value="Individual"
                                                            className="form-check-input"
                                                            checked={selectedOption === "Individual"}
                                                            onChange={handleRadioChangeArrestForward}
                                                        />
                                                        <label className="form-check-label" htmlFor="Individual">
                                                            Individual
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            name="approverType"
                                                            value="Group"
                                                            className="form-check-input"
                                                            checked={selectedOption === "Group"}
                                                            onChange={handleRadioChangeArrestForward}
                                                        />
                                                        <label className="form-check-label" htmlFor="Group">
                                                            Group
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {approvalStatus?.trim() === "ApproveAndForward" && (
                                            <>
                                                {selectedOption === "Individual" ? (
                                                    <>
                                                        <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                                                            <span className="label-name">
                                                                Report Approver
                                                                {errors.ApprovingOfficerError !== 'true' && (
                                                                    <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px" }}>
                                                                        {errors.ApprovingOfficerError}
                                                                    </p>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                                                            <SelectBox
                                                                className="custom-multiselect"
                                                                classNamePrefix="custom"
                                                                options={reportApproveOfficer}
                                                                isMulti
                                                                required
                                                                styles={colourStylesUsers}
                                                                closeMenuOnSelect={false}
                                                                onChange={Agencychange}

                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                                                            <span className="label-name">
                                                                Approval Group
                                                                {errors.ApprovingOfficerError !== 'true' && (
                                                                    <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px" }}>
                                                                        {errors.ApprovingOfficerError}
                                                                    </p>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                                                            <SelectBox
                                                                className="custom-multiselect"
                                                                classNamePrefix="custom"
                                                                options={groupList}
                                                                isMulti
                                                                styles={colourStylesUsers}
                                                                closeMenuOnSelect={false}
                                                                hideSelectedOptions={true}
                                                                onChange={Agencychange}

                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Approve Section */}
                            {(approvalStatus === 'Approve' || approvalStatus === 'ApproveAndForward') && (
                                <>


                                    <div className="row g-3 ">
                                        <div className="col-md-6">
                                            <label className="fw-bold">Previous Comment</label>
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

                            {/* Reject Section */}
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
