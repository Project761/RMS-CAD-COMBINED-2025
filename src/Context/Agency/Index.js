import React, { createContext, useState } from 'react'
import { Decrypt_Id_Name, } from '../../Components/Common/Utility'
import { AddDeleteUpadate, fetchData, fetchDate, fetchPostData, fetchPostDataNibrs } from '../../Components/hooks/Api'
import { Comman_changeArrayFormat, sixColArray, sixColArrayArrest, threeColArray, threeColArrayWithCode } from '../../Components/Common/ChangeArrayFormat'
import { toastifyError } from '../../Components/Common/AlertMsg'

export const AgencyContext = createContext()

const AgencyData = ({ children }) => {

    // All Use  
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [loder, setLoder] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [allowMultipleLogin, setAllowMultipleLogin] = useState(0);
    const [caseManagementDataIncidentRecent, setCaseManagementDataIncidentRecent] = useState([]);
    const [updateCount, setUpdateCount] = useState(0);
    const [Is2FAEnabled, setIs2FAEnabled] = useState(false);
    // ------------>| password |<-------------------  
    const [forgetPasswordArray, setForgetPasswordArray] = useState([]);
    // ------------>| Agency |<-------------------       
    const [agencyData, setAgencyData] = useState([]);
    const [agencyFilterData, setAgencyFilterData] = useState([]);
    const [editStatus, setEditStatus] = useState(false);
    const [count, setCount] = useState({});
    const [agencyID, setAgencyID] = useState('');
    const [agnecyName, setAgencyName] = useState('');
    const [status, setStatus] = useState(false);
    const [showPage, setShowPage] = React.useState('home');
    const [changesStatus, setChangesStatus] = useState(false);
    const [changesStatusCount, setChangesStatusCount] = useState(0);
    const [inActiveStatus, setInActiveStatus] = useState(false);
    // ------------>| Personnel |<-------------------
    const [personnelList, setPersonnelList] = useState([]);
    const [showPagePersonnel, setShowPagePersonnel] = React.useState('home');
    const [personnelStatus, setPersonnelStatus] = useState(false);
    const [personnelFilterData, setPersonnelFilterData] = useState('');
    const [PersonnelEffectiveScreenPermission, setPersonnelEffectiveScreenPermission] = useState();
    // for Screen Permission -- Utility -> Personnel
    const [utilityTable, setUtilityTable] = useState({});

    // ------------>| Incident |<-------------------
    const [incidentStatus, setIncidentStatus] = useState(false);
    const [showIncPage, setShowIncPage] = useState('home');
    const [incidentNumber, setIncidentNumber] = useState();
    const [crimeId, setCrimeId] = useState('');
    const [incStatus, setIncStatus] = useState();
    const [offenceData, setOffenceData] = useState([]);
    const [offenceFillterData, setOffenceFillterData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [resourceData, setResourceData] = useState([]);
    const [allResourcesData, setAllResourcesData] = useState([]);
    const [exceptionalClearID, setEceptionalClearID] = useState([]);
    const [rmsDisposition, setRmsDisposition] = useState([]);
    const [incidentCount, setIncidentCount] = useState([]);
    const [tabCount, setTabCount] = useState([]);
    const [tabCountArrest, setTabCountArrest] = useState([]);
    const [datezone, setDatezone] = useState();
    const [nibrsStatus, setnibrsStatus] = useState(false);
    const [nibrsSubmittedStatus, setnibrsSubmittedStatus] = useState(0);
    const [nibrsSubmittedAdministartive, setnibrsSubmittedAdministartive] = useState(1);
    const [nibrsSubmittedOffense, setnibrsSubmittedOffense] = useState(0);
    const [nibrsSubmittedOffender, setnibrsSubmittedOffender] = useState(0);
    const [nibrsSubmittedVictim, setnibrsSubmittedVictim] = useState(0);
    const [nibrsSubmittedProperty, setnibrsSubmittedProperty] = useState(0);
    const [nibrsSubmittedVehicle, setnibrsSubmittedVehicle] = useState(0);
    const [nibrsSubmittedArrestee, setnibrsSubmittedArrestee] = useState(0);
    const [nibrsSubmittedName, setnibrsSubmittedName] = useState(0);
    const [nibrsSubmittedIncident, setnibrsSubmittedIncident] = useState(0);
    const [nibrsSubmittedOffenseMain, setnibrsSubmittedOffenseMain] = useState(0);
    const [nibrsSubmittedPropertyMain, setnibrsSubmittedPropertyMain] = useState(0);
    const [nibrsSubmittedvehicleMain, setnibrsSubmittedvehicleMain] = useState(0);
    const [nibrsSubmittedArrestMain, setnibrsSubmittedArrestMain] = useState(0);
    const [incidentFilterData, setIncidentFilterData] = useState();
    const [AllProRoomFilterData, setAllProRoomFilterData] = useState();
    const [CaseStatus, setCaseStatus] = useState('Open');
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);

    //----arrest-----
    const [arrestData, setArrestData] = useState([]);
    const [arrestFilterData, setArrestFilterData] = useState([]);
    const [arrestChargeData, setArrestChargeData] = useState([]);
    const [policeForceDrpData, setPoliceForceDrpData] = useState([]);
    const [arresteeDrpData, setArresteeDrpData] = useState([]);
    const [EditArrestStatus, setEditArrestStatus] = useState();
    const [arrestSearch, setarrestSearch] = useState([]);
    const [ArresteName, setArrestName] = useState(false);
    const [ArrestChargeStatus, setArrestChargeStatus] = useState('');
    const [ArresteeID, setArresteeID] = useState([]);
    const [activeArrest, setActiveArrest] = useState(null);

    const [incidentRecentData, setIncidentRecentData] = useState([]);
    const [incidentRmsCfs, setIncidentRmsCfs] = useState('');

    // Offense
    const [offenceShowPage, setOffenceShowPage] = useState('home');
    const [offenceStatus, setOffenceStatus] = useState();
    const [offenseCount, setOffenseCount] = useState([]);
    const [countoff, setcountoff] = useState(false)
    const [countoffaduit, setcountoffaduit] = useState(false)
    const [countoffaduitAgency, setcountoffaduitAgency] = useState(false)
    const [countaduitprsonel, setcountaduitprsonel] = useState(false)
    const [OfficerApprovCount, setOfficerApprovCount] = useState(false)
    const [PanelCode, setPanelCode] = useState()
    const [NameId, setNameID] = useState('')
    const [offenseChargeCount, setoffenseChargeCount] = useState('')



    // Name
    const [nameData, setNameData] = useState([]);
    const [nameFilterData, setNameFilterData] = useState([]);
    const [nameStatus, setNameStatus] = useState();
    const [nameSearchData, setNameSearchData] = useState([]);
    const [nameSearchStatus, setNameSearchStatus] = useState(false);
    const [nameSingleData, setNameSingleData] = useState([]);
    const [nameShowPage, setNameShowPage] = useState('home');
    const [NameTabCount, setNameTabCount] = useState([]);
    const [MasterNameTabCount, setMasterNameTabCount] = useState([]);
    const [NameVictimCount, setNameVictimCount] = useState([]);
    const [countStatus, setcountStatus] = useState(false)
    const [countAppear, setcountAppear] = useState(false)
    const [auditCount, setAuditCount] = useState(false)
    const [victimCount, setVictimCount] = useState(false)
    const [offenderCount, setOffenderCount] = useState(false)
    const [offenceCountStatus, setoffenceCountStatus] = useState(false)
    const [masterCountgenStatus, setMasterCountgenStatus] = useState(false)
    const [masterAppeaCountStatus, setmasterAppeaCountStatus] = useState(false)

    //property
    const [propertyData, setPropertyData] = useState([]);
    const [propertyFilterData, setPropertyFilterData] = useState([]);
    const [propertyStolenValue, setPropertyStolenValue] = useState('');
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [propertyStatus, setPropertyStatus] = useState(false);
    const [locationPath, setLocationPath] = useState();
    const [locationStatus, setlocationStatus] = useState(false);
    const [propertyCount, setPropertyCount] = useState('');
    const [countmiscellinfo, setcountmiscellinfo] = useState(false)

    //Vehicle
    const [VehicleData, setVehicleData] = useState([]);
    const [VehicleFilterData, setVehicleFilterData] = useState([]);
    const [vehicleStatus, setVehicleStatus] = useState(false);
    const [vehicleCount, setVehicleCount] = useState('')
    //PropertyRoom
    const [BarCodeStatus, setBarCodeStatus] = useState([]);


    // Warent
    const [warentData, setwarentData] = useState([]);
    const [warentFilterData, setwarentFilterData] = useState([]);
    const [warentStatus, setWarentStatus] = useState();
    const [warrantChargeData, setWarrantChargeData] = useState();

    // Narrative Reports
    const [assignedReportID, setassignedReportID] = useState([]);


    //Data Searches
    const [incidentSearchData, setIncidentSearchData] = useState([]);
    const [nameSearch, setnameSearch] = useState([]);
    const [arrestSearchData, setArrestSearchData] = useState([]);
    const [propertySearchData, setPropertySearchData] = useState([]);
    const [vehicleSearchData, setVehicleSearchData] = useState([]);
    const [VehicleSearch, setVehicleSearch] = useState([]);
    const [searchCertificationData, setSearchCertificationData] = useState([]);

    const [showWatermark, setShowWatermark] = useState(false);


    // WebSocket
    const [ws, setWs] = useState(null)

    //Local Storage
    const [localStoreArray, setLocalStoreArray] = useState({});
    const [tokenArray, setTokenArray] = useState([]);
    const [reportedDtTmInc, setReportedDtTmInc] = useState()
    const [incAdvSearchData, setIncAdvSearchData] = useState(false)

    // Recent Search
    const [recentSearchData, setRecentSearchData] = useState([]);
    const [searchObject, setSearchObject] = useState({});

    const [personNotifyDrp, setpersonNotifyDrp] = useState([]);

    const AlllocalStore = {
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    }

    //------------------- Local Storage ------------------>
    const get_LocalStorageToken = (localStoreObj) => {
        fetchPostData('LocalStorage/GetData_MultipleKeyLocalStorage', localStoreObj).then((res) => {
            if (res) {
                setTokenArray(res[0]);
            }
        })
    }

    //----------get the All  local Array data  with unique ID ------------Dk-> 
    const get_LocalStorage = () => {
        fetchPostData('LocalStorage/GetData_UniqueLocalStorage', AlllocalStore).then((res) => {
            if (res) {
                setLocalStoreArray(res[0]);
            }
        })
    }

    //----------delete the local Array data of specific key with object ------------Dk-> 
    const deleteStoreData = async (LocalStoreObj) => {
        let arr = Object.keys(LocalStoreObj)
        arr.forEach(prop => delete localStoreArray[prop])
        const val = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify(LocalStoreObj),
        }
        AddDeleteUpadate('LocalStorage/DeleteLocalStorageWithKey', val).then((res) => {
            if (res.success) {
                console.log("Deleted Successfully")
            }
        })
    }

    //----------Add Data in local Array  of specific key with object ------------Dk------> 
    const storeData = (LocalStoreObj) => {
        const val = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify(LocalStoreObj),
        }
        AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
            if (res.success) {
            }
        })
    }

    const [authSession, setAuthSession] = useState({})
    const [isLogout, setIsLogout] = useState(false)
    const [logByOtp, setLogByOtp] = useState(false)

    const getAuthSession = () => {
        const param = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify({ auth_token: "" }),
        };
        fetchPostData('LocalStorage/GetData_MultipleKeyLocalStorage', param).then((res) => {
            if (res?.length > 0) {
                setAuthSession(res[0]);
            }
        })
    }

    const getAgency = async (AgencyID, PinID) => {
        const value = { AgencyID: AgencyID, PINID: PinID, }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(data)
                setAgencyFilterData(data)
            } else {
                setAgencyData([]);
                setAgencyFilterData([]);
            }
        })
    }

    const getInActiveAgency = async () => {
        fetchData("Agency/GetData_InActiveAgency").then((data) => {
            if (data) {
                setAgencyData(data)
                setAgencyFilterData(data)
            } else {
                setAgencyData([]);
                setAgencyFilterData([]);
            }
        })
    }

    const get_OffenseName_Data = (DecNameID , status) => {
        const val = { 'NameID': DecNameID, 'IsIncidentOffense': status }
        fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
            if (res) {
                setArrestChargeData(res);
            } else {
                setArrestChargeData([]);
            }
        }).catch((err) => {
            console.log("🚀 ~ getOffenseData ~ err:", err);
        })
    }

    const get_CountList = (updAgencyID, PINID) => {
        const val = {
            AgencyID: updAgencyID,
            PINID: PINID || 0
        }
        fetchPostData('HomeApi/GetData_AgencyCount', val)
            .then((res) => {
                setCount(res[0])
            })
    }

    const get_Personnel_Lists = (id, PINID) => {
        const val = { 'AgencyID': id, 'PINID': PINID }
        fetchPostData('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); setPersonnelFilterData(res) }
                else { setPersonnelList([]); setPersonnelFilterData([]) }
            })
    }

    const getInActive_Personnel = (id) => {
        const val = {
            AgencyID: id
        }
        fetchPostData('Personnel/GetData_InActivePersonnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); setPersonnelFilterData(res) }
                else { setPersonnelList([]); setPersonnelFilterData([]) }
            })
    }

    // ------------>| Incident |<-------------------

    // ---- DS

    const GetDataTimeZone = (AgencyID) => {
        const val = { 'AgencyID': AgencyID }
        fetchDate('Account/GetDateTime', val).then((res) => {
            if (res) {
                setDatezone(res)
            }
        })
    }

    // Offence
    const get_Offence_Data = (IncidentId) => {
        const val = { 'IncidentId': IncidentId, }
        fetchPostData('Crime/GetData_Offense', val)
            .then(res => {
                if (res) {
                    setOffenceData(res); setOffenceFillterData(res)
                }
                else { setOffenceData([]); setOffenceFillterData([]) }
            })
    };

    const get_Warent_Data = (IncidentId) => {
        const val = {
            'IncidentId': IncidentId,
        }
        fetchPostData('Warrant/GetData_Warrant', val)
            .then(res => {
                if (res) {
                    setwarentData(res); setwarentFilterData(res)
                }
                else { setwarentData([]); setwarentFilterData([]) }
            })
    };

    const GetDataExceptionalClearanceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_ExceptionalClearance', val).then((data) => {
            if (data) {
                setEceptionalClearID(threeColArrayWithCode(data, 'ClearanceID', 'Description', 'ClearanceCode'))
            } else {
                setEceptionalClearID([]);
            }
        })
    }

    const getRmsDispositionID = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID, }
        fetchPostData('Incident/GetData_RMSDisposition', val).then((data) => {
            if (data) {
                setRmsDisposition(threeColArray(data, 'RMSDispositionId', 'RMSDispositionCode', 'DispositionCode'))
            } else {
                setRmsDisposition([]);
            }
        })
    }

    // Name
    const get_Data_Name = (NameID) => {
        const val = { 'IncidentID': NameID || 0 }
        fetchPostData('MasterName/GetData_MasterName', val).then((res) => {
            if (res) {
                setNameData(res); setNameFilterData(res)
            } else {
                setNameData([]); setNameFilterData([])
            }
        })
    }

    const get_Data_Arrest = (IncidentID, MstPage, loginPinID) => {
        const val = {
            'IncidentID': IncidentID,
            'PINID': loginPinID
        }
        const val2 = {
            'IncidentID': '0',
            'PINID': loginPinID
        }
        fetchPostData('Arrest/GetData_Arrest', MstPage === 'MST-Arrest-Dash' ? val2 : val).then((res) => {
            if (res) {
                setArrestData(res);
                setArrestFilterData(res);
            } else {
                setArrestData([]);
                setArrestFilterData([]);
            }
        })
    }

    const get_Arrestee_Drp_Data = (MstPage, MasterNameID, IncidentID) => {
        const val = { 'MasterNameID': '0', 'IncidentID': IncidentID }
        const val1 = { 'IncidentID': '0', 'MasterNameID': MasterNameID }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', MstPage === 'MST-Arrest-Dash' ? val1 : val).then((data) => {
            if (data) {
                setArresteeDrpData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
                setArresteeID(Comman_changeArrayFormat(data, 'NameID', 'Arrestee_Name'))

            }
            else {
                setArresteeDrpData([]); setArresteeID([]);
            }
        })
    };

    const get_Police_Force = () => {
        fetchData('DropDown/GetDataDropDown_RightsGiven').then((data) => {
            if (data) {
                setPoliceForceDrpData(threeColArray(data, 'RightGivenID', 'Description', 'Code'));
            }
            else {
                setPoliceForceDrpData([])
            }
        })
    };

    // Arrest subTab  Charge Data
    const get_Data_Arrest_Charge = (ArrestID) => {
        const val = {
            'ArrestID': ArrestID,
        }
        fetchPostData('ArrestCharge/GetData_ArrestCharge', val).then((res) => {
            if (res) {
                setArrestChargeData(res)
            } else {
                setArrestChargeData([]);
            }
        })
    }

    const get_Data_Warrant_Charge = (WarrantID) => {
        const val = { 'WarrantID': WarrantID, }
        fetchPostData('ArrestCharge/GetData_ArrestChargeWarrant', val).then((res) => {
            if (res) {
                setWarrantChargeData(res)
            } else {
                setWarrantChargeData([]);
            }
        })
    }

    // get Data Property 
    const get_Data_Property = (IncidentID) => {
        const val = { 'IncidentID': IncidentID }
        fetchPostData('Property/GetData_Property', val).then((res) => {
            if (res) {
                setPropertyData(res); setPropertyFilterData(res);
            } else {
                setPropertyData([]); setPropertyFilterData([]);
            }
        })
    }

    const get_PropertyLossCode = (LoginAgencyID, IsArticleReason, IsBoatReason, IsSecurityReason, IsOtherReason, IsDrugReason, IsGunReason) => {
        const val = {
            AgencyID: LoginAgencyID, IsArticleReason: IsArticleReason || 0, IsBoatReason: IsBoatReason || 0,
            IsSecurityReason: IsSecurityReason || 0, IsOtherReason: IsOtherReason || 0,
            IsDrugReason: IsDrugReason || 0, IsGunReason: IsGunReason || 0,
        }
        fetchPostData('PropertyReasonCode/GetDataDropDown_PropertyReasonCode', val).then((data) => {
            if (data) {
                let arr = threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode')
                let newArr = arr?.filter((value, index) => value?.id !== "PAWN" && value?.label !== "Pawned Property");
                setPropertyLossCodeData(newArr)
            } else {
                setPropertyLossCodeData([]);
            }
        })
    }

    // get Data vehicle 
    const get_Data_Vehicle = (IncidentId) => {
        const val = { 'IncidentId': IncidentId, }
        fetchPostData('PropertyVehicle/GetData_PropertyVehicle', val).then((res) => {
            if (res) {
                setVehicleData(res); setVehicleFilterData(res)
            } else {
                setVehicleData([]); setVehicleFilterData([])
            }
        })
    }

    const get_Incident_Count = (IncidentID, loginPinID) => {
        const val = { 'IncidentID': IncidentID, 'PINID': loginPinID }
        fetchPostData('HomeApi/GetData_IncidentCount', val).then((res) => {
            if (res) {
                setIncidentCount(res);
            } else {
                setIncidentCount([]);
            }
        })
    }

    const get_IncidentTab_Count = (IncidentID, loginPinID) => {
        const val = { 'IncidentID': IncidentID, 'PINID': loginPinID }
        fetchPostData('HomeApi/GetData_IncidentTabCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }


    const get_MissingPerson_NotifyDrp = (IncidentID, MissingPersonID, IsPersonToBeNotified) => {
        const val = {
            'IncidentID': IncidentID, 'MissingPersonID': MissingPersonID, 'IsPersonToBeNotified': IsPersonToBeNotified ? true : false
        };

        fetchPostData('MissingPerson/GetDropDown_PersonToByNotified', val).then((data) => {
            if (data) {
                setpersonNotifyDrp(sixColArrayArrest(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile'));
            } else {
                setpersonNotifyDrp(sixColArrayArrest(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile'));
            }
        })
    };

    //-----------------offence-Tab-Count------------------------------
    const get_Offence_Count = (CrimeID) => {
        const val = { 'CrimeID': CrimeID, }
        fetchPostData('HomeApi/GetData_OffenseCount', val).then((res) => {
            if (res) {
                setOffenseCount(res[0]);
            } else {
                setOffenseCount([]);
            }
        })
    }


    const get_Name_Count = (NameID, masterID, IsMaster) => {
        const val = { 'NameID': NameID, 'MasterNameID': masterID, 'IsMaster': IsMaster, }
        fetchPostData('HomeApi/GetData_NameCount', val).then((res) => {
            if (res) {
                setNameTabCount(res[0]);
            } else {
                setNameTabCount([]);
            }
        })
    }

    const get_MasterName_Count = (NameID, masterID, IsMaster) => {
        const val = { 'NameID': NameID, 'MasterNameID': masterID, 'IsMaster': IsMaster, }
        fetchPostData('HomeApi/GetData_NameCount', val).then((res) => {
            if (res) {
                setMasterNameTabCount(res[0]);
            } else {
                setMasterNameTabCount([]);
            }
        })
    }

    const get_NameVictim_Count = (VictimID) => {
        const val = { 'VictimID': VictimID, }
        fetchPostData('NameVictimCount/GetData_NameVictimCount', val).then((res) => {
            if (res) {
                setNameVictimCount(res[0]);
            } else {
                setNameVictimCount([]);
            }
        })
    }

    const get_NameOffender_Count = (NameID) => {
        const val = { 'NameID': NameID, }
        fetchPostData('NameVictimCount/GetData_NameOffenderCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //-----------------------------Property-Count-----------------------
    const get_Property_Count = (PropertyID, MasterPropID, IsMaster) => {
        const val = { 'PropertyID': PropertyID, 'MasterPropertyID': MasterPropID, 'IsMaster': IsMaster, }
        fetchPostData('HomeApi/GetData_PropertyCount', val).then((res) => {
            if (res) {
                setPropertyCount(res[0]);
            } else {
                setPropertyCount([]);
            }
        })
    }

    //------------------------------------------Vicile-Count--------------------------------------
    const get_vehicle_Count = (VehicleID, MasterPropertyID) => {
        const val = { 'PropertyID': VehicleID, 'MasterPropertyID': 0, 'IsMaster': false }
        const val1 = { 'PropertyID': 0, 'MasterPropertyID': MasterPropertyID, 'IsMaster': true }

        fetchPostData('HomeApi/GetData_VehicleCount', VehicleID ? val : val1).then((res) => {
            if (res) {
                setVehicleCount(res[0]);
            } else {
                setVehicleCount([]);
            }
        })
    }

    //------------Arrest-Count--------------------------
    const get_Arrest_Count = (ArrestID) => {
        const val = { 'ArrestID': ArrestID }
        fetchPostData('HomeApi/GetData_ArrestCount', val).then((res) => {
            if (res) {
                setTabCountArrest(res[0]);
            } else {
                setTabCountArrest([]);
            }
        })
    }

    const get_ArrestCharge_Count = (ChargeID) => {
        const val = { 'ChargeID': ChargeID }
        fetchPostData('ArrestCharge/GetData_ArrestChargeCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //------------------------------Warrent_Count---------------------------
    const get_Warrent_Count = (WarrantID) => {
        const val = { 'WarrantID': WarrantID, }
        fetchPostData('HomeApi/GetData_WarrantCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    //--------------------------Missing Person Tab Count -----------------------------------

    const get_MissingPerson_Count = (MissingPersonID, loginPinID) => {
        const val = { 'MissingPersonID': MissingPersonID, 'PINID': loginPinID }
        fetchPostData('MissingPerson/GetData_MissingPersonCount', val).then((res) => {
            if (res) {
                setTabCount(res[0]);
            } else {
                setTabCount([]);
            }
        })
    }

    const [personnelData, setPersonnelData] = useState([]);

    const getPersonnelList = async () => {
        fetchData('CADIncidentStatus/GetData_CurrentStatus').then((res) => {
            if (res.length > 0) {
                setPersonnelData(res);
            } else {
                toastifyError("Data Not Available"); setPersonnelData([]);
            }
        });
    };


    // nibrs incident error
    const [incidentErrorStatus, setIncidentErrorStatus] = useState(false);
    const [incidentValidateNibrsData, setIncidentValidateNibrsData] = useState([]);
    // nibrs offense
    const [offenseErrorStatus, setOffenseErrorStatus] = useState(false);
    const [offenseValidateNibrsData, setOffenseValidateNibrsData] = useState([]);
    // nibrs name
    const [nameErrorStatus, setNameErrorStatus] = useState(false);
    const [victimValidateNibrsData, setVictimValidateNibrsData] = useState([]);
    const [offenderValidateNibrsData, setOffenderValidateNibrsData] = useState([]);
    // nibrs name relation
    const [NameRelationshipError, setNameRelationshipError] = useState(false);
    // nibrs narrative
    const [narrativeApprovedStatus, setNarrativeApprovedStatus] = useState(false);
    // nibrs property
    const [PropErrorStatus, setPropErrorStatus] = useState(false);
    const [propertyValidateNibrsData, setPropertyValidateNibrsData] = useState([]);
    // nibrs sideBar Loding Status
    const [nibrsSideBarLoading, setNibrsSideBarLoading] = useState(false);
    // nibrs Name Validate Array
    const [nibrsNameValidateArray, setNibrsNameValidateArray] = useState([]);
    // vehicle
    const [vehErrorStatus, setVehErrorStatus] = useState(false);


    // Update both state and localStorage
    const validate_IncSideBar = async (incidentID, incidentNumber, loginAgencyID) => {
        setNibrsSideBarLoading(true);
        // console.log("🚀 ~ validate_IncSideBar ~ Call:")
        const res = await TXIBRSValidateCall(incidentID, 0, 0, 0, loginAgencyID);

        if (res) {
            const [incidentError, offenseError, victimError, offenderError, DashBoardVicOffRelationStatus, propertyError] = await Promise.all([
                fetchPostDataNibrs('NIBRS/GetIncidentNIBRSError', { 'StrIncidentID': incidentID, 'StrIncidentNumber': incidentNumber, 'StrAgencyID': loginAgencyID }),
                fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", { 'gIncidentID': incidentID, 'IncidentNumber': incidentNumber, 'CrimeId': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': incidentNumber, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': incidentNumber, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostData('DashBoard/GetData_DashBoardIncidentStatus', { 'IncidentID': incidentID, }),
                fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': incidentNumber, 'PropertyId': 0, 'gIntAgencyID': loginAgencyID }),
            ])

            if (incidentError?.Administrative) {
                setIncidentValidateNibrsData(incidentError);
                const incObj = incidentError?.Administrative ? incidentError?.Administrative : [];

                setIncidentErrorStatus(true);

            } else {
                setIncidentErrorStatus(false);

            }

            if (offenseError) {
                setOffenseValidateNibrsData(offenseError);
                const offenseObj = offenseError?.Offense ? offenseError?.Offense : [];

                if (offenseObj?.length > 0) {
                    setOffenseErrorStatus(true);

                } else {
                    setOffenseErrorStatus(false);

                }
            } else {
                setOffenseErrorStatus(false);
            }

            if (victimError || offenderError) {
                setVictimValidateNibrsData(victimError);
                setOffenderValidateNibrsData(offenderError);

                const victimObj = victimError?.Victim ? victimError?.Victim : [];
                const offenderObj = offenderError?.Offender ? offenderError?.Offender : [];

                if (victimObj?.length > 0 || offenderObj?.length > 0) {
                    setNameErrorStatus(true);
                    const combinedArray = [...victimObj, ...offenderObj];
                    setNibrsNameValidateArray(combinedArray);
                } else {
                    setNameErrorStatus(false);
                    setNibrsNameValidateArray([]);
                }
            } else {
                setNameErrorStatus(false);
                setNibrsNameValidateArray([]);
            }

            if (DashBoardVicOffRelationStatus?.length > 0) {
                const NameRelationship = DashBoardVicOffRelationStatus[0]?.NameRelationship;
                const Narrative = DashBoardVicOffRelationStatus[0]?.Narrative;
                const VictimOffense = DashBoardVicOffRelationStatus[0]?.VictimOffense;

                setNameRelationshipError(NameRelationship > 0);
                setNarrativeApprovedStatus(Narrative > 0);

            } else {
                setNameRelationshipError(false);
                setNarrativeApprovedStatus(false);
            }

            if (propertyError) {

                const propertyErrorArray = propertyError?.Properties || [];
                // Check if all items are null or undefined
                if (propertyErrorArray.every(item => item === null || item === undefined)) {
                    setPropertyValidateNibrsData([]);
                    setPropErrorStatus(false);

                } else {
                    setPropertyValidateNibrsData(propertyError);

                    const proObj = propertyError?.Properties || [];

                    const firstError = proObj[0]?.OnPageError || "";

                    const isCrimeAgainstError = firstError.includes("Property must be present.");
                    const isSuspectedDrugType = firstError.includes("{352} Add at least one suspected drug type(create a property with type 'Drug')") || firstError.includes("Add at least one suspected drug type(create a property with type 'Drug').");
                    const isPropertyIdZeroError = firstError.includes("{074} Need a property loss code of 5,7 for offense  23B");

                    const VehArr = proObj.filter(item => item?.PropertyType === 'V');
                    const PropArr = proObj.filter(item => item?.PropertyType && item?.PropertyType !== 'V');

                    if (PropArr.length > 0 || VehArr.length > 0 || isCrimeAgainstError || isSuspectedDrugType || isPropertyIdZeroError) {
                        setPropErrorStatus(true);

                    } else {
                        setPropErrorStatus(false);

                    }


                    if (VehArr?.length > 0) {
                        const VehErrorArray = VehArr || []
                        if (VehErrorArray.every(item => item === null || item === undefined)) {
                            setVehErrorStatus(false);

                        } else {
                            setVehErrorStatus(true);

                        }
                    } else {
                        setVehErrorStatus(false);
                    }


                }
            } else {
                setPropErrorStatus(false);
            }


        } else {
            setNibrsSideBarLoading(false);

        }

        setNibrsSideBarLoading(false);
        sent_NibrsErrorStatus(incidentID, loginAgencyID, incidentErrorStatus || offenseErrorStatus || nameErrorStatus || PropErrorStatus);

    };

    const sent_NibrsErrorStatus = (incidentID, loginAgencyID, status) => {
        const payload = {
            'IsNIBRSError': status,
            'ModifiedByUserFK': loginAgencyID,
            'IncidentID': incidentID
        }
        fetchPostData('Incident/Update_IsNIBRSError', payload).then((res) => {
            // console.log("🚀 ~ UpdateIsNIBRSError ~ res:", res)

        });
    };

    // validate Incident
    const TXIBRSValidateCall = async (incidentID, reportDate, baseDate, oriNumber, loginAgencyID) => {
        try {
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
            return true;
        }
    };


    return (
        <AgencyContext.Provider value={{
            // forgetPassword
            forgetPasswordArray, setForgetPasswordArray, showWatermark, setShowWatermark,
            // All use
            loder, setLoder, LoginPinID, setLoginPinID, LoginAgencyID, setLoginAgencyID, allowMultipleLogin, setAllowMultipleLogin,

            agencyData, agencyFilterData, setAgencyFilterData, getAgency, setEditStatus, editStatus, get_CountList, count, setCount, inActiveStatus, setInActiveStatus, getInActiveAgency, getInActive_Personnel,
            // Agency
            setAgencyID, agencyID, agnecyName, setAgencyName, setShowPage, showPage, status, setStatus, changesStatus, setChangesStatus, setChangesStatusCount, changesStatusCount,

            //  Personnel
            get_Personnel_Lists, personnelList, showPagePersonnel, setShowPagePersonnel, personnelStatus, setPersonnelStatus, personnelFilterData, setPersonnelFilterData, PersonnelEffectiveScreenPermission, setPersonnelEffectiveScreenPermission, personnelData, getPersonnelList,

            // for Screen Permission
            setUtilityTable, utilityTable,
            incidentReportedDate, setIncidentReportedDate,
            // Narrative Reports
            assignedReportID, setassignedReportID, incidentFilterData, setIncidentFilterData, AllProRoomFilterData, setAllProRoomFilterData,

            // Incident
            OfficerApprovCount, setOfficerApprovCount,
            nibrsStatus, setnibrsStatus, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedAdministartive, setnibrsSubmittedAdministartive, nibrsSubmittedOffense, setnibrsSubmittedOffense, nibrsSubmittedOffender,
            setnibrsSubmittedOffender, nibrsSubmittedVictim, setnibrsSubmittedVictim, nibrsSubmittedProperty, setnibrsSubmittedProperty, nibrsSubmittedArrestee, setnibrsSubmittedArrestee, nibrsSubmittedVehicle, setnibrsSubmittedVehicle, nibrsSubmittedName, setnibrsSubmittedName, nibrsSubmittedIncident, setnibrsSubmittedIncident, nibrsSubmittedOffenseMain, setnibrsSubmittedOffenseMain, nibrsSubmittedPropertyMain,
            setnibrsSubmittedPropertyMain, nibrsSubmittedvehicleMain, setnibrsSubmittedvehicleMain, nibrsSubmittedArrestMain, setnibrsSubmittedArrestMain, caseManagementDataIncidentRecent, setCaseManagementDataIncidentRecent,
            incidentStatus, setIncidentStatus, showIncPage, setShowIncPage, incidentNumber, setIncidentNumber, CaseStatus, setCaseStatus, crimeId, setCrimeId, incStatus, setIncStatus, updateCount, setUpdateCount, offenceData, get_Offence_Data, get_Data_Name, incidentRmsCfs, setIncidentRmsCfs, exceptionalClearID, setEceptionalClearID, GetDataExceptionalClearanceID, rmsDisposition, setRmsDisposition, getRmsDispositionID, incidentRecentData, setIncidentRecentData, GetDataTimeZone, setDatezone, datezone,
            // arrest
            ArresteeID, get_OffenseName_Data, setArresteeID, arrestData, get_Data_Arrest, setArrestChargeData, arrestChargeData, get_Data_Arrest_Charge, policeForceDrpData, get_Police_Force, get_Arrestee_Drp_Data, arresteeDrpData, setArresteeDrpData, EditArrestStatus, setEditArrestStatus, ArresteName, setArrestName, ArrestChargeStatus, setArrestChargeStatus, activeArrest, setActiveArrest,
            //Offence
            offenceStatus, setOffenceStatus, offenseChargeCount, setoffenseChargeCount, countoff, setcountoff, countoffaduit, setcountoffaduit, countoffaduitAgency, setcountoffaduitAgency, countaduitprsonel, setcountaduitprsonel, offenseCount, setOffenseCount, PanelCode, setPanelCode, NameId, setNameID,

            // Incident property
            propertyData, setPropertyData, get_Data_Property, propertyStolenValue, setPropertyStolenValue, personNotifyDrp, setpersonNotifyDrp, get_MissingPerson_NotifyDrp,
            // Name
            nameData, nameSearchData, setNameSearchData, nameStatus, setNameStatus, nameSearchStatus, setNameSearchStatus, setcountStatus, countStatus, countAppear, setcountAppear, auditCount, setAuditCount, victimCount, setVictimCount, offenceCountStatus, setoffenceCountStatus, offenderCount, setOffenderCount, masterCountgenStatus, setMasterCountgenStatus, masterAppeaCountStatus, setmasterAppeaCountStatus,
            // vehicle
            get_Data_Vehicle, VehicleData, setVehicleData, vehicleStatus, setVehicleStatus, VehicleSearch, setVehicleSearch, vehicleCount, setVehicleCount,
            // Property Room
            BarCodeStatus, setBarCodeStatus,
            // Property
            propertyTypeData, setPropertyTypeData, propertyLossCodeData, setPropertyLossCodeData, get_PropertyLossCode, propertyStatus, setPropertyStatus,
            locationPath, setLocationPath, locationStatus, setlocationStatus, propertyCount, setPropertyCount, countmiscellinfo, setcountmiscellinfo,
            // Warent 
            warentData, setwarentData, warrantChargeData, get_Data_Warrant_Charge, get_Warent_Data, warentStatus, setWarentStatus, nameSingleData, setNameSingleData, offenceFillterData, setOffenceFillterData, setNameFilterData, nameFilterData, propertyFilterData, setPropertyFilterData, VehicleFilterData, setVehicleFilterData, arrestFilterData, setArrestFilterData, warentFilterData, setwarentFilterData,
            //Count
            get_Incident_Count, incidentCount, setIncidentCount, tabCount, setTabCount, NameTabCount, setNameTabCount, NameVictimCount, setNameVictimCount, MasterNameTabCount, setMasterNameTabCount, get_MasterName_Count, tabCountArrest, setTabCountArrest, get_Offence_Count, get_Name_Count, get_NameVictim_Count, get_NameOffender_Count, get_Property_Count, get_vehicle_Count, get_Arrest_Count, get_Warrent_Count, get_ArrestCharge_Count, get_MissingPerson_Count,
            //Data Searches
            incidentSearchData, setIncidentSearchData, nameSearch, setnameSearch, arrestSearchData, setArrestSearchData, propertySearchData, setPropertySearchData, arrestSearch, setarrestSearch, vehicleSearchData, setVehicleSearchData,
            //-incidentCount
            get_IncidentTab_Count,
            // Web Shocket
            ws, setWs,
            // Incident ShowPages
            nameShowPage, setNameShowPage, offenceShowPage, setOffenceShowPage,
            // localStoreArray
            localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData,
            // Session Auth Token
            tokenArray, setTokenArray, get_LocalStorageToken, authSession, setAuthSession, getAuthSession,
            isLogout, setIsLogout, logByOtp, setLogByOtp,

            reportedDtTmInc, setReportedDtTmInc,
            //incidnet Advance Search Data
            incAdvSearchData, setIncAdvSearchData,
            //event
            eventData, setEventData,
            //resource
            resourceData, setResourceData,
            allResourcesData, setAllResourcesData,
            // recentSearchData
            recentSearchData, setRecentSearchData,
            // searchObject
            searchObject, setSearchObject,
            searchCertificationData, setSearchCertificationData,
            Is2FAEnabled, setIs2FAEnabled,
            // sideBar Nibrs Validate function
            validate_IncSideBar,
            // sideBar Nibrs Error Status
            incidentErrorStatus, offenseErrorStatus, nameErrorStatus, NameRelationshipError, narrativeApprovedStatus, PropErrorStatus, vehErrorStatus, setVehErrorStatus,
            // sideBar Nibrs Loading
            nibrsSideBarLoading, setNibrsSideBarLoading,
            // sideBar Nibrs Name Validate Array
            nibrsNameValidateArray, setNibrsNameValidateArray,
            // sideBar Nibrs Validate Data
            incidentValidateNibrsData, offenseValidateNibrsData, victimValidateNibrsData, offenderValidateNibrsData, propertyValidateNibrsData,
        }}>
            {children}
        </AgencyContext.Provider>
    )
}

export default AgencyData