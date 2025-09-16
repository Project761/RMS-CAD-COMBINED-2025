import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { fetchPostData } from '../../hooks/Api';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime, getShowingWithFixedTime01, getShowingWithOutTime, stringToBase64, tableCustomStyles, } from '../../Common/Utility';
import '../../../style/incident.css';
import Loader from '../../Common/Loader';
import { toastifyError } from '../../Common/AlertMsg';
import { useDispatch, useSelector } from 'react-redux';
import { Incident_ID, Incident_Number } from '../../../redux/actionTypes';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import IncidentSummaryModel from '../SummaryModel/IncidentSummaryModel';
import * as XLSX from 'xlsx';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import IncidentPrintReport from './IncidentPrintReport';
import { useReactToPrint } from 'react-to-print';
import { useLocation } from 'react-router-dom';

const Incident = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setShowIncPage, setTabCount, setIncidentCount, incidentRecentData, setIncidentRecentData, exceptionalClearID, GetDataExceptionalClearanceID, rmsDisposition, getRmsDispositionID, incidentSearchData, setIncidentSearchData, incAdvSearchData, setIncAdvSearchData, setPropertyCount, setVehicleCount, GetDataTimeZone, datezone, recentSearchData, setRecentSearchData, searchObject, setSearchObject } = useContext(AgencyContext);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [incSummModal, setIncSummModal] = useState(false);
    const [updateCount, setupdateCount] = useState(1);
    const [otherColID, setOtherColID] = useState('');

    // Filter Option
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');
    const [incidentData, setIncidentData] = useState();
    const [incidentFilterData, setIncidentFilterData] = useState();
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [loder, setLoder] = useState(false);
    const [originalIncidentData, setOriginalIncidentData] = useState([]);
    const [advanceSearch, setadvanceSearch] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [agencysingledata, setagencysingleData] = useState([]);
    const [multiImage, setMultiImage] = useState([]);

    //Assign Incident 
    const [loginAgencyID, setLoginAgencyID] = useState('');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let Recent = query?.get('Recent');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("I096", localStoreData?.AgencyID, localStoreData?.PINID));
            // dispatch(get_ScreenPermissions_Data("I034", localStoreData?.AgencyID, localStoreData?.PINID));
            setadvanceSearch(incidentSearchData);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID, 'PINID': localStoreData?.PINID });
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    // --- DS
    useEffect(() => {
        const defaultReportedDate = getShowingWithOutTime(datezone);
        const defaultReportedDateTo = getShowingWithFixedTime(datezone);
        setValue(prevState => ({
            ...prevState, 'ReportedDate': defaultReportedDate, 'ReportedDateTo': defaultReportedDateTo,
        }));
        if (loginAgencyID) {
            // getIncidentData();
            get_Edit_Agency_Data(loginAgencyID); getAgencyImg(loginAgencyID)

        }
        setShowIncPage('home');
    }, [loginAgencyID, datezone]);

    const exportToExcel = () => {
        const filteredData = incidentSearchData?.map(item => ({
            'Incident': item.IncidentNumber, 'Occured To': item.OccurredTo ? getShowingDateText(item.OccurredTo) : " ",
            'Reported Date/Time': item.ReportedDate ? getShowingDateText(item.ReportedDate) : " ", 'Location': item?.CrimeLocation,
        }));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const [value, setValue] = useState({
        'ReportedDate': getShowingWithOutTime(datezone), 'ReportedDateTo': getShowingWithFixedTime(datezone), 'IsHomeIncidentSearch': true,
        'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '', 'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': '', 'AgencyID': '',
    });

    useEffect(() => {
        if (loginAgencyID) {
            if (Recent === 'Incident' && searchObject?.SearchModule === 'Inc-Search') { getIncRecentSearchData(searchObject); } else { getIncidentData(); }
        }
        setShowIncPage('home');
    }, [loginAgencyID, incAdvSearchData, searchObject])


    const getIncidentData = async () => {
        // console.log("getIncidentData Calll ON click Reset");
        // console.log("searchObject", searchObject);
        if (!incAdvSearchData) {
            fetchPostData('Incident/Search_Incident', Recent === 'Incident' && searchObject?.SearchModule === "Inc-Search" ? searchObject : value).then((res) => {
                if (res) {
                    setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true); setIncidentSearchData([]);
                    reset_Fields();

                    if (Recent === 'Incident' && searchObject?.SearchModule === "Inc-Search") {
                        setValue({ ...value, 'ReportedDate': getShowingWithOutTime(searchObject?.ReportedDate), 'ReportedDateTo': getShowingWithFixedTime(searchObject?.ReportedDateTo), });
                    }

                } else {
                    setLoder(true); setIncidentFilterData([]); setIncidentSearchData([]);

                }
            })
        } else { setAdvancedSearch(false); setLoder(true); reset_Fields(); }
    }

    const getIncRecentSearchData = async (value) => {
        // console.log("getIncRecentSearchData Calll ON click Reset");
        try {
            const res = await fetchPostData('Incident/Search_Incident', value);
            if (res.length > 0) {
                setIncidentSearchData(res); setIncAdvSearchData(true);
                setIncAdvSearchData(false); setOriginalIncidentData(res);
                setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true);
                reset_Fields();

                setValue({ ...value, 'ReportedDate': getShowingWithOutTime(value?.ReportedDate), 'ReportedDateTo': getShowingWithFixedTime(value?.ReportedDateTo), });
            } else {
                toastifyError("No Data Available"); setLoder(true); setIncidentFilterData([]);
            }
        } catch (error) {
            setLoder(true); setIncidentFilterData([]);
        }
    }

    const getIncidentSearchData = async () => {
        fetchPostData('Incident/Search_Incident', value).then((res) => {
            if (res.length > 0) {
                setIncidentSearchData(res); setIncAdvSearchData(true);
                setIncAdvSearchData(false); setOriginalIncidentData(res);
                setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true);

                setRecentSearchData([...recentSearchData, { ...value, "SearchModule": "Inc-Search" }]);
            } else {
                toastifyError("No Data Available"); setLoder(true); setIncidentFilterData([]);
            }
        });
    }

    const onClick_Reset = () => {
        // setValue({ ...value, 'ReportedDate': getShowingWithOutTime(datezone), 'ReportedDateTo': getShowingWithFixedTime(datezone), 'IncidentNumber': '' });
        setCurrentDateData();
        setIncAdvSearchData(false);
    }

    const setCurrentDateData = () => {
        const val = {
            'IsHomeIncidentSearch': true,
            'ReportedDate': getShowingWithOutTime(datezone), 'ReportedDateTo': getShowingWithFixedTime(datezone),
            'IncidentNumber': '',
            'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '', 'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': localStoreData?.PINID, 'AgencyID': loginAgencyID,
        }
        fetchPostData('Incident/Search_Incident', val).then((res) => {
            if (res?.length > 0) {
                setIncAdvSearchData(false); setOriginalIncidentData(res);
                setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true);
                reset_Fields();
                navigate('/Incident');
            } else {
                if (incidentSearchData.length < 0) {
                    toastifyError("No Data Available");
                }
                setLoder(true); setIncidentFilterData([]);
            }
        });
    }

    const columns = [
        {
            grow: 0,
            minWidth: "80px",
            omit: incAdvSearchData == true ? false : true,
            // omit: true,
            cell: row =>
                <div className="div" >
                    <a data-toggle="modal" data-target="#IncSummaryModel"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            setupdateCount(updateCount + 1);
                            if (row?.IncidentID) {

                                setIncSummModal(true);
                                setOtherColID(row?.IncidentID);
                            }
                        }}
                    >
                        MS
                    </a>
                </div>,
        },
        {
            grow: 0,
            minWidth: "80px",
            omit: incAdvSearchData === "kdsjfhkjsdfsdf" ? true : false,
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => (
                <div style={{ position: 'absolute', top: 4, zIndex: 0 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`}
                                    onClick={(e) => { set_IncidentId(row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                    <i className="fa fa-edit"></i>
                                </Link>
                                :
                                <></>
                            : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`}
                                onClick={(e) => { set_IncidentId(row); }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>)
        },
        {
            grow: 1,
            minWidth: "85px",
            name: 'Agency Code',
            selector: (row) => row.Agency_Code,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "85px",
            name: 'Incident #',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            grow: 2,
            minWidth: "200px",
            name: 'Offense',
            selector: (row) => row.OffenseName_Description,
            sortable: true
        },

        {
            grow: 1,
            minWidth: "160px",
            name: 'CAD CFS ',
            selector: (row) => row.CADCFSCode_Description,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "160px",
            name: 'Primary Officer',
            selector: (row) => row.PrimaryOfficer,
            sortable: true
        },

        {
            grow: 1,
            minWidth: "180px",
            name: 'CAD Disposition',
            selector: (row) => row.RMS_Disposition,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "180px",
            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : " ",
            sortable: true
        },
        {
            grow: 2,
            minWidth: "220px",
            name: 'Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 30) : ''}{row?.CrimeLocation?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            grow: 2,
            minWidth: "220px",
            name: 'Case Status',
            selector: (row) => row.NIBRSStatus,
            sortable: true
        },
        {
            grow: 0,
            minWidth: "130px",
            name: 'Offense Count',
            selector: (row) => row.OffenceCount,
            sortable: true,
        },
        {
            grow: 0,
            minWidth: "130px",
            name: 'Name Count',
            selector: (row) => row.NameCount,
            sortable: true
        },
        {
            grow: 0,
            minWidth: "130px",
            name: 'Property Count',
            selector: (row) => row.PropertyCount,
            sortable: true
        },
        {
            grow: 0,
            minWidth: "130px",
            name: 'Vehicle Count',
            selector: (row) => row.VehicleCount,
            sortable: true
        },
        {
            grow: 0,
            minWidth: "130px",
            name: 'Report Count',
            selector: (row) => row.ReportCount,
            sortable: true
        },
    ]

    const getStatusColors = (row) => {
        return !row?.OffenseName_Description ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => getStatusColors(row),
        },
    ];

    const set_IncidentId = (row) => {
        let newData = [...incidentRecentData];
        let currentItem = newData.find((item) => row.IncidentID === item.IncidentID);
        if (!currentItem) {
            newData.push(row);
        }
        setIncidentRecentData(newData);
        if (row.IncidentID) {
            dispatch({ type: Incident_ID, payload: row?.IncidentID });
            dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
        }
    }

    const reset_Fields = () => {
        setValue({
            ...value,
            'IncidentNumber': '',
            'ReportedDate': getShowingWithOutTime(datezone), 'ReportedDateTo': getShowingWithFixedTime(datezone),
            'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '',
            'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '', 'DispositionDate': '', 'DispositionDateTo': '',
            'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '',
        });
    }

    useEffect(() => {
        if (advancedSearch) {
            if (loginAgencyID) {
                getRmsDispositionID(loginAgencyID); GetDataExceptionalClearanceID(loginAgencyID);
            }
        }
    }, [loginAgencyID, advancedSearch]);

    const click_AdvanceSearch = () => {
        setValue({ ...value, 'ReportedDate': '', 'ReportedDateTo': '', });
    }

    const Filter = (data, searchText, key1, key2, key3) => {
        if (!searchText) return data;
        return data?.filter(item =>
        (item[key1]?.toLowerCase().includes(searchText.toLowerCase()) ||
            item[key2]?.toLowerCase().includes(searchText.toLowerCase()) ||
            item[key3]?.toLowerCase().includes(searchText.toLowerCase()))
        );
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchValue1(val);
        if (val === "" && incAdvSearchData) {
            // getIncidentSearchData();
            setIncidentSearchData(advanceSearch);
        }
        else if (val === "" && !incAdvSearchData) {
            getIncidentSearchData();
        }
        else if (incidentFilterData) {
            const result = Filter(incidentFilterData, val, 'IncidentNumber');
            setIncidentFilterData(result);
        } else if (incidentSearchData) {
            const result = Filter(incidentSearchData, val, 'IncidentNumber');
            setIncidentSearchData(result);
        }
    };

    const handleSearch1 = (e) => {
        const val = e.target.value;
        setSearchValue2(val);
        if (val === "" && incAdvSearchData) {
            setIncidentSearchData(advanceSearch);
        }
        else if (val === "" && !incAdvSearchData) {
            getIncidentSearchData();
        }
        else if (incidentFilterData) {
            const result = Filter(incidentFilterData, val, 'OffenseName_Description');
            setIncidentFilterData(result);
        } else if (incidentSearchData) {
            const result = Filter(incidentSearchData, val, 'OffenseName_Description');
            setIncidentSearchData(result);
        }
    };

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => setSelectedStatus(false),
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
        }
    }, [selectedStatus]);

    const get_Edit_Agency_Data = async (Aid) => {
        const value = { AgencyID: Aid };
        fetchPostData("Agency/GetData_SingleData", value).then((res) => {
            if (res && res.length > 0) {
                setagencysingleData(res);
            } else {
                setagencysingleData([]);
            }
        });
    };

    const getAgencyImg = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("errror") }
        })
    }

    const HandleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };


    //----------------------------ds---------------------------------
    useEffect(() => {
        if (value?.IncidentNumber?.trim() === '') {
            // setCurrentDateData();
        }
    }, [value?.IncidentNumber]);


    const getIncidentNoSearch = async () => {
        if (!value?.IncidentNumber?.trim()) {
            toastifyError("Incident Number is required");
            return;
        }
        const newValue = { ...value, ReportedDate: '', ReportedDateTo: '' };
        fetchPostData('Incident/Search_Incident', newValue).then((res) => {
            if (res?.length === 1) {
                const row = res[0];
                if (row?.SealUnsealStatus === true) {
                    toastifyError("This incident is sealed");
                    return; // Stop further execution if needed
                }
                dispatch({ type: Incident_ID, payload: row?.IncidentID });
                dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
                navigate(`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`);
            } else if (res?.length > 1) {
                setIncidentSearchData(res); setOriginalIncidentData(res); setIncidentFilterData(res);
            } else {
                toastifyError("No Data Available");
                setIncidentSearchData([]); setIncidentFilterData([]);
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') { getIncidentNoSearch(); }
    };
    const isValidDate = (d) => d && !isNaN(new Date(d).getTime());

    return (
        <>
            <div className="col-12">
                <div className="d-flex mt-2">
                    <div className="col-12">
                        <div className="row mt-2">
                            <div className="col-4 col-md-4 col-lg-1 mt-2">
                            </div>
                            <div className="col-7 col-md-7 col-lg-2  mt-1 ">

                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mb-1">
                                <div className="dropdown__box mt-0">
                                    <DatePicker
                                        name='ReportedDate'
                                        id='ReportedDate'
                                        onChange={(date) => {
                                            if (date) {
                                                setValue({
                                                    ...value,
                                                    ['ReportedDate']: date ? getShowingWithFixedTime01(date) : null,
                                                    ['ReportedDateTo']: getShowingWithFixedTime(new Date(datezone))
                                                })
                                            } else {
                                                setValue({ ...value, ['ReportedDate']: null, ['ReportedDateTo']: null, })
                                            }
                                        }}
                                        selected={
                                            value?.ReportedDate && !isNaN(new Date(value?.ReportedDate).getTime()) ? new Date(value?.ReportedDate) : null
                                        }
                                        dateFormat="MM/dd/yyyy"
                                        timeInputLabel
                                        isClearable={value?.ReportedDate ? true : false}
                                        // peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete='Off'
                                        disabled={false}
                                        maxDate={new Date(datezone)}
                                        placeholderText='Select From Date...'
                                    />
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mb-1">
                                <div className="dropdown__box mt-0">
                                    <DatePicker
                                        name='ReportedDateTo'
                                        id='ReportedDateTo'
                                        onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingWithFixedTime(date) : null }) }}
                                        selected={
                                            value?.ReportedDateTo && !isNaN(new Date(value?.ReportedDateTo).getTime())
                                                ? new Date(value?.ReportedDateTo)
                                                : null
                                        }

                                        dateFormat="MM/dd/yyyy"
                                        timeInputLabel
                                        isClearable={value?.ReportedDateTo ? true : false}
                                        // peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete='Off'
                                        minDate={
                                            value?.ReportedDate && !isNaN(new Date(value?.ReportedDate).getTime())
                                                ? new Date(value?.ReportedDate)
                                                : null
                                        }
                                        disabled={value?.ReportedDate ? false : true}
                                        maxDate={new Date(datezone)}
                                        placeholderText='Select To Date...'
                                    />
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                {
                                    effectiveScreenPermission && effectiveScreenPermission[0]?.DisplayOK ?
                                        <>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 mr-2" onClick={() => { getIncidentSearchData(); }}>
                                                Search
                                            </button>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 " onClick={() => { onClick_Reset(); }}>
                                                Reset
                                            </button>
                                        </>
                                        :
                                        <>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-body mt-4" style={{ margin: '10px 10px 10px 15px' }}>
                <div className="row clearfix">
                    <div className="main-dashboard col-12 mb-2 mt-2">
                        <div className="col-12 col-sm-12">
                            {
                                loder ?
                                    <DataTable
                                        columns={columns}
                                        persistTableHead={true}
                                        dense
                                        data={effectiveScreenPermission ?
                                            effectiveScreenPermission[0]?.DisplayOK ?
                                                incidentSearchData.length > 0 && incAdvSearchData ? incidentSearchData : incidentFilterData && !incAdvSearchData ? incidentFilterData : []
                                                : ""
                                            : ""
                                        }
                                        conditionalRowStyles={conditionalRowStyles}
                                        pagination
                                        paginationPerPage={'100'}
                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                        showPaginationBottom={100}
                                        highlightOnHover
                                        subHeader
                                        responsive
                                        fixedHeader={true}
                                        customStyles={tableCustomStyles}
                                        subHeaderComponent={
                                            <div className="col-12 px-0 mt-1">
                                                <div className="row px-0">
                                                    <div className="col-3 col-md-4 col-lg-8 mt-2 px-0 pl-0">
                                                        <p className="new-para ">Incident</p>
                                                    </div>
                                                    <div className="col-3 col-md-8 col-lg-4 ">
                                                        {
                                                            effectiveScreenPermission && effectiveScreenPermission[0]?.DisplayOK ?
                                                                <Link to='/incident-advanceSearch'>
                                                                    <button className="btn btn-sm  new-btn py-1 mr-1" onClick={() => { click_AdvanceSearch(); }} >Advance Search</button>
                                                                </Link>
                                                                :
                                                                <>
                                                                </>
                                                        }
                                                        {
                                                            effectiveScreenPermission ?
                                                                effectiveScreenPermission[0]?.AddOK ?
                                                                    <Link
                                                                        to={`/Inc-Home?IncId=${0}&IncNo=${''}&IncSta=${false}&DateAvailable=${false}`}
                                                                        onClick={() => {
                                                                            setShowIncPage('home');
                                                                            setPropertyCount([]); setTabCount([]); setIncidentCount([]);
                                                                            setVehicleCount([])
                                                                        }}
                                                                        className="btn btn-sm text-white py-0"
                                                                    >
                                                                        <button className="btn btn-sm bg-green text-white  py-1 " >
                                                                            <FontAwesomeIcon icon={faPlus} className='px-0 react-icon' />
                                                                            <span className=''>Add Incident</span>
                                                                        </button>
                                                                    </Link>
                                                                    :
                                                                    <>
                                                                    </>
                                                                :
                                                                <>
                                                                    <Link
                                                                        to={`/Inc-Home?IncId=${0}&IncNo=${''}&IncSta=${false}&DateAvailable=${false}`}
                                                                        onClick={() => {
                                                                            setShowIncPage('home');
                                                                            setPropertyCount([]); setTabCount([]); setIncidentCount([]);
                                                                            setVehicleCount([])
                                                                        }}
                                                                        className="btn btn-sm text-white py-0"
                                                                    >
                                                                        <button className="btn btn-sm bg-green text-white  py-1 " >
                                                                            <FontAwesomeIcon icon={faPlus} className='px-0 react-icon' />
                                                                            <span className=''>Add Incident</span>
                                                                        </button>
                                                                    </Link>
                                                                </>
                                                        }
                                                    </div>
                                                    {
                                                        effectiveScreenPermission && effectiveScreenPermission[0]?.DisplayOK ?
                                                            <div className="col-10 col-md-10 col-lg-4  mt-1 ">
                                                                <input
                                                                    type="text" name="IncidentNumber" id="IncidentNumber"
                                                                    className="form-control py-1 new-input" placeholder="Incident No. Search......"
                                                                    value={value.IncidentNumber} maxLength={12}
                                                                    onKeyDown={handleKeyPress}
                                                                    onChange={(e) => { HandleChange(e); }}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        subHeaderAlign='left'
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                    />
                                    :
                                    <Loader />
                            }
                        </div>
                    </div>
                </div >
            </div>
            <div className="col-12 text-right">
                <div className="col-12 text-right">
                    {
                        incAdvSearchData && incidentSearchData.length > 0 ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary mr-1"
                                    onClick={() => setSelectedStatus(true)}
                                >
                                    <i className="fa fa-print mr-1"></i>
                                    Print Preview
                                </button>
                                <button
                                    type="button"
                                    onClick={exportToExcel}
                                    className="btn btn-sm btn-primary mr-1"
                                >
                                    <i className="fa fa-file-excel-o mr-1" aria-hidden="true"></i>
                                    Export to Excel
                                </button>
                            </>
                        ) : null
                    }
                </div>
            </div>
            <IncidentSummaryModel {...{ setIncSummModal, incSummModal, otherColID, updateCount }} />
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                    <IncidentPrintReport {...{ incidentSearchData, componentRef, loginAgencyID, agencysingledata, multiImage }} />
                </div>
            )}

        </>
    )
}

export default Incident;