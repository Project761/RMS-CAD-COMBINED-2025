import { useState, useEffect, useContext, } from 'react'
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
    if (localStoreData) {
      setAgencyName(localStoreData?.Agency_Name);
      // setUserName(localStoreData?.UserName);
      setUserName(localStoreData?.UserName ? localStoreData?.UserName?.split(",")[0] : '');
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

