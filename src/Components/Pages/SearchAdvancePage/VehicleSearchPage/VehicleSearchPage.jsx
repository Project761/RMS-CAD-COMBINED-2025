import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingMonthDateYear, getYearWithOutDateTime } from '../../../Common/Utility';
import { toastifyError } from '../../../Common/AlertMsg';
import { fetchPostData } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get_Classification_Drp_Data, get_IsPrimary_Color_Drp_Data, get_IsSecondary_Color_Drp_Data, get_ModalId_Drp_Data, get_PlateType_Drp_Data, get_State_Drp_Data, get_VehicleLossCode_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import classNames from 'classnames';
import { Classification_Drp_Data, MakeID_Drp_Data, StyleID_Drp_Data } from '../../../../redux/actionTypes';


const VehicleSearchPage = ({ isCAD = false }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const propertyLossCodevehicle = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const classificationID = useSelector((state) => state.DropDown.classificationDrpData)
    const isSecondaryDrpData = useSelector((state) => state.DropDown.isSecondaryDrpData);
    const isPrimaryDrpData = useSelector((state) => state.DropDown.isPrimaryDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const modalIdDrp = useSelector((state) => state.DropDown.modalIdDrpData)

    // const styleIdDrp = useSelector((state) => state.DropDown.styleIdDrpData)
    // const makeIdDrp = useSelector((state) => state.DropDown.makeIdDrpData)

    // const screenCode1 = effectiveScreenPermission[0]?.ScreenCode1;

    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const { setChangesStatus, setVehicleSearchData, GetDataTimeZone, datezone, recentSearchData, setRecentSearchData } = useContext(AgencyContext);
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [manufactureDate, setManufactureDate] = useState();
    const [manufactureDateto, setManufactureDateTo] = useState();

    const [vehMakeDrpData, setVehMakeDrpData] = useState([])
    const [styleDrp, setStyleDrpData] = useState([])

    const [value, setValue] = useState({
        'IncidentNumber': null, 'VehicleNumber': null, 'VehicleNumberTo': null, 'LossCodeID': null, 'ReportedDtTm': null, 'ReportedDtTmTo': null, 'VIN': '', 'PlateTypeID': '',
        'LastName': null, 'FirstName': null, 'MiddleName': null, 'CategoryID': null, 'ClassificationID': null,
        'MakeID': null, 'ModelID': null, 'StyleID': null, 'PlateID': null, 'VehicleNo': '', 'ManufactureYearFrom': '', 'ManufactureYearTo': '', 'ValueFrom': '', 'ValueTo': '',
        'PrimaryColorID': null, 'SecondaryColorID': null, 'Description': '', 'NICBID': null,
        'AgencyID': loginAgencyID, 'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK, CADEventTo: "", CADEventFrom: "", isAllAgencies: false,
        isSelfAgency: true
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(parseInt(localStoreData?.AgencyID)); setloginPinID(parseInt(localStoreData?.PINID)); GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("V107", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            if (isPrimaryDrpData?.length === 0) { dispatch(get_IsPrimary_Color_Drp_Data(loginAgencyID)) };
            if (isSecondaryDrpData?.length === 0) { dispatch(get_IsSecondary_Color_Drp_Data(loginAgencyID)) };
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (plateTypeIdDrp?.length === 0) { dispatch(get_PlateType_Drp_Data(loginAgencyID)) };
            PropertyType(loginAgencyID);
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };

        }
    }, [loginAgencyID])

    const handlChange = (e,) => {
        // if (e.target.name === 'VehicleNumber' || e.target.name === 'VehicleNumberTo') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 10) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\w{2})(\d{4})(\d{4})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
        //         }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //         if (ele?.length == 0) { e.target.name == 'VehicleNumber' && setValue({ ...value, ['VehicleNumberTo']: "", [e.target.name]: ele }) }
        //     }
        // }
        if (e.target.name === 'VehicleNumber' || e.target.name === 'VehicleNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'VehicleNumber' && setValue({
                    ...value, ['VehicleNumberTo']: "", [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'CADEventFrom') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'CADEventFrom' && setValue({
                    ...value, ['CADEventTo']: "", [e.target.name]: ele
                });
            }
        }
        // else if (e.target.name === 'IncidentNumber') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 8) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\d{2})(\d{6})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
        //         }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //     }
        // }
        else if (e.target.name === 'ValueFrom' || e.target.name === 'ValueTo') {
            let ele = e.target.value;
            ele = ele.replace(/[^0-9.]/g, "");
            if (ele.includes('.')) {
                let [integerPart, decimalPart] = ele.split('.');
                decimalPart = decimalPart.substring(0, 2);
                ele = `${integerPart}.${decimalPart}`;
            }
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0 && e.target.name === 'ValueFrom') {
                setValue({ ...value, ['ValueTo']: "", [e.target.name]: ele });
            }
        } else if (e.target.name === 'isSelfAgency' || e.target.name === 'isAllAgencies') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value))
                setValue({ ...value, ['MakeID']: e.value });

            } else if (name === 'CategoryID') {
                setValue({ ...value, [name]: e.value, ['MakeID']: '', ['ClassificationID']: '', ['StyleID']: '' });
                dispatch(get_Classification_Drp_Data(e.value));
                get_StyleId_Drp_Data(loginAgencyID, e.value);
                get_MakeId_Drp_Data(loginAgencyID, e.value)


            } else {
                setValue({ ...value, [name]: e.value });

            }

        } else if (e === null) {
            if (name === 'CategoryID') {
                setValue({ ...value, ['CategoryID']: '', ['ClassificationID']: '', ['MakeID']: '', ['StyleID']: '' });
                dispatch(get_Classification_Drp_Data(''))
                // get_StyleId_Drp_Data('', '');
                // get_MakeId_Drp_Data('', '');
                dispatch({ type: Classification_Drp_Data, payload: [] });

                setVehMakeDrpData([]);
                setStyleDrpData([]);

                // dispatch({ type: StyleID_Drp_Data, payload: [] });
                // dispatch({ type: MakeID_Drp_Data, payload: [] });

            } else if (name === 'ClassificationID') {
                setValue({ ...value, [name]: null, });

            } else if (name === 'MakeID') {
                setValue({ ...value, ['MakeID']: '', ['ModelID']: '' });
                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''));

            } else {
                setValue({ ...value, [name]: null });
            }

        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const PropertyType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode === "V") return val
                })
                if (res.length > 0) {
                    get_CategoryId_Drp(res[0]?.PropertyCategoryID)
                }
            }
        })
    }

    const get_CategoryId_Drp = (CategoryID) => {
        const val = { CategoryID: CategoryID }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setCategoryIdDrp(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
            } else {
                setCategoryIdDrp([]);
            }
        })
    }

    const get_MakeId_Drp_Data = (LoginAgencyID, CategoryID) => {
        const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
        fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
            if (data) {
                setVehMakeDrpData(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))

            } else {
                setVehMakeDrpData([]);

            }
        })
    }

    const get_StyleId_Drp_Data = (LoginAgencyID, CategoryID) => {
        const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
        fetchPostData('PropertyVehicleStyle/GetDataDropDown_PropertyVehicleStyle', val).then((data) => {
            if (data) {
                setStyleDrpData(Comman_changeArrayFormat(data, 'VehicleStyleID', 'Description'))

            } else {
                setStyleDrpData([]);

            }
        })
    }

    const [refineSearchData, setRefineSearchData] = useState(null);

    useEffect(() => {
        if (location.state?.fromRefineSearch) {
            setRefineSearchData(location.state);
            setValue(location.state.searchState || {});
        } else if (!refineSearchData) {
            // If no refine search data, reset the form
            Reset();
        }

        // Clear location.state AFTER saving the data locally
        if (location.state) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, refineSearchData]);

    const get_Vehicle_Search = async () => {
        if (value?.IncidentNumber?.trim() || value?.CADEventFrom?.trim() || value?.CADEventTo?.trim() || value?.VehicleNumber?.trim() || value?.LossCodeID ||
            value?.ReportedDtTm?.trim() || value?.ReportedDtTmTo?.trim() || value?.LastName?.trim() || value?.FirstName?.trim() || value?.MiddleName?.trim() || value?.CategoryID || value?.PlateTypeID || value?.VIN?.trim() ||
            value?.VehicleNumberTo?.trim() || value?.ClassificationID || value?.MakeID || value?.ModelID || value?.StyleID || value?.PlateID || value?.VehicleNo?.trim() || value?.ManufactureYearFrom || value?.ManufactureYearTo ||
            value?.ValueFrom?.trim() || value?.ValueTo?.trim() || value?.PrimaryColorID || value?.SecondaryColorID ||
            value?.Description?.trim() || value?.NICBID || value?.isSelfAgency || value?.isAllAgencies
        ) {
            const {
                IncidentNumber, VehicleNumber, LossCodeID, ReportedDtTm, ReportedDtTmTo,
                LastName, MiddleName, CategoryID, PlateTypeID, VIN, FirstName,
                VehicleNumberTo, ClassificationID, MakeID, ModelID, StyleID, PlateID, VehicleNo, ManufactureYearFrom,
                ManufactureYearTo,
                ValueFrom, ValueTo, PrimaryColorID, SecondaryColorID, Description, NICBID, AgencyID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, CADEventFrom, CADEventTo, isSelfAgency, isAllAgencies
            } = myStateRef.current;

            const payload = {
                ...(isCAD
                    ? { CADIncidentNumber: IncidentNumber }
                    : { IncidentNumber: IncidentNumber }),
                VehicleNumber, LossCodeID, ReportedDtTm, ReportedDtTmTo, LastName, MiddleName, CategoryID,
                PlateTypeID, VIN, FirstName, VehicleNumberTo, ClassificationID, MakeID, ModelID,
                StyleID, PlateID, VehicleNo, ManufactureYearFrom, ManufactureYearTo,
                // ValueFrom,
                'ValueTo': parseFloat(ValueTo) === 0 || parseFloat(ValueTo) < 0 ? '0.00' : parseFloat(ValueTo),
                'ValueFrom': parseFloat(ValueFrom) === 0 || parseFloat(ValueFrom) < 0 ? '0.00' : parseFloat(ValueFrom),
                PrimaryColorID, SecondaryColorID, Description, NICBID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, ReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
                "AgencyID": loginAgencyID,
                "SearchFlag": isSelfAgency && !isAllAgencies ? 0 : isAllAgencies && !isSelfAgency ? 1 : isSelfAgency && isAllAgencies ? 2 : null,
            };
            const apiEndpoint = isCAD
                ? "/CAD/QueryIncident/Vehicle_Search"
                : "PropertyVehicle/Search_PropertyVehicle";
            const res = await fetchPostData(apiEndpoint, payload);
            // const res = await fetchPostData("PropertyVehicle/Search_PropertyVehicle", payload);
            if (res.length > 0) {
                setVehicleSearchData(res);
                if (isCAD) {
                    navigate('/cad/vehicleSearchList?page=vehicle-Search', { state: { searchState: value } });
                } else {
                    navigate('/vehicle-search?page=vehicle-Search');
                    // Add to Recent Search
                    setRecentSearchData([...recentSearchData, { ...payload, SearchModule: 'Veh-Search' }]);
                }
                Reset();
            } else {
                setVehicleSearchData([]); toastifyError("Data Not Available");
                setIsPermissionsLoaded(false)
            }
        } else { toastifyError("Please Enter Details"); }
    };

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'Value') {
            const ele = e.target.value.replace(/[^0-9]/g, "")
            setChangesStatus(true); setValue({ ...value, [e.target.name]: ele });

        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true); setValue({ ...value, [e.target.name]: checkNumber });

        }
        else {
            setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.value });

        }
    }

    const Reset = () => {
        setIsPermissionsLoaded(false)
        setValue({
            ...value,
            'IncidentNumber': '', 'VehicleNumber': '', 'LossCodeID': '', 'ReportedDtTm': '', 'ReportedDtTmTo': '',
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'CategoryID': '', 'ClassificationID': null,
            'MakeID': null, 'ModelID': null, 'StyleID': null, 'PlateID': null, 'VehicleNo': '', 'ManufactureYearFrom': '', 'ManufactureYearTo': '', 'ValueFrom': '', 'ValueTo': '',
            'PrimaryColorID': null, 'SecondaryColorID': null, 'Description': '', 'NICBID': null, isAllAgencies: false,
            isSelfAgency: true
        })
    }

    const onClose = () => {
        if (isCAD) {
            navigate('/cad/dashboard-page');
        } else {
            navigate('/dashboard-page');
        }
        Reset();
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    //harsh --> Excellent
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I096", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isPermissionsLoaded) {
            get_Vehicle_Search();
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    function formatRawInput(value) {
        // Remove non-digit characters
        const cleaned = value?.replace(/\D/g, '');

        // MMddyyyy handling
        if (cleaned?.length === 8) {
            const mm = cleaned?.slice(0, 2);
            const dd = cleaned?.slice(2, 4);
            const yyyy = cleaned?.slice(4, 8);
            return `${mm}/${dd}/${yyyy}`;
        }

        return value;
    }


    return (
        <div className=" section-body pt-3 p-1 bt" >
            <div className="dark-row" >
                {/* <div className="card Agency incident-card "> */}
                <div className={classNames("card Agency", { "incident-card": !isCAD })}>
                    <div className="card-body" >
                        <div className="btn-box text-right  mr-1 mb-2">
                            {
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Vehicle_Search() }} >Search</button>
                                    : <></> :
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Vehicle_Search() }} >Search</button>
                            }
                            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-2" onClick={() => { onClose(); }}>Close</button>

                        </div>
                        <div className="col-12 row my-2 ml-3">
                            <div className="row align-items-center px-1 mt-2 mb-2">
                                <div className="col-auto mt-1">
                                    <label className="new-label">Search with Agency</label>
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                    <input
                                        type="checkbox"
                                        id="isSelfAgency"
                                        name="isSelfAgency"
                                        checked={value.isSelfAgency}
                                        onChange={handlChange}
                                    />
                                    <label htmlFor="isSelfAgency" className="tab-form-label mb-0">
                                        Self Agency
                                    </label>
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                    <input
                                        type="checkbox"
                                        id="isAllAgencies"
                                        name="isAllAgencies"
                                        checked={value.isAllAgencies}
                                        onChange={handlChange}
                                    />
                                    <label htmlFor="isAllAgencies" className="tab-form-label mb-0">
                                        All Agencies
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-12 ">
                                <fieldset >
                                    <legend>Vehicle Information</legend>

                                    <div className="row ">
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>{isCAD ? "CAD Event #" : "Incident Number"}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-field ">
                                            <input type="text" id='IncidentNumber' name='IncidentNumber' className={''} value={value.IncidentNumber} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Vehicle Number From</label>
                                        </div>
                                        <div className={isCAD ? "col-4 col-md-4 col-lg-2 text-field" : "col-4 col-md-4 col-lg-2 text-field"}>
                                            <input type="text" id='VehicleNumber' style={{ textTransform: "uppercase" }} maxLength={12} name='VehicleNumber' className={''} value={value.VehicleNumber} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Vehicle Number To</label>
                                        </div>
                                        <div className={isCAD ? "col-4 col-md-4 col-lg-2 text-field" : "col-4 col-md-4 col-lg-2 text-field"}>
                                            <input type="text" disabled={!value?.VehicleNumber?.trim()}
                                                className={!value?.VehicleNumber?.trim() ? 'readonlyColor' : ''} id='VehicleNumberTo' style={{ textTransform: "uppercase" }} maxLength={12} name='VehicleNumberTo' value={value.VehicleNumberTo} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Reported From Date</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 ">
                                            <DatePicker
                                                id='ReportedDtTm'
                                                name='ReportedDtTm'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null, ['ReportedDtTmTo']: date ? value.ReportedDtTmTo : null }) }}
                                                className=''
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                showMonthDropdown
                                                showYearDropdown
                                                autoComplete='Off'
                                                dropdownMode="select"
                                                isClearable={value?.ReportedDtTm ? true : false}
                                                selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                maxDate={new Date(datezone)}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Reported To Date</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2">
                                            <DatePicker
                                                id='ReportedDtTmTo'
                                                name='ReportedDtTmTo'
                                                ref={startRef1}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy "
                                                autoComplete='Off'
                                                timeInputLabel
                                                isClearable={value?.ReportedDtTmTo ? true : false}
                                                selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                placeholderText={value?.ReportedDtTmTo ? value.ReportedDtTmTo : 'Select...'}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                maxDate={new Date(datezone)}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                minDate={new Date(value?.ReportedDtTm)}
                                                disabled={!value?.ReportedDtTm}
                                                className={!value?.ReportedDtTm ? 'readonlyColor' : ''}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>Loss Code</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3  mt-1">
                                            <Select
                                                name='LossCodeID'
                                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                styles={colourStyles}
                                                options={propertyLossCodeData}
                                                onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Category</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 mt-1">
                                            <Select
                                                name='CategoryID'
                                                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                styles={colourStyles}
                                                options={categoryIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Classification</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 mt-1">
                                            <Select
                                                name='ClassificationID'
                                                value={classificationID?.filter((obj) => obj.value === value?.ClassificationID)}
                                                styles={customStylesWithOutColor}
                                                options={classificationID}
                                                onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                                isClearable
                                                placeholder="Select..."
                                                isDisabled={!value?.CategoryID}

                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>VIN</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                            <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2">
                                            <label htmlFor="" className='new-label'>Make</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 mt-1">
                                            <Select
                                                name='MakeID'
                                                value={vehMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                styles={customStylesWithOutColor}
                                                options={vehMakeDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2">
                                            <label htmlFor="" className='new-label'>Model</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 mt-1">
                                            <Select
                                                name='ModelID'
                                                value={modalIdDrp?.filter((obj) => obj.value === value?.ModelID)}
                                                styles={customStylesWithOutColor}
                                                options={modalIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                isClearable
                                                placeholder="Select..."
                                                isDisabled={!value?.MakeID}
                                                className={!value?.MakeID ? 'readonlyColor' : ''}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2">
                                            <label htmlFor="" className='new-label'>Style</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <Select
                                                name='StyleID'
                                                value={styleDrp?.filter((obj) => obj.value === value?.StyleID)}
                                                styles={customStylesWithOutColor}
                                                options={styleDrp}
                                                onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Plate Type</label>
                                        </div>
                                        <div className="col-4 col-md-3 col-lg-2  mt-1">
                                            <Select
                                                name='PlateTypeID'
                                                value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                                styles={colourStyles}
                                                options={plateTypeIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Plate&nbsp;State&nbsp;&&nbsp;No.</label>
                                        </div>
                                        <div className="col-4 col-md-3 col-lg-2 mt-1" >
                                            <Select
                                                name='PlateID'
                                                value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                                                styles={customStylesWithOutColor}
                                                options={stateList}
                                                // onChange={(e) => ChangeDropDown(e, 'PlateID')}
                                                onChange={(e) => {
                                                    ChangeDropDown(e, 'PlateID');
                                                    if (!e) {
                                                        setValue({ ...value, PlateID: null, VehicleNo: '' });
                                                    }
                                                }}
                                                isClearable
                                                placeholder="Select..."
                                            />

                                        </div>
                                        <div className="text-field col-2 col-md-2 col-lg-4 mt-1">
                                            <input
                                                // className={`${value.PlateID ? "requiredColor" : ''} ${!value?.PlateID ? 'readonlyColor' : ''}`}
                                                className={` ${!value?.PlateID ? 'readonlyColor' : ''}`}
                                                disabled={!value?.PlateID}
                                                name='VehicleNo' id='VehicleNo' maxLength={8} value={value?.VehicleNo} onChange={HandleChanges} required placeholder='Number..' autoComplete='off' style={{ padding: "5px" }} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                            <label htmlFor="" className='new-label px-0'>Manu.&nbsp;Year&nbsp;From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">
                                            <DatePicker
                                                name="ManufactureYearFrom"
                                                id="ManufactureYearFrom"
                                                selected={manufactureDate}
                                                onChange={(date) => {
                                                    setManufactureDate(date);
                                                    setManufactureDateTo(null); // <-- Reset To date every time From date changes
                                                    setValue({
                                                        ...value,
                                                        ['ManufactureYearFrom']: date ? getYearWithOutDateTime(date) : null,
                                                        ['ManufactureYearTo']: null, // <-- Also reset in form value
                                                    });
                                                }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                yearItemNumber={8}
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                            />

                                        </div>

                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                            <label htmlFor="" className='new-label px-0'>Manu.&nbsp;Year&nbsp;To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">

                                            <DatePicker
                                                name="ManufactureYearTo"
                                                id="ManufactureYearTo"
                                                selected={manufactureDateto}
                                                onChange={(date) => {
                                                    setManufactureDateTo(date);
                                                    setValue({ ...value, ['ManufactureYearTo']: date ? getYearWithOutDateTime(date) : null });
                                                }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                yearItemNumber={8}
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                                minDate={manufactureDate}
                                                disabled={!value?.ManufactureYearFrom}
                                                className={!value?.ManufactureYearFrom ? 'readonlyColor' : ''}
                                            />

                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>Value From</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1 text-field mt-1">
                                            <input type="text" id='ValueFrom' style={{ textTransform: "uppercase" }} maxLength={9} name='ValueFrom' value={`$ ${value?.ValueFrom}`} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>Value To</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1 text-field mt-1">
                                            <input type="text" id='ValueTo' disabled={!value?.ValueFrom}
                                                className={!value?.ValueFrom ? 'readonlyColor' : ''} style={{ textTransform: "uppercase" }} maxLength={9} name='ValueTo' value={`$ ${value?.ValueTo}`} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Primary Color</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4  mt-1">
                                            <Select
                                                name='PrimaryColorID'
                                                value={isPrimaryDrpData?.filter((obj) => obj.value === value?.PrimaryColorID)}
                                                styles={customStylesWithOutColor}
                                                options={isPrimaryDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Secondary Color</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4  mt-1">
                                            <Select
                                                name='SecondaryColorID'
                                                value={isSecondaryDrpData?.filter((obj) => obj.value === value?.SecondaryColorID)}
                                                styles={customStylesWithOutColor}
                                                options={isSecondaryDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>

                                    </div>
                                </fieldset>
                                <fieldset >
                                    <legend>Vehicle Owner</legend>
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                            <input type="text" id='LastName' name='LastName' className={''} value={value.LastName} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                            <input type="text" id='FirstName' name='FirstName' className={''} value={value.FirstName} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Middle Name</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                            <input type="text" id='MiddleName' name='MiddleName' className={''} value={value.MiddleName} onChange={handlChange} />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset >
                                    <legend>Additional Info</legend>
                                    <div className="row">

                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Description</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-7 mt-1 text-field">
                                            <input type="text" name='Description' className='' value={value.Description} onChange={handlChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                            <label htmlFor="" className='new-label'>NICB ID</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                            <input type='text' name='NICBID' id='NICBID' value={value?.NICBID} onChange={handlChange} className='readonlyColor' readOnly />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    {/* <div className="btn-box text-right  mr-1 mb-2">
                        {
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Vehicle_Search() }} >Search</button>
                                : <></> :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Vehicle_Search() }} >Search</button>
                        }
                        <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-2" onClick={() => { onClose(); }}>Close</button>

                    </div> */}
                    {/* <div className="btn-box text-right  mr-1 mb-2">
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Vehicle_Search() }} >Search</button>
                        <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-2" onClick={() => { onClose(); }}>Close</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default VehicleSearchPage