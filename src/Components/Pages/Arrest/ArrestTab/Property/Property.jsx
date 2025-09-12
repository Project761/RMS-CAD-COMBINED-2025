import { useContext, useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { components } from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Property = (props) => {

    const { DecArrestId, DecIncID } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { get_Arrest_Count } = useContext(AgencyContext);

    const SelectedValue = useRef();
    const [propertyDrp, setPropertyDrp] = useState();
    const [propertyEditVal, setPropertyEditVal] = useState();
    const [value, setValue] = useState()
    const [arrestID, setArrestID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [incidentID, setIncidentID] = useState('');

    const [multiSelected, setMultiSelected] = useState({
        PropertyID: null,
    })


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A069", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecArrestId) {
            setArrestID(DecArrestId); setIncidentID(DecIncID);
        }
    }, [DecArrestId]);

    useEffect(() => {
        if (incidentID) {
            get_Property_DropDown(incidentID);
        }
    }, [incidentID])

    useEffect(() => {
        if (loginPinID) {
            setValue({ ...value, 'ArrestID': DecArrestId, 'CreatedByUserFK': loginPinID, })
        }
    }, [DecArrestId, loginPinID]);

    useEffect(() => {
        if (DecArrestId) { get_Property_Data(DecArrestId); }
    }, [DecArrestId])

    const MultiValue = props => (
        <components.MultiValue {...props}>
            <span>{props.data.label}</span>
        </components.MultiValue>
    );

    useEffect(() => {
        if (propertyEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['PropertyID']: propertyEditVal } }) }
    }, [propertyEditVal])

    const get_Property_Data = (arrestID) => {
        const val = {
            'ArrestID': arrestID,
        }
        fetchPostData('ArrestProperty/GetData_ArrestProperty', val).then((res) => {
            if (res) {
                setPropertyEditVal(Comman_changeArrayFormat(res, 'ArrestPropertyID', 'ArrestID', 'PretendToBeID', 'PropertyID', 'Description'));
            } else {
                setPropertyEditVal([]);
            }
        })
    }

    const get_Property_DropDown = (incidentID) => {
        const val = {
            'IncidentID': incidentID,
        }
        fetchPostData('ArrestProperty/GetData_InsertArrestProperty', val).then((data) => {
            if (data) {
                setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'Description',))
            } else {
                setPropertyDrp([])
            }
        })
    }

    const Property = (multiSelected) => {
        setMultiSelected({
            ...multiSelected,
            PropertyID: multiSelected
        })
        const len = multiSelected.length - 1
        if (multiSelected?.length < propertyEditVal?.length) {
            let missing = null;
            let i = propertyEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(propertyEditVal[--i])) ? missing : propertyEditVal[i];
            }
            DelSertBasicInfo(missing.value, 'ArrestPropertyID', 'ArrestProperty/Delete_ArrestProperty')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'PropertyID', 'ArrestProperty/Insert_ArrestProperty')
        }
    }

    const InSertBasicInfo = (id, col1, url) => {
        const val = {
            'ArrestID': arrestID,
            [col1]: id,
            'CreatedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'PropertyID' && get_Property_Data(DecArrestId); get_Property_DropDown(incidentID); get_Arrest_Count(arrestID)
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const DelSertBasicInfo = (ArrestPropertyID, col1, url) => {
        const val = {
            [col1]: ArrestPropertyID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'ArrestPropertyID' && get_Property_Data(arrestID); get_Property_DropDown(incidentID); get_Arrest_Count(arrestID)
            } else {
                console.log("Somthing Wrong");
            }
        })
    }
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return (
        <>
            <div className="col-12 " id='display-not-form'>
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>Property</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-11 mt-2" >
                        <Select
                            options={propertyDrp}
                            isClearable={false}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            className="basic-multi-select"
                            isMulti
                            styles={customStylesWithOutColor}
                            components={{ MultiValue, }}
                            onChange={(e) => Property(e)}
                            value={multiSelected.PropertyID}
                            name='PropertyID'
                            noDataComponent={'There are no data to display'}
                        />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Property
