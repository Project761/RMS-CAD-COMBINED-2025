import {  useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { threeColArrayWithCode, typeofsecurityArray } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, base64ToString, } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { components } from "react-select";
import SelectBox from '../../../../Common/SelectBox';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ListModal from '../../../Utility/ListManagementModel/ListModal';

const TypeOfSecurity = () => {

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [cursorDisabled, setCursorDisabled] = useState(false);

  const { get_IncidentTab_Count, } = useContext(AgencyContext);
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [typeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [openPage, setOpenPage] = useState('');

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [value, setValue] = useState({
    'SecurityId': '', 'SecurityIdName': '', 'IncidentSecurityID': '',
    'ModifiedByUserFK': '', 'IncidentId': '', 'CreatedByUserFK': '',
  })

  const [multiSelected, setMultiSelected] = useState({
    securityID: null,
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); get_Security_DropDown(localStoreData?.AgencyID);
      setValue({ ...value, 'CreatedByUserFK': localStoreData?.PINID });
    }
  }, [localStoreData]);


  useEffect(() => {
    if (openPage || loginAgencyID) {
      get_Security_DropDown(loginAgencyID);
    }
  }, [loginAgencyID, openPage]);

  useEffect(() => {
    if (IncID) {
      setValue({ ...value, 'IncidentId': IncID, 'CreatedByUserFK': loginPinID }); setIncidentID(IncID); get_Security_Data(IncID);
    } else { }
  }, [IncID]);

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['securityID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])

  const typeofsecurity = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      securityID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'IncidentSecurityID', 'TypeOfSecurity/DeleteTypeOfSecurity')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'SecurityId', 'TypeOfSecurity/InsertTypeOfSecurity')
    }
  }

  const get_Security_Data = (incidentID) => {
    const val = { 'IncidentId': incidentID, }
    fetchPostData('TypeOfSecurity/GetDataTypeOfSecurity', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(typeofsecurityArray(res, 'SecurityId', 'IncidentID', 'PretendToBeID', 'IncidentSecurityID', 'Security_Description'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  //--------Security_fetchData----------//
  const get_Security_DropDown = (loginAgencyID) => {
    const val = { 'AgencyID': loginAgencyID }
    fetchPostData('TypeOfSecurity/GetData_InsertTypeOfSceurity', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(threeColArrayWithCode(data, 'SecurityId', 'Description', 'SecurityCode'));
      }
      else {
        setTypeOfSecurityList([])
      }
    })
  }

  const InSertBasicInfo = (id, col1, url) => {
    setCursorDisabled(true)
    const val = {
      'IncidentId': incidentID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_IncidentTab_Count(incidentID, loginPinID);
        col1 === 'SecurityId' && get_Security_Data(IncID);
        setCursorDisabled(false)
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (IncidentSecurityID, col1, url) => {
    const val = {
      [col1]: IncidentSecurityID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_IncidentTab_Count(incidentID, loginPinID);
        col1 === 'IncidentSecurityID' && get_Security_Data(IncID)
      } else {
        console.log("res");
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

  
  function filterArray(arr, key) {
    return [...new Map(arr?.map(item => [item[key], item])).values()]
  }



  return (
    <>
      <div className="col-12 ">
        <div className="row mt-1">
          <div className="col-2 col-md-2 col-lg-2 mt-4">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Incident Security')
            }} data-target="#ListModel" className='new-link'>
              Type Of Security
            </span>
          </div>
          <div className="col-7 col-md-7 col-lg-5 mt-2 mb-2" style={{ cursor: cursorDisabled ? 'not-allowed' : '' }}>
            <SelectBox
              className="basic-multi-select"
              isMulti
              name='SecurityId'
              isClearable={false}
              closeMenuOnSelect={false}
              hideSelectedOptions={true}
              options={typeOfSecurityList}
              onChange={(e) => typeofsecurity(e)}
              value={filterArray(multiSelected.securityID, 'label')}
              placeholder="Select Type Of Security From List.."
              components={{ MultiValue, }}
              styles={customStylesWithOutColor}
              pagination
              paginationPerPage={'100'}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              showPaginationBottom={100}
            />

          </div>
        </div>
      </div>
      <ListModal {...{ openPage, setOpenPage }} />

    </>
  )
}

export default TypeOfSecurity

