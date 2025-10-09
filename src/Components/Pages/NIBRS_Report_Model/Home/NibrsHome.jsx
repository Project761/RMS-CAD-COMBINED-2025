import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Administrative_Details from "./Administrative_Details";
import Offense from "./Offense";
import MainOffender from "./MinOffender";
import MainVictims from "./MainVictims";
import Properties from "./Properties";
import Arrestees from "./Arrestees";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "../../../Utility/Tab/Tab";
import VehicleTab from "./VehicleTab";
import { base64ToString, Decrypt_Id_Name, stringToBase64 } from "../../../Common/Utility";
import { fetchPostData, fetchPostDataNibrs } from "../../../hooks/Api";
import { useDispatch, useSelector } from "react-redux";
import { get_Inc_ReportedDate, get_LocalStoreData } from "../../../../redux/actions/Agency";
import Loader from "../../../Common/Loader";
import NirbsAllModuleErrorShowModal from "../../../Common/NibrsAllModuleErrShowModal";

const NibrsHome = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { incidentCount, get_Incident_Count, validate_IncSideBar, nibrsSideBarLoading, incidentValidateNibrsData, offenseValidateNibrsData, victimValidateNibrsData, offenderValidateNibrsData, propertyValidateNibrsData, } = useContext(AgencyContext);

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const [openSection, setOpenSection] = useState(null);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState();
  const [nibrsValidateloder, setnibrsValidateLoder] = useState(false);
  const [nibrsValidateIncidentData, setnibrsValidateIncidentData] = useState([]);
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);

  const [incidentErrorStatus, setIncidentErrorStatus] = useState(false);
  const [vehErrorStatus, setVehErrorStatus] = useState(false);
  const [propErrorStatus, setPropErrorStatus] = useState(false);
  const [offenseErrorStatus, setOffenseErrorStatus] = useState(false);
  const [victimErrorStatus, setVictimErrorStatus] = useState(false);
  const [offenderErrorStatus, setOffenderErrorStatus] = useState(false);

  // for use
  const [incidentClick, setIncidentClick] = useState(false);
  const [offenseClick, setoffenseClick] = useState(false);
  const [propertyClick, setPropertyClick] = useState(false);
  const [vehicleClick, setVehicleClick] = useState(false);
  const [victimClick, setVictimClick] = useState(false);
  const [offenderClick, setOffenderClick] = useState(false);
  const [arrestClick, setArrestClick] = useState(false);

  // nibrs Validate Incident
  const [baseDate, setBaseDate] = useState('');
  const [oriNumber, setOriNumber] = useState('');
  const [isNibrsSummited, setIsNibrsSummited] = useState(false);
  const [isOffenseInc, setIsOffenseInc] = useState(false);
  const [isGroup_B_Offense_ArrestInc, setIsGroup_B_Offense_ArrestInc] = useState(false);
  const [isSuspectedDrugTypeErrorStatus, setSuspectedDrugTypeErrorStatus] = useState(false);
  const [isPropertyIdZeroError, setIsPropertyIdZeroError] = useState(false);
  const [isCrimeAgainstPropertyError, setIsCrimeAgainstPropertyError] = useState(false)
  const [isVictimConnectedError, setIsVictimConnectedError] = useState(false);

  /// Error String
  const [administrativeErrorString, setAdministrativeErrorString] = useState('');
  const [incidentErrorString, setIncidentErrorString] = useState('');
  const [offenseErrorString, setOffenseErrorString] = useState('');
  const [victimErrorString, setVictimErrorString] = useState('');
  const [offenderErrorString, setOffenderErrorString] = useState('');
  const [propertyErrorString, setPropertyErrorString] = useState('');
  const [vehicleErrorString, setVehicleErrorString] = useState('');

  const offenseCount = incidentCount[0]?.OffenseCount || 0;
  const NameCount = incidentCount[0]?.NameCount || 0;
  const ArrestCount = incidentCount[0]?.ArrestCount || 0;
  const PropertyCount = incidentCount[0]?.PropertyCount || 0;
  const VehicleCount = incidentCount[0]?.VehicleCount || 0;
  const OffenderCount = incidentCount[0]?.OffenderCount || 0;
  const VictimCount = incidentCount[0]?.VictimCount || 0;


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
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");


  useEffect(() => {
    if (!localStoreData.AgencyID || !localStoreData.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null); setOriNumber(localStoreData?.ORI);
    }
  }, [localStoreData]);

  const toggleSection = (section) => {
    navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}`);
    setOpenSection(openSection === section ? null : section);

    switch (section) {
      case "admin": setIncidentClick(true);
        break;
      case "offenses": setoffenseClick(true);
        break;
      case "offenders": setOffenderClick(true);
        break;
      case "Victims": setVictimClick(true);
        break;
      case "Properties": setPropertyClick(true);
        break;
      case "VehicleTab": setVehicleClick(true);
        break;
      case "Arrestees": setArrestClick(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (IncID) {
      get_Incident_Count(IncID); setIncidentID(IncID); GetIncData(IncID); if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
    }
  }, [IncID])

  const GetIncData = (incidentID) => {
    try {
      const val = { IncidentID: incidentID }
      fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
        if (res?.length > 0) {
          setIsNibrsSummited(res[0]?.IsNIBRSSummited === 1 ? true : false);
        }
        else {
          setIsNibrsSummited(false);
        }
      })
    } catch (error) {
      console.log("GetIncData ~ error:", error);
    }
  }

  // validate property/vehicle
  const ValidateProperty = async (incidentID) => {
    // // loader
    // setnibrsValidateLoder(true);
    // // Administrative
    // setAdministrativeErrorString(''); setIsGroup_B_Offense_ArrestInc(false); setIsOffenseInc(false);
    // // incident
    // setIncidentErrorStatus(false); setIncidentErrorString('');
    // // property
    // setSuspectedDrugTypeErrorStatus(false); setIsCrimeAgainstPropertyError(false); setIsPropertyIdZeroError(false); setPropErrorStatus(false); setPropertyErrorString('');
    // // vehicle
    // setVehErrorStatus(false); setVehicleErrorString('');
    // // offense
    // setOffenseErrorStatus(false); setOffenseErrorString('');
    // // offender
    // setOffenderErrorStatus(false); setOffenderErrorString('');

    // // victim
    // setVictimErrorStatus(false); setVictimErrorString(''); setIsVictimConnectedError(false);
    // const res = await TXIBRSValidateCall(incidentID, incReportedDate, baseDate, oriNumber);


    // if (res) {

    //   try {
    //     const [incidentError, victimError, offenseError, propertyError, offenderError] = await Promise.all([
    //       fetchPostDataNibrs('NIBRS/GetIncidentNIBRSError', { 'StrIncidentID': incidentID, 'StrIncidentNumber': IncNo, 'StrAgencyID': loginAgencyID }),
    //       fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': "", 'gIntAgencyID': loginAgencyID }),
    //       fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'CrimeId': "", 'gIntAgencyID': loginAgencyID }),
    //       fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': "", 'gIntAgencyID': loginAgencyID }),
    //       fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': "", 'gIntAgencyID': loginAgencyID }),
    //     ])

    //     if (incidentError?.Incident) {
    //       const incObj = incidentError?.Incident ? incidentError?.Incident : [];

    //       if (incObj?.IsGroupBArrest) {
    //         setAdministrativeErrorString(incObj?.IsGroupBArrestError ? incObj?.IsGroupBArrestError : '');
    //         setIsGroup_B_Offense_ArrestInc(true);

    //       } else {
    //         setIsGroup_B_Offense_ArrestInc(false);

    //       }

    //     }

    //     // set offense error string
    //     if (offenseError) {
    //       const incObj = incidentError?.Incident ? incidentError?.Incident : [];
    //       const offenseObj = offenseError?.Offense ? offenseError?.Offense : [];

    //       if (offenseObj?.length > 0) {

    //         setOffenseErrorString(offenseObj[0]?.OnPageError ? offenseObj[0]?.OnPageError : '');
    //         setOffenseErrorStatus(true);

    //       } else {

    //         if (incObj?.IsOffence) {
    //           setOffenseErrorString(incObj?.IsOffenceError ? incObj?.IsOffenceError : '');
    //           setIsOffenseInc(true); setOffenseErrorStatus(true);

    //         } else {
    //           setIsOffenseInc(false); setOffenseErrorStatus(false); setOffenseErrorString('');

    //         }
    //       }

    //     } else {
    //       setOffenseErrorStatus(false); setOffenseErrorString('');

    //     }

    //     if (propertyError) {
    //       const proObj = propertyError?.Properties ? propertyError?.Properties : [];
    //       // console.log("🚀 ~ ValidateProperty ~ proObj:", proObj)

    //       // set property error string
    //       if (proObj?.length > 0) {

    //         const isCrimeAgainstError = proObj[0]?.OnPageError?.includes("Property must be present.");
    //         // const isCrimeAgainstError = proObj[0]?.OnPageError?.includes("For Crime Against Property Property must be present.");
    //         const isSuspectedDrugType = proObj[0]?.OnPageError?.includes("{352} Add at least one suspected drug type(create a property with type 'Drug')");
    //         // const isSuspectedDrugType = proObj[0]?.OnPageError?.includes("{352} There should be atleast 1 Suspected Drug Type entry.");
    //         const isPropertyIdZeroError = proObj[0]?.OnPageError?.includes("{074} Need a property loss code of 5,7 for offense  23B");

    //         if (isCrimeAgainstError) {
    //           setIsCrimeAgainstPropertyError(true); setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false);

    //         } else if (isSuspectedDrugType) {
    //           setSuspectedDrugTypeErrorStatus(true); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

    //         } else if (isPropertyIdZeroError) {
    //           setIsPropertyIdZeroError(true); setSuspectedDrugTypeErrorStatus(false); setIsCrimeAgainstPropertyError(false);

    //         } else {
    //           setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

    //         }

    //         const VehArr = proObj?.filter((item) => item?.PropertyType === 'V');
    //         const PropArr = proObj?.filter((item) => item?.PropertyType !== 'V');

    //         if (VehArr?.length > 0) {
    //           setVehicleErrorString(VehArr[0]?.OnPageError ? VehArr[0]?.OnPageError : ''); setVehErrorStatus(true);
    //         } else {
    //           setVehErrorStatus(false); setVehicleErrorString('');
    //         }

    //         // set property error string
    //         if (PropArr?.length > 0) {
    //           setPropertyErrorString(PropArr[0]?.OnPageError ? PropArr[0]?.OnPageError : ''); setPropErrorStatus(true);
    //         } else {
    //           setPropErrorStatus(false); setPropertyErrorString('');
    //         }

    //       } else {

    //       }
    //     } else {
    //       setPropErrorStatus(false); setPropertyErrorString(''); setVehErrorStatus(false); setVehicleErrorString('');
    //     }

    //     // set offender error string
    //     if (offenderError) {
    //       const offenderObj = offenderError?.Offender ? offenderError?.Offender : [];
    //       if (offenderObj?.length > 0) {
    //         setOffenderErrorString(offenderObj[0]?.OnPageError ? offenderObj[0]?.OnPageError : ''); setOffenderErrorStatus(true);
    //       } else {
    //         setOffenderErrorStatus(false); setOffenderErrorString('');
    //       }
    //     } else {
    //       setOffenderErrorStatus(false); setOffenderErrorString('');
    //     }

    //     // set victim error string
    //     if (victimError) {
    //       const victimObj = victimError?.Victim ? victimError?.Victim : [];
    //       if (victimObj?.length > 0) {
    //         const isVictimConnectedError = victimObj[0]?.OnPageError?.includes("At least one victim must be present and must be connected with offence.");
    //         if (isVictimConnectedError) {
    //           setIsVictimConnectedError(true);
    //         } else {
    //           setIsVictimConnectedError(false);
    //         }
    //         setVictimErrorString(victimObj[0]?.OnPageError ? victimObj[0]?.OnPageError : ''); setVictimErrorStatus(true);
    //       } else {
    //         setVictimErrorStatus(false); setVictimErrorString(''); setIsVictimConnectedError(false);
    //       }
    //     } else {
    //       setVictimErrorStatus(false); setVictimErrorString('');
    //     }

    //     // validateIncSideBar
    //     validate_IncSideBar(incidentID, IncNo, loginAgencyID);
    //     // set loader false
    //     setnibrsValidateLoder(false);

    //   } catch (error) {
    //     console.log("🚀 ~ ValidateProperty ~ error:", error);
    //     setnibrsValidateLoder(false);
    //   }

    // } else {
    //   setnibrsValidateLoder(false);

    // }

  }

  // validate Incident
  const TXIBRSValidateCall = async (incidentID, reportDate, baseDate, oriNumber) => {
    try {
      setnibrsValidateLoder(true);
      const val = {
        gIntAgencyID: loginAgencyID, gIncidentID: incidentID, dtpDateTo: reportDate, dtpDateFrom: reportDate, BaseDate: baseDate, strORINumber: oriNumber, strComputerName: uniqueId,
        //no use
        rdbSubmissionFile: false, rdbErrorLog: false, rdbNonReportable: false, chkPastErrorPrint: false,
        rdbOne: false, rdbTwoMonth: false, rdbThreeMonth: false, rdbAllLogFile: false, IPAddress: "", IsIncidentCheck: true,
      };
      const data = await fetchPostData("NIBRS/TXIBRS", val);
      if (Array.isArray(data) && data.length > 0) {
        return true;

      } else {
        return true;

      }
    } catch (error) {
      console.log("🚀 ~ nibrsValidateInc ~ error:", error);
      setnibrsValidateLoder(false);
      return true;
    }
  };

  useEffect(() => {
    const validateNibrs = async (incidentValidateNibrsData, offenseValidateNibrsData, victimValidateNibrsData, offenderValidateNibrsData, propertyValidateNibrsData) => {
      // // loader
      // setnibrsValidateLoder(true);
      // Administrative
      setAdministrativeErrorString(''); setIsGroup_B_Offense_ArrestInc(false); setIsOffenseInc(false);
      // incident
      setIncidentErrorStatus(false); setIncidentErrorString('');
      // property
      setSuspectedDrugTypeErrorStatus(false); setIsCrimeAgainstPropertyError(false); setIsPropertyIdZeroError(false); setPropErrorStatus(false); setPropertyErrorString('');
      // vehicle
      setVehErrorStatus(false); setVehicleErrorString('');
      // offense
      setOffenseErrorStatus(false); setOffenseErrorString('');
      // offender
      setOffenderErrorStatus(false); setOffenderErrorString('');
      // victim
      setVictimErrorStatus(false); setVictimErrorString(''); setIsVictimConnectedError(false);


      try {

        if (incidentValidateNibrsData?.Incident) {
          const incObj = incidentValidateNibrsData?.Incident ? incidentValidateNibrsData?.Incident : [];

          if (incObj?.IsGroupBArrest) {
            setAdministrativeErrorString(incObj?.IsGroupBArrestError ? incObj?.IsGroupBArrestError : '');
            setIsGroup_B_Offense_ArrestInc(true);

          } else {
            setIsGroup_B_Offense_ArrestInc(false);

          }

        }

        // set offense error string
        if (offenseValidateNibrsData) {
          const incObj = incidentValidateNibrsData?.Incident ? incidentValidateNibrsData?.Incident : [];
          const offenseObj = offenseValidateNibrsData?.Offense ? offenseValidateNibrsData?.Offense : [];

          if (offenseObj?.length > 0) {

            setOffenseErrorString(offenseObj[0]?.OnPageError ? offenseObj[0]?.OnPageError : '');
            setOffenseErrorStatus(true);

          } else {

            if (incObj?.IsOffence) {
              setOffenseErrorString(incObj?.IsOffenceError ? incObj?.IsOffenceError : '');
              setIsOffenseInc(true); setOffenseErrorStatus(true);

            } else {
              setIsOffenseInc(false); setOffenseErrorStatus(false); setOffenseErrorString('');

            }
          }

        } else {
          setOffenseErrorStatus(false); setOffenseErrorString('');

        }

        if (propertyValidateNibrsData) {
          const proObj = propertyValidateNibrsData?.Properties ? propertyValidateNibrsData?.Properties : [];
          console.log("🚀 ~ ValidateProperty ~ proObj:", proObj)

          // set property error string
          if (proObj?.length > 0) {

            if (proObj[0]?.OnPageError?.includes("Property must be present.") && proObj[0]?.PropertyType != 'V') {
              setIsCrimeAgainstPropertyError(true); setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false);

            } else if (proObj[0]?.OnPageError?.includes("For Crime Against Property Property must be present.") && proObj[0]?.PropertyType != 'V') {
              setIsCrimeAgainstPropertyError(true); setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false);

            } else if (proObj[0]?.OnPageError?.includes("{352} Add at least one suspected drug type(create a property with type 'Drug')") || proObj[0]?.OnPageError?.includes("Add at least one suspected drug type(create a property with type 'Drug').") && proObj[0]?.PropertyType != 'V') {
              setSuspectedDrugTypeErrorStatus(true); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

            } else if (proObj[0]?.OnPageError?.includes("{074} Need a property loss code of 5,7 for offense  23B") && proObj[0]?.PropertyType != 'V') {
              setIsPropertyIdZeroError(true); setSuspectedDrugTypeErrorStatus(false); setIsCrimeAgainstPropertyError(false);

            } else {
              setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

            }

            // const isCrimeAgainstError = proObj[0]?.OnPageError?.includes("Property must be present.");

            // const isSuspectedDrugType = proObj[0]?.OnPageError?.includes("{352} Add at least one suspected drug type(create a property with type 'Drug')") || proObj[0]?.OnPageError?.includes("Add at least one suspected drug type(create a property with type 'Drug').");

            // const isPropertyIdZeroError = (proObj[0]?.OnPageError?.includes("{074} Need a property loss code of 5,7 for offense  23B") && proObj[0]?.PropertyType != 'V');

            // if (isCrimeAgainstError) {
            //   setIsCrimeAgainstPropertyError(true); setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false);

            // } else if (isSuspectedDrugType) {
            //   setSuspectedDrugTypeErrorStatus(true); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

            // } else if (isPropertyIdZeroError) {
            //   setIsPropertyIdZeroError(true); setSuspectedDrugTypeErrorStatus(false); setIsCrimeAgainstPropertyError(false);

            // } else {
            //   setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false); setIsCrimeAgainstPropertyError(false);

            // }

            const VehArr = proObj?.filter((item) => item?.PropertyType === 'V');
            // console.log("🚀 ~ validateNibrs ~ VehArr:", VehArr)
            const PropArr = proObj?.filter((item) => item?.PropertyType !== 'V' && item?.PropertyType !== null);
            console.log("🚀 ~ validateNibrs ~ PropArr:", PropArr)



            if (VehArr?.length > 0) {
              const VehErrorArray = VehArr || []
              if (VehErrorArray.every(item => item === null || item === undefined)) {
                setVehErrorStatus(false); setVehicleErrorString('');

              } else {
                setVehicleErrorString(VehArr[0]?.OnPageError ? VehArr[0]?.OnPageError : ''); setVehErrorStatus(true);

              }
            } else {
              setVehErrorStatus(false); setVehicleErrorString('');
            }

            // set property error string
            if (PropArr?.length > 0) {
              const PropErrorArray = PropArr || []
              if (PropErrorArray.every(item => item === null || item === undefined)) {
                setPropErrorStatus(false); setPropertyErrorString('');

              } else {
                setPropertyErrorString(PropArr[0]?.OnPageError ? PropArr[0]?.OnPageError : ''); setPropErrorStatus(true);

              }

            } else {
              setPropErrorStatus(false); setPropertyErrorString('');

            }

          } else {

          }

        } else {
          setPropErrorStatus(false); setPropertyErrorString(''); setVehErrorStatus(false); setVehicleErrorString('');

        }

        // set offender error string
        if (offenderValidateNibrsData) {
          const offenderObj = offenderValidateNibrsData?.Offender ? offenderValidateNibrsData?.Offender : [];
          if (offenderObj?.length > 0) {
            setOffenderErrorString(offenderObj[0]?.OnPageError ? offenderObj[0]?.OnPageError : ''); setOffenderErrorStatus(true);
          } else {
            setOffenderErrorStatus(false); setOffenderErrorString('');
          }
        } else {
          setOffenderErrorStatus(false); setOffenderErrorString('');

        }

        // set victim error string
        if (victimValidateNibrsData) {
          const victimObj = victimValidateNibrsData?.Victim ? victimValidateNibrsData?.Victim : [];
          if (victimObj?.length > 0) {
            const isVictimConnectedError = victimObj[0]?.OnPageError?.includes("At least one victim must be present and must be connected with offence.");
            if (isVictimConnectedError) {
              setIsVictimConnectedError(true);
            } else {
              setIsVictimConnectedError(false);
            }
            setVictimErrorString(victimObj[0]?.OnPageError ? victimObj[0]?.OnPageError : ''); setVictimErrorStatus(true);
          } else {
            setVictimErrorStatus(false); setVictimErrorString(''); setIsVictimConnectedError(false);
          }
        } else {
          setVictimErrorStatus(false); setVictimErrorString('');

        }

        // set loader false
        // setnibrsValidateLoder(false);

      } catch (error) {
        console.log("🚀 ~ ValidateProperty ~ error:", error);
        setnibrsValidateLoder(false);
      }

      // setnibrsValidateLoder(false);
    }
    validateNibrs(incidentValidateNibrsData, offenseValidateNibrsData, victimValidateNibrsData, offenderValidateNibrsData, propertyValidateNibrsData);
  }, [incidentValidateNibrsData, offenseValidateNibrsData, victimValidateNibrsData, offenderValidateNibrsData, propertyValidateNibrsData]);



  const sectionData = [
    {
      title: "Administrative Details",
      status: (!isOffenseInc && !isGroup_B_Offense_ArrestInc) ? !nibrsValidateIncidentData?.Administrative ? "completed" : "attention highlighted" : "completed",
      sectionKey: "admin",
      list: <Administrative_Details incidentClick={incidentClick} isNibrsSummited={isNibrsSummited} />
    },
    {
      title: !isOffenseInc ? `Offense (${offenseCount})` : (
        <span
          className="text-center"
          style={{
            border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red',
            padding: '3px', borderRadius: '4px', display: 'inline-block',
            transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
          }}
        >
          Offense --- This Incident does not have any TIBRS reportable Crime(s)
        </span>
      ),
      status: !offenseErrorStatus && !isOffenseInc ? "completed" : "attention highlighted",
      sectionKey: "offenses",
      list: (
        <Offense
          offenseClick={offenseClick}
          isNibrsSummited={isNibrsSummited}
          ValidateProperty={ValidateProperty}
        />
      )
    },

    {
      title: `Offender (${OffenderCount})`,
      status: !offenderErrorStatus ? "completed" : "attention highlighted",
      sectionKey: "offenders",
      list: <MainOffender offenderClick={offenderClick} isNibrsSummited={isNibrsSummited} ValidateProperty={ValidateProperty} />
    },
    {
      title: isVictimConnectedError ? <span className="text-center" style={{
        border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red', padding: '3px', borderRadius: '4px', display: 'inline-block',
        transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
      }}>Victim --- At least one victim must be present and must be connected with offense</span> : `Victim (${VictimCount})`,
      status: !victimErrorStatus && !isVictimConnectedError ? "completed" : "attention highlighted",
      sectionKey: "Victims",
      list: <MainVictims victimClick={victimClick} isNibrsSummited={isNibrsSummited} ValidateProperty={ValidateProperty} />
    },
    {
      title: !isSuspectedDrugTypeErrorStatus && !isPropertyIdZeroError && !isCrimeAgainstPropertyError ? `Property (${PropertyCount})`
        :
        isCrimeAgainstPropertyError ? <span className="text-center" style={{
          border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red', padding: '3px', borderRadius: '4px', display: 'inline-block', transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
        }}>Property --- For Crime Against Property Property must be present.</span>
          :
          isSuspectedDrugTypeErrorStatus ? <span className="text-center" style={{
            border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red', padding: '3px', borderRadius: '4px', display: 'inline-block',
            transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
          }}>Property --- Add at least one suspected drug type(create a Property with type 'Drug')</span>
            :
            isPropertyIdZeroError ? <span className="text-center" style={{
              border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red', padding: '3px', borderRadius: '4px', display: 'inline-block',
              transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
            }}>Property --- Need a property loss code of 5,7 for offense  23B</span> : `Property (${PropertyCount})`,

      status: !propErrorStatus ? "completed" : "attention highlighted",
      sectionKey: "Properties",
      list: <Properties propertyClick={propertyClick} isNibrsSummited={isNibrsSummited} ValidateProperty={ValidateProperty} />
    },
    {
      title: `Vehicle (${VehicleCount})`,
      status: !vehErrorStatus ? "completed" : "attention highlighted",
      sectionKey: "VehicleTab",
      list: <VehicleTab vehicleClick={vehicleClick} isNibrsSummited={isNibrsSummited} ValidateProperty={ValidateProperty} />
    },
    {
      title: !isGroup_B_Offense_ArrestInc ? `Arrestee (${ArrestCount})` : <span className="text-center" style={{
        border: '1px solid red', backgroundColor: '#ffe6e6', color: 'red',
        padding: '3px', borderRadius: '4px', display: 'inline-block',
        transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
      }}>Arrestee --- Warning: There is no arrest attached to this Group B offense Incident</span>,
      status: !nibrsValidateIncidentData?.Arrestees && !isGroup_B_Offense_ArrestInc ? "completed" : "attention highlighted",
      sectionKey: "Arrestees",
      list: <Arrestees arrestClick={arrestClick} isNibrsSummited={isNibrsSummited} />
    },
  ];

  // useEffect(() => {
  //   const validateIncident = async () => {
  //     if (IncID && incReportedDate && baseDate && oriNumber) {
  //       if (nibrsValidateIncidentData?.length === 0) {
  //         await ValidateProperty(IncID);
  //       }
  //     }
  //   }
  //   validateIncident();
  // }, [incReportedDate, IncID, baseDate, oriNumber]);


  return (
    <>
      <div className="nibrs-container pt-1 p-1 bt">
        <div className="col-12  inc__tabs">
          <Tab />
        </div>
        <div className="report-sections " style={{ border: " 1px solid #174F73" }}>
          {sectionData.map((section) => (
            <div key={section.sectionKey}>
              <div
                className={`section-item ${section.status}`}
                onClick={() => toggleSection(section.sectionKey)}
                style={{ cursor: "pointer" }}
              >
                <div className="section-left">
                  <div className="status-icon">
                    <FontAwesomeIcon
                      icon={section.status.includes("completed") ? faCheckCircle : faExclamationCircle}
                      style={{ color: section.status.includes("completed") ? "#4CAF50" : "	#ff0000" }}
                    />
                  </div>
                  <div className="section-content">
                    <h3>{section.title}</h3>

                    {section.meta && (
                      <div className="section-meta">
                        {section.meta.map((item, index) => (
                          <span key={index} className="meta-item">
                            <span className="meta-icon">{item.split(" ")[0]}</span> {item.split(" ").slice(1).join(" ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="section-right">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{
                      transition: "transform 0.3s",
                      transform: openSection === section.sectionKey ? "rotate(90deg)" : "rotate(0deg)",
                      color: "#666",
                    }}
                  />
                </div>
              </div>
              {openSection === section.sectionKey && (
                <div className="accordion-content">
                  {Array.isArray(section.list) ? (
                    <ul>
                      {section.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    section.list // Render component directly if not an array
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            // ValidateProperty(incidentID);
            validate_IncSideBar(incidentID, IncNo, loginAgencyID);
            setNibrsErrModalStatus(true);
          }}
          data-toggle={"modal"}
          data-target={"#NibrsAllModuleErrorShowModal"}
          className={`btn text-white btn-sm mt-2`}
          style={{
            backgroundColor: `${incidentErrorStatus || offenderErrorStatus || propErrorStatus || vehErrorStatus || victimErrorStatus || offenseErrorStatus || isGroup_B_Offense_ArrestInc || isOffenseInc ? 'red' : 'teal'}`,
          }}
        >
          Validate TIBRS Screen
        </button>
      </div>
      <NirbsAllModuleErrorShowModal
        incidentErrorStatus={incidentErrorStatus}
        nibErrModalStatus={nibrsErrModalStatus}
        setNibrsErrModalStatus={setNibrsErrModalStatus}
        nibrsValidateloder={nibrsValidateloder}

        administrativeErrorString={administrativeErrorString}
        incidentErrorString={incidentErrorString}
        offenseErrorString={offenseErrorString}
        victimErrorString={victimErrorString}
        offenderErrorString={offenderErrorString}
        propertyErrorString={propertyErrorString}
        vehicleErrorString={vehicleErrorString}
      />

      {
        nibrsSideBarLoading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )
      }

      {/* {
        nibrsValidateloder && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )
      } */}
    </>
  );
};

export default NibrsHome;
