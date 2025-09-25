import { useState, useEffect, useContext, useRef, } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { AgencyContext } from "../../Context/Agency/Index";
import { toastifySuccess } from "../Common/AlertMsg";
import ThemeSetting from "./ThemeSetting";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import defualtImage from '../../img/uploadImage.png';
import { Decrypt_Id_Name, base64ToString, } from '../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import TreeComponent from '../Pages/PropertyRoom/PropertyRoomTab/TreeComponent/TreeComponent';
import { Master_Property_Status, Master_Vehicle_Status, } from '../../redux/actionTypes';
import GoogleAuthServices from '../../CADServices/APIs/googleAuth'
import Nibrs_Report_Model from '../Pages/NIBRS_Report_Model/Nibrs_Report_Model';
import Nibrs_File_Model from '../Pages/NIBRS_File_Model/Home/Nibrs_File_Model';
import TibrsNoIncident from '../Pages/TIBRSNoIncident/TibrsNoIncident';
import NCICModal from '../../CADComponents/NCICModal';
import { ScreenPermision } from '../hooks/Api';


const labels = [
  { className: 'geekmark', bgColor: '#ffe2a8', text: 'Required' },
  { className: 'geekmark1', bgColor: '#9d949436', text: 'Read Only' },
  { className: 'geekmark2', bgColor: '#d9e4f2', text: 'Lock' },
  { className: 'geekmark3', bgColor: '#F29A9A', text: 'TIBRS Field' },
];


const Header = (props) => {

  const { listManagementSideBar, agencySideBar, personnelSideBar } = props
  const { setUpdateCount, updateCount, get_Name_Count, setIncidentStatus, setTabCount, setIncidentCount, setAgencyName, agnecyName, changesStatus, setIsLogout, setIncAdvSearchData, setIncidentSearchData, setPropertyCount, setVehicleCount, setRecentSearchData, setIncidentRecentData, setSearchObject } = useContext(AgencyContext)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  const [tibrsFilePermission, setTibrsFilePermission] = useState(false);
  const [tibrsIncidentNoPermission, setTibrsIncidentNoPermission] = useState(false);
  const [tibrsReportPermission, setTibrsReportPermission] = useState(false);
    const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const signOut = async () => {
    if (localStoreData?.Is2FAEnabled) {
      const ConnectionID = localStorage.getItem("connectionId");
      if (localStoreData?.PINID && ConnectionID) {
        await GoogleAuthServices.logOutSingleDevices({ UserPINID: localStoreData?.PINID.toString(), ConnectionID: base64ToString(ConnectionID) });
      }
      setRecentSearchData([]); setSearchObject({});
      localStorage.clear();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      toastifySuccess("Logout Successfully !!");
      setIsLogout(true);
      navigate("/");
    }
  }

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      sessionStorage.setItem('darkMode', newMode);
      return newMode;
    });
    document.body.classList.toggle('dark-mode');
  };

  // Effect to update body class on initial load
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    setShow(false)
    setShowTibrsModel(false)
    if (!localStoreData?.Agency_Name) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);


   useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (localStoreData) {
      setAgencyName(localStoreData?.Agency_Name);
      setUserName(localStoreData?.fullName);
      // setUserName(localStoreData?.UserName);
      // setUserName(localStoreData?.UserName ? localStoreData?.UserName?.split(",")[0] : '');
      getReportPermission(localStoreData?.AgencyID, localStoreData?.PINID)
    }
  }, [localStoreData]);

  const getReportPermission = async (AgencyID, PINID) => {
    const [TibrsFilePermission, TibrsIncidentNo, TibrsReport] = await Promise.all([
      ScreenPermision("N144", AgencyID, PINID),
      ScreenPermision("N145", AgencyID, PINID),
      ScreenPermision("N112", AgencyID, PINID),
    ]);
    if (TibrsFilePermission?.length > 0) {
      setTibrsFilePermission(TibrsFilePermission?.[0]?.DisplayOK === 1);
    }
    if (TibrsIncidentNo?.length > 0) {
      setTibrsIncidentNoPermission(TibrsIncidentNo?.[0]?.DisplayOK === 1);
    }
    if (TibrsReport?.length > 0) {
      setTibrsReportPermission(TibrsReport?.[0]?.DisplayOK === 1);
    }

  }

  const clickOnIncident = () => {
    setUpdateCount(updateCount + 1); setIncidentStatus(false); setIncAdvSearchData(false); setIncidentSearchData([]);
    setIncidentCount([]); setTabCount([]); setPropertyCount([]); setVehicleCount([])
  }

  const clickOnMasterName = () => {
    get_Name_Count('');
  }

  const [show, setShow] = useState(false);
  const [showTibrsModel, setShowTibrsModel] = useState(false);

  const handleModel = () => setShow(!show);
  const handleTibrsModel = () => setShowTibrsModel(!showTibrsModel);



  return (
    <>
      <div id="page_top" className={`${listManagementSideBar ? 'section-body' : personnelSideBar ? 'section-body' : agencySideBar ? 'section-body' : 'section-body top_dark'}`} style={{ padding: `${listManagementSideBar ? '0' : personnelSideBar ? '0' : agencySideBar ? '0' : '20px;'}` }}>
        <div className="container-fluid p-0" style={{ backgroundColor: `${listManagementSideBar ? '#001f3f' : personnelSideBar ? '#001f3f' : agencySideBar ? '#001f3f' : ''}` }} >
          <div className="page-header" >
            <div className="left text-white">

              <div className="div d-flex header-menu">
                <div className="dropdown d-flex">
                  <Link to='/dashboard-page' className=" text-white  ml-2">
                    <span id='mydashButton'>
                      Dashboard
                    </span>
                  </Link>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown">
                    Application
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={`/Inc-Home?IncId=${0}&IncNo=${''}&IncSta=${false}`} onClick={clickOnIncident} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>
                    <Link to={`/Name-Home?page=MST-Name-Dash&IncNo=${0}&IncSta=${0}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`} onClick={clickOnMasterName} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Master Name
                    </Link>
                    <Link
                      to={`/Prop-Home?page=MST-Property-Dash&IncId=${0}&IncNo=${0}&IncSta=${0}&?ProId=${0}&?MProId=${0}`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
                      onClick={() => {
                        dispatch({ type: Master_Property_Status, payload: true });
                      }}
                    >
                      Master Property
                    </Link>
                    <Link
                      to={`/Vehicle-Home?page=MST-Vehicle-Dash&IncId=${0}&IncNo=${0}&IncSta=${0}&?VehId=${0}&?MVehId=${0}&VehSta=${false}`}
                      onClick={() => {
                        dispatch({ type: Master_Vehicle_Status, payload: true });
                      }}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Master Vehicle
                    </Link>
                    <Link to={'/Property-room'} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property Room
                    </Link>

                    <Link to={'/Property-Audit'} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property Room Audit
                    </Link>
                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown" >
                    Search
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={'/incident'} onClick={clickOnIncident} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>

                    <Link className="dropdown-item" to={'/name-advanceSearch?page=Name-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Name
                    </Link>
                    <Link className="dropdown-item" to={'/property-advanceSearch?page=Property-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property
                    </Link>
                    <Link className="dropdown-item" to={'/arrest-advanceSearch?page=Arrest-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Arrest
                    </Link>
                    <Link className="dropdown-item" to={'/vehicle-advanceSearch?page=Vehicle-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Vehicle
                    </Link>

                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown">
                    Report
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Name
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Arrest
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Vehicle
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      State Report
                    </Link>
                    {
                      tibrsReportPermission && (
                        <span className="dropdown-item" onClick={handleModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#NibrsReportModel"} >
                          TIBRS Report
                        </span>
                      )
                    }
                    {
                      tibrsFilePermission && (
                        <span className="dropdown-item" onClick={handleModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#NibrsFileModel"} >
                          TIBRS Files
                        </span>
                      )
                    }
                    {
                      tibrsIncidentNoPermission && (
                        <span className="dropdown-item" onClick={handleTibrsModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#TibrsNoIncident"} >
                          TIBRS No Incident
                        </span>
                      )
                    }
                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown" >
                    Utility
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className=" dropdown-item" to={`/agencyTab?Aid=${0}&ASta=${false}`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Agency
                    </Link>
                    <Link className="dropdown-item" to={'/Alert-Master'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Alert Master
                    </Link>
                    <Link className="dropdown-item" to={'/CounterTable'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Counter Table
                    </Link>
                    <Link className="dropdown-item" to={'/Name-Consolidation'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Consolidation
                    </Link>
                    <Link className="dropdown-item" to={'/Expunge'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Expunge
                    </Link>
                    <Link className="dropdown-item" to={'/ListManagement'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      List Manager
                    </Link>
                    <Link className="dropdown-item" to={'/ListPermission'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      List Module Manager
                    </Link>
                    <Link className="dropdown-item" to={'/PreviousYearCounter'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Pervious Year Counter
                    </Link>
                    <span className="dropdown-item" data-toggle="modal" data-target="#TreeModal" >
                      Property Location
                    </span>
                    <Link className="dropdown-item" to={'/security-manager'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Security Manager
                    </Link>
                    <Link className="dropdown-item" to={'/Seal-unseal'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Seal/Unseal
                    </Link>
                    <Link className="dropdown-item" to={'/UnConsolidation'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unconsolidation
                    </Link>
                    <Link className="dropdown-item" to={'/UnExpunge'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unexpunge
                    </Link>
                    <Link className="dropdown-item" to={'/citationTab'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Citation
                    </Link>
                  </div>
                </div>
                <div
                  data-toggle="modal"
                  data-target="#NCICModal"
                  style={{ width: "70px", cursor: 'pointer' }}
                  onClick={() => {
                    setOpenNCICModal(true);
                  }}
                >
                  NCIC
                </div>
              </div>
            </div>

            <div className="right " >
              <div className="notification d-flex justify-content-between align-items-center px-3" >
                <div className="position-relative" ref={dropdownRef}>
                  {/* SVG icons */}
                  <div className="d-flex" style={{cursor:"pointer"}}>
                    <div className="mr-3" onClick={() => setOpen(!open)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={20} height={20} fill="white">
                        <path d="M320 144C254.8 144 201.2 173.6 160.1 211.7C121.6 247.5 95 290 81.4 320C95 350 121.6 392.5 160.1 428.3C201.2 466.4 254.8 496 320 496C385.2 496 438.8 466.4 479.9 428.3C518.4 392.5 545 350 558.6 320C545 290 518.4 247.5 479.9 211.7C438.8 173.6 385.2 144 320 144zM127.4 176.6C174.5 132.8 239.2 96 320 96C400.8 96 465.5 132.8 512.6 176.6C559.4 220.1 590.7 272 605.6 307.7C608.9 315.6 608.9 324.4 605.6 332.3C590.7 368 559.4 420 512.6 463.4C465.5 507.1 400.8 544 320 544C239.2 544 174.5 507.2 127.4 463.4C80.6 419.9 49.3 368 34.4 332.3C31.1 324.4 31.1 315.6 34.4 307.7C49.3 272 80.6 220 127.4 176.6zM320 400C364.2 400 400 364.2 400 320C400 290.4 383.9 264.5 360 250.7C358.6 310.4 310.4 358.6 250.7 360C264.5 383.9 290.4 400 320 400zM240.4 311.6C242.9 311.9 245.4 312 248 312C283.3 312 312 283.3 312 248C312 245.4 311.8 242.9 311.6 240.4C274.2 244.3 244.4 274.1 240.5 311.5zM286 196.6C296.8 193.6 308.2 192.1 319.9 192.1C328.7 192.1 337.4 193 345.7 194.7C346 194.8 346.2 194.8 346.5 194.9C404.4 207.1 447.9 258.6 447.9 320.1C447.9 390.8 390.6 448.1 319.9 448.1C258.3 448.1 206.9 404.6 194.7 346.7C192.9 338.1 191.9 329.2 191.9 320.1C191.9 309.1 193.3 298.3 195.9 288.1C196.1 287.4 196.2 286.8 196.4 286.2C208.3 242.8 242.5 208.6 285.9 196.7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  {open && (
                    <div className=" show color_dropdown-menu-right color_dropdown-menu-arrow" style={{ display: 'block' }}>
                      <div className="field-identify-color mt-1 ml-4">
                        <h6 className="mb-1 mt-2">Field Color</h6>
                        <div className="d-flex flex-column mt-3 ml-4">
                          {labels?.map(({ className, bgColor, text }) => (
                            <div className="d-flex mt-2" key={text}>
                              <span className={`${className} mt-2`}></span>
                              <span
                                className="ml-2"
                                style={{
                                  border: '1px solid',
                                  backgroundColor: bgColor,
                                  padding: '4px',
                                  borderRadius: '4px',
                                  display: 'inline-block',
                                  transition: 'color 0.3s ease',
                                  textAlign: 'center',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  minWidth: '90px',
                                }}
                              >
                                {text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={toggleDarkMode} className='dark-toogle'>
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                  </button>
                </div>
                {
                  <div className="dropdown d-flex">
                    <span className="nav-link icon  btn  btn-icon ml-2" data-toggle="dropdown" >
                      <span className="text-uppercase text-white">
                        {userName}&nbsp;
                        <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                      </span>
                    </span>
                    <div className="dropdown-menu  dropdown-menu-right dropdown-menu-arrow" >
                      <div className="header-card">
                        <h6 className="text-center mt-2" style={{ fontSize: '15px' }}>{agnecyName ? agnecyName : ''}</h6>
                        <fieldset >
                          <legend style={{ margin: 'auto' }}>
                            <div className="header-img mt-3 text-center">
                              <img src={defualtImage} alt='' />
                            </div>
                          </legend>
                        </fieldset>
                        <div className="text-start ml-5 mt-2">
                          <h5 className="text-bold " style={{ fontSize: '14px', color: '#001f3f' }}>{userName}</h5>

                        </div>

                        <Link className="dropdown-item bb " to={changesStatus ? '#' : "/LockedUser"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                          <i className="fa fa-lock"></i> &nbsp; Locked User
                        </Link>
                        <Link className="dropdown-item bb" to={changesStatus ? '#' : "/Dictionary"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                          <i className="fa fa-lock"></i> &nbsp; Data Dictionary
                        </Link>

                        <Link className="dropdown-item bb" to={'/'} onClick={() => signOut()}>
                          <i className="fa fa-sign-out"></i>&nbsp; Sign out
                        </Link>
                        <li className="dropdown-item dropdown-item_remove" >Version Number 1.0</li>

                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div >
      </div >
      <TreeComponent />
      <ThemeSetting />
      <Nibrs_Report_Model show={show} setShow={setShow} handleModel={handleModel} />
      <Nibrs_File_Model show={show} setShow={setShow} handleModel={handleModel} />
      <TibrsNoIncident showTibrsModel={showTibrsModel} setShowTibrsModel={setShowTibrsModel} handleTibrsModel={handleTibrsModel} />
      <NCICModal {...{ openNCICModal, setOpenNCICModal }} />
    </>
  )
}

export default Header;

