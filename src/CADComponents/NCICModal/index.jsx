import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import { Tab } from 'react-bootstrap';
import NCICNav from "./NCICNavBar/NCICNav";
import VINSection from "./NCICTabSection/VINSection";
import NameSection from "./NCICTabSection/NameSection";
import { compareStrings, isEmptyCheck } from "../../CADUtils/functions/common";
import { getShowingWithFixedTime, tableCustomStyles } from "../../Components/Common/Utility";
import useObjState from "../../CADHook/useObjState";
import './index.css';
import ResponseSection from "./ResponseSection";
import Tooltip from "../Common/Tooltip";
import WantedSection from "./NCICTabSection/WantedSection";
import DriverLicenseSection from "./NCICTabSection/DriverLicenseSection";
import WantedCheckSection from "./NCICTabSection/WantedCheckSection";
import StolenVehicleSection from "./NCICTabSection/StolenVehicleSection";
import NcicServices from "../../CADServices/APIs/ncic";
import { useSelector } from "react-redux";
import { fetchPostData, ScreenPermision } from "../../Components/hooks/Api";
import { Comman_changeArrayFormat, Comman_changeArrayFormat3 } from "../../Components/Common/ChangeArrayFormat";
import { useQuery } from "react-query";

const NCICModal = (props) => {
    const { openNCICModal, setOpenNCICModal, isNameCallTaker, setIsNameCallTaker, nameData = {}, vehicleIncidentData = {} } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [viewMode, setViewMode] = useState('mix');
    const [searchListData, setSearchListData] = useState([]);
    const [tabState, setTabState] = useState('vin-container');
    const [viewSummary, setViewSummary] = useState(true);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ncicResponseData, setNcicResponseData] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [clickedRow, setClickedRow] = useState(null);
    const [isDisableSendButton, setIsDisableSendButton] = useState(false);
    const [responseSectionData, setResponseSectionData] = useState(null);

    useEffect(() => {
        if (isNameCallTaker) {
            setTabState('driver-license');
        }
    }, [isNameCallTaker]);

    const [
        nameSectionState,
        setNameSectionState,
        handleNameSectionState,
        clearNameSectionState,
    ] = useObjState({
        id: "",
        isByRQ_RNQ_QM: "QM",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        sex: "",
        race: "",
        dob: ""
    });

    const [
        vehicleSectionState,
        setVehicleSectionState,
        handleVehicleSectionState,
        clearVehicleSectionState,
    ] = useObjState({
        id: "",
        isByRQ_RNQ_QM: "RQ",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        dob: "",
        plateNo: "",
        platExpires: "",
        playType: "",
        VIN: "",
        make: "",
        manuYear: "",
        plateState: "",
        createdDateTime: "",
    });

    const [
        wantedCheckSectionState,
        setWantedCheckSectionState,
        handleWantedCheckSectionState,
        clearWantedCheckSectionState,
    ] = useObjState({
        id: "",
        isByRSDW_RSDWW: "RQ",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        dob: "",
        plateNo: "",
        platExpires: "",
        playType: "",
        VIN: "",
        make: "",
        manuYear: "",
        plateState: "",
        createdDateTime: "",
    });

    const [
        driverLicenseSectionState,
        setDriverLicenseSectionState,
        handleDriverLicenseSectionState,
        clearDriverLicenseSectionState,
    ] = useObjState({
        id: "",
        isByRQ_RNQ_QM: "DQ",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        sex: "",
        rac: "",
        dob: "",
        st: "",
        oln: "",
        createdDateTime: "",
    });

    const [
        wantedSectionState,
        setWantedSectionState,
        handleWantedSectionState,
        clearWantedSectionState,
    ] = useObjState({
        id: "",
        isByRQ_RNQ_QM: "QM",
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        sex: "",
        race: "",
        dob: ""
    });

    const [
        errorWantedSectionState,
        ,
        handleErrorWantedSectionState,
        clearErrorWantedSectionState,
    ] = useObjState({
        lastName: false,
        firstName: false,
        middleName: false,
        sex: false,
        race: false,
        DOB: false,
    });

    const [
        errorNameSectionState,
        setErrorNameSectionState,
        handleErrorNameSectionState,
        clearErrorNameSectionState,
    ] = useObjState({
        lastName: false,
        firstName: false,
        sex: false,
        race: false,
        dob: false,
    });

    const [
        errorDriverLicenseSectionState,
        setErrorDriverLicenseSectionState,
        handleErrorDriverLicenseSectionState,
        clearErrorDriverLicenseSectionState,
    ] = useObjState({
        lastName: false,
        firstName: false,
        sex: false,
        suffix: false,
        race: false,
        st: false,
        oln: false,
        dob: false,
    });

    const [
        errorStolenVehicleSectionState,
        setErrorStolenVehicleSectionState,
        handleErrorStolenVehicleSectionState,
        clearErrorStolenVehicleSectionState,
    ] = useObjState({
        licenseState: false,
        vehicleMake: false,
        licensePlate: false,
    });

    const [
        errorVehicleSectionState,
        setErrorVehicleSectionState,
        handleErrorVehicleSectionState,
        clearErrorVehicleSectionState,
    ] = useObjState({
        plateState: false,
        playType: false,
        plateNo: false,
        platExpires: false,
        VIN: false,
        lastName: false,
        firstName: false,
        suffix: false,
        dob: false,
    });

    const [
        plateTypeIdDrp,
        setPlateTypeIdDrp,
    ] = useState([]);

    const [
        makeIdDrp,
        setMakeIdDrp,
    ] = useState([]);

    const [
        stolenVehicleSectionState,
        setStolenVehicleSectionState,
        handleStolenVehicleSectionState,
        clearStolenVehicleSectionState,
    ] = useObjState({
        id: "",
        isByRQ_RNQ_QM: "QV",
        ncicNumber: "",
        licensePlate: "",
        licenseState: "",
        vin: "",
        vehicleMake: "",
        createdDateTime: "",
    });

    const [effectiveNcicScreenPermission, setEffectiveNcicScreenPermission] = useState(null);

    const getNCICResponseKey = `/NCICDetails/GetNCICResponse`;
    const { data: getNCICResponseData, isSuccess: isFetchNCICResponse, refetch, isError: isNoData } = useQuery(
        [getNCICResponseKey, {
            userPID: parseInt(localStoreData?.NCICLoginId),
        },],
        NcicServices.getNCICResponse,
        {
            refetchOnWindowFocus: false,
            enabled: !!parseInt(localStoreData?.NCICLoginId) && openNCICModal
        }
    );

    useEffect(() => {
        if (getNCICResponseData && isFetchNCICResponse) {
            setNcicResponseData(JSON.parse(getNCICResponseData.data.data).Table);
        }
    }, [getNCICResponseData, isFetchNCICResponse]);

    const sexIdDrp = [
        {
            value: 1,
            label: "Female",
            code: "F"
        },
        {
            value: 2,
            label: "Male",
            code: "M"
        },
        {
            value: 3,
            label: "Unknown",
            code: "U"
        }
    ]

    useEffect(() => {
        if (!!nameData?.LastName) {
            setDriverLicenseSectionState({
                lastName: nameData?.LastName,
                firstName: nameData?.FirstName,
                middleName: nameData?.MiddleName,
                suffix: suffixIdDrp?.find(item => item?.value === nameData?.SuffixID)?.label,
                sex: sexIdDrp?.find(item => item?.value === nameData?.SexID)?.code,
                race: raceIdDrp?.find(item => item?.value === nameData?.RaceID)?.label,
                st: stateList?.find(item => item?.value === nameData?.DLStateID)?.label,
                dob: nameData?.DateOfBirth ? new Date(nameData?.DateOfBirth) : "",
            });
            setVehicleSectionState({
                lastName: nameData?.LastName,
                firstName: nameData?.FirstName,
                middleName: nameData?.MiddleName,
                suffix: suffixIdDrp?.find(item => item?.value === nameData?.SuffixID)?.label,
                dob: nameData?.DateOfBirth ? new Date(nameData?.DateOfBirth) : "",
            });
            setNameSectionState({
                lastName: nameData?.LastName,
                firstName: nameData?.FirstName,
                middleName: nameData?.MiddleName,
                suffix: suffixIdDrp?.find(item => item?.value === nameData?.SuffixID)?.label,
                sex: sexIdDrp?.find(item => item?.value === nameData?.SexID)?.code,
                race: raceIdDrp?.find(item => item?.value === nameData?.RaceID)?.label,
                age: nameData?.Age,
                ethnicity: nameData?.Ethnicity,
                eyes: nameData?.Eyes,
                hair: nameData?.Hair,
                height: nameData?.HeightFrom,
                height2: nameData?.HeightTo,
                weight: nameData?.WeightFrom,
                weight2: nameData?.WeightTo,
                st: stateList?.find(item => item?.value === nameData?.DLStateID)?.label,
                dob: nameData?.DateOfBirth ? new Date(nameData?.DateOfBirth) : "",
            })
            setWantedSectionState({
                DOB: nameData?.DateOfBirth ? new Date(nameData?.DateOfBirth) : "",
                lastName: nameData?.LastName,
                firstName: nameData?.FirstName,
                middleName: nameData?.MiddleName,
                suffix: suffixIdDrp?.find(item => item?.value === nameData?.SuffixID)?.label,
                sex: sexIdDrp?.find(item => item?.value === nameData?.SexID)?.code,
                race: raceIdDrp?.find(item => item?.value === nameData?.RaceID)?.label,
                age: nameData?.Age,
                ethnicity: nameData?.Ethnicity,
                eyes: nameData?.Eyes,
                hair: nameData?.Hair,
                height: nameData?.HeightFrom,
                height2: nameData?.HeightTo,
                weight: nameData?.WeightFrom,
                weight2: nameData?.WeightTo,
                createdDateTime: nameData?.CreatedDateTime,
                SMT: nameData?.SMT,
                MiscellaneousIDNumber: "",
                FBINumber: "",
                SSN: "",
            })
            setWantedCheckSectionState({
                lastName: nameData?.LastName,
                firstName: nameData?.FirstName,
                middleName: nameData?.MiddleName,
                suffix: suffixIdDrp?.find(item => item?.value === nameData?.SuffixID)?.label,
                dob: nameData?.DateOfBirth ? new Date(nameData?.DateOfBirth) : "",
                plateNo: "",
                platExpires: "",
                playType: "",
                VIN: "",
                make: "",
                manuYear: "",
                plateState: "",
                createdDateTime: "",
                sex: sexIdDrp?.find(item => item?.value === nameData?.SexID)?.code,
                race: raceIdDrp?.find(item => item?.value === nameData?.RaceID)?.label,
                age: nameData?.Age,
            })
        }
    }, [nameData, setDriverLicenseSectionState, raceIdDrp, suffixIdDrp, stateList]);


    useEffect(() => {
        if (!!vehicleIncidentData?.VehicleNo) {
            setVehicleSectionState({
                id: "",
                isByRQ_RNQ_QM: "RQ",
                lastName: "",
                firstName: "",
                middleName: "",
                suffix: "",
                dob: "",
                plateNo: vehicleIncidentData?.VehicleNo,
                platExpires: vehicleIncidentData?.PlateExpireDtTm ? new Date(vehicleIncidentData?.PlateExpireDtTm) : "",
                playType: plateTypeIdDrp?.find(item => item?.value === vehicleIncidentData?.PlateTypeID)?.shortCode,
                VIN: vehicleIncidentData?.VIN,
                make: vehicleIncidentData?.MakeID,
                manuYear: vehicleIncidentData?.ManufactureYear,
                plateState: stateList?.find(item => item?.value === vehicleIncidentData?.PlateID)?.label,
                createdDateTime: vehicleIncidentData?.ReportedDtTm ? new Date(vehicleIncidentData?.ReportedDtTm) : "",
            });
            setStolenVehicleSectionState({
                id: "",
                isByRQ_RNQ_QM: "QV",
                ncicNumber: "",
                licensePlate: "",
                licenseState: "",
                vin: "",
                vehicleMake: vehicleIncidentData?.MakeID,
                createdDateTime: vehicleIncidentData?.ReportedDtTm ? new Date(vehicleIncidentData?.ReportedDtTm) : "",
            });
        }
    }, [vehicleIncidentData, makeIdDrp, plateTypeIdDrp, stateList])

    const onCloseNCICModal = () => {
        setOpenNCICModal(false);
        setViewMode('mix');
        setTabState('vin-container'); // Reset to default tab
        setViewSummary(false);
        clearDriverLicenseSectionState();
        clearWantedSectionState();
        clearNameSectionState();
        clearVehicleSectionState();
        clearStolenVehicleSectionState();
        clearErrorWantedSectionState();
        clearErrorVehicleSectionState();
        clearErrorNameSectionState();
        clearErrorDriverLicenseSectionState();
        clearErrorStolenVehicleSectionState();
        setIsNameCallTaker(false);
        setSummaryData(null);
        setNcicResponseData([]);
        handleClearSearch();
        setViewSummary(false);
    };

    // Logic to set view based on button clicks
    const handleMixClick = () => {
        setResponseSectionData(null);
        setViewMode('mix');
    };
    const handleResponseClick = () => {
        setViewMode('response');
    };

    const handleRequestClick = () => {
        setResponseSectionData(null);
        setViewMode('request');
    };

    const handleClearSearch = () => {
        clearVehicleSectionState();
        clearNameSectionState();
        clearErrorVehicleSectionState();
        clearErrorNameSectionState();
        clearErrorWantedSectionState();
        clearErrorDriverLicenseSectionState();
        clearErrorStolenVehicleSectionState();
        clearStolenVehicleSectionState();
        clearWantedCheckSectionState();
        clearDriverLicenseSectionState();
        clearWantedSectionState();
        setResponseSectionData(null);
    };
    function handelChangeTab(tab) {
        clearNameSectionState();
        clearVehicleSectionState();
        clearWantedCheckSectionState();
        clearDriverLicenseSectionState();
        clearWantedSectionState();
        clearErrorWantedSectionState();
        clearErrorVehicleSectionState();
        clearErrorNameSectionState();
        clearErrorDriverLicenseSectionState();
        clearErrorStolenVehicleSectionState();
        clearStolenVehicleSectionState();
        setTabState(tab);
    }

    useEffect(() => {
        const data = localStorage.getItem('NCICSearchList');
        if (data) {
            setSearchListData(JSON.parse(data));
        }
    }, [tabState]);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            getNcicScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);
    const getNcicScreenPermission = (aId, pinID) => {
        try {
            ScreenPermision("CN101", aId, pinID).then(res => {
                if (res) {
                    setEffectiveNcicScreenPermission(res);
                }
                else {
                    setEffectiveNcicScreenPermission(null);
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setEffectiveNcicScreenPermission(null);
        }
    }


    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));
                setStateList(Comman_changeArrayFormat(data[0]?.State, "StateID", "State"));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
            } else {
                setSuffixIdDrp([]);
                setStateList([]);
                setRaceIdDrp([]);
            }
        })
    };

    const get_PlateType_Drp = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('PropertyVehiclePlateType/GetDataDropDown_PropertyVehiclePlateType', val).then((data) => {
            if (data) {
                setPlateTypeIdDrp(Comman_changeArrayFormat3(data, 'PlateTypeID', 'Description', 'shortCode', 'PlateTypeCode'));
            } else {
                setPlateTypeIdDrp([]);
            }
        })
    }

    const get_MakeId_Drp = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
            if (data) {
                setMakeIdDrp(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
            } else {
                setMakeIdDrp([]);
            }
        })
    }


    useEffect(() => {
        if (loginAgencyID) {
            get_Name_Drp_Data(loginAgencyID)
            get_PlateType_Drp(loginAgencyID)
            get_MakeId_Drp(loginAgencyID)
        }

    }, [loginAgencyID])

    const validateFormVehicleSectionState = () => {
        let isError = false;

        if (vehicleSectionState?.isByRQ_RNQ_QM === 'RQ') {
            const requiredFields = ['plateState', 'plateNo', 'platExpires'];

            requiredFields.forEach((field) => {
                const value = vehicleSectionState[field];

                if (field === 'platExpires') {
                    // Special handling for platExpires field (can be Date object or string)
                    if (!value || value === '' || value === null || value === undefined ||
                        (value instanceof Date && isNaN(value.getTime()))) {
                        handleErrorVehicleSectionState(field, true);
                        isError = true;
                    } else {
                        handleErrorVehicleSectionState(field, false);
                    }
                } else {
                    // Regular validation for other fields
                    if (isEmptyCheck(value)) {
                        handleErrorVehicleSectionState(field, true);
                        isError = true;
                    } else {
                        handleErrorVehicleSectionState(field, false);
                    }
                }
            });
        } else if (vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ') {
            const requiredFields = ['lastName', 'firstName', 'dob'];

            requiredFields.forEach((field) => {
                const value = vehicleSectionState[field];

                if (field === 'dob') {
                    // Special handling for dob field
                    if (!value || value === '' || value === null || value === undefined) {
                        handleErrorVehicleSectionState(field, true);
                        isError = true;
                    } else {
                        handleErrorVehicleSectionState(field, false);
                    }
                } else {
                    // Regular validation for other fields
                    if (isEmptyCheck(value)) {
                        handleErrorVehicleSectionState(field, true);
                        isError = true;
                    } else {
                        handleErrorVehicleSectionState(field, false);
                    }
                }
            });
        }

        return !isError;
    };

    const validateFormWantedSectionState = () => {
        let isError = false;

        const requiredFields = ['lastName', 'firstName', 'race', 'dob', 'sex'];

        requiredFields.forEach((field) => {
            const value = wantedSectionState[field];

            if (field === 'dob') {
                // Special handling for dob field
                if (!value || value === '' || value === null || value === undefined) {
                    handleErrorWantedSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorWantedSectionState(field, false);
                }
            } else {
                // Regular validation for other fields
                if (isEmptyCheck(value)) {
                    handleErrorWantedSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorWantedSectionState(field, false);
                }
            }
        });

        return !isError;
    };
    const validateFormNameSectionState = () => {
        let isError = false;

        const requiredFields = ['lastName', 'firstName', 'sex', 'race', 'dob'];

        requiredFields.forEach((field) => {
            const value = nameSectionState[field];

            if (field === 'dob') {
                // Special handling for dob field
                if (!value || value === '' || value === null || value === undefined) {
                    handleErrorNameSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorNameSectionState(field, false);
                }
            } else {
                // Regular validation for other fields
                if (isEmptyCheck(value)) {
                    handleErrorNameSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorNameSectionState(field, false);
                }
            }
        });

        return !isError;
    };

    const validateFormDriverLicenseSectionState = () => {
        let isError = false;
        const alwaysRequiredFields = ['st', 'oln'];

        const hasLicenseSearch = !isEmptyCheck(driverLicenseSectionState.oln);

        // Validate always required fields
        alwaysRequiredFields.forEach((field) => {
            const value = driverLicenseSectionState[field];

            if (field === 'dob') {
                // Special handling for dob field
                if (!value || value === '' || value === null || value === undefined) {
                    handleErrorDriverLicenseSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorDriverLicenseSectionState(field, false);
                }
            } else {
                // Regular validation for other fields
                if (isEmptyCheck(value)) {
                    handleErrorDriverLicenseSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorDriverLicenseSectionState(field, false);
                }
            }
        });
        return !isError;
    };

    const validateFormStolenVehicleSectionState = () => {
        let isError = false;
        const hasVin = !isEmptyCheck(stolenVehicleSectionState?.vin);
        if (hasVin) {
            const value = stolenVehicleSectionState.vin;
            if (isEmptyCheck(value)) {
                handleErrorStolenVehicleSectionState('vin', true);
                isError = true;
            } else {
                handleErrorStolenVehicleSectionState('vin', false);
            }
            handleErrorStolenVehicleSectionState('licenseState', false);
            handleErrorStolenVehicleSectionState('licensePlate', false);
        } else {
            const requiredFields = ['licenseState', 'licensePlate'];
            requiredFields.forEach((field) => {
                const value = stolenVehicleSectionState[field];
                if (isEmptyCheck(value)) {
                    handleErrorStolenVehicleSectionState(field, true);
                    isError = true;
                } else {
                    handleErrorStolenVehicleSectionState(field, false);
                }
            });
            handleErrorStolenVehicleSectionState('vin', false);
        }
        return !isError;
    };

    // Helper function to create base payload structure
    const createBasePayload = (messageKey, requestType, queryType) => ({
        MessageKey: messageKey,
        RequestType: requestType,
        QueryType: queryType,
        PIN: localStoreData?.PIN,
        AgencyID: localStoreData?.AgencyID,
        TerminalId: localStoreData?.NCICLoginTerminalID,
        PINID: parseInt(localStoreData?.PINID),
        UserId: localStoreData?.NCICLoginId,
        ORI: localStoreData?.NCICORI,
        NCICUserId: localStoreData?.NCICLoginId,
        PASSWORD: localStoreData?.NCICLoginPassword,
        ResourceNumber: ""
    });

    const formatDateForAPI = (date) => {
        return date ? new Date(date).toLocaleDateString("en-US") : "";
    };

    const sendRequestAndRefetch = async (payload) => {
        try {
            setIsDisableSendButton(true);
            const res = await NcicServices.sendNcicRequest(payload);
            if (res) {
                setTimeout(() => {
                    refetch();
                }, 2000);
            }
        } catch (error) {
            console.error("NCIC request failed:", error);
        } finally {
            setIsDisableSendButton(false);
        }
    };

    // Payload builders for different request types
    const buildDriverLicensePayload = () => {
        const basePayload = createBasePayload("TXPR004", "PERSON", "DQ");
        return {
            ...basePayload,
            Person: {
                CDL: "",
                IMQ: "",
                SEX: driverLicenseSectionState?.sex,
                RSN: "",
                LNAME: driverLicenseSectionState?.lastName,
                FNAME: driverLicenseSectionState?.firstName,
                MNAME: driverLicenseSectionState?.middleName,
                SUFFIX: driverLicenseSectionState?.suffix,
                DOB: formatDateForAPI(driverLicenseSectionState?.dob),
                OLN: driverLicenseSectionState?.oln,
                CTL: "",
                DESTSTATE1: driverLicenseSectionState?.st,
                EML: ""
            }
        };
    };

    const buildWantedPayload = () => {
        const basePayload = createBasePayload("TXPR002", "PERSON", "QW");
        return {
            ...basePayload,
            Person: {
                LNAME: nameSectionState?.lastName,
                FNAME: nameSectionState?.firstName,
                MNAME: nameSectionState?.middleName,
                SUFFIX: nameSectionState?.suffix,
                SEX: nameSectionState?.sex,
                RACE: nameSectionState?.race,
                DOB: formatDateForAPI(nameSectionState?.dob),
            }
        };
    };

    const buildVehiclePayload = () => {
        if (vehicleSectionState?.isByRQ_RNQ_QM === "RQ") {
            const basePayload = createBasePayload("TXVH003", "VEHICLE", vehicleSectionState?.isByRQ_RNQ_QM);
            return {
                ...basePayload,
                Vehicle: {
                    VMA: "",
                    LIT: vehicleSectionState?.playType,
                    LIC: vehicleSectionState?.plateNo,
                    LIY: vehicleSectionState.platExpires ? new Date(vehicleSectionState.platExpires).getFullYear().toString() : "",
                    DESTSTATE1: vehicleSectionState?.plateState,
                    VIN: vehicleSectionState?.VIN,
                }
            };
        } else if (vehicleSectionState?.isByRQ_RNQ_QM === "RNQ") {
            const basePayload = createBasePayload("TXVH004", "VEHICLE", vehicleSectionState?.isByRQ_RNQ_QM);
            return {
                ...basePayload,
                Person: {
                    LNAME: vehicleSectionState?.lastName,
                    FNAME: vehicleSectionState?.firstName,
                    MNAME: vehicleSectionState?.middleName,
                    SUFFIX: vehicleSectionState.suffix,
                    DOB: formatDateForAPI(vehicleSectionState?.dob),
                }
            };
        }
        return null;
    };

    const buildStolenVehiclePayload = () => {
        const basePayload = createBasePayload("TXVH001", "VEHICLE", "QV");
        return {
            ...basePayload,
            Vehicle: {
                LIS: stolenVehicleSectionState?.licenseState,
                VMA: stolenVehicleSectionState?.vehicleMake,
                LIC: stolenVehicleSectionState?.licensePlate,
                NIC: stolenVehicleSectionState?.ncicNumber,
                VIN: stolenVehicleSectionState?.vin
            }
        };
    };

    // Validation and payload mapping
    const tabConfigurations = {
        "driver-license": {
            validator: validateFormDriverLicenseSectionState,
            payloadBuilder: buildDriverLicensePayload
        },
        "wanted-container": {
            validator: validateFormWantedSectionState,
            payloadBuilder: buildWantedPayload
        },
        "vin-container": {
            validator: validateFormVehicleSectionState,
            payloadBuilder: buildVehiclePayload
        },
        "stolen-vehicle": {
            validator: validateFormStolenVehicleSectionState,
            payloadBuilder: buildStolenVehiclePayload
        }
    };

    async function handleSendClick() {
        const config = tabConfigurations[tabState];
        if (!config) {
            console.warn(`No configuration found for tab state: ${tabState}`);
            return;
        }
        if (!config.validator()) {
            return;
        }
        const payload = config.payloadBuilder();
        if (!payload) {
            console.error(`Failed to build payload for tab state: ${tabState}`);
            return;
        }
        await sendRequestAndRefetch(payload);
    }

    const handleSummary = async (row) => {
        setClickedRow(row);
        const ncicState = row?.DisplayString ? row.DisplayString.slice(-2) : '';
        const payload = {
            "ResponseType": row?.ResponseType,
            "Hit": row?.hit,
            "RequestDateTime": row?.RequestDateTime,
            "QueryType": row?.QueryType,
            "DisplayString": row?.DisplayString,
            "RequestId": row?.requestid,
            "ResponseId": row?.ResponseId,
            "AgencyId": loginAgencyID,
            "NcicState": "TX"
        }
        const res = await NcicServices.getNCICParsedResponse(payload);
        if (res) {
            setSummaryData(res?.data);
            setViewSummary(true);
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row?.hit === true,
            style: {
                color: 'red',
                backgroundColor: 'darkorange',
                cursor: 'pointer',
            },
        }
    ];

    const column = [
        {
            name: "",
            cell: (row) => (
                <button
                    type="button"
                    data-toggle="modal"
                    data-target="#WhiteboardSearchModal"
                    className="btn btn-sm bg-green text-white m-1"
                    onClick={() => { handleSummary(row); setClickedRow(row); }}
                >
                    Summary
                </button>
            ),
            sortable: true,
            width: '120px',
            center: true,
        },
        {
            name: 'Request Criteria',
            selector: row => row?.DisplayString,
            sortable: true,
            style: {
                position: "static",
            },
            cell: (row) => (
                <Tooltip text={row?.DisplayString || ''} isRight maxLength={23} />
            ),
            width: "230px",
        },
        {
            name: "Query Type",
            selector: (row) => (row.QueryType ? row.QueryType : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.QueryType, rowB.QueryType),
            width: "120px",
        },
        {
            name: "Hit",
            selector: (row) => row.hit ? "True" : "False",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.hit, rowB.hit),
            width: "100px",
        },
        {
            name: "Request Date Time",
            selector: (row) => (row.RequestDateTime ? getShowingWithFixedTime(row.RequestDateTime) : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.RequestDateTime, rowB.RequestDateTime),
            width: "150px",
        },
        {
            name: "Response Type",
            selector: (row) => row.ResponseType ? row.ResponseType : "",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ResponseType, rowB.ResponseType),
            width: "130px",
        },
    ];

    // useEffect(() => {
    //     const fetchSummaryData = async () => {
    //         setClickedRow(ncicResponseData?.[0]);
    //         const payload = {
    //             "ResponseType": ncicResponseData?.[0]?.ResponseType,
    //             "Hit": ncicResponseData?.[0]?.hit,
    //             "RequestDateTime": ncicResponseData?.[0]?.RequestDateTime,
    //             "QueryType": ncicResponseData?.[0]?.QueryType,
    //             "DisplayString": ncicResponseData?.[0]?.DisplayString,
    //             "RequestId": ncicResponseData?.[0]?.requestid,
    //             "ResponseId": ncicResponseData?.[0]?.ResponseId,
    //             "AgencyId": loginAgencyID,
    //             "NcicState": "TX"
    //         }
    //         const res = await NcicServices.getNCICParsedResponse(payload);
    //         if (res) {
    //             setSummaryData(res?.data);
    //             setViewSummary(true);
    //         }
    //     }
    //     if (ncicResponseData?.length > 0) {
    //         fetchSummaryData();
    //     };
    // }, [ncicResponseData])

    return (
        <>
            <div className="cad-css">
                {openNCICModal ? (
                    <>
                        <dialog
                            className="modal fade"
                            style={{
                                background: "rgba(0,0,0, 0.5)",
                                zIndex: "200",
                                overflowY: "hidden"
                            }}
                            id="NCICModal"
                            tabIndex="-1"
                            aria-hidden="true"
                            data-backdrop="false"
                        >
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content modal-content-ncic"
                                    style={{
                                        maxHeight: "calc(100vh - 50px)",
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                    }}
                                >
                                    <div className="modal-body modal-body-ncic" style={{ padding: "15px", display: "flex", flexDirection: "column" }}>
                                        <div className="modal-main-ncic" style={{ flex: "1", overflow: "hidden" }}>
                                            <div className="row">
                                                <div className="col-12 p-0 pb-2">
                                                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                                        <p
                                                            className="p-0 m-0 font-weight-medium"
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: 500,
                                                                letterSpacing: 0.5,
                                                            }}
                                                        >
                                                            NCIC
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Tab.Container activeKey={tabState}>
                                                {viewMode !== 'response' && <NCICNav tabState={tabState} setTabState={handelChangeTab} isNameCallTaker={isNameCallTaker} />}
                                                {viewMode === 'response' ? <ResponseSection ncicResponseData={ncicResponseData} loginAgencyID={loginAgencyID} tabState={tabState} setResponseSectionData={setResponseSectionData} /> :
                                                    <fieldset className="ncic-main-container">
                                                        <div className="d-flex">
                                                            <div className={`${viewMode === 'mix' ? 'col-6' : 'col-12'
                                                                }`}>
                                                                {/* Left side: Tab Content */}
                                                                <Tab.Content>
                                                                    {/* VIN Section */}
                                                                    <Tab.Pane eventKey="vin-container" unmountOnExit={false}>
                                                                        <VINSection
                                                                            vehicleSectionState={vehicleSectionState}
                                                                            setVehicleSectionState={setVehicleSectionState}
                                                                            handleVehicleSectionState={handleVehicleSectionState}
                                                                            clearVehicleSectionState={clearVehicleSectionState}
                                                                            suffixIdDrp={suffixIdDrp}
                                                                            stateList={stateList}
                                                                            errorVehicleSectionState={errorVehicleSectionState}
                                                                            handleErrorVehicleSectionState={handleErrorVehicleSectionState}
                                                                            clearErrorVehicleSectionState={clearErrorVehicleSectionState}
                                                                            plateTypeIdDrp={plateTypeIdDrp}
                                                                            makeIdDrp={makeIdDrp}
                                                                        />
                                                                    </Tab.Pane>

                                                                    {/* By Wanted */}
                                                                    <Tab.Pane eventKey="wantedCheck-container" unmountOnExit={false}>
                                                                        <WantedCheckSection wantedCheckSectionState={wantedCheckSectionState} setWantedCheckSectionState={setWantedCheckSectionState} handleWantedCheckSectionState={handleWantedCheckSectionState} clearWantedCheckSectionState={clearWantedCheckSectionState} />
                                                                    </Tab.Pane>

                                                                    {/* By Name */}
                                                                    <Tab.Pane eventKey="name-container" unmountOnExit={false}>
                                                                        <NameSection
                                                                            nameSectionState={nameSectionState}
                                                                            setNameSectionState={setNameSectionState}
                                                                            handleNameSectionState={handleNameSectionState}
                                                                            clearNameSectionState={clearNameSectionState}
                                                                            suffixIdDrp={suffixIdDrp}
                                                                            raceIdDrp={raceIdDrp}
                                                                            errorNameSectionState={errorNameSectionState}
                                                                            handleErrorNameSectionState={handleErrorNameSectionState}
                                                                        />
                                                                    </Tab.Pane>

                                                                    {/* By Wanted */}
                                                                    <Tab.Pane eventKey="wanted-container" unmountOnExit={false}>
                                                                        <WantedSection wantedSectionState={wantedSectionState} setWantedSectionState={setWantedSectionState} handleWantedSectionState={handleWantedSectionState} handleErrorWantedSectionState={handleErrorWantedSectionState} errorWantedSectionState={errorWantedSectionState} raceIdDrp={raceIdDrp} suffixIdDrp={suffixIdDrp}
                                                                        />
                                                                    </Tab.Pane>

                                                                    <Tab.Pane eventKey="driver-license" unmountOnExit={false}>
                                                                        <DriverLicenseSection
                                                                            driverLicenseSectionState={driverLicenseSectionState}
                                                                            setDriverLicenseSectionState={setDriverLicenseSectionState}
                                                                            handleDriverLicenseSectionState={handleDriverLicenseSectionState}
                                                                            suffixIdDrp={suffixIdDrp}
                                                                            raceIdDrp={raceIdDrp}
                                                                            stateList={stateList}
                                                                            errorDriverLicenseSectionState={errorDriverLicenseSectionState}
                                                                            handleErrorDriverLicenseSectionState={handleErrorDriverLicenseSectionState}
                                                                        />
                                                                    </Tab.Pane>
                                                                    <Tab.Pane eventKey="stolen-vehicle" unmountOnExit={false}>
                                                                        <StolenVehicleSection
                                                                            stolenVehicleSectionState={stolenVehicleSectionState}
                                                                            setStolenVehicleSectionState={setStolenVehicleSectionState}
                                                                            handleStolenVehicleSectionState={handleStolenVehicleSectionState}
                                                                            errorStolenVehicleSectionState={errorStolenVehicleSectionState}
                                                                            handleErrorStolenVehicleSectionState={handleErrorStolenVehicleSectionState}
                                                                            stateList={stateList}
                                                                        />
                                                                    </Tab.Pane>
                                                                </Tab.Content>
                                                            </div>
                                                            {/* Right side: Test Divs */}
                                                            {
                                                                viewMode === 'mix' && (
                                                                    <div className="col-6 d-flex flex-column" style={{ height: "calc(100vh - 300px)", maxHeight: "calc(100vh - 300px)" }}>
                                                                        {/* View Section */}
                                                                        {viewSummary && <div className="mb-2" style={{ maxHeight: "60%", minHeight: "200px" }}>
                                                                            <fieldset className="ncic-main-container" style={{
                                                                                overflowY: "auto",
                                                                                overflowX: "hidden",
                                                                                height: "100%",
                                                                                maxHeight: "100%"
                                                                            }}>
                                                                                <div style={{ fontSize: "13px" }}>
                                                                                    {summaryData && (
                                                                                        <div>
                                                                                            {/* Display FormattedResponse if available */}
                                                                                            {summaryData?.FormattedResponse && (
                                                                                                <div dangerouslySetInnerHTML={{ __html: summaryData?.FormattedResponse }} />
                                                                                            )}

                                                                                            {/* Display VehicleResponse details if available */}
                                                                                            {summaryData.NcicParseResponse?.VehicleResponse && (
                                                                                                <div>
                                                                                                    <h6>Vehicle Details:</h6>
                                                                                                    <p><strong>License Plate:</strong> {summaryData?.VehicleResponse?.LicensePlateNumber}</p>
                                                                                                    <p><strong>State:</strong> {summaryData?.VehicleResponse?.LicensePlateState}</p>
                                                                                                    <p><strong>Make:</strong> {summaryData.NcicParseResponse.VehicleResponse.VehicleMake}</p>
                                                                                                    <p><strong>Model:</strong> {summaryData?.VehicleResponse?.VehModel}</p>
                                                                                                    <p><strong>Year:</strong> {summaryData?.VehicleResponse?.VehYear}</p>
                                                                                                    <p><strong>VIN:</strong> {summaryData.NcicParseResponse.VehicleResponse.VehicleIdNumber}</p>
                                                                                                    <p><strong>Owner:</strong> {summaryData?.VehicleResponse?.Name}</p>
                                                                                                    <p><strong>Address:</strong> {summaryData?.VehicleResponse?.Address}</p>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </fieldset>
                                                                        </div>}

                                                                        {/* Table Section */}
                                                                        <div className="flex-grow-1" style={{ minHeight: "300px" }}>
                                                                            <Tab.Content
                                                                                className={`${viewMode === 'mix' ? 'w-100' : 'w-100'
                                                                                    } overflow-y-auto overflow-x-hidden h-100`}
                                                                                style={{ height: "100%" }}
                                                                            >
                                                                                {/* VIN Section */}
                                                                                {/* <Tab.Pane eventKey="vin-container"> */}
                                                                                <div className="table-responsive h-100 mt-2" style={{ height: "100%" }}>
                                                                                    <DataTable
                                                                                        dense
                                                                                        columns={column}
                                                                                        data={ncicResponseData}
                                                                                        customStyles={tableCustomStyles}
                                                                                        pagination
                                                                                        responsive
                                                                                        striped
                                                                                        highlightOnHover
                                                                                        fixedHeader
                                                                                        selectableRowsHighlight
                                                                                        noDataComponent={isNoData ? "There are no data to display" : 'There are no data to display'}
                                                                                        fixedHeaderScrollHeight="190px"
                                                                                        persistTableHead={true}
                                                                                    // onRowClicked={(row) => {
                                                                                    //     handelSetEditData(row); setClickedRow(row);
                                                                                    // }}
                                                                                    // conditionalRowStyles={conditionalRowStyles}

                                                                                    />
                                                                                </div>
                                                                                {/* </Tab.Pane> */}

                                                                            </Tab.Content>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>

                                                    </fieldset>
                                                }
                                            </Tab.Container>
                                        </div>

                                        {/* Buttons */}
                                        <div className="row" style={{ margin: "0", padding: "0", flexShrink: "0" }}>
                                            <div className="col-12 p-0">
                                                <div className="d-flex justify-content-between tab-form-row-gap">
                                                    <div className="d-flex tab-form-row-gap">
                                                        {effectiveNcicScreenPermission?.[0]?.AddOK ? <button
                                                            type="button"
                                                            className="save-button"
                                                            onClick={handleSendClick}
                                                            disabled={isDisableSendButton}
                                                        >
                                                            {isDisableSendButton ? "Sending..." : "Send"}
                                                        </button> : <></>}
                                                        <button
                                                            type="button"
                                                            className="cancel-button"
                                                            onClick={handleClearSearch}

                                                        >
                                                            {"Clear"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="save-button"
                                                        >
                                                            {"Name Export"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="save-button"
                                                        >
                                                            {"Vehicle Export"}
                                                        </button>
                                                    </div>
                                                    <div className="d-flex tab-form-row-gap justify-content-center">
                                                        <button
                                                            type="button"
                                                            className={viewMode === 'response' ? responseSectionData?.FormattedResponse?.search("<span style='color: red;") > 0 ? "error-button" : responseSectionData?.FormattedResponse?.search("<span style='color: blue;") > 0 ? "hitOrange-button" : "save-button"
                                                                : summaryData?.FormattedResponse?.search("<span style='color: red;") > 0 ? "error-button" : summaryData?.FormattedResponse?.search("<span style='color: blue;") > 0 ? "hitOrange-button" : "save-button"}
                                                        // className={clickedRow?.hit ? "error-button" : !clickedRow?.hit ? "hitGreen-button" : "save-button"}
                                                        >
                                                            {"HIT YQ/YR"}
                                                        </button>
                                                    </div>
                                                    <div className="d-flex tab-form-row-gap justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="save-button"
                                                            onClick={handleRequestClick} // Show only left section
                                                        >
                                                            {"Request"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="save-button"
                                                            onClick={handleMixClick} // Show both left and right sections
                                                        >
                                                            {"Mix"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="save-button"
                                                            onClick={() => {
                                                                handleResponseClick();
                                                            }}
                                                        >
                                                            {"Response"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-dismiss="modal"
                                                            className="cancel-button"
                                                            onClick={onCloseNCICModal}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    </>
                ) : (
                    <> </>
                )
                }
            </div>
        </>
    );
};

// PropTypes definition
NCICModal.propTypes = {
    openNCICModal: PropTypes.bool.isRequired,
    setOpenNCICModal: PropTypes.func.isRequired,
    isNameCallTaker: PropTypes.bool,
    setIsNameCallTaker: PropTypes.func,
};

// Default props
NCICModal.defaultProps = {
    isNameCallTaker: false,
    setIsNameCallTaker: () => { },
    openNCICModal: false,
    setOpenNCICModal: () => { },
};

export default memo(NCICModal);
