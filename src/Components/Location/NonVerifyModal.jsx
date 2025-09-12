import { memo, useCallback, useEffect, useState } from 'react'
import Select from "react-select";
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';

const VerifyLocation = (props) => {

    const { loginAgencyID, modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data, setStatesChangeStatus } = props

    const [countryIDList, setCountryIDList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);

    //--------------------------DropDown------------------------------
    const [dirPreFixSufixData, setDirPreFixSufixData] = useState([]);
    const [typeSuffixData, setTypeSuffixData] = useState([]);
    const [apartmentTypeDrp, setApartmentTypeDrp] = useState([]);

    const [locationVal, setLocationVal] = useState({
        'AgencyID': loginAgencyID ? loginAgencyID : '',
        'AgencyName': '',
        'LocationID': '',
        'IsActive': '1',

        'PremiseNo': '',
        'PremiseNo_Parse': '',

        'Street': '',
        'Street_Parse': '',

        'CommonPlace': '',

        'ApartmentNo': '',

        'ApartmentType': '',

        'CountryID': '',
        'Country': '',
        'State': '',
        'CityID': '',
        'City': '',
        'ZipCodeID': '',
        'Statefullname': '',
        'ZipCode': '',
        'DirectionPrefix': '',
        'DirectionSufix': '',
        'DirectionPrefix_Parse': '',
        'DirectionSuffix_Parse': '',
        'TypeSufix': '',
        'TypeSuffix_Parse': '',
        'IsUsLocation': 'Y',
        'Address': '',
    });

    const [errors, setErrors] = useState({
        'StreetError': '', 'CountryIDError': '', 'StateError': '', 'StatefullnameError': '', 'CityIDError': '', 'ApartmentTypeError': '',
    })

    const check_Validation_Error = (e) => {
        if (locationVal?.IsUsLocation === 'Y') {
            const StreetErr = RequiredFieldIncident(locationVal.Street);
            const StateErr = RequiredFieldIncident(locationVal.State);
            const CityIDErr = RequiredFieldIncident(locationVal.CityID);
            const ApartmentTypeErr = locationVal.ApartmentNo ? RequiredFieldIncident(locationVal?.ApartmentType) : 'true';
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['StreetError']: StreetErr,
                    ['StateError']: StateErr,
                    ['CityIDError']: CityIDErr,
                    ['ApartmentTypeError']: ApartmentTypeErr,
                }
            })
        } else {
            const StreetErr = RequiredFieldIncident(locationVal.Street);
            const CountryIDErr = RequiredFieldIncident(locationVal.CountryID);
            const StatefullnameErr = RequiredFieldIncident(locationVal.Statefullname);
            const CityErr = RequiredFieldIncident(locationVal.City);
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['StreetError']: StreetErr,
                    ['CountryIDError']: CountryIDErr,
                    ['StatefullnameError']: StatefullnameErr,
                    ['CityIDError']: CityErr,
                }
            })
        }
    }

    // Check All Field Format is True Then Submit 
    const { StreetError, CountryIDError, StateError, CityIDError, ApartmentTypeError, StatefullnameError } = errors

    useEffect(() => {
        if (locationVal?.IsUsLocation === 'Y') {
            if (StreetError === 'true' && StateError === 'true' && CityIDError === 'true' && ApartmentTypeError === 'true') {
                saveVerifyLocation();
            }
        } else if (CountryIDError === 'true' && StreetError === 'true' && StatefullnameError === 'true' && CityIDError === 'true') {
            saveVerifyLocation();
        }
    }, [StreetError, CountryIDError, StateError, CityIDError, ApartmentTypeError, StatefullnameError])

    useEffect(() => {
        if (modalStatus) {
            if (addVerifySingleData.length !== 0) {
                setLocationVal(prevValues => {
                    return {
                        ...prevValues,
                        'PremiseNo': addVerifySingleData[0]?.PremiseNo,//
                        'PremiseNo_Parse': addVerifySingleData[0]?.PremiseNo_Parse,//

                        'Street': addVerifySingleData[0]?.Street,//
                        'Street_Parse': addVerifySingleData[0]?.Street_Parse,

                        'CommonPlace': addVerifySingleData[0]?.CommonPlace,//

                        'ApartmentNo': addVerifySingleData[0]?.ApartmentNo,//    

                        'ApartmentType': addVerifySingleData[0]?.ApartmentType === 0 ? "" : addVerifySingleData[0]?.ApartmentType,//

                        'CountryID': addVerifySingleData[0]?.CountryID,
                        'Country': addVerifySingleData[0]?.Country,
                        'State': addVerifySingleData[0]?.State ? parseInt(addVerifySingleData[0]?.State) : 0,
                        'CityID': addVerifySingleData[0]?.CityID,
                        'ZipCodeID': addVerifySingleData[0]?.ZipCodeID,
                        'City': addVerifySingleData[0]?.City,
                        'Statefullname': addVerifySingleData[0]?.Statefullname,
                        'ZipCode': addVerifySingleData[0]?.ZipCode,

                        'IsUsLocation': addVerifySingleData[0]?.IsUsLocation,
                        'DirectionPrefix': parseInt(addVerifySingleData[0]?.DirectionPrefix),
                        'TypeSufix': parseInt(addVerifySingleData[0]?.TypeSufix),
                        'DirectionSufix': parseInt(addVerifySingleData[0]?.DirectionSufix),
                        'DirectionPrefix_Parse': parseInt(addVerifySingleData[0]?.DirectionPrefix_Parse),
                        'TypeSuffix_Parse': parseInt(addVerifySingleData[0]?.TypeSuffix_Parse),
                        'DirectionSuffix_Parse': parseInt(addVerifySingleData[0]?.DirectionSuffix_Parse),
                        'Address': addVerifySingleData[0]?.Address,
                    }
                })
                getStateList();
                getCity(addVerifySingleData[0]?.State ? parseInt(addVerifySingleData[0]?.State) : 0);
                get_City_Zip(addVerifySingleData[0]?.CityID);
            } else {
                setLocationVal({
                    ...locationVal,
                    ['PremiseNo']: '',
                    ['IsUsLocation']: 'Y'
                });
            }
        }
    }, [addVerifySingleData, modalStatus]);

    useEffect(() => {
        if (modalStatus) {
            if (countryIDList?.length === 0) { getCountryID(); }
            if (dirPreFixSufixData?.length === 0) { get_DirPreFixSufix_Data(loginAgencyID); }
            if (typeSuffixData?.length === 0) { get_Type_Sufix_Data(loginAgencyID); }
            if (apartmentTypeDrp?.length === 0) { get_apartmentTypeDrp_Data(loginAgencyID); }
            if (stateList?.length === 0) { getStateList(); }
        }
    }, [loginAgencyID, modalStatus]);

    const get_Type_Sufix_Data = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID, };
        fetchPostData("TypeSuffix/GetDataDropDown_TypeSuffix", val).then((data) => {
            if (data) {
                setTypeSuffixData(Comman_changeArrayFormat(data, "TypeSuffixID", "Description"));
            } else {
                setTypeSuffixData([]);
            }
        });
    };

    const get_DirPreFixSufix_Data = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID, };
        fetchPostData("DirectionPrefixSuffix/GetDataDropDown_DirectionPrefixSuffix", val).then((data) => {
            if (data) {
                setDirPreFixSufixData(Comman_changeArrayFormat(data, "DirectionPrefixSuffixID", "Description"));
            } else {
                setDirPreFixSufixData([]);
            }
        });
    };

    const getCountryID = async () => {
        fetchData("IncidentCountry_State/GetData_IncidentCountry").then((data) => {
            if (data) {
                setCountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "DLCountryID"));
            } else {
                setCountryIDList([]);
            }
        });
    };

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(threeColArray(data, "StateID", "StateName", "State"));
            } else {
                setStateList([]);
            }
        });
    };

    const getCity = async (StateID) => {
        const val = { StateID: StateID, };
        fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
            if (data) {
                setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "BICityID"))
            } else {
                setCityList([]);
            }
        });
    };

    const get_City_Zip = async (CityId) => {
        const val = { CityId: CityId, }
        fetchPostData("State_City_ZipCode/GetData_ZipCode", val).then((data) => {
            if (data) {
                setZipList(Comman_changeArrayFormat(data, "zipId", "Zipcode"))
            } else {
                setZipList([]);
            }
        });
    };

    const get_apartmentTypeDrp_Data = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID, };
        fetchPostData("AppartmentType/GetDataDropDown_AppartmentType", val).then((data) => {
            if (data) {
                setApartmentTypeDrp(Comman_changeArrayFormat(data, "ApartmentTypeID", "Description"));
            } else {
                setApartmentTypeDrp([]);
            }
        });
    };

    const HandleChange = (e) => {
        setStatesChangeStatus(true)
        if (e.target.name == 'IsUsLocation') {
            setLocationVal({ ...locationVal, [e.target.name]: e.target.value });
            setErrors({ ...errors, 'StreetError': '', 'ApartmentTypeError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ZipCodeIDError': '', });
        } else if (e.target.name === 'ApartmentNo') {
            const ele = e.target.value
            setLocationVal({ ...locationVal, [e.target.name]: ele, ['ApartmentType']: '', });
            if (ele?.length > 0) {
                setErrors({ ...errors, ['ApartmentTypeError']: '' })
            }
        } else {
            setLocationVal({ ...locationVal, [e.target.name]: e.target.value });
        }
    }

    const selectHandleChange = (e, name, nameCode) => {
        setStatesChangeStatus(true)
        if (e) {
            if (name === 'State') {
                getCity(e.value)
                setLocationVal({ ...locationVal, [name]: e.value, ['StateFullName']: e.label, ['CityID']: '', ['City']: null, });
            } else if (name === 'CityID') {
                get_City_Zip(e.value);
                setLocationVal({ ...locationVal, [name]: e.value, ['City']: e.label, ['ZipCode']: null, ['ZipCodeID']: '' });
            } else if (name === 'ZipCodeID') {
                setLocationVal({ ...locationVal, [name]: e.value, ['ZipCode']: e.label, });
            } else if (name === 'CountryID') {
                setLocationVal({ ...locationVal, [name]: e.value, ['Country']: e.label });
            } else {
                setLocationVal({ ...locationVal, [name]: e.value, });
            }
        } else if (e === null) {
            if (name === 'CityID') {
                setLocationVal({ ...locationVal, [name]: '', ['City']: '', ['ZipCodeID']: '', ['ZipCode']: '', });
                setZipList([])
            } else if (name === 'State') {
                setLocationVal({ ...locationVal, [name]: '', ['CityID']: '', ['City']: '', ['StateFullName']: '', ['ZipCodeID']: '', ['ZipCode']: '', });
                setCityList([]);
                setZipList([]);
            } else if (name === 'CountryID') {
                setLocationVal({
                    ...locationVal, [name]: '', ['Country']: '', ['State']: '', ['StateFullName']: '', ['CityID']: '',
                    ['City']: '', ['ZipCodeID']: '', ['ZipCode']: '',
                });
                setStateList([]); setCityList([]); setZipList([]);
            } else {
                setLocationVal({
                    ...locationVal,
                    [name]: '',
                    [nameCode]: '',
                });
            }
        }
    }

    useEffect(() => {
        if (locationVal?.IsUsLocation) ResetOnChange(locationVal?.IsUsLocation);
    }, [locationVal?.IsUsLocation])

    const ResetOnChange = () => {
        if (addVerifySingleData[0]?.IsUsLocation === 'Y' && locationVal?.IsUsLocation === 'Y' && addVerifySingleData.length > 0) {
            get_Add_Single_Data(value.crimelocationid);
        } else {
            setLocationVal({
                ...locationVal,
                // 'IsUsLocation': 'N',
                'PremiseNo': '',
                'PremiseNo_Parse': '',
                'I_PremiseNo_Parse': '',

                'Street': '',
                'Street_Parse': '',
                'I_Street_Parse': '',

                'CommonPlace': '',
                'Commonplace_Parse': '',

                'ApartmentNo': '',
                'ApartmentNo_Parse': '',

                'ApartmentType': '',
                'ApartmentType_Parse': '',

                'CountryID': '',
                'Country': '',
                'State': '',
                'StatefullName': '',
                'StateFullname': '',
                'City': '',
                'CityID': '',
                'ZipCodeID': '',
                'ZipCode': '',

                'Area': '',
                'DirectionPrefix': '',
                'DirectionSufix': '',
                'TypeSufix': '',
                'Latitude': '',
                'Longitude': '',
                'LocationAlias': '',
                'GeoCords': '',
                'ORINumber': '',
                'LocationType': '',
                'RecommandedAddress': '',
                'MunicipalityCode': '',
                'JurisCode': '',
                'ind_col': '',
                'PatrolArea': '',
                'ZoneCode': '',
                'ZoneDesc': '',
                'MainX': '',
                'MainY': '',
                'MainZ': '',
                'AlternateX': '',
                'AlternateY': '',
                'AlternateZ': '',
                'DirectionPrefix_Parse': '',
                'TypeSuffix_Parse': '',
                'DirectionSuffix_Parse': '',
                'I_DirectionPrefix_Parse': '',
                'I_TypeSuffix_Parse': '',
                'I_DirectionSuffix_Parse': '',
                'MuniCode_Parse': '',
                'JurisCode_Parse': '',
                'GAPID': '',
                'DISTRICT': '',
                'GRID': '',
                'IsAddressFROMNonUS': '',
                'LOCUniqID': '',
                'TypePrefix': '',

                'Division': '',
                'Field_office': '',
                'Direction': '',

                'GCModifier': '',
                'Location_ID': '',
                'KeyMAP': '',
                'MP_Number': null,
                'MP_Prefix': '',
                'Milepost': '',
                'MP_Suffix': '',
                'NSPDType': '',
                'NSPDUniqueID': '',
                'SegmentRange': '',
                'CrossingsDOTNum': '',
                'CrossingsFullName': '',
                'NSPDName': '',
                'XRMSDisplayText': '',
                'Address': '',

            });
        }
        if (addVerifySingleData[0]?.IsUsLocation === 'N' && locationVal?.IsUsLocation === 'N' && addVerifySingleData.length > 0) {
            get_Add_Single_Data(value.crimelocationid);
        } else {
            setLocationVal({
                ...locationVal,
                'PremiseNo': '',
                'PremiseNo_Parse': '',
                'I_PremiseNo_Parse': '',

                'Street': '',
                'Street_Parse': '',
                'I_Street_Parse': '',

                'CommonPlace': '',
                'Commonplace_Parse': '',

                'ApartmentNo': '',
                'ApartmentNo_Parse': '',

                'ApartmentType': '',
                'ApartmentType_Parse': '',

                'CountryID': '',
                'Country': '',
                'State': '',
                'Statefullname': '',
                'StatefullName': '',
                'City': '',
                'CityID': '',
                'ZipCodeID': '',
                'ZipCode': '',

                'Area': '',
                'DirectionPrefix': '',
                'DirectionSufix': '',
                'TypeSufix': '',
                'Latitude': '',
                'Longitude': '',
                'LocationAlias': '',
                'GeoCords': '',
                'ORINumber': '',
                'LocationType': '',
                'RecommandedAddress': '',
                'MunicipalityCode': '',
                'JurisCode': '',
                'ind_col': '',
                'PatrolArea': '',
                'ZoneCode': '',
                'ZoneDesc': '',
                'MainX': '',
                'MainY': '',
                'MainZ': '',
                'AlternateX': '',
                'AlternateY': '',
                'AlternateZ': '',
                'DirectionPrefix_Parse': '',
                'TypeSuffix_Parse': '',
                'DirectionSuffix_Parse': '',
                'I_DirectionPrefix_Parse': '',
                'I_TypeSuffix_Parse': '',
                'I_DirectionSuffix_Parse': '',
                'MuniCode_Parse': '',
                'JurisCode_Parse': '',
                'GAPID': '',
                'DISTRICT': '',
                'GRID': '',
                'IsAddressFROMNonUS': '',
                'LOCUniqID': '',
                'TypePrefix': '',

                'Division': '',
                'Field_office': '',
                'Direction': '',

                'GCModifier': '',
                'Location_ID': '',
                'KeyMAP': '',
                'MP_Number': null,
                'MP_Prefix': '',
                'Milepost': '',
                'MP_Suffix': '',
                'NSPDType': '',
                'NSPDUniqueID': '',
                'SegmentRange': '',
                'CrossingsDOTNum': '',
                'CrossingsFullName': '',
                'NSPDName': '',
                'XRMSDisplayText': '',
                'Address': '',
            });
        }
        setErrors({ ...errors, 'StreetError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ZipCodeIDError': '', 'ApartmentTypeError': '', 'StatefullnameError': '' });
    }

    const Reset = () => {
        setLocationVal({
            ...locationVal,
            'IsUsLocation': 'Y',
            'PremiseNo': '',
            'PremiseNo_Parse': '',
            'I_PremiseNo_Parse': '',

            'Street': '',
            'Street_Parse': '',
            'I_Street_Parse': '',

            'CommonPlace': '',
            'Commonplace_Parse': '',

            'ApartmentNo': '',
            'ApartmentNo_Parse': '',

            'ApartmentType': '',
            'ApartmentType_Parse': '',

            'CountryID': '',
            'Country': '',
            'State': '',
            'Statefullname': '',
            'StateFullName': '',
            'City': '',
            'CityID': '',
            'ZipCodeID': '',
            'ZipCode': '',

            'Area': '',
            'DirectionPrefix': '',
            'DirectionSufix': '',
            'TypeSufix': '',
            'Latitude': '',
            'Longitude': '',
            'LocationAlias': '',
            'GeoCords': '',
            'ORINumber': '',
            'LocationType': '',
            'RecommandedAddress': '',
            'MunicipalityCode': '',
            'JurisCode': '',
            'ind_col': '',
            'PatrolArea': '',
            'ZoneCode': '',
            'ZoneDesc': '',
            'MainX': '',
            'MainY': '',
            'MainZ': '',
            'AlternateX': '',
            'AlternateY': '',
            'AlternateZ': '',
            'DirectionPrefix_Parse': '',
            'TypeSuffix_Parse': '',
            'DirectionSuffix_Parse': '',
            'I_DirectionPrefix_Parse': '',
            'I_TypeSuffix_Parse': '',
            'I_DirectionSuffix_Parse': '',
            'MuniCode_Parse': '',
            'JurisCode_Parse': '',
            'GAPID': '',
            'DISTRICT': '',
            'GRID': '',
            'IsAddressFROMNonUS': '',
            'LOCUniqID': '',
            'TypePrefix': '',

            'Division': '',
            'Field_office': '',
            'Direction': '',

            'GCModifier': '',
            'Location_ID': '',
            'KeyMAP': '',
            'MP_Number': null,
            'MP_Prefix': '',
            'Milepost': '',
            'MP_Suffix': '',
            'NSPDType': '',
            'NSPDUniqueID': '',
            'SegmentRange': '',
            'CrossingsDOTNum': '',
            'CrossingsFullName': '',
            'NSPDName': '',
            'XRMSDisplayText': '',
            'Address': '',
        });
        setErrors({
            ...errors,
            'StreetError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ZipCodeIDError': '', 'ApartmentTypeError': '',
        });
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            Reset();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const saveVerifyLocation = () => {
        const {
            AgencyID, AgencyName, LocationID, IsActive, PremiseNo, PremiseNo_Parse, Street, Street_Parse, CommonPlace, ApartmentNo,
            ApartmentType, CountryID, Country, State, CityID, City, ZipCodeID, Statefullname, ZipCode, DirectionPrefix,
            DirectionSufix, DirectionPrefix_Parse, DirectionSuffix_Parse, TypeSufix, TypeSuffix_Parse, IsUsLocation, Address,
        } = locationVal
        const val = {
            'AgencyID': AgencyID, 'AgencyName': AgencyName, 'LocationID': LocationID, 'IsActive': IsActive, 'PremiseNo': PremiseNo, 'PremiseNo_Parse': PremiseNo_Parse,
            'Street': Street, 'Street_Parse': Street_Parse, 'CommonPlace': CommonPlace, 'ApartmentNo': ApartmentNo,
            'ApartmentType': ApartmentType, 'CountryID': CountryID, 'Country': Country, 'State': State, 'CityID': CityID, 'City': City, 'ZipCodeID': ZipCodeID, 'Statefullname': Statefullname,
            'ZipCode': ZipCode, 'DirectionPrefix': DirectionPrefix,
            'DirectionSufix': DirectionSufix, 'DirectionPrefix_Parse': DirectionPrefix_Parse, 'DirectionSuffix_Parse': DirectionSuffix_Parse, 'TypeSufix': TypeSufix,
            'TypeSuffix_Parse': TypeSuffix_Parse, 'IsUsLocation': IsUsLocation, 'Address': `${Street + ' ' + ApartmentNo + ' ' + City + ' ' + ZipCode + ' ' + Statefullname + ' ' + Country}`,
        }
        AddDeleteUpadate('MasterLocation/Insert_Location', val).then((res) => {
            if (res.success) {
                setModalStatus(false);
                if (res.LocationID) {
                    setValue({
                        ...value,
                        ['crimelocationid']: parseInt(res.LocationID),
                        ['CrimeLocation']: res.NonVerifyAddress,
                        ['IsVerify']: false
                    });
                    get_Add_Single_Data(res.LocationID);
                }
                setErrors({ ...errors, ['StreetError']: '' });
                Reset();
            } else {
                console.log(res);
            }
        })
    }

    const onCloseLocation = () => {
        if (addVerifySingleData?.length === 0) {
            setValue(pre => { return { ...pre, ['IsVerify']: !pre.IsVerify } });
        }
        Reset();
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            {
                modalStatus ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '9999999' }} id="VerifyModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1">
                                        <div className="row px-2">
                                            <div className="form-check">
                                                {
                                                    locationVal?.IsUsLocation !== 'N' ?
                                                        <input className="form-check-input" type="radio" onClick={HandleChange} value={'Y'} checked={locationVal.IsUsLocation !== 'N' ? true : false} name="IsUsLocation" id="flexRadioDefault1" />
                                                        :
                                                        <input className="form-check-input" type="radio" onClick={HandleChange} value={'Y'} checked={locationVal.IsUsLocation} name="IsUsLocation" id="flexRadioDefault1" />
                                                }
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                    US
                                                </label>
                                            </div>
                                            <div className="form-check ml-4">
                                                {
                                                    locationVal.IsUsLocation === 'N' ?
                                                        <input className="form-check-input" onClick={HandleChange} value={'N'} checked={locationVal.IsUsLocation} type="radio" name="IsUsLocation" id="flexRadioDefault2" />
                                                        :
                                                        <input className="form-check-input" onClick={HandleChange} value={'N'} type="radio" name="IsUsLocation" id="flexRadioDefault2" />
                                                }
                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                    Non-US
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            locationVal?.IsUsLocation !== 'N' ?
                                                <fieldset style={{ border: '1px solid gray' }}>
                                                    <legend style={{ fontWeight: 'bold' }}>Non-Verified Address</legend>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <p className='col-12 ' style={{ marginTop: '0px', marginBottom: '5px', textDecoration: 'underline', fontWeight: 'bold' }}>Real Address</p>
                                                                <div className="col-6 col-md-6  col-lg-2">
                                                                    <div className="text-field">
                                                                        <input type="text" name='PremiseNo' id='PremiseNo' value={locationVal?.PremiseNo} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Premise</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="DirectionPrefix"
                                                                        styles={customStylesWithOutColor}
                                                                        value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionPrefix)}
                                                                        isClearable
                                                                        options={dirPreFixSufixData}
                                                                        onChange={(e) => selectHandleChange(e, 'DirectionPrefix')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Dir Pre</label>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4">
                                                                    <div className="text-field">
                                                                        <input type="text" name='Street' id='Street' className='requiredColor' value={locationVal?.Street} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Street Name</label>
                                                                        {errors.StreetError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StreetError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="TypeSufix"
                                                                        styles={customStylesWithOutColor}
                                                                        value={typeSuffixData?.filter((obj) => obj.value === locationVal?.TypeSufix)}
                                                                        isClearable
                                                                        options={typeSuffixData}
                                                                        onChange={(e) => selectHandleChange(e, 'TypeSufix')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Ty Suf</label>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="DirectionSufix"
                                                                        styles={customStylesWithOutColor}
                                                                        value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionSufix)}
                                                                        isClearable
                                                                        options={dirPreFixSufixData}
                                                                        onChange={(e) => selectHandleChange(e, 'DirectionSufix')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Dir Suf</label>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="row" >
                                                                <p className='col-12 ' style={{ marginTop: '-10px', marginBottom: '5px', textDecoration: 'underline', fontWeight: 'bold' }}>Intersection</p>
                                                                <div className="col-6 col-md-6  col-lg-2 ">
                                                                    <div className="text-field">
                                                                        <input type="text" name='PremiseNo_Parse' id='PremiseNo_Parse' value={locationVal?.PremiseNo_Parse} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Premise</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="DirectionPrefix_Parse"
                                                                        styles={customStylesWithOutColor}
                                                                        value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionPrefix_Parse)}
                                                                        isClearable
                                                                        options={dirPreFixSufixData}
                                                                        onChange={(e) => selectHandleChange(e, 'DirectionPrefix_Parse')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Dir Pre-P</label>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4">
                                                                    <div className="text-field">
                                                                        <input type="text" name='Street_Parse' id='Street_Parse' value={locationVal?.Street_Parse} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Street Name</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="TypeSuffix_Parse"
                                                                        styles={customStylesWithOutColor}
                                                                        value={typeSuffixData?.filter((obj) => obj.value === locationVal?.TypeSuffix_Parse)}
                                                                        isClearable
                                                                        options={typeSuffixData}
                                                                        onChange={(e) => selectHandleChange(e, 'TypeSuffix_Parse')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Ty Suf-P</label>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2  dropdown__box">
                                                                    <Select
                                                                        name="DirectionSuffix_Parse"
                                                                        styles={customStylesWithOutColor}
                                                                        value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionSuffix_Parse)}
                                                                        isClearable
                                                                        options={dirPreFixSufixData}
                                                                        onChange={(e) => selectHandleChange(e, 'DirectionSuffix_Parse')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Dir Suf-P</label>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-6 mt-2">
                                                                    <div className="text-field">
                                                                        <input type="text" name='CommonPlace' id='CommonPlace' value={locationVal?.CommonPlace} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Common Place</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-2 mt-2">
                                                                    <div className="text-field">
                                                                        <input type="text" name='ApartmentNo' id='ApartmentNo' value={locationVal?.ApartmentNo} onChange={HandleChange} required autoComplete='off' />
                                                                        <label className=''>Apartment</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4 " style={{ marginTop: '7px' }}>
                                                                    <div className="dropdown__box">
                                                                        <Select
                                                                            name="ApartmentType"
                                                                            styles={locationVal?.ApartmentNo?.trim()?.length > 0 ? colourStyles : customStylesWithOutColor}
                                                                            value={apartmentTypeDrp?.filter((obj) => obj.value === locationVal?.ApartmentType)}
                                                                            isClearable
                                                                            options={apartmentTypeDrp}
                                                                            onChange={(e) => selectHandleChange(e, 'ApartmentType',)}
                                                                            placeholder="Select..."
                                                                            isDisabled={locationVal?.ApartmentNo?.trim()?.length > 0 ? false : true}
                                                                        />
                                                                        <label htmlFor="" className=''>Apartment Type</label>
                                                                        {errors.ApartmentTypeError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApartmentTypeError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4   pt-2">
                                                                    <div className="dropdown__box">
                                                                        <Select
                                                                            name="State"
                                                                            menuPlacement='top'
                                                                            styles={colourStyles}
                                                                            value={stateList?.filter((obj) => obj.value === locationVal?.State)}
                                                                            isClearable
                                                                            options={stateList}
                                                                            onChange={(e) => selectHandleChange(e, 'State', 'StateFullName')}
                                                                            placeholder="Select..."
                                                                        />
                                                                        <label htmlFor="" className=''>State</label>
                                                                        {errors.StateError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4 mt-2">
                                                                    <div className="dropdown__box">
                                                                        <Select
                                                                            name="CityID"
                                                                            styles={colourStyles}
                                                                            menuPlacement='top'
                                                                            value={cityList?.filter((obj) => obj.value === locationVal?.CityID)}
                                                                            isClearable
                                                                            options={cityList}
                                                                            onChange={(e) => selectHandleChange(e, 'CityID', 'City')}
                                                                            placeholder="Select..."
                                                                        />
                                                                        <label htmlFor="" className=''>City</label>
                                                                        {errors.CityIDError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-4  mt-2">
                                                                    <div className="dropdown__box">
                                                                        <Select
                                                                            name="ZipCodeID"
                                                                            styles={customStylesWithOutColor}
                                                                            value={zipList?.filter((obj) => obj.value === locationVal?.ZipCodeID)}
                                                                            isClearable
                                                                            options={zipList}
                                                                            onChange={(e) => selectHandleChange(e, 'ZipCodeID', 'ZipCode')}
                                                                            placeholder="Select..."
                                                                        />
                                                                        <label htmlFor="">Zip</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                :
                                                <fieldset style={{ border: '1px solid gray' }}>
                                                    <legend style={{ fontWeight: 'bold' }}>Non-Verified Address</legend>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <div className="col-12  col-md-12 col-lg-12 mt-1 ">
                                                                    <div className=" text-field ">
                                                                        <textarea name='Street' id="Street" onChange={HandleChange} value={locationVal?.Street} cols="30" rows='2'
                                                                            className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                                                        <label htmlFor="" className='px-1'>Real Address</label>
                                                                        {errors.StreetError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StreetError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-3 dropdown__box">
                                                                    <Select
                                                                        name="CountryID"
                                                                        styles={colourStyles}
                                                                        value={countryIDList?.filter((obj) => obj.value === locationVal?.CountryID)}
                                                                        isClearable
                                                                        options={countryIDList}
                                                                        onChange={(e) => selectHandleChange(e, 'CountryID', 'Country')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className=''>Country</label>
                                                                    {errors.CountryIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CountryIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-3  ">
                                                                    <div className="text-field  ">
                                                                        <input type="text" name='Statefullname' id='Statefullname' className='requiredColor' value={locationVal?.Statefullname} onChange={HandleChange} required autoComplete='off' />
                                                                        <label htmlFor='' className='pt-1 pl-1'>State</label>
                                                                        {errors.StatefullnameError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StatefullnameError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-3  ">
                                                                    <div className="text-field  ">
                                                                        <input type="text" name='City' id='City' className='requiredColor' value={locationVal?.City} onChange={HandleChange} required autoComplete='off' />

                                                                        <label htmlFor='' className='pt-1 pl-1'>City</label>
                                                                        {errors.CityIDError !== 'true' ? (
                                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 col-md-6  col-lg-3  ">
                                                                    <div className="text-field  ">
                                                                        <input type="text" name='ZipCode' id='ZipCode' value={locationVal?.ZipCode} onChange={HandleChange} required autoComplete='off' />

                                                                        <label htmlFor='' className='pt-1 pl-1'>Zip</label>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                        }
                                    </div>
                                </div>
                                <div className="btn-box text-right mt-3 mr-1 mb-2">
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error() }} >Save</button>
                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { onCloseLocation() }} >Close</button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <> </>
            }
        </>
    )
}

export default memo(VerifyLocation);
