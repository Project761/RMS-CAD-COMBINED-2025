
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchData, fetchPostData, fetch_Post_Data } from '../../../../hooks/Api';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { Filter } from '../../../../Filter/Filter';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useSelector, useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { RequiredField } from '../../Personnel/Validation';
import Select from 'react-select'
import SelectBox from '../../../../Common/SelectBox';
import { threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';

const MeasurementUnit = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [courtNameData, setCourtNameData] = useState();
    const [status, setStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState("1");
    const [modal, setModal] = useState(false)
    // FilterData 
    const [filterCourtNameCode, setFilterCourtNameCode] = useState('Contains');
    const [filterCourtName, setFilterCourtName] = useState('Contains');
    const [courtNameFilterData, setCourtNameFilterData] = useState();
    const [courtNameStatus, setCourtNameStatus] = useState(0);
    //filter SearchVal
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [isSuperadmin, setIsSuperadmin] = useState(0);
    const [clickedRow, setClickedRow] = useState(null);
    const [isActive, setIsActive] = useState('')
    const [MeasurementUnitID, setMeasurementUnitID] = useState('')
    const [confirmType, setConfirmType] = useState('')
    const [agencyData, setAgencyData] = useState([])
    const [courtNameEditVal, setCourtNameEditVal] = useState();
    const [MeasurementUnitVal, setMeasurementUnitVal] = useState([]);
    const [gangInfoVal, setGangInfoVal] = useState([]);

    const [value, setValue] = useState({
        'AgencyID': '', 'Description': '', 'CreatedByUserFK': '', 'MultiAgency_Name': '', 'IsEditable': '', 'DrugTypeID': '',
    });

    const [errors, setErrors] = useState({ 'DescriptionError': '', })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            getMeasurementUnitDrpDwnVal(localStoreData?.AgencyID); get_data_CourtName(localStoreData?.AgencyID, localStoreData?.PINID,);
        }
    }, [localStoreData, pageStatus]);

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    useEffect(() => {
        getAgency(loginAgencyID, loginPinID);
        if (agencyData?.length === 0 && modal) {
            if (loginPinID && loginAgencyID) { setValue({ ...value, 'CreatedByUserFK': loginPinID, }) }
        }
    }, [modal, loginAgencyID])

    useEffect(() => {
        if (MeasurementUnitID) {
            GetSingledataCourtName()
        }
    }, [MeasurementUnitID, courtNameStatus])

    const GetSingledataCourtName = () => {
        const val = { 'MeasurementUnitID': MeasurementUnitID }
        fetchPostData('MeasurementUnit/GetSingleData_MeasurementUnit', val)
            .then((res) => {
                if (res) { setCourtNameEditVal(res) }
                else { setCourtNameEditVal() }
            })
    }

    const get_data_CourtName = (loginAgencyID, loginPinID) => {
        const val = { IsActive: pageStatus, AgencyID: loginAgencyID, PINID: loginPinID, }
        fetch_Post_Data('MeasurementUnit/GetData_MeasurementUnit', val)
            .then((res) => {
                if (res) {
                    setCourtNameData(res?.Data); setCourtNameFilterData(res?.Data);
                }
                else {
                    setCourtNameData(); setCourtNameFilterData();
                }
            })
    }

    const getMeasurementUnitDrpDwnVal = (AgencyID) => {
        const val = { AgencyID: AgencyID, }
        fetchPostData('PropertyDrugMeasure/GetDataDropDown_PropertyDrugMeasure', val).then((data) => {
            if (data) {
                setMeasurementUnitVal(threeColArrayWithCode(data, 'PropertyDrugMeasureID', 'Description', 'PropertyDrugMeasureCode'))
            }
            else { setMeasurementUnitVal([]); }
        })
    }
    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "MeasurementUnitID": courtNameEditVal[0]?.MeasurementUnitID,
                "Description": courtNameEditVal[0]?.Description, 'MultiAgency_Name': courtNameEditVal[0]?.MultiAgency_Name,
                'IsEditable': courtNameEditVal[0]?.IsEditable === '0' ? false : true, 'DrugTypeID': courtNameEditVal[0]?.DrugTypeID,
                'IsActive': courtNameEditVal[0]?.IsActive, 'AgencyName': courtNameEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(courtNameEditVal[0]?.MultipleAgency) : '', 'ModifiedByUserFK': loginPinID,
            }); setMultiSelected({ optionSelected: courtNameEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(courtNameEditVal[0]?.MultipleAgency) : '', });
            setGangInfoVal(filterGangsUsingIncludes(MeasurementUnitVal, courtNameEditVal[0]?.DrugTypeID));
        }
        else {
            setValue({ 'MultiAgency_Name': '', 'IsEditable': 0, "Description": '', 'AgencyID': '', 'ModifiedByUserFK': '', 'DrugTypeID': '', });
            setMultiSelected({ optionSelected: null }); setGangInfoVal([]);
        }
    }, [courtNameEditVal])


    const check_Validation_Error = (e) => {
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true') {
            if (status) { Update_CourtName() }
            else { Add_CourtName() }
        }
    }, [DescriptionError,])


    const UpdActiveDeactive = () => {
        const value = { 'IsActive': isActive, 'MeasurementUnitID': MeasurementUnitID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MeasurementUnit/DeleteMeasurementUnit', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message); get_data_CourtName(loginAgencyID, loginPinID);
                    setModal(false); setStatusFalse(); setSearchValue1(''); setSearchValue2('');
                } else { toastifyError(res.data.Message) }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const reset = () => {
        setValue({ ...value, 'MultiAgency_Name': '', 'IsEditable': 0, "Description": '', 'AgencyID': '', 'ModifiedByUserFK': '', 'DrugTypeID': '', });
        setMultiSelected({ optionSelected: null }); setErrors({ ...errors, 'DescriptionError': '', }); setGangInfoVal([]);
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const getAgency = async (loginAgencyID, loginPinID) => {
        const value = { AgencyID: loginAgencyID, PINID: loginPinID, }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'IsEditable') {
            setValue({ ...value, [e.target.name]: e.target.checked, });
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value, });
        }
    }

    const Agencychange = (multiSelected) => {
        setMultiSelected({
            optionSelected: multiSelected
        });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    const Add_CourtName = (e) => {
        const result1 = courtNameData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        }
        );
        if (result1) {
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('MeasurementUnit/InsertMeasurementUnit', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                setModal(false); get_data_CourtName(loginAgencyID, loginPinID,); reset();
            })
        }
    }

    const Update_CourtName = () => {
        const result1 = courtNameData?.find(item => {
            if (item.MeasurementUnitID != value.MeasurementUnitID) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        }
        );
        if (result1) {
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('MeasurementUnit/UpdateMeasurementUnit', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_CourtName(loginAgencyID, loginPinID,); setModal(false); setStatus(true);
                reset(); setStatusFalse()
            })
        }
    }


    // Table Columns Array
    const columns = [
        {
            name: 'Description', selector: (row) => row.Description, sortable: true
        },
        {
            name: 'Agency',
            selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'IsEditable', selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 40 }}>
                    {
                        pageStatus === "1" ? (
                            <Link
                                to="/ListManagement?page=Measurement Unit"
                                data-toggle="modal"
                                data-target="#ConfirmModal"
                                onClick={(e) => {
                                    setMeasurementUnitID(row.MeasurementUnitID);
                                    setIsActive('0');
                                    setConfirmType("InActive");
                                }}
                                className="btn btn-sm text-white px-1 py-0 mr-1"
                                style={{ background: "#ddd" }}
                            >
                                <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                            </Link>
                        ) : (
                            <Link
                                to="/ListManagement?page=Measurement Unit"
                                data-toggle="modal"
                                data-target="#ConfirmModal"
                                onClick={(e) => {
                                    setMeasurementUnitID(row.MeasurementUnitID);
                                    setIsActive('1');
                                    setConfirmType("Active");
                                }}
                                className="btn btn-sm text-white px-1 py-0 mr-1"
                                style={{ background: "#ddd" }}
                            >
                                <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                            </Link>
                        )
                    }

                </div>

        }
    ]

    const checkEdittable = (val) => { const check = { "1": true, "0": false }; return check[val] }

    const setEditValue = (row) => {
        setCourtNameStatus(courtNameStatus + 1);
        setModal(true); setStatus(true); setMeasurementUnitID(row?.MeasurementUnitID); reset();
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setMeasurementUnitID(); setModal(true); reset();
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 32,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];


    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else { setValue({ ...value, [name]: null }) }
    }

    useEffect(() => {
        if (courtNameEditVal?.length > 0 && MeasurementUnitVal?.length > 0) {
            const selectedGangs = MeasurementUnitVal?.filter((option) =>
                courtNameEditVal[0]?.DrugTypeID?.split(",")?.includes(option?.value?.toString())
            );
            setGangInfoVal(selectedGangs);
        }
    }, [courtNameEditVal, MeasurementUnitVal]);

    const filterGangsUsingIncludes = (options, selectedIds) => {
        if (!selectedIds) return [];
        const selectedIdArray = selectedIds?.split(",");
        return options?.filter((option) =>
            selectedIdArray?.includes(option?.value?.toString())
        );
    };


    const onChangeGangInfo = (e, name) => {
        const id = [];
        if (e) {
            e.map((item, i) => { id.push(item.value); });
            setGangInfoVal(e);
            setValue({ ...value, [name]: id.toString() });
        } else {
            setValue({ ...value, [name]: null });
        }
    };



    return (

        <>
            <div className="row" style={{ marginTop: '-25px', marginLeft: '-18px' }}>
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 px-1 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">Measurement Unit</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 incident-tab mt-1 px-1">
                    <ul className="nav nav-tabs mb-1 " id="myTab" role="tablist">
                        <span className={`nav-item ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("1"); setStatusFalse(); setSearchValue1(''); setSearchValue2(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '1' ? 'Red' : '' }}>Active</span>

                        <span className={`nav-item ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("0"); setStatusFalse(); setSearchValue1(''); setSearchValue2(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '0' ? 'Red' : '' }}>InActive</span>
                    </ul>
                </div>

                <div className="col-12 mt-2 ">
                    {
                        pageStatus === '1' ?
                            <>
                                <div className="row ">
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Description {errors.DescriptionError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-5 mt-1 text-field">
                                        <textarea className='requiredColor' name='Description'
                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false}
                                            onChange={handlChanges} value={value?.Description} required cols="30" rows="1"></textarea>
                                    </div>
                                    <div className="col mt-2 ">
                                        <label htmlFor="" className='new-label text-nowrap '>Measurement Unit</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                                        <Select
                                            name='DrugTypeID'
                                            styles={customStylesWithOutColor}
                                            value={gangInfoVal}
                                            isClearable
                                            isMulti
                                            onChange={(e) => onChangeGangInfo(e, "DrugTypeID")}
                                            options={MeasurementUnitVal}
                                            placeholder="Select..."
                                        />
                                    </div>
                                    <div className='col-2 col-md-2 col-lg-1'></div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Agency</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-9 mt-1 ">
                                        {
                                            value?.AgencyName ?
                                                <SelectBox
                                                    options={agencyData}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    onChange={Agencychange}
                                                    allowSelectAll={true}
                                                    value={multiSelected.optionSelected}
                                                /> : <SelectBox
                                                    options={agencyData}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={false}
                                                    onChange={Agencychange}
                                                    allowSelectAll={true}
                                                    value={multiSelected.optionSelected}
                                                />

                                        }
                                    </div>
                                    <div className="col-2 mt-2">
                                        <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                            onChange={handlChanges}
                                            id="IsEditable" />
                                        <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                    </div>


                                </div>
                                <div className="text-right mt-2">
                                    <div className="btn-box mb-1  mr-1 bb" >
                                        <button type="button" className="btn btn-sm btn-success mb-1 mr-2 text-right " data-dismiss="modal" onClick={() => { setStatusFalse(); }}
                                        >New</button>
                                       
                                        {
                                            status ?

                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Update</button>
                                                :
                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Save</button>

                                        }
                                    </div>
                                </div>

                            </>
                            : <></>
                    }




                    <div className="row mt-1 ">
                        <div className="col-5">
                            <input type="text" value={searchValue1} onChange={(e) => {
                                setSearchValue1(e.target.value);
                                const result = Filter(courtNameData, e.target.value, searchValue2, filterCourtNameCode, 'CourtNameCode', 'Description')
                                setCourtNameFilterData(result)
                            }}
                                className='form-control' placeholder='Search By Code...' />
                        </div>
                        <div className='col-1 '>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <i className="fa fa-filter"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setFilterCourtNameCode('Contains')}>Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtNameCode('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtNameCode('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtNameCode('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtNameCode('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-5">
                            <input type="text" value={searchValue2} onChange={(e) => {
                                setSearchValue2(e.target.value)
                                const result = Filter(courtNameData, searchValue1, e.target.value, filterCourtName, 'CourtNameCode', 'Description')
                                setCourtNameFilterData(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>
                        <div className='col-1'>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    <i className="fa fa-filter"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setFilterCourtName('Contains')}>Contains</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtName('is equal to')}>is equal to</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtName('is not equal to')}>is not equal to </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtName('Starts With')}>Starts With</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setFilterCourtName('End with')}>End with</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className=" col-12 table-responsive mt-2">

                    <DataTable
                        columns={columns}
                        data={courtNameFilterData}
                        dense
                        paginationPerPage={'10'}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        fixedHeader
                        conditionalRowStyles={conditionalRowStyles}
                        onRowClicked={(row) => {
                            setEditValue(row); setClickedRow(row);
                        }}
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        fixedHeaderScrollHeight='140px'
                        noDataComponent={'There are no data to display'}
                    />
                </div>



            </div >
            < ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default MeasurementUnit

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
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }

}

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            (sponsor.StateId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            (sponsor.CityId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            (sponsor.ZipId)
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }
}
