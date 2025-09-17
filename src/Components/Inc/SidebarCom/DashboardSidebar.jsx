import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AgencyContext } from "../../../Context/Agency/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faFile, faHouse, faLock, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { base64ToString, stringToBase64 } from "../../Common/Utility";
import { IncidentContext } from "../../../CADContext/Incident";

const DashboardSidebar = () => {

    let navigate = useNavigate();
    const { setIsOnCAD } = useContext(IncidentContext);
    const { incidentRecentData, setUpdateCount, setIncStatus, updateCount, recentSearchData, setSearchObject } = useContext(AgencyContext)


    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus(!plusMinus);
            setPlusMinus1(!plusMinus1)
            setPlusMinus2(!plusMinus2)
            setPlusMinus3(!plusMinus3)
            setExpand(expand ? expand[0].id === val ? { id: val } : '' : { id: val })
        } else {
            setPlusMinus(!plusMinus);
            setExpandList(expandList === val ? '' : val);
        }
    }

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    const IncNo = query?.get("IncNo");
    const IncSta = query?.get("IncSta");

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const showSearchData = recentSearchData?.slice(-5);


    const recentIncidents = Object.values(
        incidentRecentData.reduce((acc, item) => {
            // Normalize IncidentNumber (trim spaces)
            const incidentNum = item.IncidentNumber?.trim();
            if (!acc[incidentNum]) {
                acc[incidentNum] = item;
            }
            return acc;
        }, {})
    );


    return (
        <>
            <li className="">
                <Link to="/dashboard-page">
                    <FontAwesomeIcon icon={faHouse} className="react-icon pl-3" />
                    <span className="ml-2 pl-1">Dashboard</span>
                </Link>
            </li>
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus} onClick={() => callUtilityModules('Table', 'Master Table')}>
                    <FontAwesomeIcon icon={faLock} className="react-icon pl-3" />
                    <span className="ml-3">Utility</span>
                </Link>
                <ul id="menu" role="menu" className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <li className="ml-2 p-0">
                        <Link to={`/ListManagement`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">List Manager </span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/security-manager`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Security Manager </span>
                        </Link>
                    </li>
                    {/* <li className="ml-2 p-0">
                        <Link to={`/Editable-Incident`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Editable  Incident </span>
                        </Link>
                    </li> */}
                    <li className="ml-2 p-0">
                        <Link to={`/ListPermission`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">List Module Manager</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/CounterTable`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Counter Table</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/PreviousYearCounter`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Pervious Year Counter</span>
                        </Link>
                    </li>
                </ul>
            </li>
            {/* reports */}
            {/* <li>
                <Link to="/Reports" className="has-arrow arrow-c" aria-expanded={plusMinus1} onClick={() => callUtilityModules('Table1', 'Master Table1')}>
                    <FontAwesomeIcon icon={faFile} className="react-icon pl-3" />
                    <span className="ml-3">Report</span>
                </Link>

            </li> */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={expandList === 'Report Table'} onClick={() => setExpandList(expandList === 'Report Table' ? '' : 'Report Table')}
                >
                    <FontAwesomeIcon icon={faFile} className="react-icon pl-3" />
                    <span className="ml-3">Report</span>
                </Link>

                <ul
                    id="menu"
                    role="menu"
                    className={`${expandList === 'Report Table' ? 'collapse in' : 'collapse'}`}
                    style={{ marginLeft: '-23px' }}
                >
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=Inc`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Incident</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=Name`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Name</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=Property`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Property</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=Arrest`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Arrest</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=Vehicle`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Vehicle</span>
                        </Link>
                    </li>
                    <li className="ml-2 p-0">
                        <Link to={`/Reports?Rep=State`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">State</span>
                        </Link>
                    </li>

                </ul>


            </li>

            {/* <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus2} onClick={() => callUtilityModules('Table2', 'Master Table2')}>
                    <FontAwesomeIcon icon={faFile} className="react-icon pl-3" />
                    <span className="ml-3">Application</span>
                </Link>
            </li> */}
            <li>
                <Link to="/Search" className="has-arrow arrow-c" aria-expanded={plusMinus3} onClick={() => callUtilityModules('Table3', 'Master Table3')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="react-icon pl-3" />
                    <span className="ml-3">Search</span>
                </Link>
            </li>
            <div className="dropdown-divider"></div>
            <p>
                <Link to="/cad/dashboard-page" onClick={() => setIsOnCAD(true)}>
                    <FontAwesomeIcon icon={faChevronRight} className="react-icon pl-3" />
                    <span className="ml-3">CAD</span>
                </Link>
                <Link to="#" >
                    <FontAwesomeIcon icon={faChevronRight} className="react-icon pl-3" />
                    <span className="ml-3">Recent</span>
                </Link>
                <ul className="recent">
                    {
                        showSearchData?.map((val, index) => {
                            let count = 0;
                            showSearchData?.forEach((item, i) => {
                                if (i < index && item?.SearchModule === val?.SearchModule) {
                                    count++;
                                }
                            });
                            return (
                                <li>
                                    <Link style={{ display: 'flex', flexDirection: 'column' }}
                                        to={
                                            val?.SearchModule === "Inc-Search" ? `/Incident?Recent=Incident`
                                                :
                                                val?.SearchModule === "Nam-Search" ? `/namesearch?Recent=Name`
                                                    :
                                                    val?.SearchModule === "Pro-Search" ? `/property-search?Recent=Property`
                                                        :
                                                        val?.SearchModule === "Arr-Search" ? `/arrest-search?Recent=Arrest`
                                                            :
                                                            val?.SearchModule === "Veh-Search" ? `/vehicle-search?Recent=Vehicle`
                                                                :
                                                                ''
                                        }
                                        onClick={() => {
                                            navigate(
                                                val?.SearchModule === "Inc-Search" ? `/Incident?Recent=Incident`
                                                    :
                                                    val?.SearchModule === "Nam-Search" ? `/namesearch?Recent=Name`
                                                        :
                                                        val?.SearchModule === "Pro-Search" ? `/property-search?Recent=Property`
                                                            :
                                                            val?.SearchModule === "Arr-Search" ? `/arrest-search?Recent=Arrest`
                                                                :
                                                                val?.SearchModule === "Veh-Search" ? `/vehicle-search?Recent=Vehicle`
                                                                    :
                                                                    ''
                                            );
                                            val?.SearchModule === "Inc-Search" && setSearchObject(val);
                                            val?.SearchModule === "Nam-Search" && setSearchObject(val);
                                            val?.SearchModule === "Pro-Search" && setSearchObject(val);
                                            val?.SearchModule === "Arr-Search" && setSearchObject(val);
                                            val?.SearchModule === "Veh-Search" && setSearchObject(val);
                                        }}
                                    >
                                        <span>
                                            {
                                                `${val.SearchModule}-${count + 1}`
                                            }
                                        </span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                    {
                        recentIncidents?.slice(-5).map((val) => (
                            <li key={val.IncidentID}>
                                <Link style={{ display: 'flex', flexDirection: 'column' }}
                                    to={`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.IncidentNumber}&IncSta=${true}`}
                                    onClick={() => {
                                        navigate(`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.IncidentNumber}&IncSta=${true}`);
                                        setIncStatus(true);
                                        setUpdateCount(updateCount + 1);
                                    }}>
                                    <span>Incident-{val.IncidentNumber}</span>
                                </Link>
                            </li>
                        ))
                    }
                    {/* {
                        incidentRecentData?.slice(-5).map((val) => (
                            <li key={val.IncidentID}>
                                <Link style={{ display: 'flex', flexDirection: 'column' }}
                                    to={`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.IncidentNumber}&IncSta=${true}`}
                                    onClick={() => {
                                        navigate(`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.IncidentNumber}&IncSta=${true}`);
                                        setIncStatus(true);
                                        setUpdateCount(updateCount + 1);
                                    }}>
                                    <span>Incident-{val.IncidentNumber}</span>
                                </Link>
                            </li>
                        ))
                    } */}
                </ul>
            </p>
        </>
    )
}

export default DashboardSidebar

