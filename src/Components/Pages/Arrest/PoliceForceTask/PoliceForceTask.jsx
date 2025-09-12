import React, { useEffect, useState, useContext } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../Common/Utility';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import Select from "react-select";
import { Comman_changeArrayFormat, threeColVictimInjuryArray } from '../../../Common/ChangeArrayFormat';
import { get_AgencyOfficer_Data } from '../../../../redux/actions/IncidentAction';

const NIBRSAudit = () => {
    const [logData, setLogData] = useState([]);
    const dispatch = useDispatch();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [arrsetPoliceForceID, setArrsetPoliceForceID] = useState();
    const [editval, setEditval] = useState([]);
    const [ArrestNumber, setArrestNumber] = useState();
    const [IncidentNumber, setIncidentNumber] = useState();
    const [arrestID, setarrestID] = useState('');
    const [LastComments, setLastComments] = useState();

    const uniqueId = sessionStorage.getItem('UniqueUserID')
        ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
        : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param),
        };
    };

    const query = useQuery();
    let IncID = query?.get('IncId');

    if (!IncID) IncID = 0;

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID || loginPinID) {
            get_LogData(loginAgencyID, loginPinID);
        }
    }, [loginAgencyID, loginPinID]);

    const get_LogData = (loginAgencyID, loginPinID) => {
        const val = { 'AgencyID': loginAgencyID, 'OfficerID': loginPinID }
        fetchPostData('/ArrestPoliceForceTask/GetData_ArrestPoliceForceTask', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const GetSingleData = (arrsetPoliceForceID) => {
        const val = { 'ArrsetPoliceForceID': arrsetPoliceForceID, }
        fetchPostData('ArrestPoliceForceTask/GetSingleData_ArrestPoliceForceTask', val).then((res) => {
            if (res) {
                const lastComments = res[0].LastComments;
                setLastComments(lastComments);
                setEditval(res);
            } else {
                setEditval([]);
            }
        })
    }
    const columns = [
        {
            name: 'Review',
            sortable: true,
            cell: (row) => (
                <div className="text-start">
                    <button
                        type="button"
                        className="btn btn-sm btn-dark w-100 mb-1"
                        style={{ backgroundColor: '#001f3f', color: '#fff' }}
                        data-toggle="modal"
                        data-target="#PoliceForceTaskModal"
                        onClick={() => {
                            GetSingleData(row?.ArrsetPoliceForceID); setarrestID(row?.ArrestID)
                            setIncidentNumber(row?.IncidentNumber); setArrestNumber(row?.ArrestNumber);
                            setArrsetPoliceForceID(row?.ArrsetPoliceForceID);
                        }}
                    >
                        Review
                    </button>
                </div>
            ),
        },
        {
            name: 'Incident#',
            selector: (row) => row.IncidentNumber
            ,
            sortable: true,
        },
        {
            name: 'Arrest#',
            selector: (row) => row.ArrestNumber,
            sortable: true,
        },
        {
            name: 'Approving Officer/Group',
            selector: (row) => row.Approve_Officer,
            sortable: true,
        },
        {
            name: 'Submitted By',
            selector: (row) => row.CreateOfficer,
            sortable: true,
        },
        {
            name: 'Submitted DT/TM',
            selector: (row) => (row.CreatedDtTm_Sub ? getShowingDateText(row.CreatedDtTm_Sub) : ' '),

            sortable: true,
        },
        {
            name: 'Due Date',
            selector: (row) => (row.DueDate ? getShowingDateText(row.DueDate) : ' '),
            sortable: true,
        },
        // {
        //     name: 'Opened By',
        //     selector: (row) => row.Status,
        //     sortable: true,
        // },
    ];
    return (
        <>
            <div className="section-body view_page_design p-1 bt">
                <div className="col-12 col-sm-12">
                    <h5 className="fw-bold ml-3">Use Of Force Task</h5>
                    <div className="card Agency incident-card mt-2">
                        <DataTable
                            dense
                            columns={columns}
                            data={logData}
                            noDataComponent={'There is no data to display'}
                            selectableRowsHighlight
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            persistTableHead={true}
                            pagination
                            paginationPerPage={100}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                            fixedHeader
                            fixedHeaderScrollHeight="450px"
                        />
                    </div>
                </div>
            </div>
            <PoliceForceTaskModal editval={editval} LastComments={LastComments} arrestID={arrestID} IncidentNumber={IncidentNumber} ArrestNumber={ArrestNumber} arrsetPoliceForceID={arrsetPoliceForceID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} />
        </>
    );
};

export default NIBRSAudit;

const PoliceForceTaskModal = (props) => {
    const { editval, ArrestNumber, arrestID, IncidentNumber, LastComments, arrsetPoliceForceID, loginAgencyID, loginPinID, } = props

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const { setChangesStatus, policeForceDrpData, get_Police_Force } = useContext(AgencyContext);

    const [clickedRow, setClickedRow] = useState(null);
    const [activeTab, setActiveTab] = useState('Approve');
    const [isSaved, setIsSaved] = useState(false);

    const [gangInfoVal, setGangInfoVal] = useState([]);
    const [gangInfoVal1, setGangInfoVal1] = useState([]);
    const [policeForceDrp, setPoliceForceDrp] = useState([])
    const [InjuryTypeData, setInjuryTypeData] = useState([]);
    const [rightGivenCode, setRightGivenCode] = useState('N');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [policeForceData, setPoliceForceData] = useState();

    const [value, setValue] = useState({
        'ArrestID': '', 'ArrPoliceForceID': '', 'ArrPoliceForce_Nme': '', 'OfficerID': '', 'Officer_name': '', 'CreatedByUserFK': '',
        'Justification': '', 'SubjectInjuryID': '', 'RemarksNotes': '', 'InjuryTypeID': '', 'MedicalAssProvID': '', 'BodyCamFootageLinked': '',
        'ModifiedByUserFK': '', 'IsApprove': true, 'IsReject': false,
    })

    const [errors, setErrors] = useState({
        'ReportedByPinError': '', 'AsOfDateError': '', 'arrsetPoliceForceIDError': '', 'CommentsError': '',
    })

    const rejectColumns = [
        {
            name: 'Rejected By',
            selector: row => row.CreatedBy,
            sortable: true
        },
        {
            name: 'Reason For Rejection',
            selector: row => row.Comments,
            sortable: true
        },
        {
            name: 'Date Of Rejection',
            selector: row => row.CreatedDtTm,
            sortable: true
        },
    ];

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

    // const customStylesWithOutColor = {
    //     control: base => ({
    //         ...base,
    //         fontSize: 14, margintop: 2, boxShadow: 0,
    //     }),
    // };

    const customStylesWithOutColor = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#9d949436' : '#9d949436',
            // height: 20, minHeight: 30,
            fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };
    function filterGangsUsingIncludes(gangs, ids) {
        const idArray = ids?.split(',')?.map(Number);
        const arr = gangs?.filter(gang => idArray?.includes(gang.value));
        return arr
    }

    useEffect(() => {
        if (editval.length > 0) {
            setValue({
                ...value,
                'ArrsetPoliceForceID': arrsetPoliceForceID,
                'ArrPoliceForceID': editval[0]?.ArrPoliceForceID, 'ArrPoliceForce_Nme': editval[0]?.ArrPoliceForce_Nme,
                'OfficerID': editval[0]?.OfficerID, 'Officer_name': editval[0]?.Officer_name, 'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                'Justification': editval[0]?.Justification, 'SubjectInjuryID': editval[0]?.SubjectInjuryID, 'InjuryTypeID': editval[0]?.InjuryTypeID,
                'MedicalAssProvID': editval[0]?.MedicalAssProvID, 'BodyCamFootageLinked': editval[0]?.BodyCamFootageLinked,
                'RemarksNotes': editval[0]?.RemarksNotes, 'Status': editval[0]?.Status, 'ModifiedByUserFK': loginPinID,
            }); setRightGivenCode(Get_Given_Code(editval, policeForceDrpData)); setGangInfoVal(filterGangsUsingIncludes(agencyOfficerDrpData, editval[0]?.OfficerID));
            setGangInfoVal1(filterGangsUsingIncludes(policeForceDrp, editval[0]?.ArrPoliceForceID));
        } else {
            setValue({
                ...value,
                'ArrPoliceForceID': '', 'ArrPoliceForce_Nme': '', 'OfficerID': '', 'Justification': '',
                'SubjectInjuryID': '', 'InjuryTypeID': '', 'MedicalAssProvID': '', 'BodyCamFootageLinked': '', 'RemarksNotes': '',
                'Officer_Name': '', 'ArrPoliceForce_Description': '', 'Status': ''
            });
            setGangInfoVal([]); setGangInfoVal1([])
        }
    }, [editval]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (event) {
            setValue((prevState) => ({ ...prevState, [name]: value, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    useEffect(() => {
        get_Data_PoliceForce(arrsetPoliceForceID)
    }, [arrsetPoliceForceID])

    useEffect(() => {
        setActiveTab('Approve');
    }, []);

    const get_Data_PoliceForce = (arrsetPoliceForceID) => {
        const val = { 'ArrsetPoliceForceID': arrsetPoliceForceID }
        fetchPostData('ArrestPoliceForceTask/GetData_ArrestPoliceForceTaskComments', val).then((res) => {
            if (res) {
                setPoliceForceData(res);
            } else {
                setPoliceForceData();
            }
        })
    }

    const Add_Type = () => {
        const { ArrestID, ArrPoliceForceID, OfficerID, CreatedByUserFK, Justification,
            SubjectInjuryID, InjuryTypeID, MedicalAssProvID, BodyCamFootageLinked, RemarksNotes, MultiAgency_Name, Officer_name, ArrPoliceForce_Nme } = value;
        const approvalStatus = activeTab === 'IsApprove' ? true : false;
        const val = {
            'ArrestID': arrestID, 'ArrPoliceForceID': ArrPoliceForceID, 'ArrPoliceForce_Nme': ArrPoliceForce_Nme, 'OfficerID': OfficerID, 'Officer_name': Officer_name,
            'SubjectInjuryID': SubjectInjuryID, 'InjuryTypeID': InjuryTypeID, 'Justification': Justification, 'MedicalAssProvID': MedicalAssProvID, 'BodyCamFootageLinked': BodyCamFootageLinked, 'RemarksNotes': RemarksNotes,
            'CreatedByUserFK': loginPinID, 'ApprovalStatus': approvalStatus,
        }
        AddDeleteUpadate('ArrsetPoliceForce/Update_ArrsetPoliceForce', val).then((res) => {
            Add_Type_Comments(); get_Data_PoliceForce(arrestID);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            setIsSaved(true); reset(); navigate('/dashboard-page');
        })
    }

    const Add_Type_Comments = () => {
        const { IsApprove, IsReject, Comments, ArrestID, ArrPoliceForceID, OfficerID, CreatedByUserFK, Justification,
            SubjectInjuryID, InjuryTypeID, MedicalAssProvID, BodyCamFootageLinked, RemarksNotes, MultiAgency_Name, Officer_name, ArrPoliceForce_Nme } = value
        const val = {
            'IsApprove': IsApprove, 'IsReject': IsReject, 'Comments': Comments, 'ArrsetPoliceForceID': arrsetPoliceForceID,
            'ArrestID': arrestID, 'ArrPoliceForceID': ArrPoliceForceID, 'ArrPoliceForce_Nme': ArrPoliceForce_Nme, 'OfficerID': OfficerID, 'Officer_name': Officer_name,
            'SubjectInjuryID': SubjectInjuryID, 'InjuryTypeID': InjuryTypeID, 'Justification': Justification, 'MedicalAssProvID': MedicalAssProvID, 'BodyCamFootageLinked': BodyCamFootageLinked, 'RemarksNotes': RemarksNotes,
            'CreatedByUserFK': loginPinID,
        };
        AddDeleteUpadate('ArrestPoliceForceTask/Insert_ArrestPoliceForceTask', val).then((res) => {
            const parseData = JSON.parse(res.data);
            resets();
        })
    }

    const reset = () => {
        setValue({ ...value, 'Comments': '', });
    }

    const resets = () => {
        setValue({ ...value, 'Comments': '', });
    }

    const check_Validation_ErrorApproval = () => {
        if (RequiredFieldIncident(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['ApprovalCommentsError']: RequiredFieldIncident(value.Comments) } })
        }
    }
    const { ApprovalCommentsError } = errors

    useEffect(() => {
        if (ApprovalCommentsError === 'true') {
            Add_Type()
            resetserror();
        }
    }, [ApprovalCommentsError])

    const check_Validation_ErrorApproval1 = () => {
        if (RequiredFieldIncident(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['ApprovalCommentsError1']: RequiredFieldIncident(value.Comments) } })
        }
    }
    const { ApprovalCommentsError1 } = errors

    useEffect(() => {
        if (ApprovalCommentsError1 === 'true') {
            Add_Type()
            resetserror1();
        }
    }, [ApprovalCommentsError1])


    const resetserror = () => {
        setErrors({ ...errors, ['ApprovalCommentsError']: '', })
    }

    const resetserror1 = () => {
        setErrors({ ...errors, ['ApprovalCommentsError1']: '', })
    }

    useEffect(() => {
        if (loginAgencyID) {
            get_Polic_Force(loginAgencyID); get_InjuryTypeData(loginAgencyID)
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));
            if (policeForceDrpData?.length === 0) { get_Police_Force(); }
        }
    }, [loginAgencyID])

    const get_Polic_Force = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PoliceForce/GetDataDropDown_PoliceForce', val).then((data) => {
            if (data) {
                setPoliceForceDrp(Comman_changeArrayFormat(data, 'PoliceForceID', 'Description'));
            }
            else { setPoliceForceDrp([]) }
        })
    };

    const get_InjuryTypeData = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('/InjuryVictim/GetData_InsertVictimInjury', val).then((res) => {
            if (res) {
                setInjuryTypeData(threeColVictimInjuryArray(res, 'VictimInjuryID', 'Description', 'InjuryCode'))
            } else {
                setInjuryTypeData();
            }
        })
    }

    const onChangeGangInfo = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        const id = []
        if (e) {
            e.map((item, i) => { id.push(item.value); })
            setGangInfoVal(e); setGangInfoVal1(e)
            setValue({ ...value, [name]: id.toString(), });
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    const handleChange1 = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const ChangeDropDown1 = (e, name) => {
        let newValue = { ...value };
        if (e) {
            newValue[name] = e.value; setStatesChangeStatus(true)
            if (name === 'SubjectInjuryID') {
                setRightGivenCode(e.id);
            }
            setChangesStatus(true); setValue(newValue);
        } else {
            if (name === 'SubjectInjuryID') {
                setRightGivenCode('N');
            }
            setStatesChangeStatus(true); setChangesStatus(true); setValue(newValue);
            newValue[name] = null;
        }
    };

    const colourStylesUser = {
        control: (styles) =>
        ({
            ...styles, backgroundColor: "#9d949436",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value })
            setChangesStatus(true); setStatesChangeStatus(true)
        } else {
            setValue({ ...value, [name]: null })
            setChangesStatus(true); setStatesChangeStatus(true)
        }
    }

    const handleRadioChange1 = (event) => {
        const selectedOption = event.target.value;
        setActiveTab(selectedOption);
        setValue(prevState => ({
            ...prevState,
            IsApprove: selectedOption === 'Approve',
            IsReject: selectedOption === 'Reject',
        }));
    };

    return (

        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PoliceForceTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content p-2 px-4 approvedReportsModal" >
                    <div className="d-flex justify-content-between">
                        <div className='row mt-1 mb-2'>
                            <div className='col-12'>
                                <h5 class="fw-bold mb-3">Use Of Force Review </h5>
                            </div>
                        </div>
                        <button className="btn-close b-none bg-transparent" onClick={() => { setActiveTab('Approve'); setErrors('') }} data-dismiss="modal">X</button>
                    </div>

                    <div className='row mt-1'>
                        <div className='col-md-2'>
                            <label className="me-4">
                                <input
                                    type="radio"
                                    value="Approve"
                                    name='IsApprove'
                                    checked={value.IsApprove}
                                    onChange={handleRadioChange1}
                                />
                                Approve
                            </label>
                        </div>
                        <div className='col-md-2'>
                            <label>
                                <input
                                    type="radio"
                                    value="Reject"
                                    name='IsReject'
                                    checked={value.IsReject}
                                    onChange={handleRadioChange1}
                                />
                                Reject
                            </label>
                        </div>
                    </div>

                    {activeTab === 'Approve' && (
                        <>
                            <div className="row align-items-center ">
                                <div className="col-2 col-md-2 col-lg-2 mt-1">
                                    <label htmlFor="" className='new-label px-0 text-nowrap'>Incident#</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 text-field  mt-1">
                                    <input
                                        type="text" className="form-control" name='IncidentNumber' value={IncidentNumber} id='IncidentNumber' readOnly
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Arrest#</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 text-field  mt-1">
                                    <input
                                        type="text" className="form-control" name='ArrestNumber' value={ArrestNumber} id='ArrestNumber' readOnly
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label text-nowrap '>Force Type</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 mt-1">
                                    <Select
                                        isMulti
                                        // Disabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        styles={colourStylesUser}
                                        value={gangInfoVal1}
                                        onChange={(e) => onChangeGangInfo(e, 'ArrPoliceForceID', 'ArrPoliceForce_Nme')}
                                        options={policeForceDrp}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled

                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Officers Involved</label>
                                </div>

                                <div className="col-4 col-md-4 col-lg-4 mt-1">
                                    <Select
                                        isMulti
                                        Disabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        styles={colourStylesUser}
                                        value={gangInfoVal}
                                        onChange={(e) => onChangeGangInfo(e, 'OfficerID', 'Officer_name')}
                                        options={agencyOfficerDrpData}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
                                    <label htmlFor="" className='new-label'>Justification</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-10 mt-2 text-field">
                                    <input type="text" className="form-control" name='Justification' onChange={handleChange1} id="Justification" value={value.Justification} readOnly />
                                </div>

                                <div className="col-2 col-md-2 col-lg-2 mt-1">
                                    <label htmlFor="" className='new-label px-0 text-nowrap'>Subject Injury</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 ">
                                    <Select
                                        name='SubjectInjuryID'
                                        styles={customStylesWithOutColor}
                                        value={policeForceDrpData?.filter((obj) => obj.value === value?.SubjectInjuryID)}
                                        isClearable
                                        options={policeForceDrpData}
                                        // onChange={(e) => ChangeDropDown(e, 'PoliceForceID')}
                                        onChange={(e) => {
                                            ChangeDropDown1(e, 'SubjectInjuryID');
                                            // if (!e) { setShowPoliceForce(false); }
                                        }}
                                        // isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        isDisabled
                                        placeholder="Select..."
                                    />

                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Injury Type</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 ">
                                    <Select
                                        name='InjuryTypeID'
                                        menuPlacement='top'
                                        styles={customStylesWithOutColor}
                                        value={InjuryTypeData?.filter((obj) => obj.value === value?.InjuryTypeID)}
                                        isClearable
                                        options={InjuryTypeData}
                                        onChange={(e) => ChangeDropDown1(e, 'InjuryTypeID')}
                                        placeholder="Select..."
                                        isDisabled
                                    // isDisabled={rightGivenCode === 'N' || !rightGivenCode}
                                    // isDisabled={rightGivenCode === 'N' ? true : false}
                                    />
                                </div>

                                <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                    <label htmlFor="" className='new-label text-nowrap '>Medical Assistance Provided</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                    <Select
                                        name='MedicalAssProvID'
                                        styles={customStylesWithOutColor}
                                        value={policeForceDrpData?.filter((obj) => obj.value === value?.MedicalAssProvID)}
                                        isClearable
                                        options={policeForceDrpData}
                                        // onChange={(e) => ChangeDropDown(e, 'PoliceForceID')}
                                        onChange={(e) => {
                                            ChangeDropDown(e, 'MedicalAssProvID');
                                            // if (!e) { setShowPoliceForce(false); }
                                        }}
                                        placeholder="Select..."
                                        isDisabled

                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                    <label htmlFor="" className='new-label'>Body Cam Footage Linked</label>
                                </div>
                                {/* <div className="col-4 col-md-4 col-lg-2 mt-1"> */}
                                <div className="col-4 col-md-4 col-lg-3 text-field  mt-1">
                                    <input
                                        type="text" name='BodyCamFootageLinked' className="form-control" onChange={handleChange} value={value.BodyCamFootageLinked} id='BodyCamFootageLinked' readOnly
                                    />
                                </div>

                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                    <label htmlFor="" className='label-name '>Remarks/Notes</label>
                                </div>
                                <div className="col-10 col-md-10 col-lg-10 mb-0 mt-1" >
                                    <textarea name='RemarksNotes' id="RemarksNotes" onChange={handleChange} value={value.RemarksNotes} cols="20" rows='1' className="form-control " readOnly
                                    ></textarea>
                                </div>


                                <div className="col-lg-12">
                                    <label className="fw-bold">Enter Reason for Approval{errors.ApprovalCommentsError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError}</p>
                                    ) : null}</label>
                                    <textarea
                                        className="form-control"
                                        style={{ minHeight: '50px', background: '#fef6e4' }}
                                        placeholder="Enter Reason for Approval"
                                        name="Comments"
                                        value={value?.Comments}

                                        onChange={(e) => { handleChange(e) }}
                                    ></textarea>
                                </div>

                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                {!isSaved && (
                                    <button className="btn btn-primary " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={(e) => { check_Validation_ErrorApproval(); }}>Save</button>

                                )}
                            </div>
                        </>

                    )}

                    {activeTab === 'Reject' && (
                        <>
                            <div className="row align-items-center ">
                                <div className="col-2 col-md-2 col-lg-2 mt-1">
                                    <label htmlFor="" className='new-label px-0 text-nowrap'>Incident#</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 text-field  mt-1">
                                    <input
                                        type="text" className="form-control" name='IncidentNumber' value={IncidentNumber} id='IncidentNumber' readOnly
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Arrest#</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 text-field  mt-1">
                                    <input
                                        type="text" className="form-control" name='ArrestNumber' value={ArrestNumber} id='ArrestNumber' readOnly
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label text-nowrap '>Force Type</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 mt-1">
                                    <Select
                                        isMulti
                                        // Disabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        styles={colourStylesUser}
                                        value={gangInfoVal1}
                                        onChange={(e) => onChangeGangInfo(e, 'ArrPoliceForceID', 'ArrPoliceForce_Nme')}
                                        options={policeForceDrp}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled

                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Officers Involved</label>
                                </div>

                                <div className="col-4 col-md-4 col-lg-4 mt-1">
                                    <Select
                                        isMulti
                                        Disabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        styles={colourStylesUser}
                                        value={gangInfoVal}
                                        onChange={(e) => onChangeGangInfo(e, 'OfficerID', 'Officer_name')}
                                        options={agencyOfficerDrpData}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
                                    <label htmlFor="" className='new-label'>Justification</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-10 mt-2 text-field">
                                    <input type="text" className="form-control" name='Justification' onChange={handleChange1} id="Justification" value={value.Justification} readOnly />
                                </div>

                                <div className="col-2 col-md-2 col-lg-2 mt-1">
                                    <label htmlFor="" className='new-label px-0 text-nowrap'>Subject Injury</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 ">
                                    <Select
                                        name='SubjectInjuryID'
                                        styles={customStylesWithOutColor}
                                        value={policeForceDrpData?.filter((obj) => obj.value === value?.SubjectInjuryID)}
                                        isClearable
                                        options={policeForceDrpData}
                                        // onChange={(e) => ChangeDropDown(e, 'PoliceForceID')}
                                        onChange={(e) => {
                                            ChangeDropDown1(e, 'SubjectInjuryID');
                                            // if (!e) { setShowPoliceForce(false); }
                                        }}
                                        // isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved'}
                                        isDisabled
                                        placeholder="Select..."
                                    />

                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label'>Injury Type</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 ">
                                    <Select
                                        name='InjuryTypeID'
                                        menuPlacement='top'
                                        styles={customStylesWithOutColor}
                                        value={InjuryTypeData?.filter((obj) => obj.value === value?.InjuryTypeID)}
                                        isClearable
                                        options={InjuryTypeData}
                                        onChange={(e) => ChangeDropDown1(e, 'InjuryTypeID')}
                                        placeholder="Select..."
                                        isDisabled
                                    // isDisabled={rightGivenCode === 'N' || !rightGivenCode}
                                    // isDisabled={rightGivenCode === 'N' ? true : false}
                                    />
                                </div>

                                <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                    <label htmlFor="" className='new-label text-nowrap '>Medical Assistance Provided</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                    <Select
                                        name='MedicalAssProvID'
                                        styles={customStylesWithOutColor}
                                        value={policeForceDrpData?.filter((obj) => obj.value === value?.MedicalAssProvID)}
                                        isClearable
                                        options={policeForceDrpData}
                                        // onChange={(e) => ChangeDropDown(e, 'PoliceForceID')}
                                        onChange={(e) => {
                                            ChangeDropDown(e, 'MedicalAssProvID');
                                            // if (!e) { setShowPoliceForce(false); }
                                        }}
                                        placeholder="Select..."
                                        isDisabled

                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                    <label htmlFor="" className='new-label'>Body Cam Footage Linked</label>
                                </div>
                                {/* <div className="col-4 col-md-4 col-lg-2 mt-1"> */}
                                <div className="col-4 col-md-4 col-lg-3 text-field  mt-1">
                                    <input
                                        type="text" name='BodyCamFootageLinked' className="form-control" onChange={handleChange} value={value.BodyCamFootageLinked} id='BodyCamFootageLinked' readOnly
                                    />
                                </div>

                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                    <label htmlFor="" className='label-name '>Remarks/Notes</label>
                                </div>
                                <div className="col-10 col-md-10 col-lg-10 mb-0 mt-1" >
                                    <textarea name='RemarksNotes' id="RemarksNotes" onChange={handleChange} value={value.RemarksNotes} cols="20" rows='1' className="form-control " readOnly
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mb-3 mt-4">
                                <label className="fw-bold">Rejected Comment</label>
                                <DataTable
                                    data={policeForceData}
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

                            <div className="row g-3 ">
                                <div className="col-md-6">
                                    <label className="fw-bold">Previous Reason for Rejection</label>

                                    <textarea
                                        className="form-control"
                                        style={{ minHeight: '50px', background: '#fef6e4' }}
                                        placeholder=""
                                        name="Comments"
                                        value={LastComments} id='Comments' readOnly
                                    />

                                </div>
                                <div className="col-md-6">
                                    <label className="fw-bold">Enter Reason for Rejection{errors.ApprovalCommentsError1 !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError1}</p>
                                    ) : null}</label>
                                    <textarea
                                        className="form-control"
                                        style={{ minHeight: '50px', background: '#fef6e4' }}
                                        placeholder=""
                                        name="Comments"
                                        value={value?.Comments}
                                        onChange={(e) => { handleChange(e) }}

                                    // onChange={(e) => { handleChange(e) }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-4">
                                {!isSaved && (
                                    <button className="btn btn-primary " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={(e) => { check_Validation_ErrorApproval1(); }}>Save</button>

                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>

    );
};

const Get_Given_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.SubjectInjuryID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}