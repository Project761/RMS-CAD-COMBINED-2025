// Import Component
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { getShowingWithOutTime, getShowingYearMonthDate } from '../../../../Common/Utility';
import { Personal_Field_Permistion_Filter } from '../../../../Filter/PersonnelFilter';
import { AddDeleteUpadate, fetchData, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api';
import { Deactivate_Date_Field, Deceased_Date_Field, PhoneField, SSN_Field, WorkPhone_Ext_Field } from '../../Validation/PersonnelValidation';

const Dates = (props) => {
    // Hooks Initialization  
    const { pId, aId, pinId, status, dobHireDate } = props
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [zipList, setZipList] = useState([])
    const [hiredDate, setHiredDate] = useState()
    const [deactivateDate, setDeactivateDate] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [deceasedDate, setDeceasedDate] = useState()
    const [personnelList, setPersonnelList] = useState([])
    const [raceList, setRaceList] = useState([])
    const [ethincityList, setEthincityList] = useState([])
    const [bloodGroupList, setBloodGroupList] = useState([])
    const [hairList, setHairList] = useState([])
    const [eyeList, setEyeList] = useState([]);

    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()

    const [value, setValue] = useState({
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'height': '', 'weight': '', 'BloodTypeID': '', 'EyeColorID': '', 'HairColorID': '', 'PINID': pId,
        'StateName': '', "CityName": '', 'ZipName': '', 'RaceName': '', 'EthnicityName': '', 'BloodTypeName': '', 'EyeColorName': '', 'HairColorName': '',
        'ModifiedByUserFK': pinId,
    })

    const [fieldPermisionPersonal, setFieldPermisionPersonal] = useState({
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'height': '', 'weight': '', 'BloodTypeID': '', 'EyeColorID': '', 'HairColorID': '',
    })

    const [errors, setErrors] = useState({
        'WorkPhoneNumber': '',
        'WorkPhone_Ext': '',
        'HomePhoneNumber': '',
        'CellPhoneNumber': '',
        'SSN': '',
        'DeactivateDate': '',
        'DeceasedDate': ''
    })

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    // Onload Function
    useEffect(() => {
        getStateList();
        getRaceList();
        getScreenPermision(aId, pinId)
        getEthnicityList(aId)
        getBloodGroupList(aId)
        getColorList('1', '0', aId)
        getColorList('0', '1', aId)
    }, [aId, pinId])

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("P013", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    useEffect(() => {
        if (aId && pinId) get_Field_Permision_Classifiation(aId, pinId);
    }, [aId, pinId])

    // Get Effective Field Permission
    const get_Field_Permision_Classifiation = (aId, pinId) => {
        fieldPermision(aId, 'P013', pinId).then(res => {
            if (res) {
                // ------Personnel Characteristics, Date and Number Feild ------ 
                Personal_Field_Permistion_Filter(res, "Personnel-Address")
                    && setFieldPermisionPersonal(prevValues => {
                        return {
                            ...prevValues,
                            ['Address']: Personal_Field_Permistion_Filter(res, "Personnel-Address")
                        }
                    })

                Personal_Field_Permistion_Filter(res, "Personnel-State") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['StateID']: Personal_Field_Permistion_Filter(res, "Personnel-State") } })

                Personal_Field_Permistion_Filter(res, "Personnel-City") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['CityID']: Personal_Field_Permistion_Filter(res, "Personnel-City") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Zip") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['ZipCodeID']: Personal_Field_Permistion_Filter(res, "Personnel-Zip") } })

                Personal_Field_Permistion_Filter(res, "Personnel-SSN") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['SSN']: Personal_Field_Permistion_Filter(res, "Personnel-SSN") } })

                Personal_Field_Permistion_Filter(res, "Personnel-BadgeID") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['BadgeNumber']: Personal_Field_Permistion_Filter(res, "Personnel-BadgeID") } })

                Personal_Field_Permistion_Filter(res, "Personnel-DriversLic_No") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DriverLicenseNo']: Personal_Field_Permistion_Filter(res, "Personnel-DriversLic_No") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Work") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['WorkPhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Work") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Ext") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['WorkPhone_Ext']: Personal_Field_Permistion_Filter(res, "Personnel-Ext") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Home") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['HomePhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Home") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Cell") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['CellPhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Cell") } })

                Personal_Field_Permistion_Filter(res, "Personnel-HiredDate") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['HiredDate']: Personal_Field_Permistion_Filter(res, "Personnel-HiredDate") } })

                Personal_Field_Permistion_Filter(res, "Personnel-DeactivateDate") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DeactivateDate']: Personal_Field_Permistion_Filter(res, "Personnel-DeactivateDate") } })

                Personal_Field_Permistion_Filter(res, "Personnel-DOB") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DateOfBirth']: Personal_Field_Permistion_Filter(res, "Personnel-DOB") } })

                Personal_Field_Permistion_Filter(res, "Personnel-IsDecease") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['IsDecease']: Personal_Field_Permistion_Filter(res, "Personnel-IsDecease") } })

                Personal_Field_Permistion_Filter(res, "Personnel-DeceasedDate") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DeceasedDate']: Personal_Field_Permistion_Filter(res, "Personnel-DeceasedDate") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Gender") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['SexID']: Personal_Field_Permistion_Filter(res, "Personnel-Gender") } })

                Personal_Field_Permistion_Filter(res, "Personnel-Race") && setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['RaceID']: Personal_Field_Permistion_Filter(res, "Personnel-Race") } })
            }
        });
    }

    useEffect(() => {
        if (pId) { get_Single_PersonnelList(pId) }
    }, [pId])

    useEffect(() => {
        if (personnelList) {
            setValue({
                ...value,
                'Address': personnelList[0]?.Address ? personnelList[0]?.Address : '', 'StateID': personnelList[0]?.StateID ? personnelList[0]?.StateID : '', 'CityID': personnelList[0]?.CityID ? personnelList[0]?.CityID : '', 'ZipCodeID': personnelList[0]?.ZipCodeID ? personnelList[0]?.ZipCodeID : '', 'SSN': personnelList[0]?.SSN ? personnelList[0]?.SSN : '', 'BadgeNumber': personnelList[0]?.BadgeNumber ? personnelList[0]?.BadgeNumber : '', 'DriverLicenseNo': personnelList[0]?.DriverLicenseNo ? personnelList[0]?.DriverLicenseNo : '', 'WorkPhoneNumber': personnelList[0]?.WorkPhoneNumber ? personnelList[0]?.WorkPhoneNumber : '', 'WorkPhone_Ext': personnelList[0]?.WorkPhone_Ext ? personnelList[0]?.WorkPhone_Ext : '', 'HomePhoneNumber': personnelList[0]?.HomePhoneNumber ? personnelList[0]?.HomePhoneNumber : '', 'CellPhoneNumber': personnelList[0]?.CellPhoneNumber ? personnelList[0]?.CellPhoneNumber : '',
                'HiredDate': personnelList[0]?.HiredDate != null ?
                    getShowingWithOutTime(personnelList[0]?.HiredDate) === '01/01/1900' ? null : new Date(personnelList[0]?.HiredDate)
                    :
                    '',
                'DeactivateDate': personnelList[0]?.DeactivateDate != null
                    ?
                    getShowingWithOutTime(personnelList[0]?.DeactivateDate) === '01/01/1900' ? '' : new Date(personnelList[0]?.DeactivateDate)
                    :
                    '',
                'DateOfBirth': personnelList[0]?.DateOfBirth != null ?
                    getShowingWithOutTime(personnelList[0]?.DateOfBirth) === '01/01/1900' ? '' : new Date(personnelList[0]?.DateOfBirth)
                    :
                    '',
                'IsDecease': personnelList[0]?.IsDecease,
                'DeceasedDate': personnelList[0]?.DeceasedDate != null ?
                    getShowingWithOutTime(personnelList[0]?.DeceasedDate) === '01/01/1900' ? '' : new Date(personnelList[0]?.DeceasedDate)
                    :
                    '',
                'SexID': personnelList[0]?.SexID ? personnelList[0]?.SexID : '',
                'RaceID': personnelList[0]?.RaceID ? personnelList[0]?.RaceID : '',
                'EthnicityID': personnelList[0]?.EthnicityID ? personnelList[0]?.EthnicityID : '',
                'BloodTypeID': personnelList[0]?.BloodTypeID ? personnelList[0]?.BloodTypeID : '',
                'HairColorID': personnelList[0]?.HairColorID ? personnelList[0]?.HairColorID : '',
                'EyeColorID': personnelList[0]?.EyeColorID ? personnelList[0]?.EyeColorID : '',
                'weight': personnelList[0]?.Weight ? personnelList[0]?.Weight : '',
                'height': personnelList[0]?.Height ? height_Format(personnelList[0]?.Height) : '',
                'PINID': pId, 'StateName': changeArrayFormat_WithFilter(personnelList, 'state'), 'CityName': changeArrayFormat_WithFilter(personnelList, 'city'), 'ZipName': changeArrayFormat_WithFilter(personnelList, 'zip'), 'RaceName': changeArrayFormat_WithFilter(personnelList, 'race'), 'EthnicityName': changeArrayFormat_WithFilter(personnelList, 'ethnicity'), 'BloodTypeName': changeArrayFormat_WithFilter(personnelList, 'blood'), 'EyeColorName': changeArrayFormat_WithFilter(personnelList, 'eye'), 'HairColorName': changeArrayFormat_WithFilter(personnelList, 'hair')
            })
            if (personnelList[0]?.StateID) { getCity(personnelList[0]?.StateID) }
            if (personnelList[0]?.CityID) { getZipCode(personnelList[0]?.CityID) }
        }
    }, [personnelList])

    // Check Validation
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (PhoneField(value.CellPhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['CellPhoneNumber']: PhoneField(value.CellPhoneNumber) } })
        }
        if (PhoneField(value.HomePhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['HomePhoneNumber']: PhoneField(value.HomePhoneNumber) } })
        }
        if (WorkPhone_Ext_Field(value.WorkPhone_Ext)) {
            setErrors(prevValues => { return { ...prevValues, ['WorkPhone_Ext']: WorkPhone_Ext_Field(value.WorkPhone_Ext) } })
        }
        if (PhoneField(value.WorkPhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['WorkPhoneNumber']: PhoneField(value.WorkPhoneNumber) } })
        }
        if (SSN_Field(value.SSN)) {
            setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
        }
        if (Deactivate_Date_Field(value.DeactivateDate, value.HiredDate)) {
            setErrors(prevValues => { return { ...prevValues, ['DeactivateDate']: Deactivate_Date_Field(value.DeactivateDate, value.HiredDate) } })
        }
        if (value.IsDecease) {
            if (Deceased_Date_Field(value.DeceasedDate, value.HiredDate)) {
                setErrors(prevValues => { return { ...prevValues, ['DeceasedDate']: Deceased_Date_Field(value.DeceasedDate, value.HiredDate) } })
            }
        } else setErrors(prevValues => { return { ...prevValues, ['DeceasedDate']: 'true' } })
    }

    // Check All Field Format is True Then Submit 
    const { WorkPhone_Ext, CellPhoneNumber, HomePhoneNumber, WorkPhoneNumber, SSN, DeactivateDate, DeceasedDate } = errors

    useEffect(() => {
        if (WorkPhone_Ext === 'true' && CellPhoneNumber === 'true' && HomePhoneNumber === 'true' && WorkPhoneNumber === 'true' && SSN === 'true' && DeactivateDate === 'true' && DeceasedDate === 'true') {
            save_Characteristics_Dates();
        }
    }, [WorkPhone_Ext, CellPhoneNumber, HomePhoneNumber, WorkPhoneNumber, SSN, DeactivateDate, DeceasedDate])

    const get_Single_PersonnelList = (pId) => {
        const val = { PINID: pId }
        fetchPostData('Personnel/GetData_UpdatePersonnel', val)
            .then((res) => {
                if (res) setPersonnelList(res);
                else setPersonnelList();
            })
    }

    // // onChange Hooks Function
    const dateChange = (date, type) => {
        if (type === 'HiredDate') {
            setHiredDate(date); setValue({ ...value, ['HiredDate']: date });
        } else if (type === 'DeactivateDate') {
            setDeactivateDate(date); setValue({ ...value, ['DeactivateDate']: date })
        } else if (type === 'DateOfBirth') {
            if (date <= moment(new Date()).subtract(18, 'years')._d) {
                setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: date })
            }
        } else if (type === 'DeceasedDate') {
            setDeceasedDate(date); setValue({ ...value, ['DeceasedDate']: date })
        }
    }

    const stateChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['StateID']: e.value, ['CityID']: null, ['ZipCodeID']: null,
            })
            getCity(e.value); setZipList([]);
        } else {
            setValue({
                ...value,
                ['StateID']: null, ['CityID']: null, ['ZipCodeID']: null
            })
            setCityList([])
            setZipList([])
        }
    }

    const cityChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['CityID']: e.value, ['ZipCodeID']: null,
            })
            getZipCode(e.value);
        } else {
            setValue({
                ...value,
                ['CityID']: null, ['ZipCodeID']: null,
            });
            setZipList([]);
        }
    }

    const zipChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['ZipCodeID']: e.value, ['ZipName']: { value: e.value, label: e.label }
            });
        } else {
            setValue({
                ...value,
                ['ZipCodeID']: null
            });
        }
    }

    const raceChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['RaceID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['RaceID']: null
            })
        }

    }

    const ethincityChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['EthnicityID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['EthnicityID']: null
            })
        }
    }

    const bloodTypeChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['BloodTypeID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['BloodTypeID']: null
            })
        }
    }

    const hairColorChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['HairColorID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['HairColorID']: null
            })
        }
    }

    const eyeColorChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['EyeColorID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['EyeColorID']: null
            })
        }
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'IsDecease') {
            setValue({ ...value, [e.target.name]: e.target.checked, ['DeceasedDate']: "" });
            setDeceasedDate(null)
        } else if (e.target.name === 'WorkPhoneNumber' || e.target.name === 'CellPhoneNumber' || e.target.name === 'HomePhoneNumber') {
            let ele = e.target.value.replace(/\D/g, null);
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'SSN' || e.target.name === 'WorkPhone_Ext') {
            let ele = e.target.value;
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'height') {
            let ele = e.target.value
            if (ele.length === 3) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const HeightFromVal = value?.HeightFrom.split("'").join('').replace(/\D/g, '');
                const match = cleaned.match(/^(\d{1})(\d{2})$/);
                if (parseInt(HeightFromVal) < parseInt(cleaned)) {
                    if (parseInt(match[2]) < 12) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + match[2] + "'"
                        })
                    } else {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + "11" + "'"
                        })
                    }
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else setValue({ ...value, [e.target.name]: e.target.value })
    }

    const height_Format = (val) => {
        let cleaned = ('' + val).replace(/\D/g, '');
        let match = cleaned.match(/^(\d{1})(\d{2})$/);
        let result;
        if (match) {
            result = match[1] + "'" + match[2] + '"'
        }
        return result;
    }


    // Get state, city, zip, Race and Sex List 
    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State")
            .then(response => {
                if (response) setStateList(changeArrayFormat(response, 'state'))
                else setStateList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getCity = async (stateID) => {
        fetchPostData("State_City_ZipCode/GetData_City", { StateID: stateID })
            .then(res => {
                if (res) setCityList(changeArrayFormat(res, 'city'))
                else setCityList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getZipCode = async (cityID) => {
        fetchPostData("State_City_ZipCode/GetData_ZipCode", { CityId: cityID })
            .then(res => {
                if (res) setZipList(changeArrayFormat(res, 'zip'))
                else setZipList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getRaceList = async (aId) => {
        fetchPostData("DropDown/GetData_RaceType", { AgencyId: aId })
            .then(response => {
                if (response) setRaceList(changeArrayFormat(response, 'race'))
                else setRaceList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getEthnicityList = async (aId) => {
        fetchPostData("DropDown/GetDataDropDown_Ethnicity", { Agencyid: aId })
            .then(response => {
                if (response) setEthincityList(changeArrayFormat(response, 'ethnicity'))
                else setEthincityList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getBloodGroupList = async (aId) => {
        fetchPostData("DropDown/GetData_DropDown_BloodType", { Agencyid: aId })
            .then(response => {
                if (response) setBloodGroupList(changeArrayFormat(response, 'blood'))
                else setBloodGroupList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getColorList = async (isHair, isEye, aId) => {
        fetchPostData("DropDown/GetData_DropDown_Color", { Agencyid: aId, IsHair: isHair, IsEye: isEye })
            .then(response => {
                if (response) {
                    if (isHair === '1') {
                        setHairList(changeArrayFormat(response, 'eye'))
                    } else if (isEye === '1') {
                        setEyeList(changeArrayFormat(response, 'eye'))
                    }
                }
                else {
                    if (isHair === '1') {
                        setHairList();
                    }
                    if (isEye === '1') {
                        setEyeList();
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Save data in List
    const save_Characteristics_Dates = () => {
        const { Address, StateID, CityID, ZipCodeID, SSN, BadgeNumber, DriverLicenseNo, WorkPhoneNumber, WorkPhone_Ext, HomePhoneNumber, CellPhoneNumber, IsDecease, SexID, RaceID, ModifiedByUserFK, PINID, DeactivateDate, DateOfBirth, DeceasedDate, HiredDate, EthnicityID, height, weight, BloodTypeID, EyeColorID, HairColorID } = value
        const val = {
            'Address': Address, 'StateID': StateID, 'CityID': CityID, 'ZipCodeID': ZipCodeID, 'SSN': SSN, 'BadgeNumber': BadgeNumber, 'DriverLicenseNo': DriverLicenseNo, 'WorkPhoneNumber': WorkPhoneNumber, 'WorkPhone_Ext': WorkPhone_Ext, 'HomePhoneNumber': HomePhoneNumber, 'CellPhoneNumber': CellPhoneNumber, 'HiredDate': hiredDate ? getShowingYearMonthDate(hiredDate) : HiredDate, 'DeactivateDate': deactivateDate ? getShowingYearMonthDate(deactivateDate) : DeactivateDate, 'DateOfBirth': dateOfBirth ? getShowingYearMonthDate(dateOfBirth) : DateOfBirth, 'IsDecease': IsDecease, 'DeceasedDate': deceasedDate ? getShowingYearMonthDate(deceasedDate) : DeceasedDate, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'Height': height, 'Weight': weight, 'BloodTypeID': BloodTypeID, 'HairColorID': HairColorID, 'EyeColorID': EyeColorID, 'ModifiedByUserFK': ModifiedByUserFK, 'PINID': PINID,
        }
        AddDeleteUpadate('Personnel/UpdateCharactersticPersonnel', val)
            .then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    setErrors({
                        ...errors, ['WorkPhoneNumber']: 'false', ['WorkPhone_Ext']: 'false', ['HomePhoneNumber']: 'false', ['CellPhoneNumber']: 'false'
                    })
                    get_Single_PersonnelList(pId);
                }
            })
    }

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

    const checkHandlChange = (e) => {
        if (e.target.name === 'height') {
            let ele = e.target.value
            if (ele.length === 3) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const HeightFromVal = value?.height.split("'").join('').replace(/\D/g, '');
                const match = cleaned.match(/^(\d{1})(\d{2})$/);
                if (parseInt(HeightFromVal) < parseInt(cleaned)) {
                    if (parseInt(match[2]) < 12) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + match[2] + "'"
                        })
                    } else {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + "11" + "'"
                        })
                    }
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        }
    }

    return (

        <div className="row">
            <div className="col-12 " id='display-not-form'>
                {
                    effectiveScreenPermission ?
                        <>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-12 mt-3">
                                    <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Address</p>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6">
                                            <div className="text-field">
                                                <input type="text" name='Address'
                                                    value={value.Address}
                                                    className={''}
                                                    onChange={handleChange}
                                                    required />
                                                <label>Address</label>
                                            </div>
                                        </div>
                                        <div className="col-12 ">
                                            <div className="row mt-2">
                                                <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                    <Select
                                                        value={stateList?.filter((obj) => obj.value === value?.StateID)}
                                                        name='StateID'
                                                        styles={customStylesWithOutColor}
                                                        options={stateList}
                                                        isClearable
                                                        onChange={stateChanges}
                                                        isDisabled={false}
                                                    />

                                                    <label htmlFor="">State</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                    <Select
                                                        value={cityList?.filter((obj) => obj.value === value?.CityID)}
                                                        name='CityID'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        onChange={cityChanges}
                                                        isDisabled={false}
                                                        options={cityList}
                                                    />
                                                    <label htmlFor="">City</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-4 dropdown__box">
                                                    <Select
                                                        name='ZipCodeID'
                                                        value={zipList?.filter((obj) => obj.value === value?.ZipCodeID)}
                                                        styles={customStylesWithOutColor}
                                                        options={zipList}
                                                        isClearable
                                                        onChange={zipChanges}
                                                        isDisabled={false}
                                                    />
                                                    <label htmlFor="">Zip</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-6 mt-2">
                                    <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Phone Number</p>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-6 col-md-4 col-lg-3 mt-2">
                                            <div className="text-field">
                                                <input type="text" maxLength='10' name='WorkPhoneNumber' value={value.WorkPhoneNumber}
                                                    className={''}
                                                    onChange={handleChange}
                                                    required />
                                                <label>Work</label>
                                                {errors.WorkPhoneNumber !== 'true' && errors.WorkPhoneNumber !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkPhoneNumber}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-2 col-lg-2 mt-2">
                                            <div className="text-field">
                                                <input type="text" maxLength='3' name='WorkPhone_Ext' value={value.WorkPhone_Ext}
                                                    className={''}
                                                    onChange={handleChange}
                                                    required />
                                                <label>Ext</label>
                                                {errors.WorkPhone_Ext !== 'true' && errors.WorkPhone_Ext !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkPhone_Ext}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-4 mt-2 ">
                                            <div className="text-field">
                                                <input type="text" maxLength='10' name='HomePhoneNumber' value={value.HomePhoneNumber}
                                                    className={''}
                                                    onChange={handleChange} required />
                                                <label>Home</label>
                                                {errors.HomePhoneNumber !== 'true' && errors.HomePhoneNumber !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HomePhoneNumber}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-3 mt-2">
                                            <div className="text-field">
                                                <input type="text" maxLength='10' name='CellPhoneNumber' value={value.CellPhoneNumber}
                                                    className={''}
                                                    onChange={handleChange}
                                                    required />
                                                <label>Cell</label>
                                                {errors.CellPhoneNumber !== 'true' && errors.CellPhoneNumber !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CellPhoneNumber}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-6 mt-2">
                                    <div className="bg-line cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center ">Identification Number</p>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-4 col-md-4 col-lg-4 mt-1">
                                            <div className="text-field">
                                                <input type="text" maxLength='9' name='SSN' value={value.SSN}
                                                    className={''}
                                                    onChange={handleChange}
                                                    required />
                                                <label>SSN</label>
                                                {errors.SSN !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SSN}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4 mt-1">
                                            <div className="text-field">
                                                <input type="text" name='BadgeNumber' value={value.BadgeNumber}
                                                    className={''}
                                                    onChange={handleChange} required />
                                                <label>Badge Id</label>
                                            </div>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4 mt-1">
                                            <div className="text-field">
                                                <input type="text" name='DriverLicenseNo' maxLength='14' value={value.DriverLicenseNo}
                                                    className={''}
                                                    onChange={''} required />
                                                <label>Driver's Lic.No</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1">
                                    <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Dates</p>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6 col-md-3 col-lg-2 date__box">
                                            <DatePicker
                                                ref={startRef}
                                                autoComplete='off'
                                                onKeyDown={onKeyDown}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                name='HiredDate'
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                minDate={new Date(dobHireDate)}
                                                maxDate={new Date()}
                                                isClearable={true}
                                                onChange={date => dateChange(date, 'HiredDate')}
                                                disabled={false}
                                                selected={value.HiredDate}
                                                placeholderText={'Select ..'}
                                            />
                                            <div>
                                                <label htmlFor="">Hired Date</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-2  date__box">
                                            <DatePicker
                                                ref={startRef1}
                                                onKeyDown={onKeyDown}
                                                autoComplete='off'
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                name='DeactivateDate'
                                                isClearable={true}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                                minDate={new Date(value?.HiredDate)}
                                                onChange={date => dateChange(date, 'DeactivateDate')}
                                                disabled={false}
                                                selected={value?.DeactivateDate}
                                                placeholderText={'Select ..'}
                                            />
                                            <div>
                                                <label htmlFor="">Deactivate Date</label>
                                            </div>
                                            {errors.DeactivateDate !== 'true' && errors.DeactivateDate !== 'false' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DeactivateDate}</span>
                                            ) : null}
                                        </div>

                                        <div className="col-6 col-md-3 col-lg-2 mt-3 text-center">
                                            <input type="checkbox" name='IsDecease'
                                                checked={value.IsDecease}
                                                value={value.IsDecease}
                                                onChange={handleChange}
                                                disabled={false}
                                            />
                                            <label className='ml-2'>Is Decease</label>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-2 date__box">
                                            <DatePicker
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                autoComplete='off'
                                                readOnly={!value.IsDecease}
                                                dateFormat="MM/dd/yyyy "
                                                isClearable={true}
                                                timeInputLabel
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                name='DeceasedDate'
                                                maxDate={new Date()}
                                                minDate={new Date(value?.HiredDate)}
                                                onChange={date => dateChange(date, 'DeceasedDate')}
                                                disabled={false}
                                                selected={value.DeceasedDate}
                                                placeholderText={'Select ...'}
                                            />
                                            <div>
                                                <label htmlFor="">Deceased Date</label>
                                            </div>
                                            {errors.DeceasedDate !== 'true' && errors.DeceasedDate !== 'false' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DeceasedDate}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="bg-line cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Characteristics</p>
                                    </div>
                                    <div className="row ">
                                        <div className="col-6 col-md-4 col-lg-3 pt-2 dropdown__box">
                                            <Select
                                                name='RaceID'
                                                value={raceList?.filter((obj) => obj.value === value?.RaceID)}
                                                styles={customStylesWithOutColor}
                                                menuPlacement="top"
                                                options={raceList}
                                                isClearable
                                                onChange={raceChanges}
                                                isDisabled={false}
                                            />
                                            <label htmlFor="" className='pt-2'>Race</label>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-3  pt-2 dropdown__box">
                                            <Select
                                                name='EthnicityID'
                                                value={ethincityList?.filter((obj) => obj.value === value?.EthnicityID)}
                                                styles={customStylesWithOutColor}
                                                menuPlacement="top"
                                                options={ethincityList}
                                                onChange={ethincityChanges}
                                                isClearable
                                            />
                                            <label htmlFor="" className='pt-2'>Ethnicity</label>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-3  pt-2  d-flex">
                                            <div className="text-field">
                                                <input type="text" name='height' maxLength={5} value={value?.height}
                                                    onChange={checkHandlChange}
                                                    required />
                                                <label>Height</label>
                                            </div>
                                            <span className='mt-3 mx-2 py-2' style={{ fontWeight: 'bold', fontSize: '12px' }}>FT.</span>
                                            <div className="text-field">
                                                <input type="text" name='weight' maxLength='3' value={value.weight}
                                                    onChange={handleChange}
                                                    required />
                                                <label>Weight</label>
                                            </div>
                                            <span className='mt-3 mx-2 py-2' style={{ fontWeight: 'bold', fontSize: '12px' }}>LBS.</span>
                                        </div>
                                    </div>
                                    <div className="col-12 px-0">
                                        <div className="row mt-1 ">
                                            <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                <Select
                                                    name='BloodTypeID'
                                                    value={bloodGroupList?.filter((obj) => obj.value === value?.BloodTypeID)}
                                                    styles={customStylesWithOutColor}
                                                    menuPlacement="top"
                                                    options={bloodGroupList}
                                                    isClearable
                                                    onChange={bloodTypeChanges}
                                                />
                                                <label htmlFor="">Blood Type</label>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                <Select
                                                    name='EyeColorID'
                                                    value={eyeList?.filter((obj) => obj.value === value?.EyeColorID)}
                                                    styles={customStylesWithOutColor}
                                                    menuPlacement="top"
                                                    options={eyeList}
                                                    onChange={eyeColorChanges}
                                                    isClearable
                                                />
                                                <label htmlFor="">Eye Color</label>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                <Select
                                                    name='HairColorID'
                                                    value={hairList?.filter((obj) => obj.value === value?.HairColorID)}
                                                    styles={customStylesWithOutColor}
                                                    menuPlacement="top"
                                                    options={hairList}
                                                    onChange={hairColorChanges}
                                                    isClearable
                                                />
                                                <label htmlFor="">Hair Color</label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-3 mt-3  text-right">
                                                {
                                                    effectiveScreenPermission ?
                                                        effectiveScreenPermission[0]?.Changeok ?
                                                            <button type="button" className="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>
                                                            : <></>
                                                        : <button type="button" className="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        : <p className='text-center mt-3'>Loading</p>
                }
                {
                    effectiveScreenPermission ? !effectiveScreenPermission[0]?.DisplayOK ?
                        <div className="overlay-form">
                            <p>You don't have permision to view this data</p>
                        </div>
                        : <></>
                        : <></>}

            </div>

        </div>

    )
}

export default Dates

export const changeArrayFormat = (data, type) => {
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        )
        return result
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }

    if (type === 'race') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RaceTypeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'ethnicity') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EthnicityID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'blood') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.BloodTypeID, label: sponsor.BloodtypeDescription })
        )
        return result
    }
    if (type === 'eye') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ColorID, label: sponsor.ColorDescription })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result[0]
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        )
        return result[0]
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ZipCodeID, label: sponsor.Zipcode })
        )
        return result[0]
    }
    if (type === 'race') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RaceID, label: sponsor.RaceDescription })
        )
        return result[0]
    }
    if (type === 'ethnicity') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EthnicityID, label: sponsor.Ethnicity_Description })
        )
        return result[0]
    }
    if (type === 'blood') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.BloodTypeID, label: sponsor.BloodType_Description })
        )
        return result[0]
    }
    if (type === 'eye') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EyeColorID, label: sponsor.EyeColorDescription })
        )
        return result[0]
    }
    if (type === 'hair') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.HairColorID, label: sponsor.HairColorDescription })
        )
        return result[0]
    }
}