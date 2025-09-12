import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, stringToBase64 } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { PropertySearch_Modal_Status, Property_Search_Data } from '../../../redux/actionTypes';
import { fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { get_Masters_Name_Drp_Data, get_PropertyLossCode_Drp_Data } from '../../../redux/actions/DropDownsData';
import { useNavigate } from 'react-router-dom';

const PropertySearchTab = (props) => {

    const { get_PropertyArticle_Single_Data, get_PropertyBoat_Single_Data, get_PropertOther_Single_Data, get_PropertySecurity_Single_Data, get_PropertyWeapon_Single_Data, searchModalState, setSearchModalState = () => { }, mainIncidentID, value, setValue, loginPinID, loginAgencyID, MstPage, setPropertOther, setPropertyBoat, setPropertyWeapon, setPropertySecurity, setPropertyArticle, setLossCode, PropertyCategory, PropertyClassification, setPropertyNumber, get_Data_Drug_Modal, setDrugData, setChangesStatus, setStatesChangeStatus, setPossessionID, isCad = false, get_Name_MultiImage } = props

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const propertySearchType = useSelector((state) => state.Property.propertySearchType);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    const propertySearchData = useSelector((state) => state.Property.propertySearchData);
    const propertySearchModalStatus = useSelector((state) => state.Property.propertySearchModalStatus);
    const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);

    const [editval, setEditValue] = useState([]);

    // const useQuery = () => {
    //     const params = new URLSearchParams(useLocation().search);
    //     return {
    //         get: (param) => params.get(param)
    //     };
    // };

    // let DecPropID = 0, DecMPropID = 0
    // const query = useQuery();
    // var ProId = query?.get("ProId");
    // var MProId = query?.get('MProId');
    // var ProSta = query?.get('ProSta');

    const ArticleCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        // {
        //     width: '150px',

        //     name: 'Incident Number',
        //     selector: (row) => <>{row?.IncidentNumber} </>,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Brand',
            selector: (row) => row.Brand,
            sortable: true
        },
        {
            width: '150px',

            name: 'Model',
            selector: (row) => row.ModelID,
            sortable: true
        },
        {
            width: '150px',

            name: 'Serial',
            selector: (row) => row.SerialID,
            sortable: true
        },
        // {
        //     name: 'Reported Date/Time',
        //     selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : '',
        //     sortable: true
        // },
        // {
        //     name: 'Property Value',
        //     selector: (row) => row.PropertyValue,
        //     sortable: true
        // },
        // {
        //     name: 'Owner',
        //     selector: (row) => row.Owner_Description,
        //     sortable: true
        // },
        // {
        //     name: 'Brand',
        //     selector: (row) => row.Brand,
        //     sortable: true
        // },

        // {
        //     name: 'Misc Description',
        //     selector: (row) => row.Misc_Description,
        //     sortable: true
        // },
        // {
        //     name: 'Destroy Date/Time',
        //     selector: (row) => row.DestroyDate ? getShowingDateText(row.DestroyDate) : '',
        //     sortable: true
        // },
        // {
        //     name: 'Is Recovered',
        //     selector: (row) => row.IsRecovered,
        //     sortable: true
        // },

    ]

    const BoatCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Incident Number',
            selector: (row) => <>{row?.IncidentNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },

        {
            width: '150px',

            name: 'Boat ID',
            selector: (row) => <>{row?.BoatIDNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },
        // {
        //     name: 'Comments',
        //     selector: (row) => row.Comments,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Registration State Name',
            selector: (row) => row.RegNumber,
            sortable: true
        },
        // {
        //     name: 'Registration Number',
        //     selector: (row) => row.RegistrationNumber,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'HIN',
            selector: (row) => row.HIN,
            sortable: true
        },
        {
            width: '150px',

            name: 'Make',
            selector: (row) => row.Make_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Model',
            selector: (row) => row.Model_Description,
            sortable: true
        },
        // {
        //     name: 'Manufacture Year',
        //     selector: (row) => row.ManufactureYear,
        //     sortable: true
        // },
        // {
        //     name: 'Make_Description',
        //     selector: (row) => row.Make_Description,
        //     sortable: true
        // },
        // {
        //     name: 'Model_Description',
        //     selector: (row) => row.Model_Description,
        //     sortable: true
        // },
        // {
        //     name: 'Length',
        //     selector: (row) => row.Length,
        //     sortable: true
        // },

    ]

    const OtherCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Incident Number',
            selector: (row) => <>{row?.IncidentNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Serial ID',
            selector: (row) => <>{row?.SerialID} </>,
            sortable: true
        },
        // {
        //     name: 'Quantity',
        //     selector: (row) => <>{row?.Quantity} </>,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Model ID',
            selector: (row) => <>{row?.ModelID} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Brand',
            selector: (row) => <>{row?.Brand} </>,
            sortable: true
        },
        // {
        //     name: 'TopColor_Description',
        //     selector: (row) => <>{row?.TopColor_Description} </>,
        //     sortable: true
        // },
        // {
        //     name: 'BottomColor_Description',
        //     selector: (row) => <>{row?.BottomColor_Description} </>,
        //     sortable: true
        // },

    ]

    const WeaponCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Incident Number',
            selector: (row) => <>{row?.IncidentNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'BarrelLength',
            selector: (row) => <>{row?.BarrelLength} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Caliber',
            selector: (row) => <>{row?.Caliber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Serial ID',
            selector: (row) => <>{row?.SerialID} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Make',
            selector: (row) => <>{row?.Make} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Model',
            selector: (row) => <>{row?.Model} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Style',
            selector: (row) => <>{row?.Style} </>,
            sortable: true
        },
        // {
        //     name: 'Finish',
        //     selector: (row) => <>{row?.Finish} </>,
        //     sortable: true
        // },
        // {
        //     name: 'ManufactureYear',
        //     selector: (row) => <>{row?.ManufactureYear} </>,
        //     sortable: true
        // },

    ]

    const SecurityCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Incident Number',
            selector: (row) => <>{row?.IncidentNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Security ID',
            selector: (row) => <>{row?.SecurityIDNumber} </>,
            sortable: true
        },

        // {
        //     name: 'SecurityDtTm',
        //     selector: (row) => <>{row?.SecurityDtTm} </>,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Security Date/Time',
            selector: (row) => row.SecurityDtTm ? getShowingWithOutTime(row.SecurityDtTm) : '',
            sortable: true
        },
        // {
        //     name: 'MeasureTypeID',
        //     selector: (row) => <>{row?.MeasureTypeID} </>,
        //     sortable: true
        // },
        // {
        //     name: 'IssuingAgency',
        //     selector: (row) => <>{row?.IssuingAgency} </>,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Denomination',
            selector: (row) => <>{row?.Denomination} </>,
            sortable: true
        },
        // {
        //     name: 'SerialID',
        //     selector: (row) => <>{row?.SerialID} </>,
        //     sortable: true
        // },

    ]

    const DrugCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditVal(row)} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Incident Number',
            selector: (row) => <>{row?.IncidentNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },

        {
            width: '150px',

            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },

        {
            width: '150px',

            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },

        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Mis_Description,
            sortable: true
        },

    ]

    const setEditVal = (row) => {
        fetchPostData("Property/GetData_PropertyExist", {
            "MasterPropertyID": row.MasterPropertyID,
            "IncidentID": mainIncidentID ? mainIncidentID : '',
        }).then((data) => {
            // console.log(data)
            if (data) {
                if (data[0]?.Total === 0) {
                    // setEditValue(row);
                    if (MstPage === "MST-Property-Dash") {
                        if (isCad) {
                            navigate(`/cad/dashboard-page?page=MST-Property-Dash&ProId=${''}&MProId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.PropertyNumber?.trim()}&ProSta=${true}`);
                        } else {
                            navigate(`/Prop-Home?page=MST-Property-Dash&ProId=${''}&MProId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.PropertyNumber?.trim()}&ProSta=${true}`);
                        }
                    }
                    GetSingleData(row.MasterPropertyID);
                    setSearchModalState(false);

                    setChangesStatus(false); setStatesChangeStatus(false);
                    // dispatch({ type: PropertySearch_Modal_Status, payload: false });
                } else {
                    toastifyError('Property Already Exists'); setSearchModalState(true);

                    setChangesStatus(false); setStatesChangeStatus(false);
                    // dispatch({ type: PropertySearch_Modal_Status, payload: true });
                }
            }
        });
    }

    const GetSingleData = (masterPropertyId) => {
        const val = { 'MasterPropertyID': masterPropertyId, 'PropertyID': 0, 'PINID': loginPinID, 'IncidentID': 0, 'IsMaster': true }
        fetchPostData('Property/GetSingleData_Property', val).then((res) => {
            // console.log(res);
            if (res) { setEditValue(res); }
            else { setEditValue([]); }
        })
    }

    useEffect(() => {
        // console.log(editval)
        if (editval?.length > 0) {
            sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(editval[0]?.Value, 'SForStolenValue'));

            if (Get_Property_Code(editval, propertyTypeData) === 'A') {
                get_PropertyArticle_Single_Data(editval[0]?.MasterPropertyID, 0, Get_Property_Code(editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertySecurity([])
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); console.log("Call  Type === A")

            } else if (Get_Property_Code(editval, propertyTypeData) === 'B') {
                get_PropertyBoat_Single_Data(editval[0]?.MasterPropertyID, 0, Get_Property_Code(editval, propertyTypeData))
                setPropertOther([]); setPropertyArticle([]); setPropertyWeapon([]); setPropertySecurity([])
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); console.log("Call  Type === B")

            } else if (Get_Property_Code(editval, propertyTypeData) === 'O') {
                get_PropertOther_Single_Data(editval[0]?.MasterPropertyID, 0, Get_Property_Code(editval, propertyTypeData))
                setPropertyArticle([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertySecurity([])
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); console.log("Call  Type === O")

            } else if (Get_Property_Code(editval, propertyTypeData) === 'S') {
                get_PropertySecurity_Single_Data(editval[0]?.MasterPropertyID, 0, Get_Property_Code(editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertyArticle([])
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); console.log("Call  Type === S")

            } else if (Get_Property_Code(editval, propertyTypeData) === 'G') {
                get_PropertyWeapon_Single_Data(editval[0]?.MasterPropertyID, 0, Get_Property_Code(editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]);
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); console.log("Call  Type === G")
            }
            setLossCode(Get_LossCode(editval, propertyLossCodeDrpData));
            setValue({
                ...value,
                // 'PropertyID': MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID,
                'MasterPropertyID': editval[0]?.MasterPropertyID,
                'PropertyNumber': editval[0]?.PropertyNumber,
                'PropertyTypeID': editval[0]?.PropertyTypeID, 'ModifiedByUserFK': loginPinID,
                'CategoryID': editval[0]?.CategoryID, 'ClassificationID': editval[0]?.ClassificationID,
                'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '',
                'DestroyDtTm': editval[0]?.DestroyDtTm ? getShowingDateText(editval[0]?.DestroyDtTm) : '',
                'Value': editval[0]?.Value ? editval[0]?.Value : '',
                'OfficerID': editval[0]?.OfficerID, 'LossCodeID': editval[0]?.LossCodeID, 'PropertyTag': editval[0]?.PropertyTag,
                'NICB': editval[0]?.NICB, 'Description': editval[0]?.Description, 'IsEvidence': editval[0]?.IsEvidence,
                'IsSendToPropertyRoom': editval[0]?.IsSendToPropertyRoom, 'IsPropertyRecovered': editval[0]?.IsPropertyRecovered,
                'PossessionOfID': editval[0]?.PossessionOfID,
                'PropertyCategoryCode': Get_Property_Code(editval, propertyTypeData),
                'PropertyArticleID': Get_Property_Code(editval, propertyTypeData) === "A" ? editval[0].PropertyArticle[0]?.PropertyArticleID : '',
                'PropertyBoatID': Get_Property_Code(editval, propertyTypeData) === "B" ? editval[0].PropertyBoat[0]?.PropertyBoatID : "",
                'PropertyOtherID': Get_Property_Code(editval, propertyTypeData) === "O" ? editval[0].PropertyOther[0]?.PropertyOtherID : '',
                'PropertySecurityID': Get_Property_Code(editval, propertyTypeData) === "S" ? editval[0].PropertySecurity[0]?.PropertySecurityID : '',
                'PropertyWeaponID': Get_Property_Code(editval, propertyTypeData) === "G" ? editval[0].PropertyWeapon[0]?.PropertyWeaponID : '',
            });
            if (MstPage === "MST-Property-Dash" && editval[0]?.PossessionOfID) { dispatch(get_Masters_Name_Drp_Data(editval[0]?.PossessionOfID)); }
            setPossessionID(editval[0]?.PossessionOfID);
            PropertyCategory(editval[0]?.PropertyTypeID);
            PropertyClassification(editval[0]?.CategoryID);
            setPropertyNumber(editval[0]?.PropertyNumber);
            //  get Property Multi Image
            get_Name_MultiImage(0, editval[0]?.MasterPropertyID, true)
        }
    }, [editval]);
    // console.log(editval);

    const onCloseModel = () => {
        // dispatch({ type: PropertySearch_Modal_Status, payload: false });
        dispatch({ type: Property_Search_Data, payload: [] });
        setSearchModalState(false)
    }

    return (
        searchModalState ?
            <div className="modal fade " style={{ background: "rgba(0,0,0, 0.5)", }} id="PropertyModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-header px-3 p-2">
                            <h5 className="modal-title">Property-Search-List</h5>
                            <button type="button" onClick={onCloseModel} className="close text-red border-0" data-dismiss="modal" style={{ alignSelf: 'end' }}>X</button>
                        </div>
                        <div className="box text-center px-2">
                            <div className="col-12 ">
                                {
                                    propertySearchType === 'Pro-Security' &&
                                    <DataTable
                                        dense
                                        columns={SecurityCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                                {
                                    propertySearchType === 'Pro-Article' &&
                                    <DataTable
                                        dense
                                        columns={ArticleCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                                {
                                    propertySearchType === 'Pro-Other' &&
                                    <DataTable
                                        dense
                                        columns={OtherCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                                {
                                    propertySearchType === 'Pro-Weapon' &&
                                    <DataTable
                                        dense
                                        columns={WeaponCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                                {
                                    propertySearchType === 'Pro-Boat' &&
                                    <DataTable
                                        dense
                                        columns={BoatCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                                {
                                    propertySearchType === 'Pro-Drug' &&
                                    <DataTable
                                        dense
                                        columns={DrugCol}
                                        data={propertySearchData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <></>
    )
}

export default memo(PropertySearchTab)

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.PropertyTypeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}

const Get_LossCode = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.LossCodeID))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}