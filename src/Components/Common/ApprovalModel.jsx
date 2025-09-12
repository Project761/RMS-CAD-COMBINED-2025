import React, { useEffect, useState } from 'react'
import SelectBox from '../Common/SelectBox';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/api';
import { changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name } from './Utility';
import { useDispatch } from 'react-redux';
import { AddDeleteUpadate, fetchPostData } from '../hooks/Api';
import { toastifySuccess } from './AlertMsg';

const ApprovalModal = (props) => {

    const dispatch = useDispatch()

    const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { incidentID, narrativeID, status, } = props

    console.log(incidentID, narrativeID, status,)

    const [multiSelected, setMultiSelected] = useState({ optionSelected: null })
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [selectedOption, setSelectedOption] = useState("Individual");
    const [loginPinID, setLoginPinID] = useState();


    const [value, setValue] = useState({
        'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': '', 'CreatedByUserFK': '', 'IsReject': '', 'Comments': '', 'status': status
    })
    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
        'DocumentAccessIDError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    const colourStylesUser = {
        control: (styles) =>
        ({
            ...styles, backgroundColor: "#fce9bf",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    useEffect(() => {
        if (loginAgencyID) {
            get_Group_List(loginAgencyID);
        }
    }, [loginAgencyID]);


    const get_Group_List = (loginAgencyID) => {
        const value = { AgencyId: loginAgencyID }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) { setValue({ ...value, ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID) }) }
            }
            else { setGroupList() }
        })
    }

    const Add_Approval = async (id) => {
        const { ApprovingSupervisorID, status } = value;
        const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
        const val = {
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': '', 'CreatedByUserFK': loginPinID, 'IsReject': '', 'Comments': '', 'status': status
        };

        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    reset();

                } else {
                    console.log("something Wrong");
                }
            }).catch(err => console.log(err));
    }

    const reset = () => {
        setValue({
            ...value,
            'IncidentId': '', 'NarrativeID': '', 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': '', 'CreatedByUserFK': '', 'IsReject': '', 'Comments': '', 'status': status
        });
        setMultiSelected({ optionSelected: ' ' });

    }

    const Agencychange = (multiSelected) => {
        setStatesChangeStatus(true)
        setMultiSelected({ optionSelected: multiSelected });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
            setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
        }
    }

    const handleRadioChange = (e) => {
        const selectedValue = e.target.id;
        setSelectedOption(selectedValue);

        if (selectedValue === "Group") {
            setMultiSelected({ optionSelected: [] });
        }
        if (selectedValue === "Individual") {
            setMultiSelected({ optionSelected: [] });
        }
    };

    return (
        <div className="modal fade" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="ApprovalModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-end align-items-center p-3 border-bottoms">
                        <button
                            type="button"
                            className="btn-close btsn-sm"
                            data-dismiss="modal"
                            aria-label="Close"
                        >✕</button>
                    </div>
                    <div className="box text-center ">
                        <div className="row mt-3">
                            <div className="col-12 col-md-12 col-lg-12">
                                <fieldset>

                                    <div className="row justify-content-center">
                                        <div className="col-1 col-md-1 col-lg-1 mt-2 pt-1"></div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="Individual"
                                                    checked={selectedOption === "Individual"}
                                                    onChange={handleRadioChange}
                                                />
                                                <label className="form-check-label" htmlFor="Individual">
                                                    Individual
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="flexRadioDefault"
                                                    id="Group"
                                                    checked={selectedOption === "Group"}
                                                    onChange={handleRadioChange}
                                                />
                                                <label className="form-check-label" htmlFor="Group">
                                                    Group
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            {selectedOption === "Individual" ? (
                                <>
                                    <div className="col-2 col-md-2 col-lg-3 mt-3 pt-1">
                                        <span htmlFor="" className='label-name '>User Name{errors.DocumentAccessIDError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentAccessIDError}</p>
                                        ) : null}</span>
                                    </div>
                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box">
                                        <SelectBox
                                            className="custom-multiselect"
                                            classNamePrefix="custom"
                                            options={reportApproveOfficer}
                                            isMulti
                                            styles={colourStylesUser}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            onChange={Agencychange}
                                            allowSelectAll={true}
                                            value={multiSelected.optionSelected}
                                        />
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="col-2 col-md-2 col-lg-3 mt-3 pt-1">
                                        <span htmlFor="" className='label-name '> Group{errors.DocumentAccessIDError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DocumentAccessIDError}</p>
                                        ) : null}</span>
                                    </div>
                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box">
                                        <SelectBox
                                            className="custom-multiselect"
                                            classNamePrefix="custom"
                                            options={groupList}
                                            isMulti
                                            styles={colourStylesUser}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            onChange={Agencychange}
                                            allowSelectAll={true}
                                            value={multiSelected.optionSelected}
                                        />
                                    </div>
                                    <div className=" col-1 col-md-1 col-lg-3 btn-box mt-3 pt-1 ">
                                        
                                    </div>
                                </>
                            )}

                        </div>
                        <button type="button" disabled={!statesChangeStatus}
                            className="btn btn-sm text-white ml-2 mt-4 mb-3" onClick={(e) => { Add_Approval(); }} style={{ background: "#ef233c" }} data-dismiss="modal">Submit</button>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default ApprovalModal;
