import { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear, getYearWithOutDateTime, tableCustomStyles } from '../../../Common/Utility';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { get_IsPrimary_Color_Drp_Data, get_MakeId_Drp_Data, get_ModalId_Drp_Data, get_State_Drp_Data, get_StyleId_Drp_Data, get_VehicleLossCode_Drp_Data, get_Vehicle_Color_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';

const VehicleConsolidation = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const makeIdDrp = useSelector((state) => state.DropDown.makeIdDrpData);
    const modalIdDrp = useSelector((state) => state.DropDown.modalIdDrpData);
    const styleIdDrp = useSelector((state) => state.DropDown.styleIdDrpData);
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const isPrimaryDrpData = useSelector((state) => state.DropDown.isPrimaryDrpData);
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const vehicleColorDrpData = useSelector((state) => state.DropDown.vehicleColorDrpData);

    const [manufactureDate, setManufactureDate] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [vehicleSearchData, setVehicleSearchData] = useState([]);
    const [toggleClear, setToggleClear] = useState(false);
    const [primaryPropertySelect, setPrimaryPropertySelect] = useState([]);
    const [selectionLocked, setSelectionLocked] = useState(false);
    const [secondaryPropertySelect, setSecondaryPropertySelect] = useState([]);
    const [propertySecondaryData, setPropertySecondaryData] = useState([]);
    const [loginPinID, setLoginPinID] = useState();
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);


    const [value, setValue] = useState({
        'LossCodeID': null, 'ReportedDtTm': null, 'ReportedDtTmTo': null, 'CategoryID': null, 'AgencyID': '', 'ConMerge': 'Con',
        //not in api
        'PlateID': null, 'VIN': '', 'MakeID': null, 'ModelID': null, 'StyleID': null, 'ManufactureYear': '',
        //not in use but in api
        'VehicleNo': '', 'PlateTypeID': '', 'VehicleNumber': null, 'IncidentNumber': null, 'LastName': null, 'FirstName': null, 'MiddleName': null,
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
            PropertyType(loginAgencyID);
            if (makeIdDrp?.length === 0) { dispatch(get_MakeId_Drp_Data(loginAgencyID)) };
            if (modalIdDrp?.length === 0) { dispatch(get_ModalId_Drp_Data(loginAgencyID)) };
            if (styleIdDrp?.length === 0) { dispatch(get_StyleId_Drp_Data(loginAgencyID)) };
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
            if (isPrimaryDrpData?.length === 0) { dispatch(get_IsPrimary_Color_Drp_Data(loginAgencyID)) };
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (vehicleColorDrpData?.length === 0) { dispatch(get_Vehicle_Color_Drp_Data(loginAgencyID)) };
        }
    }, [loginAgencyID])

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

    const get_Vehicle_Search = async () => {
        const {
            LossCodeID, ReportedDtTm, ReportedDtTmTo, CategoryID, ConMerge,
            //not in api
            PlateID, VIN, MakeID, ModelID, StyleID, ManufactureYear,
            //not in use but in api
            VehicleNo, PlateTypeID, VehicleNumber, IncidentNumber, LastName, FirstName, MiddleName,
        } = value;
        const val = {
            'LossCodeID': LossCodeID, 'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo, 'CategoryID': CategoryID, 'AgencyID': parseInt(loginAgencyID), 'ConMerge': ConMerge,
            //not in api
            'PlateID': PlateID, 'VIN': VIN, 'MakeID': MakeID, 'ModelID': ModelID, 'StyleID': StyleID, 'ManufactureYear': ManufactureYear,
            //not in use but in api
            'VehicleNo': VehicleNo, 'PlateTypeID': PlateTypeID, 'VehicleNumber': VehicleNumber, 'IncidentNumber': IncidentNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName,
        };
        if (hasValues(val)) {
            fetchPostData("PropertyVehicle/Search_PropertyVehicle", val).then((res) => {
                if (res.length > 0) {
                    setVehicleSearchData(res);
                } else {
                    setVehicleSearchData([]);
                    toastifyError("Data Not Available");
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
        const { PrimaryKeyID, strCategory, } = conValues
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

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value))
                setValue({ ...value, ['MakeID']: e.value });
            }
            setValue({
                ...value,
                [name]: e.value
            });
        } else if (e === null) {
            if (name === 'MakeID') {
                setValue({ ...value, ['MakeID']: '', ['ModelID']: '' });
                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''))

            }
            setValue({ ...value, [name]: null });
        } else {
            setValue({ ...value, [name]: null });
        }
    }



    const HandleChanges = (e) => {
        if (e.target.value.trim() !== '') {
            setStatesChangeStatus(true);
        }
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const Reset = () => {
        setStatesChangeStatus(false)
        setValue({
            ...value,
            'LossCodeID': null, 'ReportedDtTm': null, 'ReportedDtTmTo': null, 'CategoryID': null, 'ConMerge': 'Con', 'ManufactureYear': '',
            //not in api
            'PlateID': null, 'VIN': '', 'MakeID': null, 'ModelID': null, 'StyleID': null, 'ManufactureYear': '',
            //not in use but in api
            'VehicleNo': '', 'PlateTypeID': '', 'VehicleNumber': null, 'IncidentNumber': null, 'LastName': null, 'FirstName': null, 'MiddleName': null,
        });
        setConValues({
            ...conValues,
            "SecondaryNameID": '', "PrimaryKeyID": '', 'strCategory': '',
        });
        setVehicleSearchData([]); setPrimaryPropertySelect(); setSecondaryPropertySelect([]); setSelectionLocked(false); handleClearRows(); setPropertySecondaryData([]);
    }

    const handleClearRows = () => {
        setToggleClear(!toggleClear);
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base, height: 20, minHeight: 35,
            fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };

    const columns = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'Category ',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            name: 'Classification ',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            name: 'Owner',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            name: 'VIN',
            selector: (row) => row.VIN,
            sortable: true
        },
    ]

    const handleCheckboxChange = ({ selectedRows }) => {
        if (selectedRows?.length > 0) {
            setPrimaryPropertySelect(selectedRows)
            setConValues({ ...conValues, "PrimaryKeyID": selectedRows[0]?.MasterPropertyID, 'strCategory': selectedRows[0]?.Category_Description });
            setSelectionLocked(true);

            const res = vehicleSearchData?.filter((item) => item?.MasterPropertyID !== selectedRows[0]?.MasterPropertyID);
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

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  name-card">
                            <div className="card-body">
                                <div className="row " style={{ marginTop: '-10px' }}>
                                    <div className="col-12 ">
                                        <fieldset>
                                            <legend>Vehicle Consolidation</legend>
                                            <div className="row" >
                                                <div className="col-3 col-md-3 col-lg-1  mt-2 pt-1">
                                                    <label htmlFor="" className='new-label'>Reason</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3 mt-2">
                                                    <Select
                                                        name='LossCodeID'
                                                        value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                        onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                        options={propertyLossCodeData}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reported From Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2">
                                                    <DatePicker
                                                        id="ReportedDtTm"
                                                        name="ReportedDtTm"
                                                        onChange={(date) => {
                                                            if (date) {
                                                                setValue({
                                                                    ...value, ['ReportedDtTm']: getShowingMonthDateYear(date), ['ReportedDtTmTo']: null,
                                                                });
                                                            } else {
                                                                setValue({ ...value, ['ReportedDtTm']: null, ['ReportedDtTmTo']: null, });
                                                            }
                                                        }}
                                                        className=""
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete="Off"
                                                        showYearDropdown
                                                        isClearable={value?.ReportedDtTm ? true : false}
                                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                        maxDate={new Date()}
                                                        placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                    />
                                                </div>

                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                    <label htmlFor="" className="new-label">Reported To Date</label>
                                                </div>

                                                <div className="col-3 col-md-3 col-lg-2">
                                                    <DatePicker
                                                        id="ReportedDtTmTo"
                                                        name="ReportedDtTmTo"
                                                        onChange={(date) => {
                                                            setValue({
                                                                ...value,
                                                                ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null,
                                                            });
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete="Off"
                                                        showYearDropdown
                                                        className={!value?.ReportedDtTm ? 'readonlyColor' : ''}
                                                        disabled={value?.ReportedDtTm ? false : true}
                                                        isClearable={value?.ReportedDtTmTo ? true : false}
                                                        selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                        maxDate={new Date()}
                                                        minDate={new Date(value?.ReportedDtTm)}
                                                        placeholderText={'Select...'}
                                                    />
                                                </div>

                                                <div className="col-3 col-md-3 col-lg-1  mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Plate&nbsp;State&nbsp;&&nbsp;No.</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2  mt-1 ">
                                                    <Select
                                                        name='PlateID'
                                                        value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                                                        onChange={(e) => ChangeDropDown(e, 'PlateID')}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                        options={stateList}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                    <input type="text" name='VehicleNo' id='VehicleNo' onChange={HandleChanges} maxLength={8} value={value?.VehicleNo} className='' required />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                                                    <label htmlFor="" className='new-label '>VIN</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                    <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label '>Category</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                                                    <Select
                                                        name='CategoryID'
                                                        value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                        onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                        options={categoryIdDrp}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                                                    <label htmlFor="" className='new-label '>Make</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                                    <Select
                                                        name='MakeID'
                                                        value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                                                        styles={customStylesWithOutColor}
                                                        options={makeIdDrp}
                                                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label '>Model</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                                                    <Select
                                                        name='ModelID'
                                                        value={modalIdDrp?.filter((obj) => obj.value === value?.ModelID)}
                                                        styles={customStylesWithOutColor}
                                                        options={modalIdDrp}
                                                        onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                        isDisabled={value?.MakeID ? false : true}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label '>Style</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                                                    <Select
                                                        name='StyleID'
                                                        onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                                        value={styleIdDrp?.filter((obj) => obj.value === value?.StyleID)}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                        options={styleIdDrp}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                                                    <label htmlFor="" className='new-label '>Color</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                                    <Select
                                                        name='Color'
                                                        onChange={(e) => ChangeDropDown(e, 'Color')}
                                                        value={vehicleColorDrpData?.filter((obj) => obj.value === value?.Color)}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                        options={vehicleColorDrpData}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2   mt-2">
                                                    <label htmlFor="" className='new-label'>Manu. Year</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 ">
                                                    <DatePicker
                                                        name='ManufactureYear'
                                                        id='ManufactureYear'
                                                        selected={manufactureDate}
                                                        onChange={(date) => { setStatesChangeStatus(true); setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                        showYearPicker
                                                        dateFormat="yyyy"
                                                        yearItemNumber={8}
                                                        autoComplete="off"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        maxDate={new Date()}
                                                        minDate={new Date(1900, 0, 1)}
                                                    />


                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="row">
                                            <div className="col-12 col-md-12 col-lg-12 ">
                                                <div className="row mt-2 cc" >
                                                    <div className="col-1"></div>
                                                    <div className="form-check col-2" style={{ fontSize: '14px' }}>
                                                        <input className="form-check-input" value={'Con'} checked={value?.ConMerge === 'Con'} onChange={HandleChanges} type="radio" name="ConMerge" id="flexRadioDefault3" />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                            Consolidate
                                                        </label>
                                                    </div>
                                                    <div className="form-check col-6" style={{ fontSize: '14px' }}>
                                                        <input className="form-check-input" value={'Merge'} checked={value?.ConMerge === 'Merge'} onChange={HandleChanges} type="radio" name="ConMerge" id="flexRadioDefault4" />
                                                        <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                            Merge Events
                                                        </label>
                                                    </div>
                                                    <div className="col-3 text-right p-0 mb-1" >
                                                        <button type="button" disabled={!statesChangeStatus} onClick={get_Vehicle_Search} className="btn btn-sm btn-success  mr-1" >Search</button>
                                                        <button type="button" onClick={Reset} className="btn btn-sm btn-success  mr-1" >Clear</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <fieldset className='mt-2 mb-1'>
                                            <legend>Primary Vehicle</legend>
                                            <div className="col-12 mt-1 pt-1 px-0">
                                                <DataTable
                                                    dense
                                                    columns={columns}
                                                    data={vehicleSearchData?.length > 0 ? vehicleSearchData : []}
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
                                            <legend>Secondary Vehicle</legend>
                                            <div className="col-12 mt-1 pt-1 px-0">
                                                <DataTable
                                                    dense
                                                    columns={columns}
                                                    data={propertySecondaryData?.length > 0 ? propertySecondaryData : vehicleSearchData?.length > 0 ? vehicleSearchData : []}
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
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 field-button" style={{ position: 'absolute', bottom: '5px', textAlign: 'right' }} >
                                <button type="button" onClick={consoledateProperty} disabled={primaryPropertySelect?.length < 1 || secondaryPropertySelect?.length < 1 || value?.ConMerge != 'Con'} className="btn btn-sm btn-success  mr-1" >Consolidate</button>
                                <button type="button" disabled={primaryPropertySelect?.length < 1 || secondaryPropertySelect?.length < 1 || value?.ConMerge != 'Merge'} className="btn btn-sm btn-success  mr-2" >Merge Events</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VehicleConsolidation