import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { Decrypt_Id_Name, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_AgencyOfficer_Data, get_Eye_Color_Drp_Data, get_Hair_Color_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat_With_Name } from '../../../../Common/ChangeArrayFormat';
import { AddDelete_Img, AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const MugShorts = (props) => {

    const { DecArrestId, DecMasterNameID, DecIncID, isViewEventDetails = false } = props

    const { setChangesStatus, get_Arrest_Count } = useContext(AgencyContext)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const eyeColorDrpData = useSelector((state) => state.DropDown.eyeColorDrpData);
    const hairColorDrpData = useSelector((state) => state.DropDown.hairColorDrpData);

    const [status, setStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [warrentTypeData, setWarrentTypeData] = useState([])
    const [editval, setEditval] = useState();
    const [openPage, setOpenPage] = useState('');
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [ComplexionColoIDDrp, setComplexionColoIDDrp] = useState([]);
    const [HairStyleIDDrp, setHairStyleIDDrp] = useState([]);
    const [HairLengthIDDrp, setHairLengthIDDrp] = useState([]);
    const [HairShadeIDDrp, setHairShadeIDDrp] = useState([]);
    const [BodyBuildIDDrp, setBodyBuildIDDrp] = useState([]);
    const [MugshotID, setMugshotID] = useState('')

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const [value, setValue] = useState({
        'ArrestID': '', 'EyeColorID': '', 'Weight': '', 'Height': '', 'HairColorID': '', 'HairStyleID': '', 'HairLengthID': '', 'HairShadeID': '', 'BodyBuildTypeID': '', 'Complexion': '', 'FrontImage': '', 'LeftImage': '', 'RightImage': '', 'EnterImage': '', 'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'EyeColorIDErrors': '', 'WeightErrors': '', 'HeightErrors': '', 'HairColorIDErrors': '',
    })

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N135", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

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
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (openPage || loginAgencyID) {
            if (eyeColorDrpData?.length === 0) dispatch(get_Eye_Color_Drp_Data(loginAgencyID))
            if (hairColorDrpData?.length === 0) dispatch(get_Hair_Color_Drp_Data(loginAgencyID))
            get_mugShort_Drp_Data(loginAgencyID); get_Arrest_Count(DecArrestId);
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecIncID))
        }
    }, [openPage, loginAgencyID]);

    useEffect(() => {
        if (DecArrestId) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'ArrestID': DecArrestId } });
            GetData_Mugshots_Data(DecArrestId, DecMasterNameID);
        }
    }, [DecArrestId]);


    const GetSingleData = (MugshotID) => {
        const val = { MugshotID: MugshotID, }
        fetchPostData('Mugshots/GetSingleData_Mugshots', val)
            .then((res) => {
                if (res) setEditval(res)
                else { setEditval() }
            })
    }

    useEffect(() => {
        if (status && Array?.isArray(editval) && editval?.length > 0) {
            setValue({
                ...value,
                MugshotID: MugshotID, FrontMugshot: editval[0]?.FrontImage || '', LeftMugshot: editval[0]?.LeftImage || '', RightMugshot: editval[0]?.RightImage || '', EnterMugshot: editval[0]?.EnterImage || '', EyeColorID: editval[0]?.EyeColorID || '', Height: editval[0]?.Height || '',
                Weight: editval[0]?.Weight || '', HairColorID: editval[0]?.HairColorID || '', HairStyleID: editval[0]?.HairStyleID || '', HairLengthID: editval[0]?.HairLengthID || '', HairShadeID: editval[0]?.HairShadeID || '', BodyBuildTypeID: editval[0]?.BodyBuildTypeID || '', Complexion: Number(editval[0]?.Complexion) || '', ModifiedByUserFK: loginPinID,
            });
        } else {
            setValue({
                ...value,
                'EyeColorID': '', 'Weight': '', 'Height': '', 'HairColorID': '', 'HairStyleID': '', 'HairLengthID': '', 'HairShadeID': '', 'BodyBuildTypeID': '', 'Complexion': '', 'FrontImage': '', 'LeftImage': '', 'RightImage': '', 'EnterImage': '',
            })
        }
    }, [editval])

    const get_mugShort_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetAppearanceDropDown', val).then((data) => {
            if (data) {
                setComplexionColoIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.ComplexionType, "ComplexionID", "Description",));
                setHairStyleIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.HairStyle, "HairStyleID", "Description",));
                setBodyBuildIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.BodyBuild, "BodyBuildID", "Description",));
                setHairLengthIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.HairLength, "HairLengthID", "Description",));
                setHairShadeIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.HairShades, "HairShadeID", "Description",));
            }
            else { setHairStyleIDDrp([]); setBodyBuildIDDrp([]); setHairLengthIDDrp([]); setHairShadeIDDrp([]); }
        })
    };

    const GetData_Mugshots_Data = (ArrestID) => {
        const val = { ArrestID: ArrestID }
        fetchPostData('Mugshots/GetData_Mugshots', val).then((res) => {
            if (res) {
                setWarrentTypeData(res)
            } else {
                setWarrentTypeData([]);
            }
        })
    }

    const check_Validation_Error = (e) => {
        const EyeColorIDErrors = RequiredFieldIncident(value.EyeColorID);
        const WeightErrors = RequiredFieldIncident(value.Weight);
        const HeightErrors = RequiredFieldIncident(value.Height);
        const HairColorIDErrors = RequiredFieldIncident(value.HairColorID);
        setErrors(pre => {
            return {
                ...pre,
                ['EyeColorIDErrors']: EyeColorIDErrors || pre['EyeColorIDErrors'],
                ['WeightErrors']: WeightErrors || pre['WeightErrors'],
                ['HeightErrors']: HeightErrors || pre['HeightErrors'],
                ['HairColorIDErrors']: HairColorIDErrors || pre['HairColorIDErrors'],
            }
        });
    }
    const { EyeColorIDErrors, HairColorIDErrors, HeightErrors, WeightErrors } = errors

    useEffect(() => {
        if (EyeColorIDErrors === 'true' && HairColorIDErrors === 'true' && HeightErrors === 'true' && WeightErrors === 'true') {
            if (MugshotID && status) { update_MugShorts() }
            else { Add_MugShorts() }
        }
    }, [EyeColorIDErrors, HairColorIDErrors, HeightErrors, WeightErrors])

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    const columns = [
        {
            name: 'Eye Color', selector: (row) => row.EyeColor, sortable: true
        },
        {
            name: 'Hair color', selector: (row) => row.HairColor, sortable: true
        },
        {
            name: 'Complexion', selector: (row) => row.Complexion_Desc, sortable: true
        },
        {
            name: 'Hair Shade', selector: (row) => row.HairShade,
            format: (row) => (<>{row?.HairShade ? row?.HairShade.substring(0, 30) : ''}{row?.HairShade?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: 'Body build', selector: (row) => row.BodyBuildType, sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {/* {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setMugshotID(row.MugshotID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={() => { setMugshotID(row.MugshotID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    } */}
                    <span onClick={() => { setMugshotID(row.MugshotID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </span>
                </div>
        }
    ]

    const setStatusFalse = () => {
        reset(); setStatesChangeStatus(false); setChangesStatus(false); setStatus(false);
        setUpdateStatus(updateStatus + 1); setClickedRow(null); setMugshotID([])
    }
    const reset = () => {
        setValue({
            ...value, 'EyeColorID': '', 'Weight': '', 'Height': '', 'HairColorID': '', 'HairStyleID': '', 'HairLengthID': '', 'HairShadeID': '', 'BodyBuildTypeID': '', 'Complexion': '', 'FrontImage': '', 'LeftImage': '', 'RightImage': '', 'EnterImage': '', FrontMugshot: null, LeftMugshot: null, RightMugshot: null, EnterMugshot: null
        }); setErrors({ ...errors, 'EyeColorIDErrors': '', 'WeightErrors': '', 'HeightErrors': '', 'HairColorIDErrors': '', });
        setMugshotID([])
    }

    const set_Edit_Value = (row) => {
        setStatus(true); setUpdateStatus(updateStatus + 1); setMugshotID(row.MugshotID); GetSingleData(row.MugshotID); setStatesChangeStatus(false); setChangesStatus(false); setErrors({ ...errors, 'EyeColorIDErrors': '', 'WeightErrors': '', 'HeightErrors': '', 'HairColorIDErrors': '', });
    }

    const Add_MugShorts = () => {
        const formdata = new FormData();
        const {
            EyeColorID, HairColorID, HairShadeID, Weight, Height, Complexion, HairLengthID, HairStyleID, BodyBuildTypeID,
            FrontMugshot, LeftMugshot, RightMugshot, EnterMugshot
        } = value;
        const val = {
            ArrestID: DecArrestId, EyeColorID, Weight, Height, HairColorID, HairStyleID, HairLengthID,
            HairShadeID, BodyBuildTypeID, Complexion, CreatedByUserFK: loginPinID
        };
        const objectAsString = JSON.stringify(val);
        const finalDataString = JSON.stringify([objectAsString]);
        formdata.append("Data", finalDataString);
        if (FrontMugshot) formdata.append("FrontImage", FrontMugshot);
        if (LeftMugshot) formdata.append("LeftImage", LeftMugshot);
        if (RightMugshot) formdata.append("RightImage", RightMugshot);
        if (EnterMugshot) formdata.append("EnterImage", EnterMugshot);
        AddDelete_Img('Mugshots/Insert_Mugshots', formdata).then((res) => {
            GetData_Mugshots_Data(DecArrestId);
            setChangesStatus(false); setStatesChangeStatus(false); get_Arrest_Count(DecArrestId);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            reset(); setErrors({ ...errors, 'EyeColorIDErrors': '' });
        });
    };

    const update_MugShorts = () => {
        const formdata = new FormData();
        const {
            MugshotID, EyeColorID, HairColorID, HairShadeID, Weight, Height, Complexion, HairLengthID, HairStyleID, BodyBuildTypeID,
            FrontMugshot, LeftMugshot, RightMugshot, EnterMugshot
        } = value;
        const val = {
            MugshotID: MugshotID, ArrestID: DecArrestId, EyeColorID, Weight, Height, HairColorID, HairStyleID, HairLengthID,
            HairShadeID, BodyBuildTypeID, Complexion, ModifiedByUserFK: loginPinID
        };
        const objectAsString = JSON.stringify(val);
        const finalDataString = JSON.stringify([objectAsString]);
        formdata.append("Data", finalDataString);
        if (FrontMugshot) formdata.append("FrontImage", FrontMugshot);
        if (LeftMugshot) formdata.append("LeftImage", LeftMugshot);
        if (RightMugshot) formdata.append("RightImage", RightMugshot);
        if (EnterMugshot) formdata.append("EnterImage", EnterMugshot);
        AddDelete_Img('Mugshots/Update_Mugshots', formdata).then((res) => {
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message); get_Arrest_Count(DecArrestId);
            setChangesStatus(false); setStatesChangeStatus(false); GetData_Mugshots_Data(DecArrestId);
            setErrors({ ...errors, 'EyeColorIDErrors': '', }); reset(); setStatus(false);
        });

    }

    const Delete_MugShorts = (ImageName) => {
        const val = {
            'MugshotID': MugshotID, 'DeletedByUserFK': loginPinID, 'ImageName': ImageName,
        }
        AddDeleteUpadate('Mugshots/Delete_Mugshots', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message); setChangesStatus(false);
                setStatus(false); reset(); GetData_Mugshots_Data(DecArrestId); get_Arrest_Count(DecArrestId);
            } else { console.log("Somthing Wrong"); }
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const customStylesWithOutColor = {
        control: base => ({
            ...base, height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const handleUpload = (name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) { setValue(prev => ({ ...prev, [name]: file })); }
        };
        input.click();
    };

    const handleRemove = (name) => {
        const imageFieldMap = {
            FrontMugshot: 'FrontImage',
            LeftMugshot: 'LeftImage',
            RightMugshot: 'RightImage',
            EnterMugshot: 'EnterImage',
        };
        const imageFieldName = imageFieldMap[name];
        if (!imageFieldName) {
            console.warn(`Unknown image field for name: ${name}`);
            return;
        }
        // Call delete API
        Delete_MugShorts(imageFieldName);
        // Clear from local state
        setValue(prev => ({ ...prev, [name]: null }));
    };

    return (
        <>
            {/* <NameListing  {...{ ListData }} /> */}
            <div className="col-md-12 mt-1">
                <div className="row align-items-center" style={{ rowGap: "8px" }}>
                    <div className="col-3 col-md-3 col-lg-1 ">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Color')
                        }} data-target="#ListModel" className='new-link'>
                            Eye Color{errors.EyeColorIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EyeColorIDErrors}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 " >
                        <Select
                            name="EyeColorID"
                            styles={Requiredcolour}
                            value={eyeColorDrpData?.filter((obj) => obj.value === value?.EyeColorID)}
                            options={eyeColorDrpData}
                            onChange={(e) => ChangeDropDown(e, 'EyeColorID')}
                            isClearable
                            placeholder="Select..."
                            menuPlacement="bottom"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1 ">
                        <label htmlFor="" className='label-name mb-0'>Weight{errors.WeightErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WeightErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field mt-0">
                        <input type="text" className='requiredColor' maxLength={10} value={value?.Weight} onChange={handleChange} name='Weight' required />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <label htmlFor="" className='label-name mb-0 '>Height{errors.HeightErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HeightErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field mt-0">
                        <input type="text" className='requiredColor' maxLength={10} value={value?.Height} onChange={handleChange} name='Height' required />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Color')
                        }} data-target="#ListModel" className='new-link'>
                            Hair color{errors.HairColorIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HairColorIDErrors}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3" >
                        <Select
                            name="HairColorID"
                            styles={Requiredcolour}
                            value={hairColorDrpData?.filter((obj) => obj.value === value?.HairColorID)}
                            options={hairColorDrpData}
                            onChange={(e) => ChangeDropDown(e, 'HairColorID')}
                            isClearable
                            placeholder="Select..."
                            menuPlacement="bottom"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Complexion Type')
                        }} data-target="#ListModel" className='new-link'>
                            Complexion
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3" >
                        <Select
                            name="Complexion"
                            styles={customStylesWithOutColor}
                            value={ComplexionColoIDDrp?.filter((obj) => obj.value === value?.Complexion)}
                            options={ComplexionColoIDDrp}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'Complexion')}
                            placeholder="Select Complexion"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Style')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Style
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 " >
                        <Select
                            name="HairStyleID"
                            styles={customStylesWithOutColor}
                            value={HairStyleIDDrp?.filter((obj) => obj.value === value?.HairStyleID)}
                            options={HairStyleIDDrp}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairStyleID')}
                            placeholder="Select Hair Style"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Shade')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Shades
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3" >
                        <Select
                            name="HairShadeID"
                            styles={customStylesWithOutColor}
                            value={HairShadeIDDrp?.filter((obj) => obj.value === value?.HairShadeID)}
                            options={HairShadeIDDrp}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairShadeID')}
                            placeholder="Select Hair Shade"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Length')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Length
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1" >
                        <Select
                            name="HairLengthID"
                            styles={customStylesWithOutColor}
                            value={HairLengthIDDrp?.filter((obj) => obj.value === value?.HairLengthID)}
                            options={HairLengthIDDrp}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairLengthID')}
                            placeholder="Select Hair Length"
                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Body Build')
                        }} data-target="#ListModel" className='new-link'>
                            Body Build Type
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3" >
                        <Select
                            name="BodyBuildTypeID"
                            styles={customStylesWithOutColor}
                            value={BodyBuildIDDrp?.filter((obj) => obj.value === value?.BodyBuildTypeID)}
                            options={BodyBuildIDDrp}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'BodyBuildTypeID')}
                            placeholder="Select Body Build"
                        />
                    </div>
                </div>

                <div className="col-md-12 mt-2">
                    <div className="row">
                        {[
                            { label: 'Front', name: 'FrontMugshot' },
                            { label: 'Left', name: 'LeftMugshot' },
                            { label: 'Right', name: 'RightMugshot' },
                            // { label: 'Enter', name: 'EnterMugshot' },
                        ].map((item, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex align-items-stretch" >
                                <div className="card shadow-sm w-100 border-0">
                                    <div className="card-body text-center d-flex flex-column">
                                        <label className="fw-bold mb-2">{item.label}</label>
                                        <div className="mugshot-preview flex-grow-1 mb-3 d-flex align-items-center justify-content-center">
                                            {value[item.name] ? (
                                                <img src={typeof value[item.name] === 'string' ? value[item.name] : URL.createObjectURL(value[item.name])
                                                } alt={`${item.label} preview`} className="img-fluid rounded mugshot-img" />
                                            ) : (<span className="text-muted">{item.label} Mugshot preview</span>)}
                                        </div>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button type="button" className="btn btn-primary btn-sm mr-2" onClick={() => handleUpload(item.name)} > Upload  </button>
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(item.name)}
                                            > Remove </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="btn-box text-right mr-1 mb-2 mt-3">
                    <button type="button" onClick={setStatusFalse}
                        className="btn btn-sm btn-success mr-1" >New</button>
                    {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={Add_MugShorts}>Save</button> */}
                    {
                        status ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                            :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Add Mughshot</button>
                    }
                </div>
            </div >
            <div className="col-12 mt-3 modal-table">
                <DataTable
                    dense
                    columns={columns}
                    data={warrentTypeData}
                    pagination
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='200px'
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={Delete_MugShorts} />
            <ChangesModal func={check_Validation_Error} />
            <ListModal {...{ openPage, setOpenPage }} />
        </>
    )
}
export default MugShorts
