import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames';
import { useNavigate } from "react-router-dom";
import { colourStyles } from '../../../Common/Utility';
import Select from "react-select";
import useObjState from '../../../../CADHook/useObjState';
import { fetchPostData } from '../../../hooks/Api';
import { useSelector } from 'react-redux';
import CertificationServices from '../../../../CADServices/APIs/certification';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError } from '../../../Common/AlertMsg';
import { isEmpty } from '../../../../CADUtils/functions/common';

const privilegeIndicatorsMap = {
    "NCIC Certification Indicator": "NCICCertification",
    "Counter Terrorism Data Self Search Home Privilege Indicator": "CounterTerrorism",
    "Public Safety Officer Indicator": "PublicSafety",
    "Criminal Investigative Data Self Search Home Privilege Indicator": "CriminalInvestigative",
    "Intelligence Analyst Indicator": "IntelligenceAnalyst",
    "Criminal Intelligence Data Self Search Home Privilege Indicator": "CriminalIntelligence",
    "Sworn Law Enforcement Officer Indicator": "SwornLawEnforcement",
    "Criminal History Data Self Search Home Privilege Indicator": "CounterHistoryData",
    "PCII Certification Indicator": "PCIICertification",
    "NDEx Privilege Indicator": "NDEXPrivilege",
    "28 CFR Certification Indicator": "CFRCertification",
};

const dropDownData = [{ label: "Low", value: 1 }, { label: "Medium", value: 2 }, { label: "High", value: 3 }]
const andOrDropDownData = [{ label: "AND", value: "AND" }, { label: "OR", value: "OR" }]

const CertificationSearchPage = ({ isCAD = false }) => {
    const { setSearchCertificationData } = useContext(AgencyContext);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("basic search");
    const [advanceSearchType, setAdvanceSearchType] = useState("pair search");
    const [isOpen, setIsOpen] = useState(false);
    const [sexList, setSexList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [selectedValues, setSelectedValues] = useState(Array(10).fill({}));
    const [enabledRows, setEnabledRows] = useState([true, ...Array(9).fill(false)]);
    const [select2Errors, setSelect2Errors] = useState(Array(10).fill(false));

    const [
        certificationSearchState,
        setCertificationSearchState,
        handleCertificationSearchState,
        _clearCertificationSearchState,
    ] = useObjState({
        lastName: "",
        firstName: "",
        middleName: "",
        gender: "",
        group: "",
        rank: "",
        pin: "",
        authenticatorAssuranceLevels: "",
        federationAssuranceLevel: "",
        identityAssuranceLevel: "",
        pairSearchSelect1: "",
        pairSearchSelect2: "",
        pairSearchSelect3: "",
        privileges: Object.keys(privilegeIndicatorsMap).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {}),
    });

    const [
        errorState,
        _setErrorState,
        handleErrorState,
        clearErrorState,
    ] = useObjState({
        pairSearchSelect1: false,
        pairSearchSelect2: false,
        pairSearchSelect3: false,
    });

    useEffect(() => {
        if (searchType === "advanced search") {
            setCertificationSearchState((prevState) => ({
                ...prevState,
                privileges: Object.keys(privilegeIndicatorsMap).reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                }, {}),
            }));
        } else if (searchType === "basic search") {
            setCertificationSearchState((prevState) => ({
                ...prevState,
                pairSearchSelect1: "",
                pairSearchSelect2: "",
                pairSearchSelect3: "",
            }));
        }
    }, [searchType]);

    useEffect(() => {
        if (advanceSearchType === "multiple search") {
            setCertificationSearchState((prevState) => ({
                ...prevState,
                privileges: Object.keys(privilegeIndicatorsMap).reduce((acc, key) => {
                    acc[key] = false;
                    return acc;
                }, {}),
                pairSearchSelect1: "",
                pairSearchSelect2: "",
                pairSearchSelect3: "",
            }));
        } else if (advanceSearchType === "pair search") {
            setSelectedValues(Array(10).fill({}));
        }
    }, [advanceSearchType]);

    useEffect(() => {
        if (localStoreData) {
            // setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            getSexList(localStoreData?.AgencyID);
            get_Group_List(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const getSexList = async (aId) => {
        fetchPostData("DropDown/GetData_SexType", { AgencyId: aId })
            .then(response => {
                if (response) setSexList(changeArrayFormat(response, 'genderId'))
                else setSexList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {

                setGroupList(res)
            } else setGroupList()
        })
    }

    const closeDialog = () => setIsOpen(false);

    const handleCheckboxChange = async (event) => {
        const { name, checked } = event.target;
        setCertificationSearchState((prevState) => {
            const updatedState = {
                ...prevState,
                privileges: {
                    ...prevState.privileges,
                    [name]: checked,
                },
            };

            return updatedState;
        });
    };


    const selectOptions = Object.entries(privilegeIndicatorsMap).map(([label, value]) => ({
        label,
        value
    }));

    const handleSelectChange = (value, index, key) => {
        const updatedValues = [...selectedValues];
        const updatedEnabledRows = [...enabledRows];

        if (key === "select2" && !value) {
            updatedValues[index] = { ...updatedValues[index] };
            delete updatedValues[index][key];
            setSelectedValues(updatedValues);
            return;
        }

        if (key === "select1" && !value) {
            for (let i = index; i < 10; i++) {
                updatedValues[i] = {};
                updatedEnabledRows[i + 1] = false;
                if (i > 0) delete updatedValues[i - 1]["select2"];
            }
            updatedEnabledRows[0] = true;

            setSelectedValues(updatedValues);
            setEnabledRows(updatedEnabledRows);
            return;
        }

        updatedValues[index] = { ...updatedValues[index], [key]: value };

        if (key === "select1" && index < 9) {
            updatedEnabledRows[index + 1] = true;
        }

        setSelectedValues(updatedValues);
        setEnabledRows(updatedEnabledRows);
    };

    useEffect(() => {
        const initialEnabledRows = Array(10).fill(false);
        initialEnabledRows[0] = true;
        setEnabledRows(initialEnabledRows);
    }, []);

    const getFilteredOptions = (index) => {
        const selectedValuesSet = new Set(selectedValues.map(option => option?.select1?.value));
        return selectOptions.filter(option => !selectedValuesSet.has(option.value) || selectedValues[index]?.select1?.value === option.value);
    };

    const renderAdvancedSearchInputs = () => {
        const leftSideInputs = Array(10).fill(0).map((_, index) => renderRow(index));

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 row">
                        {leftSideInputs}
                    </div>
                </div>
            </div>
        );
    };


    const generateAdvanceSearchJson = (certificationSearchState) => {
        let advanceSearchJson = [];

        if (certificationSearchState?.pairSearchSelect1) {
            advanceSearchJson.push({
                "ColumnName": certificationSearchState.pairSearchSelect1,
                "Operator": certificationSearchState.pairSearchSelect2 ?? null,
                "Value": true
            });
        }

        if (certificationSearchState?.pairSearchSelect3) {
            advanceSearchJson.push({
                "ColumnName": certificationSearchState.pairSearchSelect3,
                "Operator": "",
                "Value": true
            });
        }

        return advanceSearchJson;
    };

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.forEach((field) => {
            if (
                field === "pairSearchSelect1" &&
                isEmpty(certificationSearchState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "pairSearchSelect2" && isEmpty(certificationSearchState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "pairSearchSelect3" && isEmpty(certificationSearchState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else {
                handleErrorState(field, false);
            }
        });
        return !isError;
    };

    async function openDialog() {
        const isBasicSearchValid = !!certificationSearchState?.firstName || !!certificationSearchState?.lastName || !!certificationSearchState?.pin || !!certificationSearchState?.gender || !!certificationSearchState?.group || !!certificationSearchState?.pairSearchSelect1 || !!certificationSearchState?.pairSearchSelect2 || !!certificationSearchState?.pairSearchSelect3
        const arePrivilegesValid = Object.values(certificationSearchState.privileges).includes(true);
        const isSelectedValuesValid = selectedValues.some(item => item.select1?.value);
        if (!isBasicSearchValid && !arePrivilegesValid && !isSelectedValuesValid) {
            toastifyError("Please enter details");
            return;
        }

        try {
            if (searchType === "basic search") {
                const payload = {
                    AgencyID: loginAgencyID,
                    FirstName: certificationSearchState?.firstName || null,
                    LastName: certificationSearchState?.lastName || null,
                    MiddleName: certificationSearchState?.middleName || null,
                    PIN: certificationSearchState?.pin || null,
                    SexID: certificationSearchState?.gender || null,
                    GROUPID: certificationSearchState?.group || null,
                    IsAdvanceSearch: false,
                    AuthenticatorAssuranceLevel: certificationSearchState?.authenticatorAssuranceLevels || null,
                    FederationAssuranceLevel: certificationSearchState?.federationAssuranceLevel || null,
                    IdentityAssuranceLevel: certificationSearchState?.identityAssuranceLevel || null,
                };

                Object.keys(privilegeIndicatorsMap).forEach((key) => {
                    if (certificationSearchState.privileges[key]) {
                        payload[privilegeIndicatorsMap[key]] = true;
                    }
                });

                try {
                    const response = await CertificationServices.searchCertification(payload);
                    if (response?.status === 200) {
                        const data = JSON.parse(response?.data?.data);
                        setSearchCertificationData(data?.Table);
                        navigate('/certification-SearchList');
                    } else {
                        throw new Error("Data Not Available");
                    }
                } catch (error) {
                    setSearchCertificationData([]);
                    toastifyError("Data Not Available");
                }

            } else if (searchType === "advanced search") {
                if (advanceSearchType === "pair search") {
                    if (!validation()) return;
                    const payload = {
                        AgencyID: loginAgencyID,
                        FirstName: certificationSearchState?.firstName || null,
                        LastName: certificationSearchState?.lastName || null,
                        MiddleName: certificationSearchState?.middleName || null,
                        PIN: certificationSearchState?.pin || null,
                        SexID: certificationSearchState?.gender || null,
                        GROUPID: certificationSearchState?.group || null,
                        AuthenticatorAssuranceLevel: certificationSearchState?.authenticatorAssuranceLevels || null,
                        FederationAssuranceLevel: certificationSearchState?.federationAssuranceLevel || null,
                        IdentityAssuranceLevel: certificationSearchState?.identityAssuranceLevel || null,
                        IsAdvanceSearch: true,
                        AdvanceSearchJson: generateAdvanceSearchJson(certificationSearchState),
                    };

                    try {
                        const response = await CertificationServices.searchCertification(payload);
                        if (response?.status === 200) {
                            const data = JSON.parse(response?.data?.data);
                            setSearchCertificationData(data?.Table);
                            clearErrorState();
                            navigate('/certification-SearchList');
                        } else {
                            throw new Error("Data Not Available");
                        }
                    } catch (error) {
                        setSearchCertificationData([]);
                        clearErrorState();
                        toastifyError("Data Not Available");
                    }

                } else {
                    const updatedErrors = Array(10).fill(false);
                    let hasError = false;
                    let count = 0;

                    selectedValues.forEach(item => {
                        if (item.select1?.value) {
                            count++;
                        }
                    });

                    for (let i = 0; i < 9; i++) {
                        if (enabledRows[i] && !selectedValues[i]?.select2 && selectedValues[i + 1]?.select1) {
                            updatedErrors[i] = true;
                            hasError = true;
                        }
                    }

                    setSelect2Errors(updatedErrors);

                    if (!hasError) {
                        if (count > 2) {
                            const payload = {
                                AgencyID: loginAgencyID,
                                FirstName: certificationSearchState?.firstName || null,
                                LastName: certificationSearchState?.lastName || null,
                                MiddleName: certificationSearchState?.middleName || null,
                                PIN: certificationSearchState?.pin || null,
                                SexID: certificationSearchState?.gender || null,
                                GROUPID: certificationSearchState?.group || null,
                                AuthenticatorAssuranceLevel: certificationSearchState?.authenticatorAssuranceLevels || null,
                                FederationAssuranceLevel: certificationSearchState?.federationAssuranceLevel || null,
                                IdentityAssuranceLevel: certificationSearchState?.identityAssuranceLevel || null,
                                IsAdvanceSearch: true,
                                AdvanceSearchJson: selectedValues
                                    .filter(item => item.select1)
                                    .map(item => ({
                                        ColumnName: item?.select1?.value,
                                        Operator: item?.select2 ? item?.select2?.value : "",
                                        Value: true
                                    }))
                            };

                            try {
                                const response = await CertificationServices.searchCertification(payload);
                                if (response?.status === 200) {
                                    const data = JSON.parse(response?.data?.data);
                                    setSearchCertificationData(data?.Table);
                                    navigate('/certification-SearchList');
                                } else {
                                    throw new Error("Data Not Available");
                                }
                            } catch (error) {
                                setSearchCertificationData([]);
                                toastifyError("Data Not Available");
                            }

                        } else {
                            setIsOpen(true);
                        }
                    }
                }
            }
        } catch (error) {
            setSearchCertificationData([]);
            toastifyError("Data Not Available");
        }
    }


    const renderRow = (index) => (
        <div key={index} className="row col-6">
            <div className="col-2 mt-2">
                <label htmlFor={`select-${index}-1`} className="new-label">Select</label>
            </div>
            <div className="col-6 mt-1">
                <Select
                    name={`select-${index}-1`}
                    value={selectedValues[index]?.select1 || null}
                    options={getFilteredOptions(index)}
                    onChange={(value) => handleSelectChange(value, index, "select1")}
                    isClearable
                    placeholder="Select..."
                    isDisabled={!enabledRows[index]}
                />
            </div>
            {index !== 9 && (
                <div className="col-4 mt-1">
                    <Select
                        name={`select-${index}-2`}
                        value={selectedValues[index]?.select2 || null}
                        options={andOrDropDownData}
                        onChange={(value) => handleSelectChange(value, index, "select2")}
                        isClearable
                        placeholder="Select..."
                        isDisabled={!enabledRows[index + 1] || !selectedValues[index + 1]?.select1}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: !enabledRows[index + 1] || !selectedValues[index + 1]?.select1 ? "" : "#fce9bf",
                                minHeight: 35,
                                height: 20,
                                fontSize: 14,
                                margintop: 2,
                                boxShadow: 0,
                                borderColor: select2Errors[index] ? 'red' : base.borderColor,
                            }),
                        }}
                    />
                </div>
            )}
        </div>
    );



    const onClose = () => {
        if (isCAD) {
            navigate('/cad/query_incident');
        } else {
            navigate('/dashboard-page');
        }
    }

    const privilegeOptions = Object.entries(privilegeIndicatorsMap).map(([label, value]) => ({
        label,
        value,
    }));
    const filteredOptions1 = privilegeOptions.filter(item => item.value !== certificationSearchState.pairSearchSelect3);
    const filteredOptions2 = privilegeOptions.filter(item => item.value !== certificationSearchState.pairSearchSelect1);

    return (
        <div className=" section-body pt-3 p-1 bt" >
            <div className="dark-row" >
                <div className={classNames("card Agency", { "incident-card": !isCAD })}>
                    <div className="card-body" >
                        <div className="row ">
                            <div className="col-12 ">
                                <fieldset >
                                    <legend>Certification</legend>
                                    <div className="row ">
                                        <div className="col-1 col-md-1 col-lg-1  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 text-field ">
                                            <input type="text" name='lastName' value={certificationSearchState?.lastName} onChange={(e) => handleCertificationSearchState("lastName", e.target.value)} />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 text-field ">
                                            <input type="text" name='firstName' value={certificationSearchState?.firstName} onChange={(e) => handleCertificationSearchState("firstName", e.target.value)} />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1  mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Middle Name</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 text-field ">
                                            <input type="text" name='middleName' value={certificationSearchState?.middleName} onChange={(e) => handleCertificationSearchState("middleName", e.target.value)} />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1 mt-2  pt-2">
                                            <label htmlFor="gender" className='new-label'>Gender</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-1 pt-2">
                                            <Select
                                                name=''
                                                value={sexList?.find((obj) => obj.value === certificationSearchState?.value)}
                                                options={sexList}
                                                onChange={(e) => { handleCertificationSearchState("gender", e?.value) }}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1  mt-2 pt-2">
                                            <label htmlFor="group" className='new-label'>Group</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-2">
                                            <Select
                                                name=''
                                                value={groupList?.find((i) => i?.GroupID === certificationSearchState.group)}
                                                options={groupList}
                                                onChange={(e) => { handleCertificationSearchState("group", e?.GroupID) }}
                                                getOptionLabel={(v) => v?.GroupName}
                                                getOptionValue={(v) => v?.GroupID}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1 mt-2 pt-2">
                                            <label htmlFor="rank" className='new-label'>Rank</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-2">
                                            <Select
                                                name=''
                                                value={certificationSearchState.rank}
                                                options={[]}
                                                onChange={(e) => { handleCertificationSearchState("rank", e) }}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1 mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Pin</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 text-field ">
                                            <input type="text" id='pin' name='pin' value={certificationSearchState.pin} onChange={(e) => handleCertificationSearchState("pin", e.target.value)} />
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Privilege Indicators</legend>
                                    <div className="row">
                                        {["Basic Search", "Advanced Search"].map((type, index) => (
                                            <div
                                                key={index}
                                                className="col-2 col-md-2 col-lg-2 mt-2 pt-2 d-flex align-items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    name="searchType"
                                                    id={type.toLowerCase()}
                                                    value={type.toLowerCase()}
                                                    checked={searchType === type.toLowerCase()}
                                                    onChange={() => setSearchType(type.toLowerCase())}
                                                    className="mr-2"
                                                />
                                                <label for={type.toLowerCase()} className="new-label" style={{ margin: "0" }} aria-label={type}>
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {searchType === "basic search" ? (
                                        <div className="row mt-2">{
                                            Object.keys(privilegeIndicatorsMap)?.map((item, index) => (
                                                <div className="col-6 mt-1" key={index}>
                                                    <input
                                                        type="checkbox"
                                                        name={item}
                                                        id={item}
                                                        checked={certificationSearchState?.privileges[item] || false}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    <label className="ml-2" htmlFor={item}>
                                                        {item}
                                                    </label>
                                                </div>
                                            ))
                                        }</div>
                                    ) : (
                                        <div className="px-2 pb-3 mt-2" style={{ border: "1px solid #bbc9dc" }}>
                                            <div className="row">
                                                {["Pair Search", "Multiple Search"].map((type, index) => (
                                                    <div
                                                        key={index}
                                                        className="col-2 col-md-2 col-lg-2 mt-2 pt-2 d-flex align-items-center"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="advanceSearchType"
                                                            id={type.toLowerCase()}
                                                            value={type.toLowerCase()}
                                                            checked={advanceSearchType === type.toLowerCase()}
                                                            onChange={() => setAdvanceSearchType(type.toLowerCase())}
                                                            className="mr-2"
                                                        />
                                                        <label className="new-label" style={{ margin: "0" }} for={type.toLowerCase()} aria-label={type}>
                                                            {type}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            {advanceSearchType === "pair search" ? (
                                                <div className="row">
                                                    <div className="col-1 col-md-1 col-lg-1 mt-2">
                                                        <label htmlFor="select" className="new-label">
                                                            Select
                                                        </label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                        <Select
                                                            name="privilege"
                                                            options={filteredOptions1}
                                                            onChange={(e) => handleCertificationSearchState("pairSearchSelect1", e?.value)}
                                                            value={privilegeOptions?.find(item => item.value === certificationSearchState.pairSearchSelect1)}
                                                            styles={colourStyles}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-2 mt-1">
                                                        <Select
                                                            name=""
                                                            options={andOrDropDownData}
                                                            isDisabled={!certificationSearchState.pairSearchSelect3}
                                                            onChange={(e) => handleCertificationSearchState("pairSearchSelect2", e?.value)}
                                                            value={andOrDropDownData?.find(item => item.value === certificationSearchState.pairSearchSelect2)}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !certificationSearchState.pairSearchSelect3 || !certificationSearchState.pairSearchSelect3 ? "" : "#fce9bf",
                                                                    minHeight: 35,
                                                                    height: 20,
                                                                    fontSize: 14,
                                                                    margintop: 2,
                                                                    boxShadow: 0,
                                                                    borderColor: errorState?.pairSearchSelect2 ? 'red' : base.borderColor,
                                                                }),
                                                            }}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                    <div className="col-1 col-md-1 col-lg-1 mt-2">
                                                        <label htmlFor="select" className="new-label">
                                                            Select
                                                        </label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                        <Select
                                                            name=""
                                                            options={filteredOptions2}
                                                            onChange={(e) => handleCertificationSearchState("pairSearchSelect3", e?.value)}
                                                            isDisabled={!certificationSearchState.pairSearchSelect1}
                                                            value={privilegeOptions?.find(item => item.value === certificationSearchState.pairSearchSelect3)}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    backgroundColor: !certificationSearchState.pairSearchSelect1 || !certificationSearchState.pairSearchSelect1 ? "" : "#fce9bf",
                                                                    minHeight: 35,
                                                                    height: 20,
                                                                    fontSize: 14,
                                                                    margintop: 2,
                                                                    boxShadow: 0,
                                                                    borderColor: errorState?.pairSearchSelect3 ? 'red' : base.borderColor,
                                                                }),
                                                            }}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                renderAdvancedSearchInputs()
                                            )}
                                        </div>
                                    )}
                                </fieldset>
                                <fieldset >
                                    <legend>Assurance Level</legend>
                                    <div className="row ">
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label text-nowrap'>Authenticator Assurance Levels</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-1">
                                            <Select
                                                name=''
                                                options={dropDownData}
                                                value={certificationSearchState.authenticatorAssuranceLevels ? dropDownData?.find(item => item.value === certificationSearchState.authenticatorAssuranceLevels) : null}
                                                onChange={(e) => handleCertificationSearchState("authenticatorAssuranceLevels", e?.value)}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Federation Assurance Level
                                            </label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-1">
                                            <Select
                                                name=''
                                                options={dropDownData}
                                                value={certificationSearchState.federationAssuranceLevel ? dropDownData?.find(item => item.value === certificationSearchState.federationAssuranceLevel) : null}
                                                onChange={(e) => handleCertificationSearchState("federationAssuranceLevel", e?.value)}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Identity Assurance Level</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-1">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable
                                                options={dropDownData}
                                                value={certificationSearchState.identityAssuranceLevel ? dropDownData?.find(item => item.value === certificationSearchState.identityAssuranceLevel) : null}
                                                onChange={(e) => handleCertificationSearchState("identityAssuranceLevel", e?.value)}
                                                styles={colourStyles}
                                                placeholder="Select..."
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                    <div className="btn-box text-right  mr-1 mb-2">
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={openDialog}
                            data-toggle="modal"
                            data-target="#SearchModal"
                        >
                            Search
                        </button>
                        <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-2" onClick={() => { onClose(); }}>Close</button>
                    </div>
                </div>
            </div >
            <SearchPopUp isOpen={isOpen} closeDialog={closeDialog} />
        </div >
    )
}

export default CertificationSearchPage

const SearchPopUp = ({ isOpen, closeDialog }) => {
    return (
        <>
            {isOpen && (
                <dialog
                    className="modal fade"
                    style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
                    id="SearchModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-backdrop="false"
                >
                    <div className="modal-dialog modal-md modal-dialog-centered rounded">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="m-1 mt-3">
                                    <p>You must select at least three search conditions to perform a search. If you need to search using only two fields, you can utilize the pair search option.</p>
                                </div>
                                <div className="btn-box text-center mt-3 mr-1">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mr-2"
                                        onClick={closeDialog}
                                    >
                                        Ok
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
export const changeArrayFormat = (data, type) => {
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.Name })
        )
        return result
    }
    if (type === 'rank') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RankID, label: sponsor.RankDescription })
        )
        return result
    }
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        return result
    }
    if (type === 'photoType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PhotoTypeId, label: sponsor.PhotoType })
        )
        return result
    }
    if (type === 'genderId') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SexCodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'EmployeeType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EmployeeTypeID, label: sponsor.Description })
        )
        return result
    }
}
