import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { Decrypt_Id_Name } from '../../Common/Utility';
import { ScreenPermision } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const ReportSidebar = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    let reportModule = useQuery().get("Rep");



    const [expandList, setExpandList] = useState(null);
    const [plusMinus, setPlusMinus] = useState({
        'Master Table': false,
        'Master Table2': false,
        'Master Table3': false,
        'Master Table5': false,
        'Master Table7': false,
        'Master Table8': false,
    });

    // incident
    const [incMasterReportPermission, setIncMasterReportPermission] = useState(false);
    const [incOfficerReportPermission, setIncOfficerReportPermission] = useState(false);
    const [incMonthlyReportPermission, setIncMonthlyReportPermission] = useState(false);
    const [incDailyEventReportPermission, setIncDailyEventReportPermission] = useState(false);
    const [incTotalByCodeReportPermission, setIncTotalByCodeReportPermission] = useState(false);
    // Name
    const [nameMasterReportPermission, setNameMasterReportPermission] = useState(false);
    // Property
    const [propertyMasterReportPermission, setPropertyMasterReportPermission] = useState(false);
    const [chainCustodyReportPermission, setChainCustodyReportPermission] = useState(false);
    const [propertyInventoryReportPermission, setPropertyInventoryReportPermission] = useState(false);
    // Arrest
    const [arrestMasterReportPermission, setArrestMasterReportPermission] = useState(false);
    const [arrestSummaryReportPermission, setArrestSummaryReportPermission] = useState(false);
    // Vehicle
    const [vehicleMasterReportPermission, setVehicleMasterReportPermission] = useState(false);
    // State
    const [stateReportPermission, setStateReportPermission] = useState(false);

    useEffect(() => {
        if (!localStoreData?.Agency_Name) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            getReportPermission(localStoreData?.AgencyID, localStoreData?.PINID)
        }
    }, [localStoreData]);

    useEffect(() => {
        if (reportModule === "Inc") {
            callReportModules("List", "Master Table");
        } else if (reportModule === "Name") {
            callReportModules('List', 'Master Table2')
        } else if (reportModule === "Property") {
            callReportModules('List', 'Master Table3')
        } else if (reportModule === "Arrest") {
            callReportModules('List', 'Master Table5')
        } else if (reportModule === "Vehicle") {
            callReportModules('List', 'Master Table7')
        } else if (reportModule === "State") {
            callReportModules('List', 'Master Table8')

        }
    }, [reportModule]);


    const callReportModules = (type, val) => {
        if (type === 'List') {
            setExpandList(expandList === val ? null : val);
            setPlusMinus(prevState => ({
                ...prevState,
                [val]: !prevState[val],
                ...Object.keys(prevState).reduce((acc, key) => {
                    if (key !== val) acc[key] = false;
                    return acc;
                }, {}),
            }));
        }
    }

    const getReportPermission = async (AgencyID, PINID) => {
        const [IncMasterReport, IncOfficerReport, IncMonthlyReport, IncDailyEventReport, IncTotalByCodeReport, NameMasterReport, PropertyMasterReport, ChainCustodyReport, PropertyInventoryReport, ArrestMasterReport, ArrestSummaryReport, VehicleMasterReport, StateReport] = await Promise.all([
            // Incident
            ScreenPermision("I097", AgencyID, PINID),
            ScreenPermision("I098", AgencyID, PINID),
            ScreenPermision("I099", AgencyID, PINID),
            ScreenPermision("I100", AgencyID, PINID),
            ScreenPermision("I101", AgencyID, PINID),
            // Name
            ScreenPermision("N103", AgencyID, PINID),
            // Property
            ScreenPermision("P104", AgencyID, PINID),
            ScreenPermision("P105", AgencyID, PINID),
            ScreenPermision("P106", AgencyID, PINID),
            // Arrest
            ScreenPermision("A109", AgencyID, PINID),
            ScreenPermision("A110", AgencyID, PINID),
            // Vehicle
            ScreenPermision("V108", AgencyID, PINID),
            // State
            ScreenPermision("S111", AgencyID, PINID),
        ]);
        if (IncMasterReport?.length > 0) {
            setIncMasterReportPermission(IncMasterReport?.[0]?.DisplayOK === 1);
        }
        if (IncOfficerReport?.length > 0) {
            setIncOfficerReportPermission(IncOfficerReport?.[0]?.DisplayOK === 1);
        }
        if (IncMonthlyReport?.length > 0) {
            setIncMonthlyReportPermission(IncMonthlyReport?.[0]?.DisplayOK === 1);
        }
        if (IncDailyEventReport?.length > 0) {
            setIncDailyEventReportPermission(IncDailyEventReport?.[0]?.DisplayOK === 1);
        }
        if (IncTotalByCodeReport?.length > 0) {
            setIncTotalByCodeReportPermission(IncTotalByCodeReport?.[0]?.DisplayOK === 1);
        }
        // Name
        if (NameMasterReport?.length > 0) {
            setNameMasterReportPermission(NameMasterReport?.[0]?.DisplayOK === 1);
        }
        // Property
        if (PropertyMasterReport?.length > 0) {
            setPropertyMasterReportPermission(PropertyMasterReport?.[0]?.DisplayOK === 1);
        }
        if (ChainCustodyReport?.length > 0) {
            setChainCustodyReportPermission(ChainCustodyReport?.[0]?.DisplayOK === 1);
        }
        if (PropertyInventoryReport?.length > 0) {
            setPropertyInventoryReportPermission(PropertyInventoryReport?.[0]?.DisplayOK === 1);
        }
        // Arrest
        if (ArrestMasterReport?.length > 0) {
            setArrestMasterReportPermission(ArrestMasterReport?.[0]?.DisplayOK === 1);
        }
        if (ArrestSummaryReport?.length > 0) {
            setArrestSummaryReportPermission(ArrestSummaryReport?.[0]?.DisplayOK === 1);
        }
        // Vehicle
        if (VehicleMasterReport?.length > 0) {
            setVehicleMasterReportPermission(VehicleMasterReport?.[0]?.DisplayOK === 1);
        }
        // State
        if (StateReport?.length > 0) {
            setStateReportPermission(StateReport?.[0]?.DisplayOK === 1);
        }
    }

    return (
        <>
            <div className="row px-1">
                <div className="col-12 mt-4">
                    <input type="text" className='form-control input-fixed mt-1'
                        placeholder='Search By List ...' />
                </div>
            </div>

            {/* Incident */}
            <li className='mt-2 pt-1'>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table']} onClick={() => callReportModules('List', 'Master Table')}>
                    <span className='ml-3'> Incident</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table'} className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    {
                        incMasterReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/incident-Master?page=incidentReport`} style={{ cursor: 'pointer', background: openPage === 'incidentReport' ? '#EEE' : '' }} >
                                    <span>Incident Master Report</span>
                                </Link>
                            </li>
                        )
                    }
                    {/* {
                        incTotalByCodeReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/incident-TotalByCode?page=incidentTotalByCodeReport`} style={{ cursor: 'pointer', background: openPage === 'incidentTotalByCodeReport' ? '#EEE' : '' }}>
                                    <span>Incident Total By Code</span>
                                </Link>
                            </li>
                        )
                    } */}
                    {
                        incOfficerReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/incident-Officer?page=incidentOfficerReport`} style={{ cursor: 'pointer', background: openPage === 'incidentOfficerReport' ? '#EEE' : '' }}>
                                    <span >Incident By Officer</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        incMonthlyReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/incident-Monthly?page=incidentMonthlyReport`} style={{ cursor: 'pointer', background: openPage === 'incidentMonthlyReport' ? '#EEE' : '' }} >
                                    <span >Incidents Monthly</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        incDailyEventReportPermission && (
                            <li className="ml-3 p-0" >
                                <Link to={`/incident-DailyEvent?page=incidentDailyEventReport`} style={{ cursor: 'pointer', background: openPage === 'incidentDailyEventReport' ? '#EEE' : '' }}>
                                    <span className="">Daily Event Log</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        incTotalByCodeReportPermission && (
                            <li className="ml-3 p-0" >
                                <Link to={`/incident-code?page=incidentcodeReport`} style={{ cursor: 'pointer', background: openPage === 'incidentcodeReport' ? '#EEE' : '' }}>
                                    <span className="">Incident Total By Code</span>
                                </Link>
                            </li>
                        )
                    }

                </ul>
            </li>

            {/* Name */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table2']} onClick={() => callReportModules('List', 'Master Table2')}>
                    <span className='ml-3'> Name</span>
                </Link>
                {
                    nameMasterReportPermission && (
                        <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table2'} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                            <li className="ml-3 p-0">
                                <Link to={`/name-information?page=nameMasterReport`} style={{ cursor: 'pointer', background: openPage === 'nameMasterReport' ? '#EEE' : '' }}>
                                    <span>Name Master Report</span>
                                </Link>
                            </li>
                        </ul>
                    )
                }
            </li>

            {/* Property */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table3']} onClick={() => callReportModules('List', 'Master Table3')}>
                    <span className='ml-3'>Property</span>
                </Link>
                <ul aria-expanded={expandList === 'Master Table3'} className={`${expandList === 'Master Table3' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    {
                        propertyMasterReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/property-master?page=propertyMasterReport`} style={{ cursor: 'pointer', background: openPage === 'propertyMasterReport' ? '#EEE' : '' }}>
                                    <span>Property Master Report</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        chainCustodyReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/chaincustody-report?page=chainCustodyReport`} style={{ cursor: 'pointer', background: openPage === 'chainCustodyReport' ? '#EEE' : '' }}>
                                    <span >Chain Of Custody Report</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        propertyInventoryReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/propertyInventory-report?page=propertyInventoryReport`} style={{ cursor: 'pointer', background: openPage === 'propertyInventoryReport' ? '#EEE' : '' }}>
                                    <span >Property Inventory Report</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </li>

            {/* Arrest */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table5']} onClick={() => callReportModules('List', 'Master Table5')}>
                    <span className='ml-3'> Arrest</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table5'} className={`${expandList === 'Master Table5' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    {
                        arrestMasterReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/arrest-master?page=arrestMasterReport`} style={{ cursor: 'pointer', background: openPage === 'arrestMasterReport' ? '#EEE' : '' }}>
                                    <span>Arrest Master Report</span>
                                </Link>
                            </li>
                        )
                    }
                    {
                        arrestSummaryReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/arrest-summary?page=arrestSummaryReport`} style={{ cursor: 'pointer', background: openPage === 'arrestSummaryReport' ? '#EEE' : '' }}>
                                    <span className="">Arrest Summary Report</span>
                                </Link>
                            </li>
                        )
                    }

                    {

                        arrestSummaryReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/arrest-monthly?page=arrestMonthlyReport`} style={{ cursor: 'pointer', background: openPage === 'arrestMonthlyReport' ? '#EEE' : '' }}>
                                    <span className="">Arrest Monthly Report</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </li>

            {/* Vehicle */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table7']} onClick={() => callReportModules('List', 'Master Table7')}>
                    <span className='ml-3'> Vehicle</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table7'} className={`${expandList === 'Master Table7' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    {
                        vehicleMasterReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/vehicle-master?page=vehicleMasterReport`} style={{ cursor: 'pointer', background: openPage === 'vehicleMasterReport' ? '#EEE' : '' }}>
                                    <span>Vehicle Master Report</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </li>

            {/* State */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table8']} onClick={() => callReportModules('List', 'Master Table8')}>
                    <span className='ml-3'> State</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table8'} className={`${expandList === 'Master Table8' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    {
                        stateReportPermission && (
                            <li className="ml-3 p-0">
                                <Link to={`/state?page=stateReport`} style={{ cursor: 'pointer', background: openPage === 'stateReport' ? '#EEE' : '' }}>
                                    <span>State Report</span>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </li>


        </>
    );
}

export default ReportSidebar;
