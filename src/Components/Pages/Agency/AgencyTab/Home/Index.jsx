import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor'
import Select from 'react-select';
import { Aes256Encrypt, Decrypt_Id_Name, DecryptedList, EncryptedList, base64ToString, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { FaxField, MunicipalityCodeValidator, ORIValidator, PhoneField, RequiredField } from '../../AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchData, fetchPostData, AddDelete_Img, fieldPermision, ScreenPermision } from '../../../../hooks/Api';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import uploadImage from '../../../../../img/uploadImage.png'
import ChangesModal from '../../../../Common/ChangesModal';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const Home = ({ allowMultipleLogin }) => {

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [clickedRow, setClickedRow] = useState(null);

    // Hooks Initialization
    const { get_CountList, setCount, changesStatus, setChangesStatus, setAllowMultipleLogin, setcountoffaduitAgency } = useContext(AgencyContext);

    const navigate = useNavigate();
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);
    const [agencysingledata, setagencysingleData] = useState([]);
    const [pinID, setPinID] = useState('');
    const [isProperty, setIsProperty] = useState(true);
    const [inActiveStatus, setInActiveStatus] = useState(false);
    const [status, setStatus] = useState(true);
    const [image, setImage] = useState('');
    const [multiImage, setMultiImage] = useState([]);
    const [rowAgencyID, setRowAgencyID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [agencyFilterData, setAgencyFilterData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [inActiveCheckBox, setInActiveCheckBox] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddAgency, setPermissionForAddAgency] = useState(false);
    const [permissionForEditAgency, setPermissionForEditAgency] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [errors, setErrors] = useState({
        'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Time_Zone': '',
        'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '',
    })

    const [value, setValue] = useState({
        'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'TimeZone': '',
        'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '', 'ZipName': '', 'StateName': '', 'CityName': '', 'IsActive': true,
        'AgencyID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '',

    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '',
    })

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var Aid = query?.get("Aid");
    var AgySta = query?.get("ASta");
    var AgyName = query?.get("AgyName");
    var ORINum = query?.get("ORINum");

    if (!Aid) Aid = 0;
    else Aid = parseInt(base64ToString(Aid));

    useEffect(() => {
        if (!localStoreData.AgencyID || !localStoreData.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setPinID(localStoreData?.PINID); getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID)
            setAllowMultipleLogin(localStoreData?.IsSuperadmin); getAgency(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    // Onload Function
    useEffect(() => {
        getStateList(); getTimeZone()
        if (Aid && pinID) {
            get_CountList(Aid, pinID)
        }
    }, [Aid, pinID])

    useEffect(() => {
        if (inActiveCheckBox || Aid && (AgySta === true || AgySta === 'true')) {
            get_Edit_Agency_Data(Aid); setRowAgencyID(Aid)
        }
        else { setStatusFalse(); }
    }, [Aid, AgySta])

    useEffect(() => {
        setcountoffaduitAgency(true)
        if (agencysingledata?.length > 0) {
            if (inActiveCheckBox) {
                navigate(`/agencyTab?Aid=${stringToBase64(Aid)}&ASta=${false}&AgyName=${agencysingledata[0]?.Agency_Name}&ORINum=${agencysingledata[0]?.ORI?.toUpperCase()}`)
            } else {
                navigate(`/agencyTab?Aid=${stringToBase64(Aid)}&ASta=${true}&AgyName=${agencysingledata[0]?.Agency_Name}&ORINum=${agencysingledata[0]?.ORI?.toUpperCase()}`)
            }
            setValue({
                ...value,
                'ORI': agencysingledata[0]?.ORI,
                'MaxRestrictLevel': agencysingledata[0]?.MaxRestrictLevel,
                'MaxLockLevel': agencysingledata[0]?.MaxLockLevel,
                'IsActive': agencysingledata[0]?.IsActive,
                'MunicipalityCode': agencysingledata[0]?.MunicipalityCode,
                'Agency_Name': agencysingledata[0]?.Agency_Name,
                'ShortName': agencysingledata[0]?.ShortName,
                'Agency_Address1': agencysingledata[0]?.Agency_Address1,
                'Agency_StateId': agencysingledata[0]?.Agency_StateId,
                'Agency_CityId': agencysingledata[0]?.Agency_CityId,
                'Agency_ZipId': agencysingledata[0]?.Agency_ZipId,
                'Agency_Phone': agencysingledata[0]?.Agency_Phone,
                'Agency_Fax': agencysingledata[0]?.Agency_Fax,
                'AgencyID': agencysingledata[0]?.AgencyID,
                'ZipName': changeArrayFormat_WithFilter(agencysingledata, 'zip'),
                'StateName': changeArrayFormat_WithFilter(agencysingledata, 'state'),
                'CityName': changeArrayFormat_WithFilter(agencysingledata, 'city'),
                'ModifiedByUserFK': pinID, 'TimeZone': agencysingledata[0]?.TimeZone ? Number(agencysingledata[0]?.TimeZone) : null,

            });
            if (agencysingledata[0]?.IsActive) { setStatus(true); } else { setStatus(false); }
            getCity(agencysingledata[0]?.Agency_StateId); getAgencyImg(agencysingledata[0]?.AgencyID); getZipCode(agencysingledata[0]?.Agency_CityId)
        }
        else if (!changesStatus) {
            setValue({
                ...value, 'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '', 'Agency_Phone': '', 'Agency_Fax': '', 'AgencyID': '', 'TimeZone': '',

            }); setZipList([]); setCityList([]); setStatus(false)
        }
    }, [agencysingledata, Aid])

    // Get Effective Screeen Permission
    const getScreenPermision = (Aid, pinID) => {
        try {
            ScreenPermision("A001", Aid, pinID).then(res => {
                console.log("🚀 ~ getScreenPermision ~ res:", res)
                if (res) {
                    setEffectiveScreenPermission(res);
                    setPermissionForAddAgency(res[0]?.AddOK);
                    setPermissionForEditAgency(res[0]?.Changeok);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);

                }
                else {
                    setEffectiveScreenPermission([]);
                    setPermissionForAddAgency(false);
                    setPermissionForEditAgency(false);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(false)
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionForAddAgency(false);
            setPermissionForEditAgency(false);
        }
    }

    // Get Effective Field Permission
    const get_Field_Permision_Agency = (Aid, pinID) => {
        fieldPermision(Aid, 'A001', pinID).then(res => {
            if (res) {
                const agencyOriFilter = Agency_Field_Permistion_Filter(res, "Agency-ORI");
                const agencyShortNameFilter = Agency_Field_Permistion_Filter(res, "Agency-ShortName");
                const agencyAgencyNameFilter = Agency_Field_Permistion_Filter(res, "Agency-AgencyName");
                const agencyAddressFilter = Agency_Field_Permistion_Filter(res, "Agency-Address");
                const agencyStateFilter = Agency_Field_Permistion_Filter(res, "Agency-State");
                const agencyCityFilter = Agency_Field_Permistion_Filter(res, "Agency-City");
                const agencyPhoneFilter = Agency_Field_Permistion_Filter(res, "Agency-Phone");
                const agencyFaxFilter = Agency_Field_Permistion_Filter(res, "Agency-Fax");
                const agencyMunicipalityCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-MunicipalityCode");
                const agencyZipFilter = Agency_Field_Permistion_Filter(res, "Agency-Zip");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['ORI']: agencyOriFilter || prevValues['ORI'],
                        ['ShortName']: agencyShortNameFilter || prevValues['ShortName'],
                        ['Agency_Name']: agencyAgencyNameFilter || prevValues['Agency_Name'],
                        ['Agency_Address1']: agencyAddressFilter || prevValues['Agency_Address1'],
                        ['Agency_StateId']: agencyStateFilter || prevValues['Agency_StateId'],
                        ['Agency_CityId']: agencyCityFilter || prevValues['Agency_CityId'],
                        ['Agency_Phone']: agencyPhoneFilter || prevValues['Agency_Phone'],
                        ['Agency_Fax']: agencyFaxFilter || prevValues['Agency_Fax'],
                        ['MunicipalityCode']: agencyMunicipalityCodeFilter || prevValues['MunicipalityCode'],
                        ['Agency_ZipId']: agencyZipFilter || prevValues['Agency_ZipId'],

                    }
                });
            }
        });
    }

    function stateChanges(e) {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, ['Agency_StateId']: e.value, ['Agency_CityId']: '', ['ZipName']: '', ['Agency_ZipId']: '', ['CityName']: '' });
            getCity(e.value);
        } else {
            setValue({ ...value, ['Agency_StateId']: null, ['Agency_CityId']: '', ['ZipName']: '', ['Agency_ZipId']: '', ['CityName']: '' });
            setCityList([]); setZipList([]);
        }
    }

    function TimeZoneChanges(e) {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, ['TimeZone']: e.value, });
        }
        else {
            setValue({ ...value, ['TimeZone']: null });
        }
    }


    function cityChanges(e) {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, ['Agency_CityId']: e.value, ['ZipName']: '', ['Agency_ZipId']: null, });
            setZipList([]); getZipCode(e.value)
        } else {
            setValue({ ...value, ['Agency_CityId']: null, ['ZipName']: '', ['Agency_ZipId']: null });
            setZipList([]);
        }
    }

    function zipChanges(e) {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, ['Agency_ZipId']: e.value, ['ZipName']: { value: e.value, label: e.label } });
        } else {
            setValue({ ...value, ['Agency_ZipId']: null });
        }
    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e.target.name === 'Agency_Phone' || e.target.name === 'Agency_Fax') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setValue({ ...value, [e.target.name]: ele });
            }
        } else if (e.target.name === 'MunicipalityCode') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");

            setValue({ ...value, [e.target.name]: checkNumber });
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    // Get List state, city and zip code 
    const get_Edit_Agency_Data = async (Aid) => {
        const value = { AgencyID: Aid }
        fetchPostData("Agency/GetData_SingleData", value).then((res) => {
            if (res) {
                setagencysingleData(res);
            } else { setagencysingleData([]); }
        })
    }

    const getTimeZone = async () => {
        fetchData("TimeZone/GetData_TimeZone")
            .then(res => {
                if (res) setTimeZoneList(changeArrayFormat(res, 'TimeZone'));
                else { setTimeZoneList([]) }
            })
    }

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State")
            .then(res => {
                if (res) { setStateList(changeArrayFormat(res, 'state')); }
                else { setStateList([]) }
            })
    }

    const getCity = async (stateID) => {
        fetchPostData('State_City_ZipCode/GetData_City', { StateID: stateID }).then((res) => {
            if (res) { setCityList(changeArrayFormat(res, 'city')) }
            else { setCityList(changeArrayFormat(res, 'city')) }
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    }

    const getZipCode = async (cityID) => {
        fetchPostData('State_City_ZipCode/GetData_ZipCode', { CityId: cityID }).then((res) => {
            if (res) { setZipList(changeArrayFormat(res, 'zip')) }
            else { setZipList(changeArrayFormat(res, 'zip')) }
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        const ORI = ORIValidator(value.ORI);
        const MunicipalityCode = 'true';

        const Agency_Name = RequiredField(value.Agency_Name);
        const ShortName = RequiredField(value.ShortName);
        const Agency_Address1 = RequiredField(value.Agency_Address1);
        const Agency_StateId = RequiredField(value.Agency_StateId);
        const Agency_CityId = RequiredField(value.Agency_CityId);
        const Agency_Phone = PhoneField(value.Agency_Phone);
        const Agency_Fax = FaxField(value.Agency_Fax);
        const Time_Zone = RequiredField(value.TimeZone);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['ORI']: ORI,
                ['MunicipalityCode']: MunicipalityCode,
                ['Agency_Name']: Agency_Name,
                ['ShortName']: ShortName,
                ['Agency_Address1']: Agency_Address1,
                ['Agency_StateId']: Agency_StateId,
                ['Agency_CityId']: Agency_CityId,
                ['Agency_Phone']: Agency_Phone,
                ['Agency_Fax']: Agency_Fax,
                ['Time_Zone']: Time_Zone
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { ORI, MunicipalityCode, Agency_Name, ShortName, Agency_Address1, Agency_StateId, Agency_CityId, Agency_Phone, Agency_Fax, Time_Zone } = errors

    useEffect(() => {
        if (ORI === 'true' && MunicipalityCode === 'true' && Agency_Name === 'true' && ShortName === 'true' && Agency_Address1 === 'true' && Agency_StateId === 'true' && Agency_CityId === 'true' && Agency_Phone === 'true' && Agency_Fax === 'true' && Time_Zone === 'true') {
            if (Aid || (AgySta === true || AgySta === 'true')) {
                update_Agency()
            } else {
                agencySubmit();
            }
        }
    }, [ORI, MunicipalityCode, Agency_Name, ShortName, Agency_Address1, Agency_StateId, Agency_CityId, Agency_Phone, Agency_Fax, Time_Zone])

    // Save Agency
    const agencySubmit = () => {
        const result = agencyData?.find(item => {
            if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
                return item.ORI.toLowerCase() === value.ORI.toLowerCase()
            } else return item.ORI.toLowerCase() === value.ORI.toLowerCase()
        });
        if (result) {
            toastifyError('ORI Code Already Exists')
            setErrors({ ...errors, ['ORI']: '' })
        } else {
            const {
                AgencyID, ORI, MunicipalityCode, Agency_Name, ShortName, Agency_Address1, Agency_StateId, Agency_CityId, Agency_ZipId, Agency_Phone, Agency_Fax, ModifiedByUserFK,
                TimeZone, MaxLockLevel, MaxRestrictLevel, ReleaseTask, DestroyTask,
                CreatedByUserFK,
            } = value
            const val = {
                'AgencyID': loginAgencyID, 'ORI': ORI, 'MunicipalityCode': MunicipalityCode, 'Agency_Name': Agency_Name, 'ShortName': ShortName, 'Agency_Address1': Agency_Address1,
                'Agency_StateId': Agency_StateId, 'Agency_CityId': Agency_CityId, 'Agency_ZipId': Agency_ZipId, 'Agency_Phone': Agency_Phone, 'Agency_Fax': Agency_Fax,
                'ModifiedByUserFK': ModifiedByUserFK, 'TimeZone': TimeZone, 'MaxLockLevel': MaxLockLevel, 'MaxRestrictLevel': MaxRestrictLevel,
                'CreatedByUserFK': pinID,

            }
            AddDeleteUpadate('Agency/AgencyInsert', val).then(response => {
                if (response?.success) {
                    setChangesStatus(false); setStatesChangeStatus(false);
                    getAgency(loginAgencyID, pinID); upload_Image_File(response?.Id);
                    get_CountList(response?.Id); navigate(`/agencyTab?Aid=${stringToBase64(response?.Id)}&ASta=${true}&AgyName=${response?.AgencyName}&ORINum=${response?.ORI?.toUpperCase()}`)
                    toastifySuccess(response?.Message); setErrors({ ...errors, ['Agency_Name']: '' }); getAgencyImg(Aid);
                } else {
                    toastifyError(response.Message)
                }
            })


        }
    }

    // Update Agency 
    const update_Agency = () => {
        const result = agencyData?.find(item => {
            if (item?.AgencyID != Aid) {
                if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
                    return item.ORI.toLowerCase() === value.ORI.toLowerCase()
                } else return item.ORI.toLowerCase() === value.ORI.toLowerCase()
            }
        });
        if (result) {
            toastifyError('ORI Code Already Exists')
            setErrors({ ...errors, ['ORI']: '' })
        } else {
            AddDeleteUpadate('Agency/AgencyUpdate', value).then(response => {
                if (response?.success) {
                    if (!multiImage) {
                        if (image) {
                            upload_Image_File(Aid)
                        }
                    }
                    const responseData = JSON.parse(response.data);
                    const message = responseData.Table[0].Message;
                    toastifySuccess(message);
                    setChangesStatus(false); setStatesChangeStatus(false);
                    setErrors({ ...errors, ['Agency_Name']: '' });
                    getAgency(loginAgencyID, pinID); get_Edit_Agency_Data(Aid);
                    if (inActiveCheckBox && value.IsActive) {
                        navigate(`/agencyTab?Aid=${stringToBase64(Aid)}&ASta=${true}&AgyName=${AgyName}&ORINum=${ORINum?.toUpperCase()}`)
                        getAgency(loginAgencyID, pinID); setInActiveCheckBox(false); get_Edit_Agency_Data(Aid)
                    }
                    else if (!inActiveCheckBox && !value.IsActive) {
                        getAgency(loginAgencyID, pinID); setStatusFalse(); get_Edit_Agency_Data(Aid);
                        navigate(`/agencyTab?Aid=${stringToBase64(Aid)}&ASta=${true}&AgyName=${AgyName}&ORINum=${ORINum?.toUpperCase()}`)
                    }
                } else {
                    toastifyError(response.Message)
                }
            })


        }
    }

    // Rest Value After Call Cencel Button
    const rest_Value = (e) => {
        setValue({
            ...value,
            'ORI': '', 'MunicipalityCode': '', 'Agency_Name': '', 'ShortName': '', 'Agency_Address1': '', 'Agency_StateId': '', 'Agency_CityId': '', 'Agency_ZipId': '',
            'Agency_Phone': '', 'Agency_Fax': '', 'ZipName': '', 'CityName': '', 'StateName': '', 'IsActive': true, 'TimeZone': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '',
        });
        setCityList([]); setZipList([]); setRowAgencyID(null); setagencysingleData([]); setCount([]); setStatesChangeStatus(false); setImage(''); setMultiImage([])
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const getAgencyImg = (Aid) => {
        const val = { 'AgencyID': Aid, }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = ''
                if (res[0]?.Agency_Photo === undefined) {
                    imgUrl = ''
                } else {
                    imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;

                }
                setMultiImage(imgUrl);
                setImage('')

            }
            else { console.log("errror") }
        })
    }

    useEffect(() => {
        const inputFile = document.querySelector("#picture__input");
        inputFile.value = '';
    }, [agencysingledata, status, multiImage])

    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                setImage(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Upload Agency Image 
    const upload_Image_File = async (id) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const docs = [];
        const EncDocs = [];
        const val = { 'AgencyID': id, 'CreatedByUserFK': pinID, };

        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
        const values = JSON.stringify(val);
        EncDocs.push(EncPostData);
        docs.push(values);
        formdata.append("File", image);
        EncFormdata.append("File", image);
        formdata.append("Data", JSON.stringify(docs));
        EncFormdata.append("Data", EncDocs);

        if (image) {
            AddDelete_Img('Agency/AgencyPhoto', formdata, EncFormdata).then((res) => {
                if (res.success) {
                    get_Edit_Agency_Data(Aid);

                } else setImage('');
            }).catch(err => console.log(err))
        }
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = { AgencyID: Aid, DeletedByUserFK: pinID }
        AddDeleteUpadate('Agency/Delete_AgencyPhoto', value).then((data) => {
            if (data.success) {
                const parseData = JSON.parse(data.data);
                toastifySuccess(parseData?.Table[0].Message);
                get_Edit_Agency_Data(Aid)
            } else {
                toastifyError(data?.Message)
            }
        });

    }

    // Table Columns Array
    const columns = [
        {
            name: 'ORI', selector: (row) => row.ORI.toUpperCase(), sortable: true
        },
        {
            name: 'Agency Name', selector: (row) => row.Agency_Name, sortable: true

        },
        {
            name: 'Agency Code', selector: (row) => row.Short_Name, sortable: true
        },

        {
            name: 'Phone', selector: (row) => row.Agency_Phone, sortable: true
        },

    ]

    const setEditValue = (row) => {
        if (row?.AgencyID) {
            rest_Value();
            if (inActiveCheckBox) {
                navigate(`/agencyTab?Aid=${stringToBase64(row?.AgencyID)}&ASta=${false}&AgyName=${row?.Agency_Name}&ORINum=${row?.ORI?.toUpperCase()}`)
            } else {
                get_CountList(row?.AgencyID, pinID); navigate(`/agencyTab?Aid=${stringToBase64(row?.AgencyID)}&ASta=${true}&AgyName=${row?.Agency_Name}&ORINum=${row?.ORI?.toUpperCase()}`)
            }
            setRowAgencyID(row?.AgencyID); setErrors(''); get_Edit_Agency_Data(row?.AgencyID); setMultiImage('')
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row.AgencyID == rowAgencyID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const setStatusFalse = (e) => {
        navigate(`/agencyTab?Aid=${''}&ASta=${false}&AgyName=${''}&ORINum=${''}`)
        setClickedRow(null); setStatus(false); rest_Value(); setErrors(''); setRowAgencyID(''); setStatesChangeStatus(false)

    }

    // Delete Agency
    const delete_Agency = () => {
        const value = { 'AgencyID': rowAgencyID, 'DeletedByUserFK': pinID, }
        AddDeleteUpadate('Agency/AgencyDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                getAgency(loginAgencyID, pinID)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const getAgency = async (AgencyID, PinID) => {
        const value = { AgencyID: AgencyID, PINID: PinID, }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyFilterData(data); setAgencyData(data)
            } else {
                setAgencyFilterData([]); setAgencyData([]);
            }
        })
    }

    const getInActiveAgency = async () => {
        fetchData("Agency/GetData_InActiveAgency").then((data) => {
            if (data) {
                setAgencyFilterData(data); setAgencyData(data)
            } else {
                setAgencyFilterData([]); setAgencyData([]);
            }
        })
    }

    const handleActiveCheckBox = (e) => {
        if (e) {
            if (e.target.checked) {
                getInActiveAgency()
            } else {
                getAgency(loginAgencyID, pinID)
            }
            setInActiveCheckBox(e.target.checked);
            setStatusFalse();
            setagencysingleData([])
        }
    }

    const styles = value?.Agency_StateId ? colourStyles : customStylesWithOutColor;




    const MaxLockLevelType = [
        { value: "Equal To", label: "Equal To" },
        { value: "Greater Than", label: "Greater Than" },
        { value: "Greater Than Or Equal To", label: "Greater Than Or Equal To" },
    ];


    const MaxRestrictLevelType = [
        { value: "Equal To", label: "Equal To" },
        { value: "Greater Than", label: "Greater Than" },
        { value: "Greater Than Or Equal To", label: "Greater Than Or Equal To" },
    ]

    return (
        <>
            <div className="row">
                <div className="col-12 " id='display-not-form'>
                    <div className="row px-1">
                        <div className="col-12 col-md-12 col-lg-10 pt-2 p-0" >
                            <div className="row">
                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                    <label htmlFor="" className='new-label'>ORI{errors.ORI !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ORI}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                    <input type="text" maxLength="9" name='ORI' style={{ textTransform: "uppercase" }}
                                        className={'requiredColor'}
                                        onChange={handleChange}
                                        value={value.ORI}

                                        disabled={inActiveCheckBox}
                                    />
                                    <p><span className='hovertext' data-hover="ORI : Enter a 9 digit code starting with first two capital characters and ending with 00" ><i className='fa fa-exclamation-circle'></i></span></p>
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                    <label htmlFor="" className='new-label'>Agency Code{errors.ShortName !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ShortName}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-3 mt-2 text-field">
                                    <input type="text"
                                        maxLength={10}
                                        style={{ textTransform: "uppercase" }}
                                        className={'requiredColor'}
                                        name='ShortName' value={value.ShortName}
                                        onChange={handleChange}
                                        required

                                        disabled={inActiveCheckBox}
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2">

                                </div>
                                <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">

                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                    <label htmlFor="" className='new-label px-0'>Agency&nbsp;Name{errors.Agency_Name !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_Name}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-11 mt-2 text-field">
                                    <input type="text"
                                        name='Agency_Name' value={value.Agency_Name}
                                        className={'requiredColor'}
                                        onChange={handleChange}
                                        required

                                        disabled={inActiveCheckBox}
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='new-label '>Address{errors.Agency_Address1 !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_Address1}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-11 mt-2 text-field">
                                    <textarea
                                        className={'requiredColor'}
                                        name='Agency_Address1' value={value.Agency_Address1}
                                        onChange={handleChange}
                                        required cols="30" rows="1"

                                        disabled={inActiveCheckBox}
                                        style={{ resize: 'none' }} ></textarea>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='new-label '>State {errors.Agency_StateId !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_StateId}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-2 mt-1">
                                    <Select
                                        styles={colourStyles}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        value={stateList?.filter((obj) => obj.value === value?.Agency_StateId)}
                                        name='Agency_StateId' menuPlacement="bottom"
                                        options={stateList}
                                        isClearable
                                        onChange={stateChanges}

                                        isDisabled={inActiveCheckBox}

                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label '>City{errors.Agency_CityId !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_CityId}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-3 mt-1">
                                    <Select
                                        styles={colourStyles}

                                        value={cityList?.filter((obj) => obj.value === value?.Agency_CityId)}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name='Agency_CityId'
                                        menuPlacement="bottom"
                                        options={cityList}
                                        isClearable
                                        onChange={cityChanges}


                                        isDisabled={inActiveCheckBox || !value?.Agency_StateId}


                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                    <label htmlFor="" className='new-label '>Zip</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-2 mt-1">
                                    <Select
                                        className="basic-single"
                                        value={zipList?.filter((obj) => obj.value === value?.Agency_ZipId)}
                                        classNamePrefix="select"
                                        styles={customStylesWithOutColor}
                                        name='Agency_ZipId' menuPlacement="bottom"
                                        options={zipList}
                                        isClearable
                                        onChange={zipChanges}

                                        isDisabled={inActiveCheckBox || !value?.Agency_CityId}



                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                                    <label htmlFor="" className='new-label '>Phone</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-1 mt-3">
                                    <select name="" id="" className="form-control requiredColor" style={{ height: '32px', width: '70px' }}>
                                        <option value="">+1</option>
                                    </select>
                                </div>
                                <div className="col-4  col-md-5 col-lg-2 mt-3 text-field">
                                    <input type="text" maxLength={10}
                                        className={'requiredColor'}
                                        name='Agency_Phone' value={value.Agency_Phone}
                                        onChange={handleChange}
                                        required

                                        disabled={inActiveCheckBox}
                                    />
                                    <p><span className='hovertext-small' data-hover="Enter your 10 digit phone number" ><i className='fa fa-exclamation-circle'></i></span></p>
                                    {errors.Agency_Phone !== 'true' ? (
                                        <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_Phone}</span>
                                    ) : null}
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                                    <label htmlFor="" className='new-label '>Fax{errors.Agency_Fax !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Agency_Fax}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-3 mt-3 text-field">
                                    <input type="text" maxLength="10"
                                        name='Agency_Fax' value={value.Agency_Fax}

                                        onChange={handleChange}

                                        disabled={inActiveCheckBox}
                                    />
                                    <p><span className='hovertext-small' data-hover="Enter a 10 digit Number " ><i className='fa fa-exclamation-circle'></i></span></p>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                                    <label htmlFor="" className='new-label '>Time Zone {errors.Time_Zone !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Time_Zone}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4  col-md-4 col-lg-3 mt-3">
                                    <Select
                                        styles={colourStyles}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        value={timeZoneList?.find((obj) => obj.value === value?.TimeZone) || null}
                                        name='TimeZone' menuPlacement="bottom"
                                        options={timeZoneList}
                                        isClearable
                                        onChange={TimeZoneChanges}
                                        isDisabled={inActiveCheckBox}
                                    />
                                </div>

                                <div className="col-4 ml-3 mt-1">
                                    <div className="form-check custom-control custom-checkbox">
                                        <input
                                            className="custom-control-input"
                                            type="checkbox"
                                            name=''
                                            id="flexCheckDefault"
                                            onChange={handleActiveCheckBox}
                                        />
                                        <label className="custom-control-label " htmlFor="flexCheckDefault" style={{ fontSize: '14px' }}>
                                            Show In-Active Agency
                                        </label>
                                    </div>
                                </div>

                                <div className="col-2 mt-1 ml-2">
                                    <input type="checkbox" name="IsActive" checked={value?.IsActive} value={value?.IsActive}
                                        onChange={() => {
                                            !addUpdatePermission && setStatesChangeStatus(true); setChangesStatus(true);
                                            setValue({ ...value, ['IsActive']: !value?.IsActive })
                                        }}
                                        disabled={rowAgencyID ? false : true}
                                    />
                                    <label className='ml-2' >Active</label>
                                </div>

                                <div className="col-12 col-lg-12 mb-1 text-right">
                                    {
                                        !inActiveCheckBox
                                        &&
                                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); }}>New</button>
                                    }
                                    {
                                        Aid || (AgySta === true || AgySta === 'true') ?
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={check_Validation_Error} >Update</button>
                                                    : <></> :
                                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={check_Validation_Error} >Update</button>
                                            :
                                            !inActiveCheckBox ?
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                                        : <></>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                                : <></>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="col-4 col-md-4 col-lg-2 pt-1">
                            <div className="img-box" >
                                <label className="picture"
                                    style={{ cursor: multiImage && (!Aid || (AgySta != true || AgySta != 'true')) ? 'not-allowed' : '' }}
                                    htmlFor={multiImage && (!Aid || (AgySta != true || AgySta != 'true')) ? "" : 'picture__input'}
                                    tabIndex="0"
                                >
                                    <span className="picture__image">
                                        <img src={multiImage && multiImage?.length > 0 ? multiImage : image ? URL.createObjectURL(image) : uploadImage} alt="" />
                                    </span>

                                </label>
                                <input type="file" name="picture__input" onChange={(e) => { get_Image_File(e) }} id="picture__input" />
                            </div>
                            {
                                multiImage?.length > 0 && status ?
                                    <button type="button" data-toggle="modal" data-target="#DeleteModal" className="btn btn-sm btn-success ml-5">Clear</button>
                                    : <></>
                            }
                        </div>
                    </div>
                    {
                        allowMultipleLogin === '0' && !status ?
                            <div className="overlay-form">
                                <p>You don't have permision to Add Agency this data</p>
                            </div>
                            : <></>
                    }
                </div>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        showHeader={true}
                        persistTableHead={true}
                        dense


                        data={
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.DisplayOK ?
                                    agencyFilterData
                                    : []
                                : agencyFilterData
                        }

                        pagination
                        paginationPerPage={'5'}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}

                        highlightOnHover

                        showPaginationBottom={agencyFilterData?.length > 10 ? true : false}

                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            setEditValue(row); setClickedRow(row);
                        }}
                        fixedHeaderScrollHeight='140px'
                        fixedHeader
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <IdentifyFieldColor />
            <DeletePopUpModal func={!isProperty ? delete_Agency : delete_Image_File} />
            <ChangesModal func={check_Validation_Error} inActiveCheckBox={inActiveCheckBox} />
            {/* <ChangesModal hasPermission={Aid || (AgySta === true || AgySta === 'true') ? permissionForEditAgency : permissionForAddAgency} func={check_Validation_Error} inActiveCheckBox={inActiveCheckBox} /> */}
        </>
    )
}

export default Home

export const changeArrayFormat = (data, type) => {
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }
    if (type === 'TimeZone') {

        const result = data?.map((sponsor) =>
            ({ value: sponsor.Id, label: sponsor.TimeZoneId + sponsor.TimeZoneInfo })
        );
        return result
    }

}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'zip') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_ZipId, label: sponsor.Zipcode })
        )
        return result[0]
    }
    if (type === 'state') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_StateId, label: sponsor.StateName })
        )
        return result[0]
    }
    if (type === 'city') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_CityId, label: sponsor.CityName })
        )
        return result[0]
    }
}
