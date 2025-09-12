import React, { useState, useEffect, } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime, tableCustomStyles } from '../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import { get_BoatModel_Drp_Data, get_Bottom_Color_Drp_Data, get_Make_Drp_Data, get_Material_Drp_Data, get_MeasureType_Drp_Data, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_Propulusion_Drp_Data, get_State_Drp_Data, get_SuspectedDrug_Drp_Data, get_Top_Color_Drp_Data, get_VOD_Drp_Data, get_WeaponMake_Drp_Data, get_WeaponModel_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { useSelector, useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { Property_LossCode_Drp_Data } from '../../../../redux/actionTypes';


const PropertyConsolidation = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
    const topColorDrpData = useSelector((state) => state.DropDown.topColorDrpData);
    const bottomColorDrpData = useSelector((state) => state.DropDown.bottomColorDrpData);
    const vodDrpData = useSelector((state) => state.DropDown.vodDrpData);
    const stateDrpData = useSelector((state) => state.DropDown.stateDrpData);
    const materialDrpData = useSelector((state) => state.DropDown.materialDrpData);
    const makeDrpData = useSelector((state) => state.DropDown.makeDrpData);
    const boatModelDrpData = useSelector((state) => state.DropDown.boatModelDrpData);
    const propulusionDrpData = useSelector((state) => state.DropDown.propulusionDrpData);
    const measureTypeDrpData = useSelector((state) => state.DropDown.measureTypeDrpData);
    const weaponMakeDrpData = useSelector((state) => state.DropDown.weaponMakeDrpData);
    const weaponModelDrpData = useSelector((state) => state.DropDown.weaponModelDrpData);
    const suspectedDrugDrpData = useSelector((state) => state.DropDown.suspectedDrugDrpData);

    const [weaponfactureDate, setWeaponfactureDate] = useState();
    const [dispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [manufactureDate, setManufactureDate] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [propertySearchData, setPropertySearchData] = useState([]);
    const [propertySecondaryData, setPropertySecondaryData] = useState([]);
    const [primaryPropertySelect, setPrimaryPropertySelect] = useState([]);
    const [selectionLocked, setSelectionLocked] = useState(false);
    const [secondaryPropertySelect, setSecondaryPropertySelect] = useState([])
    const [toggleClear, setToggleClear] = useState(false);
    const [loginPinID, setLoginPinID] = useState();
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': null, 'WeaponModelID': null, 'ReportedDtTmTo': null, 'MaterialID': null, 'VODID': null, 'MeasureTypeID': null, 'ConMerge': 'Con',
        'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'Denomination': '', 'IssuingAgency': '', 'MeasurementTypeID': '',
        'SecurityDtTm': '', 'MakeID': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'BarrelLength': '', 'Style': '', 'ManufactureYear': '', 'IsAuto': '', 'Comments': '',
        'RegistrationStateID': '', 'RegistrationNumber': '', 'Length': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'AgencyID': '',
        'TransactionNo': '', 'DispositionID': '', 'SuspectedDrugTypeID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '',
        'IncidentNumber': null, 'PropertyNumber': null,
        'PropertyCategoryCode': null, 'LastName': null, 'FirstName': null, 'MiddleName': null,
    });

    const [conValues, setConValues] = useState({
        "SecondaryNameID": '', "PrimaryKeyID": '', "PINID": '', 'strCategory': '', "AgencyID": '', "ComputerName": 'Admin0001',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_PropertyTypeData(loginAgencyID));
            if (topColorDrpData?.length === 0) dispatch(get_Top_Color_Drp_Data(loginAgencyID))
            if (bottomColorDrpData?.length === 0) dispatch(get_Bottom_Color_Drp_Data(loginAgencyID))
            if (vodDrpData?.length === 0) dispatch(get_VOD_Drp_Data(loginAgencyID));
            if (stateDrpData?.length === 0) dispatch(get_State_Drp_Data());
            if (materialDrpData?.length === 0) dispatch(get_Material_Drp_Data(loginAgencyID))
            if (makeDrpData?.length === 0) dispatch(get_Make_Drp_Data(loginAgencyID))
            if (boatModelDrpData?.length === 0) dispatch(get_BoatModel_Drp_Data(loginAgencyID));
            if (propulusionDrpData?.length === 0) dispatch(get_Propulusion_Drp_Data(loginAgencyID));
            if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
            if (weaponMakeDrpData?.length === 0) dispatch(get_WeaponMake_Drp_Data(loginAgencyID));
            if (weaponModelDrpData?.length === 0) dispatch(get_WeaponModel_Drp_Data(loginAgencyID));
            if (suspectedDrugDrpData?.length === 0) dispatch(get_SuspectedDrug_Drp_Data(loginAgencyID));
            get_Dispositions(loginAgencyID)
        }
    }, [loginAgencyID]);

    const get_Dispositions = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else { setDispositionsDrpData([]) }
        })
    };

    const getPropertySearch = async () => {
        const {
            PropertyTypeID, LossCodeID, ReportedDtTm, WeaponModelID, ReportedDtTmTo, MaterialID, VODID, MeasureTypeID, ConMerge,
            SerialID, ModelID, TopColorID, BottomColorID, OAN, Quantity, Brand, Denomination, IssuingAgency, MeasurementTypeID,
            SecurityDtTm, MakeID, Finish, Caliber, Handle, BarrelLength, Style, ManufactureYear, IsAuto, Comments,
            RegistrationStateID, RegistrationNumber, Length, HIN, RegistrationExpiryDtTm, PropulusionID, AgencyID,
            // Not in Search Api but use in search consolidation 
            TransactionNo, DispositionID, SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty,
            // column not exist in property consolidataion
            IncidentNumber, PropertyNumber,
            PropertyCategoryCode, LastName, FirstName, MiddleName,
        } = value
        const val = {
            'PropertyTypeID': PropertyTypeID, 'LossCodeID': LossCodeID, 'ReportedDtTm': ReportedDtTm, 'WeaponModelID': WeaponModelID, 'ReportedDtTmTo': ReportedDtTmTo,
            'MaterialID': MaterialID, 'VODID': VODID, 'MeasureTypeID': MeasureTypeID, 'ConMerge': ConMerge, 'IssuingAgency': IssuingAgency, 'MeasurementTypeID': MeasurementTypeID,
            'SerialID': SerialID, 'ModelID': ModelID, 'TopColorID': TopColorID, 'BottomColorID': BottomColorID, 'OAN': OAN, 'Quantity': Quantity, 'Brand': Brand, 'Denomination': Denomination,
            'SecurityDtTm': SecurityDtTm, 'MakeID': MakeID, 'Finish': Finish, 'Caliber': Caliber, 'Handle': Handle, 'BarrelLength': BarrelLength, 'Style': Style, 'ManufactureYear': ManufactureYear,
            'IsAuto': IsAuto, 'Comments': Comments, 'RegistrationStateID': RegistrationStateID, 'RegistrationNumber': RegistrationNumber, 'Length': Length, 'HIN': HIN, 'PropulusionID': PropulusionID,
            'RegistrationExpiryDtTm': RegistrationExpiryDtTm, 'AgencyID': loginAgencyID,

            // Not in Search Api but use in search consolidation 
            'TransactionNo': TransactionNo, 'DispositionID': DispositionID, 'SuspectedDrugTypeID': SuspectedDrugTypeID, 'EstimatedDrugQty': EstimatedDrugQty, 'FractionDrugQty': FractionDrugQty,

            // column not exist in property consolidataion
            'IncidentNumber': IncidentNumber, 'PropertyNumber': PropertyNumber,
            'PropertyCategoryCode': PropertyCategoryCode, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName,
        }
        // console.log(val)
        if (hasValues(val)) {
            fetchPostData("Property/Search_Property", val).then((data) => {
                if (data.length > 0) {
                    setPropertySearchData(data);
                    setPropertySecondaryData(data);
                } else {
                    setPropertySearchData([]);
                    setPropertySecondaryData([])
                    toastifyError("Data Not Available")
                }
            })
        } else {
            toastifyError("Search Fields Should Not Empty");
        }
    }

    function hasValues(obj) {
        for (let key in obj) {
            if (key != 'AgencyID' && key != 'ConMerge') {
                if (obj[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    const consoledateProperty = async () => {
        const { strCategory, PrimaryKeyID } = conValues

        for (let i = 0; i < secondaryPropertySelect?.length; i++) {
            const val = {
                "SecondaryNameID": secondaryPropertySelect[i], "PrimaryKeyID": PrimaryKeyID, 'strCategory': strCategory, "intPINID": loginPinID, "intAgencyID": parseInt(loginAgencyID), "ComputerName": 'Admin0001',
            }
            const res = await AddDeleteUpadate('Consolidation/PropertyConsolidation', val)
            if (res?.success) {
                const parceData = JSON.parse(res?.data)
                toastifySuccess(parceData?.Table[0]?.Message);
            } else {
                console.log(res?.Message)
            }

        }
    }

    useEffect(() => {
        if (value.PropertyCategoryCode) ResetFields_On_Change(value.PropertyCategoryCode);
    }, [value.PropertyCategoryCode])

    const ResetFields_On_Change = (Code) => {
        setStatesChangeStatus(true)
        //Boat 
        if (Code !== 'B') {
            setValue({
                ...value,
                'BoatIDNumber': '', 'ManufactureYear': '', 'Length': '', 'RegistrationStateID': '', 'RegistrationNumber': '', 'VODID': null, 'MaterialID': null,
                'MakeID': '', 'ModelID': '', 'Comments': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'BottomColorID': '', 'TopColorID': '',
            });
        }
        //Article
        if (Code !== 'A') {
            setValue({
                ...value,
                'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '',
            })
        }
        //Other
        if (Code !== 'O') {
            setValue({
                ...value,
                'OtherID': null, 'Brand': '', 'SerialID': '', 'BottomColorID': '', 'ModelID': '', 'Quantity': '',
            })
        }
        //Security
        if (Code !== 'S') {
            setValue({
                ...value,
                'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null, 'SecurityDtTm': '', 'SerialID': '',
            })
        }
        //Weapon
        if (Code !== 'G') {
            setValue({
                ...value,
                'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'SerialID': '', 'MakeID': '', 'WeaponModelID': null, 'IsAuto': '', 'ManufactureYear': '',
                'BarrelLength': '',
            })
        }
    }


    const onChangeTranSationNo = (e) => {
        if (e.target.value.trim() !== '' && e.target.value !== ' ') {
            setStatesChangeStatus(true);
        }
        if (e.target.name === 'TransactionNo') {
            let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
            if (ele.length === 8) {
                const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                const match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Reset = () => {
        setStatesChangeStatus(false)

        setValue({
            ...value,
            'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': null, 'WeaponModelID': null, 'ReportedDtTmTo': null, 'MaterialID': null, 'VODID': null, 'MeasureTypeID': null, 'ConMerge': 'Con',
            'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'Denomination': '', 'IssuingAgency': '', 'MeasurementTypeID': '',
            'SecurityDtTm': '', 'MakeID': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'BarrelLength': '', 'Style': '', 'ManufactureYear': '', 'IsAuto': '', 'Comments': '',
            'RegistrationStateID': '', 'RegistrationNumber': '', 'Length': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '',

            // Not in Search Api but use in search consolidation 
            'TransactionNo': '', 'DispositionID': '', 'SuspectedDrugTypeID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '',

            // column not exist in property consolidataion search
            'IncidentNumber': null, 'PropertyNumber': null,
            'PropertyCategoryCode': null, 'LastName': null, 'FirstName': null, 'MiddleName': null,
        });
        setConValues({
            ...conValues,
            "SecondaryNameID": '', "PrimaryKeyID": '', 'strCategory': '',
        });
        setPropertySearchData([]); setPrimaryPropertySelect(); setSecondaryPropertySelect([]); setSelectionLocked(false); handleClearRows(); setPropertySecondaryData([]);
    }

    const HandleChanges = (e) => {
        setStatesChangeStatus(true)

        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else if (e.target.name === 'ManufactureYear' || e.target.name === 'EstimatedDrugQty') {
            let ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/[^0-9.]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: cleaned
                });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
        }
        else if (e.target.name === 'Value') {
            const ele = e.target.value.replace(/[^0-9]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)

        if (e) {
            if (name === 'PropertyTypeID') {
                switch (e.id) {
                    case 'A': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); break;
                    case 'B': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); break;
                    case 'S': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); break;
                    case 'O': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); break;
                    case 'D': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); break;
                    case 'G': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); break;
                    default: dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
                }
                // setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['LossCodeID']: '', });
                setValue({
                    ...value,
                    'PropertyTypeID': e.value, 'LossCodeID': null, 'ReportedDtTm': null, 'WeaponModelID': null, 'ReportedDtTmTo': null, 'MaterialID': null, 'VODID': null, 'MeasureTypeID': null, 'ConMerge': 'Con',
                    'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'Denomination': '', 'IssuingAgency': '', 'MeasurementTypeID': '',
                    'SecurityDtTm': '', 'MakeID': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'BarrelLength': '', 'Style': '', 'ManufactureYear': '', 'IsAuto': '', 'Comments': '',
                    'RegistrationStateID': '', 'RegistrationNumber': '', 'Length': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '',

                    // Not in Search Api but use in search consolidation 
                    'TransactionNo': '', 'DispositionID': '', 'SuspectedDrugTypeID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '',

                    // column not exist in property consolidataion search
                    'IncidentNumber': null, 'PropertyNumber': null,
                    'PropertyCategoryCode': e.id, 'LastName': null, 'FirstName': null, 'MiddleName': null,
                });
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'PropertyTypeID') {
                setValue({ ...value, ['PropertyCategoryCode']: '', ['PropertyTypeID']: '', ['LossCodeID']: '', });
                dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
                return;
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }


    const handleCheckboxChange = ({ selectedRows }) => {
        if (selectedRows?.length > 0) {
            setPrimaryPropertySelect(selectedRows)
            setConValues({ ...conValues, "PrimaryKeyID": selectedRows[0]?.MasterPropertyID, 'strCategory': selectedRows[0]?.Category_Description });
            setSelectionLocked(true);
            const res = propertySearchData?.filter((item) => item?.Category_Description === selectedRows[0]?.Category_Description);
            setPropertySecondaryData(res);
        } else {
            setPrimaryPropertySelect(selectedRows)
            setConValues({ ...conValues, "PrimaryKeyID": '', "strCategory": '', });
            setSelectionLocked(false);
            setPropertySecondaryData([]);
        }
    }

    const handleSecondaryCheckboxChange = ({ selectedRows }) => {
        const ids = []
        selectedRows.forEach(({ MasterPropertyID }) => ids.push(MasterPropertyID))

        if (selectedRows.length > 0) {
            setSecondaryPropertySelect(ids)
        } else {
            setSecondaryPropertySelect(ids)
        }
    }

    const handleClearRows = () => {
        setToggleClear(!toggleClear);
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
        }
    };

    const columns = [
        {
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        {
            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            name: 'Owner',
            selector: (row) => row.OwnerName,
            sortable: true
        },

    ]

    return (
        <div className=" section-body pt-3 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency ">
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-10px' }}>
                                    <div className="col-12 ">
                                        <fieldset>
                                            <legend>Property Consolidation</legend>
                                            <div className="row">
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Property Type</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3 mt-2 ">
                                                    <Select
                                                        styles={colourStyles}
                                                        name='PropertyTypeID'
                                                        value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                        options={propertyTypeData}
                                                        onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        isDisabled={sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ? true : false}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Property Reason</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-4 mt-2">
                                                    <Select
                                                        name='LossCodeID'
                                                        styles={colourStyles}
                                                        value={propertyLossCodeDrpData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                        options={propertyLossCodeDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-3">
                                                    <label htmlFor="" className='new-label'>Transaction No.</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 text-field ">
                                                    <input type="text" value={value?.TransactionNo} maxLength={9} name='TransactionNo' id='TransactionNo' onChange={onChangeTranSationNo} className='' required />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Disposition</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-4 mt-2">
                                                    <Select
                                                        name='DispositionID'
                                                        styles={colourStyles}
                                                        value={dispositionsDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                                                        options={dispositionsDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reported From Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  ">
                                                    <DatePicker
                                                        id='ReportedDtTm'
                                                        name='ReportedDtTm'
                                                        ref={startRef}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        className=''
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete='Off'
                                                        showYearDropdown
                                                        isClearable={value?.ReportedDtTm ? true : false}
                                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                        maxDate={new Date()}
                                                        placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reported To Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-4">
                                                    <DatePicker
                                                        id='ReportedDtTmTo'
                                                        name='ReportedDtTmTo'
                                                        ref={startRef1}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        className=''
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete='Off'
                                                        showYearDropdown
                                                        disabled={value?.ReportedDtTm ? false : true}
                                                        isClearable={value?.ReportedDtTmTo ? true : false}
                                                        selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                        maxDate={new Date()}
                                                        minDate={new Date(value?.ReportedDtTm)}
                                                        placeholderText={'Select...'}
                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                        {/* ARTICLE   */}
                                        {
                                            value.PropertyCategoryCode === 'A' ?
                                                <div className="col-12 col-md-12 col-lg-12 mt-1 p-0" >
                                                    <fieldset>
                                                        <legend>Article</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3 text-field mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                                <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Top Color</label>

                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  px-0 mt-2 ">
                                                                <label htmlFor="" className='new-label'>Bottom Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>OAN</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-1 text-field">
                                                                <input type="text" name='OAN' id='OAN' maxLength={20} value={value?.OAN} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Quantity</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4  mt-1 text-field">
                                                                <input type="text" name='Quantity' id='Quantity' maxLength={20} value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Brand</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-1 text-field">
                                                                <input type="text" name='Brand' id='Brand' maxLength={20} value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Others */}
                                        {
                                            value.PropertyCategoryCode === 'O' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Other</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Brand</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Top Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 px-0  mt-2">
                                                                <label htmlFor="" className='new-label'>Bottom Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Quantity</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Security */}
                                        {
                                            value.PropertyCategoryCode === 'S' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Security</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Denomination</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='Denomination' maxLength={16} id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Issuing Agency</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='IssuingAgency' id='IssuingAgency' value={value?.IssuingAgency} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Measure Type</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='MeasureTypeID'
                                                                    value={measureTypeDrpData?.filter((obj) => obj.value === value?.MeasureTypeID)}
                                                                    styles={value?.Denomination ? colourStyles : customStylesWithOutColor}
                                                                    options={measureTypeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'MeasureTypeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Security Date</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                                <DatePicker
                                                                    id='SecurityDtTm'
                                                                    name='SecurityDtTm'
                                                                    ref={startRef1}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/dd/yyyy"
                                                                    isClearable={value?.SecurityDtTm ? true : false}
                                                                    selected={value?.SecurityDtTm && new Date(value?.SecurityDtTm)}
                                                                    placeholderText={value?.SecurityDtTm ? value.SecurityDtTm : 'Select...'}
                                                                    timeIntervals={1}
                                                                    autoComplete="Off"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Weapon */}
                                        {
                                            value.PropertyCategoryCode === 'G' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Weapon</legend>
                                                        <div className="row">

                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Make</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2   mt-1">
                                                                <Select
                                                                    name='MakeID'
                                                                    value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={weaponMakeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Finish</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='Finish' id='Finish' value={value?.Finish} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Caliber</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='Caliber' maxLength={10} id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Model</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2   mt-1">
                                                                <Select
                                                                    name='WeaponModelID'
                                                                    styles={customStylesWithOutColor}
                                                                    value={weaponModelDrpData?.filter((obj) => obj.value === value?.WeaponModelID)}
                                                                    isClearable
                                                                    options={weaponModelDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'WeaponModelID')}
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Handle</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='Handle' id='Handle' value={value?.Handle} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Barrel Length</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' maxLength={10} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Style</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='Style' id='Style' value={value?.Style} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>OAN No.</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='OAN' id='OAN' value={value?.OAN} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Manufacture Year</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                                <DatePicker
                                                                    name='ManufactureYear'
                                                                    id='ManufactureYear'
                                                                    selected={weaponfactureDate}
                                                                    onChange={(date) => { setWeaponfactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={9}
                                                                    ref={startRef4}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-4 col-lg-3 mt-2">
                                                                <div className="form-check ">
                                                                    <input className="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" checked={value?.IsAuto} />
                                                                    <label className="form-check-label" name='IsAuto' id='IsAuto' value={value?.IsAuto} onChange={HandleChanges} htmlFor="flexCheckDefault">
                                                                        Auto
                                                                    </label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        {/* Boat */}
                                        {
                                            value.PropertyCategoryCode === 'B' ?
                                                <div className="col-12 col-md-12 col-lg-12 p-0" >
                                                    <fieldset>
                                                        <legend>Boat</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Reg. State & No.</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                                                                <Select
                                                                    name='RegistrationStateID'
                                                                    styles={colourStyles}
                                                                    value={stateDrpData?.filter((obj) => obj.value === value?.RegistrationStateID)}
                                                                    options={stateDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} maxLength={10} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <Link to={'/ListManagement?page=Boat%20VOD&call=/Prop-Home'} className='new-link'>
                                                                    VOD
                                                                </Link>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='VODID'
                                                                    value={vodDrpData?.filter((obj) => obj.value === value?.VODID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={vodDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'VODID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Length</label>
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1 ">
                                                                <input type="text" name='Length' id='Length' maxLength={9} value={value?.Length} onChange={HandleChanges} className='' required />
                                                            </div>


                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>HIN</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 text-field  mt-1">
                                                                <input type="text" name='HIN' value={value?.HIN} maxLength={20} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Make</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='MakeID'
                                                                    value={makeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={makeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <Link to={'/ListManagement?page=Property%20Boat%20OH%20Material&call=/Prop-Home'} className='new-link'>
                                                                    Material
                                                                </Link>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='MaterialID'
                                                                    value={materialDrpData?.filter((obj) => obj.value === value?.MaterialID)}
                                                                    options={materialDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'MaterialID')}
                                                                    isClearable
                                                                    placeholder="Select..."

                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2   mt-2">
                                                                <label htmlFor="" className='new-label'>Manu. Year</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1 ">
                                                                <DatePicker
                                                                    name='ManufactureYear'
                                                                    id='ManufactureYear'
                                                                    selected={manufactureDate}
                                                                    onChange={(date) => { setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={9}
                                                                    ref={startRef2}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Reg. Expiry</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2">
                                                                <DatePicker
                                                                    id='RegistrationExpiryDtTm'
                                                                    name='RegistrationExpiryDtTm'
                                                                    ref={startRef1}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setValue({ ...value, ['RegistrationExpiryDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/yyyy"
                                                                    timeInputLabel
                                                                    isClearable={value?.RegistrationExpiryDtTm ? true : false}
                                                                    selected={value?.RegistrationExpiryDtTm && new Date(value?.RegistrationExpiryDtTm)}
                                                                    placeholderText={value?.RegistrationExpiryDtTm ? value.RegistrationExpiryDtTm : 'Select...'}
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    showMonthYearPicker
                                                                    dropdownMode="select"
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <Link to={'/ListManagement?page=Property%20Boat%20Propulsion&call=/Prop-Home'} className='new-link'>
                                                                    Propulsion
                                                                </Link>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='PropulusionID'
                                                                    value={propulusionDrpData?.filter((obj) => obj.value === value?.PropulusionID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={propulusionDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='ModelID'
                                                                    value={boatModelDrpData?.filter((obj) => obj.value === value?.ModelID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={boatModelDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>OAN No.</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 text-field  mt-1">
                                                                <input type="text" name='OAN' value={value?.OAN} maxLength={20} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Top Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1 px-0 mt-2">
                                                                <label htmlFor="" className='new-label'>Bottom Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Comments</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-10  mt-1">
                                                                <textarea name='Comments' id="Comments" value={value?.Comments} onChange={HandleChanges} cols="30" rows='1' className="form-control" >
                                                                </textarea>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        {/* drug */}
                                        {
                                            value.PropertyCategoryCode === 'D' ?
                                                <div className="col-12 col-md-12 pt-2 p-0" >
                                                    <fieldset >
                                                        <legend>Drug</legend>
                                                        <div className="row mt-2">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Suspected Drug Type</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-1">
                                                                <Select
                                                                    name='SuspectedDrugTypeID'
                                                                    value={suspectedDrugDrpData?.filter((obj) => obj.value === value?.SuspectedDrugTypeID)}
                                                                    options={suspectedDrugDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'SuspectedDrugTypeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-2">
                                                                <label htmlFor="" className='new-label'>Measurement Type</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4  mt-1">
                                                                <Select
                                                                    name='MeasurementTypeID'
                                                                    value={measureTypeDrpData?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                                                                    options={measureTypeDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'MeasurementTypeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Estimated Drug Qty</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                                                                <input type="text" maxLength={9} name='EstimatedDrugQty' id='EstimatedDrugQty' value={value?.EstimatedDrugQty} onChange={HandleChanges} className='' required autoComplete='off' />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3  mt-2">
                                                                <label htmlFor="" className='new-label'>Fraction Drug Qty</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 mt-1 text-field">
                                                                <input type="text" maxLength={9} name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='' required autoComplete='off' />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 ">
                                        <div className="row mt-2 cc" >
                                            <div className="col-1"></div>
                                            <div className="form-check col-2 ml-lg-5 pl-lg-5" style={{ fontSize: '14px' }}>
                                                <input className="form-check-input" value={'Con'} checked={value?.ConMerge === 'Con'} onChange={HandleChanges} type="radio" name="ConMerge" id="flexRadioDefault3" />
                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                    Consolidate
                                                </label>
                                            </div>
                                            <div className="form-check col-5" style={{ fontSize: '14px' }}>
                                                <input className="form-check-input" value={'Merge'} checked={value?.ConMerge === 'Merge'} onChange={HandleChanges} type="radio" name="ConMerge" id="flexRadioDefault4" />
                                                <label className="form-check-label" htmlFor="ConMerge">
                                                    Merge Events
                                                </label>
                                            </div>
                                            <div className="col-3 text-right p-0 mb-1" >
                                                <button type="button" disabled={!statesChangeStatus} onClick={getPropertySearch} className="btn btn-sm btn-success  mr-1" >Search</button>
                                                <button type="button" onClick={Reset} className="btn btn-sm btn-success  mr-1" >Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <fieldset className='mt-2 mb-1'>
                                    <legend>Primary Property</legend>
                                    <div className="col-12 mt-1 pt-1 px-0">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={propertySearchData?.length > 0 ? propertySearchData : []}
                                            pagination
                                            highlightOnHover
                                            fixedHeaderScrollHeight='150px'
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            selectableRows
                                            selectableRowsHighlight
                                            onSelectedRowsChange={handleCheckboxChange}
                                            clearSelectedRows={toggleClear}
                                            selectableRowDisabled={(row) => selectionLocked && !primaryPropertySelect.includes(row)}
                                            headerCheckboxAll={false}
                                        />
                                    </div>
                                </fieldset>
                                <fieldset className='mt-2 mb-1'>
                                    <legend>Secondary Property</legend>
                                    <div className="col-12 mt-1 pt-1 px-0">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={propertySecondaryData?.length > 0 ? propertySecondaryData : []}
                                            pagination
                                            highlightOnHover
                                            fixedHeaderScrollHeight='150px'
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            selectableRowsHighlight
                                            selectableRows
                                            onSelectedRowsChange={handleSecondaryCheckboxChange}
                                            clearSelectedRows={toggleClear}
                                        />
                                    </div>
                                </fieldset>
                                <div className="col-12 field-button" style={{ position: 'absolute', bottom: '5px', textAlign: 'right' }} >
                                    <button type="button" disabled={primaryPropertySelect?.length < 1 || secondaryPropertySelect?.length < 1 || value?.ConMerge != 'Con'} onClick={consoledateProperty} className="btn btn-sm btn-success  mr-1" >Consolidate</button>
                                    <button type="button" disabled={primaryPropertySelect?.length < 1 || secondaryPropertySelect?.length < 1 || value?.ConMerge != 'Merge'} className="btn btn-sm btn-success  mr-4" >Merge Events</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyConsolidation