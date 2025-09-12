import React, { memo, useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link, useLocation } from 'react-router-dom';
import { getShowingDateText, getShowingWithOutTime, stringToBase64 } from '../../Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import { fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const NameSearchModal = ({ setMasterNameSearchModal, masterNameSearchModal, setNameTypeCode, loginAgencyID, type, GetReasonIdDrp, setMultiSelected, mainIncidentID, nameSearchValue, Reset, ResetSearch, setValue, value, setUpdateStatus, updateStatus, setmasterNameValues, masterNameValues, setDobDate, get_Name_MultiImage, MstPage }) => {

    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const { nameSearchStatus, storeData, setLocalStoreArray, localStoreArray, setNameSearchStatus } = useContext(AgencyContext);
    const [editval, setEditval] = useState([]);


    const navigate = useNavigate();

    // const useQuery = () => {
    //     const params = new URLSearchParams(useLocation().search);
    //     return {
    //       get: (param) => params.get(param)
    //     };
    //   };

    //   const query = useQuery();
    // let MstPage = query?.get('page');

    function calculateAge(birthday) {
        console.log(birthday);
        const today = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        console.log(age)
        return age;
    }



    function formatDate(date) {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();

        return `${month}/${day}/${year}`;
    }






    // useEffect(() => {
    //     if (editval) {

    //         console.log(editval?.DateOfBirth);
    //         const formattedDob = editval?.DateOfBirth ? formatDate(editval?.DateOfBirth) : '';
    //         setDobDate(editval?.DateOfBirth && getShowingWithOutTime(editval?.DateOfBirth));
    //         if (masterNameSearchModal) {
    //             setmasterNameValues({
    //                 ...masterNameValues,
    //                 'NameID': editval?.NameID,
    //                 'MasterNameID': editval?.MasterNameID, 'EthnicityID': editval?.EthnicityID,
    //                 'NameIDNumber': editval?.NameIDNumber ? editval?.NameIDNumber : 'Auto Generated',
    //                 'checkVictem': editval?.NewVictimID ? editval?.NewVictimID?.NewVictimID : 0, 'checkOffender': editval?.NewOffenderID ? editval?.NewOffenderID?.NewOffenderID : 0,
    //                 // DropDown
    //                 // 'NameTypeID': editval?.NameTypeID,
    //                 'BusinessTypeID': editval?.BusinessTypeID, 'SuffixID': editval?.SuffixID, 'VerifyID': editval?.VerifyID,
    //                 'SexID': editval?.SexID, 'RaceID': editval?.RaceID, 'PhoneTypeID': editval?.PhoneTypeID,
    //                 'NameReasonCodeID': editval?.NameReasonCodeID, 'CertifiedByID': editval?.CertifiedByID,
    //                 // checkbox
    //                 'IsJuvenile': editval?.IsJuvenile, 'IsVerify': editval?.IsVerify, 'IsUnListedPhNo': editval?.IsUnListedPhNo,
    //                 //textbox
    //                 'LastName': editval?.LastName, 'FirstName': editval?.FirstName, 'MiddleName': editval?.MiddleName,
    //                 'SSN': editval?.SSN, 'WeightFrom': editval?.WeightFrom, 'WeightTo': editval?.WeightTo,
    //                 'HeightFrom': editval?.HeightFrom, 'HeightTo': editval?.HeightTo, 'Address': editval?.Address,
    //                 'Contact': editval?.Contact,
    //                 'AgeFrom': editval?.AgeFrom ? calculateAge(formattedDob) : '',
    //                  'AgeTo': editval?.AgeTo ? editval?.AgeTo : '',
    //                 //Datepicker
    //                 'DateOfBirth': editval?.DateOfBirth ? getShowingWithOutTime(editval?.DateOfBirth) : '',
    //                 'CertifiedDtTm': editval?.CertifiedDtTm ? getShowingDateText(editval?.CertifiedDtTm) : '',
    //                 'Years': editval?.Years,
    //                 'DLNumber': editval?.DLNumber,
    //                 'DLStateID': editval?.DLStateID,
    //                 'OwnerNameID': editval?.OwnerNameID,
    //                 'OwnerPhoneNumber': editval?.OwnerPhoneNumber,
    //                 'OwnerFaxNumber': editval?.OwnerFaxNumber,
    //             })
    //         } else {
    //             if (editval?.length > 0 || editval?.LastName) {

    //                 get_Name_MultiImage(editval?.NameID, editval?.MasterNameID);
    //                 setValue({
    //                     ...value,
    //                     'NameID': editval?.NameID,
    //                     'MasterNameID': editval?.MasterNameID, 'EthnicityID': editval?.EthnicityID,
    //                     'NameIDNumber': editval?.NameIDNumber ? editval?.NameIDNumber : 'Auto Generated',
    //                     'checkVictem': editval?.NewVictimID ? editval?.NewVictimID?.NewVictimID : 0, 'checkOffender': editval?.NewOffenderID ? editval?.NewOffenderID?.NewOffenderID : 0,
    //                     // DropDown
    //                     // 'NameTypeID': editval?.NameTypeID,
    //                     //  'BusinessTypeID': editval?.BusinessTypeID,
    //                     'SuffixID': editval?.SuffixID, 'VerifyID': editval?.VerifyID,
    //                     'SexID': editval?.SexID, 'RaceID': editval?.RaceID, 'PhoneTypeID': editval?.PhoneTypeID,
    //                     'NameReasonCodeID': '', 'CertifiedByID': editval?.CertifiedByID,
    //                     // checkbox
    //                     'IsJuvenile': editval?.IsJuvenile, 'IsVerify': editval?.IsVerify, 'IsUnListedPhNo': editval?.IsUnListedPhNo,
    //                     //textbox
    //                     'LastName': editval?.LastName, 'FirstName': editval?.FirstName, 'MiddleName': editval?.MiddleName,
    //                     'SSN': editval?.SSN, 'WeightFrom': editval?.WeightFrom, 'WeightTo': editval?.WeightTo,
    //                     'HeightFrom': editval?.HeightFrom, 'HeightTo': editval?.HeightTo, 'Address': editval?.Address,
    //                     'Contact': editval?.Contact,
    //                    'AgeFrom': editval?.AgeFrom ? calculateAge(formattedDob) : '',
    //                      'AgeTo': editval?.AgeTo ? editval?.AgeTo : '',
    //                     //Datepicker
    //                     'DateOfBirth': editval?.DateOfBirth ? getShowingWithOutTime(editval?.DateOfBirth) : '',
    //                     'CertifiedDtTm': editval?.CertifiedDtTm ? getShowingDateText(editval?.CertifiedDtTm) : '',
    //                     'Years': editval?.Years,
    //                     'DLNumber': editval?.DLNumber,
    //                     'DLStateID': editval?.DLStateID,
    //                     'OwnerNameID': editval?.OwnerNameID,
    //                     'OwnerPhoneNumber': editval?.OwnerPhoneNumber,
    //                     'OwnerFaxNumber': editval?.OwnerFaxNumber,
    //                 })
    //             }
    //         }
    //         setDobDate(editval?.DateOfBirth ? new Date(getShowingWithOutTime(editval?.DateOfBirth)) : '');
    //     }
    // }, [editval])



    useEffect(() => {
        const fetchData = async () => {
            if (editval) {

                try {

                    const dob = editval[0]?.DateOfBirth ? new Date(editval[0]?.DateOfBirth) : null;
                    const getAgeData = (dob) => {
                        const today = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);


                        // if (!dob) return {
                        //     AgeFrom: '',
                        //     AgeTo: '',
                        //     Years: '',
                        //     AgeUnitID: null,
                        //     IsJuvenile: false
                        // };
                        if (!dob) {
                            return {
                                AgeFrom: editval[0]?.AgeFrom ?? '',
                                AgeTo: editval[0]?.AgeTo ?? '',
                                Years: editval[0]?.Years ?? '',
                                AgeUnitID: editval[0]?.AgeUnitID ?? null,
                                IsJuvenile: editval[0]?.IsJuvenile ?? false
                            };
                        }

                        const diffInMs = today - dob;
                        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

                        let age = today.getFullYear() - dob.getFullYear();
                        const monthDiff = today.getMonth() - dob.getMonth();
                        const dayDiff = today.getDate() - dob.getDate();

                        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                            age--;
                        }

                        if (age > 0) {
                            return {
                                AgeFrom: age, AgeTo: '', Years: age, AgeUnitID: 5, IsJuvenile: false
                            };
                        } else if (diffInDays > 0) {
                            return {
                                AgeFrom: diffInDays, AgeTo: '', Years: diffInDays, AgeUnitID: 1, IsJuvenile: true
                            };
                        } else {
                            return {
                                AgeFrom: diffInHours, AgeTo: '', Years: diffInHours, AgeUnitID: 2, IsJuvenile: true
                            };
                        }
                    };

                    const ageData = getAgeData(dob);
                    await GetReasonIdDrp(loginAgencyID, masterNameValues.NameTypeID, type);

                    setDobDate(editval[0]?.DateOfBirth && getShowingWithOutTime(editval[0]?.DateOfBirth));

                    if (masterNameSearchModal) {
                        setmasterNameValues({
                            ...masterNameValues,
                            'NameID': editval[0]?.NameID,
                            'MasterNameID': editval[0]?.MasterNameID, 'EthnicityID': editval[0]?.EthnicityID,
                            'NameIDNumber': editval[0]?.NameIDNumber ? editval[0]?.NameIDNumber : 'Auto Generated',
                            'checkVictem': editval?.NewVictimID ? editval?.NewVictimID[0]?.NewVictimID : 0, 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID[0]?.NewOffenderID : 0,
                            // 'checkVictem': editval?.NewVictimID ? editval?.NewVictimID?.NewVictimID : 0, 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID?.NewOffenderID : 0,
                            // DropDown
                            // 'NameTypeID': editval?.NameTypeID,
                            'BusinessTypeID': editval[0]?.BusinessTypeID, 'SuffixID': editval[0]?.SuffixID, 'VerifyID': editval[0]?.DLVerifyID,
                            'SexID': editval[0]?.SexID, 'RaceID': editval[0]?.RaceID, 'PhoneTypeID': editval[0]?.PhoneTypeID,
                            // 'NameReasonCodeID': editval?.NameReasonCodeID,
                            'CertifiedByID': editval[0]?.CertifiedByID,
                            // checkbox
                            'IsJuvenile': ageData?.IsJuvenile, 'IsVerify': editval[0]?.IsVerify, 'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,
                            //textbox
                            'LastName': editval[0]?.LastName, 'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName,
                            'SSN': editval[0]?.SSN, 'WeightFrom': editval[0]?.WeightFrom, 'WeightTo': editval[0]?.WeightTo,
                            'HeightFrom': editval[0]?.HeightFrom, 'HeightTo': editval[0]?.HeightTo, 'Address': editval[0]?.Address,
                            'Contact': editval[0]?.Contact,
                            ...ageData,
                            // 'AgeFrom': editval?.AgeFrom ? calculateAge(formattedDob) : '',
                            // 'AgeTo': editval?.AgeTo ? editval?.AgeTo : '',
                            //Datepicker
                            'DateOfBirth': dob ? getShowingWithOutTime(dob) : '',
                            'CertifiedDtTm': editval[0]?.CertifiedDtTm ? getShowingDateText(editval[0]?.CertifiedDtTm) : '',
                            'Years': editval[0]?.Years,
                            'DLNumber': editval[0]?.DLNumber,
                            'DLStateID': editval[0]?.DLStateID,
                            'OwnerNameID': editval[0]?.OwnerNameID,
                            'OwnerPhoneNumber': editval[0]?.OwnerPhoneNumber,
                            'OwnerFaxNumber': editval[0]?.OwnerFaxNumber,
                            'ResidentID': editval[0]?.ResidentID,
                        })

                        setNameTypeCode(editval[0]?.NameTypeID === 2 ? 'B' : 'I')
                    } else {

                    }
                    setDobDate(dob ? new Date(getShowingWithOutTime(dob)) : '');
                } catch (error) {

                }
            }
        };

        fetchData();

        if ((editval?.length > 0 || editval?.LastName) && !masterNameSearchModal) {
            const dob = editval[0]?.DateOfBirth ? new Date(editval[0]?.DateOfBirth) : null;
            const getAgeData = (dob) => {
                const today = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);
                // if (!dob) return {
                //     AgeFrom: '', AgeTo: '', Years: '', AgeUnitID: null, IsJuvenile: false
                // };
                if (!dob) {
                    return {
                        AgeFrom: editval[0]?.AgeFrom ? parseInt(editval[0]?.AgeFrom) : '',
                        AgeTo: editval[0]?.AgeTo ?? '',
                        Years: editval[0]?.Years ?? '',
                        AgeUnitID: editval[0]?.AgeUnitID ?? null,
                        IsJuvenile: editval[0]?.IsJuvenile ?? false
                    };
                }

                const diffInMs = today - dob;
                const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
                const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                const dayDiff = today.getDate() - dob.getDate();

                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                    age--;
                }

                if (age > 0) {
                    return {
                        AgeFrom: age, AgeTo: '', Years: age, AgeUnitID: 5, IsJuvenile: false
                    };
                } else if (diffInDays > 0) {
                    return {
                        AgeFrom: diffInDays, AgeTo: '', Years: diffInDays, AgeUnitID: 1, IsJuvenile: true
                    };
                } else {
                    return {
                        AgeFrom: diffInHours, AgeTo: '', Years: diffInHours, AgeUnitID: 2, IsJuvenile: true
                    };
                }
            };

            const ageData = getAgeData(dob);

            setDobDate(dob ? getShowingWithOutTime(dob) : '');
            get_Name_MultiImage(editval[0]?.NameID, editval[0]?.MasterNameID);
            setValue({
                ...value,
                'NameID': editval[0]?.NameID,
                'MasterNameID': editval[0]?.MasterNameID, 'EthnicityID': editval[0]?.EthnicityID,
                'NameIDNumber': editval[0]?.NameIDNumber ? editval[0]?.NameIDNumber : 'Auto Generated',
                'checkVictem': editval[0]?.NewVictimID ? editval[0]?.NewVictimID[0]?.NewVictimID : 0, 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID[0]?.NewOffenderID : 0,
                // 'checkVictem': editval[0]?.NewVictimID ? editval[0]?.NewVictimID?.NewVictimID : 0, 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID?.NewOffenderID : 0,
                // DropDown
                // 'NameTypeID': editval?.NameTypeID,
                //  'BusinessTypeID': editval?.BusinessTypeID,
                'SuffixID': editval[0]?.SuffixID, 'VerifyID': editval[0]?.DLVerifyID,
                'SexID': editval[0]?.SexID, 'RaceID': editval[0]?.RaceID, 'PhoneTypeID': editval[0]?.PhoneTypeID,
                'NameReasonCodeID': '', 'CertifiedByID': editval[0]?.CertifiedByID,
                // checkbox
                'IsJuvenile': ageData?.IsJuvenile, 'IsVerify': editval[0]?.IsVerify, 'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,
                //textbox
                'LastName': editval[0]?.LastName, 'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName,
                'SSN': editval[0]?.SSN, 'WeightFrom': editval[0]?.WeightFrom, 'WeightTo': editval[0]?.WeightTo,
                'HeightFrom': editval[0]?.HeightFrom, 'HeightTo': editval[0]?.HeightTo, 'Address': editval[0]?.Address,
                'Contact': editval[0]?.Contact,
                ...ageData,
                // 'AgeFrom': editval?.AgeFrom ? calculateAge(formattedDob) : '',
                // 'AgeTo': editval?.AgeTo ? editval?.AgeTo : '',
                //Datepicker
                'DateOfBirth': dob ? getShowingWithOutTime(dob) : '',
                'CertifiedDtTm': editval[0]?.CertifiedDtTm ? getShowingDateText(editval[0]?.CertifiedDtTm) : '',
                'Years': editval[0]?.Years,
                'DLNumber': editval[0]?.DLNumber,
                'DLStateID': editval[0]?.DLStateID,
                'OwnerNameID': editval[0]?.OwnerNameID,
                'OwnerPhoneNumber': editval[0]?.OwnerPhoneNumber,
                'OwnerFaxNumber': editval[0]?.OwnerFaxNumber,
                'ResidentID': editval[0]?.ResidentID,
            })
            setDobDate(dob ? new Date(getShowingWithOutTime(dob)) : '');
        }
    }, [editval]);

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditValue(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',
            name: 'MNI',
            selector: (row) => <>{row?.NameIDNumber} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Last Name',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'First Name',
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Middle Name',
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        // {
        //     name: 'Reason Code',
        //     selector: (row) => row.NameReasonCode_Description,
        //     sortable: true
        // },
        // {
        //     name: 'Reason Code',
        //     selector: (row) => <>{row?.NameReasonCode_Description ? row?.NameReasonCode_Description.substring(0, 10) : ''}{row?.NameReasonCode_Description?.length > 20 ? '  . . .' : null} </>,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Age',
            selector: (row) => row.AgeFrom,
            sortable: true
        },
        {
            width: '150px',

            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
        {
            width: '150px',

            name: 'DOB',
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : '',
            sortable: true
        },
        {
            width: '150px',

            name: 'Gender',
            selector: (row) => row.Gender_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Race',
            selector: (row) => row.Race_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Alias SSN',
            selector: (row) => row.AliasSSN,
            sortable: true
        },
        {
            width: '150px',

            name: 'IsAlias',
            selector: (row) => row.IsAlias,
            sortable: true
        },

    ]


    const column2 = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={() => setEditValue(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            width: '150px',

            name: 'Business Name',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Business Type',
            // selector: (row) => row.BusinessType,

            selector: (row) => <>{row?.BusinessType ? row?.BusinessType.substring(0, 10) : ''}{row?.BusinessType?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => <>{row?.OwnerName ? row?.OwnerName.substring(0, 10) : ''}{row?.OwnerName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Business Fax No',
            selector: (row) => row.OwnerFaxNumber,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Phone No',
            selector: (row) => row.OwnerPhoneNumber,
            sortable: true
        },

    ]

    const setEditValue = (row) => {
        Reset ? Reset() : ResetSearch();
        // Reset();
        fetchPostData("MasterName/GetData_EventNameExists", {
            "MasterNameID": row.MasterNameID, "SSN": row.SSN, "IncidentID": MstPage === "MST-Name-Dash" ? '' : mainIncidentID, 'AgencyID': loginAgencyID
        }).then((data) => {
            if (data) {
                if (data[0]?.Total === 0) {
                    setLocalStoreArray({ ...localStoreArray, 'NameID': row.NameID, 'MasterNameID': row.MasterNameID, 'NameStatus': false });
                    if (MstPage === "MST-Name-Dash") {
                        navigate(`/Name-Home?page=MST-Name-Dash&MasterNameID=${stringToBase64(row?.MasterNameID)}&ModNo=${row?.NameIDNumber}&NameStatus=${true}`);
                    }
                    // setEditval(row); 
                    GetSingleData(row.MasterNameID);
                    setNameSearchStatus(false);
                    setUpdateStatus(updateStatus + 1);

                    setMultiSelected({ optionSelected: [], });
                } else {
                    // toastifyError('SSN Already Exists');

                    toastifyError('Name Already Exists in this Incident');

                    setNameSearchStatus(true);
                }
            }
        })
    }

    const GetSingleData = (masterNameID) => {
        // const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        // const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': true }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {

                setEditval(res);
                // setNameSingleData(res);
            } else {
                setEditval([]);
                // setNameSingleData([]) 
            }
        })
    }

    return (
        <>
            {
                nameSearchStatus &&
                <div className="modal fade " style={{ background: "rgba(0,0,0, 0.5)", display: 'block', opacity: '1' }} id="SearchModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header px-3 p-2">
                                <h5 className="modal-title">{nameSearchValue[0]?.NameTypeID === 2 ? 'Business List' : 'Name List'}</h5>
                                <button type="button" onClick={() => { setNameSearchStatus(false); setValue(pre => { return { ...pre, ['SSN']: '' } }); setmasterNameValues(pre => { return { ...pre, ['SSN']: '' } }) }} className="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>

                            </div>
                            <div className="box text-center px-2">
                                <div className="col-12 ">
                                    <DataTable
                                        dense
                                        columns={nameSearchValue[0]?.NameTypeID === 2 ? column2 : columns}
                                        data={nameSearchValue}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                        responsive
                                        fixedHeader
                                        fixedHeaderScrollHeight='400px'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default memo(NameSearchModal)