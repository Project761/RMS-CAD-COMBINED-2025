import { useContext, useState, useEffect } from 'react'
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat, typeofsecurityArray } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { components } from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const CriminalActivity = (props) => {

  const { DecArrestId, } = props
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const { get_Arrest_Count, } = useContext(AgencyContext);
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [typeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [arrestID, setArrestID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [value, setValue] = useState({
    'CriminalID': '',
    'ArrestID': '',
    'ArrestCriminalActivityID': '',
    'CreatedByUserFK': '',
  })

  const [multiSelected, setMultiSelected] = useState({
    CriminalID: null,
  })


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (DecArrestId) {
      setValue({
        ...value,
        'ArrestID': DecArrestId, 'CreatedByUserFK': loginPinID,

      })
      get_Security_Data(DecArrestId); setArrestID(DecArrestId);
    }
  }, [DecArrestId]);


  useEffect(() => {
    if (arrestID) { get_Security_Data(arrestID); }
  }, [arrestID])

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['CriminalID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])


  const typeofsecurity = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      CriminalID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'ArrestCriminalActivityID', 'ArrestCriminalActivity/Delete_ArrestCriminalActivity')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'CriminalID', 'ArrestCriminalActivity/Insert_ArrestCriminalActivity')
    }
  }


  useEffect(() => {
    if (arrestID) {
      get_Security_DropDown(arrestID);
    }
  }, [arrestID])

  const get_Security_Data = (arrestID) => {
    const val = {
      'ArrestID': arrestID,
    }
    fetchPostData('ArrestCriminalActivity/GetData_ArrestCriminalActivity', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(typeofsecurityArray(res, 'CriminalID', 'ArrestID', 'PretendToBeID', 'ArrestCriminalActivityID', 'CriminalActivity_Description'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }
  //--------Security_fetchData----------//
  const get_Security_DropDown = (arrestID) => {
    const val = {
      'ArrestID': arrestID,
    }
    fetchPostData('ArrestCriminalActivity/GetData_InsertArrestCriminalActivity', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(Comman_changeArrayFormat(data, 'CriminalActivityID', 'Description',));
      }
      else {
        setTypeOfSecurityList([])
      }
    })
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
        get_Arrest_Count(arrestID)
        col1 === 'CriminalID' && get_Security_Data(arrestID);
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (ArrestCriminalActivityID, col1, url) => {
    const val = {
      [col1]: ArrestCriminalActivityID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Arrest_Count(arrestID)
        col1 === 'ArrestCriminalActivityID' && get_Security_Data(arrestID)
      }
    })
  }

  function filterArray(arr, key) {
    return [...new Map(arr?.map(item => [item[key], item])).values()]
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

      <div className="col-12 ">
        <div className="row mt-1">
          <div className="col-2 col-md-2 col-lg-2 mt-4">
            <label htmlFor="" className='new-label'> Criminal Activity </label>
          </div>
          <div className="col-7 col-md-7 col-lg-5 mt-2 mb-2">
            {
              value?.CriminalIDName ?
                <Select
                  className="basic-multi-SelectBox"
                  isMulti
                  name='CriminalID'
                  isClearable={false}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList}
                  onChange={(e) => typeofsecurity(e)}
                  value={filterArray(multiSelected.CriminalID, 'label')}
                  components={{ MultiValue, }}
                  placeholder="Select Type Of Criminal Activity From List"
                  styles={customStylesWithOutColor}
                />
                :
                <Select
                  className="basic-multi-select"
                  isMulti
                  name='CriminalID'
                  isClearable={false}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList}
                  onChange={(e) => typeofsecurity(e)}
                  value={filterArray(multiSelected.CriminalID, 'label')}
                  placeholder="Select Type Of Criminal Activity From List"
                  components={{ MultiValue, }}
                  styles={customStylesWithOutColor}

                />
            }
          </div>
        </div>
      </div>

    </>
  )
}

export default CriminalActivity

