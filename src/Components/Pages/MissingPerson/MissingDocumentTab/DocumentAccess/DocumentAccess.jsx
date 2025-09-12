import { useContext, useEffect, useState } from 'react';
import SelectBox from '../../../../Common/SelectBox';
import { components } from 'react-select';
import { base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { toastifySuccess } from '../../../../Common/AlertMsg';



const DocumentAccess = ({ DecdocumentID }) => {
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const [selectedOption, setSelectedOption] = useState('Individual');
    const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
    const [EditValue, setEditValue] = useState([]);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return { get: (param) => params.get(param) };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var documentID = query?.get("documentId");

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const [groupList, setGroupList] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [groupSelected, setGroupSelected] = useState([]);

    const [value, setValue] = useState({
        AgencyID: '',
        DocumentID: '',
        GroupName: '',
        DocumentAccessID: '',
        DocumentAccess: '',
        DocumentName: '',
        DocumentTypeID: '',
        DocumentNotes: ''
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(parseInt(localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            get_Group_List(loginAgencyID);
        }
    }, [loginAgencyID]);

    const get_Group_List = (loginAgencyID) => {
        const value = { AgencyId: loginAgencyID };
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'));
                if (res[0]?.GroupID) {
                    setValue((prev) => ({
                        ...prev,
                        GroupName: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID)
                    }));
                }
            }
        });
    };

    const Agencychange = (multiSelected) => {
        setMultiSelected({ optionSelected: multiSelected });
        const id = multiSelected ? multiSelected.map(item => item.value) : [];
        const name = multiSelected ? multiSelected.map(item => item.label) : [];
        setValue((prev) => ({
            ...prev,
            DocumentAccessID: id.toString(),
            DocumentAccess_Name: name.toString()
        }));
    };

    useEffect(() => {
        if (DecdocumentID) {
            GetSingleData(DecdocumentID);
        }
    }, [DecdocumentID]);

    const GetSingleData = (DecdocumentID) => {
        const val = { DocumentID: DecdocumentID };
        fetchPostData('IncidentDocumentManagement/GetSingleData_IncidentDocManagement', val)
            .then((res) => {
                if (res) {
                    setEditValue(res);
                }
            });
    };

    useEffect(() => {
        if (EditValue?.length > 0) {
            const accessIDs = EditValue[0]?.DocumentAccessID?.split(',').map(id => parseInt(id));
            setValue((prev) => ({
                ...prev,
                DocumentID: EditValue[0]?.documentID,
                DocumentAccess: EditValue[0]?.DocumentAccess,
                DocumentAccessID: EditValue[0]?.DocumentAccessID,
                ModifiedByUserFK: loginPinID,
                DocumentAccess_Name: EditValue[0]?.DocumentAccess_Name,
                DocumentName: EditValue[0]?.DocumentName,
                DocumentTypeID: EditValue[0]?.DocumentTypeID,
                DocumentNotes: EditValue[0]?.DocumentNotes
            }));
            const initialSelectedOptions = (EditValue[0]?.DocumentAccess === 'Group' ? groupList : agencyOfficerDrpData)
                .filter(option => accessIDs?.includes(option.value));
            setMultiSelected({ optionSelected: initialSelectedOptions });
            setSelectedOption(EditValue[0]?.DocumentAccess);
        }
    }, [EditValue, agencyOfficerDrpData, groupList]);

    const handleUpdate = async () => {
        const payload = {
            DocumentID: DecdocumentID,

            DocumentAccessID: value.DocumentAccessID,
            DocumentAccess: selectedOption,
            ModifiedByUserFK: loginPinID
        };
        try {
            const res = await AddDeleteUpadate('IncidentDocumentManagement/Update_IncidentDocManagement', payload);
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Group_List(loginAgencyID); GetSingleData(DecdocumentID);
            }
        } catch (error) {

        }
    };

    const handleRadioChange = (e) => {
        const selectedValue = e.target.id;
        if (selectedValue === 'Group') {
            setMultiSelected({ optionSelected: [] });
            setGroupSelected(multiSelected.optionSelected);
        } else if (selectedValue === 'Individual') {
            setMultiSelected({ optionSelected: groupSelected });
        }

        setSelectedOption(selectedValue);
    };


    return (
        <div className="row mt-3">
            <div className="col-12">
                <fieldset>
                    <legend>Document Access</legend>
                    <div className="row">
                        <div className="col-4 mt-2 pt-1">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="Individual"
                                    checked={selectedOption === 'Individual'}
                                    onChange={handleRadioChange}

                                />
                                <label className="form-check-label" htmlFor="Individual">Individual</label>
                            </div>
                        </div>
                        <div className="col-4 mt-2 pt-1">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="Group"
                                    onChange={handleRadioChange}
                                    checked={selectedOption === 'Group'}

                                />
                                <label className="form-check-label" htmlFor="Group">Group</label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {selectedOption === 'Individual' ? (
                    <>
                        <div className='row'>
                            <div className='col-6'>
                                <SelectBox
                                    options={agencyOfficerDrpData}
                                    isMulti
                                    onChange={Agencychange}
                                    value={multiSelected.optionSelected}
                                />

                            </div>

                            <div className="col-lg-2">
                                <button type="button" className="btn btn-success mb-2" onClick={handleUpdate}>Update</button>
                            </div>
                        </div>

                    </>
                ) : (
                    <>
                        <div className='row'>
                            <div className='col-6'>
                                <SelectBox
                                    options={groupList}
                                    isMulti
                                    onChange={Agencychange}
                                    value={multiSelected.optionSelected}
                                />

                            </div>
                            <div className="col-lg-2">
                                <button type="button" className="btn btn-success" onClick={handleUpdate}>Update</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DocumentAccess;
